/**
 * Export Service
 * Manages completely secure client-side generation and triggering of downloads.
 */

export const exportService = {
  /**
   * Triggers browser download of a plain text content with custom MIME type
   */
  downloadText(content: string, fileName: string, mimeType: string = 'text/plain;charset=utf-8'): void {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('[ExportService] Failed to trigger file download:', error);
    }
  },

  /**
   * Helper to format and download JSON objects
   */
  exportToJson(data: any, fileName: string): void {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      this.downloadText(jsonString, fileName, 'application/json;charset=utf-8');
    } catch (error) {
      console.error('[ExportService] Failed to export JSON:', error);
    }
  },

  /**
   * Helper to convert an array of objects to CSV string and download it
   */
  exportToCsv(headers: string[], rows: Record<string, any>[], fileName: string): void {
    try {
      const headerLine = headers.join(',');
      const rowLines = rows.map(row => 
        headers.map(header => {
          const val = row[header] ?? '';
          const cleanVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
          // Escape quotes
          const escaped = cleanVal.replace(/"/g, '""');
          return `"${escaped}"`;
        }).join(',')
      );
      
      const csvContent = [headerLine, ...rowLines].join('\n');
      this.downloadText(csvContent, fileName, 'text/csv;charset=utf-8');
    } catch (error) {
      console.error('[ExportService] Failed to export CSV:', error);
    }
  }
};
