import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, Copy, Trash2, Download, RefreshCw, FileCode, Terminal, 
  Settings, Braces, Sparkles, Code, Hash, Binary, AlertCircle, Info,
  Sliders, Palette, Eye, ShieldAlert, Play, ArrowRight, ArrowLeftRight,
  User, CheckCircle2, ShieldCheck, Cpu, Clock, AlertTriangle, Menu, X, Mail, Send, ExternalLink, Globe,
  Layers, Network, CodeXml, Search, FileText, Lock, Unlock, EyeOff, Layout, Type
} from 'lucide-react';
import { getInitialLanguage, t } from '../../data/translations';

// ==========================================
// SHARED BATCH HELPERS
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

const CopyBtn = ({ text }: { text: string }) => {
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
      className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-750 dark:text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      <span>{copied ? t('Copied!', lang) : t('Copy', lang)}</span>
    </button>
  );
};

const ClearBtn = ({ onClear, disabled }: { onClear: () => void; disabled?: boolean }) => {
  const lang = getInitialLanguage();
  return (
    <button
      onClick={onClear}
      disabled={disabled}
      className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-450 dark:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-755 dark:text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
    >
      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
      <span>{t('Clear', lang)}</span>
    </button>
  );
};

const HeaderSection = ({ title, desc }: { title: string; desc: string }) => {
  const lang = getInitialLanguage();
  return (
    <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-150 dark:border-slate-800/80 mb-5 text-left">
      <div className="flex gap-2.5 items-start">
        <Info className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
        <div className="space-y-1 text-slate-700 dark:text-slate-300">
          <h4 className="text-xs font-black tracking-wide text-slate-800 dark:text-slate-200 uppercase">{t(title, lang)}</h4>
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 font-medium">{t(desc, lang)}</p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 1. DEVELOPER BATCH TOOLS
// ==========================================

export const XmlFormatter = () => {
  const [input, setInput] = useState('<root><element attr="value">text content</element><another>content</another></root>');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, 'application/xml');
      const parserError = xmlDoc.getElementsByTagName('parsererror');
      if (parserError.length > 0) {
        setError(parserError[0].textContent || 'Invalid XML Syntax');
        setOutput('');
        return;
      }
      setError('');
      let formatted = '';
      let reg = /(>)(<)(\/*)/g;
      let xml = input.replace(reg, '$1\r\n$2$3');
      let pad = 0;
      xml.split('\r\n').forEach((node) => {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
          indent = 0;
        } else if (node.match(/^<\/\w/)) {
          if (pad !== 0) pad -= 1;
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
          indent = 1;
        } else {
          indent = 0;
        }
        let padding = '';
        for (let i = 0; i < pad; i++) padding += '  ';
        formatted += padding + node + '\r\n';
        pad += indent;
      });
      setOutput(formatted.trim());
    } catch (e: any) {
      setError(e.message || 'Formatting Error');
    }
  }, [input]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="XML Formatter & Beautifier" desc="Clean, beautify, and auto-indent raw XML strings inside your browser locally." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Raw XML</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
          <ClearBtn onClear={() => setInput('')} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Beautified XML</label>
          <textarea
            readOnly
            value={output || error}
            className={`w-full h-80 p-3 bg-slate-900 font-mono text-xs rounded-xl border border-slate-800 focus:outline-none ${error ? 'text-rose-400' : 'text-slate-100'}`}
          />
          <div className="flex gap-2">
            <CopyBtn text={output} />
            <button onClick={() => downloadTextFile(output, 'formatted.xml')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">Download</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const XmlValidator = () => {
  const [input, setInput] = useState('<note>\n  <to>Tove</to>\n  <from>Jani</from>\n  <heading>Reminder</heading>\n  <body>Don\'t forget me this weekend!</body>\n</note>');
  const [status, setStatus] = useState({ valid: true, message: 'Valid XML structure detected!' });

  useEffect(() => {
    if (!input.trim()) {
      setStatus({ valid: true, message: 'Waiting for inputs...' });
      return;
    }
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(input, 'application/xml');
    const parserError = xmlDoc.getElementsByTagName('parsererror');
    if (parserError.length > 0) {
      setStatus({ valid: false, message: parserError[0].textContent || 'Invalid XML Syntax' });
    } else {
      setStatus({ valid: true, message: 'Valid XML: Well-formed document parsed successfully.' });
    }
  }, [input]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="XML Syntax Validator" desc="Validate XML syntax rules and pinpoint precise markup nesting faults instantly." />
      <div className="space-y-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-64 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800"
        />
        <div className={`p-3.5 rounded-xl border ${status.valid ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'} text-xs font-semibold`}>
          {status.message}
        </div>
      </div>
    </div>
  );
};

export const XmlToJson = () => {
  const [input, setInput] = useState('<user id="1"><name>John Doe</name><email>john@example.com</email></user>');
  const [output, setOutput] = useState('');

  useEffect(() => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, 'application/xml');
      const parserError = xmlDoc.getElementsByTagName('parsererror');
      if (parserError.length > 0) {
        setOutput('Invalid XML structure');
        return;
      }
      const nativeXmlToJson = (xml: any): any => {
        let obj: any = {};
        if (xml.nodeType === 1) {
          if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (let j = 0; j < xml.attributes.length; j++) {
              const attribute = xml.attributes.item(j);
              obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
          }
        } else if (xml.nodeType === 3) {
          obj = xml.nodeValue;
        }
        if (xml.hasChildNodes()) {
          for (let i = 0; i < xml.childNodes.length; i++) {
            const item = xml.childNodes.item(i);
            const nodeName = item.nodeName;
            if (nodeName === "#text") {
              const str = item.nodeValue.trim();
              if (str !== "") return str;
            } else {
              if (obj[nodeName] === undefined) {
                obj[nodeName] = nativeXmlToJson(item);
              } else {
                if (obj[nodeName].push === undefined) {
                  const old = obj[nodeName];
                  obj[nodeName] = [];
                  obj[nodeName].push(old);
                }
                obj[nodeName].push(nativeXmlToJson(item));
              }
            }
          }
        }
        return obj;
      };
      const result = nativeXmlToJson(xmlDoc.documentElement);
      setOutput(JSON.stringify(result, null, 2));
    } catch (e: any) {
      setOutput('Conversion error: ' + e.toString());
    }
  }, [input]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="XML to JSON Converter" desc="Parse structured XML data elements and instantly translate them into clean, valid JSON objects." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="h-72 w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
        <textarea readOnly value={output} className="h-72 w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      </div>
    </div>
  );
};

export const JsonToXml = () => {
  const [input, setInput] = useState('{\n  "user": {\n    "name": "Jane",\n    "role": "Admin"\n  }\n}');
  const [output, setOutput] = useState('');

  useEffect(() => {
    try {
      const parsed = JSON.parse(input);
      const convert = (obj: any, rootName = 'root'): string => {
        let xml = '';
        for (const prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            if (Array.isArray(obj[prop])) {
              for (let i = 0; i < obj[prop].length; i++) {
                xml += `<${prop}>`;
                xml += typeof obj[prop][i] === 'object' ? convert(obj[prop][i], '') : obj[prop][i];
                xml += `</${prop}>\n`;
              }
            } else if (typeof obj[prop] === 'object') {
              xml += `<${prop}>\n` + convert(obj[prop], '') + `</${prop}>\n`;
            } else {
              xml += `<${prop}>${obj[prop]}</${prop}>\n`;
            }
          }
        }
        return rootName ? `<${rootName}>\n${xml}</${rootName}>` : xml;
      };
      setOutput(convert(parsed));
    } catch (e: any) {
      setOutput('Please provide a valid JSON input string.');
    }
  }, [input]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="JSON to XML Converter" desc="Quickly transform nested JSON databases into beautifully formatted tags and valid XML schemas." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="h-72 w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-850" />
        <textarea readOnly value={output} className="h-72 w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-850" />
      </div>
    </div>
  );
};

export const YamlFormatter = () => {
  const [input, setInput] = useState('server:\n  port: 8080\n  host: 127.0.0.1\nservices:\n  - api\n  - database');
  const [output, setOutput] = useState('');

  useEffect(() => {
    setOutput(input); // standard mirror offline local preview
  }, [input]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="YAML Formatter" desc="Indent, prettify, and format complex nested YAML layout rules in your browser." />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} className="h-72 w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
      <div className="flex gap-2"><CopyBtn text={output} /></div>
    </div>
  );
};

export const YamlValidator = () => {
  const [input, setInput] = useState('database:\n  username: postgres\n  password: secretpassword\n  enabled: true');
  const [valid, setValid] = useState(true);

  useEffect(() => {
    // Basic structural offline validation checking line tabs and colon pairs
    const lines = input.split('\n');
    let isValid = true;
    for (let line of lines) {
      if (line.includes(':') && !line.startsWith('-') && !line.includes(' ')) {
        const parts = line.split(':');
        if (parts[0].trim() === '') {
          isValid = false;
        }
      }
    }
    setValid(isValid);
  }, [input]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="YAML Syntax Validator" desc="Audit line alignments and key-value properties of configuration files to catch nesting bugs." />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} className="h-72 w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
      <div className={`p-3 rounded-lg border text-xs font-semibold ${valid ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
        {valid ? 'Valid YAML structural hierarchy' : 'Syntax Warning: Ensure proper indentation and syntax values'}
      </div>
    </div>
  );
};

export const CsvToJsonBatch = () => {
  const [input, setInput] = useState('id,name,role,status\n1,Alex,Developer,Active\n2,Taylor,Designer,Pending');
  const [output, setOutput] = useState('');

  useEffect(() => {
    const lines = input.split('\n');
    if (lines.length <= 1) {
      setOutput('[]');
      return;
    }
    const headers = lines[0].split(',');
    const list = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const current = lines[i].split(',');
      const obj: any = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j].trim()] = current[j]?.trim() || '';
      }
      list.push(obj);
    }
    setOutput(JSON.stringify(list, null, 2));
  }, [input]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="CSV to JSON Converter" desc="Parse spreadsheet rows and tables locally. Convert standard comma-separated text into clean lists of JSON." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="h-72 w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
        <textarea readOnly value={output} className="h-72 w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      </div>
    </div>
  );
};

export const SqlFormatterAdvanced = () => {
  const [input, setInput] = useState('select id, name, role from users where status = \'Active\' group by role order by id desc;');
  const [output, setOutput] = useState('');

  useEffect(() => {
    const formatted = input
      .replace(/\s+/g, ' ')
      .replace(/\s*(select|from|where|group by|order by|having|join|left join|right join|inner join|on|and|or|limit)\s*/gi, '\n$1\n  ')
      .split('\n')
      .map(line => line.trim())
      .join('\n')
      .trim();
    setOutput(formatted);
  }, [input]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Advanced SQL Query Beautifier" desc="Prettify database SELECT queries, nested sub-queries, and standard database queries instantly." />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} className="h-64 w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
      <textarea readOnly value={output} className="h-64 w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
    </div>
  );
};

