import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Upload,
  RotateCcw,
  Film,
  Check,
  Sun,
  Moon
} from 'lucide-react';

interface HeroBackgroundVideoProps {
  children: React.ReactNode;
}

const STORAGE_KEY = 'rich_pro_custom_hero_video';
const DIM_STORAGE_KEY = 'rich_pro_hero_video_dim';
const DEFAULT_VIDEO_URL = '/hero-video.mp4';

type DimMode = 'clear' | 'soft' | 'dark';

export const HeroBackgroundVideo: React.FC<HeroBackgroundVideoProps> = ({ children }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [videoSrc, setVideoSrc] = useState<string>(DEFAULT_VIDEO_URL);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [hasCustomVideo, setHasCustomVideo] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [dimMode, setDimMode] = useState<DimMode>(() => {
    try {
      const saved = localStorage.getItem(DIM_STORAGE_KEY) as DimMode;
      if (saved === 'clear' || saved === 'soft' || saved === 'dark') return saved;
    } catch {}
    return 'clear'; // Default: totally clear & visible!
  });

  // Load custom video if previously saved in localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setVideoSrc(saved);
        setHasCustomVideo(true);
      }
    } catch {
      // ignore localStorage quota errors
    }
  }, []);

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

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Por favor selecciona un archivo de vídeo válido (MP4, WebM o MOV).');
      return;
    }

    try {
      const objectUrl = URL.createObjectURL(file);
      setVideoSrc(objectUrl);
      setHasCustomVideo(true);
      setVideoError(false);
      setIsPlaying(true);

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        try {
          if (result && result.length < 5 * 1024 * 1024) {
            localStorage.setItem(STORAGE_KEY, result);
          }
        } catch {
          // ignore quota
        }
      };
      reader.readAsDataURL(file);

      setUploadNotice('Vídeo de fondo actualizado');
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

  const handleResetVideo = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setVideoSrc(DEFAULT_VIDEO_URL);
    setHasCustomVideo(false);
    setVideoError(false);
    setIsPlaying(true);
    setUploadNotice('Restablecido al vídeo oficial');
    setTimeout(() => setUploadNotice(null), 3000);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 150);
  };

  return (
    <section
      id="home-hero-section"
      className="relative overflow-hidden bg-[#0a0b12] border-b border-white/10 py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8 min-h-[580px] flex flex-col justify-center"
    >
      {/* BACKGROUND VIDEO LAYER - Crystal Clear & Highly Visible */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
        {!videoError && (
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover object-center brightness-105 contrast-105 transform-gpu"
          />
        )}

        {/* Dynamic & Transparent Overlays: Video remains vividly visible */}
        {dimMode === 'clear' && (
          /* 100% Visible Mode: Only a subtle bottom vignette to seamlessly blend into page */
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b12] via-transparent to-black/15 pointer-events-none" />
        )}

        {dimMode === 'soft' && (
          /* Soft Dimming: 25% tint for extra text pop */
          <div className="absolute inset-0 bg-black/25 bg-gradient-to-t from-[#0a0b12] via-transparent to-black/25 pointer-events-none" />
        )}

        {dimMode === 'dark' && (
          /* Contrast Mode: 45% tint */
          <div className="absolute inset-0 bg-black/45 bg-gradient-to-t from-[#0a0b12] via-transparent to-black/35 pointer-events-none" />
        )}
      </div>

      {/* FLOATING VIDEO CONTROLS PILL (Discreet, Top-Right Corner) */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
        {uploadNotice && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/90 border border-violet-500/50 text-white text-[11px] font-bold shadow-xl backdrop-blur-md animate-fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{uploadNotice}</span>
          </div>
        )}

        <div className="flex items-center gap-1 p-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white shadow-2xl">
          {/* Live Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-200">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400"></span>
            </span>
            <span className="hidden md:inline">VÍDEO DE FONDO</span>
          </div>

          {/* Brightness / Dimming Toggle */}
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

          {/* Play/Pause */}
          <button
            type="button"
            onClick={togglePlay}
            title={isPlaying ? 'Pausar vídeo de fondo' : 'Reproducir vídeo de fondo'}
            aria-label={isPlaying ? 'Pausar vídeo' : 'Reproducir vídeo'}
            className="p-1.5 rounded-full hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current text-violet-400" />}
          </button>

          {/* Sound Mute/Unmute */}
          <button
            type="button"
            onClick={toggleMute}
            title={isMuted ? 'Activar sonido del vídeo' : 'Silenciar sonido'}
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
            className="p-1.5 rounded-full hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-violet-400" />}
          </button>

          {/* Reset if custom */}
          {hasCustomVideo && (
            <button
              type="button"
              onClick={handleResetVideo}
              title="Restablecer al vídeo original"
              className="p-1.5 rounded-full hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Change Video */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Subir o cambiar vídeo de fondo"
            className="p-1.5 rounded-full hover:bg-white/20 text-violet-300 hover:text-white transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
        </div>
      </div>

      {/* FOREGROUND CONTENT (Children sits clearly on top of the video) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
};
