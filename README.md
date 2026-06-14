# Zzong's Notes

This repository publishes a curated subset of an Obsidian vault with [Quartz](https://quartz.jzhao.xyz/).

The site is deployed to GitHub Pages from `main` using GitHub Actions.

## Local Development

```powershell
npm ci
node quartz/bootstrap-cli.mjs plugin install --from-config
npm run patch-search
npm run normalize-frontmatter
node quartz/bootstrap-cli.mjs build --serve
```

To serve an already-built `public/` directory quickly:

```powershell
npm run preview
```

## Content Policy

Only public technical note folders are copied into `content/`.

Excluded by default:

- `diary/`
- `work/`
- `finance/`
- `.obsidian/`
- other personal or operational folders
