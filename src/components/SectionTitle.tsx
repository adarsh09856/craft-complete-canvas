import { Reveal } from "./Reveal";

export function SectionTitle({ eyebrow, title, subtitle, center = true }: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={`mb-10 max-w-3xl sm:mb-14 ${center ? "mx-auto text-center" : ""}`}>
      <Reveal>
        {eyebrow && <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-cypress sm:mb-4 sm:text-xs">{eyebrow}</div>}
        <h2 className="font-display text-4xl leading-[0.98] text-foreground sm:text-5xl md:text-6xl">{title}</h2>
        {subtitle && <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base">{subtitle}</p>}
      </Reveal>
    </div>
  );
}
