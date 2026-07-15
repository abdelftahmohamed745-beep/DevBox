/**
 * JSON Formatter business logic
 */
export const jsonFormatterLogic = {
  /**
   * Format JSON string with customizable indent
   */
  beautify(input: string, indent: number = 2): string {
    if (!input.trim()) return '';
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, indent);
  },

  /**
   * Compact / minify JSON string
   */
  minify(input: string): string {
    if (!input.trim()) return '';
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
  },

  /**
   * Validate JSON syntax and return error description if invalid
   */
  validate(input: string): { isValid: boolean; error?: string } {
    if (!input.trim()) {
      return { isValid: false, error: 'Empty input' };
    }
    try {
      JSON.parse(input);
      return { isValid: true };
    } catch (e: any) {
      return { isValid: false, error: e.message || 'Unknown JSON syntax error' };
    }
  }
};
