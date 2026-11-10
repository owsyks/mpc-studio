"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface MathRendererProps {
  content: string;
  className?: string;
  block?: boolean;
}

export function MathRenderer({ content, className = "", block = false }: MathRendererProps) {
  const renderedHtml = useMemo(() => {
    if (!content) return "";

    if (block) {
      try {
        return katex.renderToString(content, {
          displayMode: true,
          throwOnError: false,
        });
      } catch (e) {
        return content;
      }
    }

    // Split text by $$...$$ for block math and $...$ for inline math
    const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$)/g);

    return parts
      .map((part) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          const math = part.slice(2, -2).trim();
          try {
            return katex.renderToString(math, {
              displayMode: true,
              throwOnError: false,
            });
          } catch (e) {
            return part;
          }
        } else if (part.startsWith("$") && part.endsWith("$")) {
          const math = part.slice(1, -1).trim();
          try {
            return katex.renderToString(math, {
              displayMode: false,
              throwOnError: false,
            });
          } catch (e) {
            return part;
          }
        }
        // Return plain text replacing newlines with <br />
        return part.replace(/\n/g, "<br />");
      })
      .join("");
  }, [content, block]);

  return (
    <span
      className={`math-content ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}
