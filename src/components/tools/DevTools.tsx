import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, Copy, RefreshCw, Key, Braces, AlertCircle, Play, Keyboard, 
  Trash2, Download, ShieldCheck, FileCode, CheckCircle2, FileDown, 
  Terminal, Settings, Info, ArrowDown, ClipboardCopy
} from 'lucide-react';

// ==========================================
// SHARED UTILITY COMPONENTS & HELPERS
// ==========================================

// Helper to trigger standard client-side text download
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

// Reusable Copy Button
const CopyButton = ({ text, label = "Copy" }: { text: string; label?: string }) => {
  const [copied, setCopied] = useState(false);
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
      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-750 dark:text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

// Reusable Clear Button
const ClearButton = ({ onClear, disabled }: { onClear: () => void; disabled?: boolean }) => {
  return (
    <button
      onClick={onClear}
      disabled={disabled}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-450 dark:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-750 dark:text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
      title="Clear fields"
    >
      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
      <span>Clear</span>
    </button>
  );
};

// Reusable Download Button
const DownloadButton = ({ content, fileName, disabled, label = "Download" }: { content: string; fileName: string; disabled?: boolean; label?: string }) => {
  return (
    <button
      onClick={() => downloadTextFile(content, fileName)}
      disabled={disabled || !content}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-750 dark:text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
      title="Download output as file"
    >
      <Download className="w-3.5 h-3.5 text-blue-500" />
      <span>{label}</span>
    </button>
  );
};

// Tool Info / Description Card
const ToolDescription = ({ title, description, tip }: { title: string; description: string; tip?: string }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-150 dark:border-slate-800/80 mb-5 text-left">
      <div className="flex gap-2.5 items-start">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-black tracking-wide text-slate-800 dark:text-slate-200 uppercase">{title} Information</h4>
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
            {description}
          </p>
          {tip && (
            <p className="text-[10px] leading-normal text-amber-600 dark:text-amber-400 font-semibold pt-1">
              💡 Pro Tip: {tip}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Input Validation Badge
const ValidationBadge = ({ isValid, message, checkingMsg = "Ready for input" }: { isValid: boolean | null; message: string; checkingMsg?: string }) => {
  if (isValid === true) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-450 border border-emerald-200/30">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        {message || "Valid Input"}
      </span>
    );
  }
  if (isValid === false) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-450 border border-rose-200/30">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        {message || "Validation Error"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/20">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
      {checkingMsg}
    </span>
  );
};


// ==========================================
// 1. UUID GENERATOR COMPONENT
// ==========================================
const UuidGen = () => {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const [uppercase, setUppercase] = useState(false);

  const generateUUIDs = () => {
    const list = [];
    // Ensure Count bounds
    const secureCount = Math.max(1, Math.min(100, count));
    for (let i = 0; i < secureCount; i++) {
      let uuid = '';
      if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
        uuid = window.crypto.randomUUID();
      } else {
        uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      }
      list.push(uppercase ? uuid.toUpperCase() : uuid.toLowerCase());
    }
    setUuids(list);
  };

  useEffect(() => {
    generateUUIDs();
  }, [count, uppercase]);

  const handleClear = () => {
    setUuids([]);
  };

  const getFullString = () => uuids.join('\n');

  return (
    <div className="space-y-4 text-left">
      <ToolDescription 
        title="UUID Generator"
        description="Create cryptographically secure v4 Universally Unique Identifiers (UUIDs) locally in your browser. Perfect for database primary keys, mock seed generators, and unique transaction references."
        tip="Switch ON the UPPERCASE toggle if you are seeding database keys in systems like Microsoft SQL Server or SAP."
      />

      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-150 dark:border-slate-800/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex flex-col gap-1 text-xs font-bold text-slate-600 dark:text-slate-350">
            <span>Quantity (1 - 100)</span>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
              className="px-3 py-1.5 w-24 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-bold"
            />
          </label>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-650 dark:text-slate-300 cursor-pointer mt-5">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <span>UPPERCASE</span>
          </label>
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <ClearButton onClear={handleClear} disabled={uuids.length === 0} />
          <button
            onClick={generateUUIDs}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-650 hover:bg-blue-700 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>
        </div>
      </div>

      {uuids.length > 0 ? (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between bg-slate-100/50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/40">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
              Generated {uuids.length} Keys Bundle
            </span>
            <div className="flex items-center gap-2">
              <CopyButton text={getFullString()} label="Copy All" />
              <DownloadButton content={getFullString()} fileName="uuids.txt" label="Download Keys" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto pr-1">
            {uuids.map((uuid, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 p-2.5 bg-white dark:bg-slate-950 border border-slate-200/70 dark:border-slate-850 rounded-xl hover:border-blue-500/30 dark:hover:border-blue-500/20 transition-all shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 text-[9px] font-mono font-bold bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 rounded flex items-center justify-center">
                    {i + 1}
                  </span>
                  <code className="text-xs text-blue-650 dark:text-blue-400 select-all font-mono break-all font-bold">
                    {uuid}
                  </code>
                </div>
                <CopyButton text={uuid} label="Copy" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl">
          <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-xs font-bold text-slate-400">Clear Slate</h4>
          <p className="text-[11px] text-slate-400/80 mt-1">Click Regenerate to generate UUID keys again.</p>
        </div>
      )}
    </div>
  );
};


// ==========================================
// 2. BASE64 ENCODER/DECODER COMPONENT
// ==========================================
const Base64Codec = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationMsg, setValidationMsg] = useState('');

  // Auto-run encoder/decoder with input validation
  useEffect(() => {
    if (!input) {
      setOutput('');
      setIsValid(null);
      setValidationMsg('');
      return;
    }

    if (mode === 'encode') {
      try {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
        setIsValid(true);
        setValidationMsg('Successfully encoded to Base64');
      } catch (e) {
        setOutput('');
        setIsValid(false);
        setValidationMsg('Encode failure (illegal UTF-8 sequences)');
      }
    } else {
      // Decode Mode
      const sanitized = input.trim().replace(/\s+/g, '');
      
      // Basic base64 pattern check: A-Z, a-z, 0-9, +, /, and padding =
      const base64Regex = /^[a-zA-Z0-9+/]*={0,2}$/;
      if (!base64Regex.test(sanitized)) {
        setOutput('');
        setIsValid(false);
        setValidationMsg('Invalid characters detected for Base64 standard');
        return;
      }
      
      try {
        const decoded = decodeURIComponent(escape(atob(sanitized)));
        setOutput(decoded);
        setIsValid(true);
        setValidationMsg('Successfully decoded from Base64');
      } catch (e) {
        setOutput('');
        setIsValid(false);
        setValidationMsg('Malformed Base64 payload or padding error');
      }
    }
  }, [input, mode]);

  const handleClear = () => {
    setInput('');
    setOutput('');
    setIsValid(null);
    setValidationMsg('');
  };

  return (
    <div className="space-y-4 text-left">
      <ToolDescription 
        title="Base64 Encoder / Decoder"
        description="Safely encode plain-text strings into ASCII-safe Base64 values, or decode base64 hashes back. Ideal for HTTP headers, basic authorization payload parsing, and secure data mapping."
        tip="Standard Base64 strings can contain trailing '=' characters which act as structural padding."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-150 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200/60 dark:border-slate-800">
            <button
              onClick={() => { setMode('encode'); setInput(output || input); }}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                mode === 'encode' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-450 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Encode Plaintext
            </button>
            <button
              onClick={() => { setMode('decode'); setInput(output || input); }}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                mode === 'decode' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-450 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Decode Base64
            </button>
          </div>
          <ValidationBadge isValid={isValid} message={validationMsg} checkingMsg="Waiting for inputs" />
        </div>
        <ClearButton onClear={handleClear} disabled={!input} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center justify-between">
            <span>{mode === 'encode' ? 'Raw Input Plaintext' : 'Base64 Input Payload'}</span>
            <span className="text-[10px] lowercase text-slate-400 font-normal">({input.length} chars)</span>
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Type or paste readable text to encode...' : 'Paste Base64 code to decode...'}
            className="w-full h-56 p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs font-mono font-bold leading-relaxed shadow-inner text-slate-800 dark:text-slate-150"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
              {mode === 'encode' ? 'Base64 Encoded Result' : 'Plaintext Decoded Output'}
            </span>
            <div className="flex items-center gap-1.5">
              <CopyButton text={output} />
              <DownloadButton content={output} fileName={mode === 'encode' ? 'base64_encoded.txt' : 'base64_decoded.txt'} />
            </div>
          </div>
          {isValid === false ? (
            <div className="w-full h-56 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex gap-2.5 items-start font-mono font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
              <div className="space-y-1">
                <span className="font-bold">Input Validation Fault</span>
                <p>{validationMsg}</p>
                <p className="text-[10px] text-rose-500/80 font-sans mt-2 leading-relaxed">
                  Tip: Base64 strings must contain only A-Z, a-z, 0-9, +, /, and up to two trailing = signs. No special characters or spaces are allowed.
                </p>
              </div>
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              placeholder="Output will display here..."
              className="w-full h-56 p-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-xs font-mono font-bold leading-relaxed select-all text-slate-800 dark:text-slate-150"
            />
          )}
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 3. URL ENCODER/DECODER COMPONENT
// ==========================================
const UrlCodec = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationMsg, setValidationMsg] = useState('');

  useEffect(() => {
    if (!input) {
      setOutput('');
      setIsValid(null);
      setValidationMsg('');
      return;
    }
    try {
      if (mode === 'encode') {
        // Encodes characters that are special in URLs
        setOutput(encodeURIComponent(input));
        setIsValid(true);
        setValidationMsg('Successfully URL Encoded');
      } else {
        // Decode
        if (input.includes('%') && !/%[0-9a-fA-F]{2}/.test(input)) {
          setIsValid(false);
          setValidationMsg('Suspicious % character without 2 hex values. Might crash.');
        }
        setOutput(decodeURIComponent(input));
        setIsValid(true);
        setValidationMsg('Successfully URL Decoded');
      }
    } catch (e: any) {
      setOutput('');
      setIsValid(false);
      setValidationMsg('Invalid percent-encoding sequence detected');
    }
  }, [input, mode]);

  const handleClear = () => {
    setInput('');
    setOutput('');
    setIsValid(null);
    setValidationMsg('');
  };

  return (
    <div className="space-y-4 text-left">
      <ToolDescription 
        title="URL Encoder / Decoder"
        description="Encode parameters, values, and query keys into safe HTTP percentage representations, or decode escaped query arguments back to standard human form."
        tip="Spaces are encoded as %20. Query parameters like & and = are encoded to avoid parsing conflicts on server engines."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-150 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200/60 dark:border-slate-800">
            <button
              onClick={() => { setMode('encode'); setInput(output || input); }}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                mode === 'encode' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-450 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Encode Parameters
            </button>
            <button
              onClick={() => { setMode('decode'); setInput(output || input); }}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                mode === 'decode' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-450 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Decode URLs
            </button>
          </div>
          <ValidationBadge isValid={isValid} message={validationMsg} checkingMsg="Waiting for inputs" />
        </div>
        <ClearButton onClear={handleClear} disabled={!input} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
            {mode === 'encode' ? 'Unescaped Parameters Input' : 'Percent-Encoded URL Input'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Type parameters (e.g., text=hello & page=5)...' : 'Paste percent encoded string (e.g., text%3Dhello%20%26%20page%3D5)...'}
            className="w-full h-56 p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono font-bold leading-relaxed text-slate-800 dark:text-slate-150 shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
              {mode === 'encode' ? 'URL Percent-Encoded Result' : 'Unescaped Decoded Output'}
            </span>
            <div className="flex items-center gap-1.5">
              <CopyButton text={output} />
              <DownloadButton content={output} fileName={mode === 'encode' ? 'url_encoded.txt' : 'url_decoded.txt'} />
            </div>
          </div>
          {isValid === false ? (
            <div className="w-full h-56 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex gap-2.5 items-start font-mono font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
              <div className="space-y-1">
                <span className="font-bold">Decoding Exception</span>
                <p>{validationMsg}</p>
                <p className="text-[10px] text-rose-500/80 font-sans mt-2 leading-relaxed">
                  Tip: Percentage values must be followed by exactly 2 hexadecimal digits (e.g. %2F, %2A). Unmatched or isolated % signs can trigger compilation warnings.
                </p>
              </div>
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              placeholder="Result will appear here..."
              className="w-full h-56 p-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-xs font-mono font-bold leading-relaxed select-all text-slate-800 dark:text-slate-150"
            />
          )}
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 4. JSON FORMATTER & VALIDATOR COMPONENT
// ==========================================
const JsonValidator = () => {
  const [input, setInput] = useState('{\n  "app": "DevBox Offline Suite",\n  "version": 1.2,\n  "secure": true,\n  "supportedOperations": [\n    "formatting",\n    "validation",\n    "compression"\n  ]\n}');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'pretty2' | 'pretty4' | 'minify'>('pretty2');

  const processJSON = (space: number | null, sourceText: string = input) => {
    if (!sourceText.trim()) {
      setOutput('');
      setIsValid(null);
      setErrorMsg('');
      return;
    }
    try {
      const parsed = JSON.parse(sourceText);
      if (space !== null) {
        setOutput(JSON.stringify(parsed, null, space));
      } else {
        setOutput(JSON.stringify(parsed));
      }
      setIsValid(true);
      setErrorMsg('');
    } catch (e: any) {
      setIsValid(false);
      setErrorMsg(e.message);
      setOutput('');
    }
  };

  useEffect(() => {
    const space = activeTab === 'pretty2' ? 2 : activeTab === 'pretty4' ? 4 : null;
    processJSON(space);
  }, [input, activeTab]);

  const loadDemo = () => {
    const demo = `{
  "name": "DevBox",
  "status": "online",
  "meta": {
    "secure": true,
    "sandbox": "javascript-client-side",
    "ports": [3000]
  },
  "toolsList": [
    "UUID Generator",
    "Base64 Codec",
    "Regex Tester",
    "JWT Parser"
  ],
  "author": "universe"
}`;
    setInput(demo);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setIsValid(null);
    setErrorMsg('');
  };

  return (
    <div className="space-y-4 text-left">
      <ToolDescription 
        title="JSON Formatter & Validator"
        description="Paste raw JSON strings to clean, prettify, compress, and check structural validity instantly. High performance offline parser details exact line indexes and broken keys in case of parsing faults."
        tip="JSON keys and string values MUST be bound with double quotes (\x22). Single quotes (\x27) are illegal in JSON standards."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-150 dark:border-slate-800/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200/65 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('pretty2')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                activeTab === 'pretty2' ? 'bg-white dark:bg-slate-800 text-blue-650 dark:text-blue-400 shadow-sm' : 'text-slate-450 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              2 Spaces
            </button>
            <button
              onClick={() => setActiveTab('pretty4')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                activeTab === 'pretty4' ? 'bg-white dark:bg-slate-800 text-blue-650 dark:text-blue-400 shadow-sm' : 'text-slate-450 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              4 Spaces
            </button>
            <button
              onClick={() => setActiveTab('minify')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                activeTab === 'minify' ? 'bg-white dark:bg-slate-800 text-blue-650 dark:text-blue-400 shadow-sm' : 'text-slate-450 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Minify (Compact)
            </button>
          </div>

          <button
            onClick={loadDemo}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Load Sample JSON
          </button>
        </div>

        <div className="flex items-center gap-2">
          <ValidationBadge isValid={isValid} message="JSON Standard Valid" checkingMsg="Waiting for JSON input" />
          <ClearButton onClear={handleClear} disabled={!input} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono flex justify-between items-center">
            <span>Raw JSON Input Panel</span>
            <span className="text-[10px] text-slate-400 normal-case font-normal">({input.length} chars)</span>
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type, edit or paste your raw JSON string here..."
            className="w-full h-80 p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono font-bold leading-relaxed text-slate-800 dark:text-slate-150 shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
              Parsed Format Result
            </span>
            <div className="flex items-center gap-1.5">
              <CopyButton text={output} />
              <DownloadButton content={output} fileName={activeTab === 'minify' ? 'minified.json' : 'formatted.json'} />
            </div>
          </div>
          {isValid === false ? (
            <div className="w-full h-80 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex gap-2.5 items-start font-mono font-semibold overflow-y-auto">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-500 mt-0.5" />
              <div className="space-y-2">
                <span className="font-bold text-rose-700 dark:text-rose-350 block">JSON Syntax Compilation Error:</span>
                <p className="whitespace-pre-wrap text-[11px] leading-relaxed bg-white/40 dark:bg-black/20 p-2.5 rounded-lg border border-rose-200/50 dark:border-rose-900/20">{errorMsg}</p>
                <div className="text-[10px] text-rose-500/80 font-sans leading-relaxed space-y-1">
                  <span className="font-bold">Common JSON mistakes to verify:</span>
                  <ul className="list-disc pl-3.5 space-y-0.5">
                    <li>Using unescaped single quotes on object keys</li>
                    <li>Trailing commas after the last array/object element</li>
                    <li>Missing commas separating key/value properties</li>
                    <li>Unmatched opening/closing brackets</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              placeholder="Clean structured JSON will format here automatically..."
              className="w-full h-80 p-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-xs font-mono font-bold leading-relaxed select-all text-slate-800 dark:text-slate-150"
            />
          )}
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 5. REGEX TESTER COMPONENT
// ==========================================
const RegexTester = () => {
  const [pattern, setPattern] = useState('([A-Z][a-z]+)');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('DevBox is a Client-Side tools platform compiled with React 18, TypeScript, and Tailwind CSS.');
  const [matches, setMatches] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!pattern) {
      setMatches([]);
      setError('');
      setIsValid(null);
      return;
    }
    try {
      const regex = new RegExp(pattern, flags);
      const list: any[] = [];

      if (flags.includes('g')) {
        let match;
        regex.lastIndex = 0;
        let limit = 0;
        while ((match = regex.exec(text)) !== null && limit < 1000) {
          list.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          if (match[0].length === 0) {
            regex.lastIndex++;
          }
          limit++;
        }
      } else {
        const match = regex.exec(text);
        if (match) {
          list.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }
      setMatches(list);
      setError('');
      setIsValid(true);
    } catch (e: any) {
      setMatches([]);
      setError(e.message);
      setIsValid(false);
    }
  }, [pattern, flags, text]);

  const highlightMatches = () => {
    if (error || !pattern || matches.length === 0) return text;
    try {
      const regex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      const parts = [];
      let lastIndex = 0;
      let match;
      let limit = 0;

      regex.lastIndex = 0;
      while ((match = regex.exec(text)) !== null && limit < 1000) {
        const start = match.index;
        const end = start + match[0].length;

        if (start > lastIndex) {
          parts.push(text.slice(lastIndex, start));
        }

        parts.push(
          <mark key={limit} className="bg-blue-200 dark:bg-blue-900/85 text-blue-900 dark:text-blue-100 px-0.5 rounded font-black shadow-sm font-mono ring-1 ring-blue-400/20">
            {match[0]}
          </mark>
        );

        lastIndex = end;
        if (match[0].length === 0) {
          regex.lastIndex++;
        }
        limit++;
      }

      if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
      }

      return parts.length > 0 ? parts : text;
    } catch (e) {
      return text;
    }
  };

  const handleClear = () => {
    setPattern('');
    setFlags('g');
    setText('');
    setMatches([]);
    setError('');
    setIsValid(null);
  };

  const getMatchReport = () => {
    const report = {
      regex: `/${pattern}/${flags}`,
      totalMatches: matches.length,
      timestamp: new Date().toISOString(),
      matches: matches.map((m, i) => ({
        matchIndex: i + 1,
        string: m.text,
        charIndex: m.index,
        subGroups: m.groups
      }))
    };
    return JSON.stringify(report, null, 2);
  };

  return (
    <div className="space-y-4 text-left">
      <ToolDescription 
        title="Regex Tester"
        description="Verify JavaScript/TypeScript compatible regular expression matches in real-time. Highlights match terms in test bodies, outputs capturing groups, and lists accurate character index arrays."
        tip="Use the 'g' flag (global) to capture all instances. Without 'g', the tester captures only the first match index."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-150 dark:border-slate-800/80">
        <div className="md:col-span-2 flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Regular Expression Pattern</span>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g. ([A-Z][a-z]+) or \\d+"
              className="w-full pl-6 pr-6 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono font-bold text-slate-800 dark:text-slate-150"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">/</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Flags</span>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value.replace(/[^gimy]/g, ''))}
            placeholder="g, i, m..."
            className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono font-bold text-slate-800 dark:text-slate-150"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <ValidationBadge isValid={isValid} message="Regex Compliant" checkingMsg="Specify a Regex structure" />
          {isValid === true && (
            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-[10px] font-bold rounded-md">
              {matches.length} Matches Found
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <CopyButton text={getMatchReport()} label="Copy Match Report" />
          <DownloadButton content={getMatchReport()} fileName="regex_matches_report.json" label="Download Report" />
          <ClearButton onClear={handleClear} disabled={!pattern && !text} />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
          <div className="space-y-0.5">
            <span className="font-bold">RegExp Regex Syntax Exception:</span>
            <p className="font-semibold text-[11px]">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono flex justify-between">
            <span>Test Text Body</span>
            <span className="text-[10px] font-normal normal-case text-slate-400">({text.length} chars)</span>
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-48 p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono font-bold leading-relaxed text-slate-800 dark:text-slate-150 shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
              Live Highlight Matches
            </span>
          </div>
          <div className="w-full h-48 p-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold leading-relaxed overflow-auto whitespace-pre-wrap select-text text-slate-800 dark:text-slate-150">
            {highlightMatches()}
          </div>
        </div>
      </div>

      {matches.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono block">
            Capturing Groups Details
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-56 overflow-y-auto pr-1">
            {matches.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-850 shadow-sm space-y-1.5 text-xs"
              >
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span>Match #{idx + 1}</span>
                  <span className="font-mono">charIndex: {item.index}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-150 dark:border-slate-800/60 flex items-center justify-between">
                  <code className="font-mono text-blue-650 dark:text-blue-400 font-bold break-all select-all">{item.text}</code>
                  <CopyButton text={item.text} />
                </div>
                {item.groups && item.groups.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-900">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Capture Groups:</span>
                    <div className="flex flex-wrap gap-1">
                      {item.groups.map((grp: string, gIdx: number) => (
                        <span key={gIdx} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900 rounded text-[10px] font-mono font-bold">
                          {gIdx + 1}: <span className="text-slate-700 dark:text-slate-200">{grp || '""'}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


// ==========================================
// 6. HTML ENTITIES CONVERTER COMPONENT
// ==========================================
const HtmlEntities = () => {
  const [input, setInput] = useState('<h1>Hello & welcome to "DevBox" Suite!</h1>');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const charMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  const encodeEntities = (str: string) => {
    return str.replace(/[&<>"']/g, (m) => charMap[m]);
  };

  const decodeEntities = (str: string) => {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    return doc.documentElement.textContent || '';
  };

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setIsValid(null);
      return;
    }
    if (mode === 'encode') {
      setOutput(encodeEntities(input));
      setIsValid(true);
    } else {
      setOutput(decodeEntities(input));
      setIsValid(true);
    }
  }, [input, mode]);

  const handleClear = () => {
    setInput('');
    setOutput('');
    setIsValid(null);
  };

  return (
    <div className="grid grid-cols-1 gap-4 text-left">
      <ToolDescription 
        title="HTML Entities Converter"
        description="Escape raw XML or HTML code blocks safely to prevent cross-site script (XSS) rendering injections. Alternatively, unescape HTML code representations back to clear plain-text characters."
        tip="Escaped characters are safe to include inside standard paragraph displays and Markdown structures."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-150 dark:border-slate-800/80 shadow-sm">
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200/60 dark:border-slate-800">
          <button
            onClick={() => { setMode('encode'); setInput(output || input); }}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
              mode === 'encode' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-450 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Encode (Escape)
          </button>
          <button
            onClick={() => { setMode('decode'); setInput(output || input); }}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
              mode === 'decode' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-450 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Decode (Unescape)
          </button>
        </div>

        <ClearButton onClear={handleClear} disabled={!input} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
            {mode === 'encode' ? 'HTML Plaintext Input' : 'HTML Entities Input'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Type or paste raw markup (e.g. <div>Hello</div>)...' : 'Paste entities (e.g. &lt;div&gt;Hello&lt;/div&gt;)...'}
            className="w-full h-48 p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono font-bold leading-relaxed text-slate-800 dark:text-slate-150 shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
              Resulting Code Block
            </span>
            <div className="flex items-center gap-1.5">
              <CopyButton text={output} />
              <DownloadButton content={output} fileName={mode === 'encode' ? 'escaped_html.txt' : 'unescaped_html.html'} />
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Parsed result will format automatically..."
            className="w-full h-48 p-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-xs font-mono font-bold leading-relaxed select-all text-slate-800 dark:text-slate-150"
          />
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 7. JWT DECODER COMPONENT
// ==========================================
const JwtDecoder = () => {
  const demoJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjI1MTYyMzkwMjIsImFkbWluIjp0cnVlfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  const [token, setToken] = useState(demoJWT);
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [valid, setValid] = useState<boolean | null>(null);
  const [expiry, setExpiry] = useState('');
  const [expState, setExpState] = useState<'expired' | 'active' | 'none'>('none');

  useEffect(() => {
    if (!token.trim()) {
      setHeader('');
      setPayload('');
      setValid(null);
      setExpiry('');
      setExpState('none');
      return;
    }

    try {
      const parts = token.trim().split('.');
      if (parts.length !== 3) {
        throw new Error('JWT standard structure demands exactly 3 sections separated by dots.');
      }

      const decodeB64Url = (str: string) => {
        let clean = str.replace(/-/g, '+').replace(/_/g, '/');
        while (clean.length % 4) {
          clean += '=';
        }
        return decodeURIComponent(escape(atob(clean)));
      };

      const headerJson = JSON.parse(decodeB64Url(parts[0]));
      const payloadJson = JSON.parse(decodeB64Url(parts[1]));

      setHeader(JSON.stringify(headerJson, null, 2));
      setPayload(JSON.stringify(payloadJson, null, 2));
      setValid(true);

      if (payloadJson.exp) {
        const date = new Date(payloadJson.exp * 1000);
        const expired = date.getTime() < Date.now();
        setExpiry(`${date.toLocaleString()} (${expired ? 'Expired' : 'Active'})`);
        setExpState(expired ? 'expired' : 'active');
      } else {
        setExpiry('No exp (expiration) property declared.');
        setExpState('none');
      }
    } catch (e: any) {
      setHeader('');
      setPayload('');
      setValid(false);
      setExpiry('Decode Fault: ' + e.message);
      setExpState('none');
    }
  }, [token]);

  const handleClear = () => {
    setToken('');
    setHeader('');
    setPayload('');
    setValid(null);
    setExpiry('');
    setExpState('none');
  };

  const getFullBundle = () => {
    const bundle = {
      header: header ? JSON.parse(header) : {},
      payload: payload ? JSON.parse(payload) : {},
      tokenInput: token
    };
    return JSON.stringify(bundle, null, 2);
  };

  return (
    <div className="space-y-4 text-left">
      <ToolDescription 
        title="JWT Decoder"
        description="Decode, inspect, and audit your JSON Web Tokens (JWT) locally. Extract header metadata, payload claims, and check token expiry values immediately without releasing any secrets over API links."
        tip="JWT payloads are Base64Url encoded. They are completely legible to anyone with the token, so never put sensitive passwords or keys inside payload claims."
      />

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-150 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Pasted JWT Token Input</span>
            <button
              onClick={() => setToken(demoJWT)}
              className="text-[10px] bg-blue-50 dark:bg-blue-950/40 text-blue-650 dark:text-blue-400 font-extrabold px-2 py-0.5 rounded-md border border-blue-150 hover:underline"
            >
              Load Demo JWT
            </button>
          </div>
          <ClearButton onClear={handleClear} disabled={!token} />
        </div>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste JWT string here..."
          className="w-full h-24 p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono font-bold leading-relaxed text-slate-800 dark:text-slate-150 shadow-inner break-all"
        />
      </div>

      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-150 dark:border-slate-800/80 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Parser Audit:</span>
          <ValidationBadge isValid={valid} message="JWT Successfully Decoded" checkingMsg="Specify token string" />
        </div>
        {valid && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Expiration:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
              expState === 'active' ? 'bg-emerald-100 text-emerald-800 border-emerald-200/40 dark:bg-emerald-950/40 dark:text-emerald-450' : 
              expState === 'expired' ? 'bg-rose-100 text-rose-800 border-rose-200/40 dark:bg-rose-950/40 dark:text-rose-450' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-transparent'
            }`}>
              {expiry}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Decoded Token Header</span>
            <div className="flex items-center gap-1.5">
              <CopyButton text={header} />
              <DownloadButton content={header} fileName="jwt_header.json" />
            </div>
          </div>
          <textarea
            readOnly
            value={header || 'Waiting for valid JWT header...'}
            className="w-full h-52 p-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold leading-relaxed focus:outline-none text-slate-800 dark:text-slate-150"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Decoded Payload Claims</span>
            <div className="flex items-center gap-1.5">
              <CopyButton text={payload} />
              <DownloadButton content={payload} fileName="jwt_payload.json" />
            </div>
          </div>
          <textarea
            readOnly
            value={payload || 'Waiting for valid JWT payload...'}
            className="w-full h-52 p-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold leading-relaxed focus:outline-none text-slate-800 dark:text-slate-150"
          />
        </div>
      </div>

      {valid && (
        <div className="pt-2 flex justify-end">
          <DownloadButton content={getFullBundle()} fileName="jwt_decoded_bundle.json" label="Download Complete Decoded Bundle" />
        </div>
      )}
    </div>
  );
};


// ==========================================
// 8. KEYBOARD EVENT DETECTOR COMPONENT
// ==========================================
interface KeyEventInfo {
  key: string;
  code: string;
  keyCode: number;
  which: number;
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
  timestamp: string;
}

const KeyboardDetector = () => {
  const [eventData, setEventData] = useState<KeyEventInfo | null>(null);
  const [history, setHistory] = useState<KeyEventInfo[]>([]);
  const captureAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If we are active on this view, capture keyboard event
      const newEvent: KeyEventInfo = {
        key: e.key,
        code: e.code,
        keyCode: e.keyCode,
        which: e.which,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        metaKey: e.metaKey,
        timestamp: new Date().toLocaleTimeString()
      };

      setEventData(newEvent);
      setHistory(prev => [newEvent, ...prev].slice(0, 50));
      
      // Prevent browser default backspacing or paging only if in focused detector container
      if (document.activeElement === captureAreaRef.current) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleClear = () => {
    setEventData(null);
    setHistory([]);
  };

  const getFullLogs = () => {
    return JSON.stringify(history, null, 2);
  };

  return (
    <div className="space-y-4 text-left">
      <ToolDescription 
        title="Keyboard Event Detector"
        description="Inspect JavaScript key events and modifier flags instantly. Press any key to record parameters like key, keycode, shift, alt, or meta modifiers in real-time."
        tip="Click into the browser panel and keypress. Useful for game controller binding development or layout accessibility audits."
      />

      <div 
        ref={captureAreaRef}
        tabIndex={0}
        className="py-8 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all group shadow-inner"
      >
        <Keyboard className="w-10 h-10 text-blue-500 group-focus:scale-110 transition-transform duration-200" />
        <p className="text-sm font-black text-slate-800 dark:text-slate-200">
          Click Here & Type Anything
        </p>
        <p className="text-[11px] text-slate-400 font-medium">
          Capturing active keyboard events. Works across standard devices.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-200/50 dark:border-slate-800/60 shadow-sm">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
          Event History Log ({history.length})
        </span>
        <div className="flex items-center gap-1.5">
          <CopyButton text={getFullLogs()} label="Copy All Logs" />
          <DownloadButton content={getFullLogs()} fileName="keyboard_events_log.json" label="Download Log (.json)" />
          <ClearButton onClear={handleClear} disabled={history.length === 0} />
        </div>
      </div>

      {eventData ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl shadow-sm text-center">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">event.key</span>
            <span className="text-xl font-black text-blue-650 dark:text-blue-400 font-mono select-all break-all">
              {eventData.key === ' ' ? 'Space' : eventData.key}
            </span>
          </div>
          <div className="p-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl shadow-sm text-center">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">event.code</span>
            <span className="text-xl font-black text-blue-650 dark:text-blue-400 font-mono select-all break-all">
              {eventData.code}
            </span>
          </div>
          <div className="p-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl shadow-sm text-center">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">event.keyCode</span>
            <span className="text-xl font-black text-blue-650 dark:text-blue-400 font-mono select-all break-all">
              {eventData.keyCode}
            </span>
          </div>
          <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl shadow-sm flex flex-col justify-center text-center">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Active Modifiers</span>
            <div className="flex justify-center gap-1 flex-wrap text-[9px] font-mono font-bold">
              <span className={`px-1.5 py-0.5 rounded ${eventData.ctrlKey ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-650'}`}>
                Ctrl
              </span>
              <span className={`px-1.5 py-0.5 rounded ${eventData.shiftKey ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-650'}`}>
                Shift
              </span>
              <span className={`px-1.5 py-0.5 rounded ${eventData.altKey ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-650'}`}>
                Alt
              </span>
              <span className={`px-1.5 py-0.5 rounded ${eventData.metaKey ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-650'}`}>
                Meta
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl">
          <p className="text-xs text-slate-400 font-semibold">No keyboard event captured yet. Click on box above to begin testing.</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono block">Captured Keys Stack (Up to 50 items)</span>
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl overflow-x-auto">
            <table className="w-full text-xs font-mono font-semibold">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-left text-slate-450 uppercase text-[9px] tracking-wider">
                  <th className="p-2">Time</th>
                  <th className="p-2">event.key</th>
                  <th className="p-2">event.code</th>
                  <th className="p-2">keyCode</th>
                  <th className="p-2">Modifiers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-850 text-slate-700 dark:text-slate-300">
                {history.map((h, i) => (
                  <tr key={i} className="hover:bg-slate-100/30 dark:hover:bg-slate-900/20">
                    <td className="p-2 text-[10px] text-slate-400">{h.timestamp}</td>
                    <td className="p-2 text-blue-600 dark:text-blue-400 font-bold">{h.key === ' ' ? 'Space' : h.key}</td>
                    <td className="p-2">{h.code}</td>
                    <td className="p-2">{h.keyCode}</td>
                    <td className="p-2 flex gap-1">
                      {h.ctrlKey && <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 px-1 rounded text-[9px]">C</span>}
                      {h.shiftKey && <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 px-1 rounded text-[9px]">S</span>}
                      {h.altKey && <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 px-1 rounded text-[9px]">A</span>}
                      {h.metaKey && <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 px-1 rounded text-[9px]">M</span>}
                      {!h.ctrlKey && !h.shiftKey && !h.altKey && !h.metaKey && <span className="text-slate-400 text-[9px]">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};


// ==========================================
// 9. HTML FORMATTER & BEAUTIFIER COMPONENT
// ==========================================
const HtmlBeautifier = () => {
  const [input, setInput] = useState('<div class="profile-card"><h2 id="name">Jane Doe</h2><p className="description">Backend Architect & security engineer</p>  <br><ul><li>Fast</li><li>Serverless</li></ul></div>');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const formatHTML = (html: string, size: number) => {
    let formatted = '';
    let indent = '';
    const tab = ' '.repeat(size);
    // split HTML elements by tag groups safely
    const reg = /(<\/?[^>]+>)/g;
    const elements = html.replace(reg, '\n$1\n').split('\n');

    elements.forEach((el) => {
      const element = el.trim();
      if (!element) return;

      if (element.match(/^<\/\w/)) {
        // Closing tags: decrease indent size
        indent = indent.substring(tab.length);
        formatted += indent + element + '\n';
      } else if (element.match(/^<\w[^>]*[^\/]>$/)) {
        // Opening tags (not self closing)
        formatted += indent + element + '\n';
        if (!element.match(/^(?:area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i)) {
          indent += tab;
        }
      } else if (element.match(/^<\w[^>]*\/>$/)) {
        // Self-closing tags with tailing slash
        formatted += indent + element + '\n';
      } else {
        // Standard text elements
        formatted += indent + element + '\n';
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
    const res = formatHTML(input, indentSize);
    setOutput(res);
    setIsValid(true);
  }, [input, indentSize]);

  const handleClear = () => {
    setInput('');
    setOutput('');
    setIsValid(null);
  };

  return (
    <div className="space-y-4 text-left">
      <ToolDescription 
        title="HTML Beautifier"
        description="Format minified, messy, or unindented HTML structures into beautifully structured nested files. Aligns nested blocks and properly indents tags based on standard tag hierarchy specifications."
        tip="Self-closing tags such as <br>, <img>, and <input> do not require closing companions and do not increment nesting indentation."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-150 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <span>Indentation:</span>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(parseInt(e.target.value))}
              className="px-2 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-xs font-bold focus:outline-none"
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
              <option value={8}>8 Spaces</option>
            </select>
          </label>
          <ValidationBadge isValid={isValid} message="HTML Formatted Successfully" checkingMsg="Specify HTML markup" />
        </div>
        <ClearButton onClear={handleClear} disabled={!input} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
            Messy or Minified HTML Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste HTML source block (e.g. <div><h1>Title</h1></div>)..."
            className="w-full h-80 p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono font-bold leading-relaxed text-slate-800 dark:text-slate-150 shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
              Beautified & Nested Output
            </span>
            <div className="flex items-center gap-1.5">
              <CopyButton text={output} />
              <DownloadButton content={output} fileName="beautified.html" />
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Formatted markup will render automatically here..."
            className="w-full h-80 p-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-xs font-mono font-bold leading-relaxed select-all text-slate-800 dark:text-slate-150"
          />
        </div>
      </div>
    </div>
  );
};


// ==========================================
// PORTFOLIO DIRECTORY REGISTRATION
// ==========================================
export const devToolsComponents: Record<string, () => React.JSX.Element> = {
  'uuid-gen': UuidGen,
  'base64-codec': Base64Codec,
  'url-codec': UrlCodec,
  'json-validator': JsonValidator,
  'regex-tester': RegexTester,
  'html-entities': HtmlEntities,
  'jwt-decoder': JwtDecoder,
  'key-detector': KeyboardDetector,
  'html-beautifier': HtmlBeautifier,
};
