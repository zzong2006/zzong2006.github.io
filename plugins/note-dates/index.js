import { execFileSync } from "node:child_process"
import path from "node:path"

export const manifest = {
  name: "note-dates",
  displayName: "Stable Note Dates",
  version: "1.0.0",
  description: "Dates from explicit frontmatter or Git history, never checkout time.",
  category: "transformer",
  defaultOrder: 10,
}

export function parseHistory(log) {
  const dates = new Map()
  const tokens = log.split("\0")
  let timestamp
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].trim()
    if (token.startsWith("DATE:")) {
      timestamp = token.slice(5)
    } else if (/^[AMDTCR]\d*$/.test(token)) {
      const source = tokens[++i]
      const target = /^[RC]/.test(token) ? tokens[++i] : source
      if (token === "D") {
        dates.delete(source)
        continue
      }
      const previous = dates.get(source)
      const created =
        token === "A" || token.startsWith("C") ? timestamp : (previous?.created ?? timestamp)
      if (token.startsWith("R")) dates.delete(source)
      dates.set(target, { created, modified: timestamp })
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
        ["log", "--first-parent", "--reverse", "--format=DATE:%cI", "--name-status", "-z", "-M"],
        { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
      )
      cache.set(directory, { root, dates: parseHistory(log) })
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
