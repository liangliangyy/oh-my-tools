"use client"

import { useEffect, useState } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { EditorView } from "@codemirror/view"
import { cn } from "@/lib/utils"
import type { Extension } from "@codemirror/state"

// ─── Dark theme ────────────────────────────────────────────────────────────────
// Background: pure charcoal matching design system canvas
// Syntax: teal keywords, amber strings, green numbers, slate-blue keys
// The .tok-* classes are what defaultHighlightStyle applies in basicSetup

const darkTheme = EditorView.theme({
  "&": {
    backgroundColor: "oklch(0.10 0 0)",
    color: "oklch(0.88 0 0)",
  },
  ".cm-scroller": {
    fontFamily: "var(--font-mono, 'Geist Mono', ui-monospace, monospace)",
    fontSize: "13px",
    lineHeight: "1.65",
  },
  ".cm-content": {
    caretColor: "oklch(0.70 0.15 160)",
    padding: "8px 0",
  },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "oklch(0.70 0.15 160)",
    borderLeftWidth: "2px",
  },
  ".cm-activeLine": { backgroundColor: "oklch(0.55 0.12 160 / 0.09)" },
  ".cm-selectionBackground": {
    backgroundColor: "oklch(0.55 0.15 160 / 0.22) !important",
  },
  "&.cm-focused .cm-selectionBackground": {
    backgroundColor: "oklch(0.55 0.15 160 / 0.26) !important",
  },
  ".cm-gutters": {
    backgroundColor: "oklch(0.08 0 0)",
    color: "oklch(0.35 0 0)",
    border: "none",
    borderRight: "1px solid oklch(0.17 0 0)",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    paddingLeft: "12px",
    paddingRight: "8px",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "oklch(0.55 0.12 160 / 0.09)",
    color: "oklch(0.70 0.15 160)",
  },
  ".cm-foldGutter": { width: "16px" },
  ".cm-foldGutter .cm-gutterElement": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 !important",
    cursor: "pointer",
    color: "oklch(0.35 0 0)",
    transition: "color 0.1s ease",
    userSelect: "none",
  },
  ".cm-foldGutter .cm-gutterElement:hover": {
    color: "oklch(0.70 0.15 160)",
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "oklch(0.22 0.04 160 / 0.4)",
    border: "1px solid oklch(0.35 0.08 160 / 0.35)",
    color: "oklch(0.70 0.15 160)",
    borderRadius: "3px",
    padding: "0 6px",
    fontSize: "11px",
  },
  ".cm-matchingBracket": {
    backgroundColor: "oklch(0.55 0.15 160 / 0.18)",
    outline: "1px solid oklch(0.55 0.15 160 / 0.35)",
    borderRadius: "2px",
  },
  ".cm-tooltip": {
    backgroundColor: "oklch(0.18 0 0)",
    border: "1px solid oklch(0.26 0 0)",
    borderRadius: "6px",
  },
  ".cm-tooltip-autocomplete > ul > li[aria-selected]": {
    backgroundColor: "oklch(0.55 0.15 160 / 0.25)",
    color: "oklch(0.88 0 0)",
  },
  ".cm-placeholder": { color: "oklch(0.38 0 0) !important" },
  "&.cm-focused": { outline: "none" },
  // Syntax token colors — override defaultHighlightStyle inline styles
  // Note: defaultHighlightStyle applies inline styles, these selectors
  // target the generated span elements by matching inline style overrides
  // via higher specificity on the scoped theme.
  // Keyword / bool / null  (teal — accent)
  "& .tok-keyword":      { color: "oklch(0.72 0.14 160) !important" },
  "& .tok-bool":         { color: "oklch(0.72 0.14 160) !important" },
  "& .tok-null":         { color: "oklch(0.58 0.09 160) !important" },
  // String (amber)
  "& .tok-string":       { color: "oklch(0.78 0.12 70)  !important" },
  "& .tok-string2":      { color: "oklch(0.78 0.12 70)  !important" },
  // Number (green)
  "& .tok-number":       { color: "oklch(0.78 0.13 145) !important" },
  // Property names / keys (slate-blue)
  "& .tok-propertyName": { color: "oklch(0.80 0.08 200) !important" },
  "& .tok-variableName": { color: "oklch(0.80 0.08 200) !important" },
  // Comment (muted, italic)
  "& .tok-comment":      { color: "oklch(0.42 0 0) !important", fontStyle: "italic" },
  "& .tok-lineComment":  { color: "oklch(0.42 0 0) !important", fontStyle: "italic" },
  // Type name (amber variant)
  "& .tok-typeName":     { color: "oklch(0.76 0.11 70)  !important" },
  // Tags / attrs (for HTML/JSX)
  "& .tok-tagName":      { color: "oklch(0.72 0.14 160) !important" },
  "& .tok-attributeName":{ color: "oklch(0.78 0.12 70)  !important" },
  // Operator / punctuation
  "& .tok-operator":     { color: "oklch(0.65 0.08 160) !important" },
  "& .tok-punctuation":  { color: "oklch(0.50 0 0)      !important" },
  "& .tok-bracket":      { color: "oklch(0.56 0 0)      !important" },
  "& .tok-brace":        { color: "oklch(0.56 0 0)      !important" },
}, { dark: true })