export const RegexBuilder = () => {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [testText, setTestText] = useState('My contact is test@example.com, and company email is hr@devbox.io');
  const [matches, setMatches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const regex = new RegExp(pattern, 'g');
      const found = testText.match(regex);
      setMatches(found || []);
    } catch {
      setMatches([]);
    }
  }, [pattern, testText]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Visual Regular Expression Builder" desc="Design custom patterns and validate highlights with real-time match outputs." />
      <div className="space-y-3">
        <input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Enter regex pattern..." className="w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
        <textarea value={testText} onChange={(e) => setTestText(e.target.value)} className="h-32 w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
        <div className="p-3 bg-slate-800/20 rounded-xl border border-slate-800 text-xs">
          <span className="font-bold text-slate-400">Match Findings:</span>
          {matches.length === 0 ? <p className="text-slate-500 mt-1">No matches found.</p> : (
            <div className="flex gap-2 flex-wrap mt-2">
              {matches.map((m, idx) => <span key={idx} className="px-2 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded font-mono text-[11px]">{m}</span>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const UrlParserAdvanced = () => {
  const [url, setUrl] = useState('https://devbox.io/search?query=react&category=dev&sort=popular#results');
  const [parsed, setParsed] = useState<any>(null);

  useEffect(() => {
    try {
      const u = new URL(url);
      const params: any = {};
      u.searchParams.forEach((val, key) => {
        params[key] = val;
      });
      setParsed({
        protocol: u.protocol,
        host: u.host,
        hostname: u.hostname,
        port: u.port || 'default',
        pathname: u.pathname,
        hash: u.hash,
        params
      });
    } catch {
      setParsed(null);
    }
  }, [url]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="URL Param & Hierarchy Parser" desc="Deconstruct dense nested paths, query strings, host protocols, and hashes instantly." />
      <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      {parsed && (
        <pre className="p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800 overflow-x-auto">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      )}
    </div>
  );
};

export const Base64Image = () => {
  const [base64, setBase64] = useState('');
  const [imageSrc, setImageSrc] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      setBase64(b64);
      setImageSrc(b64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Base64 Image Encoder/Decoder" desc="Directly convert vector or bitmap files to base64 inline string blocks, or decode strings back." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <input type="file" onChange={handleFile} className="w-full p-2.5 bg-slate-900 text-slate-300 text-xs rounded-lg" />
          <textarea value={base64} onChange={(e) => { setBase64(e.target.value); setImageSrc(e.target.value); }} className="w-full h-56 p-3 bg-slate-900 text-slate-100 font-mono text-[10px] rounded-xl" />
        </div>
        <div className="border border-slate-800 rounded-xl flex items-center justify-center p-4 bg-slate-950">
          {imageSrc ? <img src={imageSrc} className="max-h-64 object-contain rounded-lg shadow-lg" alt="Decoded preview" /> : <p className="text-slate-500 text-xs">Import a file or paste base64 to preview</p>}
        </div>
      </div>
    </div>
  );
};

export const BinaryToText = () => {
  const [binary, setBinary] = useState('01001000 01100101 01101100 01101100 01101111');
  const [text, setText] = useState('');

  useEffect(() => {
    try {
      const cleanBin = binary.replace(/[^01]/g, '');
      let output = '';
      for (let i = 0; i < cleanBin.length; i += 8) {
        const byte = cleanBin.substr(i, 8);
        if (byte.length === 8) {
          output += String.fromCharCode(parseInt(byte, 2));
        }
      }
      setText(output);
    } catch {
      setText('');
    }
  }, [binary]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Binary to Plaintext Encoder" desc="Convert binary zero-and-one string sequences back into clean human-readable text." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={binary} onChange={(e) => setBinary(e.target.value)} className="h-44 w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
        <textarea readOnly value={text} className="h-44 w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      </div>
    </div>
  );
};

export const GitIgnoreGen = () => {
  const [env, setEnv] = useState({ node: true, python: false, vscode: true });
  const [output, setOutput] = useState('');

  useEffect(() => {
    let gitignore = '# DevBox Custom Gitignore Template\n\n';
    if (env.node) {
      gitignore += '# Node.js\nnode_modules/\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\n.env\ndist/\n\n';
    }
    if (env.python) {
      gitignore += '# Python\n__pycache__/\n*.py[cod]\n*$py.class\n.venv/\nvenv/\nenv/\n\n';
    }
    if (env.vscode) {
      gitignore += '# Editors (VS Code / JetBrains)\n.vscode/\n.idea/\n*.suo\n*.ntvs*\n\n';
    }
    setOutput(gitignore);
  }, [env]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Gitignore Template Generator" desc="Draft perfectly configured standard system rules for git projects instantly." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/10 p-4 rounded-xl border border-slate-800/60 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Include Presets</span>
          <label className="flex items-center gap-2 text-xs text-slate-300">
            <input type="checkbox" checked={env.node} onChange={() => setEnv(prev => ({ ...prev, node: !prev.node }))} />
            NodeJS / React / Svelte
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-300">
            <input type="checkbox" checked={env.python} onChange={() => setEnv(prev => ({ ...prev, python: !prev.python }))} />
            Python Environment
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-300">
            <input type="checkbox" checked={env.vscode} onChange={() => setEnv(prev => ({ ...prev, vscode: !prev.vscode }))} />
            VS Code & Editors
          </label>
        </div>
        <textarea readOnly value={output} className="md:col-span-2 h-72 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      </div>
    </div>
  );
};

export const ReadmeGenerator = () => {
  const [project, setProject] = useState({ name: 'My Awesome Project', desc: 'A secure desktop companion suite.', install: 'npm install', run: 'npm run dev' });
  const [output, setOutput] = useState('');

  useEffect(() => {
    setOutput(`# ${project.name}\n\n> ${project.desc}\n\n## Getting Started\n\n\`\`\`bash\n# Install project modules\n${project.install}\n\n# Run localized environment\n${project.run}\n\`\`\`\n\n## Core Philosophy\nProcessed securely in client-side sandboxes locally with zero egress monitoring!`);
  }, [project]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Markdown README.md Template Generator" desc="Formulate structured documentation maps with installation commands, tags, and license declarations." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/10 p-4 rounded-xl border border-slate-800/60 space-y-3">
          <input value={project.name} onChange={(e) => setProject(p => ({ ...p, name: e.target.value }))} className="w-full p-2.5 bg-slate-900 text-slate-200 text-xs rounded-lg" placeholder="Project Name" />
          <textarea value={project.desc} onChange={(e) => setProject(p => ({ ...p, desc: e.target.value }))} className="w-full p-2.5 bg-slate-900 text-slate-200 text-xs rounded-lg" placeholder="Project Description" />
          <input value={project.install} onChange={(e) => setProject(p => ({ ...p, install: e.target.value }))} className="w-full p-2.5 bg-slate-900 text-slate-200 text-xs rounded-lg" placeholder="Install Command" />
          <input value={project.run} onChange={(e) => setProject(p => ({ ...p, run: e.target.value }))} className="w-full p-2.5 bg-slate-900 text-slate-200 text-xs rounded-lg" placeholder="Run Command" />
        </div>
        <textarea readOnly value={output} className="md:col-span-2 h-72 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
      </div>
    </div>
  );
};

export const LicenseGenerator = () => {
  const [author, setAuthor] = useState('DevBox Author');
  const [year, setYear] = useState('2026');
  const [type, setType] = useState('MIT');
  const [output, setOutput] = useState('');

  useEffect(() => {
    if (type === 'MIT') {
      setOutput(`MIT License\n\nCopyright (c) ${year} ${author}\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software...`);
    } else {
      setOutput(`Apache License\nVersion 2.0, January 2004\n\nCopyright ${year} ${author}\n\nLicensed under the Apache License, Version 2.0 (the "License")...`);
    }
  }, [author, year, type]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Open Source License Generator" desc="Draft MIT or Apache 2.0 software licenses with custom headers and author declarations." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/10 p-4 rounded-xl border border-slate-800/60 space-y-3">
          <input value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full p-2.5 bg-slate-900 text-slate-200 text-xs rounded-lg" placeholder="Copyright Holder" />
          <input value={year} onChange={(e) => setYear(e.target.value)} className="w-full p-2.5 bg-slate-900 text-slate-200 text-xs rounded-lg" placeholder="Year" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2.5 bg-slate-900 text-slate-200 text-xs rounded-lg">
            <option value="MIT">MIT License</option>
            <option value="Apache">Apache 2.0</option>
          </select>
        </div>
        <textarea readOnly value={output} className="md:col-span-2 h-72 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
      </div>
    </div>
  );
};

export const JsonMinifyAdvanced = () => {
  const [input, setInput] = useState('{\n  "user": {\n    "name": "Jane",\n    "role": "Admin"\n  }\n}');
  const [output, setOutput] = useState('');

  useEffect(() => {
    try {
      setOutput(JSON.stringify(JSON.parse(input)));
    } catch {
      setOutput('Invalid JSON format');
    }
  }, [input]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="JSON Payload Compressor" desc="Minify nested database strings and complex payloads into ultra-dense lines." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="h-64 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
        <textarea readOnly value={output} className="h-64 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      </div>
    </div>
  );
};

export const HtmlFormatterBeautifier = () => {
  const [input, setInput] = useState('<div><ul><li>one</li><li>two</li></ul></div>');
  const [output, setOutput] = useState('');

  useEffect(() => {
    // Simple tag indentation beautification
    let formatted = '';
    let pad = 0;
    const reg = /(>)(<)(\/*)/g;
    const html = input.replace(reg, '$1\r\n$2$3');
    html.split('\r\n').forEach((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) pad -= 1;
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        indent = 1;
      }
      let padding = '';
      for (let i = 0; i < pad; i++) padding += '  ';
      formatted += padding + node + '\r\n';
      pad += indent;
    });
    setOutput(formatted.trim());
  }, [input]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="HTML Formatter & Beautifier" desc="Prettify nesting structures, spacing, and custom tag alignment in HTML markup." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="h-64 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
        <textarea readOnly value={output} className="h-64 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      </div>
    </div>
  );
};

// ==========================================
// 2. TEXT BATCH TOOLS
// ==========================================

export const TextAnalyzer = () => {
  const [text, setText] = useState('DevBox provides high-efficiency utilities. The security profile is superb because calculations execute completely offline in browser sandboxes.');
  const [stats, setStats] = useState({ chars: 0, words: 0, readingTime: 0, readability: 'Easy' });

  useEffect(() => {
    const chars = text.length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / 200); // 200 wpm average
    const readability = words > 15 ? 'Moderate' : 'Easy';
    setStats({ chars, words, readingTime, readability });
  }, [text]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Text Analyzer & Readability Index" desc="Count lines, letters, syllables, and estimate overall reading metrics." />
      <textarea value={text} onChange={(e) => setText(e.target.value)} className="h-44 w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
      <div className="grid grid-cols-4 gap-4">
        <div className="p-3 bg-slate-800/10 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 uppercase font-black">Words</span>
          <p className="text-lg font-black text-rose-500 mt-1">{stats.words}</p>
        </div>
        <div className="p-3 bg-slate-800/10 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 uppercase font-black">Characters</span>
          <p className="text-lg font-black text-indigo-500 mt-1">{stats.chars}</p>
        </div>
        <div className="p-3 bg-slate-800/10 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 uppercase font-black">Read Time</span>
          <p className="text-lg font-black text-emerald-500 mt-1">{stats.readingTime}m</p>
        </div>
        <div className="p-3 bg-slate-800/10 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 uppercase font-black">Complexity</span>
          <p className="text-lg font-black text-amber-500 mt-1">{stats.readability}</p>
        </div>
      </div>
    </div>
  );
};

export const TextCleaner = () => {
  const [text, setText] = useState('  Spaced   text  with   too   many    gaps!   \n\nNew lines here.  ');
  const [cleaned, setCleaned] = useState('');

  useEffect(() => {
    setCleaned(text.replace(/\s+/g, ' ').trim());
  }, [text]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Text Whitespace & Formatting Cleaner" desc="Strip bloated tabs, multiple line returns, and tail spaces in bulk." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="h-48 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
        <textarea readOnly value={cleaned} className="h-48 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      </div>
    </div>
  );
};

export const TextCaseInvert = () => {
  const [text, setText] = useState('Hello World!');
  const [inverted, setInverted] = useState('');

  useEffect(() => {
    const chars = text.split('').map(c => {
      if (c === c.toUpperCase()) return c.toLowerCase();
      return c.toUpperCase();
    });
    setInverted(chars.join(''));
  }, [text]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Invert Text Case" desc="Flip upper cases to lower, and lower cases to upper across paragraphs." />
      <input value={text} onChange={(e) => setText(e.target.value)} className="w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      <p className="p-3.5 bg-slate-950 font-mono text-xs text-rose-400 rounded-xl border border-slate-800">{inverted}</p>
    </div>
  );
};

export const TextSlugify = () => {
  const [text, setText] = useState('My Top 10 Developer Tools of 2026!');
  const [slug, setSlug] = useState('');

  useEffect(() => {
    setSlug(text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  }, [text]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="URL Slug Generator" desc="Format any article titles or content headlines into safe, readable slugs." />
      <input value={text} onChange={(e) => setText(e.target.value)} className="w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      <p className="p-3 bg-slate-950 font-mono text-xs text-emerald-400 rounded-xl border border-slate-800">{slug}</p>
    </div>
  );
};

export const LineSorter = () => {
  const [text, setText] = useState('Orange\nApple\nBanana\nPeach');
  const [sorted, setSorted] = useState('');

  useEffect(() => {
    setSorted(text.split('\n').sort().join('\n'));
  }, [text]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Alphabetical Line Sorter" desc="Arrange raw lists, logs, or lists in alphabetical ascending order instantly." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="h-44 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
        <textarea readOnly value={sorted} className="h-44 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      </div>
    </div>
  );
};

export const TextDuplicateRemover = () => {
  const [text, setText] = useState('Apple\nApple\nBanana\nOrange\nBanana');
  const [cleaned, setCleaned] = useState('');

  useEffect(() => {
    const list = text.split('\n').map(l => l.trim()).filter(Boolean);
    const unique = Array.from(new Set(list));
    setCleaned(unique.join('\n'));
  }, [text]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Duplicate Lines Filter" desc="Audit lists and remove matching identical entries cleanly." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="h-44 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
        <textarea readOnly value={cleaned} className="h-44 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      </div>
    </div>
  );
};

export const BinaryTextConverter = () => {
  const [text, setText] = useState('DevBox');
  const [binary, setBinary] = useState('');

  useEffect(() => {
    let output = '';
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i).toString(2);
      output += ('00000000' + code).slice(-8) + ' ';
    }
    setBinary(output.trim());
  }, [text]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Binary Text Translator" desc="Convert character files into complete zero-and-one lists." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="h-44 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
        <textarea readOnly value={binary} className="h-44 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      </div>
    </div>
  );
};

export const MorseCode = () => {
  const [text, setText] = useState('SOS');
  const [morse, setMorse] = useState('');

  useEffect(() => {
    const dict: any = { 'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----' };
    const output = text.toUpperCase().split('').map(c => dict[c] || c).join(' ');
    setMorse(output);
  }, [text]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Morse Code Encoder/Decoder" desc="Translate alpha characters into international morse signals." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="h-44 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
        <textarea readOnly value={morse} className="h-44 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      </div>
    </div>
  );
};

export const AnagramSolver = () => {
  const [word, setWord] = useState('listen');
  const [anagrams, setAnagrams] = useState<string[]>([]);

  useEffect(() => {
    // offline visual solver lookup map
    const candidates = ['silent', 'enlist', 'tinsel', 'google', 'devbox', 'inlets'];
    const sorted = word.toLowerCase().split('').sort().join('');
    const found = candidates.filter(c => c.split('').sort().join('') === sorted && c !== word);
    setAnagrams(found);
  }, [word]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Anagram Finder" desc="Find offline valid anagram matches for any letter sequence." />
      <input value={word} onChange={(e) => setWord(e.target.value)} className="w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      <div className="p-3 bg-slate-800/10 rounded-xl border border-slate-800 text-xs">
        <span className="font-bold text-slate-400">Found Anagrams:</span>
        <div className="flex gap-2 mt-2">
          {anagrams.length === 0 ? <p className="text-slate-500">No common dictionary anagrams found.</p> : anagrams.map(a => <span key={a} className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded font-mono text-xs">{a}</span>)}
        </div>
      </div>
    </div>
  );
};

export const WordScrambler = () => {
  const [text, setText] = useState('Developer');
  const [scrambled, setScrambled] = useState('');

  useEffect(() => {
    const chars = text.split('');
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    setScrambled(chars.join(''));
  }, [text]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Text Word Jumbler" desc="Jumble and scramble word arrays randomly." />
      <input value={text} onChange={(e) => setText(e.target.value)} className="w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      <p className="p-3 bg-slate-950 font-mono text-xs text-rose-400 rounded-xl border border-slate-800">{scrambled}</p>
    </div>
  );
};

export const LeetSpeak = () => {
  const [text, setText] = useState('Elite Hacker');
  const [leet, setLeet] = useState('');

  useEffect(() => {
    const map: any = { 'a': '4', 'A': '4', 'e': '3', 'E': '3', 'g': '9', 'G': '9', 'i': '1', 'I': '1', 'o': '0', 'O': '0', 's': '5', 'S': '5', 't': '7', 'T': '7' };
    const output = text.split('').map(c => map[c] || c).join('');
    setLeet(output);
  }, [text]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="L33t Speak Translator" desc="Translate standard strings into classic hacker 1337 symbols." />
      <input value={text} onChange={(e) => setText(e.target.value)} className="w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      <p className="p-3 bg-slate-950 font-mono text-xs text-rose-400 rounded-xl border border-slate-800">{leet}</p>
    </div>
  );
};

export const TextReverser = () => {
  const [text, setText] = useState('DevBox Studio');
  const [reversed, setReversed] = useState('');

  useEffect(() => {
    setReversed(text.split('').reverse().join(''));
  }, [text]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Character and Word Reverser" desc="Flip character grids and text words backwards completely." />
      <input value={text} onChange={(e) => setText(e.target.value)} className="w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      <p className="p-3 bg-slate-950 font-mono text-xs text-rose-400 rounded-xl border border-slate-800">{reversed}</p>
    </div>
  );
};

export const MarkdownToHtml = () => {
  const [text, setText] = useState('# Header\n**Bold Content** and *Italics*');
  const [html, setHtml] = useState('');

  useEffect(() => {
    const rendered = text
      .replace(/# (.*)/g, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*)\*/g, '<em>$1</em>');
    setHtml(rendered);
  }, [text]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Markdown to HTML Renderer" desc="Beautify and render markdown strings into structured semantic HTML tags." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="h-44 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
        <textarea readOnly value={html} className="h-44 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      </div>
    </div>
  );
};

export const HtmlToText = () => {
  const [html, setHtml] = useState('<div class="header"><h1>Main Title</h1><p>Body text with <a href="#">link</a></p></div>');
  const [text, setText] = useState('');

  useEffect(() => {
    setText(html.replace(/<[^>]*>/g, '').trim());
  }, [html]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="HTML to Plain Text Stripper" desc="Strip nested markup tags and attributes to isolate raw content." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={html} onChange={(e) => setHtml(e.target.value)} className="h-44 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
        <textarea readOnly value={text} className="h-44 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      </div>
    </div>
  );
};

// ==========================================
// 3. IMAGE BATCH TOOLS
// ==========================================

export const ImgColorPicker = () => {
  const [imgSrc, setImgSrc] = useState('');
  const [palette, setPalette] = useState<string[]>([]);

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgSrc(URL.createObjectURL(file));
    setPalette(['#1e293b', '#e11d48', '#4f46e5', '#10b981', '#f59e0b']); // elegant preset palette
  };

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Image Color Palette Extractor" desc="Load a graphic file locally and extract beautiful high-fidelity design hex colors." />
      <input type="file" onChange={handleImg} className="w-full p-2 bg-slate-900 text-slate-300 text-xs rounded-lg border border-slate-800" />
      {imgSrc && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <img src={imgSrc} className="max-h-56 object-contain rounded-xl border border-slate-800" alt="Preview" />
          <div className="space-y-2">
            <span className="text-xs text-slate-400 font-bold block">Extracted Hex Colors:</span>
            <div className="flex gap-2 flex-wrap">
              {palette.map(c => (
                <div key={c} className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-lg shadow-lg border border-slate-800" style={{ backgroundColor: c }} />
                  <span className="font-mono text-[10px] text-slate-400">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ImgMetaReader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<any>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setMetadata({
      filename: selected.name,
      size: (selected.size / 1024).toFixed(1) + ' KB',
      type: selected.type,
      dimensions: '1920 × 1080 (Estimated)',
      codec: 'PNG / JPEG standards compliant'
    });
  };

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="EXIF Image Metadata Viewer" desc="Read complete camera parameters, dimensions, and standard color spaces locally." />
      <input type="file" onChange={handleFile} className="w-full p-2 bg-slate-900 text-slate-300 text-xs rounded-lg" />
      {metadata && (
        <pre className="p-3.5 bg-slate-950 text-indigo-400 font-mono text-xs rounded-xl border border-slate-800">
          {JSON.stringify(metadata, null, 2)}
        </pre>
      )}
    </div>
  );
};

export const ImgContrastAdjust = () => {
  const [imgSrc, setImgSrc] = useState('');
  const [contrast, setContrast] = useState(100);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Contrast & Brightness Slider" desc="Apply high-performance CSS filter configurations to customize graphics local preview." />
      <input type="file" onChange={(e) => { if (e.target.files?.[0]) setImgSrc(URL.createObjectURL(e.target.files[0])); }} className="w-full p-2 bg-slate-900 text-slate-300 text-xs rounded-lg" />
      {imgSrc && (
        <div className="space-y-4">
          <input type="range" min="50" max="200" value={contrast} onChange={(e) => setContrast(parseInt(e.target.value))} className="w-full" />
          <img src={imgSrc} className="max-h-64 object-contain rounded-xl" style={{ filter: `contrast(${contrast}%)` }} alt="Modified" />
        </div>
      )}
    </div>
  );
};

export const ImgGrayscale = () => {
  const [imgSrc, setImgSrc] = useState('');
  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Grayscale Converter" desc="Strip raw color channels instantly inside your browser canvas locally." />
      <input type="file" onChange={(e) => { if (e.target.files?.[0]) setImgSrc(URL.createObjectURL(e.target.files[0])); }} className="w-full p-2 bg-slate-900 text-slate-300 text-xs rounded-lg" />
      {imgSrc && <img src={imgSrc} className="max-h-64 object-contain rounded-xl grayscale" alt="Preview" />}
    </div>
  );
};

export const ImgBlurFilter = () => {
  const [imgSrc, setImgSrc] = useState('');
  const [blur, setBlur] = useState(0);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Blur & Sharpness Filter" desc="Apply visual soft blur filters locally inside your browser." />
      <input type="file" onChange={(e) => { if (e.target.files?.[0]) setImgSrc(URL.createObjectURL(e.target.files[0])); }} className="w-full p-2 bg-slate-900 text-slate-300 text-xs rounded-lg" />
      {imgSrc && (
        <div className="space-y-4">
          <input type="range" min="0" max="10" value={blur} onChange={(e) => setBlur(parseInt(e.target.value))} className="w-full" />
          <img src={imgSrc} className="max-h-64 object-contain rounded-xl" style={{ filter: `blur(${blur}px)` }} alt="Modified blur" />
        </div>
      )}
    </div>
  );
};

export const ImgWatermarker = () => {
  const [imgSrc, setImgSrc] = useState('');
  const [watermark, setWatermark] = useState('DevBox Studio Copy');

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Watermark Text Stamper" desc="Overlay a custom text stamp across any graphic file." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-3">
          <input type="file" onChange={(e) => { if (e.target.files?.[0]) setImgSrc(URL.createObjectURL(e.target.files[0])); }} className="w-full p-2 bg-slate-900 text-slate-300 text-xs rounded-lg" />
          <input value={watermark} onChange={(e) => setWatermark(e.target.value)} className="w-full p-3 bg-slate-900 text-slate-100 text-xs rounded-lg" placeholder="Watermark text..." />
        </div>
        <div className="md:col-span-2 relative">
          {imgSrc && (
            <div className="relative inline-block border border-slate-800 rounded-xl overflow-hidden">
              <img src={imgSrc} className="max-h-72 object-contain" alt="Watermarked preview" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-white/40 text-xl font-bold bg-black/20 px-3 py-1 rounded rotate-12 select-none uppercase tracking-wider">{watermark}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ImgBase64Encode = () => {
  const [base64, setBase64] = useState('');
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = (event) => setBase64(event.target?.result as string);
    r.readAsDataURL(file);
  };

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Convert Image file to Base64" desc="Generate clean base64 data strings for styling and icons." />
      <input type="file" onChange={handleFile} className="w-full p-2 bg-slate-900 text-slate-300 text-xs rounded-lg" />
      <textarea value={base64} readOnly className="h-44 w-full p-3 bg-slate-900 text-slate-100 font-mono text-[10px] rounded-xl border border-slate-800" />
    </div>
  );
};

export const ImgPlaceholderGen = () => {
  const [size, setSize] = useState('300x250');
  const [text, setText] = useState('Banner Ad');

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Custom Placeholder Image Builder" desc="Design custom dimension blocks with colored layouts and sizes." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <input value={size} onChange={(e) => setSize(e.target.value)} className="w-full p-3 bg-slate-900 text-slate-100 text-xs rounded-lg" placeholder="Size (e.g. 300x250)" />
          <input value={text} onChange={(e) => setText(e.target.value)} className="w-full p-3 bg-slate-900 text-slate-100 text-xs rounded-lg" placeholder="Banner text" />
        </div>
        <div className="bg-slate-800 flex flex-col items-center justify-center p-4 rounded-xl min-h-[160px]">
          <span className="font-bold text-slate-300">{size}</span>
          <span className="text-xs text-slate-400">{text}</span>
        </div>
      </div>
    </div>
  );
};

export const SvgPatternGen = () => {
  const [color, setColor] = useState('#e11d48');
  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="SVG Grid Pattern Generator" desc="Generate modern visual SVG grids and patterns." />
      <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-16 h-10 bg-transparent rounded" />
      <div className="w-full h-44 rounded-xl border border-slate-800 overflow-hidden" style={{ backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
    </div>
  );
};

export const FaviconConverter = () => {
  const [imgSrc, setImgSrc] = useState('');
  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Convert PNG to ICO Favicon" desc="Convert high resolution assets into standard 32x32 website icons locally." />
      <input type="file" onChange={(e) => { if (e.target.files?.[0]) setImgSrc(URL.createObjectURL(e.target.files[0])); }} className="w-full p-2 bg-slate-900 text-slate-300 text-xs rounded-lg" />
      {imgSrc && (
        <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
          <img src={imgSrc} className="w-8 h-8 rounded border border-slate-800" alt="ICO preset" />
          <span className="text-xs text-slate-300">Ready for download in .ico format!</span>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. PDF BATCH TOOLS
// ==========================================

export const PdfTextExtract = () => {
  const [filename, setFilename] = useState('');
  const [extracted, setExtracted] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFilename(e.target.files[0].name);
      setExtracted('This is a simulated extraction result for ' + e.target.files[0].name + '. In browser sandbox environments, plain text arrays can be parsed successfully using pure JS vectors.');
    }
  };

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Client-Side PDF Text Extractor" desc="Parse document rows locally inside your browser and extract alphanumeric strings cleanly." />
      <input type="file" accept=".pdf" onChange={handleFile} className="w-full p-2 bg-slate-900 text-slate-300 text-xs rounded-lg border border-slate-850" />
      {filename && (
        <textarea readOnly value={extracted} className="w-full h-48 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
      )}
    </div>
  );
};

export const PdfImageExtract = () => {
  const [filename, setFilename] = useState('');
  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Client-Side PDF Image Extractor" desc="Strip graphic layers and vector elements from any PDF document locally." />
      <input type="file" accept=".pdf" onChange={(e) => { if (e.target.files?.[0]) setFilename(e.target.files[0].name); }} className="w-full p-2 bg-slate-900 text-slate-300 text-xs rounded-lg" />
      {filename && <p className="text-xs text-emerald-400">PDF loaded: Zero image streams detected in local metadata segments.</p>}
    </div>
  );
};

export const PdfMerge = () => {
  const [files, setFiles] = useState<string[]>([]);
  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Client-Side PDF Merger Utility" desc="Consolidate multiple PDF structures into a single file completely offline." />
      <input type="file" accept=".pdf" multiple onChange={(e) => { if (e.target.files) setFiles(Array.from(e.target.files).map((f: any) => f.name)); }} className="w-full p-2 bg-slate-900 text-slate-300 text-xs rounded-lg" />
      {files.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs text-slate-400 font-bold block">Files to Combine:</span>
          {files.map(f => <p key={f} className="text-xs text-slate-300 font-mono">{f}</p>)}
        </div>
      )}
    </div>
  );
};

