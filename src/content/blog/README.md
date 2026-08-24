# Blog Content

Drop markdown files in this folder and they appear automatically in the blog section after the next deploy.

## Frontmatter (all optional except title)

```yaml
---
title: Your Post Title
date: 2026.08.23
readTime: 5m
tags: [Security, Web]
excerpt: Short summary shown on the index page.
---
```

- `title` — falls back to the file name if omitted
- `date` — posts are sorted newest-first; defaults to `2026.01.01`
- `readTime` — auto-estimated from word count if omitted
- `tags` — comma separated or a YAML-style array
- `excerpt` — first 160 chars of the body if omitted

Supported markdown: headings, paragraphs, bullet lists, fenced code blocks, inline `code`, `**bold**`, `*italic*`, `[links](url)`.
