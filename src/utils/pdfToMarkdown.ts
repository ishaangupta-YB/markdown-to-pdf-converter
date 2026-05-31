import * as mupdf from "mupdf";

interface JsonFont {
  name?: string;
  family?: string;
  weight?: string;
  style?: string;
  size?: number;
}

interface JsonLine {
  text?: string;
  spans?: { text?: string }[];
  font?: JsonFont;
  y?: number;
  bbox?: { x?: number; y?: number; w?: number; h?: number };
}

interface JsonBlock {
  type?: string;
  lines?: JsonLine[];
}

interface StructuredJson {
  blocks?: JsonBlock[];
}

interface Line {
  text: string;
  size: number;
  bold: boolean;
}

type Token =
  | { type: "heading"; text: string }
  | { type: "list"; text: string }
  | { type: "para"; text: string };

const median = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

const readLineText = (line: JsonLine): string => {
  if (typeof line.text === "string") return line.text;
  if (Array.isArray(line.spans)) {
    return line.spans.map((span) => span.text ?? "").join("");
  }
  return "";
};

const toLine = (raw: JsonLine): Line | null => {
  const text = readLineText(raw).replace(/\s+/g, " ").trim();
  if (!text) return null;
  const font = raw.font ?? {};
  const weight = (font.weight ?? "").toString().toLowerCase();
  return {
    text,
    size: font.size ?? 0,
    bold: weight.includes("bold") || weight === "700" || weight === "800",
  };
};

const formatLine = (line: Line, bodySize: number): Token => {
  const ratio = bodySize > 0 ? line.size / bodySize : 1;
  const { text } = line;

  const bulletMatch = text.match(
    /^[-*\u2022\u00B7\u25AA\u25E6\u2023\u2043]\s+(.*)$/
  );
  if (bulletMatch) {
    return { type: "list", text: `- ${bulletMatch[1].trim()}` };
  }

  const numberedMatch = text.match(/^(\d+)[.)]\s+(.*)$/);
  if (numberedMatch) {
    return {
      type: "list",
      text: `${numberedMatch[1]}. ${numberedMatch[2].trim()}`,
    };
  }

  const isShort = text.length <= 120;
  if (isShort && ratio >= 1.7) return { type: "heading", text: `# ${text}` };
  if (isShort && ratio >= 1.4) return { type: "heading", text: `## ${text}` };
  if (isShort && ratio >= 1.18) return { type: "heading", text: `### ${text}` };
  if (isShort && line.bold && ratio >= 1.05) {
    return { type: "heading", text: `#### ${text}` };
  }
  if (isShort && line.bold) {
    return { type: "para", text: `**${text}**` };
  }

  return { type: "para", text };
};

export interface PdfConvertResult {
  markdown: string;
  pages: number;
  hadText: boolean;
}

export const pdfToMarkdown = async (
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<PdfConvertResult> => {
  const data = new Uint8Array(await file.arrayBuffer());
  const doc = mupdf.Document.openDocument(data, "application/pdf");

  try {
    const numPages = doc.countPages();
    const blocks: Line[][] = [];
    const allSizes: number[] = [];

    for (let i = 0; i < numPages; i++) {
      const page = doc.loadPage(i);
      const stext = page.toStructuredText();
      try {
        const json = JSON.parse(stext.asJSON()) as StructuredJson;
        for (const block of json.blocks ?? []) {
          if (block.type && block.type !== "text") continue;
          const lines: Line[] = [];
          for (const rawLine of block.lines ?? []) {
            const line = toLine(rawLine);
            if (line) {
              lines.push(line);
              if (line.size > 0) allSizes.push(line.size);
            }
          }
          if (lines.length > 0) blocks.push(lines);
        }
      } finally {
        stext.destroy();
        page.destroy();
      }
      onProgress?.(i + 1, numPages);
    }

    const bodySize = median(allSizes);
    const tokens: Token[] = [];

    for (const lines of blocks) {
      let paragraph: string[] = [];
      const flushParagraph = () => {
        if (paragraph.length > 0) {
          tokens.push({ type: "para", text: paragraph.join(" ") });
          paragraph = [];
        }
      };

      for (const line of lines) {
        const token = formatLine(line, bodySize);
        if (token.type === "para" && !token.text.startsWith("**")) {
          paragraph.push(token.text);
        } else {
          flushParagraph();
          tokens.push(token);
        }
      }
      flushParagraph();
    }

    let markdown = "";
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (i > 0) {
        const prev = tokens[i - 1];
        const tightList = token.type === "list" && prev.type === "list";
        markdown += tightList ? "\n" : "\n\n";
      }
      markdown += token.text;
    }

    return {
      markdown: markdown.trim(),
      pages: numPages,
      hadText: allSizes.length > 0 || tokens.length > 0,
    };
  } finally {
    doc.destroy();
  }
};
