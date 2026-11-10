"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface MathRendererProps {
  content: string;
  className?: string;
  block?: boolean;
}

/**
 * Normalizes common LaTeX shorthand symbols used in university course notes
 */
function normalizeLatexSymbols(math: string): string {
  return math
    .replace(/\\Z(?![a-zA-Z])/g, "\\mathbb{Z}")
    .replace(/\\R(?![a-zA-Z])/g, "\\mathbb{R}")
    .replace(/\\N(?![a-zA-Z])/g, "\\mathbb{N}")
    .replace(/\\C(?![a-zA-Z])/g, "\\mathbb{C}")
    .replace(/\\Q(?![a-zA-Z])/g, "\\mathbb{Q}")
    .replace(/\\Ker(?![a-zA-Z])/g, "\\ker")
    .replace(/\\Im(?![a-zA-Z])/g, "\\operatorname{Im}")
    .replace(/\\pgcd(?![a-zA-Z])/g, "\\gcd");
}

export function MathRenderer({ content, className = "", block = false }: MathRendererProps) {
  const renderedHtml = useMemo(() => {
    if (!content) return "";

    if (block) {
      try {
        const normalized = normalizeLatexSymbols(content.trim());
        return katex.renderToString(normalized, {
          displayMode: true,
          throwOnError: false,
        });
      } catch (e) {
        return content;
      }
    }

    // Standardize \[...\] to $$...$$ and \(...\) to $...$
    let text = content
      .replace(/\\\[([\s\S]+?)\\\]/g, (_, math) => `$$${math}$$`)
      .replace(/\\\(([\s\S]+?)\\\)/g, (_, math) => `$${math}$`);

    // Split text by $$...$$ for block math and $...$ for inline math
    const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g);

    return parts
      .map((part) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          const rawMath = part.slice(2, -2).trim();
          const math = normalizeLatexSymbols(rawMath);
          try {
            return `<div class="katex-block-wrapper my-2">${katex.renderToString(math, {
              displayMode: true,
              throwOnError: false,
            })}</div>`;
          } catch (e) {
            return part;
          }
        } else if (part.startsWith("$") && part.endsWith("$")) {
          const rawMath = part.slice(1, -1).trim();
          const math = normalizeLatexSymbols(rawMath);
          try {
            return katex.renderToString(math, {
              displayMode: false,
              throwOnError: false,
            });
          } catch (e) {
            return part;
          }
        }

        // Format Markdown text outside of math formulas
        let formatted = part
          // Bold **text**
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          // Italic *text*
          .replace(/\*([^\*]+?)\*/g, "<em>$1</em>")
          // Inline code `code`
          .replace(/`([^`]+?)`/g, "<code class='bg-muted/70 px-1.5 py-0.5 rounded text-[11px] font-mono'>$1</code>")
          // Markdown Headings ### Title
          .replace(/^### (.*$)/gim, "<h3 class='text-sm font-bold text-foreground mt-3 mb-1.5'>$1</h3>")
          .replace(/^## (.*$)/gim, "<h2 class='text-base font-bold text-foreground mt-4 mb-2'>$1</h2>")
          // Line breaks
          .replace(/\n/g, "<br />");

        return formatted;
      })
      .join("");
  }, [content, block]);

  return (
    <span
      className={`math-content text-[13px] sm:text-sm leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}
