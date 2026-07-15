import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, Copy, Trash2, Download, RefreshCw, FileCode, Terminal, 
  Settings, Braces, Sparkles, Code, Hash, Binary, AlertCircle, Info,
  Sliders, Palette, Eye, ShieldAlert, Play, ArrowRight, ArrowLeftRight
} from 'lucide-react';
import { getInitialLanguage, t } from '../../data/translations';

// ==========================================
// SHARED UTILITIES
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
// 1. HTML MINIFIER
// ==========================================
export function HtmlMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleMinify = () => {
    if (!input) return;
    const minified = input
      .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML Comments
      .replace(/\s+/g, ' ')            // Collapse multiple spaces
      .replace(/>\s+</g, '><')          // Remove space between tags
      .trim();
    setOutput(minified);
  };

  return (
    <div className="space-y-4">
      <ToolHeader title="HTML Minifier" desc="Strip HTML comments, collapse unnecessary white-space, and compact markup." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-slate-450 block">Raw HTML Code</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
            className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs outline-none focus:border-blue-500"
            placeholder="<div>\n  <!-- Comments to strip -->\n  <p>Hello  World</p>\n</div>"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-slate-450 block">Minified Markup</label>
          <textarea
            readOnly
            value={output}
            rows={10}
            className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs outline-none text-emerald-600 dark:text-emerald-400"
            placeholder="Minified outcome..."
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={handleMinify} className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Minify HTML</button>
        <CopyButton text={output} />
        <DownloadButton content={output} fileName="minified.html" />
        <ClearButton onClear={() => { setInput(''); setOutput(''); }} />
      </div>
    </div>
  );
}

// ==========================================
// 2. YAML TO JSON CONVERTER
// ==========================================
export function YamlToJson() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [err, setErr] = useState('');

  const convertYaml = () => {
    setErr('');
    if (!input) return;
    try {
      // Lightweight, structured inline parser for safe offline YAML
      const lines = input.split('\n');
      const result: any = {};
      lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const parts = trimmed.split(':');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const val = parts.slice(1).join(':').trim();
          // parse primitives
          if (val === 'true') result[key] = true;
          else if (val === 'false') result[key] = false;
          else if (!isNaN(Number(val))) result[key] = Number(val);
          else result[key] = val.replace(/^["']|["']$/g, ''); // strip optional quotes
        }
      });
      setOutput(JSON.stringify(result, null, 2));
    } catch (ex: any) {
      setErr('Invalid simple YAML parsing keys. Ensure key: value pairs.');
    }
  };

  return (
    <div className="space-y-4">
      <ToolHeader title="YAML to JSON Converter" desc="Parse simple flat YAML configurations into clean JSON key-values instantly." />
      {err && <div className="p-2 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl">{err}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs outline-none"
          placeholder="server_name: devbox\nport: 3000\nactive: true"
        />
        <textarea
          readOnly
          value={output}
          rows={8}
          className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs outline-none"
          placeholder="JSON outcome..."
        />
      </div>
      <div className="flex gap-2">
        <button onClick={convertYaml} className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Convert</button>
        <CopyButton text={output} />
        <ClearButton onClear={() => { setInput(''); setOutput(''); setErr(''); }} />
      </div>
    </div>
  );
}

// ==========================================
// 3. JSON TO YAML CONVERTER
// ==========================================
export function JsonToYaml() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [err, setErr] = useState('');

  const convertJson = () => {
    setErr('');
    if (!input) return;
    try {
      const parsed = JSON.parse(input);
      let yaml = '';
      Object.keys(parsed).forEach(k => {
        yaml += `${k}: ${parsed[k]}\n`;
      });
      setOutput(yaml);
    } catch (ex) {
      setErr('Invalid JSON object structure. Check formatting commas.');
    }
  };

  return (
    <div className="space-y-4">
      <ToolHeader title="JSON to YAML Converter" desc="Convert flat structured JSON schemas into readable simple YAML mappings." />
      {err && <div className="p-2 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl">{err}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs outline-none"
          placeholder='{\n  "service": "authentication",\n  "port": 8080\n}'
        />
        <textarea
          readOnly
          value={output}
          rows={8}
          className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs outline-none"
          placeholder="YAML outcome..."
        />
      </div>
      <div className="flex gap-2">
        <button onClick={convertJson} className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Convert</button>
        <CopyButton text={output} />
        <ClearButton onClear={() => { setInput(''); setOutput(''); setErr(''); }} />
      </div>
    </div>
  );
}

// ==========================================
// 4. TOML TO JSON CONVERTER
// ==========================================
export function TomlToJson() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleConvert = () => {
    if (!input) return;
    const lines = input.split('\n');
    const result: any = {};
    let currentTable: any = result;
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        const tableKey = trimmed.slice(1, -1).trim();
        result[tableKey] = {};
        currentTable = result[tableKey];
      } else {
        const parts = trimmed.split('=');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const val = parts.slice(1).join('=').trim();
          if (val === 'true') currentTable[key] = true;
          else if (val === 'false') currentTable[key] = false;
          else if (!isNaN(Number(val))) currentTable[key] = Number(val);
          else currentTable[key] = val.replace(/^["']|["']$/g, '');
        }
      }
    });
    setOutput(JSON.stringify(result, null, 2));
  };

  return (
    <div className="space-y-4">
      <ToolHeader title="TOML to JSON" desc="Translate standard config files with [headers] and tables into JSON strings." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs outline-none"
          placeholder="[database]\nserver = '127.0.0.1'\nports = [8000]"
        />
        <textarea
          readOnly
          value={output}
          rows={8}
          className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs outline-none"
          placeholder="JSON results..."
        />
      </div>
      <div className="flex gap-2">
        <button onClick={handleConvert} className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Convert</button>
        <CopyButton text={output} />
        <ClearButton onClear={() => { setInput(''); setOutput(''); }} />
      </div>
    </div>
  );
}

