# Zzong's Notes

This repository publishes a curated subset of an Obsidian vault with [Quartz](https://quartz.jzhao.xyz/).

The site is deployed to GitHub Pages from `main` using GitHub Actions.

## Local Development

```powershell
npm ci
npx quartz plugin install --from-config
npm run normalize-frontmatter
npx quartz build --serve
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
