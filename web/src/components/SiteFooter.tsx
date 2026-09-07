import Link from "next/link";
import Image from "next/image";
import { CENTER } from "@/lib/center";

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="relative z-10 scroll-mt-20 border-t border-tide-bright/30 bg-ledger text-paper"
    >
      {/* Contact call — the seabed colophon */}
      <div className="wrap py-20">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <span className="eyebrow !text-tide-bright">
              Collaborate · 合作洽詢
            </span>
            <h2 className="mt-5 max-w-2xl text-balance font-serif text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.15] text-paper">
              從水面到海床，
              <br />
              我們提供載具、演算法與海試的整合能量。
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-paper-dim">
              歡迎產業夥伴、贊助單位與研究團隊洽詢載具開發、水動力分析、控制演算法與模擬驗證等技術服務，或安排實驗室參訪。
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <ContactRow label="單位 · Institution">
              {CENTER.parentZh}
              <br />
              <span className="text-paper-dim">{CENTER.labZh}（MATELab）</span>
            </ContactRow>
            <ContactRow label="地址 · Address">
              70101 台南市東區大學路 1 號
              <br />
              <span className="text-paper-dim">
                No. 1, University Rd., Tainan 701, Taiwan
              </span>
            </ContactRow>
            <ContactRow label="聯絡信箱 · Enquiries">
              <span className="mono text-paper">請填入中心正式聯絡信箱</span>
              <br />
              <span className="text-[0.8rem] text-paper-dim">
                （建置時替換為正式 E-mail／電話）
              </span>
            </ContactRow>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-paper/12">
        <div className="wrap flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-5">
            <span className="flex h-12 items-center rounded-sm bg-paper px-3 py-1.5">
              <Image
                src="/brand/ncku.png"
                alt="國立成功大學 National Cheng Kung University"
                width={120}
                height={85}
                className="h-full w-auto object-contain"
              />
            </span>
            <span className="flex h-12 items-center rounded-sm bg-paper px-3 py-1.5">
              <Image
                src="/brand/matelab.png"
                alt="海洋科技工程實驗室 MATELab"
                width={200}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </span>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-paper-dim">
            <Link href="/vehicles/usv" className="transition-colors hover:text-paper">
              USV
            </Link>
            <Link href="/vehicles/auv" className="transition-colors hover:text-paper">
              AUV
            </Link>
            <Link href="/vehicles/rov" className="transition-colors hover:text-paper">
              ROV
            </Link>
            <Link href="/capabilities" className="transition-colors hover:text-paper">
              整體能量
            </Link>
          </nav>
        </div>
        <div className="wrap pb-10">
          <p className="text-[0.72rem] leading-relaxed text-paper-dim">
            © {new Date().getFullYear()} 國立成功大學 水下技術研究中心（UTRC）／
            海洋科技工程實驗室（MATELab）. 對外展示用途。
            資料來源：MATELab AUV／USV 概況（2025）、UTRC 公開資訊、Blue Robotics
            原廠公開規格；ROV 規格為原廠參考值，實際配置以本中心載具為準。
          </p>
        </div>
      </div>
    </footer>
  );
}

function ContactRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-l border-paper/20 pl-4">
      <div className="hud !text-paper-dim">{label}</div>
      <div className="mt-2 leading-relaxed text-paper">{children}</div>
    </div>
  );
}