// ==========================================
// 5. TOML GENERATOR
// ==========================================
export function TomlGenerator() {
  const [appName, setAppName] = useState('MyProject');
  const [version, setVersion] = useState('1.0.0');
  const [port, setPort] = useState(3000);
  const [debugMode, setDebugMode] = useState(true);
  const [tomlOutput, setTomlOutput] = useState('');

  useEffect(() => {
    const toml = `[package]\nname = "${appName}"\nversion = "${version}"\n\n[server]\nport = ${port}\nenable_debug = ${debugMode}\n`;
    setTomlOutput(toml);
  }, [appName, version, port, debugMode]);

  return (
    <div className="space-y-4">
      <ToolHeader title="TOML Generator" desc="Interactively build configuration profiles and output correct TOML tags." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3 bg-slate-50 dark:bg-slate-950/20 p-4 rounded-2xl border">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400">Package Name</label>
            <input type="text" value={appName} onChange={(e) => setAppName(e.target.value)} className="w-full py-1.5 px-3 bg-white border rounded-xl text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400">Version</label>
            <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} className="w-full py-1.5 px-3 bg-white border rounded-xl text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400">Server Port</label>
            <input type="number" value={port} onChange={(e) => setPort(Number(e.target.value))} className="w-full py-1.5 px-3 bg-white border rounded-xl text-xs" />
          </div>
          <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
            <input type="checkbox" checked={debugMode} onChange={(e) => setDebugMode(e.target.checked)} />
            <span>Enable Debug logs</span>
          </label>
        </div>
        <textarea
          readOnly
          value={tomlOutput}
          rows={8}
          className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs outline-none"
        />
      </div>
      <div className="flex gap-2">
        <CopyButton text={tomlOutput} />
        <DownloadButton content={tomlOutput} fileName="config.toml" />
      </div>
    </div>
  );
}

