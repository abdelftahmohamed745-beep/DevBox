import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RefreshCw, RefreshCw as Loop, Check, Sliders, Image as ImageIcon } from 'lucide-react';
import { ImageEditor } from './ImageEditor';

const FormatSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 1. Image Compressor (Fully Client-Side)
const ImageCompressor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(0.75);
  const [src, setSrc] = useState<string>('');
  const [compressedSrc, setCompressedSrc] = useState<string>('');
  const [compressing, setCompressing] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;
    setFile(uploaded);
    setOriginalSize(uploaded.size);
    setSrc(URL.createObjectURL(uploaded));
  };

  const handleCompress = () => {
    if (!file) return;
    setCompressing(true);
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // compress to jpeg
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      setCompressedSrc(dataUrl);

      // Calculate approximate compressed size
      const head = 'data:image/jpeg;base64,';
      const sizeInBytes = Math.round((dataUrl.length - head.length) * 3 / 4);
      setCompressedSize(sizeInBytes);
      setCompressing(false);
    };
  };

  useEffect(() => {
    if (file) {
      handleCompress();
    }
  }, [file, quality]);

  return (
    <div className="space-y-4">
      {!file ? (
        <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl p-10 text-center hover:border-sky-500 transition-colors">
          <input type="file" accept="image/*" onChange={handleUpload} id="compressor-file" className="hidden" />
          <label htmlFor="compressor-file" className="cursor-pointer flex flex-col items-center gap-3">
            <Upload className="w-12 h-12 text-neutral-400" />
            <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Upload Image (PNG, JPG, WebP)</span>
            <span className="text-xs text-neutral-500">Completely local. Files are never sent to servers.</span>
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Compression Settings</h4>
              <button onClick={() => { setFile(null); setSrc(''); setCompressedSrc(''); }} className="text-xs font-semibold text-rose-500 hover:underline">Clear File</button>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-500 mb-1">
                <span>JPEG Quality Ratio</span>
                <span>{Math.round(quality * 100)}%</span>
              </div>
              <input type="range" min="0.1" max="1.0" step="0.05" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-sky-600" />
            </div>

            <div className="space-y-1.5 pt-3 border-t border-neutral-200/50 dark:border-neutral-800/50 text-xs font-medium">
              <div className="flex justify-between">
                <span>Original File Size:</span>
                <span className="font-mono text-neutral-600 dark:text-neutral-400">{FormatSize(originalSize)}</span>
              </div>
              <div className="flex justify-between">
                <span>Compressed File Size:</span>
                <span className="font-mono text-sky-600 font-bold">{FormatSize(compressedSize)}</span>
              </div>
              {compressedSize > 0 && (
                <div className="flex justify-between">
                  <span>Reduction Ratio:</span>
                  <span className="font-bold text-emerald-600">
                    -{Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))}%
                  </span>
                </div>
              )}
            </div>

            <a
              href={compressedSrc}
              download={`compressed-${file.name}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download Compressed JPG</span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4 h-[250px]">
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden relative bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center p-2">
              <img src={src} className="max-h-full max-w-full object-contain rounded" alt="Original" />
              <span className="absolute bottom-2 left-2 text-[10px] bg-black/50 text-white px-2 py-0.5 rounded font-bold">Original</span>
            </div>
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden relative bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center p-2">
              {compressing ? (
                <Loop className="w-6 h-6 animate-spin text-sky-500" />
              ) : (
                <img src={compressedSrc || src} className="max-h-full max-w-full object-contain rounded" alt="Compressed" />
              )}
              <span className="absolute bottom-2 left-2 text-[10px] bg-sky-600 text-white px-2 py-0.5 rounded font-bold">Compressed</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 2. Image Resizer
const ImageResizer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(true);
  const [src, setSrc] = useState('');
  const [resizedSrc, setResizedSrc] = useState('');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;
    setFile(uploaded);
    const objUrl = URL.createObjectURL(uploaded);
    setSrc(objUrl);

    const img = new Image();
    img.src = objUrl;
    img.onload = () => {
      setWidth(img.width);
      setHeight(img.height);
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
    };
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (aspectRatio && originalWidth > 0) {
      setHeight(Math.round(val * (originalHeight / originalWidth)));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (aspectRatio && originalHeight > 0) {
      setWidth(Math.round(val * (originalWidth / originalHeight)));
    }
  };

  const triggerResize = () => {
    if (!file) return;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      setResizedSrc(canvas.toDataURL(file.type));
    };
  };

  useEffect(() => {
    if (file && width > 0 && height > 0) {
      triggerResize();
    }
  }, [width, height, file]);

  return (
    <div className="space-y-4">
      {!file ? (
        <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl p-10 text-center hover:border-sky-500 transition-colors">
          <input type="file" accept="image/*" onChange={handleUpload} id="resizer-file" className="hidden" />
          <label htmlFor="resizer-file" className="cursor-pointer flex flex-col items-center gap-3">
            <Upload className="w-12 h-12 text-neutral-400" />
            <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Upload Image to Resize</span>
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Scale Specifications</h4>
              <button onClick={() => { setFile(null); setSrc(''); setResizedSrc(''); }} className="text-xs font-semibold text-rose-500 hover:underline">Clear</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-xs font-semibold">
                <span>Width (Pixels)</span>
                <input type="number" value={width} onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg font-mono text-sm" />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold">
                <span>Height (Pixels)</span>
                <input type="number" value={height} onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg font-mono text-sm" />
              </label>
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 cursor-pointer py-1">
              <input type="checkbox" checked={aspectRatio} onChange={(e) => setAspectRatio(e.target.checked)} className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4" />
              <span>Lock Aspect Ratio</span>
            </label>

            <a
              href={resizedSrc}
              download={`resized-${file.name}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download Resized {file.type.split('/')[1].toUpperCase()}</span>
            </a>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden relative bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center p-4 min-h-[220px]">
            <img src={resizedSrc || src} className="max-h-full max-w-full object-contain rounded" alt="Resize Preview" />
            <span className="absolute bottom-2 left-2 text-[10px] bg-black/50 text-white px-2 py-0.5 rounded font-mono font-bold">
              {width} x {height} px
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// 3. Image Format Converter
const ImageConverter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState('image/png');
  const [src, setSrc] = useState('');
  const [convertedSrc, setConvertedSrc] = useState('');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;
    setFile(uploaded);
    setSrc(URL.createObjectURL(uploaded));
  };

  const convertImage = () => {
    if (!file) return;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const res = canvas.toDataURL(targetFormat);
      setConvertedSrc(res);
    };
  };

  useEffect(() => {
    if (file) {
      convertImage();
    }
  }, [file, targetFormat]);

  const extMap: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl p-10 text-center hover:border-sky-500 transition-colors">
          <input type="file" accept="image/*" onChange={handleUpload} id="converter-file" className="hidden" />
          <label htmlFor="converter-file" className="cursor-pointer flex flex-col items-center gap-3">
            <Upload className="w-12 h-12 text-neutral-400" />
            <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Upload Image to Convert</span>
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Convert Format</h4>
              <button onClick={() => { setFile(null); setSrc(''); setConvertedSrc(''); }} className="text-xs font-semibold text-rose-500 hover:underline">Clear</button>
            </div>

            <div>
              <span className="text-xs font-bold text-neutral-500 block mb-1">Target Format</span>
              <div className="flex bg-neutral-100 dark:bg-neutral-950 p-1 rounded-lg gap-1 border border-neutral-200/50">
                <button onClick={() => setTargetFormat('image/png')} className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${targetFormat === 'image/png' ? 'bg-sky-600 text-white' : 'text-neutral-500'}`}>PNG</button>
                <button onClick={() => setTargetFormat('image/jpeg')} className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${targetFormat === 'image/jpeg' ? 'bg-sky-600 text-white' : 'text-neutral-500'}`}>JPG / JPEG</button>
                <button onClick={() => setTargetFormat('image/webp')} className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${targetFormat === 'image/webp' ? 'bg-sky-600 text-white' : 'text-neutral-500'}`}>WebP</button>
              </div>
            </div>

            <a
              href={convertedSrc}
              download={`converted-${file.name.substring(0, file.name.lastIndexOf('.'))}.${extMap[targetFormat]}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download converted .{extMap[targetFormat].toUpperCase()}</span>
            </a>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden relative bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center p-4 min-h-[220px]">
            <img src={convertedSrc || src} className="max-h-full max-w-full object-contain rounded" alt="Conversion Preview" />
            <span className="absolute bottom-2 left-2 text-[10px] bg-sky-600 text-white px-2 py-0.5 rounded font-bold uppercase font-mono">
              .{extMap[targetFormat]} Output
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// 4. Favicon Generator
const FaviconGenerator = () => {
  const [type, setType] = useState<'text' | 'image'>('text');
  const [emoji, setEmoji] = useState('🛠️');
  const [shape, setShape] = useState<'circle' | 'square'>('circle');
  const [bg, setBg] = useState('#2563eb');
  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const generateFavicon = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (type === 'text') {
      // draw shape background
      ctx.fillStyle = bg;
      if (shape === 'circle') {
        ctx.beginPath();
        ctx.arc(16, 16, 16, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(0, 0, 32, 32);
      }
      // draw emoji
      ctx.font = '22px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, 16, 17);
      setPreviewUrl(canvas.toDataURL('image/png'));
    } else {
      if (!file) return;
      const img = new Image();
      img.src = src;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 32, 32);
        setPreviewUrl(canvas.toDataURL('image/png'));
      };
    }
  };

  useEffect(() => {
    generateFavicon();
  }, [type, emoji, shape, bg, file, src]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;
    setFile(uploaded);
    setSrc(URL.createObjectURL(uploaded));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800">
        <div className="flex bg-neutral-100 dark:bg-neutral-950 p-1 rounded-lg mb-3 border">
          <button onClick={() => setType('text')} className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${type === 'text' ? 'bg-sky-600 text-white' : 'text-neutral-500'}`}>Emoji Favicon</button>
          <button onClick={() => setType('image')} className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${type === 'image' ? 'bg-sky-600 text-white' : 'text-neutral-500'}`}>Image Source</button>
        </div>

        {type === 'text' ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <label className="flex flex-col gap-1 text-xs font-bold">
                <span>Emoji Icon</span>
                <input type="text" maxLength={2} value={emoji} onChange={(e) => setEmoji(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-sm" />
              </label>
              <label className="flex flex-col gap-1 text-xs font-bold">
                <span>Shape</span>
                <select value={shape} onChange={(e) => setShape(e.target.value as any)} className="px-3 py-1.5 bg-white dark:bg-neutral-950 border rounded-lg text-sm">
                  <option value="circle">Circle</option>
                  <option value="square">Square</option>
                </select>
              </label>
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-500 block mb-1">Background Circle Color</span>
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-full h-8 rounded cursor-pointer border-none" />
            </div>
          </div>
        ) : (
          <div>
            <span className="text-xs font-bold text-neutral-500 block mb-1.5">Source Image</span>
            <input type="file" accept="image/*" onChange={handleUpload} className="text-xs block w-full bg-white dark:bg-neutral-950 border p-2 rounded-lg" />
          </div>
        )}

        <a
          href={previewUrl}
          download="favicon.png"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Download Favicon PNG (32x32)</span>
        </a>
      </div>

      <div className="flex flex-col justify-center items-center gap-4 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 min-h-[220px]">
        <div className="p-4 bg-white dark:bg-neutral-900 border rounded-xl flex items-center justify-center shadow">
          {previewUrl && <img src={previewUrl} className="w-16 h-16 object-contain image-rendering-pixelated" alt="Favicon Preview" />}
        </div>
        <p className="text-xs text-neutral-500 font-medium">Standard pixel-grid favicon (32x32px)</p>
      </div>
    </div>
  );
};

