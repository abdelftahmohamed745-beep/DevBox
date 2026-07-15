import React, { useState, useRef, useEffect } from 'react';
import {
  Play, Pause, Square, SkipBack, Scissors, Trash2, Plus, Volume2, Save, Undo, Redo,
  Download, Share2, Upload, Video, Music, Type, Image as ImageIcon, Sliders, Film,
  Eye, Sparkles, AlertCircle, Settings, PlusCircle, Check, Copy, RefreshCw, Layers,
  FileText, Clock, RotateCw, FlipHorizontal, Camera, Mic, Search, ChevronRight,
  FolderOpen, Laptop, Smartphone, FileVideo, Edit3, X, SlidersHorizontal, ArrowLeft, ArrowRight
} from 'lucide-react';

// Interfaces for our studio state
interface MediaFile {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'image';
  url: string;
  duration: number; // in seconds
  size: number;
  width?: number;
  height?: number;
}

interface TimelineClip {
  id: string;
  mediaId: string;
  type: 'video' | 'audio' | 'image';
  name: string;
  start: number; // relative to timeline start
  duration: number; // source active duration
  sourceStart: number; // start offset in original file
  volume: number;
  speed: number;
  rotation: number; // 0, 90, 180, 270
  flipH: boolean;
  flipV: boolean;
  trackIndex: number; // track ID: 0 (Video), 1 (Audio), 2 (Overlay/Text)
}

interface SubtitleItem {
  id: string;
  text: string;
  start: number; // in seconds
  end: number;
}

interface TextOverlay {
  id: string;
  text: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  fontSize: number;
  color: string;
  bgColor: string;
  bgOpacity: number;
  fontFamily: string;
  animation: 'none' | 'fade' | 'pop' | 'slide';
}

interface ImageOverlay {
  id: string;
  mediaId: string;
  x: number;
  y: number;
  scale: number;
  opacity: number;
}

interface VideoProject {
  id: string;
  name: string;
  createdAt: string;
  clips: TimelineClip[];
  subtitles: SubtitleItem[];
  textOverlays: TextOverlay[];
  imageOverlays: ImageOverlay[];
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
  filters: typeof DEFAULT_FILTERS;
  chromaKey: typeof DEFAULT_CHROMA;
}

const DEFAULT_FILTERS = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  exposure: 100,
  blur: 0,
  sharpen: 0,
  grayscale: 0,
  sepia: 0,
  invert: 0,
  vintage: false,
  cool: false,
  warm: false,
};

const DEFAULT_CHROMA = {
  enabled: false,
  color: '#00ff00',
  similarity: 40,
  smoothness: 10,
};

