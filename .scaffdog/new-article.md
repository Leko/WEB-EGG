---
name: 'new-article'
message: 'Please enter slug of article.'
root: '.'
# output: 'content/*'
ignore: []
---

# content/blog/{{ input }}/index.md`

```markdown
---
title: XXX
date: '{{ 'new Date().toISOString()' | eval }}'
featuredImage: ./featured-image.png
tags:
  - JavaScript
---
```