// ─── Light theme ───────────────────────────────────────────────────────────────

const lightTheme = EditorView.theme({
  "&": {
    backgroundColor: "oklch(0.99 0 0)",
    color: "oklch(0.14 0 0)",
  },
  ".cm-scroller": {
    fontFamily: "var(--font-mono, 'Geist Mono', ui-monospace, monospace)",
    fontSize: "13px",
    lineHeight: "1.65",
  },
  ".cm-content": {
    caretColor: "oklch(0.50 0.15 160)",
    padding: "8px 0",
  },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "oklch(0.50 0.15 160)",
    borderLeftWidth: "2px",
  },
  ".cm-activeLine": { backgroundColor: "oklch(0.52 0.14 185 / 0.06)" },
  ".cm-selectionBackground": {
    backgroundColor: "oklch(0.55 0.15 160 / 0.14) !important",
  },
  "&.cm-focused .cm-selectionBackground": {
    backgroundColor: "oklch(0.55 0.15 160 / 0.18) !important",
  },
  ".cm-gutters": {
    backgroundColor: "oklch(0.96 0 0)",
    color: "oklch(0.58 0 0)",
    border: "none",
    borderRight: "1px solid oklch(0.90 0 0)",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    paddingLeft: "12px",
    paddingRight: "8px",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "oklch(0.52 0.14 185 / 0.06)",
    color: "oklch(0.50 0.15 160)",
  },
  ".cm-foldGutter": { width: "16px" },
  ".cm-foldGutter .cm-gutterElement": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 !important",
    cursor: "pointer",
    color: "oklch(0.62 0 0)",
    transition: "color 0.1s ease",
    userSelect: "none",
  },
  ".cm-foldGutter .cm-gutterElement:hover": {
    color: "oklch(0.50 0.15 160)",
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "oklch(0.93 0.03 160 / 0.5)",
    border: "1px solid oklch(0.80 0.08 160 / 0.35)",
    color: "oklch(0.50 0.15 160)",
    borderRadius: "3px",
    padding: "0 6px",
    fontSize: "11px",
  },
  ".cm-matchingBracket": {
    backgroundColor: "oklch(0.55 0.15 160 / 0.12)",
    outline: "1px solid oklch(0.55 0.15 160 / 0.28)",
    borderRadius: "2px",
  },
  ".cm-tooltip": {
    backgroundColor: "oklch(1 0 0)",
    border: "1px solid oklch(0.88 0 0)",
    borderRadius: "6px",
  },
  ".cm-tooltip-autocomplete > ul > li[aria-selected]": {
    backgroundColor: "oklch(0.55 0.15 160 / 0.12)",
    color: "oklch(0.14 0 0)",
  },
  ".cm-placeholder": { color: "oklch(0.65 0 0) !important" },
  "&.cm-focused": { outline: "none" },
  // Syntax token colors (light mode)
  "& .tok-keyword":      { color: "oklch(0.46 0.16 160) !important" },
  "& .tok-bool":         { color: "oklch(0.46 0.16 160) !important" },
  "& .tok-null":         { color: "oklch(0.52 0.11 160) !important" },
  "& .tok-string":       { color: "oklch(0.50 0.17 30)  !important" },
  "& .tok-string2":      { color: "oklch(0.50 0.17 30)  !important" },
  "& .tok-number":       { color: "oklch(0.40 0.16 145) !important" },
  "& .tok-propertyName": { color: "oklch(0.38 0.14 220) !important" },
  "& .tok-variableName": { color: "oklch(0.38 0.14 220) !important" },
  "& .tok-comment":      { color: "oklch(0.56 0 0) !important", fontStyle: "italic" },
  "& .tok-lineComment":  { color: "oklch(0.56 0 0) !important", fontStyle: "italic" },
  "& .tok-typeName":     { color: "oklch(0.50 0.12 70)  !important" },
  "& .tok-tagName":      { color: "oklch(0.46 0.16 160) !important" },
  "& .tok-attributeName":{ color: "oklch(0.50 0.17 30)  !important" },
  "& .tok-operator":     { color: "oklch(0.46 0.10 160) !important" },
  "& .tok-punctuation":  { color: "oklch(0.42 0 0)      !important" },
  "& .tok-bracket":      { color: "oklch(0.38 0 0)      !important" },
  "& .tok-brace":        { color: "oklch(0.38 0 0)      !important" },
})