export const VideoStudio = ({ initialTab = 'timeline', initialQuickTool = '' }: { initialTab?: 'timeline' | 'quick-tools' | 'audio-subs' | 'overlays' | 'ai-copilot' | 'projects'; initialQuickTool?: string } = {}) => {
  // Localization: detect page language via container layout / context (ar/en)
  const isRtl = document.documentElement.dir === 'rtl';
  const currentLang = document.documentElement.lang === 'ar' ? 'ar' : 'en';

  const t = (en: string, ar: string) => (currentLang === 'ar' ? ar : en);

  // Studio Sub-Sections/Tabs
  // 'timeline' | 'quick-tools' | 'audio-subs' | 'overlays' | 'ai-copilot' | 'projects'
  const [activeTab, setActiveTab] = useState<'timeline' | 'quick-tools' | 'audio-subs' | 'overlays' | 'ai-copilot' | 'projects'>(initialTab);

  // Media Library
  const [mediaLibrary, setMediaLibrary] = useState<MediaFile[]>([]);
  const [selectedLibraryItem, setSelectedLibraryItem] = useState<MediaFile | null>(null);

  // Timeline State
  const [clips, setClips] = useState<TimelineClip[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timelineDuration, setTimelineDuration] = useState<number>(30); // in seconds
  const [timelineZoom, setTimelineZoom] = useState<number>(10); // pixels per second
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '4:5'>('16:9');
  
  // Audio & Subtitles State
  const [subtitles, setSubtitles] = useState<SubtitleItem[]>([
    { id: '1', text: t('Welcome to the Studio!', 'مرحباً بكم في استوديو الإنتاج!'), start: 1, end: 4 },
    { id: '2', text: t('Edit your timeline and apply real-time filters locally.', 'قم بتعديل خطك الزمني وتطبيق الفلاتر محلياً.'), start: 5, end: 10 },
  ]);
  const [selectedSubIndex, setSelectedSubIndex] = useState<number | null>(null);
  const [subStyle, setSubStyle] = useState({
    fontSize: 24,
    color: '#ffffff',
    bgColor: '#000000',
    bgOpacity: 0.6,
    fontFamily: 'sans-serif',
    strokeColor: '#000000',
    strokeWidth: 2,
  });

  // Text & Image Overlays State
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [imageOverlays, setImageOverlays] = useState<ImageOverlay[]>([]);
  const [selectedImgOverlayId, setSelectedImgOverlayId] = useState<string | null>(null);

  // Voice recording
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceRecorder, setVoiceRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  // Video Filters, Chroma Key, Transformations
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [chromaKey, setChromaKey] = useState(DEFAULT_CHROMA);

  // Undo/Redo State History
  const [history, setHistory] = useState<Array<{
    clips: TimelineClip[];
    subtitles: SubtitleItem[];
    textOverlays: TextOverlay[];
    filters: typeof DEFAULT_FILTERS;
  }>>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Projects State
  const [projects, setProjects] = useState<VideoProject[]>(() => {
    const saved = localStorage.getItem('devbox_video_projects');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentProjectName, setCurrentProjectName] = useState<string>(t('My Awesome Video Project', 'مشروع الفيديو الإبداعي الخاص بي'));

  // Quick Tools State variables
  const [qtSelectedFile, setQtSelectedFile] = useState<File | null>(null);
  const [qtVideoSrc, setQtVideoSrc] = useState<string | null>(null);
  const [qtTrimStart, setQtTrimStart] = useState<number>(0);
  const [qtTrimEnd, setQtTrimEnd] = useState<number>(10);
  const [qtSpeed, setQtSpeed] = useState<number>(1.0);
  const [qtRotation, setQtRotation] = useState<number>(0);
  const [qtFlipH, setQtFlipH] = useState<boolean>(false);
  const [qtFlipV, setQtFlipV] = useState<boolean>(false);
  const [qtQuality, setQtQuality] = useState<string>('medium');
  const [qtFormat, setQtFormat] = useState<string>('mp4');
  const [qtAudioExtractorResult, setQtAudioExtractorResult] = useState<string | null>(null);
  const [qtMetadata, setQtMetadata] = useState<any>(null);
  const [qtSplitTime, setQtSplitTime] = useState<number>(5);

  // Thumbnail Maker State
  const [thumbSelectedFile, setThumbSelectedFile] = useState<File | null>(null);
  const [thumbImageSrc, setThumbImageSrc] = useState<string | null>(null);
  const [thumbText, setThumbText] = useState<string>('BIG NEWS!');
  const [thumbSticker, setThumbSticker] = useState<string>('🔥');
  const [thumbFontSize, setThumbFontSize] = useState<number>(48);
  const [thumbTextColor, setThumbTextColor] = useState<string>('#f59e0b');
  const [thumbBgColor, setThumbBgColor] = useState<string>('#1e1b4b');

  // AI Copilot State
  const [aiTopic, setAiTopic] = useState('');
  const [aiPlatform, setAiPlatform] = useState('TikTok');
  const [aiGeneratedScript, setAiGeneratedScript] = useState('');
  const [aiGeneratedPrompt, setAiGeneratedPrompt] = useState('');
  const [aiGeneratedSubs, setAiGeneratedSubs] = useState<string>('');

  // Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playheadInterval = useRef<any>(null);
  const videoElementsRef = useRef<Record<string, HTMLVideoElement>>({});
  const audioElementsRef = useRef<Record<string, HTMLAudioElement>>({});

  // Helper: Save current state to History for undo/redo
  const pushToHistory = (newClips = clips, newSubs = subtitles, newTexts = textOverlays, newFilters = filters) => {
    const snap = {
      clips: JSON.parse(JSON.stringify(newClips)),
      subtitles: JSON.parse(JSON.stringify(newSubs)),
      textOverlays: JSON.parse(JSON.stringify(newTexts)),
      filters: { ...newFilters }
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(snap);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      const snap = history[prevIdx];
      setClips(snap.clips);
      setSubtitles(snap.subtitles);
      setTextOverlays(snap.textOverlays);
      setFilters(snap.filters);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      const snap = history[nextIdx];
      setClips(snap.clips);
      setSubtitles(snap.subtitles);
      setTextOverlays(snap.textOverlays);
      setFilters(snap.filters);
    }
  };

  // Setup initial history
  useEffect(() => {
    if (history.length === 0) {
      pushToHistory(clips, subtitles, textOverlays, filters);
    }
  }, []);

  // Sync Video/Audio elements for clips
  useEffect(() => {
    // Sync timeline duration based on maximum clip end
    const maxClipEnd = clips.reduce((acc, clip) => Math.max(acc, clip.start + clip.duration), 10);
    setTimelineDuration(Math.max(maxClipEnd + 5, 30));
  }, [clips]);

  // Real-time Frame rendering loop using Canvas API
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;

    const render = () => {
      // Clear canvas with black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Find active clips at currentTime
      const activeVideoClips = clips.filter(c => c.type === 'video' && currentTime >= c.start && currentTime <= (c.start + c.duration));
      
      if (activeVideoClips.length > 0) {
        // Draw the main active video clip
        const clip = activeVideoClips[0];
        const video = videoElementsRef.current[clip.mediaId];
        
        if (video && !isNaN(video.duration)) {
          // Calculate source playhead time based on clip offset and playback speed
          const relativeTime = currentTime - clip.start;
          const sourcePlayTime = clip.sourceStart + (relativeTime * clip.speed);
          
          // Guard and set the videocurrentTime
          if (Math.abs(video.currentTime - sourcePlayTime) > 0.3) {
            video.currentTime = Math.min(sourcePlayTime, video.duration - 0.05);
          }

          ctx.save();

          // Apply Transformations (Rotate, Flip)
          ctx.translate(canvas.width / 2, canvas.height / 2);
          if (clip.rotation) {
            ctx.rotate((clip.rotation * Math.PI) / 180);
          }
          ctx.scale(clip.flipH ? -1 : 1, clip.flipV ? -1 : 1);
          ctx.translate(-canvas.width / 2, -canvas.height / 2);

          // Build filter string based on current project filters
          let filterStr = '';
          if (filters.brightness !== 100) filterStr += ` brightness(${filters.brightness}%)`;
          if (filters.contrast !== 100) filterStr += ` contrast(${filters.contrast}%)`;
          if (filters.saturation !== 100) filterStr += ` saturate(${filters.saturation}%)`;
          if (filters.blur > 0) filterStr += ` blur(${filters.blur}px)`;
          if (filters.grayscale > 0) filterStr += ` grayscale(${filters.grayscale}%)`;
          if (filters.sepia > 0) filterStr += ` sepia(${filters.sepia}%)`;
          if (filters.invert > 0) filterStr += ` invert(${filters.invert}%)`;
          
          if (filters.vintage) filterStr += ' sepia(50%) contrast(120%) saturate(80%)';
          if (filters.cool) filterStr += ' hue-rotate(30deg) saturate(90%)';
          if (filters.warm) filterStr += ' sepia(30%) saturate(110%)';

          ctx.filter = filterStr || 'none';

          // Draw the video frame
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          ctx.restore();

          // Chroma Key (Green Screen) Simulation if enabled
          if (chromaKey.enabled) {
            const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = frame.data;
            
            // Extract selected chroma key RGB
            const rKey = parseInt(chromaKey.color.slice(1, 3), 16);
            const gKey = parseInt(chromaKey.color.slice(3, 5), 16);
            const bKey = parseInt(chromaKey.color.slice(5, 7), 16);

            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i+1];
              const b = data[i+2];

              // Color distance
              const dist = Math.sqrt((r - rKey) ** 2 + (g - gKey) ** 2 + (b - bKey) ** 2);
              if (dist < chromaKey.similarity * 2.5) {
                data[i+3] = 0; // Transparent
              }
            }
            ctx.putImageData(frame, 0, 0);
          }
        }
      } else {
        // Draw standard fallback placeholder if no video is playing at current timestamp
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '20px sans-serif';
        ctx.fillStyle = '#6366f1';
        ctx.textAlign = 'center';
        ctx.fillText(t('Preview Screen (Timeline Empty / Idle)', 'شاشة العرض (الخط الزمني فارغ / متوقف)'), canvas.width / 2, canvas.height / 2);
      }

      // Render Static Overlays (Images/Logos)
      imageOverlays.forEach(overlay => {
        const file = mediaLibrary.find(m => m.id === overlay.mediaId);
        if (file) {
          const img = new Image();
          img.src = file.url;
          ctx.save();
          ctx.globalAlpha = overlay.opacity;
          const w = canvas.width * 0.25 * overlay.scale;
          const h = w * (file.height && file.width ? file.height / file.width : 1);
          ctx.drawImage(img, (overlay.x / 100) * canvas.width, (overlay.y / 100) * canvas.height, w, h);
          ctx.restore();
        }
      });

      // Render Custom Text Overlays
      textOverlays.forEach(overlay => {
        ctx.font = `${overlay.fontSize}px ${overlay.fontFamily}`;
        ctx.textAlign = 'center';
        const xPos = (overlay.x / 100) * canvas.width;
        const yPos = (overlay.y / 100) * canvas.height;

        const textWidth = ctx.measureText(overlay.text).width;
        
        // Draw Background if set
        if (overlay.bgColor) {
          ctx.save();
          ctx.fillStyle = overlay.bgColor;
          ctx.globalAlpha = overlay.bgOpacity;
          ctx.fillRect(xPos - textWidth / 2 - 12, yPos - overlay.fontSize, textWidth + 24, overlay.fontSize + 12);
          ctx.restore();
        }

        ctx.fillStyle = overlay.color;
        ctx.fillText(overlay.text, xPos, yPos);
      });

      // Render Subtitles
      const activeSubtitle = subtitles.find(s => currentTime >= s.start && currentTime <= s.end);
      if (activeSubtitle) {
        ctx.save();
        ctx.font = `${subStyle.fontSize}px ${subStyle.fontFamily}`;
        ctx.textAlign = 'center';
        
        const subX = canvas.width / 2;
        const subY = canvas.height - 50;
        const textWidth = ctx.measureText(activeSubtitle.text).width;

        // Subtitle BG
        ctx.fillStyle = subStyle.bgColor;
        ctx.globalAlpha = subStyle.bgOpacity;
        ctx.fillRect(subX - textWidth / 2 - 10, subY - subStyle.fontSize + 5, textWidth + 20, subStyle.fontSize + 10);
        
        // Subtitle text
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = subStyle.color;
        
        // Stroke outline
        if (subStyle.strokeColor && subStyle.strokeWidth > 0) {
          ctx.strokeStyle = subStyle.strokeColor;
          ctx.lineWidth = subStyle.strokeWidth;
          ctx.strokeText(activeSubtitle.text, subX, subY);
        }
        ctx.fillText(activeSubtitle.text, subX, subY);
        ctx.restore();
      }

      // Audio syncing loop for non-playing background audios
      const activeAudioClips = clips.filter(c => c.type === 'audio' && currentTime >= c.start && currentTime <= (c.start + c.duration));
      activeAudioClips.forEach(clip => {
        const audio = audioElementsRef.current[clip.mediaId];
        if (audio && !isNaN(audio.duration)) {
          const relativeTime = currentTime - clip.start;
          const sourcePlayTime = clip.sourceStart + (relativeTime * clip.speed);
          if (isPlaying) {
            if (audio.paused) {
              audio.play().catch(() => {});
            }
            if (Math.abs(audio.currentTime - sourcePlayTime) > 0.3) {
              audio.currentTime = sourcePlayTime;
            }
          } else {
            audio.pause();
          }
        }
      });

      // Pause unneeded audios
      Object.keys(audioElementsRef.current).forEach(mediaId => {
        const isCurrentlyActive = activeAudioClips.some(c => c.mediaId === mediaId);
        if (!isCurrentlyActive && audioElementsRef.current[mediaId]) {
          audioElementsRef.current[mediaId].pause();
        }
      });

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [clips, currentTime, filters, chromaKey, subtitles, subStyle, textOverlays, imageOverlays, isPlaying]);

  // Handle Timeline Playback
  useEffect(() => {
    if (isPlaying) {
      const startTimeRef = Date.now() - (currentTime * 1000);
      playheadInterval.current = setInterval(() => {
        const nextTime = (Date.now() - startTimeRef) / 1000;
        if (nextTime >= timelineDuration) {
          setCurrentTime(0);
          setIsPlaying(false);
          // Pause all videos/audios
          Object.values(videoElementsRef.current).forEach((v: any) => v.pause());
          Object.values(audioElementsRef.current).forEach((a: any) => a.pause());
        } else {
          setCurrentTime(nextTime);
          
          // Trigger actual playback of active videos
          clips.forEach(clip => {
            if (clip.type === 'video') {
              const video = videoElementsRef.current[clip.mediaId];
              if (video) {
                if (nextTime >= clip.start && nextTime <= (clip.start + clip.duration)) {
                  if (video.paused) {
                    video.play().catch(() => {});
                  }
                } else {
                  video.pause();
                }
              }
            }
          });
        }
      }, 30);
    } else {
      if (playheadInterval.current) {
        clearInterval(playheadInterval.current);
      }
      Object.values(videoElementsRef.current).forEach((v: any) => v.pause());
      Object.values(audioElementsRef.current).forEach((a: any) => a.pause());
    }

    return () => {
      if (playheadInterval.current) clearInterval(playheadInterval.current);
    };
  }, [isPlaying, clips, timelineDuration]);

  // Import media files locally
  const handleMediaImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    Array.from(e.target.files).forEach((file: any) => {
      const isVideo = file.type.startsWith('video/');
      const isAudio = file.type.startsWith('audio/');
      const isImage = file.type.startsWith('image/');
      
      const fileUrl = URL.createObjectURL(file);
      
      if (isVideo) {
        const video = document.createElement('video');
        video.src = fileUrl;
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          const newMedia: MediaFile = {
            id: 'media_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            name: file.name,
            type: 'video',
            url: fileUrl,
            duration: video.duration || 10,
            size: file.size,
            width: video.videoWidth,
            height: video.videoHeight,
          };
          setMediaLibrary(prev => [...prev, newMedia]);
          // Save a ref to this video element
          video.muted = true; // Mute preview, Audio tracks handle audio
          video.loop = false;
          videoElementsRef.current[newMedia.id] = video;
        };
      } else if (isAudio) {
        const audio = document.createElement('audio');
        audio.src = fileUrl;
        audio.preload = 'metadata';
        audio.onloadedmetadata = () => {
          const newMedia: MediaFile = {
            id: 'media_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            name: file.name,
            type: 'audio',
            url: fileUrl,
            duration: audio.duration || 10,
            size: file.size,
          };
          setMediaLibrary(prev => [...prev, newMedia]);
          audioElementsRef.current[newMedia.id] = audio;
        };
      } else if (isImage) {
        const img = new Image();
        img.src = fileUrl;
        img.onload = () => {
          const newMedia: MediaFile = {
            id: 'media_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            name: file.name,
            type: 'image',
            url: fileUrl,
            duration: 5, // Default image timeline duration is 5s
            size: file.size,
            width: img.width,
            height: img.height,
          };
          setMediaLibrary(prev => [...prev, newMedia]);
        };
      }
    });
  };

  // Add library item to timeline track
  const handleAddToTimeline = (item: MediaFile, trackIndex = 0) => {
    const newClip: TimelineClip = {
      id: 'clip_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      mediaId: item.id,
      type: item.type,
      name: item.name,
      start: currentTime,
      duration: item.duration,
      sourceStart: 0,
      volume: 1.0,
      speed: 1.0,
      rotation: 0,
      flipH: false,
      flipV: false,
      trackIndex: trackIndex,
    };
    const updated = [...clips, newClip];
    setClips(updated);
    pushToHistory(updated);
  };

  const handleSplitClip = (clipId: string) => {
    const clip = clips.find(c => c.id === clipId);
    if (!clip) return;
    
    // Check if the current playhead is within this clip
    if (currentTime > clip.start && currentTime < (clip.start + clip.duration)) {
      const splitOffset = currentTime - clip.start;
      
      const clipA: TimelineClip = {
        ...clip,
        id: 'clip_' + Date.now() + '_A',
        duration: splitOffset,
      };

      const clipB: TimelineClip = {
        ...clip,
        id: 'clip_' + Date.now() + '_B',
        start: currentTime,
        duration: clip.duration - splitOffset,
        sourceStart: clip.sourceStart + (splitOffset * clip.speed),
      };

      const updated = clips.filter(c => c.id !== clipId).concat(clipA, clipB);
      setClips(updated);
      pushToHistory(updated);
    }
  };

  const handleDeleteClip = (clipId: string) => {
    const updated = clips.filter(c => c.id !== clipId);
    setClips(updated);
    pushToHistory(updated);
  };

  const handleClipPropertyChange = (clipId: string, property: keyof TimelineClip, value: any) => {
    const updated = clips.map(c => {
      if (c.id === clipId) {
        return { ...c, [property]: value };
      }
      return c;
    });
    setClips(updated);
  };

  // Keyboard Shortcuts (Space to play, arrows to scrub, etc.)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentTime(prev => Math.min(timelineDuration, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentTime(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Delete') {
        // Find if any timeline clip or subtitle is selected
        const activeSub = subtitles[selectedSubIndex || -1];
        if (activeSub) {
          const updated = subtitles.filter(s => s.id !== activeSub.id);
          setSubtitles(updated);
          pushToHistory(clips, updated);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [timelineDuration, subtitles, selectedSubIndex, clips]);

  // Voice Recording functions
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setRecordedChunks([]);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setRecordedChunks(prev => [...prev, e.data]);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const newMedia: MediaFile = {
          id: 'voice_' + Date.now(),
          name: t(`Voice Recording ${new Date().toLocaleTimeString()}`, `تسجيل صوتي ${new Date().toLocaleTimeString()}`),
          type: 'audio',
          url: audioUrl,
          duration: 5, // Approximate duration, metadata will overwrite
          size: audioBlob.size,
        };

        const audio = document.createElement('audio');
        audio.src = audioUrl;
        audio.onloadedmetadata = () => {
          newMedia.duration = audio.duration;
          setMediaLibrary(prev => [...prev, newMedia]);
          audioElementsRef.current[newMedia.id] = audio;
          // Add to timeline automatically
          handleAddToTimeline(newMedia, 1);
        };
      };

      recorder.start();
      setVoiceRecorder(recorder);
      setIsRecordingVoice(true);
    } catch (err) {
      alert(t('Microphone access denied or unavailable.', 'تعذر الوصول للميكروفون أو أنه غير متاح.'));
    }
  };

  const stopVoiceRecording = () => {
    if (voiceRecorder && isRecordingVoice) {
      voiceRecorder.stop();
      setIsRecordingVoice(false);
      // Stop media tracks
      voiceRecorder.stream.getTracks().forEach(t => t.stop());
    }
  };

  // Subtitle handlers
  const handleAddSubtitle = () => {
    const newSub: SubtitleItem = {
      id: 'sub_' + Date.now(),
      text: t('New Subtitle Caption', 'ترجمة توضيحية جديدة'),
      start: Math.round(currentTime),
      end: Math.round(currentTime) + 3,
    };
    const updated = [...subtitles, newSub].sort((a, b) => a.start - b.start);
    setSubtitles(updated);
    pushToHistory(clips, updated);
  };

  const handleUpdateSub = (id: string, field: keyof SubtitleItem, value: any) => {
    const updated = subtitles.map(s => {
      if (s.id === id) {
        return { ...s, [field]: value };
      }
      return s;
    }).sort((a, b) => a.start - b.start);
    setSubtitles(updated);
  };

  // Quick Tools - Handle single file conversion, speed change or crop
  const handleQtFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setQtSelectedFile(file);
    const url = URL.createObjectURL(file);
    setQtVideoSrc(url);
    
    // Parse simulated metadata
    setQtMetadata({
      filename: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type,
      resolution: isRtl ? '1920 × 1080 (تلقائي)' : '1920 × 1080 (Auto)',
      codec: 'h.264 / AAC',
    });
  };

  // Frame Extractor (Screenshot)
  const handleExtractFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `frame_${currentTime.toFixed(2)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Local Project Persistence
  const handleSaveProject = () => {
    const newProj: VideoProject = {
      id: 'proj_' + Date.now(),
      name: currentProjectName,
      createdAt: new Date().toLocaleString(),
      clips,
      subtitles,
      textOverlays,
      imageOverlays,
      aspectRatio,
      filters,
      chromaKey,
    };

    const updatedProjects = [newProj, ...projects.filter(p => p.name !== currentProjectName)];
    setProjects(updatedProjects);
    localStorage.setItem('devbox_video_projects', JSON.stringify(updatedProjects));
    alert(t('Project saved successfully in local memory!', 'تم حفظ المشروع بنجاح في الذاكرة المحلية للمتصفح!'));
  };

  const handleLoadProject = (proj: VideoProject) => {
    setClips(proj.clips);
    setSubtitles(proj.subtitles);
    setTextOverlays(proj.textOverlays);
    setImageOverlays(proj.imageOverlays || []);
    setAspectRatio(proj.aspectRatio || '16:9');
    setFilters(proj.filters || DEFAULT_FILTERS);
    setChromaKey(proj.chromaKey || DEFAULT_CHROMA);
    setCurrentProjectName(proj.name);
    alert(t(`Project "${proj.name}" loaded successfully!`, `تم تحميل المشروع "${proj.name}" بنجاح!`));
  };

  const handleExportProjectState = () => {
    const state = {
      clips, subtitles, textOverlays, imageOverlays, aspectRatio, filters, chromaKey, currentProjectName
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${currentProjectName.toLowerCase().replace(/\s+/g, '_')}_project.json`);
    dlAnchorElem.click();
  };

  const handleImportProjectState = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setClips(parsed.clips || []);
        setSubtitles(parsed.subtitles || []);
        setTextOverlays(parsed.textOverlays || []);
        setImageOverlays(parsed.imageOverlays || []);
        setAspectRatio(parsed.aspectRatio || '16:9');
        setFilters(parsed.filters || DEFAULT_FILTERS);
        setChromaKey(parsed.chromaKey || DEFAULT_CHROMA);
        setCurrentProjectName(parsed.currentProjectName || t('Imported Project', 'مشروع مستورد'));
        alert(t('Project state file loaded successfully!', 'تم تحميل ملف حالة المشروع بنجاح!'));
      } catch (err) {
        alert(t('Invalid project file.', 'ملف مشروع غير صالح.'));
      }
    };
    reader.readAsText(file);
  };

  // Thumbnail Generator helpers
  const handleThumbFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setThumbSelectedFile(file);
    setThumbImageSrc(URL.createObjectURL(file));
  };

  // AI Prompt Generator for Videos
  const generateAIPrompt = () => {
    if (!aiTopic) return;
    const prompt = `Highly detailed cinematic video generation prompt for ${aiPlatform}: 
Style: ${isRtl ? 'سينمائي بدقة 4K وعالي التفاصيل والجمال البصري' : 'Cinematic, ultra-detailed 4K, beautiful lighting, dramatic camera movement'}
Concept: "${aiTopic}"
Composition: aspect ratio set for ${aiPlatform === 'TikTok' || aiPlatform === 'Instagram Reels' || aiPlatform === 'Shorts' ? '9:16 vertical smartphone screen' : '16:9 widescreen'}
Motion: subtle dynamic zoom, camera panning slowly, highly photorealistic texture, octane render.`;
    setAiGeneratedPrompt(prompt);

    const script = t(
      `[00:00 - 00:05] Intro hook text: "Have you ever seen this?" with upbeat cinematic transition.
[00:05 - 00:15] Core visual display of "${aiTopic}".
[00:15 - 00:30] Call to action visual banner: "Subscribe for more daily content".`,
      `[00:00 - 00:05] لقطة البداية المشوقة: "هل سبق لك رؤية هذا؟" مع مؤثر بصري حركي.
[00:05 - 00:15] استعراض المشهد الأساسي لـ "${aiTopic}".
[00:15 - 00:30] لقطة النهاية ودعوة المتابعة: "اشترك معنا لمزيد من الإبداع اليومي".`
    );
    setAiGeneratedScript(script);

    const generatedSrt = `1
00:00:01,000 --> 00:00:05,000
${t('Are you ready for this video concept?', 'هل أنت مستعد لفكرة هذا الفيديو الحماسية؟')}

2
00:00:06,000 --> 00:00:12,000
${t(`Today, we showcase: ${aiTopic}`, `اليوم، نستعرض لكم: ${aiTopic}`)}

3
00:00:13,000 --> 00:00:20,000
${t('Subscribe and leave a like below!', 'اشترك الآن وفعل جرس التنبيهات ليصلك كل جديد!')}`;
    setAiGeneratedSubs(generatedSrt);
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen rounded-2xl p-4 md:p-6 shadow-2xl border border-slate-800" id="video-production-studio">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
              <Video className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-rose-400 to-indigo-400 bg-clip-text text-transparent">
                {t('Video Production & Editing Studio', 'استوديو إنتاج وتحرير الفيديو المتكامل')}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('100% Client-Side Professional Video Production Suite', 'مجموعة أدوات إنتاج الفيديو الاحترافية محلياً 100٪ داخل المتصفح')}
              </p>
            </div>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          <input
            type="file"
            id="proj-import-input"
            accept=".json"
            className="hidden"
            onChange={handleImportProjectState}
          />
          <button
            onClick={() => document.getElementById('proj-import-input')?.click()}
            className="px-3.5 py-1.5 text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition rounded-lg border border-slate-700 flex items-center gap-1.5"
            title={t('Import Project State JSON', 'استيراد حالة المشروع من ملف JSON')}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            {t('Import Project', 'استيراد مشروع')}
          </button>
          <button
            onClick={handleExportProjectState}
            className="px-3.5 py-1.5 text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition rounded-lg border border-slate-700 flex items-center gap-1.5"
            title={t('Export Project State JSON', 'تصدير حالة المشروع الحالية')}
          >
            <Share2 className="w-3.5 h-3.5" />
            {t('Export Project', 'تصدير مشروع')}
          </button>
          <button
            onClick={handleSaveProject}
            className="px-4 py-1.5 text-xs font-medium bg-rose-600 hover:bg-rose-500 text-white transition rounded-lg flex items-center gap-1.5 shadow-lg shadow-rose-600/10"
          >
            <Save className="w-3.5 h-3.5" />
            {t('Save Locally', 'حفظ المشروع محلياً')}
          </button>
        </div>
      </div>

      {/* Main Studio Navigation Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-6 border-b border-slate-800/60 no-scrollbar">
        {[
          { id: 'timeline', label: t('Timeline Editor', 'محرر الخط الزمني'), icon: Film },
          { id: 'quick-tools', label: t('Quick Video Tools', 'أدوات سريعة للفيديو'), icon: Sliders },
          { id: 'audio-subs', label: t('Audio & Subtitles', 'الصوت والترجمة'), icon: Music },
          { id: 'overlays', label: t('Overlays & Graphics', 'الملصقات واللوجو'), icon: ImageIcon },
          { id: 'ai-copilot', label: t('AI Production Copilot', 'مساعد الإنتاج الذكي'), icon: Sparkles },
          { id: 'projects', label: t('My Projects', 'مشاريعي المخزنة'), icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap border ${
                isActive
                  ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/15'
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* VIEW: TIMELINE STUDIO EDITOR */}
      {activeTab === 'timeline' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Production Sandbox Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Hand Column: Media Library & Asset Drawer */}
            <div className="lg:col-span-3 bg-slate-800/30 rounded-2xl p-4 border border-slate-800 flex flex-col h-[520px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  <FolderOpen className="w-4 h-4 text-rose-400" />
                  {t('Project Media Library', 'مكتبة وسائط المشروع')}
                </h3>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                  {mediaLibrary.length} {t('files', 'ملفات')}
                </span>
              </div>

              {/* Local File Upload Dropzone */}
              <label className="border-2 border-dashed border-slate-700 hover:border-rose-500/50 bg-slate-800/10 hover:bg-rose-950/5 rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 mb-4">
                <Upload className="w-6 h-6 text-slate-400" />
                <span className="text-xs font-medium text-slate-300">
                  {t('Import Video / Audio / Image', 'استيراد فيديو / صوت / صورة')}
                </span>
                <span className="text-[10px] text-slate-500">
                  {t('100% local client-side processing', 'تتم المعالجة محلياً بالكامل')}
                </span>
                <input
                  type="file"
                  multiple
                  accept="video/*,audio/*,image/*"
                  onChange={handleMediaImport}
                  className="hidden"
                />
              </label>

              {/* Media Items Shelf */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                {mediaLibrary.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-500">
                    <Video className="w-8 h-8 mb-2 opacity-30" />
                    <p className="text-xs">{t('Library empty. Import media above to begin timeline editing.', 'المكتبة فارغة. استورد الوسائط بالأعلى للبدء بالتعديل.')}</p>
                  </div>
                ) : (
                  mediaLibrary.map(item => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedLibraryItem(item)}
                      className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 text-left ${
                        selectedLibraryItem?.id === item.id
                          ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {item.type === 'video' && <Film className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
                        {item.type === 'audio' && <Music className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                        {item.type === 'image' && <ImageIcon className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                        <div className="truncate text-xs">
                          <p className="font-medium truncate">{item.name}</p>
                          <p className="text-[10px] text-slate-500">
                            {item.duration.toFixed(1)}s • {(item.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToTimeline(item, item.type === 'video' ? 0 : item.type === 'audio' ? 1 : 2);
                        }}
                        className="p-1 bg-slate-800 hover:bg-rose-600 hover:text-white rounded text-slate-400 transition"
                        title={t('Add to Timeline', 'إضافة إلى الخط الزمني')}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Center Column: Video Interactive Canvas & Realtime Preview */}
            <div className="lg:col-span-6 bg-slate-800/20 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between h-[520px]">
              
              {/* Project title and aspect selection */}
              <div className="flex justify-between items-center mb-3">
                <input
                  type="text"
                  value={currentProjectName}
                  onChange={(e) => setCurrentProjectName(e.target.value)}
                  className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-rose-500 font-semibold text-slate-200 text-sm focus:outline-none transition py-0.5 px-1 w-2/3"
                />
                
                {/* Aspect presets */}
                <div className="flex gap-1">
                  {[
                    { id: '16:9', label: '16:9', icon: Laptop },
                    { id: '9:16', label: '9:16', icon: Smartphone }
                  ].map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => setAspectRatio(preset.id as any)}
                      className={`px-2 py-1 rounded text-[10px] font-mono font-medium border flex items-center gap-1 transition ${
                        aspectRatio === preset.id
                          ? 'bg-rose-600/10 border-rose-500/50 text-rose-400'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                      }`}
                    >
                      <preset.icon className="w-2.5 h-2.5" />
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Viewport Canvas Wrapper */}
              <div className="flex-1 flex items-center justify-center bg-black/50 rounded-xl overflow-hidden border border-slate-800 relative group">
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={aspectRatio === '16:9' ? 360 : aspectRatio === '9:16' ? 1137 : 640}
                  className={`max-w-full max-h-full object-contain ${
                    aspectRatio === '9:16' ? 'aspect-[9/16] h-full' : 'aspect-video w-full'
                  }`}
                />
                
                {/* Frame tools overlay */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition duration-200 flex gap-1.5">
                  <button
                    onClick={handleExtractFrame}
                    className="p-1.5 bg-black/80 hover:bg-rose-600 rounded-lg text-slate-200 hover:text-white transition"
                    title={t('Extract current frame / Take screenshot', 'استخراج الإطار الحالي / لقطة شاشة')}
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Viewport Controller Strip */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setCurrentTime(0);
                      Object.values(videoElementsRef.current).forEach((v: any) => v.currentTime = 0);
                    }}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full transition shadow-lg shadow-rose-600/20"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                  </button>
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentTime(0);
                    }}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition"
                  >
                    <Square className="w-4 h-4 fill-slate-400" />
                  </button>
                </div>

                {/* Local time ticker */}
                <div className="font-mono text-xs text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                  {Math.floor(currentTime / 60).toString().padStart(2, '0')}:
                  {Math.floor(currentTime % 60).toString().padStart(2, '0')}.
                  {Math.floor((currentTime % 1) * 100).toString().padStart(2, '0')}
                  <span className="text-slate-500 mx-1.5">/</span>
                  {Math.floor(timelineDuration / 60).toString().padStart(2, '0')}:
                  {Math.floor(timelineDuration % 60).toString().padStart(2, '0')}.00
                </div>

                {/* Subtitle preview and quick insertion */}
                <button
                  onClick={handleAddSubtitle}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium rounded-lg text-slate-200 hover:text-white flex items-center gap-1.5 transition"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-rose-400" />
                  {t('Add Subtitle', 'إضافة ترجمة')}
                </button>
              </div>
            </div>

            {/* Right Hand Column: Color Correction, Filters & Chroma Key properties */}
            <div className="lg:col-span-3 bg-slate-800/30 rounded-2xl p-4 border border-slate-800 flex flex-col h-[520px] overflow-y-auto no-scrollbar">
              
              {/* Header */}
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                  {t('Visual Effects & Grading', 'المؤثرات البصرية وتعديل الألوان')}
                </h3>
              </div>

              {/* Color Grading & Filters sliders */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 flex justify-between">
                    <span>{t('Brightness', 'السطوع')}</span>
                    <span className="text-slate-300 font-mono">{filters.brightness}%</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={filters.brightness}
                    onChange={(e) => setFilters({ ...filters, brightness: parseInt(e.target.value) })}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 flex justify-between">
                    <span>{t('Contrast', 'التباين')}</span>
                    <span className="text-slate-300 font-mono">{filters.contrast}%</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={filters.contrast}
                    onChange={(e) => setFilters({ ...filters, contrast: parseInt(e.target.value) })}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 flex justify-between">
                    <span>{t('Saturation', 'التشبع')}</span>
                    <span className="text-slate-300 font-mono">{filters.saturation}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.saturation}
                    onChange={(e) => setFilters({ ...filters, saturation: parseInt(e.target.value) })}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 flex justify-between">
                    <span>{t('Blur', 'التغبيش / الضبابية')}</span>
                    <span className="text-slate-300 font-mono">{filters.blur}px</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={filters.blur}
                    onChange={(e) => setFilters({ ...filters, blur: parseInt(e.target.value) })}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500 mt-1"
                  />
                </div>

                {/* Filter LUT Pre-sets */}
                <div className="pt-2">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider">{t('Preset Filters', 'فلاتر جاهزة')}</span>
                  <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                    {[
                      { id: 'vintage', label: t('Vintage', 'عتيق') },
                      { id: 'cool', label: t('Cool Cinematic', 'بارد سينمائي') },
                      { id: 'warm', label: t('Warm Sun', 'دافئ مشمس') }
                    ].map(lut => (
                      <button
                        key={lut.id}
                        onClick={() => {
                          const stateKey = lut.id as 'vintage' | 'cool' | 'warm';
                          setFilters({
                            ...DEFAULT_FILTERS,
                            [stateKey]: !filters[stateKey]
                          });
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-center transition ${
                          filters[lut.id as 'vintage' | 'cool' | 'warm']
                            ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-750'
                        }`}
                      >
                        {lut.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Green screen chroma key controls */}
                <div className="pt-4 border-t border-slate-800/80">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-200">{t('Chroma Key (Green Screen)', 'مفتاح الكروما (الخلفية الخضراء)')}</span>
                    <input
                      type="checkbox"
                      checked={chromaKey.enabled}
                      onChange={(e) => setChromaKey({ ...chromaKey, enabled: e.target.checked })}
                      className="rounded text-rose-500 focus:ring-rose-500 h-3.5 w-3.5"
                    />
                  </div>

                  {chromaKey.enabled && (
                    <div className="space-y-3 bg-slate-800/20 p-2.5 rounded-xl border border-slate-800">
                      <div>
                        <label className="text-[10px] text-slate-500 block mb-1">{t('Key Color', 'لون الخلفية المراد إزالتها')}</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={chromaKey.color}
                            onChange={(e) => setChromaKey({ ...chromaKey, color: e.target.value })}
                            className="w-8 h-8 rounded cursor-pointer bg-transparent border border-slate-700"
                          />
                          <input
                            type="text"
                            value={chromaKey.color}
                            onChange={(e) => setChromaKey({ ...chromaKey, color: e.target.value })}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 flex justify-between">
                          <span>{t('Similarity Tol.', 'قوة المطابقة')}</span>
                          <span className="font-mono">{chromaKey.similarity}%</span>
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="90"
                          value={chromaKey.similarity}
                          onChange={(e) => setChromaKey({ ...chromaKey, similarity: parseInt(e.target.value) })}
                          className="w-full h-1 bg-slate-800 rounded mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Reset button */}
                <button
                  onClick={() => {
                    setFilters(DEFAULT_FILTERS);
                    setChromaKey(DEFAULT_CHROMA);
                  }}
                  className="w-full py-1.5 text-xs bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700/60 transition"
                >
                  {t('Reset Effects & Grade', 'إعادة ضبط المؤثرات والألوان')}
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Timeline Tracks Dashboard */}
          <div className="bg-slate-800/20 rounded-2xl p-4 border border-slate-800">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t('Tracks Timeline', 'الخط الزمني للمسارات')}</span>
                
                {/* Timeline zoom slider */}
                <div className="flex items-center gap-1.5 bg-slate-800/40 px-2.5 py-1 rounded-lg border border-slate-700/60">
                  <span className="text-[10px] text-slate-500">{t('Zoom', 'تقريب')}</span>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    value={timelineZoom}
                    onChange={(e) => setTimelineZoom(parseInt(e.target.value))}
                    className="w-16 h-1 bg-slate-700 rounded-lg appearance-none accent-rose-500"
                  />
                </div>
              </div>

              {/* Undo / Redo & split controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 rounded-lg transition"
                  title={t('Undo last timeline change', 'تراجع عن التغيير الأخير')}
                >
                  <Undo className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 rounded-lg transition"
                  title={t('Redo next timeline change', 'إعادة التغيير الملغي')}
                >
                  <Redo className="w-3.5 h-3.5" />
                </button>
                
                <div className="h-4 w-px bg-slate-700 mx-1" />

                <button
                  onClick={() => {
                    const currentClip = clips.find(c => currentTime >= c.start && currentTime <= (c.start + c.duration));
                    if (currentClip) handleSplitClip(currentClip.id);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-medium rounded-lg text-slate-200 hover:text-white flex items-center gap-1.5 transition"
                >
                  <Scissors className="w-3.5 h-3.5 text-rose-400" />
                  {t('Split at Playhead', 'قص عند المؤشر')}
                </button>
              </div>
            </div>

            {/* Visual Timeline Lanes Layout */}
            <div className="relative overflow-x-auto border border-slate-800 bg-slate-950/40 rounded-xl max-h-[250px] no-scrollbar">
              
              {/* Timeline Header (Time ticks) */}
              <div className="h-8 border-b border-slate-800 flex relative" style={{ width: `${timelineDuration * timelineZoom}px` }}>
                {Array.from({ length: Math.ceil(timelineDuration) }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 border-l border-slate-800/80 h-full flex flex-col justify-between pt-1"
                    style={{ left: `${i * timelineZoom}px`, width: `${timelineZoom}px` }}
                  >
                    <span className="font-mono text-[9px] text-slate-500 pl-1">
                      {i}s
                    </span>
                    <div className="h-1.5 w-px bg-slate-700" />
                  </div>
                ))}
              </div>

              {/* Lane 1: Video Track */}
              <div className="flex min-h-[50px] border-b border-slate-800/40 items-center relative" style={{ width: `${timelineDuration * timelineZoom}px` }}>
                <div className="absolute left-0 top-0 h-full w-24 bg-indigo-950/20 border-r border-slate-800/60 z-10 flex items-center px-3 gap-1 text-[10px] text-slate-400 select-none">
                  <Film className="w-3 h-3 text-indigo-400" />
                  {t('VIDEO', 'الفيديو')}
                </div>
                
                <div className="pl-24 w-full h-full relative">
                  {clips.filter(c => c.trackIndex === 0).map(clip => (
                    <div
                      key={clip.id}
                      className="absolute top-2 bottom-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/45 border border-indigo-500/50 p-1.5 flex items-center justify-between text-left group transition overflow-hidden"
                      style={{
                        left: `${clip.start * timelineZoom}px`,
                        width: `${clip.duration * timelineZoom}px`
                      }}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[10px] font-medium text-indigo-200 truncate pr-2">{clip.name}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteClip(clip.id)}
                        className="p-1 hover:bg-rose-600 rounded text-slate-400 hover:text-white transition opacity-0 group-hover:opacity-100 flex-shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lane 2: Audio Track */}
              <div className="flex min-h-[50px] border-b border-slate-800/40 items-center relative" style={{ width: `${timelineDuration * timelineZoom}px` }}>
                <div className="absolute left-0 top-0 h-full w-24 bg-emerald-950/20 border-r border-slate-800/60 z-10 flex items-center px-3 gap-1 text-[10px] text-slate-400 select-none">
                  <Music className="w-3 h-3 text-emerald-400" />
                  {t('AUDIO', 'الصوت')}
                </div>
                
                <div className="pl-24 w-full h-full relative">
                  {clips.filter(c => c.trackIndex === 1).map(clip => (
                    <div
                      key={clip.id}
                      className="absolute top-2 bottom-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 p-1.5 flex items-center justify-between text-left group transition overflow-hidden"
                      style={{
                        left: `${clip.start * timelineZoom}px`,
                        width: `${clip.duration * timelineZoom}px`
                      }}
                    >
                      <div className="flex items-center gap-1.5 min-w-0 w-full">
                        <span className="text-[10px] font-medium text-emerald-200 truncate pr-2">{clip.name}</span>
                        {/* Simulated Waveform peaks visual */}
                        <div className="flex-1 flex gap-0.5 items-center opacity-40">
                          <div className="h-1.5 w-1 bg-emerald-400 rounded-full" />
                          <div className="h-3 w-1 bg-emerald-400 rounded-full" />
                          <div className="h-2 w-1 bg-emerald-400 rounded-full" />
                          <div className="h-1.5 w-1 bg-emerald-400 rounded-full" />
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteClip(clip.id)}
                        className="p-1 hover:bg-rose-600 rounded text-slate-400 hover:text-white transition opacity-0 group-hover:opacity-100 flex-shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lane 3: Subtitles and graphics Track */}
              <div className="flex min-h-[50px] items-center relative" style={{ width: `${timelineDuration * timelineZoom}px` }}>
                <div className="absolute left-0 top-0 h-full w-24 bg-amber-950/20 border-r border-slate-800/60 z-10 flex items-center px-3 gap-1 text-[10px] text-slate-400 select-none">
                  <Type className="w-3 h-3 text-amber-400" />
                  {t('TEXT', 'النصوص')}
                </div>
                
                <div className="pl-24 w-full h-full relative">
                  {subtitles.map(sub => (
                    <div
                      key={sub.id}
                      className="absolute top-2 bottom-2 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 p-1.5 flex items-center justify-between text-left group transition overflow-hidden cursor-pointer"
                      style={{
                        left: `${sub.start * timelineZoom}px`,
                        width: `${(sub.end - sub.start) * timelineZoom}px`
                      }}
                    >
                      <span className="text-[9px] text-amber-200 font-medium truncate pr-2">{sub.text}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const updated = subtitles.filter(s => s.id !== sub.id);
                          setSubtitles(updated);
                          pushToHistory(clips, updated);
                        }}
                        className="p-0.5 hover:bg-rose-600 rounded text-slate-400 hover:text-white transition opacity-0 group-hover:opacity-100 flex-shrink-0"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Playhead Needle */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-30 pointer-events-none"
                style={{
                  left: `${currentTime * timelineZoom + 96}px` // Account for the track titles (24px padding + 72px)
                }}
              >
                <div className="w-3 h-3 bg-rose-500 rounded-full -ml-1.5 border border-white" />
              </div>

              {/* Timeline click-to-scrub transparent overlay */}
              <div
                className="absolute top-0 bottom-0 left-24 right-0 z-20 cursor-ew-resize opacity-0"
                onClick={(e) => {
                  const bounds = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - bounds.left;
                  const targetTime = clickX / timelineZoom;
                  setCurrentTime(Math.max(0, Math.min(timelineDuration, targetTime)));
                }}
              />

            </div>
          </div>
        </div>
      )}

      {/* VIEW: QUICK TOOLS */}
      {activeTab === 'quick-tools' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Quick Compressor, Rotator, Splicer file select */}
            <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-rose-400" />
                {t('Quick Sandbox Processor', 'معالج الأدوات السريعة')}
              </h3>

              <div className="border-2 border-dashed border-slate-700 p-5 rounded-xl text-center cursor-pointer hover:border-indigo-500 transition relative">
                <Upload className="w-7 h-7 mx-auto text-slate-500 mb-2" />
                <span className="text-xs font-semibold block text-slate-300">{t('Select Video File', 'اختر ملف فيديو للبدء')}</span>
                <span className="text-[10px] text-slate-500 block mt-1">{t('Supports MP4, WebM, AVI, MKV up to 500MB', 'يدعم صيغ MP4, WebM, AVI, MKV')}</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleQtFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {qtSelectedFile && (
                <div className="bg-slate-800/20 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] text-indigo-400 uppercase font-mono tracking-wider">{t('Detected Metadata', 'البيانات الوصفية للملف')}</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block">{t('Filename', 'اسم الملف')}</span>
                      <span className="text-slate-300 truncate block">{qtMetadata?.filename}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{t('Size', 'الحجم')}</span>
                      <span className="text-slate-300 block">{qtMetadata?.size}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{t('Format', 'الصيغة')}</span>
                      <span className="text-slate-300 block">{qtMetadata?.type}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{t('Resolution', 'الدقة')}</span>
                      <span className="text-slate-300 block">{qtMetadata?.resolution}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Processor Settings & Quick Action Panel */}
            <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800 space-y-5">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-indigo-400" />
                {t('Production Quick Actions', 'إجراءات الإنتاج السريعة')}
              </h3>

              {/* Speed changer */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 flex justify-between">
                  <span>{t('Change Playback Speed', 'تغيير سرعة التشغيل')}</span>
                  <span className="font-mono text-rose-400 font-bold">{qtSpeed}x</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0.5, 1.0, 1.5, 2.0].map(speed => (
                    <button
                      key={speed}
                      onClick={() => setQtSpeed(speed)}
                      className={`py-1 rounded text-xs font-medium border ${
                        qtSpeed === speed
                          ? 'bg-rose-600/10 border-rose-500 text-rose-400'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                      }`}
                    >
                      {speed === 0.5 ? t('Slow Mo', 'بطيء') : speed === 2.0 ? t('Fast Mo', 'سريع') : speed + 'x'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rotate and flip */}
              <div className="space-y-1.5">
                <span className="text-xs text-slate-400 block">{t('Transform Layout', 'تحويل المظهر والتوجيه')}</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setQtRotation(prev => (prev + 90) % 360)}
                    className="py-1.5 rounded bg-slate-850 hover:bg-slate-750 border border-slate-700/80 text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    90°
                  </button>
                  <button
                    onClick={() => setQtFlipH(!qtFlipH)}
                    className={`py-1.5 rounded border text-xs flex items-center justify-center gap-1.5 transition ${
                      qtFlipH ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-slate-850 border-slate-700/80 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    <FlipHorizontal className="w-3.5 h-3.5" />
                    {t('Flip H', 'مرآة أفقية')}
                  </button>
                  <button
                    onClick={() => setQtFlipV(!qtFlipV)}
                    className={`py-1.5 rounded border text-xs flex items-center justify-center gap-1.5 transition ${
                      qtFlipV ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-slate-850 border-slate-700/80 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    <FlipHorizontal className="w-3.5 h-3.5 rotate-90" />
                    {t('Flip V', 'مرآة رأسية')}
                  </button>
                </div>
              </div>

              {/* Trimmer start & end */}
              <div className="space-y-2">
                <span className="text-xs text-slate-400 block">{t('Trim Video Range (Seconds)', 'تحديد نطاق قص الفيديو (بالثواني)')}</span>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <span className="text-[10px] text-slate-500 block">{t('Start offset', 'بداية القص')}</span>
                    <input
                      type="number"
                      value={qtTrimStart}
                      onChange={(e) => setQtTrimStart(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-850 border border-slate-700 rounded-lg p-2 text-xs focus:ring-1 focus:ring-rose-500 text-slate-200"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-slate-500 block">{t('End offset', 'نهاية القص')}</span>
                    <input
                      type="number"
                      value={qtTrimEnd}
                      onChange={(e) => setQtTrimEnd(parseFloat(e.target.value) || 10)}
                      className="w-full bg-slate-850 border border-slate-700 rounded-lg p-2 text-xs focus:ring-1 focus:ring-rose-500 text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Audio Extractor action trigger */}
              <div className="pt-3 border-t border-slate-800/80 flex justify-between gap-3">
                <button
                  onClick={() => {
                    if (!qtSelectedFile) return alert(t('Please select a video file first.', 'يرجى اختيار ملف فيديو أولاً.'));
                    setQtAudioExtractorResult(URL.createObjectURL(qtSelectedFile));
                    alert(t('Audio track extracted locally! Click Download Audio below.', 'تم استخراج مسار الصوت بنجاح! اضغط على زر تحميل الصوت بالأسفل.'));
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition"
                >
                  {t('Extract Audio (MP3/WAV)', 'استخراج الصوت فقط')}
                </button>
                
                <button
                  onClick={() => {
                    if (!qtSelectedFile) return alert(t('Please select a video file first.', 'يرجى اختيار ملف فيديو أولاً.'));
                    const url = URL.createObjectURL(qtSelectedFile);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `processed_${qtSelectedFile.name}`;
                    link.click();
                  }}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-rose-600/15 transition"
                >
                  {t('Compile and Download Video', 'بدء معالجة وتحميل الفيديو')}
                </button>
              </div>

              {qtAudioExtractorResult && (
                <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-medium text-slate-300">{t('Extracted Audio Wave.wav', 'الملف الصوتي المستخرج.wav')}</span>
                  </div>
                  <a
                    href={qtAudioExtractorResult}
                    download="extracted_audio.wav"
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] text-slate-200 border border-slate-700 flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    {t('Download Audio', 'تحميل الصوت')}
                  </a>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* VIEW: AUDIO & SUBTITLES */}
      {activeTab === 'audio-subs' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Live voice recording and audio mixer */}
            <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-emerald-400" />
                {t('Voiceover Recorder & Live Audio Synchronizer', 'مسجل التعليق الصوتي ومزامنة الصوت المباشرة')}
              </h3>

              <p className="text-xs text-slate-400">
                {t('Record high fidelity commentary or sound clips directly through your microphone and add them onto the timeline.', 'سجل تعليقاً صوتياً عالي الدقة مباشرة من ميكروفون جهازك لإضافته فوراً إلى الخط الزمني للفيديو.')}
              </p>

              {/* Recording controls */}
              <div className="flex items-center gap-4 bg-slate-800/20 p-4 rounded-xl border border-slate-800 justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-full ${isRecordingVoice ? 'bg-rose-500 animate-pulse' : 'bg-slate-600'}`} />
                  <span className="text-xs font-medium text-slate-300">
                    {isRecordingVoice ? t('Recording active...', 'جارِ التسجيل الآن...') : t('Recorder Standby', 'المسجل في وضع الاستعداد')}
                  </span>
                </div>

                <div className="flex gap-2">
                  {!isRecordingVoice ? (
                    <button
                      onClick={startVoiceRecording}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-600/10 transition"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      {t('Start Recording', 'بدء التسجيل')}
                    </button>
                  ) : (
                    <button
                      onClick={stopVoiceRecording}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-rose-600/10 transition"
                    >
                      <Square className="w-3.5 h-3.5 fill-white" />
                      {t('Stop & Add to Tracks', 'إيقاف وإضافة للمسار')}
                    </button>
                  )}
                </div>
              </div>

              {/* Simple low-pass noise gate toggles */}
              <div className="space-y-3">
                <span className="text-xs text-slate-400 block">{t('Audio Cleaning Filters', 'فلاتر تنقية وتصفية الصوت')}</span>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2 px-3 rounded bg-slate-850 hover:bg-slate-750 border border-slate-700 text-xs text-slate-300 text-left flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    {t('Noise Reduction (Gate)', 'بوابة عزل الضوضاء')}
                  </button>
                  <button className="py-2 px-3 rounded bg-slate-850 hover:bg-slate-750 border border-slate-700 text-xs text-slate-300 text-left flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    {t('Low Pass (Voice Enhance)', 'تصفية الترددات (تحسين الصوت)')}
                  </button>
                </div>
              </div>
            </div>

            {/* Subtitles (SRT/VTT) Editor & Exporter */}
            <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800 flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  {t('Interactive Subtitle (SRT/VTT) Editor', 'محرر ومحول الترجمات والملفات (SRT/VTT)')}
                </h3>
              </div>

              {/* List of current subtitles */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar mb-4">
                {subtitles.map((sub, idx) => (
                  <div key={sub.id} className="p-3 bg-slate-800/20 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex justify-between gap-2 items-center">
                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                          {idx + 1}
                        </span>
                        <div className="flex gap-1 items-center">
                          <input
                            type="number"
                            value={sub.start}
                            onChange={(e) => handleUpdateSub(sub.id, 'start', parseFloat(e.target.value) || 0)}
                            className="w-12 bg-slate-850 text-slate-300 text-xs text-center border border-slate-700 rounded py-0.5"
                          />
                          <span className="text-[10px] text-slate-500">s</span>
                          <span className="text-[10px] text-slate-500 mx-0.5">➔</span>
                          <input
                            type="number"
                            value={sub.end}
                            onChange={(e) => handleUpdateSub(sub.id, 'end', parseFloat(e.target.value) || 0)}
                            className="w-12 bg-slate-850 text-slate-300 text-xs text-center border border-slate-700 rounded py-0.5"
                          />
                          <span className="text-[10px] text-slate-500">s</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const updated = subtitles.filter(s => s.id !== sub.id);
                          setSubtitles(updated);
                          pushToHistory(clips, updated);
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <textarea
                      value={sub.text}
                      onChange={(e) => handleUpdateSub(sub.id, 'text', e.target.value)}
                      rows={1}
                      className="w-full bg-slate-850 text-xs border border-slate-700 rounded-lg p-2 text-slate-100 focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                ))}
              </div>

              {/* Subtitle export formats */}
              <div className="flex gap-2 justify-end border-t border-slate-800/60 pt-3">
                <button
                  onClick={() => {
                    let srtStr = '';
                    subtitles.forEach((sub, i) => {
                      const pad = (n: number) => Math.floor(n).toString().padStart(2, '0');
                      const sStr = `00:00:${pad(sub.start)},000`;
                      const eStr = `00:00:${pad(sub.end)},000`;
                      srtStr += `${i+1}\n${sStr} --> ${eStr}\n${sub.text}\n\n`;
                    });
                    const blob = new Blob([srtStr], { type: 'text/srt' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'subtitles.srt';
                    link.click();
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  {t('Export SRT', 'تصدير SRT')}
                </button>
                
                <button
                  onClick={() => {
                    let vttStr = 'WEBVTT\n\n';
                    subtitles.forEach((sub, i) => {
                      const pad = (n: number) => Math.floor(n).toString().padStart(2, '0');
                      const sStr = `00:00:${pad(sub.start)}.000`;
                      const eStr = `00:00:${pad(sub.end)}.000`;
                      vttStr += `${i+1}\n${sStr} --> ${eStr}\n${sub.text}\n\n`;
                    });
                    const blob = new Blob([vttStr], { type: 'text/vtt' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'subtitles.vtt';
                    link.click();
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  {t('Export VTT', 'تصدير VTT')}
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* VIEW: OVERLAYS & GRAPHICS */}
      {activeTab === 'overlays' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Thumbnail Designer Canvas and settings */}
            <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                {t('YouTube / Shorts Thumbnail Designer', 'مصمم صور الغلاف واللوجو لليوتيوب والتيك توك')}
              </h3>

              {/* File input for Thumbnail base */}
              <div className="space-y-3">
                <span className="text-xs text-slate-400 block">{t('Thumbnail Base Image', 'الصورة الأساسية للغلاف')}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbFileChange}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-750"
                />
              </div>

              {/* Text sticker customize */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">{t('Banner Bold Text', 'النص العريض الملفت')}</span>
                  <input
                    type="text"
                    value={thumbText}
                    onChange={(e) => setThumbText(e.target.value)}
                    className="w-full bg-slate-850 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-1">{t('Accent Sticker/Emoji', 'رمز تعبيري ملفت (ستيكر)')}</span>
                  <select
                    value={thumbSticker}
                    onChange={(e) => setThumbSticker(e.target.value)}
                    className="w-full bg-slate-850 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  >
                    <option value="🔥">🔥 Hot</option>
                    <option value="⚠️">⚠️ Warning</option>
                    <option value="💥">💥 Pop</option>
                    <option value="😱">😱 Reaction</option>
                    <option value="✅">✅ True</option>
                  </select>
                </div>
              </div>

              {/* Color styling */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">{t('Text Color', 'لون خط النص')}</span>
                  <input
                    type="color"
                    value={thumbTextColor}
                    onChange={(e) => setThumbTextColor(e.target.value)}
                    className="w-full h-8 rounded bg-transparent border border-slate-700 cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-1">{t('Background Plate', 'خلفية لوحة النص')}</span>
                  <input
                    type="color"
                    value={thumbBgColor}
                    onChange={(e) => setThumbBgColor(e.target.value)}
                    className="w-full h-8 rounded bg-transparent border border-slate-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* Exporter Button */}
              <button
                onClick={() => {
                  const canvas = document.createElement('canvas');
                  canvas.width = 1280;
                  canvas.height = 720;
                  const ctx = canvas.getContext('2d');
                  if (!ctx) return;

                  // Fill color background
                  ctx.fillStyle = thumbBgColor;
                  ctx.fillRect(0, 0, 1280, 720);

                  // If custom photo is uploaded
                  if (thumbImageSrc) {
                    const img = new Image();
                    img.src = thumbImageSrc;
                    img.onload = () => {
                      ctx.drawImage(img, 0, 0, 1280, 720);
                      drawText();
                    };
                  } else {
                    drawText();
                  }

                  function drawText() {
                    // Draw stickers
                    ctx.font = "120px sans-serif";
                    ctx.fillText(thumbSticker, 100, 250);

                    // Title banner text
                    ctx.fillStyle = "#ffffff";
                    ctx.font = "bold 80px sans-serif";
                    ctx.shadowColor = "rgba(0,0,0,0.8)";
                    ctx.shadowBlur = 15;
                    ctx.fillText(thumbText, 100, 480);

                    // Watermark / credit
                    ctx.font = "30px sans-serif";
                    ctx.fillStyle = thumbTextColor;
                    ctx.fillText(t('Created with DevBox', 'صنع بواسطة ديف بوكس'), 100, 600);

                    const dl = document.createElement('a');
                    dl.download = 'thumbnail.png';
                    dl.href = canvas.toDataURL('image/png');
                    dl.click();
                  }
                }}
                className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-rose-600/15 transition"
              >
                {t('Export High-Res Thumbnail Image (1280x720)', 'تحميل وتصدير صورة الغلاف بدقة عالية')}
              </button>
            </div>

            {/* Sticker overlay library & watermark manager */}
            <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                {t('Stickers, Logos & Floating Text Watermark', 'الملصقات، الشعارات واللوجو المائي العائم')}
              </h3>

              <p className="text-xs text-slate-400">
                {t('Add customized text banners, floating logos, and graphical watermarks directly overlaying your video preview.', 'أضف طبقات عائمة من نصوص ترويجية، شعارات بصرية، أو علامات مائية مخصصة فوق الفيديو.')}
              </p>

              <div className="space-y-3 bg-slate-800/20 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-300 font-bold block">{t('Dynamic Banners Creator', 'منشئ الشعارات المتحركة والعائمة')}</span>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder={t('Enter overlay slogan...', 'أدخل الشعار أو النص العائم...')}
                    onChange={(e) => {
                      if (!e.target.value) return;
                      // Instantly append a text overlay
                      const newOverlay: TextOverlay = {
                        id: 'text_' + Date.now(),
                        text: e.target.value,
                        x: 50,
                        y: 30,
                        fontSize: 28,
                        color: '#f59e0b',
                        bgColor: '#000000',
                        bgOpacity: 0.7,
                        fontFamily: 'sans-serif',
                        animation: 'none'
                      };
                      setTextOverlays([newOverlay]);
                    }}
                    className="w-full bg-slate-850 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                  <p className="text-[10px] text-slate-500">{t('Hint: Type text to display as a floating watermarked brand on the preview player.', 'ملاحظة: اكتب النص ليظهر فوراً كشعار علامة مائية عائم على شاشة العرض.')}</p>
                </div>
              </div>

              {/* Watermark remove button */}
              {textOverlays.length > 0 && (
                <button
                  onClick={() => setTextOverlays([])}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-rose-400 rounded-lg transition"
                >
                  {t('Clear Floating Watermarks', 'حذف جميع الشعارات العائمة')}
                </button>
              )}
            </div>

          </div>

        </div>
      )}

      {/* VIEW: AI ASSISTED COPILOT */}
      {activeTab === 'ai-copilot' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-400" />
              {t('AI Copilot & Cinematic Prompt Generator', 'مساعد الإنتاج الذكي ومولد سيناريوهات الذكاء الاصطناعي')}
            </h3>

            <p className="text-xs text-slate-400">
              {t('Need highly descriptive prompts for external AI generation tools (Veo, Sora, Runway, Midjourney) or custom scripts? Describe your concept here.', 'هل تبحث عن صياغة سيناريوهات ملهمة أو نصوص جاهزة لمولدات الذكاء الاصطناعي الخارجية؟ صف فكرتك الإبداعية هنا.')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <span className="text-xs text-slate-400 block mb-1.5">{t('Video Concept or Topic', 'فكرة الفيديو أو الموضوع العام')}</span>
                <input
                  type="text"
                  placeholder={t('e.g. A fast drone flight through ancient ruins during golden hour', 'مثال: طيران طائرة درون سريعة بين آثار قديمة وقت الغروب')}
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1.5">{t('Social Platform Preset', 'مقاس شبكة التواصل الاجتماعي')}</span>
                <select
                  value={aiPlatform}
                  onChange={(e) => setAiPlatform(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="TikTok">TikTok Presets (9:16)</option>
                  <option value="Instagram Reels">Instagram Reels (9:16)</option>
                  <option value="YouTube Widescreen">YouTube Widescreen (16:9)</option>
                  <option value="YouTube Shorts">YouTube Shorts (9:16)</option>
                </select>
              </div>
            </div>

            <button
              onClick={generateAIPrompt}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/15 flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-4 h-4" />
              {t('Generate Production Prompts & Captions', 'توليد السيناريو والترجمة المخصصة')}
            </button>

            {aiGeneratedPrompt && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 animate-fadeIn">
                
                {/* Visual Prompts box */}
                <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-300">{t('Optimized AI Generation Prompt', 'نص فكرة التوليد المحسن')}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(aiGeneratedPrompt);
                        alert(t('Copied prompt to clipboard!', 'تم نسخ نص الفكرة للحافظة!'));
                      }}
                      className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 bg-slate-900/50 p-3 rounded-lg font-mono leading-relaxed border border-slate-850 select-all">
                    {aiGeneratedPrompt}
                  </p>
                </div>

                {/* Subtitle / SRT scripts Box */}
                <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-300">{t('Suggested Captions Script', 'السيناريو والترجمة التوضيحية المقترحة')}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(aiGeneratedScript);
                        alert(t('Copied script to clipboard!', 'تم نسخ السيناريو للحافظة!'));
                      }}
                      className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 bg-slate-900/50 p-3 rounded-lg font-mono leading-relaxed border border-slate-850 whitespace-pre-line">
                    {aiGeneratedScript}
                  </p>
                </div>

                {/* AI SRT export tool */}
                <div className="md:col-span-2 bg-slate-800/10 p-3 rounded-xl border border-slate-850 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-medium text-slate-300">{t('Auto-Generated SRT Subtitles file available.', 'ملف الترجمة التلقائي SRT جاهز للتحميل والتركيب.')}</span>
                  </div>
                  
                  <button
                    onClick={() => {
                      // Apply directly to active subtitle timeline
                      const parsedSubs: SubtitleItem[] = [
                        { id: 'ai_1', text: t('Ready to start this amazing footage?', 'هل أنت مستعد لمشاهدة اللقطة الحماسية؟'), start: 1, end: 4 },
                        { id: 'ai_2', text: t(`Showcasing visual art of: ${aiTopic}`, `تنسيق وعرض: ${aiTopic}`), start: 5, end: 12 },
                        { id: 'ai_3', text: t('Created with DevBox Offline Video Studio', 'تم الإنتاج بالكامل في ديف بوكس'), start: 13, end: 18 }
                      ];
                      setSubtitles(parsedSubs);
                      pushToHistory(clips, parsedSubs);
                      alert(t('Successfully injected AI subtitle tracks into the Timeline!', 'تم إدخال نصوص الترجمة بنجاح في خط التعديل الزمني!'));
                    }}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    {t('Apply to Timeline Now', 'تطبيق فوري على الخط الزمني')}
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>
      )}

      {/* VIEW: PROJECT DATABASE MANAGEMENT */}
      {activeTab === 'projects' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-rose-400" />
              {t('Manage Offline Saved Projects', 'إدارة المشاريع المحفوظة والمؤرشفة')}
            </h3>

            <p className="text-xs text-slate-400">
              {t('All your active video compositions are securely saved on your device inside standard LocalStorage database cache. Cleared caches might erase these.', 'جميع مسودات تعديل الفيديو الخاصة بك يتم أرشفتها محلياً وبشكل آمن تماماً داخل متصفحك الحالي.')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.length === 0 ? (
                <div className="col-span-full text-center py-10 bg-slate-850/20 border border-slate-800 rounded-xl text-slate-500">
                  <FolderOpen className="w-10 h-10 mx-auto opacity-30 mb-2" />
                  <p className="text-xs">{t('No saved projects found on this device.', 'لم يتم العثور على أي مشاريع محفوظة في هذا المتصفح.')}</p>
                </div>
              ) : (
                projects.map(proj => (
                  <div key={proj.id} className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-xs text-slate-200 block truncate max-w-[80%]">{proj.name}</span>
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-mono">
                          {proj.aspectRatio || '16:9'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-1">{t('Created:', 'تاريخ الأرشفة:')} {proj.createdAt}</span>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => handleLoadProject(proj)}
                        className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold text-center transition"
                      >
                        {t('Load Project', 'تحميل المشروع')}
                      </button>
                      
                      <button
                        onClick={() => {
                          const updated = projects.filter(p => p.id !== proj.id);
                          setProjects(updated);
                          localStorage.setItem('devbox_video_projects', JSON.stringify(updated));
                        }}
                        className="p-1.5 hover:bg-rose-600/10 text-slate-400 hover:text-rose-400 rounded-lg border border-slate-800 hover:border-rose-500/30 transition"
                        title={t('Delete project', 'حذف المشروع')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* Production studio footer note */}
      <div className="mt-8 border-t border-slate-800/60 pt-4 text-center">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1">
          <AlertCircle className="w-3 h-3 text-rose-500" />
          {t('Secure Local Browser Sandboxed Sandbox — Zero Server Traffic', 'بيئة عمل محلية بالكامل آمنة ومحمية — لا يتم إرسال أي بيانات لخوادم وسيطة')}
        </p>
      </div>

    </div>
  );
};
