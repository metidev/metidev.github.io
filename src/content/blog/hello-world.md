---
title: Hello World - This Blog Builds Itself
date: 2026.08.23
tags: [Meta, Blogging]
excerpt: Drop a markdown file in src/content/blog and it appears here automatically. No CMS, no database.
---

Drop any `.md` file into `src/content/blog/`, push to `main`, and GitHub Pages rebuilds the site with your post live in this section. That's the entire workflow.

## How it works

- Vite globs every markdown file in `src/content/blog/` at build time
- Frontmatter is parsed for `title`, `date`, `tags`, `readTime` and `excerpt`
- Posts are sorted newest-first automatically

## Frontmatter reference

```yaml
---
title: Your Post Title
date: 2026.08.23
readTime: 5m
tags: [Security, Web]
excerpt: A short summary shown on the index page.
---
```

Everything except `title` is optional — read time is estimated from word count if you omit it.

## What's supported

### Headings

Like the ones above.

### Code blocks

```python
def pwn(target):
    return target.owned()
```

### Lists

- Bullet lists
- Inline `code`
- **Escaped HTML**, so no injection surprises

Every post also gets a permanent share link you can copy or send via the native share sheet on mobile.
