/**
 * Search Service
 * Advanced multi-filter and synonym-aware search engine for developer utilities.
 */

export const SEARCH_SYNONYMS: Record<string, string[]> = {
  'beautify': ['json-formatter', 'css-formatter', 'javascript-formatter', 'sql-formatter', 'html-formatter-beautifier', 'yaml-formatter', 'xml-formatter'],
  'minify': ['json-minifier', 'html-minifier', 'sql-minify', 'json-minify-advanced'],
  'compress': ['pdf-compress', 'img-contrast-adjust', 'video-compressor', 'audio-compressor'],
  'base64': ['img-base64-encode', 'base64-image'],
  'encrypt': ['aes-encryption', 'bcrypt-generator', 'sha256-hasher'],
  'hash': ['sha256-hasher', 'sha512-hasher', 'md5-hasher', 'sha1-hasher'],
  'trim': ['video-trimmer', 'video-cutter', 'audio-cutter'],
  'quality': ['media-quality-enhancer'],
  'upscale': ['media-quality-enhancer'],
  'vtt': ['srt-vtt-converter', 'subtitle-editor'],
  'jwt': ['jwt-debugger', 'jwt-generator-tool'],
  'regex': ['regex-builder', 'regex-cheatsheet'],
  'convert': ['yaml-to-json', 'json-to-yaml', 'toml-to-json', 'json-to-csv', 'unit-converter-pro', 'epoch-converter', 'binary-converter', 'morse-converter'],
  'format': ['json-formatter', 'css-formatter', 'javascript-formatter', 'sql-formatter', 'yaml-formatter', 'xml-formatter'],
  'sql': ['sql-formatter', 'sql-minify', 'sql-mock-gen', 'database'],
  'diff': ['text-diff', 'diff-checker-pro'],
  'pwa': ['about'],
  'offline': ['about'],
};

export const searchService = {
  /**
   * Get synonyms map
   */
  getSynonyms(): Record<string, string[]> {
    return SEARCH_SYNONYMS;
  },

  /**
   * Find matching tool IDs by synonym match
   */
  getSynonymMatches(query: string): string[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    
    const matches: string[] = [];
    Object.entries(SEARCH_SYNONYMS).forEach(([keyword, toolIds]) => {
      if (q.includes(keyword) || keyword.includes(q)) {
        matches.push(...toolIds);
      }
    });
    return matches;
  },

  /**
   * Match tools based on translated names, descriptions, tags, and synonyms
   */
  searchTools(query: string, tools: any[]): any[] {
    const q = query.toLowerCase().trim();
    if (!q) return tools.filter(t => t.popular || t.featured).slice(0, 5);

    const synonymMatches = this.getSynonymMatches(q);

    return tools.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.description.toLowerCase().includes(q) || 
      t.tags.some((tag: string) => tag.toLowerCase().includes(q)) ||
      synonymMatches.includes(t.id)
    );
  }
};
