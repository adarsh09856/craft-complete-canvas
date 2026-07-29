import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { WhatsAppFab } from "@/components/WhatsAppFab";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-8xl font-display text-gradient-gold">404</h1>
        <h2 className="mt-4 text-xl font-display">The path is lost in the mist</h2>
        <p className="mt-2 text-sm text-muted-foreground">Even the prayer flags can't find this page.</p>
        <Link to="/" className="mt-6 inline-flex px-6 py-3 rounded-full bg-gradient-gold text-primary-foreground text-sm">Return home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-display">Something went off the trail</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again or head home.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => { router.invalidate(); reset(); }} className="px-5 py-2.5 rounded-full bg-gradient-gold text-primary-foreground text-sm">Try again</button>
          <a href="/" className="px-5 py-2.5 rounded-full border border-gold text-gold text-sm">Home</a>
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
      { title: "Royal Takin Tours · Journey with Happiness in Bhutan" },
      { name: "description", content: "Authentic Bhutan tours from local experts — culture, pilgrimage, trekking and bespoke journeys through the Last Shangri-La." },
      { property: "og:title", content: "Royal Takin Tours · Journey with Happiness in Bhutan" },
      { name: "twitter:title", content: "Royal Takin Tours · Journey with Happiness in Bhutan" },
      { property: "og:description", content: "Authentic Bhutan tours from local experts — culture, pilgrimage, trekking and bespoke journeys through the Last Shangri-La." },
      { name: "twitter:description", content: "Authentic Bhutan tours from local experts — culture, pilgrimage, trekking and bespoke journeys through the Last Shangri-La." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/83f4fe6b-91bc-44b5-8484-f91a38ff693a/id-preview-c98d56f5--418261b7-16a2-4543-86d2-6cb496f7dd6c.lovable.app-1779689517756.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/83f4fe6b-91bc-44b5-8484-f91a38ff693a/id-preview-c98d56f5--418261b7-16a2-4543-86d2-6cb496f7dd6c.lovable.app-1779689517756.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }, { rel: "preconnect", href: "https://fonts.googleapis.com" }, { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" }, { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Figtree:wght@300;400;500;600;700&display=swap" }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