// 5. CSS Image Filters
const ImageFilters = () => {
  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState('');
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;
    setFile(uploaded);
    setSrc(URL.createObjectURL(uploaded));
  };

  const filterStyle = {
    filter: `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) sepia(${sepia}%) hue-rotate(${hueRotate}deg)`,
  };

  const cssString = `filter: blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) sepia(${sepia}%) hue-rotate(${hueRotate}deg);`;

  return (
    <div className="space-y-4">
      {!file ? (
        <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl p-10 text-center hover:border-sky-500 transition-colors">
          <input type="file" accept="image/*" onChange={handleUpload} id="filters-file" className="hidden" />
          <label htmlFor="filters-file" className="cursor-pointer flex flex-col items-center gap-3">
            <Upload className="w-12 h-12 text-neutral-400" />
            <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Upload Image for Filters</span>
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800 max-h-[420px] overflow-y-auto">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Adjust Filters</h4>
              <button onClick={() => { setFile(null); setSrc(''); }} className="text-xs font-semibold text-rose-500 hover:underline">Clear</button>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-500"><span>Blur</span><span>{blur}px</span></div>
              <input type="range" min="0" max="10" step="0.5" value={blur} onChange={(e) => setBlur(parseFloat(e.target.value))} className="w-full accent-sky-600" />
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-500"><span>Brightness</span><span>{brightness}%</span></div>
              <input type="range" min="50" max="150" value={brightness} onChange={(e) => setBrightness(parseInt(e.target.value))} className="w-full accent-sky-600" />
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-500"><span>Contrast</span><span>{contrast}%</span></div>
              <input type="range" min="50" max="150" value={contrast} onChange={(e) => setContrast(parseInt(e.target.value))} className="w-full accent-sky-600" />
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-500"><span>Grayscale</span><span>{grayscale}%</span></div>
              <input type="range" min="0" max="100" value={grayscale} onChange={(e) => setGrayscale(parseInt(e.target.value))} className="w-full accent-sky-600" />
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-500"><span>Sepia</span><span>{sepia}%</span></div>
              <input type="range" min="0" max="100" value={sepia} onChange={(e) => setSepia(parseInt(e.target.value))} className="w-full accent-sky-600" />
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-500"><span>Hue Rotate</span><span>{hueRotate}°</span></div>
              <input type="range" min="0" max="360" value={hueRotate} onChange={(e) => setHueRotate(parseInt(e.target.value))} className="w-full accent-sky-600" />
            </div>
          </div>

          <div className="flex flex-col gap-3 justify-between">
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden relative bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center p-4 min-h-[220px]">
              <img src={src} style={filterStyle} className="max-h-[200px] max-w-full object-contain rounded" alt="Filtered Image" />
            </div>
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3">
              <span className="text-[10px] font-bold text-neutral-400 block mb-1">CSS CLASS RULE</span>
              <code className="text-xs font-mono text-sky-600 dark:text-sky-400 break-all select-all block bg-neutral-50 dark:bg-neutral-950 p-2 rounded">
                {cssString}
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 6. Crop Ratio Social Previewer
const CropPreviewer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState('');
  const [ratio, setRatio] = useState<'insta' | 'youtube' | 'twitter' | 'linkedin'>('insta');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;
    setFile(uploaded);
    setSrc(URL.createObjectURL(uploaded));
  };

  const frameSpecs = {
    insta: { label: 'Instagram Feed Post (1:1)', class: 'aspect-square w-48 border-4 border-dashed border-sky-500' },
    youtube: { label: 'YouTube Thumbnail (16:9)', class: 'aspect-video w-72 border-4 border-dashed border-sky-500' },
    twitter: { label: 'Twitter Header Image (3:1)', class: 'aspect-[3/1] w-80 border-4 border-dashed border-sky-500' },
    linkedin: { label: 'LinkedIn Cover (4:1)', class: 'aspect-[4/1] w-80 border-4 border-dashed border-sky-500' },
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl p-10 text-center hover:border-sky-500 transition-colors">
          <input type="file" accept="image/*" onChange={handleUpload} id="crop-file" className="hidden" />
          <label htmlFor="crop-file" className="cursor-pointer flex flex-col items-center gap-3">
            <Upload className="w-12 h-12 text-neutral-400" />
            <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Upload Image for Social Frame Preview</span>
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-xl border border-neutral-100 dark:border-neutral-800">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Social Presets</h4>
              <button onClick={() => { setFile(null); setSrc(''); }} className="text-xs font-semibold text-rose-500 hover:underline">Clear</button>
            </div>

            <div className="flex flex-col gap-2">
              <button onClick={() => setRatio('insta')} className={`px-4 py-2 text-xs font-bold text-left rounded-lg transition-all ${ratio === 'insta' ? 'bg-sky-600 text-white shadow-sm' : 'bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850'}`}>
                {frameSpecs.insta.label}
              </button>
              <button onClick={() => setRatio('youtube')} className={`px-4 py-2 text-xs font-bold text-left rounded-lg transition-all ${ratio === 'youtube' ? 'bg-sky-600 text-white shadow-sm' : 'bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850'}`}>
                {frameSpecs.youtube.label}
              </button>
              <button onClick={() => setRatio('twitter')} className={`px-4 py-2 text-xs font-bold text-left rounded-lg transition-all ${ratio === 'twitter' ? 'bg-sky-600 text-white shadow-sm' : 'bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850'}`}>
                {frameSpecs.twitter.label}
              </button>
              <button onClick={() => setRatio('linkedin')} className={`px-4 py-2 text-xs font-bold text-left rounded-lg transition-all ${ratio === 'linkedin' ? 'bg-sky-600 text-white shadow-sm' : 'bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850'}`}>
                {frameSpecs.linkedin.label}
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 min-h-[220px]">
            <div className="relative flex items-center justify-center p-2 rounded max-h-[180px] max-w-full">
              <img src={src} className="max-h-[160px] max-w-full opacity-60 object-contain rounded" alt="Aspect Crop" />
              <div className={`absolute z-10 rounded shadow-md overflow-hidden bg-cover bg-center ${frameSpecs[ratio].class}`} style={{ backgroundImage: `url(${src})`, pointerEvents: 'none' }}></div>
            </div>
            <p className="text-xs text-neutral-500 font-bold mt-4">{frameSpecs[ratio].label} Target</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const imageToolsComponents: Record<string, () => React.JSX.Element> = {
  'image-editor': ImageEditor,
  'img-compressor': ImageCompressor,
  'img-resizer': ImageResizer,
  'img-converter': ImageConverter,
  'favicon-gen': FaviconGenerator,
  'image-filter': ImageFilters,
  'crop-tool': CropPreviewer,
};
