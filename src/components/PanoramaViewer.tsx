import { ChevronLeft, ChevronRight, Download, Expand, Eye, Pause, Play, RotateCcw, Share2, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export type Panorama = { title: string; image: string; views?: number; note?: string };

export function PanoramaViewer({ panoramas }: { panoramas: Panorama[] }) {
  const [active, setActive] = useState(0);
  const [angle, setAngle] = useState(50);
  const [tilt, setTilt] = useState(0);
  const [zoom, setZoom] = useState(135);
  const [auto, setAuto] = useState(true);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const pano = panoramas[active];

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setAngle((a) => (a + 0.35) % 100), 60);
    return () => clearInterval(id);
  }, [auto]);

  const move = (direction: number) => setActive((current) => (current + direction + panoramas.length) % panoramas.length);
  const drag = (clientX: number, clientY: number) => {
    if (startX.current === null || startY.current === null) return;
    const dx = clientX - startX.current;
    const dy = clientY - startY.current;
    setAngle((c) => (c - dx / 6 + 100) % 100);
    setTilt((t) => Math.max(-12, Math.min(12, t - dy / 14)));
    startX.current = clientX;
    startY.current = clientY;
  };

  const fullscreen = async () => { await viewerRef.current?.requestFullscreen?.(); };
  const reset = () => { setAngle(50); setTilt(0); setZoom(135); };
  const share = async () => {
    const text = `${pano.title} — Royal Takin Tours · 360° view`;
    if (navigator.share) await navigator.share({ title: text, text, url: window.location.href }).catch(() => {});
    else await navigator.clipboard.writeText(window.location.href);
    toast.success("360° link copied to share");
  };

  if (!panoramas.length) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-deep">
      <div
        ref={viewerRef}
        className="perspective-1200 relative h-[460px] cursor-grab touch-pan-y overflow-hidden bg-ink text-hero-foreground active:cursor-grabbing sm:h-[560px]"
        onMouseDown={(e) => { setAuto(false); startX.current = e.clientX; startY.current = e.clientY; }}
        onMouseMove={(e) => drag(e.clientX, e.clientY)}
        onMouseUp={() => { startX.current = null; startY.current = null; }}
        onMouseLeave={() => { startX.current = null; startY.current = null; }}
        onTouchStart={(e) => { setAuto(false); startX.current = e.touches[0]?.clientX ?? null; startY.current = e.touches[0]?.clientY ?? null; }}
        onTouchMove={(e) => drag(e.touches[0]?.clientX ?? 0, e.touches[0]?.clientY ?? 0)}
        onTouchEnd={() => { startX.current = null; startY.current = null; }}
        onWheel={(e) => setZoom((c) => Math.max(110, Math.min(220, c + e.deltaY * -0.05)))}
        role="application"
        aria-label="Interactive 360 degree panorama viewer"
      >
        <div
          className="preserve-3d absolute inset-0 transition-transform duration-150 ease-out"
          style={{ transform: `rotateX(${tilt}deg)` }}
        >
          <div
            className="absolute inset-[-4%] bg-cover bg-center"
            style={{ backgroundImage: `url(${pano.image})`, backgroundPosition: `${angle}% center`, backgroundSize: `${zoom}%` }}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-ink/40" />
        <div className="pointer-events-none absolute inset-0 mandala-bg opacity-25" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="chip bg-card/90 text-foreground">360° interactive</span>
          <span className="chip bg-card/90 text-foreground"><Eye className="h-3.5 w-3.5 text-saffron" /> {pano.views ?? 1280} views</span>
        </div>

        <div className="absolute right-4 top-4 flex gap-2">
          <button onClick={() => setAuto((v) => !v)} className="grid h-10 w-10 place-items-center rounded-xl bg-card/90 text-foreground backdrop-blur transition hover:text-saffron" aria-label={auto ? "Pause rotation" : "Play rotation"}>{auto ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</button>
          <button onClick={reset} className="grid h-10 w-10 place-items-center rounded-xl bg-card/90 text-foreground backdrop-blur transition hover:text-saffron" aria-label="Reset view"><RotateCcw className="h-4 w-4" /></button>
          <button onClick={fullscreen} className="grid h-10 w-10 place-items-center rounded-xl bg-card/90 text-foreground backdrop-blur transition hover:text-saffron" aria-label="Fullscreen panorama"><Expand className="h-4 w-4" /></button>
          <a href={pano.image} download className="grid h-10 w-10 place-items-center rounded-xl bg-card/90 text-foreground backdrop-blur transition hover:text-saffron" aria-label="Download panorama"><Download className="h-4 w-4" /></a>
          <button onClick={share} className="grid h-10 w-10 place-items-center rounded-xl bg-card/90 text-foreground backdrop-blur transition hover:text-saffron" aria-label="Share panorama"><Share2 className="h-4 w-4" /></button>
        </div>

        <button onClick={() => move(-1)} className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-card/90 text-foreground backdrop-blur transition hover:text-saffron" aria-label="Previous panorama"><ChevronLeft className="h-5 w-5" /></button>
        <button onClick={() => move(1)} className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-card/90 text-foreground backdrop-blur transition hover:text-saffron" aria-label="Next panorama"><ChevronRight className="h-5 w-5" /></button>

        <div className="absolute inset-x-0 bottom-0 grid gap-3 p-4 sm:p-6">
          <div className="max-w-xl rounded-2xl bg-ink/65 p-4 backdrop-blur-xl">
            <div className="eyebrow text-saffron">Panorama {active + 1} / {panoramas.length}</div>
            <h3 className="mt-1 text-2xl font-bold text-hero-foreground">{pano.title}</h3>
            <p className="mt-1 text-sm text-hero-foreground/76">{pano.note ?? "Drag to rotate. Scroll to zoom. Auto-rotation on by default."}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom((z) => Math.max(110, z - 12))} className="grid h-9 w-9 place-items-center rounded-lg bg-card/90 text-foreground"><ZoomOut className="h-4 w-4" /></button>
            <div className="flex-1 rounded-full bg-hero-foreground/14">
              <div className="h-1.5 rounded-full bg-gradient-gold" style={{ width: `${((zoom - 110) / 110) * 100}%` }} />
            </div>
            <button onClick={() => setZoom((z) => Math.min(220, z + 12))} className="grid h-9 w-9 place-items-center rounded-lg bg-card/90 text-foreground"><ZoomIn className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3">
        {panoramas.map((item, index) => (
          <button key={`${item.title}-${index}`} onClick={() => setActive(index)} className={`grid grid-cols-[80px_minmax(0,1fr)] items-center gap-3 rounded-xl border p-2 text-left transition ${index === active ? "border-saffron bg-muted shadow-card" : "border-border hover:bg-muted"}`}>
            <img src={item.image} alt={item.title} className="h-16 w-20 rounded-lg object-cover" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{item.title}</span>
              <span className="block text-xs text-muted-foreground">View {index + 1} of {panoramas.length}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
