import type { Metadata, Viewport } from "next";
import {
  Noto_Sans_TC,
  Noto_Serif_TC,
  Newsreader,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { PaperBackground } from "@/components/PaperBackground";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { DepthRail } from "@/components/DepthRail";

// Latin serif display — the editorial voice. Variable, with true italic.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

// CJK serif display — carries Chinese headlines in the same editorial register.
const notoSerifTC = Noto_Serif_TC({
  variable: "--font-noto-serif-tc",
  weight: ["500", "600", "700"],
  preload: false, // CJK: load required unicode ranges on demand
});

// Body — quiet workhorse sans for zh-TW + Latin.
const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  weight: ["300", "400", "500", "700"],
  preload: false,
});

// Data / precise figures.
const jetbrains = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://utrc.ncku.edu.tw"),
  title: {
    default: "水下技術研究中心 UTRC ｜ 國立成功大學",
    template: "%s ｜ 水下技術研究中心 UTRC",
  },
  description:
    "國立成功大學水下技術研究中心（UTRC）／海洋科技工程實驗室（MATELab）：涵蓋水面 USV、自主 AUV 與纜控 ROV 的整合式海洋機器人平台，以 ROS 結合深度強化學習（TD3），從設計、CFD 水槽測試、模擬到海試的一站式研發能量。",
  keywords: [
    "水下技術研究中心",
    "UTRC",
    "成功大學",
    "MATELab",
    "AUV",
    "USV",
    "ROV",
    "海洋機器人",
    "自主水下載具",
    "無人水面載具",
    "深度強化學習",
    "ROS",
  ],
  authors: [{ name: "NCKU Underwater Technology Research Center" }],
  openGraph: {
    title: "水下技術研究中心 UTRC ｜ 國立成功大學",
    description:
      "從水面到海床：涵蓋 USV／AUV／ROV 的整合式海洋機器人平台與研發能量。",
    locale: "zh_TW",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f1e8",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant"
      className={`${notoSansTC.variable} ${notoSerifTC.variable} ${newsreader.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="relative min-h-full">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-sm focus:bg-tide focus:px-4 focus:py-2 focus:font-medium focus:text-paper"
        >
          跳至主要內容
        </a>
        <PaperBackground />
        <DepthRail />
        <SiteNav />
        <main id="main" className="relative z-10">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
