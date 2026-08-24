# 📝 Blog Content Guide

> **Welcome, fellow hacker!** This guide explains how to create stunning blog posts that match the terminal aesthetic.

---

## 🚀 Quick Start

Simply drop a `.md` file in this folder (`src/content/blog/`), and it will automatically appear in the blog section after the next deploy. No configuration needed!

---

## 📋 Frontmatter Configuration

Every blog post starts with optional YAML frontmatter:

```yaml
---
title: Your Epic Post Title
date: 2026.08.24
readTime: 5m
tags: [Security, Web, CTF]
excerpt: A compelling summary that appears on the blog index page.
---
```

### Frontmatter Fields

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `title` | ✅ | File name | The post title (converted from filename if omitted) |
| `date` | ❌ | `2026-01-01` | Publication date (posts sorted newest first) |
| `readTime` | ❌ | Auto-calculated | Estimated reading time (e.g., `5m`, `12m`) |
| `tags` | ❌ | `[]` | Categories for filtering (comma-separated or array) |
| `excerpt` | ❌ | First 160 chars | Short summary for the index page |

---

## ✨ Supported Markdown Features

### 📝 Basic Formatting

```markdown
This is a paragraph with **bold text** and *italic text*.

You can also use __bold__ and _italic_ syntax.
```

**Result:** This is a paragraph with **bold text** and *italic text*.

---

### 🎨 Advanced Formatting

```markdown
~~Struck through text~~ for corrections.

==Highlighted text== for emphasis.

This is H~2~O (subscript).

E=mc^2^ (superscript).
```

**Result:** 
- ~~Struck through text~~
- ==Highlighted text==
- H~2~O
- E=mc^2^

---

### 💻 Code

**Inline Code:**
```markdown
Use `console.log()` for debugging.
```

**Result:** Use `console.log()` for debugging.

**Code Blocks with Syntax Highlighting:**
```markdown
```javascript
function hackThePlanet() {
  console.log("TODO: Actually hack the planet");
  return true;
}
```
```

---

### ⌨️ Keyboard Keys

```markdown
Press kbd:Ctrl: + kbd:C: to open the command palette.
```

**Result:** Press kbd:Ctrl: + kbd:C: to open the command palette.

---

### 📋 Task Lists

```markdown
- [x] Reconnaissance complete
- [x] Vulnerability identified
- [ ] Exploit development
- [ ] Write report
- [ ] Collect bounty
```

**Result:**
- [x] Reconnaissance complete
- [x] Vulnerability identified
- [ ] Exploit development
- [ ] Write report
- [ ] Collect bounty

---

### 📊 Tables

```markdown
| Vulnerability | Severity | CVSS | Status |
|:--------------|:--------:|-----:|--------|
| SQL Injection | Critical | 9.8 | Fixed |
| XSS | High | 7.5 | Open |
| CSRF | Medium | 5.4 | Pending |
```

**Result:**

Vulnerability | Severity | CVSS | Status 
SQL Injection | Critical | 9.8 | Fixed 
XSS | High | 7.5 | Open 
CSRF | Medium | 5.4 | Pending 

---

### 🔗 Links & Images

**Links:**
```markdown
[Visit GitHub](https://github.com)
```

**Result:** [Visit GitHub](https://github.com)

**Images with Captions:**
```markdown
![Architecture Diagram](https://example.com/diagram.png)
```

---

### 📐 Blockquotes

```markdown
> "The only way to do great work is to love what you do."
> — Steve Jobs
```

**Result:**
> "The only way to do great work is to love what you do."
> — Steve Jobs

---

### ➖ Horizontal Dividers

```markdown
---

***

___
```

All three create a beautiful gradient divider line.

---

### 📖 Headings

```markdown
# Main Title (H1)
## Section Title (H2)
### Subsection Title (H3)
```

---

## 🎯 Pro Tips

### 1. **Optimal Read Time Calculation**
If you omit `readTime`, the system estimates it at 180 words per minute.

### 2. **Tag Best Practices**
- Use 2-5 tags per post
- Keep them lowercase: `web security`, `ctf`, `exploit dev`
- Common tags: `Security`, `Web`, `CTF`, `Python`, `BugBounty`, `Research`

### 3. **Excerpt Strategy**
Aim for 100-160 characters. Make it compelling to increase click-through rates!

### 4. **Code Block Languages**
The parser supports syntax highlighting for:
- `javascript` / `typescript`
- `python`
- `bash` / `shell`
- `go`
- `rust`
- `sql`
- `html` / `css`
- And many more!

### 5. **Image Optimization**
- Use descriptive alt text for accessibility
- Recommended width: 1200px max
- Format: WebP preferred, PNG/JPG acceptable

---

## 📁 File Naming Convention

Use descriptive, SEO-friendly filenames:

```
✅ good-examples.md
❌ Post 1.md

✅ advanced-xss-techniques.md
❌ xss.md

✅ how-to-hack-with-python.md
❌ python.md
```

---

## 🚨 Common Mistakes

### ❌ Don't Do This:
```yaml
---
title: My Post
date: 08/24/2026
---
```

### ✅ Do This:
```yaml
---
title: My Post
date: 2026.08.24
---
```

---

## 🎨 Example Post Template

```markdown
---
title: "Advanced SQL Injection Bypass Techniques in 2026"
date: 2026.08.24
readTime: 12m
tags: [SQL Injection, Web Security, WAF Bypass]
excerpt: "Learn how modern WAFs can be bypassed using advanced SQL injection techniques including stacked queries and time-based blind injection."
---

# Introduction

SQL injection remains one of the most critical web application vulnerabilities...

## Background

> "SQL injection is not just a vulnerability—it's an art form." — Anonymous Hacker

### Traditional vs Modern Approaches

| Technique | Detection Rate | Complexity |
|:----------|:--------------:|:----------:|
| Union-based | High | Low |
| Boolean-blind | Medium | Medium |
| Time-based blind | Low | High |

## Exploitation

```sql
' UNION SELECT username, password FROM users--
```

## Conclusion

[Continue reading →](#)
```

---

## 🆘 Need Help?

If you encounter issues:
1. Check that your YAML frontmatter is valid
2. Ensure the file has a `.md` extension
3. Verify the file is in `src/content/blog/`

---

**Happy blogging, and may your exploits always be successful! 🎯**
