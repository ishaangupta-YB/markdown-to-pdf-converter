import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import type { Extension } from "@codemirror/state";

export const buildEditorTheme = (font: string, color: string): Extension => {
  const base = EditorView.theme(
    {
      "&": {
        backgroundColor: "var(--color-paper-2)",
        color,
        fontSize: "14px",
        height: "100%",
      },
      ".cm-content": {
        fontFamily: font,
        caretColor: "var(--color-accent)",
        padding: "16px 0",
      },
      ".cm-scroller": {
        fontFamily: font,
        lineHeight: "1.7",
      },
      "&.cm-focused": {
        outline: "none",
      },
      ".cm-gutters": {
        backgroundColor: "var(--color-paper-2)",
        color: "var(--color-neutral)",
        border: "none",
        borderRight: "1px solid var(--color-rule)",
        fontFamily: '"Geist Mono", monospace',
      },
      ".cm-activeLineGutter": {
        backgroundColor: "var(--color-paper)",
        color: "var(--color-ink)",
      },
      ".cm-activeLine": {
        backgroundColor: "oklch(94% 0.012 80 / 0.6)",
      },
      ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: "var(--color-accent)",
        borderLeftWidth: "2px",
      },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection":
        {
          backgroundColor: "oklch(82% 0.09 250 / 0.5)",
        },
      ".cm-selectionMatch": {
        backgroundColor: "oklch(85% 0.07 250 / 0.45)",
      },
      ".cm-foldPlaceholder": {
        backgroundColor: "var(--color-paper)",
        border: "1px solid var(--color-rule)",
        color: "var(--color-muted)",
      },
    },
    { dark: false }
  );

  const highlight = HighlightStyle.define([
    { tag: t.heading, color: "var(--color-accent)", fontWeight: "700" },
    { tag: t.strong, color: "var(--color-ink)", fontWeight: "700" },
    { tag: t.emphasis, color: "var(--color-muted)", fontStyle: "italic" },
    { tag: t.link, color: "var(--color-accent)", textDecoration: "underline" },
    { tag: t.url, color: "var(--color-neutral)" },
    { tag: [t.quote], color: "var(--color-muted)", fontStyle: "italic" },
    {
      tag: [t.monospace, t.contentSeparator],
      color: "oklch(45% 0.13 160)",
    },
    { tag: t.list, color: "var(--color-accent)" },
    { tag: t.comment, color: "var(--color-neutral)", fontStyle: "italic" },
    { tag: [t.keyword, t.modifier], color: "oklch(48% 0.16 300)" },
    { tag: [t.string, t.special(t.string)], color: "oklch(45% 0.13 150)" },
    { tag: [t.number, t.bool, t.atom], color: "oklch(50% 0.15 40)" },
    { tag: [t.processingInstruction, t.meta], color: "var(--color-neutral)" },
  ]);

  return [base, syntaxHighlighting(highlight)];
};