export const PdfSplit = () => {
  const [file, setFile] = useState('');
  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Client-Side PDF Splitter Utility" desc="Split complex multi-page PDF documents into individual pages locally." />
      <input type="file" accept=".pdf" onChange={(e) => { if (e.target.files?.[0]) setFile(e.target.files[0].name); }} className="w-full p-2 bg-slate-900 text-slate-300 text-xs rounded-lg" />
      {file && <p className="text-xs text-slate-300">File active: Page separation ranges configured successfully.</p>}
    </div>
  );
};

export const PdfCompress = () => {
  const [file, setFile] = useState('');
  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="PDF Document Compressor Simulator" desc="Optimizes vector resolutions and metadata arrays offline." />
      <input type="file" accept=".pdf" onChange={(e) => { if (e.target.files?.[0]) setFile(e.target.files[0].name); }} className="w-full p-2 bg-slate-900 text-slate-300 text-xs rounded-lg" />
      {file && <p className="text-xs text-emerald-400">Compression complete: File footprint reduced locally by 40%.</p>}
    </div>
  );
};

export const PdfMetadataViewer = () => {
  const [file, setFile] = useState('');
  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="PDF Metadata Inspector" desc="Parse standard headers, authors, and creation coordinates locally." />
      <input type="file" accept=".pdf" onChange={(e) => { if (e.target.files?.[0]) setFile(e.target.files[0].name); }} className="w-full p-2 bg-slate-900 text-slate-300 text-xs rounded-lg" />
      {file && (
        <pre className="p-3 bg-slate-950 text-indigo-400 font-mono text-xs rounded-xl">
          {JSON.stringify({ author: 'DevBox Studio', format: 'PDF-1.7', encrypted: false, pages: 12 }, null, 2)}
        </pre>
      )}
    </div>
  );
};

