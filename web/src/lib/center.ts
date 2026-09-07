// ============================================================
// UTRC — center-level content (整體能量)
// Source: docs/04-整體能量-水下技術研究中心.md
// ============================================================

export const CENTER = {
  nameZh: "水下技術研究中心",
  nameEn: "Underwater Technology Research Center",
  abbr: "UTRC",
  parentZh: "國立成功大學 · 工學院",
  parentEn: "College of Engineering, National Cheng Kung University",
  labZh: "海洋科技工程實驗室",
  labEn: "Marine Technology and Engineering Laboratory (MATELab)",

  heroLineZh: "從水面到海床",
  heroLineEn: "From Surface to Seabed",
  heroSubZh: "一支涵蓋水面、深水與近距檢測的整合式海洋機器人陣容。",

  thesisZh:
    "本中心以「從水面到海床、從設計到驗證」為主軸，建立涵蓋水面（USV）、中深層水（AUV）與近距離纜控（ROV）的完整海洋機器人載具陣容，並以共通的 ROS + 深度強化學習（TD3）軟體核心與完整的水動力研發／測試能量貫穿其中，具備從演算法開發、模擬驗證到海上實測的一站式能力。",

  aboutZh:
    "國立成功大學水下技術研究中心（UTRC）隸屬工學院，結合系統及船舶機電工程專業與海洋科技工程實驗室（MATELab）之研發能量，長期投入無人載具、水下作業與海洋工程技術。中心具備 ROV 海事調查與水下考古紀錄之實務經驗，並自主研發 AUV 與 USV 智慧載具及其控制演算法。",

  // Instrument-strip readouts (HUD)
  readouts: [
    { value: "3", unit: "型載具", label: "VEHICLE CLASSES", sub: "USV · AUV · ROV" },
    { value: "0–300", unit: "m", label: "OPERATING DEPTH", sub: "水面至海床" },
    { value: "5", unit: "項智財", label: "PATENTS & FILINGS", sub: "2 已獲證 · 3 申請中" },
    { value: "TD3", unit: "", label: "SHARED CONTROL CORE", sub: "ROS + 深度強化學習" },
  ],

  core: [
    {
      key: "ROS",
      titleZh: "ROS 統一框架",
      titleEn: "Unified ROS Framework",
      bodyZh:
        "AUV 與 USV 皆以 ROS 的資料儲存、傳輸、控制模型三層架構運作，感測與控制節點以 Talker／Topic／Listener 串接，模組可跨載具重用。",
    },
    {
      key: "TD3",
      titleZh: "TD3 深度強化學習控制",
      titleEn: "Deep Reinforcement Learning",
      bodyZh:
        "兩型自主載具的核心決策皆採 TD3 演算法（Calculate next action），實現智慧導航、動態避障、路徑追蹤與決策最佳化。",
    },
    {
      key: "FUSION",
      titleZh: "多感測器融合",
      titleEn: "Multi-Sensor Fusion",
      bodyZh:
        "影像、慣性（IMU/AHRS）、聲納、光達、毫米波雷達、GNSS 等多源資料融合，建構高精度環境與姿態模型。",
    },
    {
      key: "SIM",
      titleZh: "水動力建模 · 模擬先行",
      titleEn: "Hydrodynamic Modeling",
      bodyZh:
        "建立流體動力係數／模型並納入風浪環境參數，於 Gazebo、HoloOcean 等模擬環境重現載具運動，落實「先模擬、後海試」。",
    },
  ],

  integration: [
    {
      titleZh: "USV × AUV 母船協同",
      bodyZh:
        "USV 具備「智能布放與回收系統」（專利申請中），可作為 AUV／水下載具的水面母船，執行布放、回收、通訊中繼與定位支援，將自主水下作業延伸至離岸海域。",
    },
    {
      titleZh: "多域協同任務",
      bodyZh:
        "水面（USV）＋ 中深層（AUV）＋ 近距離檢測（ROV）三層作業可依任務組合，形成從廣域搜索到精細檢視的完整鏈路。",
    },
    {
      titleZh: "雲端監控",
      bodyZh:
        "USV 具備資料顯示、衛星圖資、船體監視與航程歷史紀錄之雲端服務能力，支援遠端指揮與資料分析。",
    },
  ],

  // The design->test->sim->trial closed loop (a real sequence)
  rndChain: [
    {
      step: "01",
      titleZh: "推進性能分析",
      method: "單獨螺槳測試（Open Water）+ CFD 重疊網格 + 動力計",
      useZh: "螺槳推力／扭矩／效率特性",
    },
    {
      step: "02",
      titleZh: "水動力參數量測",
      method: "水平平面運動機構（HPMM）拘束模試驗",
      useZh: "水動力導數建模",
    },
    {
      step: "03",
      titleZh: "操縱性能驗證",
      method: "操縱性能測試（浮力／直航／耐海／之字型）",
      useZh: "載具運動與操縱性能",
    },
    {
      step: "04",
      titleZh: "模擬驗證",
      method: "Gazebo、HoloOcean、自建模擬環境",
      useZh: "控制演算法先行驗證",
    },
    {
      step: "05",
      titleZh: "實測驗證",
      method: "泳池與近岸海域實測",
      useZh: "視覺導航、自動入塢等實機驗證",
    },
  ],

  applications: [
    { titleZh: "海事調查與海洋測繪", descZh: "水下地形、標的物與環境調查" },
    { titleZh: "離岸能源設施巡檢", descZh: "離岸風場等結構之水面與水下檢測、維護支援" },
    { titleZh: "水下考古與文化資產", descZh: "非接觸式影像紀錄與保存" },
    { titleZh: "基礎設施檢測", descZh: "碼頭、橋墩、船體、管線目視與聲納檢測" },
    { titleZh: "海洋環境監測與研究", descZh: "長時間定點與區域觀測" },
    { titleZh: "動態定位與載具布放回收", descZh: "離岸長時間穩定作業平台" },
    { titleZh: "技術服務", descZh: "載具開發、水動力分析、控制演算法與模擬驗證" },
  ],

  ipGranted: [
    "半自主式水下自航模型（M597749）",
    "自主式水下無人載具（M577407）",
  ],
  ipPending: [
    "基於深度強化學習之 AUV 對接作業系統與方法",
    "具自主導航／避障／動態定位之深度強化學習智慧無人水面載具",
    "無人水面載具與水下載具之智能布放與回收系統",
  ],
} as const;
