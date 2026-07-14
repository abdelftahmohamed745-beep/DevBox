import React, { useState, useEffect } from 'react';
import { 
  Check, Copy, Trash2, Download, RefreshCw, FileCode, Terminal, 
  Settings, Braces, Sparkles, Code, Hash, Binary, AlertCircle, Info
} from 'lucide-react';
import { getInitialLanguage, t } from '../../data/translations';

// ==========================================
// SHARED UTILITY COMPONENTS & HELPERS
// ==========================================

const downloadTextFile = (content: string, fileName: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const CopyButton = ({ text, label }: { text: string; label?: string }) => {
  const [copied, setCopied] = useState(false);
  const lang = getInitialLanguage();
  
  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const copyLabel = label || t('Copy', lang);
  const copiedLabel = t('Copied!', lang);

  return (
    <button
      onClick={handleCopy}
      disabled={!text}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-750 dark:text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{copiedLabel}</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>{copyLabel}</span>
        </>
      )}
    </button>
  );
};

const ClearButton = ({ onClear, disabled }: { onClear: () => void; disabled?: boolean }) => {
  const lang = getInitialLanguage();
  return (
    <button
      onClick={onClear}
      disabled={disabled}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-450 dark:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-750 dark:text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
      title="Clear fields"
    >
      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
      <span>{t('Clear', lang)}</span>
    </button>
  );
};

const DownloadButton = ({ content, fileName, disabled, label }: { content: string; fileName: string; disabled?: boolean; label?: string }) => {
  const lang = getInitialLanguage();
  return (
    <button
      onClick={() => downloadTextFile(content, fileName)}
      disabled={disabled || !content}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-750 dark:text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
      title="Download output as file"
    >
      <Download className="w-3.5 h-3.5 text-blue-500" />
      <span>{label || t('Download', lang)}</span>
    </button>
  );
};