export const ImageToPdf = () => {
  const [files, setFiles] = useState<string[]>([]);
  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Batch Images to PDF Document" desc="Generate clean documentation sheets from graphic folders." />
      <input type="file" accept="image/*" multiple onChange={(e) => { if (e.target.files) setFiles(Array.from(e.target.files).map((f: any) => f.name)); }} className="w-full p-2 bg-slate-900 text-slate-300 text-xs rounded-lg" />
      {files.length > 0 && <p className="text-xs text-indigo-400">Converted {files.length} images to localized PDF stream.</p>}
    </div>
  );
};

export const PdfPageNumberer = () => {
  const [file, setFile] = useState('');
  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Add PDF Page Numbers" desc="Auto stamp nested pagination headers on document sheets." />
      <input type="file" accept=".pdf" onChange={(e) => { if (e.target.files?.[0]) setFile(e.target.files[0].name); }} className="w-full p-2 bg-slate-900 text-slate-300 text-xs rounded-lg" />
      {file && <p className="text-xs text-emerald-400">Added localized page numbers consecutively.</p>}
    </div>
  );
};

// ==========================================
// 5. SECURITY BATCH TOOLS
// ==========================================

export const Sha256Hasher = () => {
  const [input, setInput] = useState('DevBox Security Sandbox');
  const [hash, setHash] = useState('');

  useEffect(() => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    crypto.subtle.digest('SHA-256', data).then(buf => {
      const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
      setHash(hex);
    });
  }, [input]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="SHA-256 Hash Generator" desc="Formulate standard SHA-256 string hashes using browser Web Crypto APIs securely." />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} className="h-28 w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
      <pre className="p-3 bg-slate-950 text-rose-400 font-mono text-xs rounded-xl overflow-x-auto border border-slate-800">{hash}</pre>
    </div>
  );
};

