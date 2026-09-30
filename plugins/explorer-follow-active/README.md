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
