import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TopContactBar } from "@/components/TopContactBar";
import { PromoPopupModal, PromoBadgeTrigger } from "@/components/PromoPopupModal";
import { CurrencyProvider } from "@/lib/currency";
import { Toaster } from "@/components/ui/sonner";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { AiAssistant } from "@/components/AiAssistant";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-8xl font-display text-gradient-gold">404</h1>
        <h2 className="mt-4 text-xl font-display">The path is lost in the mist</h2>
        <p className="mt-2 text-sm text-muted-foreground">Even the prayer flags can't find this page.</p>
        <Link to="/" className="mt-6 inline-flex px-6 py-3 rounded-full bg-gradient-gold text-primary-foreground text-sm font-semibold">
          Return to Golden Takin Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-display">Something went off the trail</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please try again or return to the main journeys page.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="px-5 py-2.5 rounded-full bg-gradient-gold text-primary-foreground text-sm font-semibold"
          >
            Try again
          </button>
          <a href="/" className="px-5 py-2.5 rounded-full border border-gold text-gold text-sm font-semibold">
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Golden Takin Holidays — Explore Bhutan, Nepal, Tibet & India (NE)" },
      {
        name: "description",
        content:
          "Department of Tourism licensed Inbound Tour Operator in Thimphu, Bhutan. Crafting tailor-made Himalayan cultural tours, university field excursions, corporate MICE retreats, and romantic honeymoon escapes.",
      },
      { property: "og:title", content: "Golden Takin Holidays — Journeys That Stay With You" },
      { name: "twitter:title", content: "Golden Takin Holidays — Journeys That Stay With You" },
      {
        property: "og:description",
        content:
          "Explore Bhutan, Nepal, Tibet, and India (NE) with Golden Takin Holidays. Official 24/7 WhatsApp: +91-8514889385. Special UK Promo Code: WSUKSU26.",
      },
      {
        name: "twitter:description",
        content:
          "Explore Bhutan, Nepal, Tibet, and India (NE) with Golden Takin Holidays. Official 24/7 WhatsApp: +91-8514889385. Special UK Promo Code: WSUKSU26.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Figtree:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const openPromo = () => {
    window.dispatchEvent(new CustomEvent("gth:open-promo"));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        {/* Top Contact Bar with Phone Desks & UK Promo Code */}
        <TopContactBar onOpenPromo={openPromo} />

        {/* Global Navigation */}
        <Navbar onOpenPromo={openPromo} />

        {/* Main Content Area (padding-top accounts for TopContactBar + Navbar) */}
        <main className="min-h-screen pt-14 sm:pt-16">
          <Outlet />
        </main>

        {/* Global Footer with All 6 Inboxes & Regional Desks */}
        <Footer onOpenPromo={openPromo} />

        {/* Promotional Flyer Popup Modal (Auto-opens on first visit, or when triggered) */}
        <PromoPopupModal />

        {/* Floating Quick Triggers (Cleanly stacked, zero collision) */}
        <WhatsAppFab />
        <AiAssistant />
        <Toaster position="top-right" richColors />
      </CurrencyProvider>
    </QueryClientProvider>
  );
}
