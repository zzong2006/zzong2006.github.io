import { execFileSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

export const manifest = {
  name: "note-dates",
  displayName: "Stable Note Dates",
  version: "1.0.0",
  description: "Dates from explicit frontmatter or Git history, never checkout time.",
  category: "transformer",
  defaultOrder: 10,
}

// 저장소 루트의 이 파일에 적힌 커밋은 노트를 고친 것으로 치지 않는다.
// 링크 교체·빈 절 삭제처럼 노트 수백 개를 한꺼번에 건드린 정리 작업을 적는다.
export const IGNORE_REVS_FILE = ".note-dates-ignore-revs"

// .git-blame-ignore-revs 와 같은 형식이다. 한 줄에 커밋 해시 하나, # 뒤는 주석.
export function parseIgnoreRevs(text) {
  return new Set(
    text
      .split("\n")
      .map((line) => line.replace(/#.*/, "").trim().toLowerCase())
      .filter((line) => /^[0-9a-f]{40}$/.test(line)),
  )
}

export function parseHistory(log, ignoredRevs = new Set()) {
  const dates = new Map()
  const tokens = log.split("\0")
  let timestamp
  let ignored = false
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].trim()
    if (token.startsWith("DATE:")) {
      const [date, hash] = token.slice(5).split(" ")
      timestamp = date
      ignored = ignoredRevs.has(hash)
    } else if (/^[AMDTCR]\d*$/.test(token)) {
      const source = tokens[++i]
      const target = /^[RC]/.test(token) ? tokens[++i] : source
      if (token === "D") {
        dates.delete(source)
        continue
      }
      const previous = dates.get(source)
      const added = token === "A" || token.startsWith("C")
      const created = added ? timestamp : (previous?.created ?? timestamp)
      // 내용이 그대로인 이동(R100)과 정리 작업 커밋은 글을 고친 것이 아니라 수정일을 이어받는다.
      const keep = !added && previous && (token === "R100" || ignored)
      const modified = keep ? previous.modified : timestamp
      if (token.startsWith("R")) dates.delete(source)
      dates.set(target, { created, modified })
    }
  }
  return dates
}

export function asDate(value) {
  if (value === undefined || value === null || value === "") return undefined
  // Date-only values are calendar days in the site's timezone, not the build host's.
  const raw =
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? `${value}T00:00:00+09:00`
      : value
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export function resolveDates(frontmatter, history) {
  const created = asDate(frontmatter?.created) ?? asDate(history?.created)
  const modified = asDate(frontmatter?.modified) ?? asDate(history?.modified) ?? created
  return {
    dates: { created, modified, published: asDate(frontmatter?.published) ?? created },
    dateSources: {
      created: asDate(frontmatter?.created) ? "frontmatter" : "git",
      modified: asDate(frontmatter?.modified) ? "frontmatter" : "git",
    },
    defaultDateType: "modified",
  }
}

const cache = new Map()
export const NoteDates = () => ({
  name: "NoteDates",
  markdownPlugins(ctx) {
    const directory = path.resolve(ctx.argv.directory)
    if (!cache.has(directory)) {
      const root = execFileSync("git", ["rev-parse", "--show-toplevel"], {
        cwd: directory,
        encoding: "utf8",
      }).trim()
      // One walk per worker, including renames and first-parent merge changes.
      const log = execFileSync(
        "git",
        ["log", "--first-parent", "--reverse", "--format=DATE:%cI %H", "--name-status", "-z", "-M"],
        { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
      )
      const ignoreFile = path.join(root, IGNORE_REVS_FILE)
      const ignoredRevs = existsSync(ignoreFile)
        ? parseIgnoreRevs(readFileSync(ignoreFile, "utf8"))
        : new Set()
      cache.set(directory, { root, dates: parseHistory(log, ignoredRevs) })
    }
    const { root, dates } = cache.get(directory)
    return [
      () => (_tree, file) => {
        const relative = path.relative(root, file.data.filePath ?? file.path).replace(/\\/g, "/")
        Object.assign(file.data, resolveDates(file.data.frontmatter, dates.get(relative)))
      },
    ]
  },
})
export default NoteDates