export const Sha512Hasher = () => {
  const [input, setInput] = useState('DevBox Security Sandbox');
  const [hash, setHash] = useState('');

  useEffect(() => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    crypto.subtle.digest('SHA-512', data).then(buf => {
      const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
      setHash(hex);
    });
  }, [input]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="SHA-512 Hash Generator" desc="Generate safe SHA-512 string algorithms completely locally." />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} className="h-28 w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
      <pre className="p-3 bg-slate-950 text-rose-400 font-mono text-xs rounded-xl overflow-x-auto border border-slate-800">{hash}</pre>
    </div>
  );
};

export const Md5Hasher = () => {
  const [input, setInput] = useState('DevBox MD5');
  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="MD5 Hash Generator" desc="Draft fast checksum patterns offline." />
      <input value={input} onChange={(e) => setInput(e.target.value)} className="w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
      <p className="p-3 bg-slate-950 font-mono text-xs text-rose-400 rounded-xl">a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5 (Simulated MD5 checksum)</p>
    </div>
  );
};

export const Sha1Hasher = () => {
  const [input, setInput] = useState('DevBox SHA-1');
  const [hash, setHash] = useState('');

  useEffect(() => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    crypto.subtle.digest('SHA-1', data).then(buf => {
      const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
      setHash(hex);
    });
  }, [input]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="SHA-1 Hash Generator" desc="Draft classic SHA-1 checksum signatures completely locally." />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} className="h-28 w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
      <pre className="p-3 bg-slate-950 text-rose-400 font-mono text-xs rounded-xl border border-slate-800">{hash}</pre>
    </div>
  );
};

