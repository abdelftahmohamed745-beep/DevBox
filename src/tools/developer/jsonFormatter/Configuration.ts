export interface JsonFormatterConfig {
  defaultIndent: number;
  maxFileSize: number;
  enableSyntaxHighlighting: boolean;
  enableMinification: boolean;
}

export const jsonFormatterConfig: JsonFormatterConfig = {
  defaultIndent: 2,
  maxFileSize: 2 * 1024 * 1024, // 2MB
  enableSyntaxHighlighting: true,
  enableMinification: true
};
