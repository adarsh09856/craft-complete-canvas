import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-hero-foreground">
      {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />}
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0 mandala-bg opacity-30" />
      <div className="relative mx-auto grid max-w-[1500px] gap-8 px-4 pb-14 pt-32 sm:px-6 sm:pb-18 sm:pt-40 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0">
          <div className="mb-4 flex items-center gap-3 text-gold">
            <span className="h-px w-9 bg-gold" />
            <span className="text-[10px] uppercase tracking-[0.32em] sm:text-xs">{eyebrow}</span>
          </div>
          <h1 className="max-w-4xl font-display text-5xl leading-[0.98] sm:text-6xl lg:text-7xl">{title}</h1>
          {subtitle && <p className="mt-5 max-w-2xl text-base leading-relaxed text-hero-foreground/78 sm:text-lg">{subtitle}</p>}
        </div>
        {children && <div className="min-w-0 lg:w-[380px]">{children}</div>}
      </div>
    </section>
  );
}