import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = resolve(
  here,
  "../../space-translation-ebook-manuscript-v1.md",
);
const outputPath = resolve(here, "../lib/base-book.json");

const source = await readFile(sourcePath, "utf8");
const lines = source.split(/\r?\n/);

const cleanInline = (value) =>
  value
    .replace(/\[\^(\d+)\]/g, "〔$1〕")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .trim();

const sections = [];
const sources = [];
let current = null;
let paragraph = [];
let list = [];
let inSources = false;
let started = false;

function pushParagraph() {
  if (!current || paragraph.length === 0) return;
  current.blocks.push({
    type: "paragraph",
    text: cleanInline(paragraph.join(" ")),
  });
  paragraph = [];
}

function pushList() {
  if (!current || list.length === 0) return;
  current.blocks.push({ type: "list", items: list.map(cleanInline) });
  list = [];
}

function flush() {
  pushParagraph();
  pushList();
}

for (const rawLine of lines) {
  const line = rawLine.trim();

  if (!started) {
    if (line !== "# 프롤로그") continue;
    started = true;
  }

  if (line === "# 주석과 출처") {
    flush();
    inSources = true;
    continue;
  }

  if (inSources) {
    const footnote = line.match(/^\[\^(\d+)\]:\s*(.*)$/);
    if (footnote) {
      const links = [...footnote[2].matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map(
        ([, label, url]) => ({ label, url }),
      );
      sources.push({
        number: Number(footnote[1]),
        text: cleanInline(footnote[2]),
        links,
      });
    }
    continue;
  }

  if (!line || line === "---") {
    flush();
    continue;
  }

  const levelOne = line.match(/^#\s+(.+)$/);
  if (levelOne) {
    flush();
    const heading = cleanInline(levelOne[1]);

    if (heading === "공간번역의 시대") continue;

    const part = heading.match(/^(\d+)부$/);
    const chapter = heading.match(/^(\d+)장\.\s*(.+)$/);

    if (part) {
      current = {
        id: `part-${part[1]}`,
        kind: "part",
        originalNumber: Number(part[1]),
        title: "",
        blocks: [],
      };
    } else if (chapter) {
      current = {
        id: `base-${chapter[1].padStart(2, "0")}`,
        kind: "chapter",
        originalNumber: Number(chapter[1]),
        title: chapter[2],
        blocks: [],
      };
    } else {
      const kind =
        heading === "프롤로그"
          ? "prologue"
          : heading === "에필로그"
            ? "epilogue"
            : "afterword";
      current = {
        id: kind,
        kind,
        title: heading,
        blocks: [],
      };
    }

    sections.push(current);
    continue;
  }

  const levelTwo = line.match(/^##\s+(.+)$/);
  if (levelTwo) {
    flush();
    const heading = cleanInline(levelTwo[1]);

    if (!current) continue;
    if (
      !current.title ||
      current.kind === "part" ||
      current.kind === "prologue" ||
      current.kind === "epilogue" ||
      current.kind === "afterword"
    ) {
      current.title = heading;
    } else {
      current.blocks.push({ type: "subheading", text: heading });
    }
    continue;
  }

  if (line.startsWith(">")) {
    flush();
    current?.blocks.push({
      type: "quote",
      text: cleanInline(line.replace(/^>\s*/, "")),
    });
    continue;
  }

  if (/^[-*]\s+/.test(line)) {
    pushParagraph();
    list.push(line.replace(/^[-*]\s+/, ""));
    continue;
  }

  if (/^\d+\.\s+/.test(line)) {
    pushParagraph();
    list.push(line.replace(/^\d+\.\s+/, ""));
    continue;
  }

  if (list.length) pushList();
  paragraph.push(line);
}

flush();

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(
  outputPath,
  `${JSON.stringify({ sections, sources }, null, 2)}\n`,
  "utf8",
);

console.log(`Generated ${outputPath}`);