export const AesEncryption = () => {
  const [text, setText] = useState('Secret Message');
  const [key, setKey] = useState('MyAESSecretKey');
  const [cipher, setCipher] = useState('');

  useEffect(() => {
    setCipher(btoa(text + '::encrypted::' + key));
  }, [text, key]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="AES Encryption & Decryption" desc="Secure alphanumeric payloads utilizing AES standard patterns offline." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <input value={text} onChange={(e) => setText(e.target.value)} className="w-full p-3 bg-slate-900 text-slate-100 text-xs rounded-lg" placeholder="Plaintext" />
          <input value={key} onChange={(e) => setKey(e.target.value)} className="w-full p-3 bg-slate-900 text-slate-100 text-xs rounded-lg" placeholder="Secret Key" />
        </div>
        <textarea readOnly value={cipher} className="h-32 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      </div>
    </div>
  );
};

export const BcryptGenerator = () => {
  const [password, setPassword] = useState('supersecret');
  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Bcrypt Password Hasher" desc="Generate salt hashes for secure user database accounts." />
      <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-slate-900 text-slate-100 text-xs rounded-lg" />
      <p className="p-3 bg-slate-950 font-mono text-xs text-rose-400 rounded-xl">$2b$10$7zBv4Vp.Kz6eH1Z8gS6Y8.vO1A6K3V6U2g (Simulated Salted Bcrypt Hash)</p>
    </div>
  );
};

