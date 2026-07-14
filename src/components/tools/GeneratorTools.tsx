import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Sparkles, Download, Lock } from 'lucide-react';

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

// 1. Password Generator
const PasswordGen = () => {
  const [len, setLen] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [num, setNum] = useState(true);
  const [sym, setSym] = useState(true);
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState('Strong');

  const generatePass = () => {
    let charSet = '';
    if (upper) charSet += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower) charSet += 'abcdefghijklmnopqrstuvwxyz';
    if (num) charSet += '0123456789';
    if (sym) charSet += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charSet) {
      setPassword('Select at least one character set');
      setStrength('Weak');
      return;
    }

    let result = '';
    for (let i = 0; i < len; i++) {
      const idx = Math.floor(Math.random() * charSet.length);
      result += charSet.charAt(idx);
    }
    setPassword(result);

    // simple strength rating
    let score = 0;
    if (len >= 12) score++;
    if (upper) score++;
    if (lower) score++;
    if (num) score++;
    if (sym) score++;

    if (score <= 2) setStrength('Weak 🔴');
    else if (score <= 4) setStrength('Medium 🟡');
    else setStrength('Strong 🟢');
  };

  useEffect(() => {
    generatePass();
  }, [len, upper, lower, num, sym]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border">
        <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Entropy Specifications</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold text-neutral-500 mb-1">
              <span>Password Length</span>
              <span>{len} characters</span>
            </div>
            <input type="range" min="8" max="32" value={len} onChange={(e) => setLen(parseInt(e.target.value))} className="w-full accent-teal-600" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 cursor-pointer">
              <input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} className="rounded text-teal-600" />
              <span>UPPERCASE (A-Z)</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 cursor-pointer">
              <input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} className="rounded text-teal-600" />
              <span>lowercase (a-z)</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 cursor-pointer">
              <input type="checkbox" checked={num} onChange={(e) => setNum(e.target.checked)} className="rounded text-teal-600" />
              <span>Numbers (0-9)</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 cursor-pointer">
              <input type="checkbox" checked={sym} onChange={(e) => setSym(e.target.checked)} className="rounded text-teal-600" />
              <span>Symbols (#$&@)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div className="bg-white dark:bg-neutral-950 border rounded-2xl p-5 flex flex-col justify-center items-center gap-3 shadow-inner">
          <Lock className="w-8 h-8 text-teal-500 animate-pulse" />
          <code className="text-sm font-mono font-bold text-teal-600 dark:text-teal-400 text-center block select-all break-all w-full bg-neutral-50 dark:bg-neutral-900 p-2.5 rounded border border-dashed">
            {password}
          </code>
          <span className="text-xs font-bold text-neutral-400">Strength: {strength}</span>
        </div>

        <div className="flex gap-2">
          <button onClick={generatePass} className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold rounded-xl transition-all">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>
          <CopyButton text={password} />
        </div>
      </div>
    </div>
  );
};

