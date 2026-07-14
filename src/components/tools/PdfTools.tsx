import React, { useState } from 'react';
import { Copy, Check, FileText, Download, Image as ImageIcon, Sparkles } from 'lucide-react';

// 1. Text to PDF (Client-side custom iframe sandbox printing technique)
const TextToPdf = () => {
  const [title, setTitle] = useState('My Developer Report');
  const [content, setContent] = useState('Type or paste standard report notes here. Click "Generate Document PDF" to trigger the browser sandbox print manager, where you can save this cleanly structured file offline as a standard Letter or A4 PDF.');
  const [theme, setTheme] = useState<'modern' | 'classic' | 'mono'>('modern');

  const handlePrint = () => {
    // Elegant standard sandbox printing iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';

    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    const fontStyle = theme === 'classic' ? 'Georgia, serif' : theme === 'mono' ? 'Courier, monospace' : 'system-ui, sans-serif';
    const borderAccent = theme === 'modern' ? 'solid 4px #0ea5e9' : theme === 'classic' ? 'double 3px #1e293b' : 'solid 1px #000';

    doc.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: ${fontStyle};
              padding: 40px;
              color: #1e293b;
              line-height: 1.6;
            }
            .header {
              border-bottom: ${borderAccent};
              padding-bottom: 12px;
              margin-bottom: 24px;
            }
            h1 {
              font-size: 28px;
              margin: 0;
              font-weight: 700;
            }
            .date {
              font-size: 12px;
              color: #64748b;
              margin-top: 4px;
            }
            .body {
              font-size: 14px;
              white-space: pre-wrap;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <div class="date">Generated via DevBox on ${new Date().toLocaleDateString()}</div>
          </div>
          <div class="body">${content}</div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.parent.document.body.removeChild(window.frameElement);
              }, 100);
            }
          </script>
        </body>
      </html>
    `);
    doc.close();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border">
        <label className="flex flex-col gap-1 text-xs font-semibold">
          <span>Document Title</span>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold">
          <span>Editorial Theme Accent</span>
          <select value={theme} onChange={(e) => setTheme(e.target.value as any)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-bold">
            <option value="modern">Modern (Sky Accent)</option>
            <option value="classic">Classic (Serif Formal)</option>
            <option value="mono">Minimal Monospace</option>
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-neutral-500">Document Body Content</span>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full h-44 p-3 bg-white dark:bg-neutral-950 border rounded-xl text-xs" />
      </div>

      <button onClick={handlePrint} className="flex items-center justify-center gap-2 w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
        <FileText className="w-4 h-4" />
        <span>Generate Document PDF File</span>
      </button>
    </div>
  );
};

// 2. Images to PDF Converter
const ImgToPdf = () => {
  const [images, setImages] = useState<string[]>([]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    files.forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePrint = () => {
    if (images.length === 0) return;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';

    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    const imgTags = images.map(img => `
      <div class="page">
        <img src="${img}" />
      </div>
    `).join('');

    doc.write(`
      <html>
        <head>
          <style>
            @page {
              size: auto;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
            }
            .page {
              page-break-after: always;
              width: 100vw;
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: white;
            }
            img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          ${imgTags}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.parent.document.body.removeChild(window.frameElement);
              }, 100);
            }
          </script>
        </body>
      </html>
    `);
    doc.close();
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-center bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer relative">
        <input type="file" multiple accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
        <div className="flex flex-col items-center gap-1.5">
          <ImageIcon className="w-8 h-8 text-sky-500" />
          <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Click to import image slides</span>
          <span className="text-[10px] text-neutral-400">PNG, JPG, SVG, WebP supported</span>
        </div>
      </div>

      {images.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="aspect-square rounded-xl overflow-hidden border relative group bg-neutral-100">
                <img src={img} className="w-full h-full object-cover" />
                <button
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button onClick={handlePrint} className="flex items-center justify-center gap-2 w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
            <Download className="w-4 h-4" />
            <span>Compile into PDF Pages</span>
          </button>
        </div>
      )}
    </div>
  );
};

export const pdfToolsComponents: Record<string, () => React.JSX.Element> = {
  'text-to-pdf': TextToPdf,
  'img-to-pdf': ImgToPdf,
};
