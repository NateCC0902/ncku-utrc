# 水下技術研究中心 UTRC — 官方網站

國立成功大學 水下技術研究中心（UTRC）／海洋科技工程實驗室（MATELab）對外展示網站。
設計主軸「**從水面到海床（From Surface to Seabed）**」：以一條隨捲動下潛的深度量尺（0 → 300 m）
串起水面 USV、自主 AUV 與纜控 ROV 三型載具，並帶出共通的 ROS + 深度強化學習（TD3）技術核心與
「設計 → CFD／水槽 → 模擬 → 海試」的研發能量。

- 技術：Next.js 16（App Router）· React 19 · TypeScript · Tailwind CSS v4 · Motion（framer-motion）
- 語系：繁體中文為主，英文為副標
- 視覺：Deep Abyss（深海）暗色主題，青綠（生物冷光）× 暖紅／琥珀（載具／儀表）雙重點色

## 開發

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## 建置與部署

```bash
pnpm build        # 全站靜態預先產生（SSG）
pnpm start        # 以 Node 伺服器提供（next/image 影像最佳化需要）
```

首頁、/capabilities 為靜態頁；/vehicles/[slug]（usv／auv／rov）以 `generateStaticParams` 預先產生。

## 頁面

| 路徑 | 內容 |
| --- | --- |
| `/` | 首頁：下潛式 Hero、三型載具依深度排列、共通技術核心、研發測試鏈、應用領域與智財 |
| `/vehicles/usv` `/vehicles/auv` `/vehicles/rov` | 各載具深度頁：任務、感測、架構、規格總表、智財／測試平台、影像 |
| `/capabilities` | 整體能量：中心簡介、載具比較表、整合作業能力、技術核心、研發鏈、應用與智財 |

## 內容與資產

- **文案／規格**：`src/lib/content.ts`（三型載具）與 `src/lib/center.ts`（中心整體），皆對應 `/docs` 原始文件。更新內容只需改這兩個檔。
- **影像**：`public/vehicles/{usv,auv,auv}`、`public/brand`。來源為 MATELab AUV／USV 概況 Keynote 之實機照片、渲染圖與硬體照片。ROV 無實機照片，改以 `src/components/RovSchematic.tsx` 之工程示意圖呈現（依 Blue Robotics BlueROV2 Heavy 八推進器公開配置繪製）。
- **簽名元件**：`src/components/DepthRail.tsx`（隨捲動的深度／壓力量尺）。

## 待補（建置正式版前）

- 頁尾 `src/components/SiteFooter.tsx` 的**正式聯絡信箱／電話**（目前為預留字樣）。
- 如需 SEO／分享縮圖，於 `src/app` 增補 `opengraph-image` 與網站正式網域（`layout.tsx` 的 `metadataBase`）。
- 行動裝置版面採標準 Tailwind 斷點（漢堡選單、單欄堆疊、量尺收合為左緣細線），建議於實機再抽查一次。