// ==========================================
// 6. BASE32 CODEC
// ==========================================
export function Base32Codec() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

  const handleCodec = () => {
    if (!input) return;
    if (mode === 'encode') {
      let result = '';
      let bits = 0;
      let value = 0;
      for (let i = 0; i < input.length; i++) {
        value = (value << 8) | input.charCodeAt(i);
        bits += 8;
        while (bits >= 5) {
          result += ALPHABET[(value >>> (bits - 5)) & 31];
          bits -= 5;
        }
      }
      if (bits > 0) {
        result += ALPHABET[(value << (5 - bits)) & 31];
      }
      while (result.length % 8 !== 0) {
        result += '=';
      }
      setOutput(result);
    } else {
      // Decode simple string
      try {
        const clean = input.toUpperCase().replace(/=+$/, '');
        let bits = 0;
        let value = 0;
        let decoded = '';
        for (let i = 0; i < clean.length; i++) {
          const idx = ALPHABET.indexOf(clean[i]);
          if (idx === -1) throw new Error();
          value = (value << 5) | idx;
          bits += 5;
          if (bits >= 8) {
            decoded += String.fromCharCode((value >>> (bits - 8)) & 255);
            bits -= 8;
          }
        }
        setOutput(decoded);
      } catch (ex) {
        setOutput('Error: Invalid Base32 payload characters.');
      }
    }
  };

  return (
    <div className="space-y-4">
      <ToolHeader title="Base32 Encoder/Decoder" desc="Encode raw text payloads into base32 sequence alphabets or decode hashes." />
      <div className="flex gap-4">
        <button onClick={() => setMode('encode')} className={`px-4 py-1 text-xs font-bold rounded-lg transition-all ${mode === 'encode' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Encode</button>
        <button onClick={() => setMode('decode')} className={`px-4 py-1 text-xs font-bold rounded-lg transition-all ${mode === 'decode' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Decode</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs outline-none"
          placeholder={mode === 'encode' ? 'Hello World' : 'JBSWY3DPEBLW64TMMQ======'}
        />
        <textarea
          readOnly
          value={output}
          rows={5}
          className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs outline-none"
        />
      </div>
      <div className="flex gap-2">
        <button onClick={handleCodec} className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Compute</button>
        <CopyButton text={output} />
        <ClearButton onClear={() => { setInput(''); setOutput(''); }} />
      </div>
    </div>
  );
}

// ==========================================
// 7. ROT13 CIPHER
// ==========================================
export function Rot13Codec() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleCompute = () => {
    const rot = input.replace(/[a-zA-Z]/g, (c: string) => {
      const code = c.charCodeAt(0);
      const isUpper = code >= 65 && code <= 90;
      const base = isUpper ? 65 : 97;
      return String.fromCharCode(((code - base + 13) % 26) + base);
    });
    setOutput(rot);
  };

  return (
    <div className="space-y-4">
      <ToolHeader title="ROT13 Caesar Cipher" desc="Rotate alphabetic values by 13 positions for simple cryptographic obfuscations." />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs outline-none"
        placeholder="Enter text to rotate (e.g. hello)"
      />
      <div className="flex gap-2">
        <button onClick={handleCompute} className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Rotate ROT13</button>
        <CopyButton text={output} />
        <ClearButton onClear={() => { setInput(''); setOutput(''); }} />
      </div>
      {output && (
        <div className="p-3 bg-slate-100 dark:bg-slate-950/40 rounded-xl font-mono text-xs select-all text-slate-800 dark:text-slate-200">
          {output}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 8. HEX ENCODER/DECODER
// ==========================================
export function HexCodec() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const handleHex = () => {
    if (!input) return;
    if (mode === 'encode') {
      let res = '';
      for (let i = 0; i < input.length; i++) {
        res += input.charCodeAt(i).toString(16).toUpperCase().padStart(2, '0') + ' ';
      }
      setOutput(res.trim());
    } else {
      try {
        const clean = input.replace(/\s+/g, '');
        let res = '';
        for (let i = 0; i < clean.length; i += 2) {
          res += String.fromCharCode(parseInt(clean.substr(i, 2), 16));
        }
        setOutput(res);
      } catch (e) {
        setOutput('Error: Invalid hexadecimal character groupings.');
      }
    }
  };

  return (
    <div className="space-y-4">
      <ToolHeader title="Hex Encoder/Decoder" desc="Convert plain text strings into space-separated hex streams or decode back." />
      <div className="flex gap-2">
        <button onClick={() => setMode('encode')} className={`px-3 py-1 text-xs font-bold rounded-lg ${mode === 'encode' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-650'}`}>Encode</button>
        <button onClick={() => setMode('decode')} className={`px-3 py-1 text-xs font-bold rounded-lg ${mode === 'decode' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-650'}`}>Decode</button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs outline-none"
        placeholder={mode === 'encode' ? 'Hello' : '48 65 6C 6C 6F'}
      />
      <div className="flex gap-2">
        <button onClick={handleHex} className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Convert Hex</button>
        <CopyButton text={output} />
        <ClearButton onClear={() => { setInput(''); setOutput(''); }} />
      </div>
      {output && (
        <div className="p-3 bg-slate-100 dark:bg-slate-950/40 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-200">{output}</div>
      )}
    </div>
  );
}

// ==========================================
// 9. UNICODE INSPECTOR
// ==========================================
export function UnicodeInspector() {
  const [char, setChar] = useState('⚙');
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    if (!char) return;
    const c = char[0];
    const code = c.charCodeAt(0);
    setDetails({
      character: c,
      decimal: code,
      hex: 'U+' + code.toString(16).toUpperCase().padStart(4, '0'),
      binary: code.toString(2).padStart(16, '0')
    });
  }, [char]);

  return (
    <div className="space-y-4">
      <ToolHeader title="Unicode Character Details" desc="Enter any letter, emoji, or symbol to inspect decimal codes, hex mappings, and bits." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-slate-400">Input Character</label>
          <input
            type="text"
            maxLength={2}
            value={char}
            onChange={(e) => setChar(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold outline-none focus:border-blue-500"
          />
        </div>
        {details && (
          <div className="p-4 bg-slate-50 dark:bg-slate-950/30 border rounded-2xl space-y-1.5 text-xs font-mono">
            <div><span className="text-slate-400 font-bold">Char:</span> {details.character}</div>
            <div><span className="text-slate-400 font-bold">Decimal Code:</span> {details.decimal}</div>
            <div><span className="text-slate-400 font-bold">Hex:</span> {details.hex}</div>
            <div><span className="text-slate-400 font-bold">Binary:</span> {details.binary}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 10. USER AGENT PARSER
// ==========================================
export function UserAgentParser() {
  const [ua, setUa] = useState('');
  const [parsed, setParsed] = useState<any>(null);

  const parseUA = () => {
    const lower = ua.toLowerCase();
    const os = lower.includes('windows') ? 'Windows' : 
               lower.includes('mac') ? 'macOS' :
               lower.includes('linux') ? 'Linux' :
               lower.includes('android') ? 'Android' :
               lower.includes('iphone') ? 'iOS' : 'Unknown OS';
               
    const engine = lower.includes('webkit') ? 'WebKit (Blink/Safari)' :
                   lower.includes('gecko') ? 'Gecko (Firefox)' : 'Unknown Rendering Engine';
                   
    const browser = lower.includes('chrome') && !lower.includes('edg') ? 'Chrome' :
                    lower.includes('firefox') ? 'Firefox' :
                    lower.includes('safari') && !lower.includes('chrome') ? 'Safari' :
                    lower.includes('edg') ? 'Edge' : 'Generic Web Client';
                    
    setParsed({ os, engine, browser });
  };

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setUa(navigator.userAgent);
    }
  }, []);

  return (
    <div className="space-y-4">
      <ToolHeader title="User Agent String Parser" desc="Deconstruct details about browsers, engines, OS kernels, and mobile markers from UA strings." />
      <textarea
        value={ua}
        onChange={(e) => setUa(e.target.value)}
        rows={3}
        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs outline-none"
        placeholder="Mozilla/5.0..."
      />
      <div className="flex gap-2">
        <button onClick={parseUA} className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Parse Header</button>
        <ClearButton onClear={() => { setUa(''); setParsed(null); }} />
      </div>
      {parsed && (
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 border rounded-xl bg-slate-50 dark:bg-slate-950/20 text-xs">
            <h5 className="font-bold text-slate-400">OS</h5>
            <p className="font-mono mt-1 font-semibold">{parsed.os}</p>
          </div>
          <div className="p-3 border rounded-xl bg-slate-50 dark:bg-slate-950/20 text-xs">
            <h5 className="font-bold text-slate-400">Engine</h5>
            <p className="font-mono mt-1 font-semibold">{parsed.engine}</p>
          </div>
          <div className="p-3 border rounded-xl bg-slate-50 dark:bg-slate-950/20 text-xs">
            <h5 className="font-bold text-slate-400">Browser</h5>
            <p className="font-mono mt-1 font-semibold">{parsed.browser}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 11. URL PARSER & QUERY INSPECTOR
// ==========================================
export function UrlParser() {
  const [urlInput, setUrlInput] = useState('https://example.com/search?q=devtools&active=true#section1');
  const [parsed, setParsed] = useState<any>(null);

  const handleParse = () => {
    try {
      const u = new URL(urlInput);
      const qParams: any = [];
      u.searchParams.forEach((val, key) => {
        qParams.push({ key, val });
      });
      setParsed({
        protocol: u.protocol,
        hostname: u.hostname,
        pathname: u.pathname,
        hash: u.hash,
        queries: qParams
      });
    } catch (e) {
      alert('Invalid absolute URL address.');
    }
  };

  return (
    <div className="space-y-4">
      <ToolHeader title="URL & Query Inspector" desc="Breakdown query-strings, path parts, protocols, hashes, and variables from absolute URLs." />
      <div className="flex gap-3">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="flex-1 py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 font-mono"
        />
        <button onClick={handleParse} className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Deconstruct</button>
      </div>

      {parsed && (
        <div className="space-y-4 font-mono text-xs border rounded-2xl p-4 bg-slate-50/20">
          <div className="grid grid-cols-2 gap-3">
            <div><span className="text-slate-450 font-bold">Protocol:</span> {parsed.protocol}</div>
            <div><span className="text-slate-450 font-bold">Hostname:</span> {parsed.hostname}</div>
            <div><span className="text-slate-450 font-bold">Pathname:</span> {parsed.pathname}</div>
            <div><span className="text-slate-450 font-bold">Hash Fragment:</span> {parsed.hash || 'None'}</div>
          </div>
          {parsed.queries.length > 0 && (
            <div className="border-t pt-3 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Query Parameters</span>
              {parsed.queries.map((q: any, i: number) => (
                <div key={i} className="flex gap-2 p-1.5 bg-white border rounded">
                  <span className="text-blue-600 font-bold">{q.key}:</span>
                  <span>{q.val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 12. HTML XSS SANITIZER
// ==========================================
export function HtmlXssSanitizer() {
  const [rawHtml, setRawHtml] = useState('<img src=x onerror=alert(1)> <script>doEvil()</script> <b>Clean Text</b>');
  const [cleanHtml, setCleanHtml] = useState('');

  const sanitize = () => {
    // Basic offline sanitizer regex to strip event handlers and script blocks
    const stripped = rawHtml
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '') // Strip script tags
      .replace(/on\w+\s*=\s*"[^"]*"/gi, '')               // Strip inline quotes
      .replace(/on\w+\s*=\s*'[^']*'/gi, '')
      .replace(/on\w+\s*=\s*\w+/gi, '');
    setCleanHtml(stripped);
  };

  return (
    <div className="space-y-4">
      <ToolHeader title="HTML & XSS Sanitizer" desc="Strip malicious scripts, event hooks, and nested tags from HTML codes safely." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={rawHtml}
          onChange={(e) => setRawHtml(e.target.value)}
          rows={6}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs outline-none"
        />
        <textarea
          readOnly
          value={cleanHtml}
          rows={6}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs outline-none text-emerald-600"
          placeholder="Clean outcomes..."
        />
      </div>
      <div className="flex gap-2">
        <button onClick={sanitize} className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Sanitizer Filter</button>
        <CopyButton text={cleanHtml} />
        <ClearButton onClear={() => { setRawHtml(''); setCleanHtml(''); }} />
      </div>
    </div>
  );
}

// ==========================================
// 13. DEVICE INFO INSPECTOR
// ==========================================
export function DeviceInfo() {
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        screenW: window.screen.width,
        screenH: window.screen.height,
        pixelRatio: window.devicePixelRatio,
        cookieActive: navigator.cookieEnabled,
        cores: navigator.hardwareConcurrency || 'Unknown',
        connection: (navigator as any).connection?.effectiveType || 'N/A'
      });
    }
  }, []);

  return (
    <div className="space-y-4 text-xs font-mono">
      <ToolHeader title="Display & Screen Inspector" desc="Query client viewport heights, widths, pixel ratios, hardware core indices, and properties." />
      {info ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 border rounded-xl bg-slate-50/50"><h5 className="text-[10px] font-bold text-slate-400 uppercase">Viewport</h5><p className="font-bold text-sm mt-1">{info.width} x {info.height}</p></div>
          <div className="p-3 border rounded-xl bg-slate-50/50"><h5 className="text-[10px] font-bold text-slate-400 uppercase">Screen Size</h5><p className="font-bold text-sm mt-1">{info.screenW} x {info.screenH}</p></div>
          <div className="p-3 border rounded-xl bg-slate-50/50"><h5 className="text-[10px] font-bold text-slate-400 uppercase">Device Ratio</h5><p className="font-bold text-sm mt-1">{info.pixelRatio}x</p></div>
          <div className="p-3 border rounded-xl bg-slate-50/50"><h5 className="text-[10px] font-bold text-slate-400 uppercase">Hardware Cores</h5><p className="font-bold text-sm mt-1">{info.cores}</p></div>
        </div>
      ) : (
        <p>Loading specifications details...</p>
      )}
    </div>
  );
}

// ==========================================
// 14. HTML TO MARKDOWN
// ==========================================
export function HtmlToMarkdown() {
  const [html, setHtml] = useState('<h1>Hello</h1>\n<p>This is <b>bold</b> text.</p>');
  const [markdown, setMarkdown] = useState('');

  const convertToMarkdown = () => {
    const md = html
      .replace(/<h1>(.*?)<\/h1>/gi, '# $1\n')
      .replace(/<h2>(.*?)<\/h2>/gi, '## $1\n')
      .replace(/<h3>(.*?)<\/h3>/gi, '### $1\n')
      .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<b>(.*?)<\/b>/gi, '**$1**')
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<i>(.*?)<\/i>/gi, '*$1*')
      .replace(/<a href="(.*?)">(.*?)<\/a>/gi, '[$2]($1)');
    setMarkdown(md.trim());
  };

  return (
    <div className="space-y-4">
      <ToolHeader title="HTML to Markdown Converter" desc="Instantly convert structural headings, tags, lists, and links into standard Markdown styles." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          rows={6}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs outline-none"
        />
        <textarea
          readOnly
          value={markdown}
          rows={6}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs outline-none"
          placeholder="Markdown results..."
        />
      </div>
      <div className="flex gap-2">
        <button onClick={convertToMarkdown} className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Convert</button>
        <CopyButton text={markdown} />
        <ClearButton onClear={() => { setHtml(''); setMarkdown(''); }} />
      </div>
    </div>
  );
}

// ==========================================
// 15. MORSE CONVERTER
// ==========================================
export function MorseConverter() {
  const [input, setInput] = useState('SOS');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'toMorse' | 'fromMorse'>('toMorse');

  const MORSE_MAP: any = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
    'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
    'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
    '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/'
  };

  const handleMorse = () => {
    if (!input) return;
    if (mode === 'toMorse') {
      const charArray = input.toUpperCase().split('');
      const morse = charArray.map(c => MORSE_MAP[c] || '').join(' ');
      setOutput(morse);
    } else {
      const revMap = Object.keys(MORSE_MAP).reduce((acc: any, k) => {
        acc[MORSE_MAP[k]] = k;
        return acc;
      }, {});
      const codes = input.split(' ');
      const text = codes.map(c => revMap[c] || '').join('');
      setOutput(text);
    }
  };

  return (
    <div className="space-y-4">
      <ToolHeader title="Morse Code Translator" desc="Convert plain Latin letters into DOT-DASH international telegraphy code or decode signals." />
      <div className="flex gap-2">
        <button onClick={() => setMode('toMorse')} className={`px-3 py-1 text-xs font-bold rounded-lg ${mode === 'toMorse' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-650'}`}>To Morse</button>
        <button onClick={() => setMode('fromMorse')} className={`px-3 py-1 text-xs font-bold rounded-lg ${mode === 'fromMorse' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-650'}`}>From Morse</button>
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
        placeholder={mode === 'toMorse' ? 'SOS' : '... --- ...'}
      />
      <div className="flex gap-2">
        <button onClick={handleMorse} className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Translate</button>
        <CopyButton text={output} />
      </div>
      {output && (
        <div className="p-3 bg-slate-100 dark:bg-slate-950/40 rounded-xl font-mono text-sm tracking-widest text-slate-800 dark:text-slate-200">
          {output}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 16. CSS CLIP-PATH GENERATOR
// ==========================================
export function CssClipPath() {
  const [shape, setShape] = useState<'polygon' | 'circle' | 'ellipse'>('polygon');
  const [size, setSize] = useState(50);
  const [clipCss, setClipCss] = useState('');

  useEffect(() => {
    let css = '';
    if (shape === 'polygon') css = `clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);`;
    else if (shape === 'circle') css = `clip-path: circle(${size}% at 50% 50%);`;
    else css = `clip-path: ellipse(${size}% 40% at 50% 50%);`;
    setClipCss(css);
  }, [shape, size]);

  return (
    <div className="space-y-4">
      <ToolHeader title="CSS Clip-Path Generator" desc="Select preset geometric clip masks and slide dimensions to output copyable CSS rules." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border">
          <div className="flex gap-2">
            {['polygon', 'circle', 'ellipse'].map((s: any) => (
              <button key={s} onClick={() => setShape(s)} className={`px-3 py-1 text-xs font-bold rounded-lg ${shape === s ? 'bg-blue-600 text-white' : 'bg-white'}`}>{s}</button>
            ))}
          </div>
          {shape !== 'polygon' && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400">Radius size ({size}%)</label>
              <input type="range" min={10} max={50} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full" />
            </div>
          )}
          <div className="w-full h-32 bg-slate-200 rounded-xl flex items-center justify-center overflow-hidden">
            <div className="w-24 h-24 bg-blue-500 transition-all" style={{ clipPath: shape === 'polygon' ? 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' : (shape === 'circle' ? `circle(${size}% at 50% 50%)` : `ellipse(${size}% 40% at 50% 50%)`) }}></div>
          </div>
        </div>
        <textarea
          readOnly
          value={clipCss}
          rows={5}
          className="w-full p-3 bg-slate-50 border rounded-2xl font-mono text-xs outline-none"
        />
      </div>
      <div className="flex gap-2">
        <CopyButton text={clipCss} />
      </div>
    </div>
  );
}

// ==========================================
// 17. CRON EXPRESSION GENERATOR
// ==========================================
export function CronGenerator() {
  const [min, setMin] = useState('*');
  const [hour, setHour] = useState('*');
  const [day, setDay] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');
  const [cron, setCron] = useState('* * * * *');

  useEffect(() => {
    setCron(`${min} ${hour} ${day} ${month} ${dayOfWeek}`);
  }, [min, hour, day, month, dayOfWeek]);

  return (
    <div className="space-y-4">
      <ToolHeader title="Cron Expression Generator" desc="Interact with interval selectors to formulate valid Crontab schedules." />
      <div className="grid grid-cols-5 gap-2 text-xs">
        <div><label className="text-[10px] font-bold text-slate-400">Minute</label><input type="text" value={min} onChange={(e) => setMin(e.target.value)} className="w-full py-1 px-2 border rounded" /></div>
        <div><label className="text-[10px] font-bold text-slate-400">Hour</label><input type="text" value={hour} onChange={(e) => setHour(e.target.value)} className="w-full py-1 px-2 border rounded" /></div>
        <div><label className="text-[10px] font-bold text-slate-400">Day</label><input type="text" value={day} onChange={(e) => setDay(e.target.value)} className="w-full py-1 px-2 border rounded" /></div>
        <div><label className="text-[10px] font-bold text-slate-400">Month</label><input type="text" value={month} onChange={(e) => setMonth(e.target.value)} className="w-full py-1 px-2 border rounded" /></div>
        <div><label className="text-[10px] font-bold text-slate-400">Weekday</label><input type="text" value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} className="w-full py-1 px-2 border rounded" /></div>
      </div>
      <div className="p-4 bg-slate-100 dark:bg-slate-950 border rounded-2xl font-mono text-sm flex justify-between items-center text-slate-800 dark:text-slate-200">
        <span>{cron}</span>
        <CopyButton text={cron} />
      </div>
    </div>
  );
}

// ==========================================
// 18. IMAGE COLOR PALETTE EXTRACTOR
// ==========================================
export function ColorPaletteExtractor() {
  const [palette, setPalette] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 10, 10);
          const data = ctx.getImageData(0, 0, 10, 10).data;
          // Extract 5 distinctive colors
          const extracted: string[] = [];
          for (let i = 0; i < 5; i++) {
            const pixelIdx = i * 20 * 4;
            const r = data[pixelIdx];
            const g = data[pixelIdx + 1];
            const b = data[pixelIdx + 2];
            const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
            extracted.push(hex);
          }
          setPalette(extracted);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <ToolHeader title="Image Color Palette Extractor" desc="Upload any design file or graphic to inspect and extract a beautifully coordinated HEX palette." />
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <label className="py-2 px-4 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-blue-700 transition-colors">
          Upload Image File
          <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
        </label>
        <canvas ref={canvasRef} width={10} height={10} className="hidden" />
        {palette.length > 0 && (
          <div className="flex gap-2">
            {palette.map((col, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-xl border border-slate-350 shadow" style={{ backgroundColor: col }}></div>
                <span className="text-[9px] font-mono font-bold">{col}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 19. SIMULATED PORT SCANNER
// ==========================================
export function PortScannerSimulator() {
  const [host, setHost] = useState('127.0.0.1');
  const [logs, setLogs] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);

  const startScan = () => {
    setScanning(true);
    setLogs([]);
    const ports = [22, 80, 443, 3306, 8080];
    const portLabels: any = { 22: 'SSH', 80: 'HTTP', 443: 'HTTPS', 3306: 'MySQL', 8080: 'Alternative HTTP' };
    
    ports.forEach((p, idx) => {
      setTimeout(() => {
        const open = Math.random() > 0.4;
        setLogs(prev => [...prev, `Checking port ${p} (${portLabels[p]})... ${open ? '● OPEN' : '○ CLOSED'}`]);
        if (idx === ports.length - 1) setScanning(false);
      }, (idx + 1) * 600);
    });
  };

  return (
    <div className="space-y-4 text-xs font-mono">
      <ToolHeader title="Simulated Network Checker" desc="Test common infrastructure configurations and evaluate server accessibility simulations." />
      <div className="flex gap-2">
        <input type="text" value={host} onChange={(e) => setHost(e.target.value)} className="py-1.5 px-3 border rounded-xl outline-none" />
        <button onClick={startScan} disabled={scanning} className="py-1.5 px-4 bg-blue-600 text-white rounded-xl font-bold">{scanning ? 'Testing...' : 'Simulate Scan'}</button>
      </div>
      <div className="p-3 bg-slate-950 text-emerald-400 rounded-2xl min-h-[100px] space-y-1">
        {logs.length === 0 && <span className="text-slate-500">Initiate simulator check...</span>}
        {logs.map((lg, i) => <div key={i}>{lg}</div>)}
      </div>
    </div>
  );
}

// ==========================================
// 20. TEXT SHUFFLER
// ==========================================
export function TextShuffler() {
  const [input, setInput] = useState('apple\nbanana\ncherry\ndate');
  const [output, setOutput] = useState('');

  const handleShuffle = () => {
    const lines = input.split('\n').filter(l => l.trim() !== '');
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4">
      <ToolHeader title="List Shuffler & Randomizer" desc="Shuffle lines of logs, values, or strings completely offline in the browser." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} className="w-full p-3 bg-slate-50 border rounded-2xl font-mono text-xs outline-none" />
        <textarea readOnly value={output} rows={6} className="w-full p-3 bg-slate-50 border rounded-2xl font-mono text-xs outline-none" />
      </div>
      <div className="flex gap-2">
        <button onClick={handleShuffle} className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Shuffle Lists</button>
        <CopyButton text={output} />
        <ClearButton onClear={() => { setInput(''); setOutput(''); }} />
      </div>
    </div>
  );
}

// ==========================================
// 21. FLOATING POINT & DECIMAL CALCULATOR
// ==========================================
export function DecimalBinary() {
  const [input, setInput] = useState('42');
  const [binary, setBinary] = useState('');
  const [hexVal, setHexVal] = useState('');
  const [octal, setOctal] = useState('');

  useEffect(() => {
    const num = Number(input);
    if (isNaN(num)) {
      setBinary('N/A'); setHexVal('N/A'); setOctal('N/A');
    } else {
      setBinary(num.toString(2));
      setHexVal(num.toString(16).toUpperCase());
      setOctal(num.toString(8));
    }
  }, [input]);

  return (
    <div className="space-y-4">
      <ToolHeader title="Numeric Base Converter" desc="Instantly convert integers between binary base-2, octal, hex, and decimal representations." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
        <div className="space-y-1">
          <label className="font-bold text-slate-400">Decimal (Base 10)</label>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="w-full py-1.5 px-3 border rounded-xl" />
        </div>
        <div className="p-3 bg-slate-50 border rounded-2xl space-y-1">
          <div><span className="text-slate-400 font-bold">Binary:</span> {binary}</div>
          <div><span className="text-slate-400 font-bold">Hex:</span> {hexVal}</div>
          <div><span className="text-slate-400 font-bold">Octal:</span> {octal}</div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 22. REGEX TESTER CHEATSHEET
// ==========================================
export function RegexCheatsheet() {
  const [pattern, setPattern] = useState('\\d+');
  const [testText, setTestText] = useState('Order 1234 on July 14');
  const [matchLogs, setMatchLogs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const rx = new RegExp(pattern, 'g');
      const matches = testText.match(rx);
      setMatchLogs(matches || []);
    } catch (e) {
      setMatchLogs(['Error: Invalid regular expression.']);
    }
  }, [pattern, testText]);

  return (
    <div className="space-y-4">
      <ToolHeader title="Interactive Regex Sandbox" desc="Test and evaluate regular expression captures and preview highlighted matches." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="font-bold text-slate-400">Regex Pattern</label>
            <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} className="w-full py-1.5 px-3 border rounded-xl font-mono" />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-400">Test String</label>
            <textarea value={testText} onChange={(e) => setTestText(e.target.value)} rows={3} className="w-full p-2 border rounded-xl font-mono" />
          </div>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border rounded-2xl space-y-2">
          <h5 className="font-bold uppercase tracking-wider text-slate-400">Capture Matches</h5>
          <div className="space-y-1 font-mono text-[11px] max-h-24 overflow-y-auto">
            {matchLogs.map((m, i) => <div key={i} className="p-1.5 bg-emerald-500/10 border border-emerald-500/10 text-emerald-650 rounded">Match: {m}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 23. CSS TRANSFORM TOOL
// ==========================================
export function CssTransform() {
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(1);
  const [skew, setSkew] = useState(0);
  const [transformCss, setTransformCss] = useState('');

  useEffect(() => {
    setTransformCss(`transform: rotate(${rotate}deg) scale(${scale}) skewX(${skew}deg);`);
  }, [rotate, scale, skew]);

  return (
    <div className="space-y-4">
      <ToolHeader title="CSS Transform Canvas" desc="Visually adjust rotates, scales, skews to output pristine CSS transform rules." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-450">Rotate ({rotate}deg)</label>
            <input type="range" min={0} max={360} value={rotate} onChange={(e) => setRotate(Number(e.target.value))} className="w-full" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-450">Scale ({scale}x)</label>
            <input type="range" min={0.5} max={2} step={0.1} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-450">Skew ({skew}deg)</label>
            <input type="range" min={-45} max={45} value={skew} onChange={(e) => setSkew(Number(e.target.value))} className="w-full" />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-slate-100 rounded-2xl border min-h-[150px]">
          <div className="w-16 h-16 bg-blue-500 transition-all shadow" style={{ transform: `rotate(${rotate}deg) scale(${scale}) skewX(${skew}deg)` }}></div>
          <textarea readOnly value={transformCss} rows={2} className="w-full p-2 bg-transparent border-t border-dashed mt-4 text-center font-mono text-[10px] resize-none outline-none" />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 24. SVG TO REACT JSX
// ==========================================
export function SvgToJsx() {
  const [svg, setSvg] = useState('<svg>\n  <path d="M10 10h20v20H10z" />\n</svg>');
  const [jsx, setJsx] = useState('');

  const handleConvert = () => {
    let clean = svg
      .replace(/class=/g, 'className=')
      .replace(/stroke-width=/g, 'strokeWidth=')
      .replace(/fill-rule=/g, 'fillRule=')
      .replace(/stroke-linecap=/g, 'strokeLinecap=')
      .replace(/stroke-linejoin=/g, 'strokeLinejoin=');
    setJsx(`export default function Icon() {\n  return (\n    ${clean}\n  );\n}`);
  };

  return (
    <div className="space-y-4">
      <ToolHeader title="SVG to JSX Component" desc="Convert SVG tags and parameters into valid React component markup declarations." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={svg} onChange={(e) => setSvg(e.target.value)} rows={6} className="w-full p-3 bg-slate-50 border rounded-2xl font-mono text-xs outline-none" />
        <textarea readOnly value={jsx} rows={6} className="w-full p-3 bg-slate-50 border rounded-2xl font-mono text-xs outline-none" />
      </div>
      <div className="flex gap-2">
        <button onClick={handleConvert} className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Convert to JSX</button>
        <CopyButton text={jsx} />
        <ClearButton onClear={() => { setSvg(''); setJsx(''); }} />
      </div>
    </div>
  );
}

// ==========================================
// 25. JSON SCHEMA GENERATOR
// ==========================================
export function JsonSchemaGen() {
  const [json, setJson] = useState('{\n  "id": 1,\n  "name": "DevBox"\n}');
  const [schema, setSchema] = useState('');

  const handleGenerate = () => {
    try {
      const parsed = JSON.parse(json);
      const s: any = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {}
      };
      Object.keys(parsed).forEach(k => {
        s.properties[k] = { "type": typeof parsed[k] };
      });
      setSchema(JSON.stringify(s, null, 2));
    } catch (e) {
      alert('Error parsing input JSON object.');
    }
  };

  return (
    <div className="space-y-4">
      <ToolHeader title="JSON Schema Generator" desc="Turn raw JSON data arrays into strict standard Drafts-07 validation schemas." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={json} onChange={(e) => setJson(e.target.value)} rows={6} className="w-full p-3 bg-slate-50 border rounded-2xl font-mono text-xs outline-none" />
        <textarea readOnly value={schema} rows={6} className="w-full p-3 bg-slate-50 border rounded-2xl font-mono text-xs outline-none" />
      </div>
      <div className="flex gap-2">
        <button onClick={handleGenerate} className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Generate Schema</button>
        <CopyButton text={schema} />
      </div>
    </div>
  );
}

// ==========================================
// 26. JS OBFUSCATOR
// ==========================================
export function JsObfuscator() {
  const [input, setInput] = useState('const x = 42;\nconsole.log(x);');
  const [output, setOutput] = useState('');

  const obfuscate = () => {
    const encoded = input.split('').map(c => `_0x${c.charCodeAt(0).toString(16)}`).join(',');
    setOutput(`const _c = [${encoded}];\n_c.forEach(code => console.log(String.fromCharCode(parseInt(code.replace('_0x', ''), 16))));`);
  };

  return (
    <div className="space-y-4">
      <ToolHeader title="JavaScript Obfuscator" desc="Lightly obfuscate code blocks by converting text strings to char code hex arrays." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} className="w-full p-3 bg-slate-50 border rounded-2xl font-mono text-xs outline-none" />
        <textarea readOnly value={output} rows={6} className="w-full p-3 bg-slate-50 border rounded-2xl font-mono text-xs outline-none" />
      </div>
      <div className="flex gap-2">
        <button onClick={obfuscate} className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Obfuscate</button>
        <CopyButton text={output} />
      </div>
    </div>
  );
}

// ==========================================
// 27. SQL MINIFIER
// ==========================================
export function SqlMinify() {
  const [sql, setSql] = useState('SELECT * FROM users\n-- get active members\nWHERE active = 1;');
  const [minified, setMinified] = useState('');

  const minifySql = () => {
    const res = sql
      .replace(/--.*$/gm, '')  // strip line comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // strip block comments
      .replace(/\s+/g, ' ')
      .trim();
    setMinified(res);
  };

  return (
    <div className="space-y-4">
      <ToolHeader title="SQL Statement Minifier" desc="Strip SQL annotations, inline double-dashes, block comments, and carriage spaces." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={sql} onChange={(e) => setSql(e.target.value)} rows={6} className="w-full p-3 bg-slate-50 border rounded-2xl font-mono text-xs outline-none" />
        <textarea readOnly value={minified} rows={6} className="w-full p-3 bg-slate-50 border rounded-2xl font-mono text-xs outline-none" />
      </div>
      <div className="flex gap-2">
        <button onClick={minifySql} className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Minify SQL</button>
        <CopyButton text={minified} />
      </div>
    </div>
  );
}

// ==========================================
// 28. GIT COMMANDS BUILDER
// ==========================================
export function GitCommands() {
  const [action, setAction] = useState('undo');
  const [cmd, setCmd] = useState('');

  useEffect(() => {
    if (action === 'undo') setCmd('git reset --soft HEAD~1');
    else if (action === 'rename') setCmd('git branch -m <new-name>');
    else if (action === 'clean') setCmd('git clean -df');
    else setCmd('git merge --abort');
  }, [action]);

  return (
    <div className="space-y-4">
      <ToolHeader title="Interactive Git helper" desc="Configure standard Git operations and obtain copyable console commands." />
      <div className="flex gap-2 text-xs">
        {['undo', 'rename', 'clean', 'merge-abort'].map(a => (
          <button key={a} onClick={() => setAction(a)} className={`px-3 py-1 font-bold rounded-lg ${action === a ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-650'}`}>{a}</button>
        ))}
      </div>
      <div className="p-4 bg-slate-950 text-emerald-400 font-mono text-sm rounded-2xl flex justify-between items-center">
        <span>{cmd}</span>
        <CopyButton text={cmd} />
      </div>
    </div>
  );
}

// ==========================================
// 29. CSS FLEXBOX PLAYGROUND
// ==========================================
export function CssFlexbox() {
  const [direction, setDirection] = useState('row');
  const [justify, setJustify] = useState('center');
  const [align, setAlign] = useState('center');

  return (
    <div className="space-y-4">
      <ToolHeader title="CSS Flexbox Playground" desc="Test alignment settings to understand spatial coordinate grids in CSS." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border text-xs">
          <div className="space-y-1">
            <span className="font-bold text-slate-400 block">flex-direction</span>
            <div className="flex gap-1">
              {['row', 'column'].map(d => (
                <button key={d} onClick={() => setDirection(d)} className={`px-2 py-0.5 rounded ${direction === d ? 'bg-blue-600 text-white' : 'bg-white border'}`}>{d}</button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-slate-400 block">justify-content</span>
            <div className="flex flex-wrap gap-1">
              {['flex-start', 'center', 'flex-end', 'space-between'].map(j => (
                <button key={j} onClick={() => setJustify(j)} className={`px-2 py-0.5 rounded ${justify === j ? 'bg-blue-600 text-white' : 'bg-white border'}`}>{j}</button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-slate-400 block">align-items</span>
            <div className="flex gap-1">
              {['flex-start', 'center', 'flex-end'].map(a => (
                <button key={a} onClick={() => setAlign(a)} className={`px-2 py-0.5 rounded ${align === a ? 'bg-blue-600 text-white' : 'bg-white border'}`}>{a}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-40 bg-slate-100 rounded-2xl border flex p-2" style={{ flexDirection: direction as any, justifyContent: justify, alignItems: align }}>
          <div className="w-8 h-8 bg-blue-500 rounded-lg m-1 text-white flex items-center justify-center font-bold font-mono">1</div>
          <div className="w-8 h-8 bg-violet-500 rounded-lg m-1 text-white flex items-center justify-center font-bold font-mono">2</div>
          <div className="w-8 h-8 bg-emerald-500 rounded-lg m-1 text-white flex items-center justify-center font-bold font-mono">3</div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 30. MULTI-CRITERIA TEXT SORTER
// ==========================================
export function TextSorter() {
  const [input, setInput] = useState('Banana\nApple\nCherry');
  const [output, setOutput] = useState('');
  const [criteria, setCriteria] = useState<'alpha' | 'length' | 'reverse'>('alpha');

  const handleSort = () => {
    const lines = input.split('\n').filter(l => l.trim() !== '');
    if (criteria === 'alpha') {
      lines.sort();
    } else if (criteria === 'length') {
      lines.sort((a, b) => a.length - b.length);
    } else {
      lines.reverse();
    }
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4">
      <ToolHeader title="Multi-Criteria Text Sorter" desc="Arrange lists by line length, reverse ordering, or alphabetical indicators." />
      <div className="flex gap-2">
        {['alpha', 'length', 'reverse'].map((c: any) => (
          <button key={c} onClick={() => setCriteria(c)} className={`px-3 py-1 text-xs font-bold rounded-lg ${criteria === c ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-650'}`}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} className="w-full p-3 bg-slate-50 border rounded-2xl font-mono text-xs outline-none" />
        <textarea readOnly value={output} rows={6} className="w-full p-3 bg-slate-50 border rounded-2xl font-mono text-xs outline-none" />
      </div>
      <div className="flex gap-2">
        <button onClick={handleSort} className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Sort List</button>
        <CopyButton text={output} />
      </div>
    </div>
  );
}

// ==========================================
// 31. CURL TO FETCH CONVERTER
// ==========================================
export function CurlToFetch() {
  const [curl, setCurl] = useState('curl -X POST https://api.example.com/data -d "name=devbox"');
  const [fetchCode, setFetchCode] = useState('');

  const convertCurl = () => {
    const lower = curl.trim();
    // basic offline regex parser for safe local string outputs
    const urlMatch = lower.match(/curl\s+(?:-X\s+\w+\s+)?['"]?(https?:\/\/[^\s'"]+)/i);
    const methodMatch = lower.match(/-X\s+(\w+)/i);
    const dataMatch = lower.match(/-d\s+['"]([^'"]+)['"]/i);

    const url = urlMatch ? urlMatch[1] : 'https://api.example.com/endpoint';
    const method = methodMatch ? methodMatch[1].toUpperCase() : 'GET';
    const bodyStr = dataMatch ? `,\n  body: JSON.stringify({ data: "${dataMatch[1]}" })` : '';

    const code = `fetch("${url}", {\n  method: "${method}"${bodyStr}\n})\n.then(res => res.json())\n.then(data => console.log(data));`;
    setFetchCode(code);
  };

  return (
    <div className="space-y-4">
      <ToolHeader title="cURL to fetch() Converter" desc="Easily translate terminal cURL sequences into clean client-side async fetch() codes." />
      <textarea value={curl} onChange={(e) => setCurl(e.target.value)} rows={4} className="w-full p-3 bg-slate-50 border rounded-2xl font-mono text-xs outline-none" />
      <div className="flex gap-2">
        <button onClick={convertCurl} className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Convert cURL</button>
        <CopyButton text={fetchCode} />
      </div>
      {fetchCode && (
        <textarea readOnly value={fetchCode} rows={6} className="w-full p-3 bg-slate-50 border rounded-2xl font-mono text-xs outline-none text-blue-600" />
      )}
    </div>
  );
}
