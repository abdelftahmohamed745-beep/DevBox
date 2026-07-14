import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Sparkles, RefreshCw, Undo, Trash, Download } from 'lucide-react';

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
      className="flex items-center gap-1 px-2 py-1 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded text-xs font-semibold transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
};

// 1. CSS Box Shadow Generator
const BoxShadowGen = () => {
  const [hOffset, setHOffset] = useState(10);
  const [vOffset, setVOffset] = useState(10);
  const [blur, setBlur] = useState(20);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState('#64748b');
  const [opacity, setOpacity] = useState(40);
  const [inset, setInset] = useState(false);

  const hexToRgba = (hex: string, op: number) => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${op / 100})`;
  };

  const shadowCss = `${inset ? 'inset ' : ''}${hOffset}px ${vOffset}px ${blur}px ${spread}px ${hexToRgba(color, opacity)}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800">
        <h4 className="text-sm font-bold mb-2 text-neutral-800 dark:text-neutral-200">Shadow Adjustments</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-medium text-neutral-500 mb-1">
              <span>Horizontal Offset</span>
              <span>{hOffset}px</span>
            </div>
            <input type="range" min="-50" max="50" value={hOffset} onChange={(e) => setHOffset(parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-neutral-500 mb-1">
              <span>Vertical Offset</span>
              <span>{vOffset}px</span>
            </div>
            <input type="range" min="-50" max="50" value={vOffset} onChange={(e) => setVOffset(parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-neutral-500 mb-1">
              <span>Blur Radius</span>
              <span>{blur}px</span>
            </div>
            <input type="range" min="0" max="100" value={blur} onChange={(e) => setBlur(parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-neutral-500 mb-1">
              <span>Spread Radius</span>
              <span>{spread}px</span>
            </div>
            <input type="range" min="-20" max="50" value={spread} onChange={(e) => setSpread(parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-neutral-500 mb-1">
              <span>Shadow Color</span>
              <span>{color}</span>
            </div>
            <div className="flex gap-2">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-8 rounded border border-neutral-300 dark:border-neutral-700 cursor-pointer" />
              <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="px-3 py-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded text-xs font-mono w-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-neutral-500 mb-1">
              <span>Shadow Opacity</span>
              <span>{opacity}%</span>
            </div>
            <input type="range" min="0" max="100" value={opacity} onChange={(e) => setOpacity(parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 cursor-pointer pt-2">
            <input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
            <span>Inset Shadow (Internal)</span>
          </label>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div className="flex-1 min-h-[220px] bg-neutral-100 dark:bg-neutral-950 rounded-2xl flex items-center justify-center p-8 relative overflow-hidden">
          {/* Back grid for contrast */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
          <div
            style={{ boxShadow: shadowCss }}
            className="w-32 h-32 bg-white dark:bg-neutral-800 rounded-xl relative z-10 transition-shadow duration-75 border border-neutral-200/20"
          ></div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-500">CSS Code Output</span>
            <CopyButton text={`box-shadow: ${shadowCss};`} />
          </div>
          <code className="block text-xs font-mono text-indigo-600 dark:text-indigo-400 break-all select-all bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded border border-neutral-100 dark:border-neutral-850">
            box-shadow: {shadowCss};
          </code>
        </div>
      </div>
    </div>
  );
};

// 2. CSS Border Radius Generator
const BorderRadiusGen = () => {
  const [tl, setTl] = useState(25);
  const [tr, setTr] = useState(25);
  const [br, setBr] = useState(25);
  const [bl, setBl] = useState(25);
  const [organic, setOrganic] = useState(false);

  // Computed values
  const cssRadius = organic
    ? `${tl}% ${100 - tl}% ${br}% ${100 - br}% / ${bl}% ${tr}% ${100 - tr}% ${100 - bl}%`
    : `${tl}px ${tr}px ${br}px ${bl}px`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Radius Controllers</h4>
          <label className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer">
            <input type="checkbox" checked={organic} onChange={(e) => {
              setOrganic(e.target.checked);
              // convert pixels vs percentages nicely
              if (e.target.checked) {
                setTl(40); setTr(60); setBr(35); setBl(50);
              } else {
                setTl(24); setTr(24); setBr(24); setBl(24);
              }
            }} className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5" />
            <span>Organic / 8-point</span>
          </label>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-medium text-neutral-500 mb-1">
              <span>Top Left {organic ? 'Width' : 'Radius'}</span>
              <span>{tl}{organic ? '%' : 'px'}</span>
            </div>
            <input type="range" min="0" max={organic ? 100 : 150} value={tl} onChange={(e) => setTl(parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-neutral-500 mb-1">
              <span>Top Right {organic ? 'Height' : 'Radius'}</span>
              <span>{tr}{organic ? '%' : 'px'}</span>
            </div>
            <input type="range" min="0" max={organic ? 100 : 150} value={tr} onChange={(e) => setTr(parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-neutral-500 mb-1">
              <span>Bottom Right {organic ? 'Width' : 'Radius'}</span>
              <span>{br}{organic ? '%' : 'px'}</span>
            </div>
            <input type="range" min="0" max={organic ? 100 : 150} value={br} onChange={(e) => setBr(parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-neutral-500 mb-1">
              <span>Bottom Left {organic ? 'Height' : 'Radius'}</span>
              <span>{bl}{organic ? '%' : 'px'}</span>
            </div>
            <input type="range" min="0" max={organic ? 100 : 150} value={bl} onChange={(e) => setBl(parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div className="flex-1 min-h-[220px] bg-neutral-100 dark:bg-neutral-950 rounded-2xl flex items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
          <div
            style={{ borderRadius: cssRadius }}
            className="w-36 h-36 bg-gradient-to-tr from-indigo-500 to-violet-600 relative z-10 shadow-lg border border-white/10"
          ></div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-500">CSS Code</span>
            <CopyButton text={`border-radius: ${cssRadius};`} />
          </div>
          <code className="block text-xs font-mono text-indigo-600 dark:text-indigo-400 break-all select-all bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded border border-neutral-100 dark:border-neutral-850">
            border-radius: {cssRadius};
          </code>
        </div>
      </div>
    </div>
  );
};

// 3. CSS Glassmorphism Generator
const GlassmorphismGen = () => {
  const [blur, setBlur] = useState(12);
  const [opacity, setOpacity] = useState(25);
  const [color, setColor] = useState('#ffffff');
  const [borderOp, setBorderOp] = useState(20);

  const rgb = {
    r: parseInt(color.slice(1, 3), 16) || 255,
    g: parseInt(color.slice(3, 5), 16) || 255,
    b: parseInt(color.slice(5, 7), 16) || 255,
  };

  const bgRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity / 100})`;
  const borderRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${borderOp / 100})`;

  const glassStyle = {
    background: bgRgba,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: `1px solid ${borderRgba}`,
  };

  const cssString = `background: ${bgRgba};
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: 1px solid ${borderRgba};
border-radius: 16px;`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800">
        <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">Glass Attributes</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-medium text-neutral-500 mb-1">
              <span>Backdrop Blur</span>
              <span>{blur}px</span>
            </div>
            <input type="range" min="0" max="40" value={blur} onChange={(e) => setBlur(parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-neutral-500 mb-1">
              <span>Background Opacity</span>
              <span>{opacity}%</span>
            </div>
            <input type="range" min="0" max="100" value={opacity} onChange={(e) => setOpacity(parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-neutral-500 mb-1">
              <span>Glass Color</span>
              <span>{color}</span>
            </div>
            <div className="flex gap-2">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-8 rounded border border-neutral-300 dark:border-neutral-700 cursor-pointer" />
              <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="px-3 py-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded text-xs font-mono w-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-neutral-500 mb-1">
              <span>Border Opacity</span>
              <span>{borderOp}%</span>
            </div>
            <input type="range" min="0" max="100" value={borderOp} onChange={(e) => setBorderOp(parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div className="flex-1 min-h-[220px] rounded-2xl flex items-center justify-center p-8 relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)' }}>
          {/* Animated elements floating inside target container for dynamic glass effect */}
          <div className="absolute w-24 h-24 rounded-full bg-yellow-300 left-8 top-6 blur-md opacity-70 animate-pulse"></div>
          <div className="absolute w-20 h-20 rounded-full bg-emerald-300 right-10 bottom-6 blur-md opacity-60"></div>
          <div
            style={glassStyle}
            className="w-full max-w-xs p-6 rounded-2xl relative z-10 text-white shadow-xl"
          >
            <div className="w-8 h-8 rounded bg-white/20 mb-4"></div>
            <h5 className="font-bold text-sm">Glassmorphism Card</h5>
            <p className="text-xs text-white/80 mt-1">Stunning glass rendering effects inside the browser.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-500">CSS Styles</span>
            <CopyButton text={cssString} />
          </div>
          <pre className="block text-xs font-mono text-indigo-600 dark:text-indigo-400 select-all bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded border border-neutral-100 dark:border-neutral-850 overflow-x-auto whitespace-pre">
            {cssString}
          </pre>
        </div>
      </div>
    </div>
  );
};

// 4. CSS Neumorphism Generator
const NeumorphismGen = () => {
  const [size, setSize] = useState(150);
  const [radius, setRadius] = useState(30);
  const [distance, setDistance] = useState(12);
  const [intensity, setIntensity] = useState(15);
  const [blur, setBlur] = useState(24);
  const [color, setColor] = useState('#e0e0e0');
  const [shape, setShape] = useState<'flat' | 'pressed'>('flat');

  const hexColor = color;
  const rgb = {
    r: parseInt(hexColor.slice(1, 3), 16) || 224,
    g: parseInt(hexColor.slice(3, 5), 16) || 224,
    b: parseInt(hexColor.slice(5, 7), 16) || 224,
  };

  const getShade = (r: number, g: number, b: number, factor: number) => {
    return {
      r: Math.max(0, Math.min(255, Math.round(r * factor))),
      g: Math.max(0, Math.min(255, Math.round(g * factor))),
      b: Math.max(0, Math.min(255, Math.round(b * factor))),
    };
  };

  const dark = getShade(rgb.r, rgb.g, rgb.b, 1 - intensity / 100);
  const light = getShade(rgb.r, rgb.g, rgb.b, 1 + intensity / 100);

  const shadowLight = `rgba(${light.r}, ${light.g}, ${light.b}, 1)`;
  const shadowDark = `rgba(${dark.r}, ${dark.g}, ${dark.b}, 1)`;

  const boxStyles = shape === 'pressed'
    ? {
        background: color,
        borderRadius: `${radius}px`,
        boxShadow: `inset ${distance}px ${distance}px ${blur}px ${shadowDark}, inset -${distance}px -${distance}px ${blur}px ${shadowLight}`,
      }
    : {
        background: color,
        borderRadius: `${radius}px`,
        boxShadow: `${distance}px ${distance}px ${blur}px ${shadowDark}, -${distance}px -${distance}px ${blur}px ${shadowLight}`,
      };

  const cssShadow = shape === 'pressed'
    ? `box-shadow: inset ${distance}px ${distance}px ${blur}px ${shadowDark}, \n            inset -${distance}px -${distance}px ${blur}px ${shadowLight};`
    : `box-shadow: ${distance}px ${distance}px ${blur}px ${shadowDark}, \n            -${distance}px -${distance}px ${blur}px ${shadowLight};`;

  const cssString = `border-radius: ${radius}px;
background: ${color};
${cssShadow}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800">
        <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">Soft-UI Dimensions</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-medium text-neutral-500 mb-1">
              <span>Soft-UI Base Color</span>
              <span>{color}</span>
            </div>
            <div className="flex gap-2">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-8 rounded border border-neutral-300 dark:border-neutral-700 cursor-pointer" />
              <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="px-3 py-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded text-xs font-mono w-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-neutral-500 mb-1">
              <span>Shadow Distance</span>
              <span>{distance}px</span>
            </div>
            <input type="range" min="1" max="30" value={distance} onChange={(e) => {
              setDistance(parseInt(e.target.value));
              setBlur(parseInt(e.target.value) * 2);
            }} className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-neutral-500 mb-1">
              <span>Blur Radius</span>
              <span>{blur}px</span>
            </div>
            <input type="range" min="1" max="60" value={blur} onChange={(e) => setBlur(parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-neutral-500 mb-1">
              <span>Border Radius</span>
              <span>{radius}px</span>
            </div>
            <input type="range" min="0" max="60" value={radius} onChange={(e) => setRadius(parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-neutral-500 mb-1">
              <span>Color Intensity</span>
              <span>{intensity}%</span>
            </div>
            <input type="range" min="5" max="30" value={intensity} onChange={(e) => setIntensity(parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setShape('flat')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                shape === 'flat'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800'
              }`}
            >
              Flat Outset
            </button>
            <button
              onClick={() => setShape('pressed')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                shape === 'pressed'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800'
              }`}
            >
              Pressed Inset
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div style={{ backgroundColor: color }} className="flex-1 min-h-[220px] rounded-2xl flex items-center justify-center p-8 transition-colors">
          <div
            style={boxStyles}
            className="w-32 h-32 transition-all duration-100 flex items-center justify-center"
          >
            <span className="text-[10px] font-bold text-neutral-400 select-none">NEUMORPHIC</span>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-500">CSS Style Block</span>
            <CopyButton text={cssString} />
          </div>
          <pre className="block text-xs font-mono text-indigo-600 dark:text-indigo-400 select-all bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded border border-neutral-100 dark:border-neutral-850 overflow-x-auto whitespace-pre">
            {cssString}
          </pre>
        </div>
      </div>
    </div>
  );
};

// 5. CSS Button Generator
const ButtonGen = () => {
  const [text, setText] = useState('Explore Tools');
  const [fontSize, setFontSize] = useState(14);
  const [py, setPy] = useState(10);
  const [px, setPx] = useState(24);
  const [bg, setBg] = useState('#4f46e5');
  const [textColor, setTextColor] = useState('#ffffff');
  const [radius, setRadius] = useState(10);
  const [borderW, setBorderW] = useState(0);
  const [borderCol, setBorderCol] = useState('#ffffff');
  const [shadowBlur, setShadowBlur] = useState(0);

  const btnStyle = {
    fontSize: `${fontSize}px`,
    padding: `${py}px ${px}px`,
    backgroundColor: bg,
    color: textColor,
    borderRadius: `${radius}px`,
    border: borderW > 0 ? `${borderW}px solid ${borderCol}` : 'none',
    boxShadow: shadowBlur > 0 ? `0 4px 12px ${bg}40` : 'none',
  };

  const cssString = `.custom-button {
  font-size: ${fontSize}px;
  padding: ${py}px ${px}px;
  background-color: ${bg};
  color: ${textColor};
  border-radius: ${radius}px;
  ${borderW > 0 ? `border: ${borderW}px solid ${borderCol};` : ''}
  ${shadowBlur > 0 ? `box-shadow: 0 4px 12px ${bg}40;` : ''}
  transition: all 0.2s ease;
}
.custom-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800 max-h-[480px] overflow-y-auto">
        <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">Button Typography & Style</h4>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-neutral-500 block mb-1">Button Text</label>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full px-3 py-1.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] font-bold text-neutral-500 mb-1 block">V-Padding ({py}px)</span>
              <input type="range" min="4" max="24" value={py} onChange={(e) => setPy(parseInt(e.target.value))} className="w-full" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-neutral-500 mb-1 block">H-Padding ({px}px)</span>
              <input type="range" min="8" max="48" value={px} onChange={(e) => setPx(parseInt(e.target.value))} className="w-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] font-bold text-neutral-500 mb-1 block">Font Size ({fontSize}px)</span>
              <input type="range" min="10" max="24" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-neutral-500 mb-1 block">Radius ({radius}px)</span>
              <input type="range" min="0" max="40" value={radius} onChange={(e) => setRadius(parseInt(e.target.value))} className="w-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] font-bold text-neutral-500 mb-1 block">Background Color</span>
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-full h-8 cursor-pointer rounded" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-neutral-500 mb-1 block">Text Color</span>
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-8 cursor-pointer rounded" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] font-bold text-neutral-500 mb-1 block">Border Width ({borderW}px)</span>
              <input type="range" min="0" max="5" value={borderW} onChange={(e) => setBorderW(parseInt(e.target.value))} className="w-full" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-neutral-500 mb-1 block">Border Color</span>
              <input type="color" value={borderCol} onChange={(e) => setBorderCol(e.target.value)} className="w-full h-8 cursor-pointer rounded" />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 cursor-pointer">
            <input type="checkbox" checked={shadowBlur > 0} onChange={(e) => setShadowBlur(e.target.checked ? 12 : 0)} className="rounded text-indigo-600" />
            <span>Apply Soft Shadow Accents</span>
          </label>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div className="flex-1 min-h-[220px] bg-neutral-100 dark:bg-neutral-950 rounded-2xl flex items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
          <button style={btnStyle} className="relative z-10 font-semibold shadow-sm hover:opacity-90 active:scale-95 transition-all">
            {text}
          </button>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-500">CSS Output Code</span>
            <CopyButton text={cssString} />
          </div>
          <pre className="block text-xs font-mono text-indigo-600 dark:text-indigo-400 select-all bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded border border-neutral-100 dark:border-neutral-850 overflow-x-auto whitespace-pre max-h-40 overflow-y-auto">
            {cssString}
          </pre>
        </div>
      </div>
    </div>
  );
};

// 6. SVG Blob Generator
const SvgBlobGen = () => {
  const [growth, setGrowth] = useState(6);
  const [edges, setEdges] = useState(5);
  const [color, setColor] = useState('#6366f1');
  const [blobPath, setBlobPath] = useState('');

  const generateBlobPath = () => {
    // Generate organic 360deg points mapping radius multipliers
    const center = 150;
    const size = 120;
    const slice = (Math.PI * 2) / edges;
    const points = [];

    for (let i = 0; i < edges; i++) {
      const angle = slice * i;
      // random amplitude
      const r = size + (Math.random() - 0.5) * growth * 10;
      const x = center + Math.cos(angle) * r;
      const y = center + Math.sin(angle) * r;
      points.push({ x, y });
    }

    // Connect via cubic bezier paths
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < edges; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % edges];
      const p3 = points[(i + 2) % edges];

      // control points
      const cp1x = p1.x + (p2.x - points[(i - 1 + edges) % edges].x) * 0.15;
      const cp1y = p1.y + (p2.y - points[(i - 1 + edges) % edges].y) * 0.15;
      const cp2x = p2.x - (p3.x - p1.x) * 0.15;
      const cp2y = p2.y - (p3.y - p1.y) * 0.15;

      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    path += ' Z';
    setBlobPath(path);
  };

  useEffect(() => {
    generateBlobPath();
  }, [growth, edges]);

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%">
  <path fill="${color}" d="${blobPath}" />
</svg>`;

  const downloadBlob = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devbox-blob-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Blob Vector Styles</h4>
          <button onClick={generateBlobPath} className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" />
            <span>Randomize Shape</span>
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-medium text-neutral-500 mb-1">
              <span>Blob Complexity / Edges</span>
              <span>{edges} Points</span>
            </div>
            <input type="range" min="3" max="10" value={edges} onChange={(e) => setEdges(parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-neutral-500 mb-1">
              <span>Organic growth / variance</span>
              <span>{growth} Scale</span>
            </div>
            <input type="range" min="1" max="9" value={growth} onChange={(e) => setGrowth(parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>

          <div>
            <span className="text-xs font-bold text-neutral-500 block mb-1">Vector Color Accent</span>
            <div className="flex gap-2">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-8 rounded border border-neutral-300 dark:border-neutral-700 cursor-pointer animate-pulse" />
              <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="px-3 py-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded text-xs font-mono w-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div className="flex-1 min-h-[220px] bg-neutral-100 dark:bg-neutral-950 rounded-2xl flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
          <svg className="w-48 h-48 drop-shadow-md z-10" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
            <path fill={color} d={blobPath} className="transition-all duration-300 ease-in-out" />
          </svg>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500">SVG Output Markup</span>
            <div className="flex gap-2">
              <CopyButton text={svgContent} />
              <button
                onClick={downloadBlob}
                className="flex items-center gap-1 px-2.5 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded text-xs font-bold transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>SVG</span>
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={svgContent}
            className="w-full h-16 p-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-800 rounded text-[10px] font-mono focus:outline-none select-all text-neutral-600"
          />
        </div>
      </div>
    </div>
  );
};

// 7. Canvas Painting Board
const CanvasScratch = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#4f46e5');
  const [brushSize, setBrushSize] = useState(5);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // responsive scale support
    canvas.width = canvas.parentElement?.clientWidth || 400;
    canvas.height = 250;

    const context = canvas.getContext('2d');
    if (!context) return;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    contextRef.current = context;

    // Fill background with white to avoid transparent pixel conversion errors in PNGs
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = brushSize;
    }
  }, [color, brushSize]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (canvas && ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `devbox-canvas-paint-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-1.5 text-xs font-semibold">
            <span>Color</span>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer border-none bg-transparent" />
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold">
            <span>Size ({brushSize}px)</span>
            <input type="range" min="1" max="25" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-24 h-1 bg-neutral-200 rounded" />
          </label>
        </div>

        <div className="flex gap-2">
          <button onClick={clearCanvas} className="flex items-center gap-1 px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold rounded-lg transition-all">
            <Trash className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
          <button onClick={downloadCanvas} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all">
            <Download className="w-3.5 h-3.5" />
            <span>Export PNG</span>
          </button>
        </div>
      </div>

      <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white shadow-inner relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full cursor-crosshair touch-none"
        />
      </div>
    </div>
  );
};

// 8. CSS Gradient Generator
const CssGradientGen = () => {
  const [stop1, setStop1] = useState('#4f46e5');
  const [stop2, setStop2] = useState('#ec4899');
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<'linear' | 'radial'>('linear');

  const cssGradient = type === 'linear'
    ? `linear-gradient(${angle}deg, ${stop1} 0%, ${stop2} 100%)`
    : `radial-gradient(circle, ${stop1} 0%, ${stop2} 100%)`;

  const cssString = `background: ${stop1};
background: ${cssGradient};`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800">
        <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">Gradient Controller</h4>
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setType('linear')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                type === 'linear'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800'
              }`}
            >
              Linear Gradient
            </button>
            <button
              onClick={() => setType('radial')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                type === 'radial'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800'
              }`}
            >
              Radial Gradient
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] font-bold text-neutral-500 mb-1 block">Color Stop 1</span>
              <div className="flex gap-2">
                <input type="color" value={stop1} onChange={(e) => setStop1(e.target.value)} className="w-10 h-8 rounded cursor-pointer" />
                <input type="text" value={stop1} onChange={(e) => setStop1(e.target.value)} className="px-2 py-1 bg-white dark:bg-neutral-950 border text-xs font-mono w-full rounded" />
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-neutral-500 mb-1 block">Color Stop 2</span>
              <div className="flex gap-2">
                <input type="color" value={stop2} onChange={(e) => setStop2(e.target.value)} className="w-10 h-8 rounded cursor-pointer" />
                <input type="text" value={stop2} onChange={(e) => setStop2(e.target.value)} className="px-2 py-1 bg-white dark:bg-neutral-950 border text-xs font-mono w-full rounded" />
              </div>
            </div>
          </div>

          {type === 'linear' && (
            <div>
              <div className="flex justify-between text-xs font-medium text-neutral-500 mb-1">
                <span>Gradient Angle</span>
                <span>{angle}°</span>
              </div>
              <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div style={{ backgroundImage: cssGradient }} className="flex-1 min-h-[200px] rounded-2xl flex items-center justify-center p-8 relative shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] opacity-10 [background-size:16px_16px]"></div>
          <span className="text-xs font-bold text-white bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm select-none">
            GRADIENT PREVIEW
          </span>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-500">CSS Styles</span>
            <CopyButton text={cssString} />
          </div>
          <pre className="block text-xs font-mono text-indigo-600 dark:text-indigo-400 select-all bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded border border-neutral-100 dark:border-neutral-850 overflow-x-auto whitespace-pre">
            {cssString}
          </pre>
        </div>
      </div>
    </div>
  );
};

export const designToolsComponents: Record<string, () => React.JSX.Element> = {
  'box-shadow-gen': BoxShadowGen,
  'border-radius-gen': BorderRadiusGen,
  'glassmorphism-gen': GlassmorphismGen,
  'neumorphism-gen': NeumorphismGen,
  'button-gen': ButtonGen,
  'svg-blob-gen': SvgBlobGen,
  'canvas-scratch': CanvasScratch,
  'css-gradient-gen': CssGradientGen,
};
