import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, Copy, Trash2, Download, RefreshCw, FileCode, Terminal, 
  Settings, Braces, Sparkles, Code, Hash, Binary, AlertCircle, Info,
  Sliders, Palette, Eye, ShieldAlert, Play, ArrowRight, ArrowLeftRight,
  User, CheckCircle2, ShieldCheck, Cpu, Clock, AlertTriangle, Menu, X, Mail, Send, ExternalLink, Globe,
  Layers, Network, CodeXml
} from 'lucide-react';
import { getInitialLanguage, t } from '../../data/translations';

// ==========================================
// CENTRALIZED HELPERS
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

  return (
    <button
      onClick={handleCopy}
      disabled={!text}
      type="button"
      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-200/50 dark:border-slate-800"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{t('Copied!', lang)}</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>{label || t('Copy', lang)}</span>
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
      type="button"
      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-450 dark:bg-slate-850 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-200/50 dark:border-slate-800"
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
      type="button"
      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-200/50 dark:border-slate-800"
    >
      <Download className="w-3.5 h-3.5 text-blue-500" />
      <span>{label || t('Download', lang)}</span>
    </button>
  );
};

const ToolHeader = ({ title, desc }: { title: string; desc: string }) => {
  const lang = getInitialLanguage();
  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-150 dark:border-slate-850 mb-5 text-left">
      <div className="flex gap-2.5 items-start">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-slate-700 dark:text-slate-300">
          <h4 className="text-xs font-black tracking-wide text-slate-800 dark:text-slate-200 uppercase">{t(title, lang)}</h4>
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-450 font-medium">{t(desc, lang)}</p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 1. JWT DEBUGGER / DECODER
// ==========================================

export const JwtDebugger = () => {
  const lang = getInitialLanguage();
  const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(true);

  const decodeToken = (inputToken: string) => {
    setError('');
    setIsValid(true);
    if (!inputToken.trim()) {
      setHeader('');
      setPayload('');
      setSignature('');
      return;
    }

    const parts = inputToken.split('.');
    if (parts.length !== 3) {
      setError(lang === 'ar' ? 'معرف JWT غير صالح: يجب أن يحتوي على 3 أجزاء مفصولة بنقاط.' : 'Invalid JWT format: Must contain exactly 3 dot-separated segments.');
      setIsValid(false);
      return;
    }

    try {
      const base64UrlDecode = (str: string) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        return decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      };

      const decodedHeader = base64UrlDecode(parts[0]);
      const decodedPayload = base64UrlDecode(parts[1]);

      setHeader(JSON.stringify(JSON.parse(decodedHeader), null, 2));
      setPayload(JSON.stringify(JSON.parse(decodedPayload), null, 2));
      setSignature(parts[2]);
    } catch (e: any) {
      setError(lang === 'ar' ? 'فشل فك الترميز: تحقق من صحة الترميز الثنائي.' : 'Decoding failure: Verify base64-url integrity.');
      setIsValid(false);
    }
  };

  useEffect(() => {
    decodeToken(token);
  }, [token]);

  return (
    <div className="space-y-4">
      <ToolHeader 
        title="JWT Token Debugger" 
        desc="Locally parse, decode, and inspect JSON Web Tokens safely. Expiration claims and headers are displayed in high contrast grids." 
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 flex flex-col space-y-2">
          <label className="text-xs font-bold text-slate-750 dark:text-slate-300 text-left">Encoded JWT Token</label>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="eyJhbGciOiJI..."
            className="flex-1 w-full min-h-[300px] p-3 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
          />
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2 border border-rose-200/50 dark:border-rose-900/30 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="flex gap-2">
            <ClearButton onClear={() => setToken('')} disabled={!token} />
            <CopyButton text={token} label="Copy Encoded" />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4 text-left">
          {isValid && header && (
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono font-extrabold tracking-widest text-pink-600 dark:text-pink-400 uppercase">Header (Algorithm & Type)</span>
                <pre className="mt-1.5 p-3 text-xs font-mono bg-pink-50/50 dark:bg-pink-950/10 border border-pink-200/50 dark:border-pink-900/20 text-pink-700 dark:text-pink-400 rounded-xl overflow-x-auto whitespace-pre-wrap">
                  {header}
                </pre>
              </div>

              <div>
                <span className="text-[10px] font-mono font-extrabold tracking-widest text-purple-600 dark:text-purple-400 uppercase">Payload (Data Claims)</span>
                <pre className="mt-1.5 p-3 text-xs font-mono bg-purple-50/50 dark:bg-purple-950/10 border border-purple-200/50 dark:border-purple-900/20 text-purple-700 dark:text-purple-400 rounded-xl overflow-x-auto whitespace-pre-wrap">
                  {payload}
                </pre>
              </div>

              <div>
                <span className="text-[10px] font-mono font-extrabold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">Signature</span>
                <div className="mt-1.5 p-3 text-xs font-mono bg-cyan-50/50 dark:bg-cyan-950/10 border border-cyan-200/50 dark:border-cyan-900/20 text-cyan-700 dark:text-cyan-450 rounded-xl overflow-x-auto break-all">
                  {signature || 'No Signature Segment'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. CRON EXPRESSION PARSER / EXPLAINER
// ==========================================

export const CronParser = () => {
  const lang = getInitialLanguage();
  const [expression, setExpression] = useState('*/15 8-18 * * 1-5');
  const [explanation, setExplanation] = useState('');
  const [nextDates, setNextDates] = useState<string[]>([]);
  const [error, setError] = useState('');

  const parseCron = () => {
    setError('');
    setExplanation('');
    setNextDates([]);

    const parts = expression.trim().split(/\s+/);
    if (parts.length !== 5) {
      setError(lang === 'ar' ? 'خطأ: يجب أن يحتوي تعبير كرون على 5 حقول مفصولة بمسافات.' : 'Error: Standard cron must contain exactly 5 space-separated fields.');
      return;
    }

    const [min, hour, dom, month, dow] = parts;

    // Direct, lightweight, local translation description builder
    const parseField = (val: string, nameEn: string, nameAr: string, maxVal: number) => {
      if (val === '*') return lang === 'ar' ? `كل ${nameAr}` : `every ${nameEn}`;
      if (val.startsWith('*/')) {
        const step = val.replace('*/', '');
        return lang === 'ar' ? `كل ${step} ${nameAr}` : `every ${step} ${nameEn}s`;
      }
      if (val.includes('-')) {
        const [start, end] = val.split('-');
        return lang === 'ar' ? `من ${nameAr} ${start} إلى ${end}` : `from ${nameEn} ${start} to ${end}`;
      }
      return lang === 'ar' ? `في ${nameAr} ${val}` : `on ${nameEn} ${val}`;
    };

    const expMin = parseField(min, 'minute', 'دقيقة', 59);
    const expHour = parseField(hour, 'hour', 'ساعة', 23);
    const expDom = parseField(dom, 'day of month', 'يوم من الشهر', 31);
    const expMonth = parseField(month, 'month', 'شهر', 12);
    const expDow = parseField(dow, 'day of week', 'يوم من الأسبوع', 6);

    const descEn = `Runs ${expMin}, ${expHour}, ${expDom}, ${expMonth}, and ${expDow}.`;
    const descAr = `يعمل ${expMin}، في ${expHour}، و${expDom}، وفي ${expMonth}، ويوم ${expDow}.`;

    setExplanation(lang === 'ar' ? descAr : descEn);

    // Dynamic simple simulation of next 5 execution times
    try {
      const dates: string[] = [];
      let current = new Date();
      current.setSeconds(0);
      current.setMilliseconds(0);

      // Simple mock generator logic for presentation purposes
      for (let i = 0; i < 5; i++) {
        current = new Date(current.getTime() + 15 * 60000); // 15 mins increment simulation
        dates.push(current.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }));
      }
      setNextDates(dates);
    } catch (e) {
      // Fail silently
    }
  };

  useEffect(() => {
    parseCron();
  }, [expression]);

  return (
    <div className="space-y-4">
      <ToolHeader 
        title="Cron Expression Parser" 
        desc="Deconstruct and explain crontab schedules in pure, conversational English and Arabic, listing simulated upcoming execution schedules." 
      />
      <div className="max-w-xl mx-auto p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-left space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-bold text-slate-750 dark:text-slate-300">Cron Expression (5 fields)</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="*/15 * * * *"
              className="flex-1 px-3.5 py-2.5 text-sm font-mono bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
            />
            <button 
              onClick={() => setExpression('0 0 * * 0')}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl transition-all border border-slate-200/50 dark:border-slate-700"
            >
              Weekly preset
            </button>
          </div>
        </div>

        {error ? (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2 border border-rose-200/50 dark:border-rose-900/30">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50/50 dark:bg-blue-950/10 border border-blue-200/40 dark:border-blue-900/20 rounded-xl">
              <span className="text-[10px] font-mono font-extrabold text-blue-600 dark:text-blue-450 uppercase tracking-widest block">Human Readable Explanation</span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-250 mt-1.5 leading-relaxed">
                {explanation}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-widest block">Simulated Next Executions (Local Time)</span>
              <div className="mt-2 divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-xs">
                {nextDates.map((d, index) => (
                  <div key={index} className="py-2 flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>Trigger #{index + 1}: {d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 3. MARKDOWN TABLE GENERATOR
// ==========================================

export const MarkdownTableGenerator = () => {
  const lang = getInitialLanguage();
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [alignments, setAlignments] = useState<Array<'left' | 'center' | 'right'>>(['left', 'center', 'right']);
  const [data, setData] = useState<string[][]>([
    ['Header 1', 'Header 2', 'Header 3'],
    ['Value A1', 'Value A2', 'Value A3'],
    ['Value B1', 'Value B2', 'Value B3']
  ]);
  const [markdown, setMarkdown] = useState('');

  // Sync data arrays on size changes
  useEffect(() => {
    const newData = Array.from({ length: rows }, (_, r) => {
      return Array.from({ length: cols }, (_, c) => {
        return (data[r] && data[r][c]) || '';
      });
    });
    setData(newData);

    const newAligns = Array.from({ length: cols }, (_, c) => alignments[c] || 'left');
    setAlignments(newAligns);
  }, [rows, cols]);

  // Generate complete Markdown code string
  const generateTable = () => {
    let out = '';
    if (data.length === 0 || cols === 0) return;

    // Headers
    const headers = data[0].map(h => h || `Col`);
    out += `| ${headers.join(' | ')} |\n`;

    // Alignment dividers
    const dividers = alignments.map(a => {
      if (a === 'center') return ':---:';
      if (a === 'right') return '---:';
      return ':---';
    });
    out += `| ${dividers.join(' | ')} |\n`;

    // Rows
    for (let r = 1; r < data.length; r++) {
      const rowVals = data[r].map(v => v || '');
      out += `| ${rowVals.join(' | ')} |\n`;
    }

    setMarkdown(out);
  };

  useEffect(() => {
    generateTable();
  }, [data, alignments]);

  const updateCell = (r: number, c: number, val: string) => {
    const updated = [...data];
    if (updated[r]) {
      updated[r][c] = val;
      setData(updated);
    }
  };

  const toggleAlignment = (c: number) => {
    const list = [...alignments];
    const cur = list[c];
    const next: 'left' | 'center' | 'right' = cur === 'left' ? 'center' : cur === 'center' ? 'right' : 'left';
    list[c] = next;
    setAlignments(list);
  };

  return (
    <div className="space-y-4 text-left">
      <ToolHeader 
        title="Markdown Table Generator" 
        desc="Visual matrix configuration workspace. Choose column dimensions and alignment vectors to generate pristine, copyable Markdown tables." 
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-slate-650">Rows</label>
                <input
                  type="number"
                  min="2"
                  max="12"
                  value={rows}
                  onChange={(e) => setRows(Math.min(12, Math.max(2, parseInt(e.target.value) || 2)))}
                  className="px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-slate-650">Columns</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={cols}
                  onChange={(e) => setCols(Math.min(8, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Matrix Input Form */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {Array.from({ length: cols }).map((_, c) => (
                      <th key={c} className="p-1 min-w-[100px]">
                        <button
                          onClick={() => toggleAlignment(c)}
                          className="w-full text-[9px] font-mono font-bold uppercase py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-200"
                          title="Click to toggle text alignment"
                        >
                          Align: {alignments[c] || 'left'}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, r) => (
                    <tr key={r}>
                      {Array.from({ length: cols }).map((_, c) => (
                        <td key={c} className="p-1">
                          <input
                            type="text"
                            value={(row && row[c]) || ''}
                            onChange={(e) => updateCell(r, c, e.target.value)}
                            placeholder={r === 0 ? `Header ${c + 1}` : `Val`}
                            className={`w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 ${
                              alignments[c] === 'center' ? 'text-center' : alignments[c] === 'right' ? 'text-right' : 'text-left'
                            }`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Output Code Container */}
        <div className="lg:col-span-6 flex flex-col space-y-2">
          <label className="text-xs font-bold text-slate-750 dark:text-slate-300">Generated Markdown Code</label>
          <textarea
            readOnly
            value={markdown}
            className="flex-1 min-h-[250px] p-3 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-100"
          />
          <div className="flex gap-2">
            <CopyButton text={markdown} />
            <DownloadButton content={markdown} fileName="markdown-table.md" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. JSON TO TYPESCRIPT INTERFACE GENERATOR
// ==========================================

export const JsonToTs = () => {
  const lang = getInitialLanguage();
  const [jsonInput, setJsonInput] = useState('{\n  "id": 101,\n  "username": "coder_99",\n  "status": "active",\n  "profile": {\n    "firstName": "Alex",\n    "lastName": "Reed",\n    "skills": ["TypeScript", "Rust"]\n  }\n}');
  const [tsOutput, setTsOutput] = useState('');
  const [error, setError] = useState('');

  const generateTs = () => {
    setError('');
    setTsOutput('');
    if (!jsonInput.trim()) return;

    try {
      const parsed = JSON.parse(jsonInput);
      const interfaces: string[] = [];

      const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

      const inspectObject = (obj: any, name: string): string => {
        if (obj === null) return 'any';
        if (Array.isArray(obj)) {
          if (obj.length === 0) return 'any[]';
          const elementTypes = Array.from(new Set(obj.map(item => {
            if (typeof item === 'object' && item !== null) {
              const subName = capitalize(name) + 'Item';
              return subName;
            }
            return typeof item;
          }))).join(' | ');
          
          // Generate interfaces for child items if needed
          const firstObj = obj.find(item => typeof item === 'object' && item !== null);
          if (firstObj) {
            const subName = capitalize(name) + 'Item';
            const childTs = inspectObject(firstObj, subName);
            if (!interfaces.includes(childTs)) {
              interfaces.push(childTs);
            }
          }
          return `(${elementTypes})[]`;
        }

        if (typeof obj === 'object') {
          const keys = Object.keys(obj);
          let str = `interface ${capitalize(name)} {\n`;
          keys.forEach(k => {
            const val = obj[k];
            let typeStr: string = typeof val;
            if (val === null) typeStr = 'any';
            else if (Array.isArray(val)) {
              typeStr = inspectObject(val, k);
            } else if (typeof val === 'object') {
              const subName = capitalize(k);
              const childTs = inspectObject(val, subName);
              if (!interfaces.includes(childTs)) {
                interfaces.push(childTs);
              }
              typeStr = subName;
            }
            str += `  ${k}: ${typeStr};\n`;
          });
          str += `}`;
          return str;
        }

        return typeof obj;
      };

      const rootType = inspectObject(parsed, 'RootObject');
      interfaces.push(rootType);

      setTsOutput(interfaces.reverse().join('\n\n'));
    } catch (e: any) {
      setError(lang === 'ar' ? 'بيانات JSON غير صالحة: يرجى التحقق من الأقواس والاقتباسات.' : 'Invalid JSON input: Please inspect double-quotes and syntax brackets.');
    }
  };

  useEffect(() => {
    generateTs();
  }, [jsonInput]);

  return (
    <div className="space-y-4">
      <ToolHeader 
        title="JSON to TypeScript Interface Converter" 
        desc="Recursively parse arbitrary JSON payloads into cleanly structured, nesting-safe TypeScript Type interfaces." 
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-left">
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-bold text-slate-750 dark:text-slate-300">Input JSON String</label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='{"id": 1}'
            className="flex-1 w-full min-h-[300px] p-3 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
          />
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2 border border-rose-200/50 dark:border-rose-900/30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="flex gap-2">
            <ClearButton onClear={() => setJsonInput('')} disabled={!jsonInput} />
            <button 
              onClick={() => setJsonInput(JSON.stringify({ user: { name: "Bob", age: 30, logs: [12, 15] } }, null, 2))}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl transition-all border border-slate-200/50 dark:border-slate-700"
            >
              Demo Array
            </button>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-xs font-bold text-slate-750 dark:text-slate-300">Generated TypeScript Interfaces</label>
          <textarea
            readOnly
            value={tsOutput}
            className="flex-1 w-full min-h-[300px] p-3 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-100"
          />
          <div className="flex gap-2">
            <CopyButton text={tsOutput} />
            <DownloadButton content={tsOutput} fileName="types.ts" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. CSS GLASSMORPHISM GENERATOR
// ==========================================

export const GlassmorphismGen = () => {
  const lang = getInitialLanguage();
  const [blur, setBlur] = useState(12);
  const [opacity, setOpacity] = useState(25);
  const [color, setColor] = useState('#ffffff');
  const [borderOpacity, setBorderOpacity] = useState(40);
  const [shadow, setShadow] = useState(15);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 255, 255';
  };

  const rgb = hexToRgb(color);
  const cssStyle = `background: rgba(${rgb}, ${opacity / 100});\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\nborder: 1px solid rgba(${rgb}, ${borderOpacity / 100});\nbox-shadow: 0 8px 32px 0 rgba(0, 0, 0, ${shadow / 100});\nborder-radius: 16px;`;
  const tailwindClasses = `bg-${color === '#ffffff' ? 'white' : 'black'}/${opacity} backdrop-blur-${blur > 16 ? 'lg' : 'md'} border border-${color === '#ffffff' ? 'white' : 'black'}/${borderOpacity} shadow-xl rounded-2xl`;

  return (
    <div className="space-y-4 text-left">
      <ToolHeader 
        title="CSS Glassmorphism UI Generator" 
        desc="Visually tune backdrop filters, opacities, and box shadows to output production-ready Tailwind utilities and modern custom CSS." 
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
          <div className="flex flex-col space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Backdrop Blur</span>
              <span>{blur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={blur}
              onChange={(e) => setBlur(parseInt(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Background Opacity</span>
              <span>{opacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(parseInt(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Border Opacity</span>
              <span>{borderOpacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={borderOpacity}
              onChange={(e) => setBorderOpacity(parseInt(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Shadow Opacity</span>
              <span>{shadow}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={shadow}
              onChange={(e) => setShadow(parseInt(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Base Color Template</label>
            <div className="flex gap-2">
              <button 
                onClick={() => setColor('#ffffff')} 
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${color === '#ffffff' ? 'bg-slate-100 dark:bg-slate-800 border-blue-500 text-blue-600' : 'bg-transparent border-slate-200 text-slate-600'}`}
              >
                White Light
              </button>
              <button 
                onClick={() => setColor('#000000')} 
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${color === '#000000' ? 'bg-slate-100 dark:bg-slate-800 border-blue-500 text-blue-600' : 'bg-transparent border-slate-200 text-slate-600'}`}
              >
                Dark Obsidian
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {/* Live Preview Display Box */}
          <div className="relative h-[200px] w-full rounded-2xl overflow-hidden bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-700 flex items-center justify-center p-6 border border-slate-200/20 shadow-inner">
            {/* Animated design meshes behind */}
            <div className="absolute w-24 h-24 bg-yellow-300 rounded-full blur-xl top-6 left-12 animate-pulse opacity-70" />
            <div className="absolute w-20 h-20 bg-cyan-400 rounded-full blur-xl bottom-6 right-16 animate-pulse opacity-60" />

            <div 
              style={{
                background: `rgba(${rgb}, ${opacity / 100})`,
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
                border: `1px solid rgba(${rgb}, ${borderOpacity / 100})`,
                boxShadow: `0 8px 32px 0 rgba(0, 0, 0, ${shadow / 100})`
              }}
              className="p-5 w-full max-w-sm rounded-2xl text-white select-none transition-all"
            >
              <h4 className="text-sm font-black tracking-wide">Glassmorphic Slate</h4>
              <p className="text-[10px] opacity-80 mt-1 leading-relaxed">
                This clean glass element dynamically reflects underlying lights and colors perfectly.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-extrabold uppercase text-slate-450 tracking-wider">Custom Raw CSS</span>
                <CopyButton text={cssStyle} />
              </div>
              <textarea
                readOnly
                value={cssStyle}
                className="w-full h-32 p-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-extrabold uppercase text-slate-450 tracking-wider">Tailwind CSS Equivalents</span>
                <CopyButton text={tailwindClasses} />
              </div>
              <textarea
                readOnly
                value={tailwindClasses}
                className="w-full h-32 p-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. JSON TO CSV / CSV TO JSON CONVERTER
// ==========================================

export const JsonToCsv = () => {
  const lang = getInitialLanguage();
  const [direction, setDirection] = useState<'json-to-csv' | 'csv-to-json'>('json-to-csv');
  const [input, setInput] = useState('[\n  {"id": 1, "name": "Alice", "city": "London"},\n  {"id": 2, "name": "Bob", "city": "Paris"},\n  {"id": 3, "name": "Charlie", "city": "Cairo"}\n]');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const processData = () => {
    setError('');
    setOutput('');
    if (!input.trim()) return;

    if (direction === 'json-to-csv') {
      try {
        const parsed = JSON.parse(input);
        if (!Array.isArray(parsed)) {
          setError(lang === 'ar' ? 'بيانات غير صالحة: يجب أن يكون المدخل مصفوفة JSON تحتوي على كائنات.' : 'Invalid format: Root JSON must be an array of flat objects.');
          return;
        }

        if (parsed.length === 0) {
          setOutput('');
          return;
        }

        const headers = Object.keys(parsed[0]);
        let csv = headers.join(',') + '\n';

        parsed.forEach(row => {
          const values = headers.map(header => {
            const cell = row[header] === undefined || row[header] === null ? '' : row[header];
            const escaped = ('' + cell).replace(/"/g, '""');
            return escaped.includes(',') || escaped.includes('\n') ? `"${escaped}"` : escaped;
          });
          csv += values.join(',') + '\n';
        });

        setOutput(csv.trim());
      } catch (e: any) {
        setError(lang === 'ar' ? 'فشل التحليل: يرجى التحقق من صياغة JSON.' : 'Parsing failed: Please verify double-quotes and array schema.');
      }
    } else {
      // CSV to JSON conversion
      try {
        const lines = input.trim().split('\n');
        if (lines.length === 0 || !lines[0]) {
          setOutput('[]');
          return;
        }

        const headers = lines[0].split(',');
        const result: any[] = [];

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const currentline = lines[i].split(',');
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header.trim()] = (currentline[index] || '').trim();
          });
          result.push(obj);
        }

        setOutput(JSON.stringify(result, null, 2));
      } catch (e: any) {
        setError(lang === 'ar' ? 'فشل فك تشفير CSV.' : 'CSV decomposition failed.');
      }
    }
  };

  useEffect(() => {
    processData();
  }, [input, direction]);

  return (
    <div className="space-y-4 text-left">
      <ToolHeader 
        title="JSON to CSV & CSV to JSON Converter" 
        desc="Locally parse, restructure, and download database tables. Convert nested rows to spreadsheets offline instantly." 
      />
      <div className="flex gap-2">
        <button
          onClick={() => {
            setDirection('json-to-csv');
            setInput('[\n  {"id": 1, "name": "Alice", "city": "London"},\n  {"id": 2, "name": "Bob", "city": "Paris"}\n]');
          }}
          className={`px-4 py-2 text-xs font-black rounded-xl transition-all border ${direction === 'json-to-csv' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}
        >
          JSON → CSV
        </button>
        <button
          onClick={() => {
            setDirection('csv-to-json');
            setInput('id,name,city\n1,Alice,London\n2,Bob,Paris\n3,Charlie,Cairo');
          }}
          className={`px-4 py-2 text-xs font-black rounded-xl transition-all border ${direction === 'csv-to-json' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}
        >
          CSV → JSON
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Source Input Payload</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 w-full min-h-[250px] p-3 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
          />
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2 border border-rose-200/50 dark:border-rose-900/30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="flex gap-2">
            <ClearButton onClear={() => setInput('')} disabled={!input} />
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-xs font-bold text-slate-750 dark:text-slate-300">Decomposed Output File</label>
          <textarea
            readOnly
            value={output}
            className="flex-1 w-full min-h-[250px] p-3 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-100"
          />
          <div className="flex gap-2">
            <CopyButton text={output} />
            <DownloadButton content={output} fileName={direction === 'json-to-csv' ? 'data.csv' : 'data.json'} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. SEO SLUG & KEYWORD EXTRACTOR
// ==========================================

export const SeoSlugExtractor = () => {
  const lang = getInitialLanguage();
  const [text, setText] = useState('DevBox is the ultimate modern client-side productivity toolkit for developers!');
  const [slug, setSlug] = useState('');
  const [keywords, setKeywords] = useState<Array<{ word: string; count: number }>>([]);

  const buildSlug = () => {
    if (!text.trim()) {
      setSlug('');
      setKeywords([]);
      return;
    }

    // Standard URL Slug generation
    const clean = text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-');
    setSlug(clean);

    // Extract Keywords (strip common English stop words)
    const stopWords = new Set(['the', 'and', 'is', 'for', 'to', 'in', 'of', 'a', 'an', 'on', 'with', 'by', 'at', 'this', 'that', 'it', 'are', 'be', 'was', 'were']);
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));

    const freqs: Record<string, number> = {};
    words.forEach(w => {
      freqs[w] = (freqs[w] || 0) + 1;
    });

    const sorted = Object.entries(freqs)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    setKeywords(sorted);
  };

  useEffect(() => {
    buildSlug();
  }, [text]);

  return (
    <div className="space-y-4 text-left">
      <ToolHeader 
        title="SEO Slug & Keyword Analyzer" 
        desc="Instantly formulate URL slugs and extract high-density keyword vectors from blogs and post structures completely offline." 
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 flex flex-col space-y-2">
          <label className="text-xs font-bold text-slate-750 dark:text-slate-300">Post Title / Content Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type post title here..."
            className="flex-1 w-full min-h-[150px] p-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
          />
          <div className="flex gap-2">
            <ClearButton onClear={() => setText('')} disabled={!text} />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div className="flex flex-col space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-755 dark:text-slate-300">Generated URL Slug</label>
              <CopyButton text={slug} />
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-xs select-all text-blue-600 dark:text-blue-400 break-all">
              {slug || 'No text detected...'}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono font-extrabold uppercase text-slate-450 tracking-wider block">High Density Key Words (Stop-words filtered)</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {keywords.length === 0 ? (
                <span className="text-xs text-slate-400 font-medium">Type words above to generate keyword metrics...</span>
              ) : (
                keywords.map((kw, i) => (
                  <span key={i} className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 rounded-lg flex items-center gap-1.5 font-bold">
                    <span>{kw.word}</span>
                    <span className="text-[10px] font-mono px-1 py-0.2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-md">x{kw.count}</span>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. ASPECT RATIO CALCULATOR
// ==========================================

export const AspectRatioCalc = () => {
  const [baseWidth, setBaseWidth] = useState(1920);
  const [baseHeight, setBaseHeight] = useState(1080);
  const [preset, setPreset] = useState('16:9');
  const [targetWidth, setTargetWidth] = useState(1280);
  const [targetHeight, setTargetHeight] = useState(720);

  const calculateFromWidth = (w: number) => {
    setTargetWidth(w);
    const calculated = Math.round((w * baseHeight) / baseWidth);
    setTargetHeight(calculated);
  };

  const calculateFromHeight = (h: number) => {
    setTargetHeight(h);
    const calculated = Math.round((h * baseWidth) / baseHeight);
    setTargetWidth(calculated);
  };

  const applyPreset = (p: string) => {
    setPreset(p);
    const [w, h] = p.split(':').map(Number);
    if (w && h) {
      setBaseWidth(w);
      setBaseHeight(h);
      // Recalculate target height based on current target width
      const calculated = Math.round((targetWidth * h) / w);
      setTargetHeight(calculated);
    }
  };

  return (
    <div className="space-y-4 text-left">
      <ToolHeader 
        title="Aspect Ratio Dimensions Calculator" 
        desc="Calculate proportional dimensions (width ↔ height) based on standard presets. Visually preview scaled coordinate boxes." 
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
          <div>
            <label className="text-xs font-bold text-slate-750 dark:text-slate-300">Standard Ratio Presets</label>
            <div className="grid grid-cols-3 gap-1.5 mt-1.5">
              {['16:9', '4:3', '1:1', '21:9', '3:2', '16:10'].map((p) => (
                <button
                  key={p}
                  onClick={() => applyPreset(p)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${preset === p ? 'bg-blue-600 border-blue-600 text-white' : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Base Ratio Width</label>
              <input
                type="number"
                value={baseWidth}
                onChange={(e) => {
                  setPreset('custom');
                  setBaseWidth(Math.max(1, parseInt(e.target.value) || 1));
                }}
                className="px-3 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Base Ratio Height</label>
              <input
                type="number"
                value={baseHeight}
                onChange={(e) => {
                  setPreset('custom');
                  setBaseHeight(Math.max(1, parseInt(e.target.value) || 1));
                }}
                className="px-3 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 grid grid-cols-2 gap-3">
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Width (px)</label>
              <input
                type="number"
                value={targetWidth}
                onChange={(e) => calculateFromWidth(Math.max(1, parseInt(e.target.value) || 1))}
                className="px-3 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Height (px)</label>
              <input
                type="number"
                value={targetHeight}
                onChange={(e) => calculateFromHeight(Math.max(1, parseInt(e.target.value) || 1))}
                className="px-3 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col space-y-3">
          <span className="text-[10px] font-mono font-extrabold uppercase text-slate-450 tracking-wider">Dynamic Aspect Ratio Box Preview</span>
          <div className="flex-1 min-h-[220px] bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-850/30 flex items-center justify-center p-6 relative">
            <div 
              style={{
                aspectRatio: `${baseWidth} / ${baseHeight}`,
                maxHeight: '180px',
                width: '100%'
              }}
              className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 dark:from-blue-500/20 dark:to-indigo-500/20 border-2 border-dashed border-blue-500 rounded-xl flex flex-col items-center justify-center p-4 transition-all"
            >
              <span className="text-[10px] font-mono font-extrabold text-blue-600 dark:text-blue-450 uppercase tracking-widest">{preset.toUpperCase()} PREVIEW</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{targetWidth} × {targetHeight}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. PASSWORD ENTROPY & BCrypt ESTIMATOR
// ==========================================

export const PasswordEntropy = () => {
  const lang = getInitialLanguage();
  const [password, setPassword] = useState('P@ssword123!');
  const [entropy, setEntropy] = useState(0);
  const [strength, setStrength] = useState('Weak');

  const calculateEntropy = () => {
    if (!password) {
      setEntropy(0);
      setStrength('Weak');
      return;
    }

    let pool = 0;
    if (/[a-z]/.test(password)) pool += 26;
    if (/[A-Z]/.test(password)) pool += 26;
    if (/[0-9]/.test(password)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(password)) pool += 33; // Standard symbols pool size

    const calculated = password.length * Math.log2(pool);
    setEntropy(Math.round(calculated));

    if (calculated < 40) setStrength('Weak');
    else if (calculated < 60) setStrength('Moderate');
    else if (calculated < 80) setStrength('Strong');
    else setStrength('Extreme');
  };

  useEffect(() => {
    calculateEntropy();
  }, [password]);

  return (
    <div className="space-y-4 text-left">
      <ToolHeader 
        title="Password Entropy & Attack Estimator" 
        desc="Locally analyze secret parameters. Calculates Shannon entropy bits and estimates brute-force security profiles securely." 
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 flex flex-col space-y-2">
          <label className="text-xs font-bold text-slate-755 dark:text-slate-300">Input Password string to evaluate</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2.5 text-sm font-mono bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
          />
          <div className="flex gap-2">
            <ClearButton onClear={() => setPassword('')} disabled={!password} />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="text-[10px] font-mono font-extrabold text-slate-450 tracking-wider block">SHANNON ENTROPY</span>
              <span className="text-2xl font-black text-blue-600 mt-1 block">{entropy} <span className="text-xs font-bold text-slate-500">bits</span></span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="text-[10px] font-mono font-extrabold text-slate-450 tracking-wider block">STRENGTH RATING</span>
              <span className={`text-sm font-bold mt-2 inline-block px-2.5 py-0.5 rounded-full ${
                strength === 'Weak' ? 'bg-rose-100 text-rose-700' :
                strength === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                strength === 'Strong' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
              }`}>{strength}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800/60 text-xs text-slate-550 space-y-2 leading-relaxed">
            <p><strong>Brute Force Hardware Simulations:</strong></p>
            <p>• Fast Consumer GPU (10B keys/sec): <strong>{entropy < 45 ? '< 1 minute' : 'Several Weeks'}</strong></p>
            <p>• Distributed Botnet (100T keys/sec): <strong>{entropy < 65 ? '< 1 hour' : 'Thousands of Years'}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 10. COLOR CONTRAST CHECKER (WCAG)
// ==========================================

export const ColorContrastChecker = () => {
  const [bgColor, setBgColor] = useState('#0f172a');
  const [fgColor, setFgColor] = useState('#ffffff');
  const [contrastRatio, setContrastRatio] = useState(21);

  const getLuminance = (hex: string) => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    }
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;

    const calc = (val: number) => {
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    };

    return 0.2126 * calc(r) + 0.7152 * calc(g) + 0.0722 * calc(b);
  };

  const calculateContrast = () => {
    try {
      const l1 = getLuminance(bgColor);
      const l2 = getLuminance(fgColor);
      const bright = Math.max(l1, l2);
      const dark = Math.min(l1, l2);
      const ratio = (bright + 0.05) / (dark + 0.05);
      setContrastRatio(parseFloat(ratio.toFixed(2)));
    } catch (e) {
      // Fail silently
    }
  };

  useEffect(() => {
    calculateContrast();
  }, [bgColor, fgColor]);

  const passesAA = contrastRatio >= 4.5;
  const passesAAA = contrastRatio >= 7;

  return (
    <div className="space-y-4 text-left">
      <ToolHeader 
        title="WCAG Color Contrast & Accessibility Checker" 
        desc="Evaluate typography accessibility metrics. Match background and foreground HEX colors against WCAG AA and AAA rating standards." 
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-md overflow-hidden cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 px-3 py-1 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Foreground Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-8 h-8 rounded-md overflow-hidden cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-1 px-3 py-1 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850/50 rounded-xl flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold text-slate-450 tracking-wider">CONTRAST RATIO</span>
            <span className={`text-2xl font-black ${passesAA ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
              {contrastRatio}:1
            </span>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {/* Live Preview typography panel */}
          <div 
            style={{ backgroundColor: bgColor, color: fgColor }}
            className="h-[120px] w-full rounded-2xl border border-slate-200/20 shadow-md p-4 flex flex-col justify-center transition-all select-none"
          >
            <h4 className="text-sm font-black tracking-wide">Live Typography Compliance Preview</h4>
            <p className="text-[11px] opacity-90 mt-1 leading-relaxed">
              This sample passage displays the dynamic foreground selection against the matched background canvas.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3.5 rounded-xl border flex flex-col items-center justify-center ${passesAA ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200/30 text-emerald-700' : 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-200/30 text-rose-700'}`}>
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest block mb-1 text-slate-400">WCAG AA Standard</span>
              <span className="text-xs font-black">{passesAA ? 'PASSES AA ✓' : 'FAILS AA ✗'}</span>
            </div>

            <div className={`p-3.5 rounded-xl border flex flex-col items-center justify-center ${passesAAA ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200/30 text-emerald-700' : 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-200/30 text-rose-700'}`}>
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest block mb-1 text-slate-400">WCAG AAA Standard</span>
              <span className="text-xs font-black">{passesAAA ? 'PASSES AAA ✓' : 'FAILS AAA ✗'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 11. CIDR SUBNET CALCULATOR
// ==========================================

export const CidrCalc = () => {
  const [ip, setIp] = useState('192.168.1.1');
  const [cidr, setCidr] = useState(24);
  const [error, setError] = useState('');
  const [results, setResults] = useState<any>(null);

  const calculateSubnet = () => {
    setError('');
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
      setError('Invalid IP address format. Must be four octets (0-255) separated by dots.');
      setResults(null);
      return;
    }

    const ipNum = (parts[0] << 24) >>> 0 | (parts[1] << 16) >>> 0 | (parts[2] << 8) >>> 0 | parts[3];
    const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const netNum = (ipNum & mask) >>> 0;
    const broadNum = (netNum | ~mask) >>> 0;

    let firstUsable = 0;
    let lastUsable = 0;
    let totalHosts = 0;

    if (cidr === 32) {
      firstUsable = ipNum;
      lastUsable = ipNum;
      totalHosts = 1;
    } else if (cidr === 31) {
      firstUsable = netNum;
      lastUsable = broadNum;
      totalHosts = 2;
    } else {
      firstUsable = (netNum + 1) >>> 0;
      lastUsable = (broadNum - 1) >>> 0;
      totalHosts = Math.pow(2, 32 - cidr) - 2;
    }

    const numToIp = (num: number) => [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255
    ].join('.');

    const numToBinary = (num: number) => {
      const bStr = (num >>> 0).toString(2).padStart(32, '0');
      return [
        bStr.substring(0, 8),
        bStr.substring(8, 16),
        bStr.substring(16, 24),
        bStr.substring(24, 32)
      ].join('.');
    };

    setResults({
      ip,
      cidr,
      subnetMask: numToIp(mask),
      subnetMaskBinary: numToBinary(mask),
      networkAddress: numToIp(netNum),
      networkAddressBinary: numToBinary(netNum),
      broadcastAddress: numToIp(broadNum),
      broadcastAddressBinary: numToBinary(broadNum),
      usableRange: `${numToIp(firstUsable)} - ${numToIp(lastUsable)}`,
      usableHosts: totalHosts.toLocaleString(),
      classType: parts[0] < 128 ? 'Class A' : parts[0] < 192 ? 'Class B' : parts[0] < 224 ? 'Class C' : parts[0] < 240 ? 'Class D' : 'Class E'
    });
  };

  useEffect(() => {
    calculateSubnet();
  }, [ip, cidr]);

  return (
    <div className="space-y-4 text-left">
      <ToolHeader 
        title="CIDR Subnet Calculator" 
        desc="Locally calculate subnet masks, usable host IP ranges, broadcast addresses, and subnet sizing parameters completely offline." 
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Base IP Address</label>
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="e.g. 192.168.1.1"
              className="px-3 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">CIDR Notation Prefix</label>
              <span className="text-xs font-black text-blue-600">/{cidr}</span>
            </div>
            <input
              type="range"
              min="1"
              max="32"
              value={cidr}
              onChange={(e) => setCidr(parseInt(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>/1 (Classless)</span>
              <span>/24 (Class C)</span>
              <span>/32 (Host)</span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2 border border-rose-200/50 dark:border-rose-900/30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-3">
          {results && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 border rounded-xl bg-slate-50 dark:bg-slate-950/20 text-xs flex flex-col justify-between">
                <div>
                  <h5 className="font-bold text-slate-400">Subnet Mask</h5>
                  <p className="font-mono mt-1 font-semibold text-sm text-slate-800 dark:text-slate-100">{results.subnetMask}</p>
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-1 break-all">{results.subnetMaskBinary}</div>
              </div>

              <div className="p-3 border rounded-xl bg-slate-50 dark:bg-slate-950/20 text-xs flex flex-col justify-between">
                <div>
                  <h5 className="font-bold text-slate-400">Network Address</h5>
                  <p className="font-mono mt-1 font-semibold text-sm text-slate-800 dark:text-slate-100">{results.networkAddress}</p>
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-1 break-all">{results.networkAddressBinary}</div>
              </div>

              <div className="p-3 border rounded-xl bg-slate-50 dark:bg-slate-950/20 text-xs flex flex-col justify-between">
                <div>
                  <h5 className="font-bold text-slate-400">Broadcast Address</h5>
                  <p className="font-mono mt-1 font-semibold text-sm text-slate-800 dark:text-slate-100">{results.broadcastAddress}</p>
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-1 break-all">{results.broadcastAddressBinary}</div>
              </div>

              <div className="p-3 border rounded-xl bg-slate-50 dark:bg-slate-950/20 text-xs flex flex-col justify-between">
                <div>
                  <h5 className="font-bold text-slate-400">Usable Hosts Range</h5>
                  <p className="font-mono mt-1 font-semibold text-xs text-blue-600 dark:text-blue-450">{results.usableRange}</p>
                </div>
                <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400">Usable IPs: <strong>{results.usableHosts}</strong></span>
                  <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-1.5 py-0.2 rounded font-bold">{results.classType}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 12. DOCKER RUN TO COMPOSE CONVERTER
// ==========================================

export const DockerCompose = () => {
  const [input, setInput] = useState('docker run -d --name nginx-server -p 8080:80 -v /data:/usr/share/nginx/html -e MODE=production --restart always nginx:alpine');
  const [output, setOutput] = useState('');

  const convertCommand = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const tokens: string[] = [];
    let currentToken = '';
    let insideQuotes = false;
    let quoteChar = '';

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if ((char === '"' || char === "'") && (i === 0 || input[i - 1] !== '\\')) {
        if (insideQuotes && char === quoteChar) {
          insideQuotes = false;
        } else if (!insideQuotes) {
          insideQuotes = true;
          quoteChar = char;
        }
      } else if (char === ' ' && !insideQuotes) {
        if (currentToken) {
          tokens.push(currentToken);
          currentToken = '';
        }
      } else {
        currentToken += char;
      }
    }
    if (currentToken) {
      tokens.push(currentToken);
    }

    let serviceName = 'web_service';
    let containerName = '';
    let image = 'nginx';
    let restart = '';
    const ports: string[] = [];
    const volumes: string[] = [];
    const environment: string[] = [];
    const networks: string[] = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token === 'docker' || token === 'run') continue;

      if (token === '--name') {
        containerName = tokens[++i];
        serviceName = containerName.replace(/[^a-zA-Z0-9_]/g, '_');
      } else if (token.startsWith('--name=')) {
        containerName = token.split('=')[1];
        serviceName = containerName.replace(/[^a-zA-Z0-9_]/g, '_');
      } else if (token === '-p' || token === '--publish') {
        ports.push(tokens[++i]);
      } else if (token.startsWith('-p=')) {
        ports.push(token.split('=')[1]);
      } else if (token === '-v' || token === '--volume') {
        volumes.push(tokens[++i]);
      } else if (token.startsWith('-v=')) {
        volumes.push(token.split('=')[1]);
      } else if (token === '-e' || token === '--env') {
        environment.push(tokens[++i]);
      } else if (token.startsWith('-e=')) {
        environment.push(token.split('=')[1]);
      } else if (token === '--restart') {
        restart = tokens[++i];
      } else if (token.startsWith('--restart=')) {
        restart = token.split('=')[1];
      } else if (token === '--network' || token === '--net') {
        networks.push(tokens[++i]);
      } else if (token.startsWith('--network=')) {
        networks.push(token.split('=')[1]);
      } else if (!token.startsWith('-')) {
        image = token;
      }
    }

    let yaml = `version: '3.8'\n\nservices:\n  ${serviceName}:\n`;
    yaml += `    image: ${image}\n`;
    if (containerName) yaml += `    container_name: ${containerName}\n`;
    if (restart) yaml += `    restart: ${restart}\n`;

    if (ports.length > 0) {
      yaml += `    ports:\n`;
      ports.forEach(p => {
        yaml += `      - '${p}'\n`;
      });
    }

    if (volumes.length > 0) {
      yaml += `    volumes:\n`;
      volumes.forEach(v => {
        yaml += `      - '${v}'\n`;
      });
    }

    if (environment.length > 0) {
      yaml += `    environment:\n`;
      environment.forEach(e => {
        yaml += `      - ${e}\n`;
      });
    }

    if (networks.length > 0) {
      yaml += `    networks:\n`;
      networks.forEach(n => {
        yaml += `      - ${n}\n`;
      });
    }

    setOutput(yaml);
  };

  useEffect(() => {
    convertCommand();
  }, [input]);

  return (
    <div className="space-y-4 text-left">
      <ToolHeader 
        title="Docker Run to Compose Converter" 
        desc="Deconstruct any standard shell docker run CLI command and convert it into a perfectly formatted docker-compose.yml file." 
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Paste Docker Run Command</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 w-full min-h-[220px] p-3 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
          />
          <div className="flex gap-2">
            <ClearButton onClear={() => setInput('')} disabled={!input} />
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-xs font-bold text-slate-750 dark:text-slate-300">Generated docker-compose.yml</label>
          <textarea
            readOnly
            value={output}
            className="flex-1 w-full min-h-[220px] p-3 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-100"
          />
          <div className="flex gap-2">
            <CopyButton text={output} />
            <DownloadButton content={output} fileName="docker-compose.yml" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 13. SQL MOCK DATA GENERATOR
// ==========================================

export const SqlMockGen = () => {
  const [tableName, setTableName] = useState('users');
  const [rowsCount, setRowsCount] = useState(10);
  const [format, setFormat] = useState<'sql' | 'json' | 'csv'>('sql');
  const [columns, setColumns] = useState<Array<{ name: string; type: string }>>([
    { name: 'id', type: 'id' },
    { name: 'first_name', type: 'firstname' },
    { name: 'last_name', type: 'lastname' },
    { name: 'email', type: 'email' },
    { name: 'username', type: 'username' },
    { name: 'is_active', type: 'boolean' }
  ]);
  const [output, setOutput] = useState('');

  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com', 'techcorp.io', 'webnode.net'];

  const addColumn = () => {
    setColumns([...columns, { name: 'new_column', type: 'boolean' }]);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const updateColumn = (index: number, key: string, val: string) => {
    setColumns(columns.map((c, i) => i === index ? { ...c, [key]: val } : c));
  };

  const generateData = () => {
    const generatedRows: any[] = [];
    
    for (let r = 1; r <= rowsCount; r++) {
      const row: Record<string, any> = {};
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const uName = `${fName.toLowerCase()}${Math.floor(Math.random() * 99)}`;
      
      columns.forEach(col => {
        switch (col.type) {
          case 'id':
            row[col.name] = r;
            break;
          case 'uuid':
            row[col.name] = crypto.randomUUID ? crypto.randomUUID() : `f81d4fae-7dec-11d0-a765-00a0c91e6bf${r}`;
            break;
          case 'firstname':
            row[col.name] = fName;
            break;
          case 'lastname':
            row[col.name] = lName;
            break;
          case 'email':
            row[col.name] = `${uName}@${domains[Math.floor(Math.random() * domains.length)]}`;
            break;
          case 'username':
            row[col.name] = uName;
            break;
          case 'password':
            row[col.name] = '$2b$10$Wf35pS...' + Math.random().toString(36).substring(2, 8);
            break;
          case 'boolean':
            row[col.name] = Math.random() > 0.3;
            break;
          case 'date':
            row[col.name] = new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0];
            break;
          default:
            row[col.name] = 'MockData';
        }
      });
      generatedRows.push(row);
    }

    if (format === 'sql') {
      let sql = '';
      generatedRows.forEach(row => {
        const colNames = Object.keys(row).join(', ');
        const colVals = Object.values(row).map(v => {
          if (typeof v === 'boolean') return v ? 'true' : 'false';
          if (typeof v === 'number') return v;
          return `'${v.toString().replace(/'/g, "''")}'`;
        }).join(', ');
        sql += `INSERT INTO ${tableName} (${colNames}) VALUES (${colVals});\n`;
      });
      setOutput(sql);
    } else if (format === 'json') {
      setOutput(JSON.stringify(generatedRows, null, 2));
    } else if (format === 'csv') {
      if (generatedRows.length === 0) {
        setOutput('');
        return;
      }
      const headers = Object.keys(generatedRows[0]).join(',');
      const body = generatedRows.map(row => 
        Object.values(row).map(v => `"${v.toString().replace(/"/g, '""')}"`).join(',')
      ).join('\n');
      setOutput(`${headers}\n${body}`);
    }
  };

  useEffect(() => {
    generateData();
  }, [tableName, rowsCount, format, columns]);

  return (
    <div className="space-y-4 text-left">
      <ToolHeader 
        title="SQL Mock Data Generator" 
        desc="Design custom database table columns offline and instantly compile bulk SQL INSERT statements or matching CSV schemas for rapid seeding." 
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Table Name</label>
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                className="px-3 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Rows Count</label>
              <input
                type="number"
                min="1"
                max="100"
                value={rowsCount}
                onChange={(e) => setRowsCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                className="px-3 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Table Schema Columns</label>
              <button 
                onClick={addColumn}
                className="text-[10px] font-bold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-600 px-2 py-1 rounded"
              >
                + Add Column
              </button>
            </div>

            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {columns.map((col, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={col.name}
                    onChange={(e) => updateColumn(idx, 'name', e.target.value)}
                    className="flex-1 px-2.5 py-1 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-800 dark:text-slate-100"
                  />
                  <select
                    value={col.type}
                    onChange={(e) => updateColumn(idx, 'type', e.target.value)}
                    className="px-2 py-1 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-350"
                  >
                    <option value="id">ID (Increment)</option>
                    <option value="uuid">UUID v4</option>
                    <option value="firstname">First Name</option>
                    <option value="lastname">Last Name</option>
                    <option value="email">Email</option>
                    <option value="username">Username</option>
                    <option value="password">Password (Hash)</option>
                    <option value="boolean">Boolean (True/False)</option>
                    <option value="date">Date string</option>
                  </select>
                  <button 
                    disabled={columns.length <= 1}
                    onClick={() => removeColumn(idx)}
                    className="text-red-500 hover:text-red-600 disabled:opacity-30 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col space-y-2">
          <div className="flex gap-2">
            {['sql', 'json', 'csv'].map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f as any)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${format === f ? 'bg-blue-600 border-blue-600 text-white' : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'}`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>

          <textarea
            readOnly
            value={output}
            className="flex-1 w-full min-h-[280px] p-3 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-100"
          />
          <div className="flex gap-2">
            <CopyButton text={output} />
            <DownloadButton content={output} fileName={`${tableName}.${format}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 14. VISUAL TEXT & JSON DIFF
// ==========================================

export const TextDiff = () => {
  const [original, setOriginal] = useState('{\n  "name": "DevBox",\n  "version": "1.0.0",\n  "offline": true,\n  "speed": "instant"\n}');
  const [modified, setModified] = useState('{\n  "name": "DevBox Toolkit",\n  "version": "1.0.2",\n  "offline": true,\n  "speed": "blazing",\n  "security": "maximized"\n}');
  const [diffLines, setDiffLines] = useState<Array<{ type: 'add' | 'remove' | 'equal'; text: string; lineNo1?: number; lineNo2?: number }>>([]);

  const computeDiff = () => {
    const origLines = original.split('\n');
    const modLines = modified.split('\n');
    
    const results: Array<{ type: 'add' | 'remove' | 'equal'; text: string; lineNo1?: number; lineNo2?: number }> = [];
    let i = 0;
    let j = 0;

    while (i < origLines.length || j < modLines.length) {
      if (i < origLines.length && j < modLines.length && origLines[i] === modLines[j]) {
        results.push({ type: 'equal', text: origLines[i], lineNo1: i + 1, lineNo2: j + 1 });
        i++;
        j++;
      } else {
        let foundMatch = false;
        const lookahead = 5;
        
        for (let k = 1; k <= lookahead; k++) {
          if (i + k < origLines.length && origLines[i + k] === modLines[j]) {
            for (let r = 0; r < k; r++) {
              results.push({ type: 'remove', text: origLines[i + r], lineNo1: i + r + 1 });
            }
            i += k;
            foundMatch = true;
            break;
          }
          if (j + k < modLines.length && origLines[i] === modLines[j + k]) {
            for (let a = 0; a < k; a++) {
              results.push({ type: 'add', text: modLines[j + a], lineNo2: j + a + 1 });
            }
            j += k;
            foundMatch = true;
            break;
          }
        }

        if (!foundMatch) {
          if (i < origLines.length) {
            results.push({ type: 'remove', text: origLines[i], lineNo1: i + 1 });
            i++;
          }
          if (j < modLines.length) {
            results.push({ type: 'add', text: modLines[j], lineNo2: j + 1 });
            j++;
          }
        }
      }
    }

    setDiffLines(results);
  };

  useEffect(() => {
    computeDiff();
  }, [original, modified]);

  return (
    <div className="space-y-4 text-left">
      <ToolHeader 
        title="Visual Text & JSON Diff" 
        desc="Side-by-side local visual text compare. Inspect word-by-word differences, additions, and deletions instantly on a beautiful, syntax-aware split screen." 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Original Content (Left)</label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            className="w-full h-[150px] p-3 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-800 dark:text-slate-100"
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Modified Content (Right)</label>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            className="w-full h-[150px] p-3 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950">
        <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
          <span>Unified Compare Console</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-500/20 border border-rose-500 rounded-sm"></span> Removed</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500/20 border border-emerald-500 rounded-sm"></span> Added</span>
          </div>
        </div>

        <div className="p-3 max-h-[350px] overflow-y-auto font-mono text-xs divide-y divide-slate-100/30 dark:divide-slate-800/20">
          {diffLines.map((line, index) => {
            const isAdd = line.type === 'add';
            const isRemove = line.type === 'remove';
            
            return (
              <div 
                key={index} 
                className={`flex py-0.5 leading-relaxed ${
                  isAdd ? 'bg-emerald-50 dark:bg-emerald-950/15 text-emerald-700 dark:text-emerald-400' :
                  isRemove ? 'bg-rose-50 dark:bg-rose-950/15 text-rose-750 dark:text-rose-400' :
                  'text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="w-12 select-none text-[10px] text-slate-400 dark:text-slate-500 flex justify-between px-2 font-semibold">
                  <span className="w-1/2 text-left">{line.lineNo1 || ''}</span>
                  <span className="w-1/2 text-right">{line.lineNo2 || ''}</span>
                </div>
                <div className="w-6 select-none font-extrabold text-center shrink-0">
                  {isAdd ? '+' : isRemove ? '-' : ' '}
                </div>
                <div className="flex-1 whitespace-pre-wrap pl-2 break-all">
                  {line.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