// ─── Component ─────────────────────────────────────────────────────────────────

interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  language?: "json" | "javascript" | "typescript" | "yaml" | "text"
  readOnly?: boolean
  className?: string
  height?: string
  placeholder?: string
}

export function CodeEditor({
  value,
  onChange,
  language = "json",
  readOnly = false,
  className,
  height = "280px",
  placeholder,
}: CodeEditorProps) {
  const [isDark, setIsDark] = useState(false)
  const [langExtensions, setLangExtensions] = useState<Extension[]>([])

  useEffect(() => {
    const checkTheme = () => {
      const dark =
        document.documentElement.classList.contains("dark") ||
        (!document.documentElement.classList.contains("light") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      setIsDark(dark)
    }
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const loadLang = async () => {
      try {
        let ext: Extension[] = []
        switch (language) {
          case "json": {
            const { json } = await import("@codemirror/lang-json")
            ext = [json()]
            break
          }
          case "javascript": {
            const { javascript } = await import("@codemirror/lang-javascript")
            ext = [javascript({ jsx: false })]
            break
          }
          case "typescript": {
            const { javascript } = await import("@codemirror/lang-javascript")
            ext = [javascript({ jsx: false, typescript: true })]
            break
          }
          case "yaml": {
            const { yaml } = await import("@codemirror/lang-yaml")
            ext = [yaml()]
            break
          }
          default:
            ext = []
        }
        setLangExtensions(ext)
      } catch {
        setLangExtensions([])
      }
    }
    loadLang()
  }, [language])

  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden",
        "border border-border",
        "focus-within:border-accent/50 transition-colors duration-150",
        className
      )}
    >
      <CodeMirror
        value={value}
        height={height}
        theme={isDark ? darkTheme : lightTheme}
        extensions={langExtensions}
        onChange={(v) => onChange?.(v)}
        editable={!readOnly}
        placeholder={placeholder}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          bracketMatching: true,
          closeBrackets: !readOnly,
          autocompletion: !readOnly,
          highlightActiveLine: true,
          highlightSelectionMatches: false,
          syntaxHighlighting: true,
        }}
      />
    </div>
  )
}
