import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { FormEvent, KeyboardEvent } from "react";
import {
  Terminal,
  Shield,
  Cpu,
  FileText,
  Briefcase,
  FolderCode,
  Mail,
  ExternalLink,
  ChevronRight,
  Wifi,
  Battery,
  Clock,
  Activity,
  Lock,
  Share2,
  Search,
  Check,
  ArrowLeft,
} from "lucide-react";

type TabId = "home" | "resume" | "projects" | "blog" | "contact";

type BlogPost = {
  id: string;
  slug: string;
  date: string;
  title: string;
  readTime: string;
  tags: string[];
  body: string;
  excerpt: string;
  sourcePath?: string;
};

type ParsedFrontmatter = {
  title?: string;
  date?: string;
  readTime?: string;
  tags?: string[];
  excerpt?: string;
};

const Github = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Medium = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M4 7c0-.3-.1-.6-.3-.8L2 4.2V4h5.1l3.9 8 3.9-8H20v.2l-1.7 1.8c-.1.2-.2.4-.2.6v8.6c0 .2.1.4.2.6L20 17.8V18h-5.2v-.2l1.7-1.8c.2-.2.2-.4.2-.6V8.4l-4.4 9h-.6L7.1 8.4v5.9c0 .3.1.5.2.7l1.8 2v.2H4v-.2l1.7-2c.2-.2.3-.4.3-.7V7Z" />
  </svg>
);

const DATA = {
  resume: [
    {
      year: "2024 - Present",
      title: "Senior Security Researcher",
      company: "CyberDyne Systems",
      desc: "Leading red team operations, zero-day vulnerability research, and automated exploit development.",
    },
    {
      year: "2021 - 2024",
      title: "Penetration Tester",
      company: "NullSpace Security",
      desc: "Conducted web application and network infrastructure pentests for Fortune 500 clients. Specialized in CI/CD pipeline vulnerabilities.",
    },
    {
      year: "2018 - 2021",
      title: "Software Engineer",
      company: "GlobalTech Solutions",
      desc: "Developed secure backend microservices using Node.js and Go. Implemented automated security scanning in the SDLC.",
    },
  ],
  skills: [
    { name: "Offensive Security", level: 95 },
    { name: "Reverse Engineering", level: 85 },
    { name: "Python / Go / Bash", level: 90 },
    { name: "Web Exploitation", level: 98 },
    { name: "Cryptography", level: 75 },
    { name: "React / Next.js", level: 80 },
  ],
  projects: [
    {
      title: "GhostLink",
      stack: ["JavaScript", "Encryption", "Diffie–Hellman"],
      desc: "Decentralized, encrypted C2 framework with stealth communication protocols designed for red teaming engagements.",
      link: `${import.meta.env.BASE_URL}projects/sechub.html`,
    },
    {
      title: "Linux DNS Jumper",
      stack: ["Python", "Shell"],
      desc: "this tool provides a user-friendly way to test, sort, and apply DNS server profiles with a single click.",
      link: "https://github.com/metidev/linux-DNS-jumper",
    },
    {
      title: "Param Hunter",
      stack: ["JavaScript", "BugBounty", "Burp Suite"],
      desc: "A professional Chrome extension for discovering every parameter exposed by a website",
      link: "https://github.com/metidev/paramhunter-pro",
    },
    {
      title: "TEXT-WATERMARK",
      stack: ["HTML", "JavaScript", "Web Crypto API"],
      desc: "Steganography engine for embedding hidden watermarks in text using advanced cryptographic techniques.",
      link: `${import.meta.env.BASE_URL}projects/t2h.html`,
    },
  ],
  blog: [
    {
      id: "blog-1",
      date: "2025.10.12",
      title: "Bypassing Modern WAFs using Chunked Encoding",
      readTime: "5m",
      tags: ["WebSec", "WAF", "HTTP"],
      body: "This is a fallback blog entry. Add markdown files to src/content/blog to populate the blog automatically.",
      excerpt: "Fallback entry",
    },
    {
      id: "blog-2",
      date: "2025.08.04",
      title: "Zero-Click RCE in Smart Home Devices",
      readTime: "8m",
      tags: ["IoT", "Zero-Day", "RCE"],
      body: "This is a fallback blog entry. Add markdown files to src/content/blog to populate the blog automatically.",
      excerpt: "Fallback entry",
    },
    {
      id: "blog-3",
      date: "2025.05.21",
      title: "Building a Custom Fuzzer in Rust",
      readTime: "12m",
      tags: ["Rust", "Fuzzing", "DevSecOps"],
      body: "This is a fallback blog entry. Add markdown files to src/content/blog to populate the blog automatically.",
      excerpt: "Fallback entry",
    },
    {
      id: "blog-4",
      date: "2025.02.10",
      title: "The Anatomy of a Supply Chain Attack",
      readTime: "6m",
      tags: ["OpSec", "SupplyChain"],
      body: "This is a fallback blog entry. Add markdown files to src/content/blog to populate the blog automatically.",
      excerpt: "Fallback entry",
    },
  ],
};

const pad = (n: number) => String(n).padStart(2, "0");

