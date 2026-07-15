import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, Download, RotateCw, RotateCcw, FlipHorizontal, FlipVertical,
  Crop, Sparkles, Palette, Undo2 as Undo, Redo2 as Redo, Type, FileImage,
  Sliders, Palette as Paintbrush, Check, Trash2, Eye, Info, Shield, HelpCircle,
  Minimize2, ZoomIn, Type as TextIcon, Stamp, Scissors, Image as ImageIcon,
  Copy, RefreshCw, Layers
} from 'lucide-react';

interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  size: number;
  color: string;
  font: string;
}

interface ImageState {
  dataUrl: string;
  width: number;
  height: number;
}

export const ImageEditor = () => {
  // File upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string>('');
  
  // History tracking for Undo/Redo
  const [history, setHistory] = useState<ImageState[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  
  // Active category tabs: 'transform' | 'filters' | 'draw' | 'text' | 'watermark' | 'metadata'
  const [activeTab, setActiveTab] = useState<'transform' | 'filters' | 'draw' | 'text' | 'watermark' | 'metadata'>('transform');

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Crop settings
  const [cropRatio, setCropRatio] = useState<string>('free'); // 'free' | '1:1' | '16:9' | '4:3' | '9:16'
  const [cropBox, setCropBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [isCropping, setIsCropping] = useState<boolean>(false);
  const [draggingCropHandle, setDraggingCropHandle] = useState<string | null>(null);
  const dragStartOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Rotate & Flip settings
  const [rotateAngle, setRotateAngle] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [borderRadius, setBorderRadius] = useState<number>(0); // 0px to 100px border radius

  // Filter settings
  const [brightness, setBrightness] = useState<number>(100); // 50 to 200
  const [contrast, setContrast] = useState<number>(100); // 50 to 200
  const [saturation, setSaturation] = useState<number>(100); // 0 to 200
  const [blur, setBlur] = useState<number>(0); // 0 to 20
  const [sharpness, setSharpness] = useState<number>(0); // 0 to 100
  const [grayscale, setGrayscale] = useState<number>(0); // 0 to 100
  const [sepia, setSepia] = useState<number>(0); // 0 to 100
  const [invert, setInvert] = useState<number>(0); // 0 to 100
  const [hueRotate, setHueRotate] = useState<number>(0); // 0 to 360

  // Drawing settings
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawMode, setDrawMode] = useState<'brush' | 'eraser' | 'line' | 'rect' | 'circle'>('brush');
  const [brushColor, setBrushColor] = useState<string>('#3b82f6');
  const [brushSize, setBrushSize] = useState<number>(8);
  const drawStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [drawingSnapshot, setDrawingSnapshot] = useState<string | null>(null);

  // Text overlay settings
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [newTextInput, setNewTextInput] = useState<string>('Custom Label');
  const [newTextSize, setNewTextSize] = useState<number>(24);
  const [newTextColor, setNewTextColor] = useState<string>('#ffffff');
  const [newTextFont, setNewTextFont] = useState<string>('sans-serif');
  const [isDraggingText, setIsDraggingText] = useState<boolean>(false);

  // Watermark settings
  const [useWatermark, setUseWatermark] = useState<boolean>(false);
  const [watermarkType, setWatermarkType] = useState<'text' | 'image'>('text');
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(40); // 10 to 100
  const [watermarkScale, setWatermarkScale] = useState<number>(100); // 20 to 200
  const [watermarkPosition, setWatermarkPosition] = useState<string>('center'); // 'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'tile'
  const [watermarkImageFile, setWatermarkImageFile] = useState<File | null>(null);
  const [watermarkImageSrc, setWatermarkImageSrc] = useState<string>('');

  // Export settings
  const [exportFormat, setExportFormat] = useState<string>('image/png'); // 'image/png' | 'image/jpeg' | 'image/webp'
  const [exportQuality, setExportQuality] = useState<number>(90); // 10 to 100
  const [stripMetadata, setStripMetadata] = useState<boolean>(true);

  // Color Palette & Picker settings
  const [colorPickerActive, setColorPickerActive] = useState<boolean>(false);
  const [pickedColor, setPickedColor] = useState<string>('');
  const [extractedPalette, setExtractedPalette] = useState<string[]>([]);

  // Metadata viewer states
  const [metaInfo, setMetaInfo] = useState<Array<{ label: string; value: string }>>([]);

  // Before/after toggle
  const [showOriginal, setShowOriginal] = useState<boolean>(false);

  // Helper: Format bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper: Convert RGB values to hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // Handle image upload
  const handleFileUpload = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setOriginalSrc(url);

    // Load image metadata mock view
    const initialMetadata = [
      { label: 'Filename', value: file.name },
      { label: 'Mime Type', value: file.type },
      { label: 'Original Size', value: formatBytes(file.size) },
      { label: 'Last Modified', value: new Date(file.lastModified).toLocaleString() }
    ];
    setMetaInfo(initialMetadata);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      // Initialize Canvas & History
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL();
        const initialState: ImageState = {
          dataUrl,
          width: img.width,
          height: img.height
        };
        setHistory([initialState]);
        setHistoryIndex(0);
        extractColorPalette(canvas);

        // Populate dimension details in metadata
        setMetaInfo(prev => [
          ...prev,
          { label: 'Dimensions', value: `${img.width} x ${img.height} px` },
          { label: 'Aspect Ratio', value: getAspectRatioString(img.width, img.height) }
        ]);
      }
    };
  };

  const getAspectRatioString = (w: number, h: number) => {
    const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
    const divisor = gcd(w, h);
    return `${w / divisor}:${h / divisor}`;
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  // Push new state onto history stack
  const pushToHistory = (dataUrl: string, width: number, height: number) => {
    const newHistory = history.slice(0, historyIndex + 1);
    const newState: ImageState = { dataUrl, width, height };
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    // Auto palette re-extract on changes
    const tempImg = new Image();
    tempImg.src = dataUrl;
    tempImg.onload = () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.drawImage(tempImg, 0, 0);
        extractColorPalette(tempCanvas);
      }
    };
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleReset = () => {
    if (history.length > 0) {
      setHistory([history[0]]);
      setHistoryIndex(0);
      setTextOverlays([]);
      setRotateAngle(0);
      setFlipH(false);
      setFlipV(false);
      setBorderRadius(0);
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
      setBlur(0);
      setSharpness(0);
      setGrayscale(0);
      setSepia(0);
      setInvert(0);
      setHueRotate(0);
      setUseWatermark(false);
    }
  };

  // Color Palette extraction (sampling dominant colors)
  const extractColorPalette = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    const sampleSize = Math.min(1000, pixels.length / 4);
    const colorCount: Record<string, number> = {};

    for (let i = 0; i < sampleSize; i++) {
      const idx = Math.floor(Math.random() * (pixels.length / 4)) * 4;
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      // cluster similar colors slightly
      const hex = rgbToHex(
        Math.round(r / 16) * 16,
        Math.round(g / 16) * 16,
        Math.round(b / 16) * 16
      );
      colorCount[hex] = (colorCount[hex] || 0) + 1;
    }

    const sortedPalette = Object.entries(colorCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(entry => entry[0]);

    setExtractedPalette(sortedPalette.length ? sortedPalette : ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']);
  };

  // Custom Sharpness Canvas Filter Implementation
  // Uses a convolution filter kernel to locally enhance edges
  const applySharpness = (ctx: CanvasRenderingContext2D, width: number, height: number, amount: number) => {
    if (amount <= 0) return;
    const imgData = ctx.getImageData(0, 0, width, height);
    const pixels = imgData.data;
    const output = ctx.createImageData(width, height);
    const outPixels = output.data;

    // Convolution matrix for unsharp mask
    // [  0, -1,  0 ]
    // [ -1,  5, -1 ]
    // [  0, -1,  0 ]
    const w = [
      0, -amount / 100, 0,
      -amount / 100, 1 + (4 * amount) / 100, -amount / 100,
      0, -amount / 100, 0
    ];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let r = 0, g = 0, b = 0;
        for (let cy = -1; cy <= 1; cy++) {
          for (let cx = -1; cx <= 1; cx++) {
            const pixelIdx = ((y + cy) * width + (x + cx)) * 4;
            const weight = w[(cy + 1) * 3 + (cx + 1)];
            r += pixels[pixelIdx] * weight;
            g += pixels[pixelIdx + 1] * weight;
            b += pixels[pixelIdx + 2] * weight;
          }
        }
        const outIdx = (y * width + x) * 4;
        outPixels[outIdx] = Math.min(255, Math.max(0, r));
        outPixels[outIdx + 1] = Math.min(255, Math.max(0, g));
        outPixels[outIdx + 2] = Math.min(255, Math.max(0, b));
        outPixels[outIdx + 3] = pixels[outIdx + 3]; // keep original alpha
      }
    }
    // fill in borders
    ctx.putImageData(output, 0, 0);
  };

  // Main Draw Pipeline: render current state with rotating, flipping, filters, and annotations
  useEffect(() => {
    if (historyIndex === -1 || !canvasRef.current) return;
    
    const activeState = history[historyIndex];
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = showOriginal && history.length > 0 ? history[0].dataUrl : activeState.dataUrl;
    img.onload = () => {
      // Calculate layout size considering rotation
      let renderWidth = activeState.width;
      let renderHeight = activeState.height;

      // Handle custom rotation rotation
      if (rotateAngle === 90 || rotateAngle === 270 || rotateAngle === -90 || rotateAngle === -270) {
        renderWidth = activeState.height;
        renderHeight = activeState.width;
      }

      canvas.width = renderWidth;
      canvas.height = renderHeight;
      ctx.clearRect(0, 0, renderWidth, renderHeight);

      // Save context state for complex translations
      ctx.save();

      // Implement border radius on the actual canvas during preview rendering
      if (borderRadius > 0) {
        ctx.beginPath();
        ctx.roundRect(0, 0, renderWidth, renderHeight, (borderRadius * Math.min(renderWidth, renderHeight)) / 400);
        ctx.clip();
      }

      // Translate context to center for rotations & flips
      ctx.translate(renderWidth / 2, renderHeight / 2);
      
      // Rotate Angle
      if (rotateAngle !== 0) {
        ctx.rotate((rotateAngle * Math.PI) / 180);
      }

      // Flip
      const scaleX = flipH ? -1 : 1;
      const scaleY = flipV ? -1 : 1;
      ctx.scale(scaleX, scaleY);

      // CSS-like filters applied directly onto canvas context
      const filterStr = `brightness(${showOriginal ? 100 : brightness}%) contrast(${showOriginal ? 100 : contrast}%) saturate(${showOriginal ? 100 : saturation}%) blur(${showOriginal ? 0 : blur}px) grayscale(${showOriginal ? 0 : grayscale}%) sepia(${showOriginal ? 0 : sepia}%) invert(${showOriginal ? 0 : invert}%) hue-rotate(${showOriginal ? 0 : hueRotate}deg)`;
      ctx.filter = filterStr;

      // Draw standard image centered back
      ctx.drawImage(img, -activeState.width / 2, -activeState.height / 2);
      ctx.restore();

      // Post-Processing Convolution filter (Sharpness)
      if (!showOriginal && sharpness > 0) {
        applySharpness(ctx, renderWidth, renderHeight, sharpness);
      }

      // Draw Text Overlays
      textOverlays.forEach(overlay => {
        ctx.font = `${overlay.size}px ${overlay.font}`;
        ctx.fillStyle = overlay.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(1, overlay.size / 10);
        ctx.textBaseline = 'top';
        ctx.strokeText(overlay.text, overlay.x, overlay.y);
        ctx.fillText(overlay.text, overlay.x, overlay.y);

        // Highlight selected text boundary
        if (selectedTextId === overlay.id) {
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);
          const textMetric = ctx.measureText(overlay.text);
          ctx.strokeRect(overlay.x - 4, overlay.y - 4, textMetric.width + 8, overlay.size + 8);
          ctx.setLineDash([]);
        }
      });

      // Render Watermark
      if (!showOriginal && useWatermark) {
        ctx.save();
        ctx.globalAlpha = watermarkOpacity / 100;

        if (watermarkType === 'text' && watermarkText) {
          const size = Math.round((renderWidth * watermarkScale) / 400);
          ctx.font = `bold ${size}px sans-serif`;
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = Math.max(1, size / 10);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          if (watermarkPosition === 'center') {
            ctx.translate(renderWidth / 2, renderHeight / 2);
            ctx.rotate(-Math.PI / 6);
            ctx.strokeText(watermarkText, 0, 0);
            ctx.fillText(watermarkText, 0, 0);
          } else if (watermarkPosition === 'top-left') {
            ctx.strokeText(watermarkText, size * 2, size);
            ctx.fillText(watermarkText, size * 2, size);
          } else if (watermarkPosition === 'top-right') {
            ctx.strokeText(watermarkText, renderWidth - size * 2, size);
            ctx.fillText(watermarkText, renderWidth - size * 2, size);
          } else if (watermarkPosition === 'bottom-left') {
            ctx.strokeText(watermarkText, size * 2, renderHeight - size);
            ctx.fillText(watermarkText, size * 2, renderHeight - size);
          } else if (watermarkPosition === 'bottom-right') {
            ctx.strokeText(watermarkText, renderWidth - size * 2, renderHeight - size);
            ctx.fillText(watermarkText, renderWidth - size * 2, renderHeight - size);
          } else if (watermarkPosition === 'tile') {
            const stepX = size * 5;
            const stepY = size * 3;
            for (let x = size; x < renderWidth + stepX; x += stepX) {
              for (let y = size; y < renderHeight + stepY; y += stepY) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(-Math.PI / 12);
                ctx.strokeText(watermarkText, 0, 0);
                ctx.fillText(watermarkText, 0, 0);
                ctx.restore();
              }
            }
          }
        } else if (watermarkType === 'image' && watermarkImageSrc) {
          const wmImg = new Image();
          wmImg.src = watermarkImageSrc;
          wmImg.onload = () => {
            const wmW = Math.round((renderWidth * watermarkScale) / 300);
            const wmH = wmW * (wmImg.height / wmImg.width);

            if (watermarkPosition === 'center') {
              ctx.drawImage(wmImg, renderWidth / 2 - wmW / 2, renderHeight / 2 - wmH / 2, wmW, wmH);
            } else if (watermarkPosition === 'top-left') {
              ctx.drawImage(wmImg, 20, 20, wmW, wmH);
            } else if (watermarkPosition === 'top-right') {
              ctx.drawImage(wmImg, renderWidth - wmW - 20, 20, wmW, wmH);
            } else if (watermarkPosition === 'bottom-left') {
              ctx.drawImage(wmImg, 20, renderHeight - wmH - 20, wmW, wmH);
            } else if (watermarkPosition === 'bottom-right') {
              ctx.drawImage(wmImg, renderWidth - wmW - 20, renderHeight - wmH - 20, wmW, wmH);
            } else if (watermarkPosition === 'tile') {
              const stepX = wmW * 3;
              const stepY = wmH * 3;
              for (let x = 20; x < renderWidth; x += stepX) {
                for (let y = 20; y < renderHeight; y += stepY) {
                  ctx.drawImage(wmImg, x, y, wmW, wmH);
                }
              }
            }
          };
        }
        ctx.restore();
      }
    };
  }, [
    history,
    historyIndex,
    rotateAngle,
    flipH,
    flipV,
    brightness,
    contrast,
    saturation,
    blur,
    sharpness,
    grayscale,
    sepia,
    invert,
    hueRotate,
    textOverlays,
    selectedTextId,
    useWatermark,
    watermarkType,
    watermarkText,
    watermarkOpacity,
    watermarkScale,
    watermarkPosition,
    watermarkImageSrc,
    borderRadius,
    showOriginal
  ]);

  // Crop overlay and coordinates computation
  const initCropBox = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let w = canvas.width * 0.75;
    let h = canvas.height * 0.75;

    if (cropRatio === '1:1') {
      const min = Math.min(w, h);
      w = min;
      h = min;
    } else if (cropRatio === '16:9') {
      h = w * (9 / 16);
      if (h > canvas.height) {
        h = canvas.height * 0.75;
        w = h * (16 / 9);
      }
    } else if (cropRatio === '4:3') {
      h = w * (3 / 4);
      if (h > canvas.height) {
        h = canvas.height * 0.75;
        w = h * (4 / 3);
      }
    } else if (cropRatio === '9:16') {
      w = h * (9 / 16);
      if (w > canvas.width) {
        w = canvas.width * 0.75;
        h = w * (16 / 9);
      }
    }

    setCropBox({
      x: (canvas.width - w) / 2,
      y: (canvas.height - h) / 2,
      w,
      h
    });
    setIsCropping(true);
  };

  const executeCrop = () => {
    if (!cropBox || !canvasRef.current) return;
    const canvas = canvasRef.current;
    
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = cropBox.w;
    cropCanvas.height = cropBox.h;
    const cropCtx = cropCanvas.getContext('2d');
    if (cropCtx) {
      cropCtx.drawImage(
        canvas,
        cropBox.x, cropBox.y, cropBox.w, cropBox.h, // Source
        0, 0, cropBox.w, cropBox.h                  // Target
      );
      pushToHistory(cropCanvas.toDataURL(), cropBox.w, cropBox.h);
      setIsCropping(false);
      setCropBox(null);
    }
  };

  // Drag handles logic for crop box
  const getCanvasMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasMousePos(e);

    // Color picker capability click
    if (colorPickerActive && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        const pixel = ctx.getImageData(pos.x, pos.y, 1, 1).data;
        const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
        setPickedColor(hex);
        setColorPickerActive(false);
      }
      return;
    }

    // Text Dragging logic
    if (activeTab === 'text') {
      const clickedOverlay = [...textOverlays].reverse().find(overlay => {
        const canvas = canvasRef.current;
        if (!canvas) return false;
        const ctx = canvas.getContext('2d');
        if (!ctx) return false;
        ctx.font = `${overlay.size}px ${overlay.font}`;
        const metric = ctx.measureText(overlay.text);
        return (
          pos.x >= overlay.x &&
          pos.x <= overlay.x + metric.width &&
          pos.y >= overlay.y &&
          pos.y <= overlay.y + overlay.size
        );
      });

      if (clickedOverlay) {
        setSelectedTextId(clickedOverlay.id);
        setIsDraggingText(true);
        dragStartOffset.current = {
          x: pos.x - clickedOverlay.x,
          y: pos.y - clickedOverlay.y
        };
        return;
      } else {
        setSelectedTextId(null);
      }
    }

    // Crop dragging handles logic
    if (isCropping && cropBox) {
      const threshold = 15; // click sensitivity
      // check corner handles
      const isTopLeft = Math.abs(pos.x - cropBox.x) < threshold && Math.abs(pos.y - cropBox.y) < threshold;
      const isTopRight = Math.abs(pos.x - (cropBox.x + cropBox.w)) < threshold && Math.abs(pos.y - cropBox.y) < threshold;
      const isBottomLeft = Math.abs(pos.x - cropBox.x) < threshold && Math.abs(pos.y - (cropBox.y + cropBox.h)) < threshold;
      const isBottomRight = Math.abs(pos.x - (cropBox.x + cropBox.w)) < threshold && Math.abs(pos.y - (cropBox.y + cropBox.h)) < threshold;
      const isInside = pos.x > cropBox.x && pos.x < cropBox.x + cropBox.w && pos.y > cropBox.y && pos.y < cropBox.y + cropBox.h;

      if (isTopLeft) setDraggingCropHandle('tl');
      else if (isTopRight) setDraggingCropHandle('tr');
      else if (isBottomLeft) setDraggingCropHandle('bl');
      else if (isBottomRight) setDraggingCropHandle('br');
      else if (isInside) {
        setDraggingCropHandle('move');
        dragStartOffset.current = { x: pos.x - cropBox.x, y: pos.y - cropBox.y };
      }
      return;
    }

    // Drawing Tool logic
    if (activeTab === 'draw' && canvasRef.current) {
      setIsDrawing(true);
      drawStartPos.current = pos;
      // snapshot current canvas for shapes preview
      setDrawingSnapshot(canvasRef.current.toDataURL());

      const ctx = canvasRef.current.getContext('2d');
      if (ctx && (drawMode === 'brush' || drawMode === 'eraser')) {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.strokeStyle = drawMode === 'eraser' ? '#ffffff' : brushColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasMousePos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Text drag move
    if (isDraggingText && selectedTextId) {
      setTextOverlays(prev => prev.map(o => o.id === selectedTextId ? {
        ...o,
        x: Math.round(pos.x - dragStartOffset.current.x),
        y: Math.round(pos.y - dragStartOffset.current.y)
      } : o));
      return;
    }

    // Crop handles drag move
    if (isCropping && cropBox && draggingCropHandle) {
      let newX = cropBox.x;
      let newY = cropBox.y;
      let newW = cropBox.w;
      let newH = cropBox.h;

      const right = cropBox.x + cropBox.w;
      const bottom = cropBox.y + cropBox.h;

      if (draggingCropHandle === 'move') {
        newX = Math.max(0, Math.min(canvas.width - cropBox.w, pos.x - dragStartOffset.current.x));
        newY = Math.max(0, Math.min(canvas.height - cropBox.h, pos.y - dragStartOffset.current.y));
      } else {
        if (draggingCropHandle === 'tl') {
          newX = Math.max(0, Math.min(right - 20, pos.x));
          newY = Math.max(0, Math.min(bottom - 20, pos.y));
          newW = right - newX;
          newH = bottom - newY;
        } else if (draggingCropHandle === 'tr') {
          newW = Math.max(20, Math.min(canvas.width - cropBox.x, pos.x - cropBox.x));
          newY = Math.max(0, Math.min(bottom - 20, pos.y));
          newH = bottom - newY;
        } else if (draggingCropHandle === 'bl') {
          newX = Math.max(0, Math.min(right - 20, pos.x));
          newW = right - newX;
          newH = Math.max(20, Math.min(canvas.height - cropBox.y, pos.y - cropBox.y));
        } else if (draggingCropHandle === 'br') {
          newW = Math.max(20, Math.min(canvas.width - cropBox.x, pos.x - cropBox.x));
          newH = Math.max(20, Math.min(canvas.height - cropBox.y, pos.y - cropBox.y));
        }

        // Lock aspect ratios if needed
        if (cropRatio === '1:1') {
          const size = Math.min(newW, newH);
          newW = size;
          newH = size;
        } else if (cropRatio === '16:9') {
          newH = newW * (9 / 16);
        } else if (cropRatio === '4:3') {
          newH = newW * (3 / 4);
        } else if (cropRatio === '9:16') {
          newH = newW * (16 / 9);
        }
      }

      setCropBox({ x: newX, y: newY, w: newW, h: newH });
      return;
    }

    // Drawing continuous path
    if (isDrawing && activeTab === 'draw') {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (drawMode === 'brush' || drawMode === 'eraser') {
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (drawingSnapshot) {
        // Render preview overlay for shapes (line, rect, circle)
        const img = new Image();
        img.src = drawingSnapshot;
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);

          ctx.beginPath();
          ctx.strokeStyle = brushColor;
          ctx.lineWidth = brushSize;
          ctx.lineCap = 'round';

          if (drawMode === 'line') {
            ctx.moveTo(drawStartPos.current.x, drawStartPos.current.y);
            ctx.lineTo(pos.x, pos.y);
          } else if (drawMode === 'rect') {
            ctx.strokeRect(
              drawStartPos.current.x,
              drawStartPos.current.y,
              pos.x - drawStartPos.current.x,
              pos.y - drawStartPos.current.y
            );
          } else if (drawMode === 'circle') {
            const radius = Math.sqrt(
              Math.pow(pos.x - drawStartPos.current.x, 2) +
              Math.pow(pos.y - drawStartPos.current.y, 2)
            );
            ctx.arc(drawStartPos.current.x, drawStartPos.current.y, radius, 0, Math.PI * 2);
          }
          ctx.stroke();
        };
      }
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDraggingText(false);
    setDraggingCropHandle(null);

    if (isDrawing && activeTab === 'draw' && canvasRef.current) {
      setIsDrawing(false);
      setDrawingSnapshot(null);
      // commit draw path to history
      pushToHistory(canvasRef.current.toDataURL(), canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Add text overlays
  const addTextOverlay = () => {
    if (!newTextInput.trim() || !canvasRef.current) return;
    const overlay: TextOverlay = {
      id: Math.random().toString(36).substring(2, 9),
      text: newTextInput,
      x: Math.round(canvasRef.current.width / 4),
      y: Math.round(canvasRef.current.height / 2),
      size: newTextSize,
      color: newTextColor,
      font: newTextFont
    };
    setTextOverlays([...textOverlays, overlay]);
    setSelectedTextId(overlay.id);
  };

  const deleteSelectedText = () => {
    if (selectedTextId) {
      setTextOverlays(textOverlays.filter(o => o.id !== selectedTextId));
      setSelectedTextId(null);
    }
  };

  // Watermark source selection
  const handleWatermarkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setWatermarkImageFile(file);
      setWatermarkImageSrc(URL.createObjectURL(file));
    }
  };

  // Final Export & Download result
  const triggerExport = () => {
    if (!canvasRef.current || !imageFile) return;
    
    // Create temporary export canvas to strip metadata (natively happens when rebuilding canvas images)
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvasRef.current.width;
    exportCanvas.height = canvasRef.current.height;
    const exportCtx = exportCanvas.getContext('2d');
    if (exportCtx) {
      exportCtx.drawImage(canvasRef.current, 0, 0);
      
      const fileExt = exportFormat === 'image/png' ? 'png' : exportFormat === 'image/jpeg' ? 'jpg' : 'webp';
      const dataUrl = exportCanvas.toDataURL(exportFormat, exportQuality / 100);

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `edited-${imageFile.name.substring(0, imageFile.name.lastIndexOf('.'))}.${fileExt}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-5 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h2 className="text-lg font-black tracking-tight text-slate-850 dark:text-slate-100 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-sky-500" />
            <span>Advanced Image Editor</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Studio-grade, offline-first responsive browser canvas editing suite. No network required.
          </p>
        </div>
        
        {imageFile && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-all cursor-pointer border"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-all cursor-pointer border"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
            <button
              onMouseDown={() => setShowOriginal(true)}
              onMouseUp={() => setShowOriginal(false)}
              onMouseLeave={() => setShowOriginal(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer border flex items-center gap-1"
              title="Hold to see original"
            >
              <Eye className="w-3.5 h-3.5 text-sky-500" />
              <span>Before/After</span>
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all cursor-pointer border border-rose-200/40"
            >
              Reset Canvas
            </button>
          </div>
        )}
      </div>

      {!imageFile ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-12 text-center bg-white dark:bg-slate-950 hover:border-sky-500 transition-all duration-300 shadow-sm flex flex-col items-center justify-center min-h-[350px] group"
        >
          <input
            type="file"
            accept="image/*"
            id="editor-file-input"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
          <label
            htmlFor="editor-file-input"
            className="cursor-pointer flex flex-col items-center gap-4 max-w-md"
          >
            <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                Drag & Drop or Select Image
              </h3>
              <p className="text-xs text-slate-400">
                Supports PNG, JPG, JPEG, WebP, GIF, or SVG formats. Fully local sandbox security.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              <span className="text-[10px] font-bold px-2 py-1 bg-slate-50 dark:bg-slate-900 text-slate-500 rounded-md">Crop & Rotate</span>
              <span className="text-[10px] font-bold px-2 py-1 bg-slate-50 dark:bg-slate-900 text-slate-500 rounded-md">Studio Filters</span>
              <span className="text-[10px] font-bold px-2 py-1 bg-slate-50 dark:bg-slate-900 text-slate-500 rounded-md">Draw & Text</span>
              <span className="text-[10px] font-bold px-2 py-1 bg-slate-50 dark:bg-slate-900 text-slate-500 rounded-md">Strip Metadata</span>
            </div>
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Main Visual Canvas Frame (Center Viewport) */}
          <div className="xl:col-span-8 flex flex-col space-y-3">
            <div className="relative border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 rounded-2xl overflow-hidden p-4 flex items-center justify-center min-h-[400px] max-h-[600px] shadow-inner select-none">
              <canvas
                ref={canvasRef}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                className={`max-w-full max-h-[500px] object-contain rounded shadow-lg border border-slate-200/50 dark:border-slate-900/50 ${
                  colorPickerActive ? 'cursor-crosshair' : ''
                }`}
              />

              {/* Crop Box Overlay Frame */}
              {isCropping && cropBox && canvasRef.current && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    width: canvasRef.current.clientWidth,
                    height: canvasRef.current.clientHeight,
                    top: canvasRef.current.offsetTop,
                    left: canvasRef.current.offsetLeft
                  }}
                >
                  {/* Outer dim overlays */}
                  <div className="absolute inset-0 bg-black/60" />
                  
                  {/* Highlighted Crop Area */}
                  <div
                    className="absolute border border-sky-400 bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
                    style={{
                      left: (cropBox.x / canvasRef.current.width) * 100 + '%',
                      top: (cropBox.y / canvasRef.current.height) * 100 + '%',
                      width: (cropBox.w / canvasRef.current.width) * 100 + '%',
                      height: (cropBox.h / canvasRef.current.height) * 100 + '%',
                      pointerEvents: 'auto'
                    }}
                  >
                    {/* Visual Crop Handles */}
                    <div className="absolute top-0 left-0 w-3 h-3 bg-sky-400 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-nwse-resize" />
                    <div className="absolute top-0 right-0 w-3 h-3 bg-sky-400 translate-x-1/2 -translate-y-1/2 rounded-full cursor-nesw-resize" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 bg-sky-400 -translate-x-1/2 translate-y-1/2 rounded-full cursor-nesw-resize" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-sky-400 translate-x-1/2 translate-y-1/2 rounded-full cursor-nwse-resize" />
                    
                    {/* Centered cross grid indicator */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30 pointer-events-none">
                      <div className="border-r border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-b border-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center px-2">
              <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                Canvas Resolving: {history[historyIndex]?.width} x {history[historyIndex]?.height} px
              </div>
              <button
                onClick={() => {
                  setImageFile(null);
                  setOriginalSrc('');
                  setHistory([]);
                  setHistoryIndex(-1);
                  setTextOverlays([]);
                }}
                className="text-xs font-semibold text-rose-500 hover:underline transition-all"
              >
                Clear File & Upload Another
              </button>
            </div>
          </div>

          {/* Tools Control Panel Sidebar */}
          <div className="xl:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4 shadow-sm">
            {/* Horizontal Control Tab Bars */}
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100 dark:border-slate-800/80">
              {(
                [
                  { id: 'transform', label: 'Crop & Rotate', icon: Scissors },
                  { id: 'filters', label: 'Filters', icon: Sliders },
                  { id: 'draw', label: 'Draw', icon: Paintbrush },
                  { id: 'text', label: 'Text', icon: Type },
                  { id: 'watermark', label: 'Watermark', icon: Stamp },
                  { id: 'metadata', label: 'Meta & Colors', icon: Info }
                ] as const
              ).map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (tab.id !== 'transform') setIsCropping(false);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 border ${
                      activeTab === tab.id
                        ? 'bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900/50'
                        : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT: ADJUST & TRANSFORM */}
            {activeTab === 'transform' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Crop Tool Aspect presets</h4>
                    {isCropping ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setIsCropping(false);
                            setCropBox(null);
                          }}
                          className="text-[10px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-2 py-0.5 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={executeCrop}
                          className="text-[10px] font-bold bg-sky-600 text-white px-2 py-0.5 rounded"
                        >
                          Apply
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={initCropBox}
                        className="text-[10px] font-bold bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/40 text-sky-600 px-2.5 py-1 rounded-md"
                      >
                        Activate Crop
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'free', label: 'Free Aspect' },
                      { id: '1:1', label: '1:1 Square' },
                      { id: '16:9', label: '16:9 Video' },
                      { id: '4:3', label: '4:3 TV' },
                      { id: '9:16', label: '9:16 Portrait' }
                    ].map(preset => (
                      <button
                        key={preset.id}
                        disabled={!isCropping}
                        onClick={() => setCropRatio(preset.id)}
                        className={`py-1 px-2 text-[10px] font-bold rounded border transition-all ${
                          cropRatio === preset.id && isCropping
                            ? 'bg-sky-600 border-sky-600 text-white'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400'
                        } disabled:opacity-40`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Orientation Adjustments</h4>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => {
                        let nextAngle = rotateAngle - 90;
                        if (nextAngle < 0) nextAngle += 360;
                        setRotateAngle(nextAngle);
                      }}
                      className="p-2 border rounded-xl bg-slate-50 dark:bg-slate-950 flex flex-col items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4 text-sky-500" />
                      <span className="text-[9px] font-bold">-90°</span>
                    </button>
                    <button
                      onClick={() => {
                        let nextAngle = rotateAngle + 90;
                        if (nextAngle >= 360) nextAngle -= 360;
                        setRotateAngle(nextAngle);
                      }}
                      className="p-2 border rounded-xl bg-slate-50 dark:bg-slate-950 flex flex-col items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 cursor-pointer"
                    >
                      <RotateCw className="w-4 h-4 text-sky-500" />
                      <span className="text-[9px] font-bold">+90°</span>
                    </button>
                    <button
                      onClick={() => setFlipH(!flipH)}
                      className={`p-2 border rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        flipH ? 'bg-sky-50 dark:bg-sky-950/20 border-sky-400 text-sky-600' : 'bg-slate-50 dark:bg-slate-950 hover:bg-slate-100'
                      }`}
                    >
                      <FlipHorizontal className="w-4 h-4" />
                      <span className="text-[9px] font-bold">Flip H</span>
                    </button>
                    <button
                      onClick={() => setFlipV(!flipV)}
                      className={`p-2 border rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        flipV ? 'bg-sky-50 dark:bg-sky-950/20 border-sky-400 text-sky-600' : 'bg-slate-50 dark:bg-slate-950 hover:bg-slate-100'
                      }`}
                    >
                      <FlipVertical className="w-4 h-4" />
                      <span className="text-[9px] font-bold">Flip V</span>
                    </button>
                  </div>
                </div>

                {/* Fine rotate rotation angle */}
                <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Fine Rotate Alignment</span>
                    <span className="font-mono text-sky-600 font-bold">{rotateAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={rotateAngle}
                    onChange={(e) => setRotateAngle(parseInt(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                </div>

                {/* Rounded Corners Custom Editor */}
                <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Rounded Corners Border Radius</span>
                    <span className="font-mono text-sky-600 font-bold">{borderRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                  <span className="text-[9px] text-slate-400 block">Apply circular corner masks to your loaded canvas view locally.</span>
                </div>
              </div>
            )}

            {/* TAB CONTENT: FILTERS */}
            {activeTab === 'filters' && (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Brightness</span>
                    <span className="font-mono text-sky-600 font-bold">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Contrast</span>
                    <span className="font-mono text-sky-600 font-bold">{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={contrast}
                    onChange={(e) => setContrast(parseInt(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Saturation</span>
                    <span className="font-mono text-sky-600 font-bold">{saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={(e) => setSaturation(parseInt(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Blur (Radius)</span>
                    <span className="font-mono text-sky-600 font-bold">{blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={blur}
                    onChange={(e) => setBlur(parseFloat(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Unsharp Mask (Sharpness)</span>
                    <span className="font-mono text-sky-600 font-bold">{sharpness}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sharpness}
                    onChange={(e) => setSharpness(parseInt(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Grayscale</span>
                    <span className="font-mono text-sky-600 font-bold">{grayscale}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={grayscale}
                    onChange={(e) => setGrayscale(parseInt(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Sepia Vintage</span>
                    <span className="font-mono text-sky-600 font-bold">{sepia}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sepia}
                    onChange={(e) => setSepia(parseInt(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Color Inversion</span>
                    <span className="font-mono text-sky-600 font-bold">{invert}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={invert}
                    onChange={(e) => setInvert(parseInt(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Hue rotation</span>
                    <span className="font-mono text-sky-600 font-bold">{hueRotate}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={hueRotate}
                    onChange={(e) => setHueRotate(parseInt(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                </div>
              </div>
            )}

            {/* TAB CONTENT: DRAW TOOLS */}
            {activeTab === 'draw' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Drawing Element Mode</h4>
                  <div className="grid grid-cols-5 gap-1">
                    {[
                      { id: 'brush', label: 'Brush' },
                      { id: 'eraser', label: 'Eraser' },
                      { id: 'line', label: 'Line' },
                      { id: 'rect', label: 'Rect' },
                      { id: 'circle', label: 'Circle' }
                    ].map(mode => (
                      <button
                        key={mode.id}
                        onClick={() => setDrawMode(mode.id as any)}
                        className={`py-1.5 text-[9px] font-black rounded border transition-all ${
                          drawMode === mode.id
                            ? 'bg-sky-600 border-sky-600 text-white'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 items-center">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">Brush Color</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={brushColor}
                        onChange={(e) => setBrushColor(e.target.value)}
                        className="w-7 h-7 rounded border-none cursor-pointer"
                        disabled={drawMode === 'eraser'}
                      />
                      <span className="font-mono text-xs text-slate-700 dark:text-slate-300 font-bold uppercase">{brushColor}</span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>Brush Size</span>
                      <span className="font-mono text-sky-600 font-bold">{brushSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={brushSize}
                      onChange={(e) => setBrushSize(parseInt(e.target.value))}
                      className="w-full accent-sky-600"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/50 text-[10px] text-slate-500 flex gap-2">
                  <Info className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>Click and hold on the canvas, then drag your mouse cursor to sketch.</span>
                </div>
              </div>
            )}

            {/* TAB CONTENT: TEXT OVERLAYS */}
            {activeTab === 'text' && (
              <div className="space-y-3">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Text String</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={newTextInput}
                      onChange={(e) => setNewTextInput(e.target.value)}
                      placeholder="Add overlay text..."
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                    />
                    <button
                      onClick={addTextOverlay}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-lg cursor-pointer"
                    >
                      + Add Text
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col space-y-1">
                    <span className="text-[10px] font-bold text-slate-500">Text Size: {newTextSize}px</span>
                    <input
                      type="range"
                      min="12"
                      max="72"
                      value={newTextSize}
                      onChange={(e) => {
                        const size = parseInt(e.target.value);
                        setNewTextSize(size);
                        if (selectedTextId) {
                          setTextOverlays(prev => prev.map(o => o.id === selectedTextId ? { ...o, size } : o));
                        }
                      }}
                      className="w-full accent-sky-600"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <span className="text-[10px] font-bold text-slate-500">Color</span>
                    <input
                      type="color"
                      value={newTextColor}
                      onChange={(e) => {
                        const color = e.target.value;
                        setNewTextColor(color);
                        if (selectedTextId) {
                          setTextOverlays(prev => prev.map(o => o.id === selectedTextId ? { ...o, color } : o));
                        }
                      }}
                      className="w-full h-6 rounded cursor-pointer border-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="text-[10px] font-bold text-slate-500">Font Family</span>
                  <select
                    value={newTextFont}
                    onChange={(e) => {
                      const font = e.target.value;
                      setNewTextFont(font);
                      if (selectedTextId) {
                        setTextOverlays(prev => prev.map(o => o.id === selectedTextId ? { ...o, font } : o));
                      }
                    }}
                    className="px-2 py-1 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-350"
                  >
                    <option value="sans-serif">Sans-Serif</option>
                    <option value="serif">Elegant Serif</option>
                    <option value="monospace">Developer Mono</option>
                    <option value="cursive">Playful Handwritten</option>
                  </select>
                </div>

                {textOverlays.length > 0 && (
                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-500">Active Layers ({textOverlays.length})</span>
                      {selectedTextId && (
                        <button
                          onClick={deleteSelectedText}
                          className="text-[10px] text-red-500 hover:underline flex items-center gap-1 font-bold"
                        >
                          <Trash2 className="w-3 h-3" /> Remove Selected
                        </button>
                      )}
                    </div>
                    <div className="space-y-1 max-h-[100px] overflow-y-auto pr-1">
                      {textOverlays.map(overlay => (
                        <button
                          key={overlay.id}
                          onClick={() => setSelectedTextId(overlay.id)}
                          className={`w-full px-2.5 py-1 text-left text-xs rounded flex justify-between items-center transition-all ${
                            selectedTextId === overlay.id
                              ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 font-bold'
                              : 'bg-slate-50 dark:bg-slate-950 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className="truncate flex-1">"{overlay.text}"</span>
                          <span className="text-[9px] font-mono text-slate-400 shrink-0">{overlay.size}px, {overlay.font}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: WATERMARK */}
            {activeTab === 'watermark' && (
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useWatermark}
                    onChange={(e) => setUseWatermark(e.target.checked)}
                    className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                  />
                  <span>Inject Watermark Layer</span>
                </label>

                {useWatermark && (
                  <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/50 text-xs">
                    <div className="flex bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded-lg border gap-0.5">
                      <button
                        onClick={() => setWatermarkType('text')}
                        className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-all ${
                          watermarkType === 'text' ? 'bg-sky-600 text-white' : 'text-slate-500'
                        }`}
                      >
                        Text Overlay
                      </button>
                      <button
                        onClick={() => setWatermarkType('image')}
                        className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-all ${
                          watermarkType === 'image' ? 'bg-sky-600 text-white' : 'text-slate-500'
                        }`}
                      >
                        Custom Logo
                      </button>
                    </div>

                    {watermarkType === 'text' ? (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400">Watermark Text</span>
                        <input
                          type="text"
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          className="w-full px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400">Upload Watermark Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleWatermarkImageUpload}
                          className="w-full text-[10px] p-1 bg-white dark:bg-slate-900 border rounded-md"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col space-y-0.5">
                        <span className="text-[10px] text-slate-500">Opacity: {watermarkOpacity}%</span>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={watermarkOpacity}
                          onChange={(e) => setWatermarkOpacity(parseInt(e.target.value))}
                          className="w-full accent-sky-600"
                        />
                      </div>
                      <div className="flex flex-col space-y-0.5">
                        <span className="text-[10px] text-slate-500">Scale: {watermarkScale}%</span>
                        <input
                          type="range"
                          min="20"
                          max="200"
                          value={watermarkScale}
                          onChange={(e) => setWatermarkScale(parseInt(e.target.value))}
                          className="w-full accent-sky-600"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <span className="text-[10px] font-bold text-slate-400">Position</span>
                      <select
                        value={watermarkPosition}
                        onChange={(e) => setWatermarkPosition(e.target.value)}
                        className="px-2 py-1 text-xs bg-white dark:bg-slate-900 border rounded-md"
                      >
                        <option value="center">Centered (Rotated)</option>
                        <option value="top-left">Top Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom-right">Bottom Right</option>
                        <option value="tile">Repeating Grid (Tile)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: METADATA & COLORS */}
            {activeTab === 'metadata' && (
              <div className="space-y-4 text-xs">
                {/* Palette Extractor */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-slate-850 dark:text-slate-200">Dominant Color Palette</h4>
                  <div className="grid grid-cols-6 gap-1.5">
                    {extractedPalette.map((color, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setNewTextColor(color);
                          setBrushColor(color);
                          navigator.clipboard.writeText(color);
                        }}
                        className="h-8 rounded-lg cursor-pointer transition-transform hover:scale-110 active:scale-95 border border-slate-200/50 dark:border-slate-800 flex items-center justify-center relative group"
                        style={{ backgroundColor: color }}
                        title={`Copy ${color}`}
                      >
                        <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[9px] font-mono py-0.5 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-md">
                          {color}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color picker from image */}
                <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Pixel Color Picker</span>
                    <button
                      onClick={() => setColorPickerActive(!colorPickerActive)}
                      className={`text-[10px] font-bold px-2 py-1 rounded transition-all ${
                        colorPickerActive
                          ? 'bg-amber-500 text-white animate-pulse'
                          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {colorPickerActive ? 'Click on Canvas!' : 'Pick Color'}
                    </button>
                  </div>
                  {pickedColor && (
                    <div className="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-950 border rounded-lg">
                      <div className="w-5 h-5 rounded border shadow-sm" style={{ backgroundColor: pickedColor }} />
                      <span className="font-mono text-xs text-slate-800 dark:text-slate-200 font-bold uppercase">{pickedColor}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(pickedColor)}
                        className="text-[9px] text-sky-600 hover:underline font-bold ml-auto"
                      >
                        Copy HEX
                      </button>
                    </div>
                  )}
                </div>

                {/* Local Metadata Analyzer */}
                <div className="space-y-1 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                  <h4 className="text-xs font-extrabold text-slate-850 dark:text-slate-200">Image Metadata View</h4>
                  <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-2.5 border border-slate-100 dark:border-slate-850 space-y-1.5 font-mono text-[10px] max-h-[140px] overflow-y-auto pr-1">
                    {metaInfo.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span className="font-bold">{item.label}:</span>
                        <span className="text-slate-800 dark:text-slate-200 truncate max-w-[150px]">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB FOOTER: COMPRESSION & DOWNLOAD SETTINGS */}
            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-850 dark:text-slate-200">Export & Quality control</h4>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex flex-col space-y-1">
                  <span className="text-[10px] font-bold text-slate-500">File Format</span>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="px-2 py-1 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-350"
                  >
                    <option value="image/png">PNG (Lossless)</option>
                    <option value="image/jpeg">JPG / JPEG (Lossy)</option>
                    <option value="image/webp">WebP (Efficient)</option>
                  </select>
                </div>

                {exportFormat !== 'image/png' && (
                  <div className="flex flex-col space-y-1">
                    <span className="text-[10px] font-bold text-slate-500">Quality: {exportQuality}%</span>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={exportQuality}
                      onChange={(e) => setExportQuality(parseInt(e.target.value))}
                      className="w-full accent-sky-600"
                    />
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-650 dark:text-slate-450 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={stripMetadata}
                  onChange={(e) => setStripMetadata(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <span className="flex items-center gap-1">
                  Strip Exif & Privacy Metadata <Shield className="w-3.5 h-3.5 text-emerald-500" />
                </span>
              </label>

              <button
                onClick={triggerExport}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export & Download Image</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