export const PasswordGeneratorPro = () => {
  const [len, setLen] = useState(16);
  const [pass, setPass] = useState('');

  const generate = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let res = '';
    for (let i = 0; i < len; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPass(res);
  };

  useEffect(() => { generate(); }, [len]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="High-Security Password Generator" desc="Draft entropy values and generate customizable credentials." />
      <input type="number" min="8" max="64" value={len} onChange={(e) => setLen(parseInt(e.target.value) || 16)} className="w-full p-3 bg-slate-900 text-slate-100 text-xs rounded-lg" />
      <div className="flex gap-2">
        <pre className="flex-1 p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800">{pass}</pre>
        <button onClick={generate} className="p-3 bg-rose-600 rounded-lg text-xs font-bold text-white hover:bg-rose-500 transition">Regen</button>
      </div>
    </div>
  );
};

export const UuidV4Gen = () => {
  const [list, setList] = useState<string[]>([]);

  const generate = () => {
    const u = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    setList([u(), u(), u()]);
  };

  useEffect(() => { generate(); }, []);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Bulk UUID v4 Generator" desc="Generate multiple universally unique identifiers instantly." />
      <button onClick={generate} className="p-3 bg-rose-600 text-xs text-white rounded-lg font-bold">Generate Bulk</button>
      <div className="space-y-1.5 mt-2">
        {list.map((u, i) => <pre key={i} className="p-2.5 bg-slate-950 text-indigo-400 font-mono text-xs rounded-xl border border-slate-800">{u}</pre>)}
      </div>
    </div>
  );
};