const formatClock = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const escapeHtml = (input: string) =>
  input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const renderInline = (escaped: string) =>
  escaped
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/_([^_]+)_/g, "<em>$1</em>")
    .replace(/~~([^~]+)~~/g, '<del>$1</del>')
    .replace(/==([^=]+)==/g, '<mark>$1</mark>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g, '<img src="$2" alt="$1" class="post-image" loading="lazy" />')
    .replace(/\^([^^]+)\^/g, '<sup>$1</sup>')
    .replace(/~([^~]+)~/g, '<sub>$1</sub>')
    .replace(/kbd:([^:]+):/g, '<kbd>$1</kbd>');

const estimateReadTime = (text: string) => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 180))}m`;
};

const parseFrontmatter = (raw: string): { meta: ParsedFrontmatter; body: string } => {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) {
    return { meta: {}, body: raw.trim() };
  }

  const meta: ParsedFrontmatter = {};
  const frontmatter = match[1].split("\n");

  for (const line of frontmatter) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();

    if (key === "tags") {
      const cleaned = value
        .replace(/^\[/, "")
        .replace(/\]$/, "")
        .split(",")
        .map((tag) => tag.trim().replace(/^['"]|['"]$/g, ""))
        .filter(Boolean);
      meta.tags = cleaned;
      continue;
    }

    if (key === "title") meta.title = value.replace(/^['"]|['"]$/g, "");
    if (key === "date") meta.date = value.replace(/^['"]|['"]$/g, "");
    if (key === "readTime") meta.readTime = value.replace(/^['"]|['"]$/g, "");
    if (key === "excerpt") meta.excerpt = value.replace(/^['"]|['"]$/g, "");
  }

  return { meta, body: match[2].trim() };
};

const markdownToHtml = (markdown: string) => {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let quoteLines: string[] = [];
  let codeLines: string[] = [];
  let inCode = false;
  let codeLang = "";
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableAlignments: ("left" | "center" | "right" | "")[] = [];
  let tableRows: string[][] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    const hasTaskItems = listItems.some((item) => /^\[[ x]\]\s/.test(item));

    if (hasTaskItems) {
      html.push(`<ul class="task-list">${listItems.map((item) => {
        const isChecked = item.startsWith("[x]");
        const isUnchecked = item.startsWith("[ ]");
        if (isChecked || isUnchecked) {
          const text = item.replace(/^\[[ x]\]\s/, "");
          return `<li class="task-item"><input type="checkbox" ${isChecked ? "checked" : ""} disabled /> ${renderInline(text)}</li>`;
        }
        return `<li>${renderInline(item)}</li>`;
      }).join("")}</ul>`);
    } else {
      html.push(`<ul>${listItems.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`);
    }
    listItems = [];
  };

  const flushQuote = () => {
    if (!quoteLines.length) return;
    const quoteContent = quoteLines.map((line) => renderInline(escapeHtml(line))).join("<br>");
    html.push(`<blockquote>${quoteContent}</blockquote>`);
    quoteLines = [];
  };

  const flushCode = () => {
    if (!codeLines.length) return;
    const langClass = codeLang ? ` class="language-${escapeHtml(codeLang)}"` : "";
    html.push(`<pre><code${langClass}>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
    codeLines = [];
    codeLang = "";
  };

  const flushTable = () => {
    if (!inTable || tableHeaders.length === 0) return;

    let tableHtml = '<div class="table-wrapper"><table>';

    if (tableHeaders.length > 0) {
      tableHtml += '<thead><tr>';
      tableHeaders.forEach((header, i) => {
        const align = tableAlignments[i] || "";
        const alignAttr = align ? ` style="text-align: ${align}"` : "";
        tableHtml += `<th${alignAttr}>${renderInline(header)}</th>`;
      });
      tableHtml += '</tr></thead>';
    }

    if (tableRows.length > 0) {
      tableHtml += '<tbody>';
      tableRows.forEach((row) => {
        tableHtml += '<tr>';
        row.forEach((cell, i) => {
          const align = tableAlignments[i] || "";
          const alignAttr = align ? ` style="text-align: ${align}"` : "";
          tableHtml += `<td${alignAttr}>${renderInline(cell)}</td>`;
        });
        tableHtml += '</tr>';
      });
      tableHtml += '</tbody>';
    }

    tableHtml += '</table></div>';
    html.push(tableHtml);

    inTable = false;
    tableHeaders = [];
    tableAlignments = [];
    tableRows = [];
  };

  const parseTableCell = (cell: string) => {
    return escapeHtml(cell.trim());
  };

  const parseTableSeparator = (line: string): boolean => {
    const cells = line.split("|").filter((cell) => cell.trim() !== "" || line.startsWith("|") || line.endsWith("|"));
    if (cells.length === 0) return false;

    return cells.every((cell) => {
      const trimmed = cell.trim();
      return /^:?-+:?$/.test(trimmed);
    });
  };

  const getAlignment = (cell: string): "" | "left" | "center" | "right" => {
    const trimmed = cell.trim();
    if (trimmed.startsWith(":") && trimmed.endsWith(":")) return "center";
    if (trimmed.endsWith(":")) return "right";
    if (trimmed.startsWith(":")) return "left";
    return "";
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith("```")) {
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        flushParagraph();
        flushList();
        flushQuote();
        flushTable();
        inCode = true;
        codeLang = line.slice(3).trim();
      }
      continue;
    }

    if (inCode) {
      codeLines.push(rawLine);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      flushQuote();
      if (inTable) {
        flushTable();
      }
      continue;
    }

    if (line.startsWith("# ")) {
      flushParagraph();
      flushList();
      flushQuote();
      flushTable();
      html.push(`<h2>${escapeHtml(line.slice(2).trim())}</h2>`);
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      flushQuote();
      flushTable();
      html.push(`<h3>${escapeHtml(line.slice(3).trim())}</h3>`);
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      flushQuote();
      flushTable();
      html.push(`<h4>${escapeHtml(line.slice(4).trim())}</h4>`);
      continue;
    }

    const listMatch = line.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      flushParagraph();
      flushQuote();
      flushTable();
      listItems.push(escapeHtml(listMatch[1]));
      continue;
    }

    if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      flushTable();
      quoteLines.push(line.slice(2).trim());
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      flushParagraph();
      flushList();
      flushQuote();
      flushTable();
      html.push('<hr class="post-divider" />');
      continue;
    }

    const imageMatch = line.trim().match(/^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)$/);
    if (imageMatch) {
      flushParagraph();
      flushList();
      flushQuote();
      flushTable();
      const alt = escapeHtml(imageMatch[1]);
      const src = imageMatch[2];
      html.push(`<figure class="post-figure"><img src="${src}" alt="${alt}" class="post-image" loading="lazy" />${alt ? `<figcaption>${alt}</figcaption>` : ""}</figure>`);
      continue;
    }

    if (line.includes("|") && !line.startsWith("```")) {
      const cells = line
        .split("|")
        .filter((cell) => cell.trim() !== "" || line.startsWith("|") || line.endsWith("|"))
        .map((cell) => cell.trim());

      if (!inTable) {
        if (cells.length > 1) {
          inTable = true;
          tableHeaders = cells.map(parseTableCell);
          tableAlignments = [];
        }
      } else if (parseTableSeparator(line)) {
        tableAlignments = cells.map(getAlignment);
      } else if (cells.length > 0) {
        tableRows.push(cells.map(parseTableCell));
      }
      continue;
    }

    if (inTable) {
      flushTable();
    }

    flushList();
    flushQuote();
    paragraph.push(escapeHtml(line));
  }

  flushParagraph();
  flushList();
  flushQuote();
  flushTable();
  if (inCode) flushCode();

  return html.join("\n");
};