const ToolDescription = ({ title, description, tip }: { title: string; description: string; tip?: string }) => {
  const lang = getInitialLanguage();
  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-150 dark:border-slate-800/80 mb-5 text-left">
      <div className="flex gap-2.5 items-start">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-1 text-slate-700 dark:text-slate-300">
          <h4 className="text-xs font-black tracking-wide text-slate-800 dark:text-slate-200 uppercase">{t(title, lang)}</h4>
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
            {t(description, lang)}
          </p>
          {tip && (
            <p className="text-[10px] leading-normal text-amber-600 dark:text-amber-400 font-semibold pt-1">
              {t('💡 Pro Tip:', lang)} {t(tip, lang)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const ValidationBadge = ({ isValid, message, checkingMsg }: { isValid: boolean | null; message: string; checkingMsg?: string }) => {
  const lang = getInitialLanguage();
  const validMsg = t(message || 'Valid Input', lang);
  const invalidMsg = t('Validation Error', lang);
  const waitMsg = t(checkingMsg || 'Ready for input', lang);

  if (isValid === true) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-450 border border-emerald-200/30">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        {validMsg}
      </span>
    );
  }
  if (isValid === false) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-450 border border-rose-200/30">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        {invalidMsg}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/20">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
      {waitMsg}
    </span>
  );
};

// ==========================================
// 1. JSON FORMATTER COMPONENT
// ==========================================
export const JsonFormatter = () => {
  const [input, setInput] = useState('{\n  "app": "DevBox",\n  "secure": true,\n  "tools": ["formatter", "validator", "minifier"]\n}');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const lang = getInitialLanguage();

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setIsValid(null);
      setErrorMsg('');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setIsValid(true);
      setErrorMsg('');
    } catch (e: any) {
      setIsValid(false);
      setErrorMsg(e.message);
      setOutput('');
    }
  }, [input, indent]);

  return (
    <div className="space-y-4 text-left">
      <ToolDescription 
        title="JSON Formatter"
        description="Format and prettify messy JSON data locally with customizable indentation settings."
        tip="Ensure keys and strings are double-quoted."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-150 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <span>{t('Indentation', lang)}:</span>
            <select
              value={indent}
              onChange={(e) => setIndent(parseInt(e.target.value))}
              className="px-2 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-xs font-bold focus:outline-none"
            >
              <option value={2}>2 {t('Spaces', lang)}</option>
              <option value={4}>4 {t('Spaces', lang)}</option>
              <option value={8}>8 {t('Spaces', lang)}</option>
            </select>
          </label>
          <ValidationBadge isValid={isValid} message="JSON Valid" checkingMsg="Waiting for inputs" />
        </div>
        <ClearButton onClear={() => setInput('')} disabled={!input} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
            {t('Raw JSON Input Panel', lang)}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste raw JSON here..."
            className="w-full h-80 p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono font-bold leading-relaxed text-slate-800 dark:text-slate-150 shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
              {t('Parsed Format Result', lang)}
            </span>
            <div className="flex items-center gap-1.5">
              <CopyButton text={output} />
              <DownloadButton content={output} fileName="formatted.json" />
            </div>
          </div>
          {isValid === false ? (
            <div className="w-full h-80 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex gap-2.5 items-start font-mono font-semibold overflow-y-auto">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-500 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">{t('JSON Syntax Compilation Error:', lang)}</span>
                <p className="bg-white/40 dark:bg-black/20 p-2 rounded">{errorMsg}</p>
              </div>
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              placeholder="Beautified JSON will format here..."
              className="w-full h-80 p-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-xs font-mono font-bold leading-relaxed select-all text-slate-800 dark:text-slate-150"
            />
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. JSON MINIFIER COMPONENT
// ==========================================
export const JsonMinifier = () => {
  const [input, setInput] = useState('{\n  "app": "DevBox",\n  "secure": true,\n  "tools": ["formatter", "validator", "minifier"]\n}');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const lang = getInitialLanguage();

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setIsValid(null);
      setErrorMsg('');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setIsValid(true);
      setErrorMsg('');
    } catch (e: any) {
      setIsValid(false);
      setErrorMsg(e.message);
      setOutput('');
    }
  }, [input]);

  return (
    <div className="space-y-4 text-left">
      <ToolDescription 
        title="JSON Minifier"
        description="Compress, compact and minify raw JSON payloads into a single highly efficient network-ready line."
        tip="Compression removes all spaces, tabs, and newlines to preserve server bandwidth."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-150 dark:border-slate-800/80 shadow-sm">
        <ValidationBadge isValid={isValid} message="JSON Valid" checkingMsg="Waiting for inputs" />
        <ClearButton onClear={() => setInput('')} disabled={!input} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
            {t('Raw JSON Input Panel', lang)}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste JSON content to minify..."
            className="w-full h-80 p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono font-bold leading-relaxed text-slate-800 dark:text-slate-150 shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
              {t('Minified Result', lang)}
            </span>
            <div className="flex items-center gap-1.5">
              <CopyButton text={output} />
              <DownloadButton content={output} fileName="minified.json" />
            </div>
          </div>
          {isValid === false ? (
            <div className="w-full h-80 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex gap-2.5 items-start font-mono font-semibold overflow-y-auto">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-500 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">{t('JSON Syntax Compilation Error:', lang)}</span>
                <p className="bg-white/40 dark:bg-black/20 p-2 rounded">{errorMsg}</p>
              </div>
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              placeholder="Compressed single line JSON output..."
              className="w-full h-80 p-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-xs font-mono font-bold leading-relaxed select-all text-slate-800 dark:text-slate-150 break-all"
            />
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. CSS FORMATTER COMPONENT
// ==========================================
export const CssFormatter = () => {
  const [input, setInput] = useState('body{background-color:#f3f4f6;margin:0;padding:20px}.card{border-radius:12px;background:white;padding:16px;box-shadow:0 4px 6px rgba(0,0,0,0.05)}');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const lang = getInitialLanguage();

  const formatCSS = (css: string, size: number) => {
    let formatted = '';
    let depth = 0;
    const tab = ' '.repeat(size);
    // Collapse spacing and put newlines appropriately
    const tokens = css
      .replace(/\s*([{}::;,])\s*/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();

    for (let i = 0; i < tokens.length; i++) {
      const char = tokens[i];
      if (char === '{') {
        depth++;
        formatted += ' {\n' + tab.repeat(depth);
      } else if (char === '}') {
        depth--;
        formatted = formatted.trimEnd() + '\n' + tab.repeat(depth) + '}\n\n' + tab.repeat(depth);
      } else if (char === ';') {
        formatted += ';\n' + tab.repeat(depth);
      } else if (char === ',') {
        formatted += ', ';
      } else if (char === ':') {
        formatted += ': ';
      } else {
        formatted += char;
      }
    }
    return formatted.replace(/\n\s*\n/g, '\n\n').replace(/\s+$/g, '').trim();
  };

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setIsValid(null);
      return;
    }
    const result = formatCSS(input, indent);
    setOutput(result);
    setIsValid(true);
  }, [input, indent]);

  return (
    <div className="space-y-4 text-left">
      <ToolDescription 
        title="CSS Formatter"
        description="Format, indent, and prettify CSS scripts to make stylesheets readable and standard."
        tip="Aligns selectors, properties, values, and correctly indents rules."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-150 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <span>{t('Indentation', lang)}:</span>
            <select
              value={indent}
              onChange={(e) => setIndent(parseInt(e.target.value))}
              className="px-2 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-xs font-bold focus:outline-none"
            >
              <option value={2}>2 {t('Spaces', lang)}</option>
              <option value={4}>4 {t('Spaces', lang)}</option>
              <option value={8}>8 {t('Spaces', lang)}</option>
            </select>
          </label>
          <ValidationBadge isValid={isValid} message="CSS Prettified" checkingMsg="Waiting for inputs" />
        </div>
        <ClearButton onClear={() => setInput('')} disabled={!input} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
            {t('Raw CSS Input', lang)}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste messy or minified CSS stylesheet..."
            className="w-full h-80 p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono font-bold leading-relaxed text-slate-800 dark:text-slate-150 shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
              {t('Beautified Output', lang)}
            </span>
            <div className="flex items-center gap-1.5">
              <CopyButton text={output} />
              <DownloadButton content={output} fileName="style.css" />
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Formatted CSS will output here..."
            className="w-full h-80 p-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-xs font-mono font-bold leading-relaxed select-all text-slate-800 dark:text-slate-150"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. JAVASCRIPT FORMATTER COMPONENT
// ==========================================
export const JavaScriptFormatter = () => {
  const [input, setInput] = useState('function calculateSum(a,b){const sum=a+b;if(sum>10){console.log("Sum is larger than 10")}return sum}');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const lang = getInitialLanguage();

  const formatJS = (js: string, size: number) => {
    let formatted = '';
    let depth = 0;
    const tab = ' '.repeat(size);
    const tokens = js
      .replace(/\s*([{}()\[\];,])\s*/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();

    for (let i = 0; i < tokens.length; i++) {
      const char = tokens[i];
      if (char === '{' || char === '[') {
        depth++;
        formatted += ' ' + char + '\n' + tab.repeat(depth);
      } else if (char === '}' || char === ']') {
        depth--;
        formatted = formatted.trimEnd() + '\n' + tab.repeat(depth) + char + '\n' + tab.repeat(depth);
      } else if (char === ';') {
        formatted += ';\n' + tab.repeat(depth);
      } else if (char === ',') {
        formatted += ', ';
      } else {
        formatted += char;
      }
    }
    return formatted.replace(/\n\s*\n/g, '\n').replace(/\s+$/g, '').trim();
  };

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setIsValid(null);
      return;
    }
    const result = formatJS(input, indent);
    setOutput(result);
    setIsValid(true);
  }, [input, indent]);

  return (
    <div className="space-y-4 text-left">
      <ToolDescription 
        title="JavaScript Formatter"
        description="Prettify and beautify messy or compact JavaScript code fragments."
        tip="Cleans brackets, commas, semicolons, and indentations."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-150 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <span>{t('Indentation', lang)}:</span>
            <select
              value={indent}
              onChange={(e) => setIndent(parseInt(e.target.value))}
              className="px-2 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-xs font-bold focus:outline-none"
            >
              <option value={2}>2 {t('Spaces', lang)}</option>
              <option value={4}>4 {t('Spaces', lang)}</option>
              <option value={8}>8 {t('Spaces', lang)}</option>
            </select>
          </label>
          <ValidationBadge isValid={isValid} message="JS Formatted" checkingMsg="Waiting for inputs" />
        </div>
        <ClearButton onClear={() => setInput('')} disabled={!input} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
            {t('Raw JavaScript Input', lang)}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste raw JS code snippet..."
            className="w-full h-80 p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono font-bold leading-relaxed text-slate-800 dark:text-slate-150 shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
              {t('Formatted JavaScript Result', lang)}
            </span>
            <div className="flex items-center gap-1.5">
              <CopyButton text={output} />
              <DownloadButton content={output} fileName="script.js" />
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Beautified JavaScript code..."
            className="w-full h-80 p-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-xs font-mono font-bold leading-relaxed select-all text-slate-800 dark:text-slate-150"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. SQL FORMATTER COMPONENT
// ==========================================
export const SqlFormatter = () => {
  const [input, setInput] = useState('select id, name, role from users left join activities on users.id = activities.user_id where status = \'active\' group by users.id limit 100;');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const lang = getInitialLanguage();

  const formatSQL = (sql: string) => {
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER',
      'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'INSERT INTO', 'VALUES', 'UPDATE',
      'SET', 'DELETE', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'UNION', 'ALL', 'AS'
    ];
    let cleaned = sql
      .replace(/\s+/g, ' ')
      .trim();

    // Capitalize keywords case-insensitively
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      cleaned = cleaned.replace(regex, kw);
    });

    // Add newlines before major clauses
    const breakKeywords = ['FROM', 'WHERE', 'AND', 'OR', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'SET', 'VALUES'];
    breakKeywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'g');
      cleaned = cleaned.replace(regex, `\n${kw}`);
    });

    // Handle indentation under clauses
    const lines = cleaned.split('\n');
    let formatted = '';
    lines.forEach(line => {
      let trimmed = line.trim();
      if (trimmed) {
        const isHeader = keywords.some(kw => trimmed.startsWith(kw)) && !trimmed.startsWith('AND') && !trimmed.startsWith('OR') && !trimmed.startsWith('ON');
        formatted += (isHeader ? '' : '  ') + trimmed + '\n';
      }
    });

    return formatted.trim();
  };

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setIsValid(null);
      return;
    }
    setOutput(formatSQL(input));
    setIsValid(true);
  }, [input]);

  return (
    <div className="space-y-4 text-left">
      <ToolDescription 
        title="SQL Formatter"
        description="Clean and prettify messy raw SQL statements with uppercase syntax commands for optimal query auditing."
        tip="Keywords like SELECT, FROM, WHERE, and JOIN are automatically capitalized and formatted onto separate lines."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-150 dark:border-slate-800/80 shadow-sm">
        <ValidationBadge isValid={isValid} message="SQL Beautified" checkingMsg="Waiting for inputs" />
        <ClearButton onClear={() => setInput('')} disabled={!input} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
            {t('Raw SQL Query Input', lang)}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="select * from tbl where col = 1"
            className="w-full h-80 p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono font-bold leading-relaxed text-slate-800 dark:text-slate-150 shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
              {t('Beautified SQL Result', lang)}
            </span>
            <div className="flex items-center gap-1.5">
              <CopyButton text={output} />
              <DownloadButton content={output} fileName="query.sql" />
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Formatted SQL query statements..."
            className="w-full h-80 p-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-xs font-mono font-bold leading-relaxed select-all text-slate-800 dark:text-slate-150"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. RANDOM STRING GENERATOR COMPONENT
// ==========================================
export const RandomStringGen = () => {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [count, setCount] = useState(5);
  const [strings, setStrings] = useState<string[]>([]);
  const lang = getInitialLanguage();

  const generateStrings = () => {
    let chars = '';
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (excludeSimilar) {
      chars = chars.replace(/[ilI1L|oO0]/g, '');
    }

    if (!chars) {
      setStrings([]);
      return;
    }

    const list = [];
    for (let c = 0; c < count; c++) {
      let str = '';
      for (let i = 0; i < length; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      list.push(str);
    }
    setStrings(list);
  };

  useEffect(() => {
    generateStrings();
  }, [length, uppercase, lowercase, numbers, symbols, excludeSimilar, count]);

  return (
    <div className="space-y-4 text-left">
      <ToolDescription 
        title="Random String Generator"
        description="Generate multiple customizable random high-entropy strings for app secrets, password salts, and unique identifiers."
        tip="Exclude similar characters (like l, 1, I, o, 0) to avoid typographical confusion on production printed logs."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-150 dark:border-slate-850">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">{t('Generator Specifications', lang)}</h4>
          <div className="space-y-3 text-slate-700 dark:text-slate-300">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>{t('String Length', lang)}</span>
                <span>{length} {t('characters', lang)}</span>
              </div>
              <input type="range" min="4" max="64" value={length} onChange={(e) => setLength(parseInt(e.target.value))} className="w-full accent-blue-600" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>{t('Quantity (1 - 100)', lang)}</span>
                <span>{count}</span>
              </div>
              <input type="range" min="1" max="50" value={count} onChange={(e) => setCount(parseInt(e.target.value))} className="w-full accent-blue-600" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" />
                <span>A-Z (Uppercase)</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                <input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" />
                <span>a-z (Lowercase)</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                <input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" />
                <span>0-9 (Numbers)</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                <input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" />
                <span>#$&* (Symbols)</span>
              </label>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-850">
              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                <input type="checkbox" checked={excludeSimilar} onChange={(e) => setExcludeSimilar(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" />
                <span>Exclude Ambiguous (ilI1L, oO0)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
              {t('Generated Strings Bundle', lang)}
            </span>
            <div className="flex items-center gap-1.5">
              <button onClick={generateStrings} className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded text-xs font-bold transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <CopyButton text={strings.join('\n')} />
              <DownloadButton content={strings.join('\n')} fileName="random_strings.txt" />
            </div>
          </div>

          <div className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-3 h-64 overflow-y-auto font-mono text-xs font-bold leading-normal text-blue-650 dark:text-blue-400 divide-y dark:divide-slate-900 select-all">
            {strings.length === 0 ? (
              <p className="text-slate-400 text-center py-8">{t('Select at least one set', lang)}</p>
            ) : (
              strings.map((str, idx) => (
                <div key={idx} className="py-1.5 flex justify-between items-center group">
                  <span className="break-all">{str}</span>
                  <button onClick={() => navigator.clipboard.writeText(str)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 transition-opacity">
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. SVG OPTIMIZER COMPONENT
// ==========================================
export const SvgOptimizer = () => {
  const [input, setInput] = useState('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n  <!-- This is a sample comment to remove -->\n  <g id="Layer_1" data-name="Logo Layer">\n    <circle cx="50" cy="50" r="40" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>\n  </g>\n</svg>');
  const [output, setOutput] = useState('');
  const [reduction, setReduction] = useState(0);
  const lang = getInitialLanguage();

  const optimizeSVG = (svg: string) => {
    return svg
      .replace(/<!--[\s\S]*?-->/g, '') // remove comments
      .replace(/<\?xml[\s\S]*?\?>/g, '') // remove XML declaration
      .replace(/<!DOCTYPE[\s\S]*?>/g, '') // remove DOCTYPE
      .replace(/\s+/g, ' ') // collapse spacing
      .replace(/>\s+</g, '><') // remove whitespace between tags
      .trim();
  };

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setReduction(0);
      return;
    }
    const opt = optimizeSVG(input);
    setOutput(opt);

    const rawSize = input.length;
    const optSize = opt.length;
    if (rawSize > 0) {
      setReduction(Math.max(0, Math.round(((rawSize - optSize) / rawSize) * 100)));
    }
  }, [input]);

  return (
    <div className="space-y-4 text-left">
      <ToolDescription 
        title="SVG Optimizer"
        description="Optimize, minify, and strip metadata, XML tags, and comment clutter from raw SVG vectors."
        tip="Minifying vector tags decreases overall web asset sizes for faster webpage page-loads."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-150 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400">
            <Sparkles className="w-3 h-3 text-blue-500" />
            {reduction}% {t('File Size Reduced', lang)}
          </span>
          <span className="text-[10px] font-bold text-slate-400 font-mono">
            {input.length} B → {output.length} B
          </span>
        </div>
        <ClearButton onClear={() => setInput('')} disabled={!input} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
            {t('Raw SVG markup input', lang)}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste SVG code here..."
            className="w-full h-80 p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono font-bold leading-relaxed text-slate-800 dark:text-slate-150 shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
              {t('Optimized vector output', lang)}
            </span>
            <div className="flex items-center gap-1.5">
              <CopyButton text={output} />
              <DownloadButton content={output} fileName="optimized.svg" />
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Cleaned compressed SVG code..."
            className="w-full h-44 p-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-xs font-mono font-bold leading-relaxed select-all text-slate-800 dark:text-slate-150"
          />

          <div className="border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 rounded-xl p-3.5 flex flex-col items-center justify-center h-32 overflow-hidden shadow-inner relative">
            <span className="absolute top-2 left-2 text-[9px] font-bold font-mono text-slate-400 uppercase">{t('Render Preview', lang)}</span>
            {output ? (
              <div dangerouslySetInnerHTML={{ __html: output }} className="w-20 h-20 flex items-center justify-center text-slate-800 dark:text-slate-100" />
            ) : (
              <p className="text-[10px] text-slate-400 font-semibold">{t('No vector preview available', lang)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. BINARY/HEX/ASCII CONVERTER COMPONENT
// ==========================================
export const BinaryConverter = () => {
  const [text, setText] = useState('DevBox');
  const [binary, setBinary] = useState('');
  const [hex, setHex] = useState('');
  const [ascii, setAscii] = useState('');
  const lang = getInitialLanguage();

  // Convert plain text to binary, hex, ascii
  useEffect(() => {
    if (!text) {
      setBinary('');
      setHex('');
      setAscii('');
      return;
    }

    const binArr = [];
    const hexArr = [];
    const asciiArr = [];

    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      binArr.push(code.toString(2).padStart(8, '0'));
      hexArr.push(code.toString(16).padStart(2, '0').toUpperCase());
      asciiArr.push(code);
    }

    setBinary(binArr.join(' '));
    setHex(hexArr.join(' '));
    setAscii(asciiArr.join(' '));
  }, [text]);

  const handleBinaryChange = (val: string) => {
    setBinary(val);
    try {
      const clean = val.replace(/[^01\s]/g, '').trim();
      if (!clean) { setText(''); return; }
      const bytes = clean.split(/\s+/);
      const decoded = bytes.map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
      setText(decoded);
    } catch (e) {
      // Ignore conversion faults during active typing
    }
  };

  const handleHexChange = (val: string) => {
    setHex(val);
    try {
      const clean = val.replace(/[^0-9A-Fa-f\s]/g, '').trim();
      if (!clean) { setText(''); return; }
      const nibbles = clean.split(/\s+/);
      const decoded = nibbles.map(h => String.fromCharCode(parseInt(h, 16))).join('');
      setText(decoded);
    } catch (e) {
      // Ignore active typing faults
    }
  };

  const handleAsciiChange = (val: string) => {
    setAscii(val);
    try {
      const clean = val.replace(/[^0-9\s]/g, '').trim();
      if (!clean) { setText(''); return; }
      const codes = clean.split(/\s+/);
      const decoded = codes.map(code => String.fromCharCode(parseInt(code, 10))).join('');
      setText(decoded);
    } catch (e) {
      // Ignore active typing faults
    }
  };

  return (
    <div className="space-y-4 text-left">
      <ToolDescription 
        title="Binary/Hex/ASCII Converter"
        description="Convert plain text into standard Binary code blocks, Hexadecimal codes, and ASCII characters and vice versa in real-time."
        tip="Spaces are useful separator lines for byte chunks and word boundaries."
      />

      <div className="flex justify-end p-1">
        <ClearButton onClear={() => setText('')} disabled={!text} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 bg-white dark:bg-slate-900 border p-3.5 rounded-xl shadow-sm">
          <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest font-mono">
            {t('Plain Text String', lang)}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type plaintext characters here..."
            className="w-full h-24 p-2.5 bg-slate-50 dark:bg-slate-950 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono font-bold leading-normal"
          />
        </div>

        <div className="flex flex-col gap-1.5 bg-white dark:bg-slate-900 border p-3.5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest font-mono">
              {t('ASCII Codes', lang)}
            </label>
            <CopyButton text={ascii} />
          </div>
          <textarea
            value={ascii}
            onChange={(e) => handleAsciiChange(e.target.value)}
            placeholder="ASCII decimal values e.g. 68 101 118"
            className="w-full h-24 p-2.5 bg-slate-50 dark:bg-slate-950 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono font-bold leading-normal"
          />
        </div>

        <div className="flex flex-col gap-1.5 bg-white dark:bg-slate-900 border p-3.5 rounded-xl shadow-sm md:col-span-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest font-mono">
              {t('Binary Code Representation', lang)}
            </label>
            <CopyButton text={binary} />
          </div>
          <textarea
            value={binary}
            onChange={(e) => handleBinaryChange(e.target.value)}
            placeholder="Binary code bits e.g. 01000100 01100101"
            className="w-full h-24 p-2.5 bg-slate-50 dark:bg-slate-950 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono font-bold leading-normal"
          />
        </div>

        <div className="flex flex-col gap-1.5 bg-white dark:bg-slate-900 border p-3.5 rounded-xl shadow-sm md:col-span-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest font-mono">
              {t('Hexadecimal Representation', lang)}
            </label>
            <CopyButton text={hex} />
          </div>
          <textarea
            value={hex}
            onChange={(e) => handleHexChange(e.target.value)}
            placeholder="Hex values e.g. 44 65 76"
            className="w-full h-24 p-2.5 bg-slate-50 dark:bg-slate-950 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono font-bold leading-normal"
          />
        </div>
      </div>
    </div>
  );
};