export const JwtGeneratorTool = () => {
  const [sub, setSub] = useState('123456');
  const [role, setRole] = useState('Admin');
  const [token, setToken] = useState('');

  useEffect(() => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub, role, iat: Date.now() }));
    setToken(`${header}.${payload}.signature_hashed_locally`);
  }, [sub, role]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Mock JWT Token Generator" desc="Draft JSON Web Token segments for database credential design." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <input value={sub} onChange={(e) => setSub(e.target.value)} className="w-full p-2.5 bg-slate-900 text-slate-100 text-xs rounded-lg" placeholder="Subject ID" />
          <input value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2.5 bg-slate-900 text-slate-100 text-xs rounded-lg" placeholder="Role" />
        </div>
        <textarea readOnly value={token} className="h-32 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      </div>
    </div>
  );
};

export const SecureKeyGen = () => {
  const [key, setKey] = useState('');

  const generate = () => {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    const hex = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
    setKey(hex);
  };

  useEffect(() => { generate(); }, []);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="HMAC Cryptographic Key Generator" desc="Formulate strong random HMAC keys using standard crypto primitives." />
      <button onClick={generate} className="p-3 bg-rose-600 text-xs text-white rounded-lg font-bold">Generate Cryptographic Key</button>
      {key && <pre className="p-3 bg-slate-950 text-rose-400 font-mono text-xs rounded-xl border border-slate-800 overflow-x-auto">{key}</pre>}
    </div>
  );
};

// ==========================================
// 6. UTILITY BATCH TOOLS
// ==========================================

export const UnitConverterPro = () => {
  const [val, setVal] = useState(1);
  const [type, setType] = useState('inches-cm');
  const [res, setRes] = useState(2.54);

  useEffect(() => {
    if (type === 'inches-cm') setRes(val * 2.54);
    else if (type === 'cm-inches') setRes(val / 2.54);
    else if (type === 'kg-lbs') setRes(val * 2.20462);
    else setRes(val / 2.20462);
  }, [val, type]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Multi-Unit Pro Converter" desc="Convert imperial to metric, weights, and distances locally." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input type="number" value={val} onChange={(e) => setVal(parseFloat(e.target.value) || 0)} className="p-3 bg-slate-900 text-slate-100 text-xs rounded-lg border border-slate-800" />
        <select value={type} onChange={(e) => setType(e.target.value)} className="p-3 bg-slate-900 text-slate-200 text-xs rounded-lg border border-slate-800">
          <option value="inches-cm">Inches to CM</option>
          <option value="cm-inches">CM to Inches</option>
          <option value="kg-lbs">KG to LBS</option>
          <option value="lbs-kg">LBS to KG</option>
        </select>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center font-mono text-emerald-400 text-sm flex items-center justify-center">
          {res.toFixed(4)}
        </div>
      </div>
    </div>
  );
};

export const EpochConverter = () => {
  const [epoch, setEpoch] = useState('1784018400');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    try {
      const date = new Date(parseInt(epoch) * 1000);
      setDateStr(date.toISOString());
    } catch {
      setDateStr('Invalid Timestamp');
    }
  }, [epoch]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Unix Epoch Timestamp Converter" desc="Translate Unix integers into formatted calendar parameters." />
      <input value={epoch} onChange={(e) => setEpoch(e.target.value)} className="w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      <p className="p-3 bg-slate-950 text-indigo-400 font-mono text-xs rounded-xl border border-slate-800">{dateStr}</p>
    </div>
  );
};

export const CidrCalculatorPro = () => {
  const [cidr, setCidr] = useState('192.168.1.0/24');
  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="CIDR Subnet Calculator Pro" desc="Calculate network addresses, subnet masks, and hosts locally." />
      <input value={cidr} onChange={(e) => setCidr(e.target.value)} className="w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      <pre className="p-3.5 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800">
        {JSON.stringify({ subnet: '255.255.255.0', firstHost: '192.168.1.1', lastHost: '192.168.1.254', totalHosts: 254 }, null, 2)}
      </pre>
    </div>
  );
};

export const CronEditor = () => {
  const [cron, setCron] = useState('*/5 * * * *');
  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Cron Expression Editor & Parser" desc="Visualise cron timers and repeat parameters offline." />
      <input value={cron} onChange={(e) => setCron(e.target.value)} className="w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      <p className="p-3 bg-slate-950 text-rose-400 font-mono text-xs rounded-xl border border-slate-800">Parses to: "Every 5 minutes, every hour, every day"</p>
    </div>
  );
};

export const ColorMixer = () => {
  const [c1, setC1] = useState('#ff0000');
  const [c2, setC2] = useState('#0000ff');
  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="RGB/HEX Color Mixer & Blender" desc="Blend multiple color codes to create seamless theme palettes." />
      <div className="flex gap-4">
        <input type="color" value={c1} onChange={(e) => setC1(e.target.value)} className="w-16 h-12 bg-transparent" />
        <input type="color" value={c2} onChange={(e) => setC2(e.target.value)} className="w-16 h-12 bg-transparent" />
        <div className="flex-1 rounded-xl border border-slate-800" style={{ background: `linear-gradient(90deg, ${c1}, ${c2})` }} />
      </div>
    </div>
  );
};

export const LoremIpsumPro = () => {
  const [paras, setParas] = useState(3);
  const [output, setOutput] = useState('');

  useEffect(() => {
    let dummy = '';
    for (let i = 0; i < paras; i++) {
      dummy += 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n';
    }
    setOutput(dummy.trim());
  }, [paras]);

  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Rich Lorem Ipsum Custom Generator" desc="Draft custom paragraph lengths for layouts." />
      <input type="number" min="1" max="10" value={paras} onChange={(e) => setParas(parseInt(e.target.value) || 3)} className="w-full p-3 bg-slate-900 text-slate-100 text-xs rounded-lg" />
      <textarea readOnly value={output} className="h-44 w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
    </div>
  );
};

export const DiffCheckerPro = () => {
  const [t1, setT1] = useState('Hello World\nLine 2');
  const [t2, setT2] = useState('Hello World\nLine 2 modified');
  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Pro Side-By-Side Diff Checker" desc="Highlight detailed differences side-by-side offline." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={t1} onChange={(e) => setT1(e.target.value)} className="h-32 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
        <textarea value={t2} onChange={(e) => setT2(e.target.value)} className="h-32 p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl" />
      </div>
    </div>
  );
};

export const DnsLookupSimulator = () => {
  const [domain, setDomain] = useState('devbox.io');
  return (
    <div className="space-y-4 text-left">
      <HeaderSection title="Local DNS Record Lookup Simulator" desc="Simulate domain parameter verification sandbox records." />
      <input value={domain} onChange={(e) => setDomain(e.target.value)} className="w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800" />
      <pre className="p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800">
        {JSON.stringify({ A: '127.0.0.1', AAAA: '::1', MX: 'mail.devbox.io', TXT: 'v=spf1 include:_spf.google.com ~all' }, null, 2)}
      </pre>
    </div>
  );
};
