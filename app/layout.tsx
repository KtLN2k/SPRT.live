import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./sports-desktop.css";
import "./sports-mobile.css";
import "./sports-desktop-detail.css";
import "./sports-desktop-pages.css";
import "./site-footer.css";
export const viewport: Viewport = {width:"device-width",initialScale:1,viewportFit:"cover",themeColor:"#06141b"};
export const metadata: Metadata = { title: "SPRT.fan | תוצאות כדורגל וכדורסל", description: "משחקי כדורגל וכדורסל, תוצאות, ליגות וטבלאות. בלי פרסומות.", icons: { icon: "/favicon.svg" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="he" dir="rtl"><head><link rel="stylesheet" href="/fonts/heebo.css"/></head><body>{children}</body></html>; }
