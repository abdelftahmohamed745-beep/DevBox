import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, AlertCircle, Clock } from 'lucide-react';

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-semibold transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
};

// 1. Universal Unit Converter
const UnitConverter = () => {
  const [type, setType] = useState<'length' | 'weight' | 'temp'>('length');
  const [val, setVal] = useState<number>(1);
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('cm');
  const [output, setOutput] = useState(100);

  const units = {
    length: {
      m: { name: 'Meter (m)', factor: 1 },
      km: { name: 'Kilometer (km)', factor: 1000 },
      cm: { name: 'Centimeter (cm)', factor: 0.01 },
      mm: { name: 'Millimeter (mm)', factor: 0.001 },
      inch: { name: 'Inch (in)', factor: 0.0254 },
      foot: { name: 'Foot (ft)', factor: 0.3048 },
      yard: { name: 'Yard (yd)', factor: 0.9144 },
      mile: { name: 'Mile (mi)', factor: 1609.344 },
    },
    weight: {
      kg: { name: 'Kilogram (kg)', factor: 1 },
      g: { name: 'Gram (g)', factor: 0.001 },
      mg: { name: 'Milligram (mg)', factor: 0.000001 },
      lb: { name: 'Pound (lb)', factor: 0.45359237 },
      oz: { name: 'Ounce (oz)', factor: 0.028349523 },
    },
    temp: {
      C: { name: 'Celsius (°C)' },
      F: { name: 'Fahrenheit (°F)' },
      K: { name: 'Kelvin (K)' },
    },
  };

  const calculateUnit = () => {
    if (type === 'length' || type === 'weight') {
      const activeUnits = units[type];
      const fromFactor = (activeUnits as any)[from]?.factor || 1;
      const toFactor = (activeUnits as any)[to]?.factor || 1;
      const result = (val * fromFactor) / toFactor;
      setOutput(parseFloat(result.toFixed(6)));
    } else {
      // Temperature conversions
      if (from === to) { setOutput(val); return; }
      let cVal = val;
      if (from === 'F') cVal = (val - 32) * (5 / 9);
      if (from === 'K') cVal = val - 273.15;

      let result = cVal;
      if (to === 'F') result = cVal * (9 / 5) + 32;
      if (to === 'K') result = cVal + 273.15;

      setOutput(parseFloat(result.toFixed(4)));
    }
  };

  useEffect(() => {
    calculateUnit();
  }, [val, from, to, type]);

  const handleTypeChange = (newType: 'length' | 'weight' | 'temp') => {
    setType(newType);
    const keys = Object.keys(units[newType]);
    setFrom(keys[0]);
    setTo(keys[1]);
  };

  return (
    <div className="space-y-4">
      <div className="flex bg-neutral-100 dark:bg-neutral-950 p-1 rounded-lg border gap-1">
        <button onClick={() => handleTypeChange('length')} className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${type === 'length' ? 'bg-amber-600 text-white' : 'text-neutral-500'}`}>Length</button>
        <button onClick={() => handleTypeChange('weight')} className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${type === 'weight' ? 'bg-amber-600 text-white' : 'text-neutral-500'}`}>Weight / Mass</button>
        <button onClick={() => handleTypeChange('temp')} className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${type === 'temp' ? 'bg-amber-600 text-white' : 'text-neutral-500'}`}>Temperature</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border">
        <label className="flex flex-col gap-1 text-xs font-semibold">
          <span>Source Value</span>
          <input type="number" value={val} onChange={(e) => setVal(parseFloat(e.target.value) || 0)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-sm font-mono" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold">
          <span>From Unit</span>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-bold">
            {Object.entries(units[type]).map(([k, u]) => <option key={k} value={k}>{(u as any).name}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold">
          <span>To Unit</span>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-bold">
            {Object.entries(units[type]).map(([k, u]) => <option key={k} value={k}>{(u as any).name}</option>)}
          </select>
        </label>
      </div>

      <div className="bg-white dark:bg-neutral-950 border rounded-xl p-4 flex justify-between items-center">
        <div>
          <span className="text-[10px] font-bold text-neutral-400 block mb-1">CONVERTED MEASURE</span>
          <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">{output}</span>
        </div>
        <CopyButton text={output.toString()} />
      </div>
    </div>
  );
};

// 2. Unix Timestamp Converter
const TimestampConverter = () => {
  const [currentEpoch, setCurrentEpoch] = useState(Math.floor(Date.now() / 1000));
  const [inputEpoch, setInputEpoch] = useState(Math.floor(Date.now() / 1000).toString());
  const [dateStr, setDateStr] = useState('');
  const [inputDate, setInputDate] = useState(new Date().toISOString().substring(0, 16));
  const [outputEpoch, setOutputEpoch] = useState(0);

  // Real-time ticking clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Convert Unix -> Date
  useEffect(() => {
    const parsed = parseInt(inputEpoch);
    if (!parsed) {
      setDateStr('Invalid Timestamp');
      return;
    }
    // Handle milliseconds vs seconds
    const isMs = inputEpoch.length > 10;
    const date = new Date(parsed * (isMs ? 1 : 1000));
    setDateStr(date.toString());
  }, [inputEpoch]);

  // Convert Date -> Unix
  useEffect(() => {
    if (!inputDate) return;
    const date = new Date(inputDate);
    setOutputEpoch(Math.floor(date.getTime() / 1000));
  }, [inputDate]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-mono font-bold">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <Clock className="w-4 h-4 animate-pulse" />
          <span>CURRENT UNIX EPOCH:</span>
          <span className="text-sm tracking-wider font-extrabold">{currentEpoch}</span>
        </div>
        <CopyButton text={currentEpoch.toString()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border">
          <h4 className="text-xs font-bold text-neutral-500">Unix Timestamp to Date</h4>
          <label className="flex flex-col gap-1 text-xs">
            <span>Enter Epoch Seconds/Milliseconds</span>
            <input type="text" value={inputEpoch} onChange={(e) => setInputEpoch(e.target.value.replace(/\D/g, ''))} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-sm font-mono" />
          </label>
          <div className="p-2.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-mono break-all font-bold">
            {dateStr}
          </div>
        </div>

        <div className="space-y-3 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border">
          <h4 className="text-xs font-bold text-neutral-500">Date to Unix Timestamp</h4>
          <label className="flex flex-col gap-1 text-xs">
            <span>Select Local Date/Time</span>
            <input type="datetime-local" value={inputDate} onChange={(e) => setInputDate(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs" />
          </label>
          <div className="flex items-center justify-between p-2.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs font-mono font-bold">
            <span>{outputEpoch} Epoch seconds</span>
            <CopyButton text={outputEpoch.toString()} />
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. JSON to CSV & CSV to JSON Converter
const JsonCsvConverter = () => {
  const [jsonInput, setJsonInput] = useState('[\n  {"id": 1, "name": "Alice", "role": "Admin"},\n  {"id": 2, "name": "Bob", "role": "Designer"}\n]');
  const [csvInput, setCsvInput] = useState('id,name,role\n1,Alice,Admin\n2,Bob,Designer');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleJsonToCsv = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('JSON input must be a non-empty array of objects.');
      }
      const headers = Object.keys(parsed[0]);
      const csvRows = [headers.join(',')];

      parsed.forEach((obj) => {
        const row = headers.map(header => {
          const val = obj[header];
          return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
        });
        csvRows.push(row.join(','));
      });
      setOutput(csvRows.join('\n'));
      setError('');
    } catch (e: any) {
      setOutput('');
      setError('JSON Conversion Error: ' + e.message);
    }
  };

  const handleCsvToJson = () => {
    try {
      const lines = csvInput.trim().split('\n');
      if (lines.length < 2) {
        throw new Error('CSV must contain a header line and at least one data row.');
      }
      const headers = lines[0].split(',');
      const list = [];

      for (let i = 1; i < lines.length; i++) {
        const rowVals = lines[i].split(',');
        const obj: any = {};
        headers.forEach((header, idx) => {
          let val: any = rowVals[idx]?.trim() || '';
          // parse numbers if appropriate
          if (!isNaN(val as any) && val !== '') val = Number(val);
          obj[header.trim()] = val;
        });
        list.push(obj);
      }
      setOutput(JSON.stringify(list, null, 2));
      setError('');
    } catch (e: any) {
      setOutput('');
      setError('CSV Parsing Error: ' + e.message);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-neutral-500">JSON Input Array</span>
            <button onClick={handleJsonToCsv} className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded">
              Convert JSON to CSV →
            </button>
          </div>
          <textarea value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} className="w-full h-36 p-2.5 bg-white dark:bg-neutral-950 border rounded-xl text-xs font-mono" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-neutral-500">CSV Input Spreadsheet</span>
            <button onClick={handleCsvToJson} className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded">
              Convert CSV to JSON →
            </button>
          </div>
          <textarea value={csvInput} onChange={(e) => setCsvInput(e.target.value)} className="w-full h-36 p-2.5 bg-white dark:bg-neutral-950 border rounded-xl text-xs font-mono" />
        </div>
      </div>

      <div className="bg-neutral-50 dark:bg-neutral-900 border rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-neutral-500">CONVERSION RESULT</span>
          {output && <CopyButton text={output} />}
        </div>
        <textarea readOnly value={output} placeholder="Conversion output will render here..." className="w-full h-32 p-2 bg-white dark:bg-neutral-950 border rounded text-xs font-mono focus:outline-none" />
      </div>
    </div>
  );
};

// 4. Markdown to HTML
const MdHtmlConverter = () => {
  const [md, setMd] = useState('## DevBox Platform\n\n- Free utilities\n- Fully browser calculated');
  const [html, setHtml] = useState('');

  const convertMdToHtml = () => {
    let clean = md;
    clean = clean.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    clean = clean.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    clean = clean.replace(/^\- (.*?)$/gm, '<li>$1</li>');
    clean = clean.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    setHtml(clean);
  };

  useEffect(() => {
    convertMdToHtml();
  }, [md]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-neutral-500">Raw Markdown Code</span>
        <textarea value={md} onChange={(e) => setMd(e.target.value)} className="w-full h-44 p-3 bg-white dark:bg-neutral-950 border rounded-xl text-xs font-mono" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-500">HTML Output String</span>
          {html && <CopyButton text={html} />}
        </div>
        <textarea readOnly value={html} className="w-full h-44 p-3 bg-neutral-50 dark:bg-neutral-900/50 border rounded-xl text-xs font-mono focus:outline-none" />
      </div>
    </div>
  );
};

// 5. XML Formatter
const XmlFormatter = () => {
  const [input, setInput] = useState('<note><to>User</to><from>DevBox</from><heading>Alert</heading><body>Local execution complete!</body></note>');
  const [output, setOutput] = useState('');

  const formatXML = (xml: string) => {
    let formatted = '';
    const reg = /(<\/?[^>]+>)/g;
    const parts = xml.replace(reg, '\n$1\n').split('\n');
    let pad = 0;

    parts.forEach((part) => {
      const node = part.trim();
      if (!node) return;

      if (node.match(/^<\/\w/)) {
        // closing tag
        pad--;
      }

      formatted += '  '.repeat(Math.max(0, pad)) + node + '\n';

      if (node.match(/^<\w[^>]*[^\/]>$/) && !node.match(/^<\?|^<!/)) {
        // opening tag (excluding XML declarations or comments)
        pad++;
      }
    });

    return formatted.trim();
  };

  useEffect(() => {
    setOutput(formatXML(input));
  }, [input]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-neutral-500">Raw or Minified XML Input</span>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-44 p-3 bg-white dark:bg-neutral-950 border rounded-xl text-xs font-mono" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-500">Beautified XML Output</span>
          {output && <CopyButton text={output} />}
        </div>
        <textarea readOnly value={output} className="w-full h-44 p-3 bg-neutral-50 dark:bg-neutral-900/50 border rounded-xl text-xs font-mono focus:outline-none" />
      </div>
    </div>
  );
};

export const converterToolsComponents: Record<string, () => React.JSX.Element> = {
  'unit-converter': UnitConverter,
  'timestamp-conv': TimestampConverter,
  'json-csv-conv': JsonCsvConverter,
  'md-html-conv': MdHtmlConverter,
  'xml-formatter': XmlFormatter,
};
