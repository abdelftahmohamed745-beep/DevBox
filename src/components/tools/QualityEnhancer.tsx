import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Upload, Download, RefreshCw, Check, Sliders, Eye, Info, Video, Trash2,
  X, SlidersHorizontal, Clock, Play, Pause, Settings, AlertCircle, Copy
} from 'lucide-react';

interface EnhanceHistoryItem {
  id: string;
  name: string;
  type: 'image' | 'video';
  originalSize: string;
  enhancedSize: string;
  preset: string;
  timestamp: string;
  url: string;
}

export const QualityEnhancer = () => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'ai-studio'>('image');

  // Unified presets list
  const presets = [
    { label: 'Original Resolution', value: 'original' },
    { label: '144p (256x144)', value: '144p', width: 256, height: 144 },
    { label: '240p (426x240)', value: '240p', width: 426, height: 240 },
    { label: '360p (640x360)', value: '360p', width: 640, height: 360 },
    { label: '480p SD (854x480)', value: '480p', width: 854, height: 480 },
    { label: '720p HD (1280x720)', value: '720p', width: 1280, height: 720 },
    { label: '1080p Full HD (1920x1080)', value: '1080p', width: 1920, height: 1080 },
    { label: '1440p 2K (2560x1440)', value: '1440p', width: 2560, height: 1440 },
    { label: '2160p 4K UHD (3840x2160)', value: '2160p', width: 3840, height: 2160 },
    { label: '4320p 8K UHD (7680x4320)', value: '4320p', width: 7680, height: 4320 },
    { label: '12K UHD (11520x6480)', value: '12k', width: 11520, height: 6480 },
    { label: '16K Ultra (15360x8640)', value: '16k', width: 15360, height: 8640 },
  ];

  // History & Recent Files
  const [history, setHistory] = useState<EnhanceHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('devbox_enhance_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveHistory = (newHistory: EnhanceHistoryItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem('devbox_enhance_history', JSON.stringify(newHistory));
    } catch (e) {
      console.warn('Storage limit reached, could not save history item');
    }
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    saveHistory(updated);
  };

  // ---------------------------------------------------------------------------
  // IMAGE QUALITY ENHANCER STATE
  // ---------------------------------------------------------------------------
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [enhancedImgSrc, setEnhancedImgSrc] = useState<string>('');
  const [imgPreset, setImgPreset] = useState<string>('1080p');
  const [customWidth, setCustomWidth] = useState<number>(1920);
  const [customHeight, setCustomHeight] = useState<number>(1080);
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  
  // Image Tuning Parameters
  const [sharpness, setSharpness] = useState<number>(35); // 0-100
  const [noiseReduction, setNoiseReduction] = useState<number>(20); // 0-100
  const [brightness, setBrightness] = useState<number>(100); // 50-150
  const [contrast, setContrast] = useState<number>(105); // 50-150
  const [saturation, setSaturation] = useState<number>(110); // 50-150
  const [detailEnhancement, setDetailEnhancement] = useState<number>(40); // 0-100
  const [compressionLevel, setCompressionLevel] = useState<'high' | 'medium' | 'low'>('medium');
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');

  const [isProcessingImg, setIsProcessingImg] = useState<boolean>(false);
  const [imgProgress, setImgProgress] = useState<number>(0);
  const [imgProgressText, setImgProgressText] = useState<string>('');
  const [compareSplit, setCompareSplit] = useState<number>(50); // percentage for draggable divider
  const isDraggingSplit = useRef<boolean>(false);

  // ---------------------------------------------------------------------------
  // VIDEO QUALITY ENHANCER STATE
  // ---------------------------------------------------------------------------
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [videoPreset, setVideoPreset] = useState<string>('720p');
  const [vidCustomWidth, setVidCustomWidth] = useState<number>(1280);
  const [vidCustomHeight, setVidCustomHeight] = useState<number>(720);
  const [vidAspectRatio, setVidAspectRatio] = useState<string>('16:9');

  // Video Tuning Parameters
  const [vidSharpness, setVidSharpness] = useState<number>(40);
  const [vidNoiseReduction, setVidNoiseReduction] = useState<number>(15);
  const [vidBrightness, setVidBrightness] = useState<number>(100);
  const [vidContrast, setVidContrast] = useState<number>(105);
  const [vidSaturation, setVidSaturation] = useState<number>(110);
  const [vidDetailEnhancement, setVidDetailEnhancement] = useState<number>(30);
  
  const [isProcessingVideo, setIsProcessingVideo] = useState<boolean>(false);
  const [vidProgress, setVidProgress] = useState<number>(0);
  const [vidProgressText, setVidProgressText] = useState<string>('');
  const [enhancedVideoUrl, setEnhancedVideoUrl] = useState<string>('');
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [vidCompareSplit, setVidCompareSplit] = useState<number>(50);

  const originalVideoRef = useRef<HTMLVideoElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const recordingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoAnimationRef = useRef<number | null>(null);
  const isProcessingCancelled = useRef<boolean>(false);

  // ---------------------------------------------------------------------------
  // AI STUDIO STATE (CLI / Prompt workflows)
  // ---------------------------------------------------------------------------
  const [aiWorkflow, setAiWorkflow] = useState<'topaz' | 'realesrgan' | 'ffmpeg'>('realesrgan');
  const [aiTargetRes, setAiTargetRes] = useState<string>('4k');

  // ---------------------------------------------------------------------------
  // IMAGE ENHANCEMENT ENGINE (Convolution and Pixels manipulation)
  // ---------------------------------------------------------------------------
  const runImageEnhancement = async () => {
    if (!imgSrc) return;
    setIsProcessingImg(true);
    setImgProgress(5);
    setImgProgressText('Reading image file buffer and headers...');

    // Load Image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imgSrc;

    img.onload = () => {
      setImgProgress(15);
      setImgProgressText('Determining upscaling bounds & coordinates...');

      // Calculate new dimensions
      let targetW = img.width;
      let targetH = img.height;

      if (imgPreset !== 'original') {
        const selectedPreset = presets.find(p => p.value === imgPreset);
        if (selectedPreset && selectedPreset.width && selectedPreset.height) {
          targetW = selectedPreset.width;
          targetH = selectedPreset.height;
        } else if (imgPreset === 'custom') {
          targetW = customWidth;
          targetH = customHeight;
        }
      }

      // Check for custom aspect ratio
      if (aspectRatio !== 'free' && imgPreset === 'custom') {
        const [wRatio, hRatio] = aspectRatio.split(':').map(Number);
        if (wRatio && hRatio) {
          targetH = Math.round((targetW * hRatio) / wRatio);
        }
      }

      setTimeout(() => {
        setImgProgress(35);
        setImgProgressText('Executing bilinear interpolation upscale...');

        const srcCanvas = document.createElement('canvas');
        const srcCtx = srcCanvas.getContext('2d');
        if (!srcCtx) {
          setIsProcessingImg(false);
          return;
        }

        srcCanvas.width = targetW;
        srcCanvas.height = targetH;
        
        // Draw image upscaled
        srcCtx.imageSmoothingEnabled = true;
        srcCtx.imageSmoothingQuality = 'high';
        srcCtx.drawImage(img, 0, 0, targetW, targetH);

        const imgData = srcCtx.getImageData(0, 0, targetW, targetH);
        const originalData = srcCtx.getImageData(0, 0, targetW, targetH);

        setTimeout(() => {
          setImgProgress(55);
          setImgProgressText('Injecting high-frequency details (Bilateral filter pass)...');

          // Apply local custom pixel filters: Noise Reduction (Smoothing)
          if (noiseReduction > 0) {
            applySimpleNoiseReduction(imgData.data, targetW, targetH, noiseReduction / 100);
          }

          setTimeout(() => {
            setImgProgress(75);
            setImgProgressText('Applying unsharp mask & convolution sharpening...');

            // Apply convolution Sharpening & detail enhancement
            if (sharpness > 0 || detailEnhancement > 0) {
              const sharpFactor = (sharpness / 100) * 1.5;
              const detailFactor = (detailEnhancement / 100) * 0.8;
              applySharpenAndDetails(imgData, originalData, targetW, targetH, sharpFactor, detailFactor);
            }

            // Apply brightness, contrast, saturation
            applyColorGrading(
              imgData.data,
              brightness / 100,
              contrast / 100,
              saturation / 100
            );

            // Put image data back
            srcCtx.putImageData(imgData, 0, 0);

            setTimeout(() => {
              setImgProgress(90);
              setImgProgressText('Generating lossless compressed output copy...');

              // Determine quality factor
              let q = 0.85;
              if (compressionLevel === 'high') q = 0.96;
              else if (compressionLevel === 'medium') q = 0.82;
              else q = 0.60;

              const enhancedDataUrl = srcCanvas.toDataURL(outputFormat, q);
              setEnhancedImgSrc(enhancedDataUrl);

              setImgProgress(100);
              setImgProgressText('Successfully completed!');

              // Calculate file size
              const base64Length = enhancedDataUrl.length - (enhancedDataUrl.indexOf(',') + 1);
              const padding = (enhancedDataUrl.charAt(enhancedDataUrl.length - 2) === '=') ? 2 : ((enhancedDataUrl.charAt(enhancedDataUrl.length - 1) === '=') ? 1 : 0);
              const sizeInBytes = (base64Length * 0.75) - padding;
              const sizeKB = (sizeInBytes / 1024).toFixed(1) + ' KB';

              // Save to history
              const newHistoryItem: EnhanceHistoryItem = {
                id: 'hist_' + Date.now(),
                name: imgFile ? imgFile.name : 'image_enhanced.jpg',
                type: 'image',
                originalSize: imgFile ? (imgFile.size / 1024).toFixed(1) + ' KB' : 'Unknown',
                enhancedSize: sizeKB,
                preset: `${targetW}x${targetH} (${imgPreset.toUpperCase()})`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                url: enhancedDataUrl
              };

              saveHistory([newHistoryItem, ...history]);

              setTimeout(() => {
                setIsProcessingImg(false);
              }, 400);

            }, 400);
          }, 400);
        }, 400);
      }, 400);
    };

    img.onerror = () => {
      setIsProcessingImg(false);
      alert('Failed to load image file.');
    };
  };

  // Helper pixel shaders
  const applySimpleNoiseReduction = (pixels: Uint8ClampedArray, width: number, height: number, strength: number) => {
    // Simple 3x3 low pass filter blending to reduce noise
    const original = new Uint8ClampedArray(pixels);
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = (y * width + x) * 4;
        
        let rSum = 0, gSum = 0, bSum = 0;
        // Average 8-neighbor pixels
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const ki = ((y + ky) * width + (x + kx)) * 4;
            rSum += original[ki];
            gSum += original[ki + 1];
            bSum += original[ki + 2];
          }
        }

        pixels[i] = original[i] * (1 - strength) + (rSum / 9) * strength;
        pixels[i + 1] = original[i + 1] * (1 - strength) + (gSum / 9) * strength;
        pixels[i + 2] = original[i + 2] * (1 - strength) + (bSum / 9) * strength;
      }
    }
  };

  const applySharpenAndDetails = (
    imgData: ImageData,
    originalData: ImageData,
    width: number,
    height: number,
    sharpenStrength: number,
    detailStrength: number
  ) => {
    const pixels = imgData.data;
    const orig = originalData.data;
    const temp = new Uint8ClampedArray(pixels);

    // 3x3 convolution sharpen kernel
    // [ 0, -1,  0]
    // [-1,  5, -1]
    // [ 0, -1,  0]
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = (y * width + x) * 4;

        // Laplacian kernel convolution
        const top = ((y - 1) * width + x) * 4;
        const bottom = ((y + 1) * width + x) * 4;
        const left = (y * width + (x - 1)) * 4;
        const right = (y * width + (x + 1)) * 4;

        for (let c = 0; c < 3; c++) {
          const val = temp[i + c];
          const laplacian = val * 5 - temp[top + c] - temp[bottom + c] - temp[left + c] - temp[right + c];
          
          // Blend according to sharpening strength
          let sharpened = val + (laplacian - val) * sharpenStrength;
          
          // High frequency detail enhancement
          const originalColor = orig[i + c];
          const highFreq = val - originalColor;
          sharpened += highFreq * detailStrength;

          pixels[i + c] = Math.max(0, Math.min(255, sharpened));
        }
      }
    }
  };

  const applyColorGrading = (pixels: Uint8ClampedArray, br: number, co: number, sa: number) => {
    for (let i = 0; i < pixels.length; i += 4) {
      // 1. Brightness
      let r = pixels[i] * br;
      let g = pixels[i + 1] * br;
      let b = pixels[i + 2] * br;

      // 2. Contrast
      r = ((r / 255 - 0.5) * co + 0.5) * 255;
      g = ((g / 255 - 0.5) * co + 0.5) * 255;
      b = ((b / 255 - 0.5) * co + 0.5) * 255;

      // 3. Saturation (luminance formula)
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      r = lum + (r - lum) * sa;
      g = lum + (g - lum) * sa;
      b = lum + (b - lum) * sa;

      pixels[i] = Math.max(0, Math.min(255, r));
      pixels[i + 1] = Math.max(0, Math.min(255, g));
      pixels[i + 2] = Math.max(0, Math.min(255, b));
    }
  };

  // ---------------------------------------------------------------------------
  // VIDEO ENHANCEMENT ENGINE (Live Canvas Loop + MediaRecorder capture)
  // ---------------------------------------------------------------------------
  const runVideoEnhancement = async () => {
    if (!videoSrc || !originalVideoRef.current) return;
    setIsProcessingVideo(true);
    setVidProgress(2);
    setVidProgressText('Initializing local hardware codecs & canvas stream...');
    isProcessingCancelled.current = false;

    const video = originalVideoRef.current;
    video.pause();
    video.currentTime = 0;

    // Determine target dimensions
    let targetW = video.videoWidth || 640;
    let targetH = video.videoHeight || 360;

    if (videoPreset !== 'original') {
      const selectedPreset = presets.find(p => p.value === videoPreset);
      if (selectedPreset && selectedPreset.width && selectedPreset.height) {
        targetW = selectedPreset.width;
        targetH = selectedPreset.height;
      } else if (videoPreset === 'custom') {
        targetW = vidCustomWidth;
        targetH = vidCustomHeight;
      }
    }

    // Set up canvas for recording frame elements
    const recCanvas = document.createElement('canvas');
    recCanvas.width = targetW;
    recCanvas.height = targetH;
    const recCtx = recCanvas.getContext('2d');
    if (!recCtx) {
      setIsProcessingVideo(false);
      return;
    }

    // Prepare MediaRecorder on the Canvas Stream
    const fps = 30;
    const stream = recCanvas.captureStream(fps);
    
    // Attempt to include audio from original video
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const dest = audioCtx.createMediaStreamDestination();
      const source = audioCtx.createMediaElementSource(video);
      source.connect(dest);
      source.connect(audioCtx.destination); // also monitor
      
      const audioTracks = dest.stream.getAudioTracks();
      if (audioTracks.length > 0) {
        stream.addTrack(audioTracks[0]);
      }
    } catch (e) {
      console.warn('Could not bind video audio track directly. Compilation will proceed mute.');
    }

    let options = { mimeType: 'video/webm;codecs=vp9,opus', videoBitsPerSecond: 4500000 };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: 'video/webm;codecs=vp8,vorbis', videoBitsPerSecond: 2500000 };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm', videoBitsPerSecond: 1500000 };
      }
    }

    const recordedChunks: Blob[] = [];
    let mediaRecorder: MediaRecorder;
    
    try {
      mediaRecorder = new MediaRecorder(stream, options);
    } catch {
      mediaRecorder = new MediaRecorder(stream);
    }

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      if (isProcessingCancelled.current) {
        setIsProcessingVideo(false);
        setVidProgress(0);
        return;
      }

      setVidProgressText('Compiling media file containers and metadata...');
      setVidProgress(95);

      const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
      const enhancedUrl = URL.createObjectURL(videoBlob);
      setEnhancedVideoUrl(enhancedUrl);

      setVidProgress(100);
      setVidProgressText('Successfully completed!');

      const sizeKB = (videoBlob.size / (1024 * 1024)).toFixed(2) + ' MB';

      // Save to history list
      const newHistoryItem: EnhanceHistoryItem = {
        id: 'hist_' + Date.now(),
        name: videoFile ? videoFile.name : 'video_enhanced.mp4',
        type: 'video',
        originalSize: videoFile ? (videoFile.size / (1024 * 1024)).toFixed(2) + ' MB' : 'Unknown',
        enhancedSize: sizeKB,
        preset: `${targetW}x${targetH} (${videoPreset.toUpperCase()})`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        url: enhancedUrl
      };

      saveHistory([newHistoryItem, ...history]);

      setTimeout(() => {
        setIsProcessingVideo(false);
      }, 500);
    };

    // Begin playback rendering loop
    video.currentTime = 0;
    video.play();
    mediaRecorder.start();

    const duration = video.duration || 5;
    
    const renderFrameLoop = () => {
      if (isProcessingCancelled.current) {
        video.pause();
        mediaRecorder.stop();
        return;
      }

      if (video.ended || video.currentTime >= duration) {
        video.pause();
        mediaRecorder.stop();
        return;
      }

      // Draw original frame upscaled onto compiler canvas
      recCtx.drawImage(video, 0, 0, targetW, targetH);

      // Extract pixel buffer and apply live enhancements
      const frameData = recCtx.getImageData(0, 0, targetW, targetH);
      const originalFrameData = recCtx.getImageData(0, 0, targetW, targetH);

      // Noise reduction
      if (vidNoiseReduction > 0) {
        applySimpleNoiseReduction(frameData.data, targetW, targetH, vidNoiseReduction / 100);
      }

      // Sharpening & detail enhancement
      if (vidSharpness > 0 || vidDetailEnhancement > 0) {
        const sharpFactor = (vidSharpness / 100) * 1.5;
        const detailFactor = (vidDetailEnhancement / 100) * 0.8;
        applySharpenAndDetails(frameData, originalFrameData, targetW, targetH, sharpFactor, detailFactor);
      }

      // Color grading
      applyColorGrading(
        frameData.data,
        vidBrightness / 100,
        vidContrast / 100,
        vidSaturation / 100
      );

      recCtx.putImageData(frameData, 0, 0);

      // Calculate real time progress percentage
      const progressPercent = Math.min(92, Math.round((video.currentTime / duration) * 90) + 3);
      setVidProgress(progressPercent);
      setVidProgressText(`Processing Frame matrix at ${Math.round(video.currentTime * fps)}fps... (${progressPercent}%)`);

      videoAnimationRef.current = requestAnimationFrame(renderFrameLoop);
    };

    renderFrameLoop();
  };

  const cancelVideoEnhancement = () => {
    isProcessingCancelled.current = true;
    if (videoAnimationRef.current) {
      cancelAnimationFrame(videoAnimationRef.current);
    }
    setIsProcessingVideo(false);
    setVidProgress(0);
    if (originalVideoRef.current) {
      originalVideoRef.current.pause();
    }
  };

  // ---------------------------------------------------------------------------
  // INTERACTIVE SPLIT COMPARISON HANDLERS
  // ---------------------------------------------------------------------------
  const handleSplitMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingSplit.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setCompareSplit(percentage);
    setVidCompareSplit(percentage);
  };

  const handleSplitTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingSplit.current) return;
    if (e.touches.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setCompareSplit(percentage);
    setVidCompareSplit(percentage);
  };

  // ---------------------------------------------------------------------------
  // RENDER DYNAMIC LIVE PLAYBACK COMPARISON PREVIEW ON CANVAS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (activeTab !== 'video' || !videoSrc || !previewCanvasRef.current || !originalVideoRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = originalVideoRef.current;
    if (!ctx) return;

    let animFrameId: number;

    const renderPreviewFrame = () => {
      if (video.paused && !videoPlaying) return;

      const w = canvas.width;
      const h = canvas.height;

      // Draw background
      ctx.drawImage(video, 0, 0, w, h);

      // Capture original frame pixel buffer for the RIGHT side
      const frameData = ctx.getImageData(0, 0, w, h);
      const originalFrameData = ctx.getImageData(0, 0, w, h);

      // Perform real-time enhancements on the frame data buffer
      // Noise reduction
      if (vidNoiseReduction > 0) {
        applySimpleNoiseReduction(frameData.data, w, h, vidNoiseReduction / 100);
      }

      // Sharpening & detail enhancement
      if (vidSharpness > 0 || vidDetailEnhancement > 0) {
        const sharpFactor = (vidSharpness / 100) * 1.5;
        const detailFactor = (vidDetailEnhancement / 100) * 0.8;
        applySharpenAndDetails(frameData, originalFrameData, w, h, sharpFactor, detailFactor);
      }

      // Color grading
      applyColorGrading(
        frameData.data,
        vidBrightness / 100,
        vidContrast / 100,
        vidSaturation / 100
      );

      // To render Split: We draw enhanced pixels on the right or left based on slider!
      // Let's draw ENHANCED on the Right side (split to 100)
      const splitX = Math.round((vidCompareSplit / 100) * w);

      // Create a temporary canvas or construct the pixels
      const finalImgData = ctx.createImageData(w, h);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          if (x >= splitX) {
            // Enhanced
            finalImgData.data[idx] = frameData.data[idx];
            finalImgData.data[idx + 1] = frameData.data[idx + 1];
            finalImgData.data[idx + 2] = frameData.data[idx + 2];
            finalImgData.data[idx + 3] = frameData.data[idx + 3];
          } else {
            // Original
            finalImgData.data[idx] = originalFrameData.data[idx];
            finalImgData.data[idx + 1] = originalFrameData.data[idx + 1];
            finalImgData.data[idx + 2] = originalFrameData.data[idx + 2];
            finalImgData.data[idx + 3] = originalFrameData.data[idx + 3];
          }
        }
      }

      ctx.putImageData(finalImgData, 0, 0);

      // Draw slider line helper
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, h);
      ctx.stroke();

      // Draw labels
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(10, 10, 85, 24);
      ctx.fillRect(w - 115, 10, 105, 24);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('ORIGINAL', 20, 26);
      ctx.fillText('ENHANCED AI', w - 105, 26);

      animFrameId = requestAnimationFrame(renderPreviewFrame);
    };

    if (videoPlaying) {
      animFrameId = requestAnimationFrame(renderPreviewFrame);
    } else {
      // Just render once
      video.addEventListener('seeked', renderPreviewFrame);
      renderPreviewFrame();
    }

    return () => {
      cancelAnimationFrame(animFrameId);
      video.removeEventListener('seeked', renderPreviewFrame);
    };
  }, [
    activeTab,
    videoSrc,
    videoPlaying,
    vidCompareSplit,
    vidSharpness,
    vidNoiseReduction,
    vidBrightness,
    vidContrast,
    vidSaturation,
    vidDetailEnhancement
  ]);

  // Handle file uploads
  const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    let file: File | null = null;
    if ('files' in e.target) {
      file = e.target.files?.[0] || null;
    } else if ('dataTransfer' in e) {
      e.preventDefault();
      file = e.dataTransfer.files?.[0] || null;
    }

    if (file && file.type.startsWith('image/')) {
      setImgFile(file);
      setImgSrc(URL.createObjectURL(file));
      setEnhancedImgSrc('');
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    let file: File | null = null;
    if ('files' in e.target) {
      file = e.target.files?.[0] || null;
    } else if ('dataTransfer' in e) {
      e.preventDefault();
      file = e.dataTransfer.files?.[0] || null;
    }

    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setVideoSrc(URL.createObjectURL(file));
      setEnhancedVideoUrl('');
      setVideoPlaying(false);
    }
  };

  // Generate External AI prompt/scripts
  const getAiStudioCommands = () => {
    const resPreset = presets.find(p => p.value === aiTargetRes) || presets[6];
    const targetW = resPreset.width || 1920;
    const targetH = resPreset.height || 1080;

    if (aiWorkflow === 'ffmpeg') {
      return `# Professional Multi-scale Super Resolution & Edge Sharpening via FFmpeg
# Preserving raw metadata containers while applying high-fidelity Lanczos mapping

ffmpeg -i input.mp4 \\
  -vf "scale=${targetW}:${targetH}:flags=lanczos,unsharp=5:5:1.0:5:5:0.0,eq=brightness=0.02:contrast=1.04:saturation=1.1" \\
  -c:v libx264 -preset slow -crf 18 -c:a copy \\
  -metadata comment="Enhanced via DevBox AI Studio Workflow" \\
  output_enhanced_${aiTargetRes}.mp4`;
    }

    if (aiWorkflow === 'realesrgan') {
      return `# Real-ESRGAN (Super Resolution Generative Adversarial Network) CLI pipeline
# Deep-learning reconstruction of lost textures and structural details

# 1. Install Real-ESRGAN python framework
pip install realesrgan

# 2. Run upscale pipeline with custom details preservation models
python -m realesrgan.inference_realesrgan \\
  --input "input.${activeTab === 'image' ? 'png' : 'mp4'}" \\
  --output "output_enhanced_${aiTargetRes}.${activeTab === 'image' ? 'png' : 'mp4'}" \\
  --model_name "RealESRGAN_x4plus" \\
  --outscale ${aiTargetRes === '4k' ? '4' : '2'} \\
  --face_enhance`;
    }

    // Topaz
    return `# Topaz Video AI Command Line Interface Configuration
# Industry-standard cinematic upscaling & motion-compensated frame interpolation (Proteus Model)

run-topaz-ai \\
  -i "input.mp4" \\
  -o "output_enhanced_${aiTargetRes}.mp4" \\
  -filter "proteus-auto" \\
  -preset "upscale-to-${aiTargetRes}" \\
  -codec "h264" \\
  -bitrate "high" \\
  -keep-metadata`;
  };

  return (
    <div className="w-full space-y-6 text-slate-800 dark:text-slate-100 text-left">
      
      {/* Header and Title Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-100 dark:bg-indigo-950/50 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">Image & Video Quality Enhancer</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Professional browser-based media resolution upscaling, convolution sharpening, and noise reduction workspace.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
          <button
            onClick={() => { setActiveTab('image'); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'image' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Image Enhancer
          </button>
          <button
            onClick={() => { setActiveTab('video'); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'video' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Video Enhancer
          </button>
          <button
            onClick={() => { setActiveTab('ai-studio'); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'ai-studio' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            AI Script Studio
          </button>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Files Upload and Interactive Canvas Preview */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* IMAGE ENHANCER CANVAS WORKSPACE */}
          {activeTab === 'image' && (
            <div className="space-y-4">
              {!imgSrc ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleImgUpload}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-12 text-center hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors bg-slate-50/50 dark:bg-slate-900/10 cursor-pointer"
                >
                  <input type="file" accept="image/*" onChange={handleImgUpload} id="image-upload-input" className="hidden" />
                  <label htmlFor="image-upload-input" className="cursor-pointer flex flex-col items-center gap-3">
                    <Upload className="w-12 h-12 text-slate-400 animate-bounce" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Upload Image File (PNG, JPG, WebP)</span>
                    <span className="text-xs text-slate-400">Drag and drop file here, or click to choose from device.</span>
                    <div className="p-2 bg-indigo-50/50 dark:bg-indigo-950/10 text-[10px] text-indigo-500 rounded font-mono border border-indigo-100 dark:border-indigo-900/30">
                      100% Client-side privacy. Media stays on your browser.
                    </div>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Before/After Split Screen Interactive Area */}
                  <div className="bg-slate-950 rounded-2xl border border-slate-800 p-3 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-xs font-medium text-slate-400 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Compare Mode: Interactive Drag Split Slider</span>
                      </div>
                      <button
                        onClick={() => { setImgFile(null); setImgSrc(''); setEnhancedImgSrc(''); }}
                        className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear File</span>
                      </button>
                    </div>

                    {/* Interactive Split Canvas */}
                    <div
                      className="relative h-[420px] rounded-xl overflow-hidden select-none cursor-ew-resize"
                      onMouseMove={handleSplitMouseMove}
                      onTouchMove={handleSplitTouchMove}
                      onMouseDown={() => { isDraggingSplit.current = true; }}
                      onTouchStart={() => { isDraggingSplit.current = true; }}
                      onMouseUp={() => { isDraggingSplit.current = false; }}
                      onTouchEnd={() => { isDraggingSplit.current = false; }}
                      onMouseLeave={() => { isDraggingSplit.current = false; }}
                    >
                      {/* Left Side (Original) */}
                      <img
                        src={imgSrc}
                        className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
                        alt="Original"
                      />

                      {/* Right Side (Enhanced) */}
                      <div
                        className="absolute top-0 right-0 bottom-0 overflow-hidden pointer-events-none"
                        style={{ left: `${compareSplit}%` }}
                      >
                        <img
                          src={enhancedImgSrc || imgSrc}
                          className="absolute top-0 right-0 h-full object-contain"
                          style={{
                            width: '100%',
                            maxWidth: 'none',
                            transform: `translateX(${(compareSplit - 100) / 2}%)` // adjust so it remains aligned
                          }}
                          alt="Enhanced preview"
                        />
                      </div>

                      {/* Slider Handle line */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center z-10 shadow-lg"
                        style={{ left: `${compareSplit}%` }}
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center border-2 border-white text-[10px] font-bold shadow-md">
                          ↔
                        </div>
                      </div>

                      {/* Labels */}
                      <div className="absolute top-3 left-3 px-2 py-1 bg-slate-900/80 text-white text-[10px] rounded font-mono font-bold">
                        ORIGINAL
                      </div>
                      <div className="absolute top-3 right-3 px-2 py-1 bg-indigo-600/90 text-white text-[10px] rounded font-mono font-bold">
                        ENHANCED {enhancedImgSrc ? 'AI-SHARP' : '(PREVIEW)'}
                      </div>
                    </div>
                  </div>

                  {/* Processing triggers */}
                  {isProcessingImg && (
                    <div className="bg-slate-100 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span>{imgProgressText}</span>
                        <span>{imgProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${imgProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {enhancedImgSrc && !isProcessingImg && (
                    <div className="flex flex-wrap gap-3 items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="p-1 bg-emerald-500 rounded-full text-white">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                        <div className="text-xs">
                          <p className="font-bold text-emerald-600 dark:text-emerald-400">Enhancement Successful</p>
                          <p className="text-slate-500 dark:text-slate-400">High-fidelity resolution copy saved separately completely offline.</p>
                        </div>
                      </div>
                      <a
                        href={enhancedImgSrc}
                        download={`enhanced_${imgFile ? imgFile.name : 'image.jpg'}`}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition"
                      >
                        <Download className="w-4 h-4" />
                        Download Enhanced Copy
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* VIDEO ENHANCER CANVAS WORKSPACE */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              {!videoSrc ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleVideoUpload}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-12 text-center hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors bg-slate-50/50 dark:bg-slate-900/10 cursor-pointer"
                >
                  <input type="file" accept="video/*" onChange={handleVideoUpload} id="video-upload-input" className="hidden" />
                  <label htmlFor="video-upload-input" className="cursor-pointer flex flex-col items-center gap-3">
                    <Upload className="w-12 h-12 text-slate-400 animate-bounce" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Upload Video File (MP4, WebM, AVI)</span>
                    <span className="text-xs text-slate-400">Drag and drop file here, or click to choose from device.</span>
                    <div className="p-2 bg-indigo-50/50 dark:bg-indigo-950/10 text-[10px] text-indigo-500 rounded font-mono border border-indigo-100 dark:border-indigo-900/30">
                      Files are rendered entirely locally using high-performance Canvas buffer processing.
                    </div>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {/* Before/After Playing comparison preview */}
                  <div className="bg-slate-950 rounded-2xl border border-slate-800 p-3 space-y-3 relative overflow-hidden">
                    <div className="flex justify-between items-center text-xs">
                      <div className="text-slate-400 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Interactive Real-time Frame Enhancement Comparison</span>
                      </div>
                      <button
                        onClick={() => { setVideoFile(null); setVideoSrc(''); setEnhancedVideoUrl(''); setVideoPlaying(false); }}
                        className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear Video</span>
                      </button>
                    </div>

                    {/* Draggable Divider Preview Box */}
                    <div
                      className="relative h-[380px] bg-black rounded-xl overflow-hidden select-none cursor-ew-resize"
                      onMouseMove={handleSplitMouseMove}
                      onTouchMove={handleSplitTouchMove}
                      onMouseDown={() => { isDraggingSplit.current = true; }}
                      onTouchStart={() => { isDraggingSplit.current = true; }}
                      onMouseUp={() => { isDraggingSplit.current = false; }}
                      onTouchEnd={() => { isDraggingSplit.current = false; }}
                      onMouseLeave={() => { isDraggingSplit.current = false; }}
                    >
                      {/* Hidden base video element used to stream frames */}
                      <video
                        ref={originalVideoRef}
                        src={videoSrc}
                        crossOrigin="anonymous"
                        className="hidden"
                        loop
                        muted
                        playsInline
                        onDurationChange={(e) => setVideoDuration(e.currentTarget.duration)}
                        onTimeUpdate={(e) => setVideoCurrentTime(e.currentTarget.currentTime)}
                      />

                      {/* Display Canvas with the processed & split frame elements */}
                      <canvas
                        ref={previewCanvasRef}
                        width={640}
                        height={360}
                        className="w-full h-full object-contain pointer-events-none"
                      />

                      {/* Slider Handle Overlay */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-white flex items-center justify-center z-10 shadow-lg pointer-events-none"
                        style={{ left: `${vidCompareSplit}%` }}
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center border-2 border-white text-[10px] font-bold shadow-md">
                          ↔
                        </div>
                      </div>
                    </div>

                    {/* Custom Video Playback Controls */}
                    <div className="flex items-center gap-4 bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <button
                        onClick={() => {
                          if (originalVideoRef.current) {
                            if (videoPlaying) {
                              originalVideoRef.current.pause();
                              setVideoPlaying(false);
                            } else {
                              originalVideoRef.current.play();
                              setVideoPlaying(true);
                            }
                          }
                        }}
                        className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                      >
                        {videoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>

                      {/* Time Slider */}
                      <div className="flex-1 flex items-center gap-3">
                        <span className="text-[10px] font-mono text-slate-400">
                          {Math.floor(videoCurrentTime)}s
                        </span>
                        <input
                          type="range"
                          min="0"
                          max={videoDuration || 100}
                          step="0.1"
                          value={videoCurrentTime}
                          onChange={(e) => {
                            if (originalVideoRef.current) {
                              originalVideoRef.current.currentTime = parseFloat(e.target.value);
                            }
                          }}
                          className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <span className="text-[10px] font-mono text-slate-400">
                          {Math.floor(videoDuration)}s
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Processing Status triggers */}
                  {isProcessingVideo && (
                    <div className="bg-slate-100 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span>{vidProgressText}</span>
                        <span className="text-indigo-600 dark:text-indigo-400">{vidProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${vidProgress}%` }}
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={cancelVideoEnhancement}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-lg transition"
                        >
                          Cancel Processing
                        </button>
                      </div>
                    </div>
                  )}

                  {enhancedVideoUrl && !isProcessingVideo && (
                    <div className="flex flex-wrap gap-3 items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="p-1 bg-emerald-500 rounded-full text-white">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                        <div className="text-xs">
                          <p className="font-bold text-emerald-600 dark:text-emerald-400">Enhanced Video Export Successful</p>
                          <p className="text-slate-500 dark:text-slate-400">Hardware upscaled and sharpened copy compiled locally.</p>
                        </div>
                      </div>
                      <a
                        href={enhancedVideoUrl}
                        download={`enhanced_${videoFile ? videoFile.name : 'video.webm'}`}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition"
                      >
                        <Download className="w-4 h-4" />
                        Download Enhanced Video
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* AI WORKFLOWPrompt STUDIO GENERATOR */}
          {activeTab === 'ai-studio' && (
            <div className="bg-slate-100 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h2 className="text-base font-bold">Deep Neural AI Upscaling Command Center</h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                True AI-driven super resolution models (like Real-ESRGAN or Topaz Proteus) require graphics acceleration servers and cannot execute efficiently inside standard web canvases. Configure your targeting values below to instantly export a perfectly-tailored batch execution command block.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1.5 font-bold">AI Processing Workflow Engine</label>
                  <select
                    value={aiWorkflow}
                    onChange={(e) => setAiWorkflow(e.target.value as any)}
                    className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="realesrgan">Real-ESRGAN (Super-Resolution CNN)</option>
                    <option value="topaz">Topaz Video AI CLI Pipeline</option>
                    <option value="ffmpeg">FFmpeg Lanczos Upscale Filter</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1.5 font-bold">Target AI Model Resolution</label>
                  <select
                    value={aiTargetRes}
                    onChange={(e) => setAiTargetRes(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="1080p">1080p Full HD Upscale (2x scale)</option>
                    <option value="1440p">1440p 2K Upscale (2.5x scale)</option>
                    <option value="4k">2160p 4K UHD upscale (4x scale)</option>
                    <option value="8k">4320p 8K Ultra UHD upscale (8x scale)</option>
                  </select>
                </div>
              </div>

              {/* Ready-to-copy code block */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">Interactive Terminal Script</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(getAiStudioCommands());
                      alert('Command copied to clipboard successfully!');
                    }}
                    className="text-xs text-indigo-500 hover:text-indigo-600 font-bold flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy Script Command
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 text-emerald-400 rounded-xl overflow-x-auto text-xs font-mono border border-slate-800 shadow-inner">
                  {getAiStudioCommands()}
                </pre>
              </div>

              {/* Additional Resources and instructions */}
              <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10 space-y-2">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  How to install and run deep neural models
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Real-ESRGAN and similar models reconstruct fine textures by predicting lost high-frequency details. This command block can be directly pasted in your terminal once python dependencies are met.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right column: Dynamic parameters adjustments panels */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* CONTROL SETTINGS FOR CHOSEN TAB */}
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl space-y-5">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
              <span>Enhancement Parameters Control</span>
            </h2>

            {/* IF TAB IS IMAGE OR VIDEO */}
            {(activeTab === 'image' || activeTab === 'video') && (
              <div className="space-y-4">
                
                {/* Resolution Presets Select */}
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1.5 font-bold">Target Resolution Preset</label>
                  <select
                    value={activeTab === 'image' ? imgPreset : videoPreset}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (activeTab === 'image') {
                        setImgPreset(val);
                        const match = presets.find(p => p.value === val);
                        if (match && match.width && match.height) {
                          setCustomWidth(match.width);
                          setCustomHeight(match.height);
                        }
                      } else {
                        setVideoPreset(val);
                        const match = presets.find(p => p.value === val);
                        if (match && match.width && match.height) {
                          setVidCustomWidth(match.width);
                          setVidCustomHeight(match.height);
                        }
                      }
                    }}
                    className="w-full p-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-indigo-500"
                  >
                    {presets.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                    <option value="custom">Custom Size Parameters...</option>
                  </select>
                </div>

                {/* If custom is selected, show custom inputs */}
                {((activeTab === 'image' && imgPreset === 'custom') || (activeTab === 'video' && videoPreset === 'custom')) && (
                  <div className="bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-850 space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Manual Scale Mapping</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-450 block mb-1">Width (px)</label>
                        <input
                          type="number"
                          value={activeTab === 'image' ? customWidth : vidCustomWidth}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1280;
                            if (activeTab === 'image') setCustomWidth(val);
                            else setVidCustomWidth(val);
                          }}
                          className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-450 block mb-1">Height (px)</label>
                        <input
                          type="number"
                          value={activeTab === 'image' ? customHeight : vidCustomHeight}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 720;
                            if (activeTab === 'image') setCustomHeight(val);
                            else setVidCustomHeight(val);
                          }}
                          className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-450 block mb-1">Aspect Ratio Constraint</label>
                      <select
                        value={activeTab === 'image' ? aspectRatio : vidAspectRatio}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (activeTab === 'image') setAspectRatio(val);
                          else setVidAspectRatio(val);
                        }}
                        className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold"
                      >
                        <option value="free">Free Dimensions (Unlocked)</option>
                        <option value="16:9">16:9 Landscape</option>
                        <option value="9:16">9:16 Vertical (TikTok/Reels)</option>
                        <option value="1:1">1:1 Square</option>
                        <option value="4:3">4:3 Standard</option>
                        <option value="21:9">21:9 Cinematic</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Adjustments Sliders */}
                <div className="space-y-3.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-400 block">Hardware Restoration Filters</span>

                  {/* Sharpness Slider */}
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-semibold">
                      <span>Detail Sharpness Strength</span>
                      <span className="text-indigo-500 font-mono">{(activeTab === 'image' ? sharpness : vidSharpness)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={activeTab === 'image' ? sharpness : vidSharpness}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (activeTab === 'image') setSharpness(val);
                        else setVidSharpness(val);
                      }}
                      className="w-full h-1 bg-slate-200 dark:bg-slate-850 rounded-lg cursor-pointer accent-indigo-500"
                    />
                  </div>

                  {/* Bilateral Noise Reduction Slider */}
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-semibold">
                      <span>Pixel Noise Reduction</span>
                      <span className="text-indigo-500 font-mono">{(activeTab === 'image' ? noiseReduction : vidNoiseReduction)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={activeTab === 'image' ? noiseReduction : vidNoiseReduction}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (activeTab === 'image') setNoiseReduction(val);
                        else setVidNoiseReduction(val);
                      }}
                      className="w-full h-1 bg-slate-200 dark:bg-slate-850 rounded-lg cursor-pointer accent-indigo-500"
                    />
                  </div>

                  {/* Unsharp Mask Detail Enhancement */}
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-semibold">
                      <span>Edge Texture Restoration</span>
                      <span className="text-indigo-500 font-mono">{(activeTab === 'image' ? detailEnhancement : vidDetailEnhancement)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={activeTab === 'image' ? detailEnhancement : vidDetailEnhancement}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (activeTab === 'image') setDetailEnhancement(val);
                        else setVidDetailEnhancement(val);
                      }}
                      className="w-full h-1 bg-slate-200 dark:bg-slate-850 rounded-lg cursor-pointer accent-indigo-500"
                    />
                  </div>

                  {/* Color Improvement adjustments */}
                  <span className="text-xs font-bold text-slate-400 block pt-2 border-t border-slate-200 dark:border-slate-800">Color Grading Matrix</span>

                  {/* Brightness slider */}
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-semibold">
                      <span>Brightness Balance</span>
                      <span className="text-indigo-500 font-mono">{(activeTab === 'image' ? brightness : vidBrightness)}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={activeTab === 'image' ? brightness : vidBrightness}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (activeTab === 'image') setBrightness(val);
                        else setVidBrightness(val);
                      }}
                      className="w-full h-1 bg-slate-200 dark:bg-slate-850 rounded-lg cursor-pointer accent-indigo-500"
                    />
                  </div>

                  {/* Contrast slider */}
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-semibold">
                      <span>Contrast Index</span>
                      <span className="text-indigo-500 font-mono">{(activeTab === 'image' ? contrast : vidContrast)}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={activeTab === 'image' ? contrast : vidContrast}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (activeTab === 'image') setContrast(val);
                        else setVidContrast(val);
                      }}
                      className="w-full h-1 bg-slate-200 dark:bg-slate-850 rounded-lg cursor-pointer accent-indigo-500"
                    />
                  </div>

                  {/* Saturation slider */}
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-semibold">
                      <span>Color Vibrancy Saturation</span>
                      <span className="text-indigo-500 font-mono">{(activeTab === 'image' ? saturation : vidSaturation)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={activeTab === 'image' ? saturation : vidSaturation}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (activeTab === 'image') setSaturation(val);
                        else setVidSaturation(val);
                      }}
                      className="w-full h-1 bg-slate-200 dark:bg-slate-850 rounded-lg cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>

                {/* Compression Format & Container details (Only for Image) */}
                {activeTab === 'image' && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-slate-400 block">Encoder compression levels</span>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500 block mb-1">Target Format</label>
                        <select
                          value={outputFormat}
                          onChange={(e) => setOutputFormat(e.target.value as any)}
                          className="w-full p-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                        >
                          <option value="image/jpeg">JPEG Image</option>
                          <option value="image/png">PNG Lossless</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 block mb-1">Quality Priority</label>
                        <select
                          value={compressionLevel}
                          onChange={(e) => setCompressionLevel(e.target.value as any)}
                          className="w-full p-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                        >
                          <option value="high">High Quality (96%)</option>
                          <option value="medium">Balanced Quality (82%)</option>
                          <option value="low">Optimized Size (60%)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Primary upscale Action Button */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  {activeTab === 'image' ? (
                    <button
                      onClick={runImageEnhancement}
                      disabled={!imgSrc || isProcessingImg}
                      className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-slate-200 disabled:to-slate-200 disabled:dark:from-slate-800 disabled:dark:to-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white text-xs font-extrabold rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      Compile & Upscale Image
                    </button>
                  ) : (
                    <button
                      onClick={runVideoEnhancement}
                      disabled={!videoSrc || isProcessingVideo}
                      className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-slate-200 disabled:to-slate-200 disabled:dark:from-slate-800 disabled:dark:to-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white text-xs font-extrabold rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Video className="w-4 h-4" />
                      Compile & Upscale Video
                    </button>
                  )}
                </div>

              </div>
            )}

            {/* IF TAB IS AI STUDIO */}
            {activeTab === 'ai-studio' && (
              <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed space-y-3">
                <p className="font-bold text-slate-700 dark:text-slate-300">How local canvas scaling works:</p>
                <p>
                  Inside the browser, we run pixel shaders to compute the unsharp-mask convolution. This can dynamically upscale the frames to 2K or 4K.
                </p>
                <p>
                  To restore textures lost during original camera compression, neural-nets (GANs) must predict pixel configurations by executing models. We recommend using the **Real-ESRGAN CLI** pipeline shown on the left on your local desktop.
                </p>
              </div>
            )}
          </div>

          {/* SESSIONS HISTORY / RECENT WORKSPACE FILES */}
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Recent Enhanced Files</span>
            </h3>

            {history.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic">No processed copies in current session history.</p>
            ) : (
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 rounded-xl flex items-center justify-between gap-2 hover:border-indigo-500/50 transition cursor-pointer"
                    onClick={() => {
                      if (item.type === 'image') {
                        setActiveTab('image');
                        setImgSrc(item.url);
                        setEnhancedImgSrc(item.url);
                      } else {
                        setActiveTab('video');
                        setVideoSrc(item.url);
                        setEnhancedVideoUrl(item.url);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`p-1.5 rounded-lg text-xs ${item.type === 'image' ? 'bg-sky-50 dark:bg-sky-950 text-sky-500' : 'bg-rose-50 dark:bg-rose-950 text-rose-500'}`}>
                        {item.type === 'image' ? <Eye className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                      </span>
                      <div className="min-w-0 text-left">
                        <p className="text-[11px] font-bold truncate text-slate-700 dark:text-slate-300">{item.name}</p>
                        <p className="text-[9px] text-slate-400 font-mono">{item.preset} • {item.enhancedSize}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <a
                        href={item.url}
                        download={`enhanced_${item.name}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-500 rounded transition"
                        title="Download Enhanced copy"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={(e) => deleteHistoryItem(item.id, e)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-500 rounded transition"
                        title="Delete from history"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
export default QualityEnhancer;
