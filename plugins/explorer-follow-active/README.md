# Explorer labels and current page

The explorer uses the first nonempty `aliases` entry shorter than `title`.
If none exists, it keeps the original title. The singular `alias` key is also
supported. Folder names, article titles, and URLs are unchanged.

```yaml
title: Group Sequence Policy Optimization
aliases:
  - GSPO
  - Group Sequence Policy Optimization
```

This displays **GSPO** in the explorer, with the full title available on hover
and to screen readers. Edit aliases in the source vault before syncing content.

The current page has a background, bold label, left marker, and
`aria-current="page"`. The marker follows navigation between notes.

Folders come first, then everything is sorted by its explorer label. Each
folder shows how many notes it holds (subfolders included) at the right edge.

Top-level folders are grouped by topic and shown under Korean names, in the
order set in `../shared/folder-names.js`. A folder missing there keeps its own name
and goes under the last group (기타). Folders and notes are not renamed; only
the explorer's labels and order change.

On a folder page (such as 논문), the explorer keeps the whole tree, highlights
that folder, opens only the folders on the way to it, and scrolls it into view.
