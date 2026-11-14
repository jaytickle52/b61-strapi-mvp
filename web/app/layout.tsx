import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { draftMode } from "next/headers";
import "./globals.css";
import { getSettings } from "@/lib/strapi";
import { PreviewBanner, SiteFooter, SiteHeader } from "@/components/SiteChrome";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: { default: settings.schoolName, template: `%s | ${settings.schoolName}` },
    description: settings.tagline,
  };
}

const FONT_STACKS: Record<string, string> = {
  Fraunces: '"Fraunces", Georgia, serif',
  "Playfair Display": '"Playfair Display", Georgia, serif',
  Merriweather: '"Merriweather", Georgia, serif',
  Montserrat: '"Montserrat", system-ui, sans-serif',
  Poppins: '"Poppins", system-ui, sans-serif',
  Inter: '"Inter", system-ui, sans-serif',
  "Source Sans 3": '"Source Sans 3", system-ui, sans-serif',
  Lato: '"Lato", system-ui, sans-serif',
  "Open Sans": '"Open Sans", system-ui, sans-serif',
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [settings, draft] = await Promise.all([getSettings(), draftMode()]);
  const heading = settings.headingFont ?? "Fraunces";
  const body = settings.bodyFont ?? "Inter";
  const fontsHref = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(heading)}:wght@400;600&family=${encodeURIComponent(body)}:wght@400;600&display=swap`;

  // The school's colors and fonts become CSS variables every component uses.
  const theme = {
    "--brand": settings.primaryColor ?? "#1f3a5f",
    "--accent": settings.secondaryColor ?? "#c8a24a",
    "--font-heading": FONT_STACKS[heading] ?? FONT_STACKS.Fraunces,
    "--font-body": FONT_STACKS[body] ?? FONT_STACKS.Inter,
  } as CSSProperties;

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={fontsHref} />
      </head>
      <body className="flex min-h-full flex-col" style={theme}>
        {draft.isEnabled && <PreviewBanner />}
        <SiteHeader settings={settings} />
        <main className="flex-1">{children}</main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  );
}