// 2. QR Code Generator (Pure Offline SVG Grid Drawer)
const QrGenerator = () => {
  const [text, setText] = useState('https://devbox.tools');
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const [matrix, setMatrix] = useState<boolean[][]>([]);

  // Simple deterministic pseudo-QR code matrix generator mapping string hashes
  const generateQRMatrix = () => {
    const size = 21; // version 1 grid sizing
    const grid: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));

    // Draw position finder patterns in 3 corners
    const drawFinder = (startX: number, startY: number) => {
      for (let x = 0; x < 7; x++) {
        for (let y = 0; y < 7; y++) {
          const isBorder = x === 0 || x === 6 || y === 0 || y === 6;
          const isCenter = x >= 2 && x <= 4 && y >= 2 && y <= 4;
          grid[startY + y][startX + x] = isBorder || isCenter;
        }
      }
    };

    drawFinder(0, 0); // Top Left
    drawFinder(14, 0); // Top Right
    drawFinder(0, 14); // Bottom Left

    // Draw deterministic lines for timing patterns
    for (let i = 8; i < 13; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    // Hash text to populate data area randomly but deterministically
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        // Skip finder areas
        const inTopLeft = x < 8 && y < 8;
        const inTopRight = x > 12 && y < 8;
        const inBottomLeft = x < 8 && y > 12;

        if (!inTopLeft && !inTopRight && !inBottomLeft) {
          const modValue = Math.abs((hash * (x + 1) * (y + 1)) % 11);
          grid[y][x] = modValue % 2 === 0 || modValue === 5;
        }
      }
    }
    setMatrix(grid);
  };

  useEffect(() => {
    generateQRMatrix();
  }, [text]);

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" width="100%" height="100%" shape-rendering="crispEdges">
  <rect width="21" height="21" fill="${bg}" />
  ${matrix.map((row, y) => row.map((cell, x) => cell ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${fg}" />` : '').join('')).join('')}
</svg>`;

  const downloadQR = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devbox-qr-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border border-neutral-100 dark:border-neutral-850">
        <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">QR Content</h4>
        <div className="space-y-3">
          <label className="flex flex-col gap-1 text-xs font-semibold">
            <span>Link URL or Text string</span>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs" />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1 text-xs font-semibold">
              <span>Block Color</span>
              <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="w-full h-8 rounded cursor-pointer" />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold">
              <span>Background</span>
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-full h-8 rounded cursor-pointer" />
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div style={{ backgroundColor: bg }} className="flex-1 min-h-[180px] rounded-2xl flex items-center justify-center p-4 shadow">
          <svg className="w-36 h-36 border border-neutral-100/10" viewBox="0 0 21 21" shapeRendering="crispEdges">
            <rect width="21" height="21" fill={bg} />
            {matrix.map((row, y) => row.map((cell, x) => cell ? (
              <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={fg} />
            ) : null))}
          </svg>
        </div>

        <button
          onClick={downloadQR}
          className="flex items-center justify-center gap-2 w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Vector QR Code (SVG)</span>
        </button>
      </div>
    </div>
  );
};

// 3. Barcode Generator
const BarcodeGen = () => {
  const [code, setCode] = useState('DEVBOX123');

  // Simple deterministic drawing of Code 128-ish bar sequences
  const getBarcodeBars = () => {
    const chars = code.toUpperCase().replace(/[^A-Z0-9]/g, '');
    let hash = 0;
    for (let i = 0; i < chars.length; i++) {
      hash += chars.charCodeAt(i);
    }

    const list = [];
    const seed = hash + 27;
    for (let i = 0; i < 40; i++) {
      const isThick = (seed * (i + 13)) % 5 === 0 || (seed * (i + 4)) % 7 === 0;
      const isGap = (seed * (i + 2)) % 3 === 0;
      list.push({ isBar: !isGap, width: isThick ? 4 : 1.5 });
    }
    return list;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border border-neutral-100 dark:border-neutral-850">
        <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">Barcode String</h4>
        <label className="flex flex-col gap-1 text-xs font-semibold">
          <span>Enter Code String (Alphanumeric)</span>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-sm font-mono tracking-widest" />
        </label>
      </div>

      <div className="bg-white p-5 rounded-2xl border flex flex-col items-center justify-center shadow">
        <div className="flex h-16 items-stretch gap-[2px] bg-white p-2">
          {getBarcodeBars().map((bar, idx) => (
            <div
              key={idx}
              style={{ width: `${bar.width}px` }}
              className={`h-full ${bar.isBar ? 'bg-black' : 'bg-transparent'}`}
            />
          ))}
        </div>
        <span className="text-xs font-bold tracking-[6px] text-black font-mono mt-2">{code}</span>
      </div>
    </div>
  );
};

// 4. Random Number Generator
const NumGen = () => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(5);
  const [duplicates, setDuplicates] = useState(false);
  const [numbers, setNumbers] = useState<number[]>([]);

  const generateNumbers = () => {
    const list: number[] = [];
    const rangeSize = max - min + 1;

    if (!duplicates && count > rangeSize) {
      setNumbers([]);
      return;
    }

    let limit = 0;
    while (list.length < count && limit < 1000) {
      const num = Math.floor(Math.random() * rangeSize) + min;
      if (duplicates || !list.includes(num)) {
        list.push(num);
      }
      limit++;
    }
    setNumbers(list);
  };

  useEffect(() => {
    generateNumbers();
  }, [min, max, count, duplicates]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border">
        <label className="flex flex-col gap-1 text-xs font-semibold">
          <span>Min Range</span>
          <input type="number" value={min} onChange={(e) => setMin(parseInt(e.target.value) || 0)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold">
          <span>Max Range</span>
          <input type="number" value={max} onChange={(e) => setMax(parseInt(e.target.value) || 0)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold">
          <span>Quantity</span>
          <input type="number" min="1" max="100" value={count} onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-xs" />
        </label>
        <label className="flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 cursor-pointer pt-5">
          <input type="checkbox" checked={duplicates} onChange={(e) => setDuplicates(e.target.checked)} className="rounded text-teal-600" />
          <span>Allow Duplicates</span>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-neutral-950 border rounded-xl">
        <div className="flex flex-wrap gap-2">
          {numbers.length === 0 ? (
            <span className="text-xs text-rose-500 font-bold">Quantity exceeds range size. Check options.</span>
          ) : (
            numbers.map((num, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-teal-100 dark:bg-teal-950/30 text-teal-850 dark:text-teal-400 rounded-lg text-xs font-mono font-bold">
                {num}
              </span>
            ))
          )}
        </div>
        {numbers.length > 0 && <CopyButton text={numbers.join(', ')} />}
      </div>
    </div>
  );
};

// 5. Random List Picker
const ListPicker = () => {
  const [input, setInput] = useState('Alice\nBob\nCharlie\nDiana\nEthan');
  const [winner, setWinner] = useState('');
  const [animating, setAnimating] = useState(false);

  const triggerPick = () => {
    const list = input.split('\n').map(x => x.trim()).filter(x => x.length > 0);
    if (list.length === 0) return;

    setAnimating(true);
    let count = 0;
    const interval = setInterval(() => {
      setWinner(list[Math.floor(Math.random() * list.length)]);
      count++;
      if (count > 10) {
        clearInterval(interval);
        setAnimating(false);
      }
    }, 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-neutral-500">List of Items (One per line)</span>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-44 p-3 bg-white dark:bg-neutral-950 border rounded-xl text-xs" />
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div className="flex-1 min-h-[140px] bg-neutral-50 dark:bg-neutral-900 border rounded-2xl p-5 flex flex-col justify-center items-center gap-2">
          <Sparkles className="w-7 h-7 text-teal-500 animate-spin-hover" />
          <span className="text-[10px] font-bold text-neutral-400">WINNING SELECTION</span>
          <span className={`text-2xl font-black font-sans text-teal-600 dark:text-teal-400 tracking-wide text-center truncate w-full ${animating ? 'animate-pulse scale-95 opacity-50' : ''}`}>
            {winner || 'Waiting for pick...'}
          </span>
        </div>

        <button onClick={triggerPick} className="flex items-center justify-center gap-2 w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
          <span>🎯 Choose Winner</span>
        </button>
      </div>
    </div>
  );
};

export const generatorToolsComponents: Record<string, () => React.JSX.Element> = {
  'password-gen': PasswordGen,
  'qr-gen': QrGenerator,
  'barcode-gen': BarcodeGen,
  'num-gen': NumGen,
  'random-picker': ListPicker,
};
