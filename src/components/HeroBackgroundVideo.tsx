import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Upload,
  RotateCcw,
  Check,
  Sun,
  Moon
} from 'lucide-react';

interface HeroBackgroundVideoProps {
  children: React.ReactNode;
}

const DIM_STORAGE_KEY = 'rich_pro_hero_video_dim';
export const OFFICIAL_HERO_VIDEO = '/hero-video.mp4';
export const OFFICIAL_HERO_POSTER = '/hero-poster.jpg';

type DimMode = 'clear' | 'soft' | 'dark';

// IndexedDB Storage to hold user's MP4 video permanently without 5MB quota limits
const DB_NAME = 'rich_pro_media_db';
const STORE_NAME = 'videos';
const KEY = 'hero_background_video';

function openVideoDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveVideoBlob(blob: Blob): Promise<void> {
  try {
    const db = await openVideoDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(blob, KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Error saving video to IndexedDB:', err);
  }
}

async function getVideoBlob(): Promise<Blob | null> {
  try {
    const db = await openVideoDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(KEY);
      getReq.onsuccess = () => resolve(getReq.result || null);
      getReq.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function clearVideoBlob(): Promise<void> {
  try {
    const db = await openVideoDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // ignore
  }
}

export const HeroBackgroundVideo: React.FC<HeroBackgroundVideoProps> = ({ children }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [videoSrc, setVideoSrc] = useState<string | null>(OFFICIAL_HERO_VIDEO);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [hasCustomVideo, setHasCustomVideo] = useState<boolean>(false);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dimMode, setDimMode] = useState<DimMode>(() => {
    try {
      const saved = localStorage.getItem(DIM_STORAGE_KEY) as DimMode;
      if (saved === 'clear' || saved === 'soft' || saved === 'dark') return saved;
    } catch {}
    return 'clear';
  });

  // Load stored video from IndexedDB or default to /hero-video.mp4
  useEffect(() => {
    let active = true;

    async function initVideo() {
      try {
        localStorage.removeItem('rich_pro_custom_hero_video');
        localStorage.removeItem('rich_pro_custom_hero_video_v2');
      } catch {}

      // 1. First check IndexedDB (custom user video uploaded from browser)
      const storedBlob = await getVideoBlob();
      if (!active) return;

      if (storedBlob) {
        const objectUrl = URL.createObjectURL(storedBlob);
        setVideoSrc(objectUrl);
        setHasCustomVideo(true);
        return;
      }

      // 2. Default to the official video in /public/hero-video.mp4
      setVideoSrc(OFFICIAL_HERO_VIDEO);
      setHasCustomVideo(false);
    }

    initVideo();
    return () => {
      active = false;
    };
  }, []);

  // Futuristic dark cyber background animation when no video is loaded yet
  useEffect(() => {
    if (videoLoaded && videoSrc) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    window.addEventListener('resize', onResize);

    const particles: { x: number; y: number; vx: number; vy: number; r: number; color: string }[] = [];
    const colors = ['#8b5cf6', '#06b6d4', '#f59e0b', '#a855f7', '#38bdf8'];

    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(7, 8, 14, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Subtle tech grid
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 64;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Digital connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.strokeStyle = `rgba(139, 92, 246, ${(1 - dist / 110) * 0.18})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, [videoLoaded, videoSrc]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const cycleDimMode = () => {
    const modes: DimMode[] = ['clear', 'soft', 'dark'];
    const nextIndex = (modes.indexOf(dimMode) + 1) % modes.length;
    const nextMode = modes[nextIndex];
    setDimMode(nextMode);
    try {
      localStorage.setItem(DIM_STORAGE_KEY, nextMode);
    } catch {}

    const label = nextMode === 'clear' ? 'Vídeo 100% Brillante' : nextMode === 'soft' ? 'Atenuado Suave' : 'Modo Contraste';
    setUploadNotice(label);
    setTimeout(() => setUploadNotice(null), 2000);
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Por favor selecciona un archivo de vídeo válido (MP4, WebM o MOV).');
      return;
    }

    try {
      // Save permanently into IndexedDB
      await saveVideoBlob(file);

      const objectUrl = URL.createObjectURL(file);
      setVideoSrc(objectUrl);
      setHasCustomVideo(true);
      setVideoLoaded(true);
      setIsPlaying(true);

      setUploadNotice('¡Vídeo guardado permanentemente!');
      setTimeout(() => setUploadNotice(null), 3500);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
        }
      }, 200);
    } catch (err) {
      console.error('Error cargando vídeo:', err);
    }
  };

  const handleResetVideo = async () => {
    await clearVideoBlob();
    setVideoSrc(null);
    setHasCustomVideo(false);
    setVideoLoaded(false);
    setUploadNotice('Fondo restablecido');
    setTimeout(() => setUploadNotice(null), 2500);
  };

  return (
    <section
      id="home-hero-section"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('video/')) {
          handleFileUpload(file);
        }
      }}
      className="relative overflow-hidden bg-[#07080e] border-b border-white/10 py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8 min-h-[580px] flex flex-col justify-center transition-all"
    >
      {/* DRAG & DROP HOVER OVERLAY */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-violet-950/85 border-4 border-dashed border-violet-400 backdrop-blur-md flex flex-col items-center justify-center text-white pointer-events-none animate-pulse">
          <Upload className="w-16 h-16 text-violet-300 mb-3" />
          <p className="text-xl font-black tracking-wide uppercase">Suelta aquí tu vídeo para el Hero</p>
          <p className="text-sm text-violet-200 mt-1">Se guardará permanentemente en tu navegador</p>
        </div>
      )}

      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={OFFICIAL_HERO_POSTER}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            onLoadedData={() => setVideoLoaded(true)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => {
              console.warn('Could not play videoSrc, showing cyber canvas');
              setVideoLoaded(false);
            }}
            className="w-full h-full object-cover object-center brightness-105 contrast-105 transform-gpu"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          /* High-Tech Cyber Canvas background */
          <div className="relative w-full h-full bg-[#07080e]">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-950/50 via-indigo-950/20 to-cyan-950/40" />
          </div>
        )}

        {/* Dynamic & Transparent Overlays: Video remains vividly visible */}
        {dimMode === 'clear' && (
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080e] via-transparent to-black/15 pointer-events-none" />
        )}

        {dimMode === 'soft' && (
          <div className="absolute inset-0 bg-black/25 bg-gradient-to-t from-[#07080e] via-transparent to-black/25 pointer-events-none" />
        )}

        {dimMode === 'dark' && (
          <div className="absolute inset-0 bg-black/45 bg-gradient-to-t from-[#07080e] via-transparent to-black/35 pointer-events-none" />
        )}
      </div>

      {/* FLOATING VIDEO CONTROLS PILL (Discreet, Top-Right Corner) */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
        {uploadNotice && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/90 border border-violet-500/50 text-white text-[11px] font-bold shadow-xl backdrop-blur-md animate-fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{uploadNotice}</span>
          </div>
        )}

        <div className="flex items-center gap-1 p-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white shadow-2xl">
          {/* Status badge */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Haz clic para subir o cambiar el vídeo de fondo MP4"
            className="flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-violet-300 hover:text-white transition-colors cursor-pointer"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400"></span>
            </span>
            <span className="hidden sm:inline">
              {videoSrc ? 'VÍDEO ACTIVO' : 'SUBIR VÍDEO'}
            </span>
          </button>

          {/* Brightness / Dimming Toggle */}
          {videoSrc && (
            <button
              type="button"
              onClick={cycleDimMode}
              title={`Brillo del vídeo: ${dimMode === 'clear' ? '100% Visible' : dimMode === 'soft' ? 'Suave' : 'Oscuro'}`}
              className="px-2 py-1 rounded-full hover:bg-white/20 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
            >
              {dimMode === 'clear' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span className="hidden sm:inline text-[10px] uppercase font-extrabold text-amber-200">Brillante</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-violet-300" />
                  <span className="hidden sm:inline text-[10px] uppercase font-bold text-violet-200">Atenuado</span>
                </>
              )}
            </button>
          )}

          {/* Play/Pause */}
          {videoSrc && (
            <button
              type="button"
              onClick={togglePlay}
              title={isPlaying ? 'Pausar vídeo de fondo' : 'Reproducir vídeo de fondo'}
              aria-label={isPlaying ? 'Pausar vídeo' : 'Reproducir vídeo'}
              className="p-1.5 rounded-full hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current text-violet-400" />}
            </button>
          )}

          {/* Sound Mute/Unmute */}
          {videoSrc && (
            <button
              type="button"
              onClick={toggleMute}
              title={isMuted ? 'Activar sonido del vídeo' : 'Silenciar sonido'}
              aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
              className="p-1.5 rounded-full hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-violet-400" />}
            </button>
          )}

          {/* Reset if custom */}
          {hasCustomVideo && (
            <button
              type="button"
              onClick={handleResetVideo}
              title="Quitar vídeo personalizado"
              className="p-1.5 rounded-full hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Seleccionar vídeo MP4 de tu equipo"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-bold transition-all shadow-md cursor-pointer ml-0.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Cargar MP4</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
        </div>
      </div>

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
};
