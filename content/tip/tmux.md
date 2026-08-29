---
title: "tmux"
tags: tip
aliases: []
---

# Tmux ?

모든 panel 에 동일한 command 보내기

```bash
setw synchronize-panes on
```

모든 윈도우 보기 및 해당 윈도우로 attach

* `tmux ls`
* `tmux attach -t <window index>`

