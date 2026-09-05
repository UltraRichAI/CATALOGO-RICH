import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Upload,
  RotateCcw,
  Sparkles,
  Flame,
  Zap,
  Film,
  Check,
  Info
} from 'lucide-react';
import { Product } from '../types';
import { APP_CONFIG } from '../config';

interface HeroVideoShowcaseProps {
  products?: Product[];
  onNavigateToProduct?: (productId: string) => void;
  onNavigateToCatalog?: () => void;
}

const STORAGE_KEY = 'rich_pro_custom_hero_video';
const DEFAULT_VIDEO_URL = '/hero-video.mp4';

export const HeroVideoShowcase: React.FC<HeroVideoShowcaseProps> = ({
  products = [],
  onNavigateToProduct,
  onNavigateToCatalog
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [videoSrc, setVideoSrc] = useState<string>(DEFAULT_VIDEO_URL);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [hasCustomVideo, setHasCustomVideo] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Load saved custom video on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setVideoSrc(saved);
        setHasCustomVideo(true);
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  // Handle play/pause
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

  // Handle mute/unmute
  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  // Handle Fullscreen
  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  // Handle video file upload / drag & drop
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

      // Attempt to save as base64 if small, otherwise store notice
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        try {
          if (result && result.length < 5 * 1024 * 1024) { // Under 5MB
            localStorage.setItem(STORAGE_KEY, result);
          }
        } catch {
          // LocalStorage quota limit
        }
      };
      reader.readAsDataURL(file);

      setUploadSuccessMessage('¡Vídeo cargado correctamente en el Hero!');
      setTimeout(() => setUploadSuccessMessage(null), 4000);

      // Trigger autoplay
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
        }
      }, 200);
    } catch (err) {
      console.error('Error loading video file:', err);
    }
  };

  // Reset to official video
  const handleResetVideo = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setVideoSrc(DEFAULT_VIDEO_URL);
    setHasCustomVideo(false);
    setVideoError(false);
    setIsPlaying(true);
    setUploadSuccessMessage('Restablecido al vídeo oficial de RICH PRO');
    setTimeout(() => setUploadSuccessMessage(null), 3000);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 150);
  };

  // Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Find featured products that match the video theme (Canva, Gemini, Crunchyroll)
  const canvaProduct = products.find(p => p.name.toLowerCase().includes('canva'));
  const geminiProduct = products.find(p => p.name.toLowerCase().includes('gemini'));
  const otherFeatured = products.find(p => p.id !== canvaProduct?.id && p.id !== geminiProduct?.id && p.featured);

  return (
    <div className="w-full space-y-3 relative">
      {/* Top Tagline & Status Header */}
      <div className="flex items-center justify-between px-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-300"></span>
          </span>
          <span className="font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-violet-400" />
            <span>VÍDEO HERO RICH PRO</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] font-bold text-violet-300 bg-violet-950/60 px-2 py-0.5 rounded-full border border-violet-500/30">
            STREAMING & IA
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hasCustomVideo && (
            <button
              type="button"
              onClick={handleResetVideo}
              title="Restablecer al vídeo por defecto"
              className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer px-2 py-0.5 rounded-md hover:bg-white/5"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>Restablecer</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[11px] font-bold text-violet-300 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Upload className="w-3 h-3 text-violet-400" />
            <span>{hasCustomVideo ? 'Cambiar vídeo' : 'Cargar mi vídeo'}</span>
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

      {/* Success Notification Alert */}
      {uploadSuccessMessage && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-violet-950/80 border border-violet-500/40 text-violet-200 text-xs font-semibold animate-fade-in shadow-lg">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{uploadSuccessMessage}</span>
        </div>
      )}

      {/* Main Video Frame Container */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#06070d] border transition-all duration-300 shadow-[0_0_40px_rgba(139,92,246,0.15)] group ${
          isDragging
            ? 'border-violet-400 ring-4 ring-violet-500/30 scale-[1.01]'
            : 'border-white/15 hover:border-violet-500/40'
        }`}
      >
        {/* Ambient Glow behind the video */}
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-cyan-600/20 blur-xl opacity-60 pointer-events-none" />

        {/* 16:9 Video Canvas / Player */}
        <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
          {!videoError ? (
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
              className="w-full h-full object-cover object-center relative z-10"
            />
          ) : (
            /* Cyberpunk Fallback Animation matching user video */
            <div className="w-full h-full relative z-10 bg-gradient-to-b from-[#0a0a14] via-[#05060b] to-[#0a0a16] p-6 flex flex-col items-center justify-center text-center space-y-4 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/30 via-transparent to-transparent pointer-events-none" />
              
              {/* Animated Floating Monitors Hologram Illustration */}
              <div className="relative flex items-center justify-center gap-3 scale-90 sm:scale-100">
                {/* Left Screen: Gemini Pro */}
                <div className="w-20 sm:w-24 h-32 sm:h-36 rounded-xl bg-[#0d0f1f]/90 border border-violet-500/40 p-2 shadow-[0_0_15px_rgba(139,92,246,0.3)] flex flex-col justify-between -rotate-3 animate-pulse">
                  <div className="text-[9px] font-black text-violet-300">GEMINI PRO</div>
                  <div className="w-8 h-8 mx-auto rounded-full bg-violet-600/30 flex items-center justify-center border border-violet-400/40">
                    <Sparkles className="w-4 h-4 text-violet-300" />
                  </div>
                  <div className="text-[8px] text-slate-400 font-bold">18 MESES</div>
                </div>

                {/* Center Screen: Crunchyroll Anime Streaming */}
                <div className="w-44 sm:w-56 h-36 sm:h-44 rounded-xl bg-[#121324]/90 border-2 border-indigo-500/50 p-3 shadow-[0_0_25px_rgba(99,102,241,0.4)] flex flex-col justify-between relative z-20">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-amber-400 uppercase">Crunchyroll / Anime</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-white leading-tight">
                    RICH PRO • STREAMING & IA
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-slate-300">
                    <span className="bg-violet-600 px-1.5 py-0.5 rounded text-white font-bold">Ultra HD</span>
                    <span className="font-bold text-violet-400">Activación Inmediata</span>
                  </div>
                </div>

                {/* Right Screen: Canva Pro */}
                <div className="w-20 sm:w-24 h-32 sm:h-36 rounded-xl bg-[#0d0f1f]/90 border border-cyan-500/40 p-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex flex-col justify-between rotate-3 animate-pulse">
                  <div className="text-[9px] font-black text-cyan-300">CANVA PRO</div>
                  <div className="w-8 h-8 mx-auto rounded-full bg-cyan-600/30 flex items-center justify-center border border-cyan-400/40">
                    <Zap className="w-4 h-4 text-cyan-300" />
                  </div>
                  <div className="text-[8px] text-cyan-400 font-black">S/ 5.00</div>
                </div>
              </div>

              <div className="relative z-20 space-y-1">
                <p className="text-xs font-bold text-slate-300">
                  Arrastra o carga tu vídeo MP4 para reproducirlo en este marco
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Seleccionar archivo de vídeo
                </button>
              </div>
            </div>
          )}

          {/* Holographic Watermark Badge */}
          <div className="absolute top-3 left-3 z-30 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-wider uppercase">RICH PRO STUDIO</span>
          </div>

          {/* Quick Play/Pause Center Indicator on Click */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pausar vídeo' : 'Reproducir vídeo'}
            className="absolute inset-0 z-20 w-full h-full cursor-pointer flex items-center justify-center bg-transparent focus:outline-none"
          >
            {(!isPlaying || isHovered) && (
              <div className="w-14 h-14 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-xl hover:scale-110 hover:bg-violet-600/80 transition-all">
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
              </div>
            )}
          </button>

          {/* Bottom Floating Controls Bar */}
          <div
            className={`absolute bottom-0 inset-x-0 z-30 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-between transition-opacity duration-300 ${
              isHovered || !isPlaying ? 'opacity-100' : 'opacity-0 sm:opacity-75'
            }`}
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                title={isPlaying ? 'Pausar' : 'Reproducir'}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1 text-xs"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-slate-300" /> : <Volume2 className="w-4 h-4 text-violet-400" />}
                <span className="hidden sm:inline text-[10px] font-semibold">{isMuted ? 'Silenciado' : 'Sonido Activo'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                title="Cargar otro vídeo"
                className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Upload className="w-3 h-3 text-violet-400" />
                <span className="hidden sm:inline">Subir MP4</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFullscreen();
                }}
                title="Pantalla completa"
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Quick-Pills for the Featured Products in the Video */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {/* Canva Pill */}
        <button
          type="button"
          onClick={() => {
            if (canvaProduct && onNavigateToProduct) {
              onNavigateToProduct(canvaProduct.id);
            } else if (onNavigateToCatalog) {
              onNavigateToCatalog();
            }
          }}
          className="p-2.5 rounded-xl bg-[#0d0e18] hover:bg-violet-950/40 border border-white/10 hover:border-violet-500/40 text-left transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-0.5">
            <span className="text-violet-400 font-extrabold group-hover:text-violet-300">Canva Pro</span>
            <span className="text-amber-400 font-black">S/ 5.00</span>
          </div>
          <div className="text-[11px] font-bold text-white truncate group-hover:text-violet-200">
            {canvaProduct ? canvaProduct.name : 'Canva Pro Universitario'}
          </div>
        </button>

        {/* Gemini Pro Pill */}
        <button
          type="button"
          onClick={() => {
            if (geminiProduct && onNavigateToProduct) {
              onNavigateToProduct(geminiProduct.id);
            } else if (onNavigateToCatalog) {
              onNavigateToCatalog();
            }
          }}
          className="p-2.5 rounded-xl bg-[#0d0e18] hover:bg-violet-950/40 border border-white/10 hover:border-violet-500/40 text-left transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-0.5">
            <span className="text-indigo-400 font-extrabold group-hover:text-indigo-300">Gemini AI</span>
            <span className="text-emerald-400 font-black">18 Meses</span>
          </div>
          <div className="text-[11px] font-bold text-white truncate group-hover:text-indigo-200">
            {geminiProduct ? geminiProduct.name : 'Google Gemini Pro'}
          </div>
        </button>

        {/* Streaming / Catalog Pill */}
        <button
          type="button"
          onClick={() => {
            if (otherFeatured && onNavigateToProduct) {
              onNavigateToProduct(otherFeatured.id);
            } else if (onNavigateToCatalog) {
              onNavigateToCatalog();
            }
          }}
          className="p-2.5 rounded-xl bg-[#0d0e18] hover:bg-violet-950/40 border border-white/10 hover:border-violet-500/40 text-left transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-0.5">
            <span className="text-cyan-400 font-extrabold group-hover:text-cyan-300">Streaming</span>
            <span className="text-violet-300 font-black">Anime & Pro</span>
          </div>
          <div className="text-[11px] font-bold text-white truncate group-hover:text-cyan-200">
            {otherFeatured ? otherFeatured.name : 'Crunchyroll & Apps'}
          </div>
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center pt-0.5">
        <Info className="w-3 h-3 text-slate-500 shrink-0" />
        <span>Puedes arrastrar cualquier archivo .mp4 sobre el reproductor para personalizar el vídeo del Hero.</span>
      </div>
    </div>
  );
};
