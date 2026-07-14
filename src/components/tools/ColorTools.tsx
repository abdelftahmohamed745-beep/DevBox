import React, { useState, useEffect } from 'react';
import { Copy, Check, Sparkles, RefreshCw, Eye, Sun, Droplet } from 'lucide-react';

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

// Helpers for color operations
const hexToRgbObj = (hex: string) => {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16) || 0,
    g: parseInt(clean.slice(2, 4), 16) || 0,
    b: parseInt(clean.slice(4, 6), 16) || 0,
  };
};

const rgbToHex = (r: number, g: number, b: number) => {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return '#' + [clamp(r), clamp(g), clamp(b)].map(x => x.toString(16).padStart(2, '0')).join('');
};

// 1. Color Palette Generator
const ColorPaletteGen = () => {
  const [baseColor, setBaseColor] = useState('#6366f1');
  const [rule, setRule] = useState<'mono' | 'analogous' | 'triadic' | 'tetradic'>('triadic');
  const [palette, setPalette] = useState<string[]>([]);

  const generatePalette = () => {
    const rgb = hexToRgbObj(baseColor);
    // Convert to HSL for easy harmony math
    let r = rgb.r / 255;
    let g = rgb.g / 255;
    let b = rgb.b / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    const hslToHex = (hVal: number, sVal: number, lVal: number) => {
      hVal = (hVal + 360) % 360;
      sVal /= 100;
      lVal /= 100;
      const c = (1 - Math.abs(2 * lVal - 1)) * sVal;
      const x = c * (1 - Math.abs((hVal / 60) % 2 - 1));
      const m = lVal - c / 2;
      let r1 = 0, g1 = 0, b1 = 0;

      if (hVal >= 0 && hVal < 60) { r1 = c; g1 = x; }
      else if (hVal >= 60 && hVal < 120) { r1 = x; g1 = c; }
      else if (hVal >= 120 && hVal < 180) { g1 = c; b1 = x; }
      else if (hVal >= 180 && hVal < 240) { g1 = x; b1 = c; }
      else if (hVal >= 240 && hVal < 300) { r1 = x; b1 = c; }
      else if (hVal >= 300 && hVal < 360) { r1 = c; b1 = x; }

      return rgbToHex((r1 + m) * 255, (g1 + m) * 255, (b1 + m) * 255);
    };

    const colors: string[] = [];
    if (rule === 'mono') {
      colors.push(hslToHex(h, s, Math.max(10, l - 30)));
      colors.push(hslToHex(h, s, Math.max(15, l - 15)));
      colors.push(baseColor);
      colors.push(hslToHex(h, Math.max(10, s - 20), Math.min(90, l + 15)));
      colors.push(hslToHex(h, Math.max(5, s - 40), Math.min(95, l + 30)));
    } else if (rule === 'analogous') {
      colors.push(hslToHex(h - 30, s, l));
      colors.push(hslToHex(h - 15, s, l));
      colors.push(baseColor);
      colors.push(hslToHex(h + 15, s, l));
      colors.push(hslToHex(h + 30, s, l));
    } else if (rule === 'triadic') {
      colors.push(hslToHex(h, s, l - 15));
      colors.push(hslToHex(h - 120, s, l));
      colors.push(baseColor);
      colors.push(hslToHex(h + 120, s, l));
      colors.push(hslToHex(h, s, l + 15));
    } else {
      colors.push(hslToHex(h, s, l));
      colors.push(hslToHex(h + 90, s, l));
      colors.push(hslToHex(h + 180, s, l));
      colors.push(hslToHex(h + 270, s, l));
      colors.push(hslToHex(h, s, l - 20));
    }
    setPalette(colors);
  };

  useEffect(() => {
    generatePalette();
  }, [baseColor, rule]);

  const randomizeBaseColor = () => {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setBaseColor(randomHex);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex flex-col gap-1 text-xs font-semibold">
            <span>Base Hex</span>
            <div className="flex gap-1.5">
              <input type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="w-8 h-8 rounded border cursor-pointer bg-transparent" />
              <input type="text" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="px-3 py-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-mono w-24" />
            </div>
          </label>

          <label className="flex flex-col gap-1 text-xs font-semibold">
            <span>Harmony Rule</span>
            <select value={rule} onChange={(e) => setRule(e.target.value as any)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-bold">
              <option value="triadic">Triadic (3 Corners)</option>
              <option value="mono">Monochromatic (Shades)</option>
              <option value="analogous">Analogous (Adjacent)</option>
              <option value="tetradic">Tetradic (4 Corners)</option>
            </select>
          </label>
        </div>

        <button onClick={randomizeBaseColor} className="flex items-center gap-1.5 text-xs font-bold text-pink-600 dark:text-pink-400">
          <RefreshCw className="w-4 h-4 animate-spin-hover" />
          <span>Randomize Base</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {palette.map((color, idx) => (
          <div key={idx} className="bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div style={{ backgroundColor: color }} className="h-28 w-full shadow-inner relative group flex items-center justify-center">
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[10px] text-white font-bold tracking-wider">CLICK TO COPY</span>
              </div>
            </div>
            <div className="p-3 flex items-center justify-between gap-1">
              <code className="text-xs font-mono font-bold">{color.toUpperCase()}</code>
              <CopyButton text={color} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. WCAG Contrast Checker
const ContrastChecker = () => {
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const [ratio, setRatio] = useState(21);

  // Calculate Relative Luminance
  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const calculateContrast = () => {
    const rgb1 = hexToRgbObj(fg);
    const rgb2 = hexToRgbObj(bg);

    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);

    const result = (brightest + 0.05) / (darkest + 0.05);
    setRatio(parseFloat(result.toFixed(2)));
  };

  useEffect(() => {
    calculateContrast();
  }, [fg, bg]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800">
        <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">Contrast Config</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-bold text-neutral-500 block mb-1">Text Color (Foreground)</span>
            <div className="flex gap-2">
              <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="w-10 h-8 cursor-pointer border-none" />
              <input type="text" value={fg} onChange={(e) => setFg(e.target.value)} className="px-2 py-1 bg-white dark:bg-neutral-950 border text-xs font-mono w-full rounded" />
            </div>
          </div>
          <div>
            <span className="text-xs font-bold text-neutral-500 block mb-1">Background Color</span>
            <div className="flex gap-2">
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-10 h-8 cursor-pointer border-none" />
              <input type="text" value={bg} onChange={(e) => setBg(e.target.value)} className="px-2 py-1 bg-white dark:bg-neutral-950 border text-xs font-mono w-full rounded" />
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-200/50 space-y-2 text-xs font-medium">
          <div className="flex justify-between items-center">
            <span>WCAG AA Normal Text (4.5:1)</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ratio >= 4.5 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{ratio >= 4.5 ? 'PASS' : 'FAIL'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>WCAG AAA Normal Text (7:1)</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ratio >= 7 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{ratio >= 7 ? 'PASS' : 'FAIL'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>WCAG AA Large Text (3:1)</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ratio >= 3 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{ratio >= 3 ? 'PASS' : 'FAIL'}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div style={{ backgroundColor: bg, color: fg }} className="flex-1 min-h-[140px] rounded-2xl flex flex-col items-center justify-center p-6 transition-colors shadow">
          <h5 className="text-lg font-bold">Contrast Inspection Preview</h5>
          <p className="text-xs mt-1 text-center opacity-90">How readable is this text when placed on this background layout?</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex justify-between items-center">
          <span className="text-xs font-bold text-neutral-500">Contrast Ratio Score</span>
          <span className="text-3xl font-bold font-mono text-pink-600 dark:text-pink-400">{ratio}:1</span>
        </div>
      </div>
    </div>
  );
};

// 3. Color Blender & Mixer
const ColorBlender = () => {
  const [color1, setColor1] = useState('#4f46e5');
  const [color2, setColor2] = useState('#06b6d4');
  const [steps, setSteps] = useState(7);
  const [blendedColors, setBlendedColors] = useState<string[]>([]);

  const calculateBlend = () => {
    const rgb1 = hexToRgbObj(color1);
    const rgb2 = hexToRgbObj(color2);
    const list: string[] = [];

    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1);
      const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * ratio);
      const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * ratio);
      const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * ratio);
      list.push(rgbToHex(r, g, b));
    }
    setBlendedColors(list);
  };

  useEffect(() => {
    calculateBlend();
  }, [color1, color2, steps]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
        <div>
          <span className="text-xs font-bold text-neutral-500 block mb-1">Color Stop A</span>
          <div className="flex gap-2">
            <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-10 h-8 cursor-pointer" />
            <input type="text" value={color1} onChange={(e) => setColor1(e.target.value)} className="px-2 py-1 bg-white dark:bg-neutral-950 border text-xs font-mono w-full rounded-lg" />
          </div>
        </div>
        <div>
          <span className="text-xs font-bold text-neutral-500 block mb-1">Color Stop B</span>
          <div className="flex gap-2">
            <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-10 h-8 cursor-pointer" />
            <input type="text" value={color2} onChange={(e) => setColor2(e.target.value)} className="px-2 py-1 bg-white dark:bg-neutral-950 border text-xs font-mono w-full rounded-lg" />
          </div>
        </div>
        <div>
          <span className="text-xs font-bold text-neutral-500 block mb-1">Step Segments</span>
          <input type="range" min="3" max="15" value={steps} onChange={(e) => setSteps(parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded appearance-none cursor-pointer mt-3 accent-pink-600" />
          <div className="text-[10px] text-right font-mono font-bold mt-1 text-neutral-400">{steps} Colors Mixed</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {blendedColors.map((color, idx) => {
          const ratioPercent = Math.round((idx / (steps - 1)) * 100);
          return (
            <div key={idx} className="flex items-center justify-between p-2.5 bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-800 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div style={{ backgroundColor: color }} className="w-9 h-9 rounded-lg shadow-inner" />
                <div className="flex flex-col">
                  <code className="text-xs font-mono font-bold">{color.toUpperCase()}</code>
                  <span className="text-[10px] text-neutral-400 font-medium">{ratioPercent}% Stop B blend</span>
                </div>
              </div>
              <CopyButton text={color} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 4. Color Picker HSL/RGB/HEX Inspector
const ColorPickerTool = () => {
  const [color, setColor] = useState('#10b981');
  const [rgb, setRgb] = useState({ r: 16, g: 185, b: 129 });

  const handleHexChange = (hex: string) => {
    setColor(hex);
    if (hex.match(/^#[0-9a-fA-F]{6}$/)) {
      setRgb(hexToRgbObj(hex));
    }
  };

  const handleRgbSlider = (key: 'r' | 'g' | 'b', val: number) => {
    const updated = { ...rgb, [key]: val };
    setRgb(updated);
    setColor(rgbToHex(updated.r, updated.g, updated.b));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800">
        <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">Color Coordinates</h4>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold text-neutral-500 mb-1">
              <span>Red Intensity</span>
              <span className="font-mono">{rgb.r}</span>
            </div>
            <input type="range" min="0" max="255" value={rgb.r} onChange={(e) => handleRgbSlider('r', parseInt(e.target.value))} className="w-full accent-rose-500" />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-neutral-500 mb-1">
              <span>Green Intensity</span>
              <span className="font-mono">{rgb.g}</span>
            </div>
            <input type="range" min="0" max="255" value={rgb.g} onChange={(e) => handleRgbSlider('g', parseInt(e.target.value))} className="w-full accent-emerald-500" />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-neutral-500 mb-1">
              <span>Blue Intensity</span>
              <span className="font-mono">{rgb.b}</span>
            </div>
            <input type="range" min="0" max="255" value={rgb.b} onChange={(e) => handleRgbSlider('b', parseInt(e.target.value))} className="w-full accent-blue-500" />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div style={{ backgroundColor: color }} className="flex-1 min-h-[140px] rounded-2xl flex items-center justify-center p-6 shadow relative">
          <input type="color" value={color} onChange={(e) => handleHexChange(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          <span className="text-xs font-bold text-white bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm select-none">
            CLICK TO OPEN BROWSER PICKER
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 flex justify-between items-center">
            <code className="text-xs font-mono font-bold">HEX: {color.toUpperCase()}</code>
            <CopyButton text={color} />
          </div>
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 flex justify-between items-center">
            <code className="text-[11px] font-mono font-bold">RGB: {rgb.r}, {rgb.g}, {rgb.b}</code>
            <CopyButton text={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. Tints and Shades Generator
const ColorShadesGen = () => {
  const [baseHex, setBaseHex] = useState('#4f46e5');
  const [list, setList] = useState<{ type: string; color: string; percent: number }[]>([]);

  const calculateShades = () => {
    const rgb = hexToRgbObj(baseHex);
    const results = [];

    // Tints (lighter - blend with white)
    for (let i = 9; i > 0; i--) {
      const pct = i * 10;
      const factor = pct / 100;
      const r = rgb.r + (255 - rgb.r) * factor;
      const g = rgb.g + (255 - rgb.g) * factor;
      const b = rgb.b + (255 - rgb.b) * factor;
      results.push({ type: 'tint', color: rgbToHex(r, g, b), percent: pct });
    }

    // Base color
    results.push({ type: 'base', color: baseHex, percent: 0 });

    // Shades (darker - blend with black)
    for (let i = 1; i <= 9; i++) {
      const pct = i * 10;
      const factor = 1 - pct / 100;
      const r = rgb.r * factor;
      const g = rgb.g * factor;
      const b = rgb.b * factor;
      results.push({ type: 'shade', color: rgbToHex(r, g, b), percent: pct });
    }

    setList(results);
  };

  useEffect(() => {
    calculateShades();
  }, [baseHex]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
        <span className="text-xs font-bold text-neutral-500">Pick Base Color</span>
        <input type="color" value={baseHex} onChange={(e) => setBaseHex(e.target.value)} className="w-10 h-8 rounded cursor-pointer border-none bg-transparent" />
        <input type="text" value={baseHex} onChange={(e) => setBaseHex(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border border-neutral-250 dark:border-neutral-800 rounded-lg text-xs font-mono w-28" />
      </div>

      <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-2">
        {list.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-800 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div style={{ backgroundColor: item.color }} className="w-8 h-8 rounded-lg shadow-inner" />
              <div className="flex flex-col">
                <code className="text-xs font-mono font-bold">{item.color.toUpperCase()}</code>
                <span className="text-[9px] text-neutral-400 uppercase font-bold">
                  {item.type === 'base' ? 'Base Color' : `${item.percent}% ${item.type}`}
                </span>
              </div>
            </div>
            <CopyButton text={item.color} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const colorToolsComponents: Record<string, () => React.JSX.Element> = {
  'color-palette': ColorPaletteGen,
  'contrast-checker': ContrastChecker,
  'color-blender': ColorBlender,
  'color-picker-tool': ColorPickerTool,
  'color-shades': ColorShadesGen,
};