const markdownModules = import.meta.glob(["./content/blog/*.md", "!./content/blog/README.md"], {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const BLOG_POSTS: BlogPost[] = Object.entries(markdownModules)
  .map(([sourcePath, raw]) => {
    const { meta, body } = parseFrontmatter(raw);
    const fileName = sourcePath.split("/").pop()?.replace(/\.md$/, "") ?? "post";
    const title = meta.title ?? fileName.replace(/[-_]/g, " ");
    const date = meta.date ?? "2026-01-01";
    const readTime = meta.readTime ?? estimateReadTime(body);
    const tags = meta.tags ?? [];
    return {
      id: fileName,
      slug: slugify(title),
      date,
      title,
      readTime,
      tags,
      body,
      excerpt: meta.excerpt ?? body.slice(0, 160),
      sourcePath,
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

const BLOG_INDEX: BlogPost[] = BLOG_POSTS.length
  ? BLOG_POSTS
  : DATA.blog.map((post) => ({
      id: post.id,
      slug: slugify(post.title),
      date: post.date,
      title: post.title,
      readTime: post.readTime,
      tags: post.tags,
      body: post.body,
      excerpt: post.excerpt,
    }));

const TAB_IDS: TabId[] = ["home", "resume", "projects", "blog", "contact"];

const parseHash = (): { tab: TabId; slug: string | null } => {
  const segments = window.location.hash
    .replace(/^#\/?/, "")
    .split("/")
    .filter(Boolean);
  const tab = TAB_IDS.includes(segments[0] as TabId) ? (segments[0] as TabId) : "home";
  return { tab, slug: tab === "blog" && segments[1] ? decodeURIComponent(segments[1]) : null };
};

const getPostUrl = (slug: string) =>
  `${window.location.origin}${import.meta.env.BASE_URL}#/blog/${encodeURIComponent(slug)}`;

type FlagDef = { id: string; enc: string; hint: string };

const FLAG_XOR_KEY = "n3on_c1ty_2099";

const decodeFlag = (enc: string) => {
  try {
    const raw = window.atob(enc);
    let out = "";
    for (let i = 0; i < raw.length; i += 1) {
      out += String.fromCharCode(raw.charCodeAt(i) ^ FLAG_XOR_KEY.charCodeAt(i % FLAG_XOR_KEY.length));
    }
    return out;
  } catch {
    return "";
  }
};

const FLAGS: FlagDef[] = [
  {
    id: "console",
    enc: "KH8uKSQHAgINbwJcSmZfQDAaN1BuH0omTw==",
    hint: "Some signals are only visible through the developer looking glass. Open it.",
  },
  {
    id: "grep",
    enc: "KH8uKSQEQ0cJAF4BUgoxUjAMbxBCCQ==",
    hint: "Secrets leak through files. Search the whole filesystem for them.",
  },
  {
    id: "hack",
    enc: "KH8uKSQTRhomK1oDZkkCBxsIbxFcCQ==",
    hint: "Don't just read the terminal. Attack it.",
  },
];

const flagOf = (id: string) => {
  const def = FLAGS.find((f) => f.id === id);
  return def ? decodeFlag(def.enc) : "";
};

const CTF_KEY = "ctf-found-flags";

const loadFoundFlags = (): string[] => {
  try {
    const raw = window.localStorage.getItem(CTF_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
};

const useCtf = () => {
  const [found, setFound] = useState<string[]>(loadFoundFlags);

  useEffect(() => {
    const sync = () => setFound(loadFoundFlags());
    window.addEventListener("ctf-update", sync);
    return () => window.removeEventListener("ctf-update", sync);
  }, []);

  return found;
};

const registerFlagById = (id: string) => {
  const found = loadFoundFlags();
  if (found.includes(id)) return false;
  try {
    window.localStorage.setItem(CTF_KEY, JSON.stringify([...found, id]));
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new Event("ctf-update"));
  return true;
};

const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [lines, setLines] = useState<string[]>([]);
  const bootText = [
    "BIOS Date 10/24/25 14:32:00 Ver 08.00.15",
    "CPU: Quantum Neural Processor @ 4.2GHz",
    "Memory Test: 65536K OK",
    "Initializing hardware abstractions... [OK]",
    "Loading kernel modules.................... [OK]",
    "Mounting root filesystem................ [OK]",
    "Checking network interfaces............. [OK]",
    "Establishing secure uplink............... [OK]",
    "Decrypting user payload.................. [OK]",
    "System ready. Welcome to the terminal.",
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = window.setInterval(() => {
      setLines((prev) => [...prev, bootText[currentLine]]);
      currentLine += 1;

      if (currentLine >= bootText.length) {
        window.clearInterval(interval);
        window.setTimeout(onComplete, 800);
      }
    }, 150);

    return () => window.clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex flex-col h-screen w-full bg-[#020c14] text-[#67e8f9] p-6 sm:p-8 font-mono text-sm sm:text-base overflow-x-hidden">
      <div className="mb-4 text-glow font-bold text-xl text-center border-b border-[#123f4d] pb-2">
        <Shield className="inline-block mr-2" size={24} />
        SYS_INIT_SEQUENCE
      </div>

      {lines.map((line, i) => (
        <div key={i} className="mb-1 break-words whitespace-pre-wrap">
          <span className="text-gray-500">[{formatClock(new Date())}]</span> {line}
        </div>
      ))}

      <div className="mt-2">
        <span className="cursor-blink">_</span>
      </div>
    </div>
  );
};

const NavigationHUD = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}) => {
  const [time, setTime] = useState(() => formatClock(new Date()));
  const foundFlags = useCtf();

  useEffect(() => {
    const timer = window.setInterval(() => setTime(formatClock(new Date())), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const tabs: Array<{ id: TabId; label: string; icon: typeof Terminal }> = [
    { id: "home", label: "/sys/home", icon: Terminal },
    { id: "resume", label: "/usr/resume", icon: Briefcase },
    { id: "projects", label: "/var/projects", icon: FolderCode },
    { id: "blog", label: "/var/log/blog", icon: FileText },
    { id: "contact", label: "/dev/tcp/msg", icon: Mail },
  ];

  return (
    <header className="mb-6">
      <div className="flex flex-wrap justify-between items-center gap-y-2 text-xs sm:text-sm border-b border-[#123f4d] pb-2 mb-4 text-[#67e8f9]/80">
        <div className="flex gap-4 flex-wrap">
          <span
            className="flex items-center border border-[#123f4d] px-1.5 py-0.5 text-[10px] tracking-widest"
            title="Hidden flags are scattered across this site. Type 'flags' in the terminal."
          >
            <Lock size={11} className="mr-1" /> CTF {foundFlags.length}/{FLAGS.length}
          </span>
          <span className="flex items-center">
            <Wifi size={14} className="mr-1" /> UPLINK: SECURE
          </span>
          <span className="hidden sm:flex items-center">
            <Activity size={14} className="mr-1" /> SYS: OPTIMAL
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center">
            <Battery size={14} className="mr-1" /> 98%
          </span>
          <span className="flex items-center font-terminal text-base">
            <Clock size={14} className="mr-1" /> {time}
          </span>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1 sm:flex-wrap sm:overflow-x-visible sm:mx-0 sm:px-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3 py-1.5 text-sm shrink-0 whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? "border-[#67e8f9] bg-[#67e8f9]/10 text-glow shadow-[0_0_10px_rgba(103,232,249,0.2)]"
                  : "border-[#123f4d] hover:border-[#67e8f9]/50 hover:bg-[#67e8f9]/5 text-[#67e8f9]/70"
              }`}
            >
              <Icon size={16} className="mr-2" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};

const MATRIX_CHARS = "\u30A2\u30AB\u30B5\u30BF\u30CA\u30CF\u30DE\u30E4\u30E9\u30EF\u30A4\u30AD\u30B7\u30C1\u30CB\u30D2\u30DF\u30EA\u30A6\u30AF\u30B9\u30C4\u30CC\u30D5\u30E0\u30E6\u30EB0123456789ABCDEF<>[]{}#$%&*+=?";

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = 0;
    let columns = 0;
    let drops: number[] = [];
    const fontSize = 14;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -100);
    };

    const draw = (time: number) => {
      raf = window.requestAnimationFrame(draw);
      if (time - last < 50) return;
      last = time;

      ctx.fillStyle = "rgba(2, 10, 2, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px 'Fira Code', monospace`;

      for (let i = 0; i < drops.length; i += 1) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillStyle = Math.random() > 0.97 ? "#d8ffd8" : "#67e8f9";
        ctx.fillText(char, x, y);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
    };

    resize();
    window.addEventListener("resize", resize);
    raf = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-30 opacity-40 pointer-events-none"
      aria-hidden="true"
    />
  );
};

const RootOverlay = ({ onClose }: { onClose: () => void }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] bg-[#020c14]/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Root access achieved"
    >
      <div className="root-pop relative w-full max-w-lg bg-black/80 border border-[#67e8f9]/60 shadow-[0_0_50px_rgba(103,232,249,0.3)] p-5 sm:p-8 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#ff2a6d]" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#ff2a6d]" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#ff2a6d]" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#ff2a6d]" />

        <p className="glitch text-xs tracking-[0.35em] text-[#ff2a6d] uppercase mb-4" data-text="// Achievement Unlocked //">
          {"// Achievement Unlocked //"}
        </p>

        <h2
          className="glitch text-2xl sm:text-4xl font-bold text-glow uppercase tracking-widest mb-2"
          data-text="Root Access"
        >
          Root Access
        </h2>

        <p className="text-sm text-[#67e8f9]/70 mb-6">All flags captured. This system is yours now.</p>

        <div className="border-y border-[#123f4d] py-3 px-2 mb-6 text-left space-y-2 max-h-44 overflow-y-auto">
          {FLAGS.map((f) => (
            <div key={f.id} className="flex items-center gap-2 text-sm">
              <Check size={14} className="shrink-0 text-[#67e8f9]" />
              <span className="text-[#67e8f9]/90 break-all">{decodeFlag(f.enc)}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs font-terminal tracking-widest text-[#67e8f9]/60 mb-6">
          <span>FLAGS: {FLAGS.length}/{FLAGS.length}</span>
          <span className="text-glow">STATUS: ROOT</span>
          <span>PRIVILEGES: ESCALATED</span>
        </div>

        <button
          onClick={onClose}
          className="border border-[#67e8f9] px-6 py-2 text-sm uppercase tracking-widest hover:bg-[#ff2a6d] hover:border-[#ff2a6d] hover:text-black transition-colors"
        >
          [ Exit Session ]
        </button>
      </div>
    </div>
  );
};

const TERMINAL_COMMANDS = [
  "help",
  "ls",
  "cd",
  "whoami",
  "clear",
  "pwd",
  "neofetch",
  "matrix",
  "hack",
  "grep",
  "submit",
  "flags",
  "blog",
  "read",
  "root",
];

type HistoryEntry = { type: "system" | "input" | "output"; text: string };

const InteractiveTerminal = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: "system", text: 'Type "help" for a list of available commands.' },
    { type: "system", text: "PS: This box has been pwned before. Can you do it? (try: flags)" },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const endOfHistoryRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    endOfHistoryRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const appendOutput = (text: string, delay = 0) => {
    const push = () =>
      setHistory((prev) => [...prev, { type: "output", text }]);
    if (delay > 0) window.setTimeout(push, delay);
    else push();
  };

  const handleCommand = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const parts = input.split(/\s+/);
      if (parts.length <= 1) {
        const match = TERMINAL_COMMANDS.find((c) => c.startsWith(parts[0].toLowerCase()));
        if (match) setInput(`${match} `);
        return;
      }
      if (parts[0].toLowerCase() === "read") {
        const partial = parts[1]?.toLowerCase() ?? "";
        const match = BLOG_INDEX.find((p) => p.slug.startsWith(partial) || p.id.startsWith(partial));
        if (match) setInput(`read ${match.slug}`);
      }
      return;
    }

    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      if (!cmdHistory.length) return;
      let next = historyIndex;
      if (e.key === "ArrowUp") next = Math.min(cmdHistory.length - 1, next + 1);
      else next = Math.max(-1, next - 1);
      setHistoryIndex(next);
      setInput(next === -1 ? "" : cmdHistory[cmdHistory.length - 1 - next]);
      return;
    }

    if (e.key !== "Enter") return;

    const rawInput = input.trim();
    const cmd = rawInput.toLowerCase();

    if (!cmd) return;

    setCmdHistory((prev) => [...prev, rawInput]);
    setHistoryIndex(-1);

    let output = "";
    let newTab = activeTab;

    switch (cmd) {
      case "help":
        output =
          "Available commands:\n  ls         - List directory contents\n  cd <dir>   - Change directory (home, resume, projects, blog, contact)\n  whoami     - Print user profile and device details\n  neofetch   - Display system information\n  blog       - List published log entries\n  read <id>  - Open a log entry from the terminal\n  matrix     - Toggle the rain\n  clear      - Clear terminal screen\n  sudo       - Execute command as superuser\n\nSome commands are undocumented. Real hackers read everything.";
        break;
      case "ls":
        output = "home/  resume/  projects/  blog/  contact/";
        break;
      case "whoami": {
        const ua = navigator.userAgent;
        const parseUA = (str: string) => {
          let browser = "Unknown";
          if (str.includes("Firefox/")) browser = `Firefox ${str.split("Firefox/")[1]?.split(" ")[0] ?? ""}`;
          else if (str.includes("Edg/")) browser = `Edge ${str.split("Edg/")[1]?.split(" ")[0] ?? ""}`;
          else if (str.includes("OPR/") || str.includes("Opera/")) browser = `Opera ${str.split("OPR/")[1]?.split(" ")[0] ?? ""}`;
          else if (str.includes("Chrome/") && !str.includes("Edg/")) browser = `Chrome ${str.split("Chrome/")[1]?.split(" ")[0] ?? ""}`;
          else if (str.includes("Safari/") && str.includes("Version/")) browser = `Safari ${str.split("Version/")[1]?.split(" ")[0] ?? ""}`;

          let os = "Unknown";
          let device = "Desktop";
          if (str.includes("Windows NT 10.0")) os = "Windows 10/11";
          else if (str.includes("Windows NT 6.3")) os = "Windows 8.1";
          else if (str.includes("Windows NT 6.2")) os = "Windows 8";
          else if (str.includes("Windows NT 6.1")) os = "Windows 7";
          else if (str.includes("Windows")) os = "Windows";
          else if (str.includes("Mac OS X")) os = `macOS ${str.split("Mac OS X")[1]?.split(";")[0]?.trim().replace(/_/g, ".") ?? ""}`;
          else if (str.includes("CrOS")) os = "ChromeOS";
          else if (str.includes("Linux")) os = "Linux";

          if (str.includes("Android")) {
            os = `Android ${str.split("Android")[1]?.split(";")[0]?.trim() ?? ""}`;
            device = "Mobile";
          }
          if (str.includes("iPhone")) {
            os = "iOS";
            device = "iPhone";
          } else if (str.includes("iPad")) {
            os = "iPadOS";
            device = "iPad";
          } else if (str.includes("iPod")) {
            os = "iOS";
            device = "iPod";
          }
          if (str.includes("Mobile") || str.includes("Android")) device = "Mobile";

          return { browser, os, device };
        };

        const { browser, os, device } = parseUA(ua);
        const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory
          ? `${(navigator as unknown as { deviceMemory: number }).deviceMemory} GB`
          : "N/A";
        const cores = navigator.hardwareConcurrency ?? "N/A";
        const lang = navigator.language || "N/A";
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "N/A";
        const now = new Date();
        const localTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
        const screenRes = `${window.screen.width}x${window.screen.height}`;
        const viewRes = `${window.innerWidth}x${window.innerHeight}`;
        const dpr = window.devicePixelRatio || 1;
        const online = navigator.onLine ? "ONLINE" : "OFFLINE";
        const touch = navigator.maxTouchPoints > 0 ? "YES" : "NO";

        output = [
          "",
          "┌──────────────────────────────────────────┐",
          "│   USER PROFILE  //  METIDEV              │",
          "├──────────────────────────────────────────┤",
          `│  User:      metidev (guest@term)         │`,
          `│  Role:      Offensive Security Engineer  |`,
          `│  Status:    ACTIVE                       |`,
          `├──────────────────────────────────────────┤`,
          `│  OS:        ${os}`,
          `│  Browser:   ${browser}`,
          `│  Device:    ${device}`,
          `│  Touch:     ${touch}`,
          `│  Platform:  ${navigator.platform}`,
          `│  Language:  ${lang}`,
          `│  Timezone:  ${tz}`,
          `│  Local:     ${localTime}`,
          `├──────────────────────────────────────────┤`,
          `│  CPU Cores:     ${cores}`,
          `│  Device Memory: ${memory}`,
          `│  Screen:        ${screenRes}`,
          `│  Viewport:      ${viewRes}`,
          `│  DPR:           ${dpr}x`,
          `│  Connection:    ${online}`,
          `├──────────────────────────────────────────┤`,
          `│  IP Hint:  For OSINT, check /dev/tcp/ip`,
          `│  Flags:    ${loadFoundFlags().length}/${FLAGS.length} captured`,
          "└──────────────────────────────────────────┘",
          "",
        ].join("\n");
        break;
      }
      case "sudo":
      case "sudo su":
        output = "Permission denied: This incident will be reported.";
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "pwd":
        output = `/${activeTab}`;
        break;
      case "neofetch": {
        output = [
          "guest@term",
          "-----------",
          "OS: TerminalOS 2.1.0 (CRT edition)",
          `Host: ${window.location.hostname}`,
          "Kernel: quantum-neural 4.2.0-ghz",
          "Shell: fake-sh 3.7 (React)",
          "Uptime: since you opened this page",
          `Flags captured: ${loadFoundFlags().length}/${FLAGS.length}`,
          "Memory: 65536K (all of it free)",
        ].join("\n");
        break;
      }
      case "matrix":
        window.dispatchEvent(new Event("toggle-matrix"));
        output = "Wake up... follow the white rabbit.";
        break;
      case "root":
        if (loadFoundFlags().length === FLAGS.length) {
          window.dispatchEvent(new Event("show-root-overlay"));
          output = "Re-opening root session...";
        } else {
          output = `root: permission denied. Capture all flags first (${loadFoundFlags().length}/${FLAGS.length}).`;
        }
        break;
      case "hack":
      case "exploit": {
        setHistory((prev) => [
          ...prev,
          { type: "input", text: `guest@term:~$ ${rawInput}` },
        ]);
        const steps = [
          "[*] Initializing exploit framework v0.9.1...",
          "[*] Fingerprinting target: localhost...",
          "[+] Found vulnerable service: ego_daemon (port 1337)",
          "[*] Crafting payload... done.",
          "[*] Sending payload... ",
          "[!] Buffer overflow triggered. Shell spawned.",
          `[+] ROOT OBTAINED — flag captured: ${flagOf("hack")}`,
          registerFlagById("hack")
            ? "Nice work. Run 'submit' on it or check 'flags' for progress."
            : "You already own this box.",
        ];
        steps.forEach((line, i) => appendOutput(line, i * 420));
        setInput("");
        return;
      }
      case "flags":
      case "ctf": {
        const found = loadFoundFlags();
        output = [
          "MISSION BOARD // PWN_THE_TERMINAL",
          ...FLAGS.map((f) =>
            found.includes(f.id)
              ? `[CAPTURED] ${decodeFlag(f.enc)}`
              : `[MISSING]  FLAG{????????????????}\n           hint: ${f.hint}`
          ),
          `Progress: ${found.length}/${FLAGS.length}. Submit with: submit FLAG{code}`,
        ].join("\n");
        break;
      }
      default:
        if (cmd === "grep flag" || cmd === "grep -r flag" || cmd === "grep -ri flag" || cmd.startsWith("grep ")) {
          if (cmd.includes("flag")) {
            const leaked = flagOf("grep");
            output = [
              "$ " + rawInput,
              "./boot/kernel.img: binary file matches",
              "./var/log/auth.log:suspicious login from 127.0.0.1",
              `./var/log/auth.log:${leaked}`,
              "",
              `1 secret leaked. Submit it: submit ${leaked}`,
            ].join("\n");
          } else {
            output = "grep: nothing interesting found. Try grepping something juicier.";
          }
        } else if (cmd.startsWith("submit ") || cmd.startsWith("flag ")) {
          const code = rawInput.slice(rawInput.indexOf(" ") + 1).trim().toUpperCase();
          const match = FLAGS.find((f) => decodeFlag(f.enc).toUpperCase() === code);
          const decoded = match ? decodeFlag(match.enc) : "";
          if (!match) {
            output = "submit: invalid or unknown flag. Nice try though.";
          } else if (!registerFlagById(match.id)) {
            output = `Already captured: ${decoded}`;
          } else {
            const total = loadFoundFlags().length;
            output =
              total === FLAGS.length
                ? `[${total}/${FLAGS.length}] FINAL FLAG ACCEPTED. Root access granted...`
                : `[${total}/${FLAGS.length}] Flag accepted: ${decoded}. Keep hunting.`;
          }
        } else if (cmd === "blog" || cmd === "ls blog") {
          output = BLOG_INDEX.length
            ? ["Available entries:", ...BLOG_INDEX.map((p) => `  ${p.slug.padEnd(28)} (${p.date})`), "Open with: read <slug>"].join("\n")
            : "No entries yet. Drop markdown in src/content/blog.";
        } else if (cmd.startsWith("read ") || cmd.startsWith("cat ")) {
          const slug = cmd.split(/\s+/)[1] ?? "";
          const post = BLOG_INDEX.find((p) => p.slug === slug || p.id === slug);
          if (!post) {
            output = `read: '${slug}' not found. Run 'blog' to list entries.`;
          } else {
            window.location.hash = `/blog/${encodeURIComponent(post.slug)}`;
            output = `Opening ${post.title}...`;
          }
        } else if (cmd.startsWith("cd ")) {
          const dir = cmd.substring(3);
          if (dir === "home" || dir === "resume" || dir === "projects" || dir === "blog" || dir === "contact") {
            newTab = dir;
            output = `Changed directory to ${
              { home: "/sys/home", resume: "/usr/resume", projects: "/var/projects", blog: "/var/log/blog", contact: "/dev/tcp/msg" }[dir]
            }`;
          } else {
            output = `cd: ${cmd.substring(3)}: No such file or directory`;
          }
        } else {
          output = `command not found: ${rawInput}`;
        }
    }

    setHistory((prev) => [
      ...prev,
      { type: "input", text: `guest@term:~$ ${rawInput}` },
      { type: "output", text: output },
    ]);
    setInput("");

    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  };

  return (
    <div
      className="hud-border bg-black/40 p-4 mb-6 font-mono text-sm max-h-48 overflow-y-auto overflow-x-hidden w-full max-w-full"
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((entry, i) => (
        <div
          key={i}
          className={`break-words whitespace-pre-wrap ${
            entry.type === "system"
              ? "text-gray-400"
              : entry.type === "input"
              ? "text-[#67e8f9]"
              : "text-[#67e8f9]/80"
          }`}
        >
          {entry.text}
        </div>
      ))}

      <div className="flex items-center gap-2 mt-1 w-full min-w-0 overflow-hidden">
        <span className="text-[#67e8f9] shrink-0">guest@term:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className="min-w-0 flex-1 bg-transparent border-none outline-none text-[#67e8f9] overflow-hidden"
          style={{ caretColor: "var(--phosphor-primary)" }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>
      <div ref={endOfHistoryRef} />
    </div>
  );
};

const HomeSection = ({ setActiveTab, rooted }: { setActiveTab: (tab: TabId) => void; rooted: boolean }) => (
  <div className="space-y-6 animate-fade-in">
    {rooted ? (
      <button
        onClick={() => window.dispatchEvent(new Event("show-root-overlay"))}
        className="hud-border border-[#67e8f9] p-3 w-full flex items-center gap-3 bg-[#67e8f9]/10 animate-fade-in text-left hover:bg-[#67e8f9]/20 transition-colors"
        title="View root access achievement again"
      >
        <Lock size={18} className="text-glow shrink-0" />
        <div className="text-sm">
          <span className="text-glow font-bold uppercase tracking-widest">Root Access Achieved</span>
          <span className="text-[#67e8f9]/70"> // you pwned this portfolio. {FLAGS.length}/{FLAGS.length} flags captured.</span>
        </div>
      </button>
    ) : null}

    <div className="flex flex-col md:flex-row gap-6 items-start">
      <div className="hud-border neon-pulse p-1">
        <div className="w-32 h-32 bg-[#123f4d]/30 flex items-center justify-center border border-[#67e8f9]/30">
          <Lock size={48} className="text-[#67e8f9]/50" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h1 className="glitch rgb-split text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-glow" data-text={'M.A. "MetiDev"'}>M.A. "MetiDev"</h1>
        <h2 className="text-xl text-[#67e8f9]/80 mb-4 font-terminal tracking-wider">
          OFFENSIVE SECURITY ENGINEER / DEVELOPER
        </h2>
        <p className="text-[#67e8f9]/90 leading-relaxed max-w-2xl mb-4">
          Initiating diagnostic overview... Subject is an experienced security researcher and full-stack developer
          specializing in identifying zero-day vulnerabilities, building custom exploit frameworks, and
          reverse-engineering complex systems.
        </p>
        <p className="text-[#67e8f9]/70 text-sm">
          Status: <span className="text-glow">AVAILABLE FOR CONTRACT</span>
        </p>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {[
        { label: "System Pwned", value: "400+" },
        { label: "CVEs Assigned", value: "12" },
        { label: "Scripts Written", value: "1k+" },
        { label: "Uptime", value: "99.9%" },
      ].map((stat, i) => (
        <div key={i} className="border border-[#123f4d] p-4 text-center hover:bg-[#67e8f9]/5 transition-colors">
          <div className="text-2xl font-bold text-glow mb-1 font-terminal">{stat.value}</div>
          <div className="text-xs text-[#67e8f9]/60 uppercase tracking-widest">{stat.label}</div>
        </div>
      ))}
    </div>

    <div className="flex flex-wrap gap-4 mt-8">
      <button
        onClick={() => setActiveTab("resume")}
        className="border border-[#67e8f9] px-6 py-2 hover:bg-[#ff2a6d] hover:border-[#ff2a6d] hover:text-black transition-colors flex items-center text-sm font-bold uppercase"
      >
        <ChevronRight size={16} className="mr-1" /> Execute /Resume
      </button>
      <button
        onClick={() => setActiveTab("projects")}
        className="border border-[#123f4d] px-6 py-2 hover:border-[#67e8f9] hover:bg-[#67e8f9]/10 transition-colors flex items-center text-sm uppercase"
      >
        <ChevronRight size={16} className="mr-1" /> View /Projects
      </button>
    </div>
  </div>
);

const ResumeSection = () => (
  <div className="space-y-8 animate-fade-in">
    <div className="flex items-center mb-6 border-b border-[#123f4d] pb-2">
      <Briefcase className="mr-3" />
      <h2 className="glitch text-2xl text-glow font-bold uppercase tracking-widest" data-text="Experience_Log">Experience_Log</h2>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      <div className="relative border-l-2 border-[#123f4d] pl-6 space-y-8 ml-3">
        {DATA.resume.map((job, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[33px] top-1 w-4 h-4 bg-black border-2 border-[#67e8f9] rounded-full shadow-[0_0_8px_rgba(103,232,249,0.8)]" />
            <div className="text-[#67e8f9]/60 text-sm font-terminal mb-1">{job.year}</div>
            <h3 className="text-lg font-bold text-glow">{job.title}</h3>
            <div className="text-[#67e8f9]/80 text-sm mb-2">@ {job.company}</div>
            <p className="text-sm text-[#67e8f9]/70 leading-relaxed">{job.desc}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center mb-6 border-b border-[#123f4d] pb-2">
          <Cpu className="mr-3" />
          <h2 className="glitch text-2xl text-glow font-bold uppercase tracking-widest" data-text="Skill_Matrix">Skill_Matrix</h2>
        </div>

        <div className="space-y-4">
          {DATA.skills.map((skill, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span>{skill.name}</span>
                <span className="font-terminal">{skill.level}%</span>
              </div>
              <div className="h-2 w-full bg-[#123f4d]/30 border border-[#123f4d]">
                <div
                  className="h-full bg-[#67e8f9] shadow-[0_0_5px_rgba(103,232,249,0.5)]"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 hud-border p-4 bg-[#123f4d]/10">
          <h4 className="text-sm text-[#67e8f9]/60 mb-2 uppercase">Certifications_</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>OSCP (Offensive Security Certified Professional)</li>
            <li>OSWE (Offensive Security Web Expert)</li>
            <li>CISSP (Certified Information Systems Security Professional)</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const ProjectsSection = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex items-center mb-6 border-b border-[#123f4d] pb-2">
      <FolderCode className="mr-3" />
      <h2 className="glitch text-2xl text-glow font-bold uppercase tracking-widest" data-text="Active_Modules">Active_Modules</h2>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      {DATA.projects.map((project, i) => (
        <div key={i} className="hud-border p-5 hover:bg-[#67e8f9]/5 transition-all group flex flex-col">
          <div className="flex justify-between items-start mb-3 gap-2">
            <h3 className="text-xl font-bold text-glow group-hover:underline decoration-[#67e8f9]/50 underline-offset-4">
              {project.title}
            </h3>
            <a href={project.link} className="text-[#67e8f9]/50 hover:text-[#67e8f9] transition-colors" aria-label={project.title}>
              <ExternalLink size={18} />
            </a>
          </div>
          <p className="text-sm text-[#67e8f9]/80 mb-4 flex-grow">{project.desc}</p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.stack.map((tech, j) => (
              <span key={j} className="text-xs px-2 py-1 bg-[#123f4d]/40 border border-[#123f4d] text-[#67e8f9]/90">
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ShareButton = ({ post, onToast }: { post: BlogPost; onToast: (msg: string) => void }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = getPostUrl(post.slug);
    const shareData: ShareData = { title: post.title, text: post.title, url };

    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      onToast("[ FAIL ] Clipboard blocked by browser");
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        void handleShare();
      }}
      className={`flex items-center gap-1.5 px-2.5 py-1 border text-xs uppercase tracking-widest transition-colors ${
        copied
          ? "border-[#67e8f9] bg-[#67e8f9]/20 text-glow"
          : "border-[#123f4d] text-[#67e8f9]/70 hover:border-[#67e8f9] hover:bg-[#67e8f9]/10 hover:text-[#67e8f9]"
      }`}
      aria-label={`Share "${post.title}"`}
      title="Copy share link"
    >
      {copied ? <Check size={13} /> : <Share2 size={13} />}
      {copied ? "Copied" : "Share"}
    </button>
  );
};

const BlogSection = () => {
  const [slug, setSlug] = useState<string | null>(() => parseHash().slug);
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const articleRef = useRef<HTMLDivElement | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onHashChange = () => setSlug(parseHash().slug);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    if (!slug) return;

    window.scrollTo({ top: 0 });
    setProgress(0);

    const updateProgress = () => {
      const el = articleRef.current;
      if (!el) return;

      // Document-relative position (getBoundingClientRect is viewport-relative).
      const rect = el.getBoundingClientRect();
      const docTop = rect.top + window.scrollY;
      let pct: number;

      if (rect.height <= window.innerHeight) {
        // Short article: fill as it passes through the viewport.
        const visible = window.scrollY + window.innerHeight - docTop;
        pct = (visible / rect.height) * 100;
      } else {
        // Start when the article top reaches the viewport top,
        // end when its bottom reaches the viewport bottom.
        const scrolled = window.scrollY - docTop;
        const total = rect.height - window.innerHeight;
        pct = (scrolled / total) * 100;
      }

      setProgress(Math.min(100, Math.max(0, pct)));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    const raf = window.requestAnimationFrame(updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      window.cancelAnimationFrame(raf);
    };
  }, [slug]);

  const showToast = (msg: string) => {
    window.clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  };

  const openPost = (post: BlogPost) => {
    window.location.hash = `/blog/${encodeURIComponent(post.slug)}`;
  };

  const closePost = () => {
    window.location.hash = "/blog";
  };

  const activePost = slug ? BLOG_INDEX.find((p) => p.slug === slug || p.id === slug) ?? null : null;
  const articleHtml = useMemo(() => (activePost ? markdownToHtml(activePost.body) : ""), [activePost]);

  const allTags = [...new Set(BLOG_INDEX.flatMap((p) => p.tags))].sort();

  const normalizedQuery = query.trim().toLowerCase();
  const filteredPosts = BLOG_INDEX.filter((post) => {
    if (tagFilter && !post.tags.includes(tagFilter)) return false;
    if (!normalizedQuery) return true;
    const haystack = `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  if (activePost) {
    return (
      <>
        {createPortal(
          <div className="reading-progress" style={{ width: `${progress}%` }} aria-hidden="true" />,
          document.body
        )}
        <div className="animate-fade-in">
          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            <button
              onClick={closePost}
              className="flex items-center text-sm hover:text-glow transition-colors group"
            >
              <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
              Return to Log Index
            </button>

            <ShareButton post={activePost} onToast={showToast} />
          </div>

          <article ref={articleRef} className="hud-border p-4 sm:p-8 bg-black/40">
          <div className="text-sm text-[#67e8f9]/60 font-terminal mb-2">
            Timestamp: {activePost.date} // Read_Time: {activePost.readTime}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-glow mb-4 break-words">{activePost.title}</h1>

          {activePost.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-6">
              {activePost.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 border border-[#123f4d] text-[#67e8f9]/70">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          <div
            className="post-content max-w-none text-[#67e8f9]/90"
            dangerouslySetInnerHTML={{
              __html: articleHtml,
            }}
          />

          <div className="mt-10 pt-4 border-t border-[#123f4d] flex items-center justify-between gap-3 flex-wrap">
            <span className="text-xs text-[#67e8f9]/40 font-terminal tracking-widest">// END OF LOG ENTRY</span>
            <ShareButton post={activePost} onToast={showToast} />
          </div>
        </article>

        {toast
          ? createPortal(
              <div className="toast hud-border bg-[#020c14] px-4 py-2 text-sm text-[#67e8f9]" role="status">
                {toast}
              </div>,
              document.body
            )
          : null}
        </div>
        </>
      );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between border-b border-[#123f4d] pb-2 mb-6 gap-4 flex-wrap">
        <div className="flex items-center">
          <FileText className="mr-3" />
          <h2 className="glitch text-2xl text-glow font-bold uppercase tracking-widest" data-text="System_Logs">System_Logs</h2>
        </div>
        <span className="text-xs text-[#67e8f9]/50 font-terminal tracking-widest">
          [{BLOG_INDEX.length} ENTRIES]
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-2">
        <div className="relative flex-1 min-w-0">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#67e8f9]/40 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="grep logs..."
            aria-label="Search posts"
            className="w-full bg-black/50 border border-[#123f4d] pl-9 pr-3 py-1.5 text-sm text-[#67e8f9] outline-none focus:border-[#67e8f9] focus:shadow-[0_0_5px_rgba(103,232,249,0.3)] transition-all placeholder:text-[#67e8f9]/30"
          />
        </div>
      </div>

      {allTags.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-4">
          {allTags.map((tag) => {
            const isActive = tagFilter === tag;
            return (
              <button
                key={tag}
                onClick={() => setTagFilter(isActive ? null : tag)}
                className={`text-xs px-2 py-0.5 border transition-colors ${
                  isActive
                    ? "border-[#67e8f9] bg-[#67e8f9]/15 text-glow"
                    : "border-[#123f4d] text-[#67e8f9]/60 hover:border-[#67e8f9]/60 hover:text-[#67e8f9]"
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <div className="hud-border p-8 text-center text-[#67e8f9]/50 text-sm">
            No log entries match query. <span className="cursor-blink">_</span>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => openPost(post)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") openPost(post);
              }}
              tabIndex={0}
              role="button"
              aria-label={`Read "${post.title}"`}
              className="hud-border p-4 flex flex-col sm:flex-row sm:items-start justify-between cursor-pointer hover:bg-[#67e8f9]/10 focus-visible:bg-[#67e8f9]/10 outline-none transition-colors group gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="text-xs text-[#67e8f9]/60 font-terminal mb-1">
                  {post.date} // {post.readTime}
                </div>
                <h3 className="text-lg font-bold group-hover:text-glow break-words transition-all">{post.title}</h3>
                {post.excerpt ? (
                  <p className="text-sm text-[#67e8f9]/70 mt-1 break-words line-clamp-2">{post.excerpt}</p>
                ) : null}
              </div>

              <div className="flex items-center justify-between sm:items-end sm:flex-col sm:justify-start gap-2 shrink-0 self-stretch sm:self-auto">
                <ShareButton post={post} onToast={showToast} />
                {post.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 border border-[#123f4d] text-[#67e8f9]/70">
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>

      {toast
        ? createPortal(
            <div className="toast hud-border bg-[#020c14] px-4 py-2 text-sm text-[#67e8f9]" role="status">
              {toast}
            </div>,
            document.body
          )
        : null}
    </div>
  );
};

const ContactSection = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);

  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;

  useEffect(() => {
    const SRC = "https://web3forms.com/client/script.js";
    if (document.querySelector(`script[src="${SRC}"]`)) return;
    const script = document.createElement("script");
    script.src = SRC;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setFeedback("");

    if (honeypot) {
      setStatus("sent");
      setFeedback("Message sent successfully.");
      return;
    }

    if (!accessKey) {
      setStatus("error");
      setFeedback("Missing VITE_WEB3FORMS_ACCESS_KEY. Add it as a GitHub Actions secret and redeploy.");
      return;
    }

    try {
      const formEl = formRef.current;
      const captchaResponse =
        (formEl?.querySelector<HTMLInputElement>('input[name="h-captcha-response"]')?.value ?? "") ||
        (formEl?.querySelector<HTMLTextAreaElement>('textarea[name="h-captcha-response"]')?.value ?? "") ||
        (formEl?.querySelector<HTMLInputElement>('input[name="g-recaptcha-response"]')?.value ?? "");

      if (!captchaResponse) {
        setStatus("error");
        setFeedback("Please complete the captcha check before transmitting.");
        return;
      }

      const payload: Record<string, string> = {
        access_key: accessKey,
        name: form.name,
        email: form.email,
        message: form.message,
        subject: `Portfolio message from ${form.name}`,
        from_name: form.name,
        replyto: form.email,
        botcheck: honeypot,
        "h-captcha-response": captchaResponse,
      };

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { success?: boolean; message?: string };
      if (!response.ok || data.success === false) throw new Error(data.message || "Submission failed.");

      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setHoneypot("");
      setFeedback("Message sent successfully.");
      try {
        const hcaptcha = (window as unknown as { hcaptcha?: { reset: () => void } }).hcaptcha;
        hcaptcha?.reset();
      } catch {
        /* ignore */
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send message.";
      setStatus("error");
      setFeedback(message);
    }
  };

  return (
    <div className="animate-fade-in grid md:grid-cols-2 gap-8">
      <div>
        <div className="flex items-center mb-6 border-b border-[#123f4d] pb-2">
          <Mail className="mr-3" />
          <h2 className="glitch text-2xl text-glow font-bold uppercase tracking-widest" data-text="Secure_Channel">Secure_Channel</h2>
        </div>

        <p className="mb-6 text-[#67e8f9]/80 text-sm leading-relaxed">
          Open a secure communication channel. The form below sends directly to email through Web3Forms, so it works
          on GitHub Pages without a backend.
        </p>

        <div className="space-y-3 mt-8">
          <h3 className="text-sm text-[#67e8f9]/60 uppercase tracking-widest mb-2 border-b border-[#123f4d] inline-block pb-1">
            Known_Nodes
          </h3>

          <div className="flex flex-wrap gap-3">
            <a href="https://github.com/MetiDev" target="_blank" rel="noreferrer" className="inline-flex items-center text-[#67e8f9]/80 hover:text-glow hover:translate-x-2 transition-all">
              <Github size={18} className="mr-2" /> github.com/MetiDev
            </a>

            <a href="https://medium.com/@MetiDev" target="_blank" rel="noreferrer" className="inline-flex items-center text-[#67e8f9]/80 hover:text-glow hover:translate-x-2 transition-all">
              <Medium size={18} className="mr-2" /> medium.com/@MetiDev
            </a>

            <a href="https://linkedin.com/in/MetiDev" target="_blank" rel="noreferrer" className="inline-flex items-center text-[#67e8f9]/80 hover:text-glow hover:translate-x-2 transition-all">
              <Linkedin size={18} className="mr-2" /> in/MetiDev
            </a>
          </div>
        </div>
      </div>

      <div className="hud-border p-6 bg-black/30 min-w-0">
        {status === "sent" ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
            <Shield size={48} className="text-[#67e8f9]" />
            <h3 className="text-xl font-bold text-glow">Transmission Successful</h3>
            <p className="text-sm text-[#67e8f9]/70">The payload has been delivered to the secure drop.</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 border border-[#123f4d] px-4 py-1 hover:border-[#67e8f9] text-sm"
            >
              Send Another
            </button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs mb-1 text-[#67e8f9]/60">IDENTIFICATION // NAME</label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full bg-black/50 border border-[#123f4d] p-2 text-[#67e8f9] outline-none focus:border-[#67e8f9] focus:shadow-[0_0_5px_rgba(103,232,249,0.3)] transition-all font-mono text-sm"
                placeholder="guest_user"
              />
            </div>

            <div>
              <label className="block text-xs mb-1 text-[#67e8f9]/60">RETURN_ADDRESS // EMAIL</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full bg-black/50 border border-[#123f4d] p-2 text-[#67e8f9] outline-none focus:border-[#67e8f9] focus:shadow-[0_0_5px_rgba(103,232,249,0.3)] transition-all font-mono text-sm"
                placeholder="user@domain.tld"
              />
            </div>

            <div>
              <label className="block text-xs mb-1 text-[#67e8f9]/60">PAYLOAD // MESSAGE</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                className="w-full bg-black/50 border border-[#123f4d] p-2 text-[#67e8f9] outline-none focus:border-[#67e8f9] focus:shadow-[0_0_5px_rgba(103,232,249,0.3)] transition-all font-mono text-sm resize-none"
                placeholder="Enter encrypted message here..."
              />
            </div>

            <div className="absolute left-[-5000px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
              <label htmlFor="website_url">Leave this field empty</label>
              <input
                id="website_url"
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <input type="checkbox" name="botcheck" checked={false} readOnly className="hidden" tabIndex={-1} aria-hidden="true" />

            <div className="pt-1 -mx-1 px-1 overflow-x-auto no-scrollbar">
              <div className="h-captcha min-w-[300px] max-w-full" data-captcha="true" />
            </div>
            {feedback ? <p className={`text-xs ${status === "error" ? "text-red-400" : "text-[#67e8f9]/70"}`}>{feedback}</p> : null}

            <button
              disabled={status === "sending"}
              type="submit"
              className="w-full border border-[#67e8f9] bg-[#67e8f9]/10 py-2 hover:bg-[#67e8f9] hover:text-black transition-colors font-bold uppercase text-sm tracking-widest flex justify-center items-center disabled:opacity-60"
            >
              {status === "sending" ? <span className="cursor-blink">Encrypting...</span> : "[ TRANSMIT_PAYLOAD ]"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const NeonMatrixCursor = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(hover: none) and (pointer: coarse)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const CHARS = "アカサタナハマ01#$%*+-.<>/\\";
    const SPAWN_INTERVAL = 55;
    let lastSpawn = 0;

    const onMouseMove = (e: MouseEvent) => {
      const cursor = document.getElementById("matrix-cursor");
      if (cursor) {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }

      const now = performance.now();
      if (now - lastSpawn > SPAWN_INTERVAL) {
        lastSpawn = now;

        const el = document.createElement("span");
        el.className = "matrix-char";
        el.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];

        const drift = (Math.random() - 0.5) * 14;
        const fall = 16 + Math.random() * 16;
        const startOpacity = 0.65 + Math.random() * 0.25;

        el.style.left = `${e.clientX + 8 + Math.random() * 8 - 4}px`;
        el.style.top = `${e.clientY + 8}px`;
        el.style.opacity = String(startOpacity);
        el.style.transform = "translate(-50%,-50%) scale(1)";

        document.body.appendChild(el);

        requestAnimationFrame(() => {
          el.style.transition = "transform 0.7s ease-out, opacity 0.7s ease-out";
          el.style.transform = `translate(calc(-50% + ${drift}px), calc(-50% + ${fall}px)) scale(0.85)`;
          el.style.opacity = "0";
        });

        setTimeout(() => el.remove(), 750);
      }
    };

    const onMouseLeave = () => {
      const cursor = document.getElementById("matrix-cursor");
      if (cursor) {
        cursor.style.opacity = "0";
      }
    };

    const onMouseEnter = () => {
      const cursor = document.getElementById("matrix-cursor");
      if (cursor) {
        cursor.style.opacity = "1";
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div id="matrix-cursor" style={{ transition: "opacity 0.2s ease-out" }}>
      <svg width="16" height="18" viewBox="0 0 16 18">
        <path
          d="M1 1 L1 15 L4.6 11.8 L11.5 10.8 Z"
          fill="none"
          stroke="#67e8f9"
          strokeWidth="1.1"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

const App = () => {
  const [booting, setBooting] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>(() => parseHash().tab);
  const [matrixOn, setMatrixOn] = useState(false);
  const foundFlags = useCtf();
  const rooted = FLAGS.every((f) => foundFlags.includes(f.id));
  const [showRootOverlay, setShowRootOverlay] = useState(false);
  const prevFoundCount = useRef<number>(foundFlags.length);

  useEffect(() => {
    const onToggleMatrix = () => setMatrixOn((prev) => !prev);
    window.addEventListener("toggle-matrix", onToggleMatrix);
    return () => window.removeEventListener("toggle-matrix", onToggleMatrix);
  }, []);

  useEffect(() => {
    const onShowRoot = () => setShowRootOverlay(true);
    window.addEventListener("show-root-overlay", onShowRoot);
    return () => window.removeEventListener("show-root-overlay", onShowRoot);
  }, []);

  useEffect(() => {
    const justCompleted =
      foundFlags.length === FLAGS.length && prevFoundCount.current < FLAGS.length;
    prevFoundCount.current = foundFlags.length;

    if (justCompleted) {
      const timer = window.setTimeout(() => setShowRootOverlay(true), 900);
      try {
        window.localStorage.setItem("ctf-root-celebrated", "1");
      } catch {
        /* storage unavailable */
      }
      return () => window.clearTimeout(timer);
    }
  }, [foundFlags]);

  useEffect(() => {
    console.log(
      "%c[SECURE LOG] Unauthorized access attempt detected on /dev/ego...",
      "color:#67e8f9; font-family:monospace; font-size:12px"
    );
    console.log(
      `%cLeaked credential recovered: ${flagOf("console")}`,
      "color:#ff2a6d; font-family:monospace; font-size:13px; font-weight:bold"
    );
    console.log("%cSubmit it in the terminal: submit FLAG{...}", "color:#67e8f9; font-family:monospace; font-size:11px");
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      setActiveTab(parseHash().tab);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (tab: TabId) => {
    const target = `#/${tab}`;
    if (window.location.hash === target || (!window.location.hash && tab === "home")) {
      setActiveTab(tab);
      window.scrollTo({ top: 0 });
      return;
    }
    window.location.hash = target;
  };

  if (booting) {
    return (
      <>
        <div className="crt vignette flicker-animation" />
        <BootSequence onComplete={() => setBooting(false)} />
      </>
    );
  }

  return (
    <>
      <div className="crt" />
      <div className="vignette" />
      <NeonMatrixCursor />
      {matrixOn ? <MatrixRain /> : null}
      {showRootOverlay ? <RootOverlay onClose={() => setShowRootOverlay(false)} /> : null}

      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        }}
      />

      <div className="min-h-screen p-3 sm:p-8 flex justify-center selection:bg-[#67e8f9] selection:text-black overflow-x-hidden">
        <div className="w-full max-w-5xl flex flex-col z-10 relative min-w-0">
          <NavigationHUD activeTab={activeTab} setActiveTab={navigate} />

          <div className="flex-1 flex flex-col min-w-0">
            <InteractiveTerminal activeTab={activeTab} setActiveTab={navigate} />

            <main className="hud-border bg-[#020c14]/80 backdrop-blur-sm p-4 sm:p-10 flex-1 relative overflow-hidden min-w-0">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#67e8f9]/30" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#67e8f9]/30" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#67e8f9]/30" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#67e8f9]/30" />

              <div className="h-full min-w-0">
                {activeTab === "home" && <HomeSection setActiveTab={navigate} rooted={rooted} />}
                {activeTab === "resume" && <ResumeSection />}
                {activeTab === "projects" && <ProjectsSection />}
                {activeTab === "blog" && <BlogSection />}
                {activeTab === "contact" && <ContactSection />}
              </div>
            </main>
          </div>

          <footer className="mt-6 text-center text-xs text-[#67e8f9]/40 font-terminal tracking-widest border-t border-[#123f4d] pt-4">
            <p>v2.1.0 // UNREGISTERED HYPERTERMINAL // {new Date().getFullYear()}</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default App;
