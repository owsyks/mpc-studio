import courseKbData from "@/data/course_kb.json";

export interface KnowledgeChunk {
  id: string;
  sourcePdf: string;
  page: number;
  moduleId: string;
  chapter: string;
  title: string;
  content: string;
  latex?: string[];
  keywords?: string[];
}

export interface SearchResult {
  chunk: KnowledgeChunk;
  score: number;
}

export class RagService {
  private static chunks: KnowledgeChunk[] = courseKbData as KnowledgeChunk[];

  /**
   * Search knowledge base for relevant course context
   */
  public static retrieve(query: string, moduleId?: string, limit: number = 3): SearchResult[] {
    const terms = query
      .toLowerCase()
      .replace(/[^\w\s\u00C0-\u017F]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 2);

    const scored = this.chunks.map((chunk) => {
      let score = 0;

      // Module boost
      if (moduleId && chunk.moduleId === moduleId) {
        score += 3;
      }

      const textLower = (chunk.title + " " + chunk.content).toLowerCase();

      for (const term of terms) {
        // Direct title match
        if (chunk.title.toLowerCase().includes(term)) {
          score += 4;
        }
        // Content match
        if (textLower.includes(term)) {
          score += 1.5;
        }
        // Keywords match
        if (chunk.keywords?.some((k) => k.toLowerCase().includes(term))) {
          score += 3;
        }
      }

      return { chunk, score };
    });

    return scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Format context for AI tutor system prompt
   */
  public static formatContextForPrompt(results: SearchResult[]): string {
    if (results.length === 0) return "";

    let ctx = "\n--- DOCUMENTS OFFICIELS DU COURS (UNIVERSITÉ ORAN 1) ---\n";
    for (const res of results) {
      const c = res.chunk;
      ctx += `\n[Source : ${c.sourcePdf} — Page ${c.page} | ${c.chapter} | ${c.title}]\n`;
      ctx += `${c.content}\n`;
      if (c.latex && c.latex.length > 0) {
        ctx += `Formules clés : ${c.latex.join(", ")}\n`;
      }
    }
    ctx += "--------------------------------------------------------\n";
    return ctx;
  }
}
