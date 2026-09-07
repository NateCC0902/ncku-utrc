// ============================================================
// NCKU UTRC — content model
// Source: MATELab AUV/USV 概況 (2025) + UTRC public info + Blue Robotics specs.
// zh-TW primary, English subtitles. All figures traceable to /docs.
// ============================================================

export type VehicleSlug = "usv" | "auv" | "rov";
export type Accent = "aqua" | "amber" | "signal";

export interface SpecRow {
  label: string;
  value: string;
}

export interface TaskItem {
  zh: string;
  en: string;
  detail: string;
  value: string;
}

export interface SensorItem {
  category: string;
  config: string;
}

export interface ArchBlock {
  title: string;
  points: string[];
}

export interface Vehicle {
  slug: VehicleSlug;
  code: string; // AUV / USV / ROV
  nameZh: string;
  nameEn: string;
  /** one-line positioning, plain */
  taglineZh: string;
  domainZh: string;
  domainEn: string;
  controlZh: string;
  controlEn: string;
  /** rail metadata */
  depthLabel: string; // e.g. "200 m"
  depthMeters: number; // deepest operating depth, for the rail anchor
  order: number; // shallow -> deep
  accent: Accent;
  /** lead paragraph (一句話定位, expanded) */
  summary: string;
  tasks: TaskItem[];
  tasksNote?: string;
  extendedApplications: string[];
  sensors: SensorItem[];
  sensorsNote?: string;
  architecture: ArchBlock[];
  specs: SpecRow[];
  ipGranted?: string[];
  ipPending?: string[];
  platforms?: { name: string; detail: string }[];
  images: {
    hero: string;
    heroAlt: string;
    gallery: { src: string; alt: string; caption: string }[];
  };
  note: string;
}

export const VEHICLES: Vehicle[] = [
  // ---------------------------------------------------------- USV
  {
    slug: "usv",
    code: "USV",
    nameZh: "無人水面載具",
    nameEn: "Unmanned Surface Vehicle",
    taglineZh:
      "2.8 公尺級玻璃纖維雙體智慧無人船，銜接水面與水下作業，並具備布放與回收 AUV 的母船潛力。",
    domainZh: "水面",
    domainEn: "Surface",
    controlZh: "自主航行（可遠端監控）",
    controlEn: "Autonomous · remote-monitored",
    depthLabel: "長續航",
    depthMeters: 0,
    order: 0,
    accent: "aqua",
    summary:
      "一艘 2.8 公尺級、玻璃纖維雙體構型的智慧無人船，融合毫米波雷達、光達、聲納與慣性導航，以 ROS 結合深度強化學習（TD3）達成路徑追蹤、動態避障、動態定位駐留與自動返航；並具備布放與回收水下載具（AUV）的母船潛力，是本中心銜接水面與水下作業的關鍵平台。",
    tasks: [
      {
        zh: "路徑追蹤",
        en: "Path Following",
        detail: "依規劃航線精準航行，採 ALOS 導引法降低橫向偏差。",
        value: "海域測繪、航線巡查、定線作業",
      },
      {
        zh: "動態避障",
        en: "Collision Avoidance",
        detail: "多感測器融合即時偵測障礙，多層演算法維持安全距離。",
        value: "繁忙水域安全航行、自主任務保障",
      },
      {
        zh: "動態定位駐留",
        en: "Station Keeping",
        detail: "GPS-INS 動態定位，長時間穩定停留於指定位置。",
        value: "離岸維護、水下作業支援、定點觀測",
      },
      {
        zh: "自動返航",
        en: "Return-to-Home",
        detail: "任務結束或異常時自主返回起始點。",
        value: "無人化作業安全機制",
      },
    ],
    tasksNote:
      "上述任務已於 ROS + Gazebo（路徑追蹤、避碰駐留、自動返航）與 ROS + 深度強化學習 + HoloOcean（直線航行、圓形循跡）模擬環境完成驗證。",
    extendedApplications: [
      "水下載具母船：布放與回收 AUV／水下載具（智能布放回收系統，專利申請中）",
      "離岸風場、海洋工程結構之水面巡檢與支援",
      "水文、水質與海域環境監測",
      "港灣安全巡邏、搜救輔助",
      "動態定位（DP）作業平台與離岸維護支援",
    ],
    sensors: [
      { category: "視覺", config: "雙目視覺 AI 相機、廣角雙鏡頭相機（IP67）" },
      {
        category: "測距 / 環境感知",
        config: "廣角三維光達（Lidar）、毫米波雷達（77 GHz）",
      },
      { category: "水下感測", config: "側掃聲納、聲納測深儀" },
      {
        category: "導航定位",
        config: "INS／IMU 慣性導航、GNSS／GPS（高精度 RTK）",
      },
      { category: "熱影像", config: "紅外線熱像儀" },
      {
        category: "運算核心",
        config: "中控電腦 NVIDIA Jetson、CANBUS 轉換器、感測器運算中心",
      },
    ],
    sensorsNote:
      "多感測器融合（毫米波雷達＋光達＋側掃聲納）建構高精度環境模型，為避障與導航決策提供依據。",
    architecture: [
      {
        title: "載具構型",
        points: [
          "船體：玻璃纖維（FRP）雙體構型，上、中、下船殼模組化組裝",
          "推進：舷外機 ×2（各 20 HP）＋ 側推進器 ×2（各 2.04 HP）",
          "結構：抽拉式機櫃、感測器塔架、聲納支架、防撞護舷、舷外機保護框",
          "模組化設計，支援多任務模組快速更換",
        ],
      },
      {
        title: "電力與通訊",
        points: [
          "磷酸鐵鋰（LiFePO4）動力電池，48 V／額定容量約 600 Ah",
          "4G／5G／WiFi 多路備援通訊",
          "五合一天線（Taoglas MA752）、LTE（Quectel EC25）、Wi-Fi（u-blox MAYA-W161）、高精度 GNSS RTK（u-blox F9P）",
        ],
      },
      {
        title: "軟體與控制核心（三層能力）",
        points: [
          "自航模式：定位保持、返航、航行圍籬（Geo-fencing）",
          "AI 分析：物體辨識、防撞、路徑規劃（TD3 深度強化學習）",
          "雲端服務：資料顯示、衛星圖資、船體監視、航程歷史紀錄",
          "以 ROS 為框架，Jetson 為運算核心，透過 CANBUS 連結運動控制與側推模組",
        ],
      },
    ],
    specs: [
      { label: "尺寸（長 × 寬 × 高）", value: "約 2.8 × 1.7 × 1.2 m" },
      { label: "船體材質", value: "玻璃纖維 FRP" },
      {
        label: "推進方式",
        value: "舷外機 ×2（各 20 HP）＋ 側推 ×2（各 2.04 HP）",
      },
      { label: "動力系統", value: "LiFePO4 電池，48 V／約 600 Ah" },
      { label: "通訊方式", value: "4G ／ 5G ／ WiFi" },
      { label: "運算核心", value: "NVIDIA Jetson 中控電腦 + CANBUS" },
      {
        label: "主要感測器",
        value: "雙目 AI 相機、光達、毫米波雷達、側掃聲納、INS/IMU、GNSS/GPS、熱像儀",
      },
      { label: "控制演算法", value: "ROS + TD3 深度強化學習、ALOS 路徑導引" },
    ],
    ipPending: [
      "搭載深度強化學習演算法控制系統（自主導航、避障、動態定位）之智慧無人水面載具",
      "無人水面載具與水下載具之智能布放與回收系統（USV 作為水下載具母船的核心技術）",
    ],
    images: {
      hero: "/vehicles/usv/hero.jpg",
      heroAlt: "紅色雙體無人水面載具航行於水面",
      gallery: [
        {
          src: "/vehicles/usv/render.jpg",
          alt: "USV 三維外型渲染",
          caption: "雙體構型 · 舷外機＋側推",
        },
        {
          src: "/vehicles/usv/front.jpg",
          alt: "USV 正面雙體船殼",
          caption: "玻璃纖維雙體船殼",
        },
        {
          src: "/vehicles/usv/annotated.jpg",
          alt: "USV 控制箱與感測配置",
          caption: "控制箱與感測器配置",
        },
        {
          src: "/vehicles/usv/sensor-jetson.jpg",
          alt: "NVIDIA Jetson 運算核心",
          caption: "Jetson 中控 + CANBUS",
        },
        {
          src: "/vehicles/usv/sensor-gnss.jpg",
          alt: "u-blox F9P 高精度 GNSS",
          caption: "u-blox F9P 高精度 RTK",
        },
        {
          src: "/vehicles/usv/sensor-antenna.jpg",
          alt: "五合一天線",
          caption: "Taoglas 五合一天線",
        },
      ],
    },
    note: "內容依據海洋科技工程實驗室 USV 概況資料（2025/11）整理。",
  },

  // ---------------------------------------------------------- AUV
  {
    slug: "auv",
    code: "AUV",
    nameZh: "自主式水下無人載具",
    nameEn: "Autonomous Underwater Vehicle",
    taglineZh:
      "魚雷型、可長時間自主航行的水下載具，以 ROS 結合深度強化學習達成物體追蹤、自動入塢與之字形巡航。",
    domainZh: "中／深層水",
    domainEn: "Mid / deep water",
    controlZh: "完全自主（無纜）",
    controlEn: "Fully autonomous · untethered",
    depthLabel: "200 m",
    depthMeters: 200,
    order: 1,
    accent: "signal",
    summary:
      "一具魚雷型、可長時間自主航行的水下載具，搭載雙目視覺與高精度姿態感測，並以 ROS 結合深度強化學習（TD3）達成物體追蹤、自動入塢對接、之字形巡航等自主任務——是本中心水下自主作業與演算法驗證的核心平台。",
    tasks: [
      {
        zh: "物體追蹤",
        en: "Object Tracking",
        detail:
          "以影像辨識鎖定目標，融合姿態資訊即時計算航行指令，持續跟隨移動目標。",
        value: "目標監控、伴航、水下動態目標觀測",
      },
      {
        zh: "自動入塢對接",
        en: "Docking",
        detail: "影像偵測塢站位置，結合深度與姿態資料，自主導引至塢站完成對接。",
        value: "水下充電／資料回收、長期駐點觀測、無人化補給",
      },
      {
        zh: "之字形巡航",
        en: "Zigzag Survey",
        detail: "以規劃航線進行區域掃描式巡航，維持航向與深度。",
        value: "海域巡查、環境調查、大範圍搜索",
      },
    ],
    tasksNote:
      "三種任務皆已完成泳池近距離視覺導航實測，與模擬環境驗證（水下自動入塢實驗、之字形巡航模擬）。",
    extendedApplications: [
      "水下管線、纜線與結構物巡檢",
      "港灣、水庫、近岸海域環境調查",
      "水下自動對接／自主補給技術驗證",
      "AUV 自主控制與深度強化學習演算法之研發測試平台",
    ],
    sensors: [
      { category: "影像模組", config: "雙鏡頭（雙目視覺）相機 + 廣角相機" },
      { category: "姿態感測", config: "AHRS 高精度姿態參考感測器" },
      { category: "深度感測", config: "壓力感測器模組（深度量測）" },
      { category: "照明", config: "LED 光源模組" },
      { category: "通訊", config: "2.4 GHz 無線通訊" },
      { category: "運算核心", config: "Intel ATOM SoC E3845 微型工業電腦" },
      { category: "資料儲存", config: "64 GB SSD ／ 32 GB SD 記憶卡" },
    ],
    architecture: [
      {
        title: "三艙段模組化設計",
        points: [
          "艏艙（感測）：廣角與雙眼攝影鏡頭、LED 光源、壓力感測器模組",
          "控制艙（運算與電力）：微型工業電腦、鋰電池、各式控制模組",
          "艉艙（推進與操控）：直流無刷馬達、四葉螺旋槳、獨立伺服馬達 ×4、舵板 ×4（±30°）",
        ],
      },
      {
        title: "軟體與控制核心",
        points: [
          "以 ROS 為軟體框架，統整資料儲存、資料傳輸與控制模型",
          "感測資料流：Camera／AHRS／Pressure → 資料儲存與傳輸 → 控制模型",
          "TD3 深度強化學習即時決策，輸出推進器（Thruster）與舵板（Rudder）指令",
          "ROS 節點以 Talker–Topic–Listener 架構運作：/object_tracking_node、/docking_node、/zigzag_node",
          "建立流體動力係數／模型，於模擬環境重現載具運動，落實「先模擬、後海試」",
        ],
      },
    ],
    specs: [
      { label: "型式", value: "魚雷型" },
      { label: "直徑 / 全長", value: "17 cm ／ 180 cm" },
      { label: "重量（空氣中）", value: "35 kg" },
      { label: "最大操作深度", value: "200 m" },
      { label: "電源", value: "鋰電池" },
      { label: "最大速度 / 續航力", value: "5 節 ／ 12 小時（@ 2.5 節）" },
      { label: "推進器型式", value: "四葉螺旋槳（直流無刷馬達）" },
      { label: "舵面控制", value: "四組獨立伺服（舵板 ×4，±30°）" },
      { label: "姿態感測", value: "AHRS 高精度姿態參考感測器" },
      { label: "影像模組", value: "雙鏡頭相機 + 廣角相機" },
      { label: "通訊 / 運算", value: "2.4 GHz 無線 ／ Intel ATOM SoC E3845" },
      { label: "儲存", value: "64 GB SSD ／ 32 GB SD" },
    ],
    ipGranted: [
      "半自主式水下自航模型（M597749）",
      "自主式水下無人載具（M577407）",
    ],
    ipPending: [
      "基於深度強化學習之自主式水下無人載具對接作業系統與方法",
    ],
    platforms: [
      {
        name: "單獨螺槳測試（Open Water Test）",
        detail: "結合動力計量測與 CFD（重疊網格）分析螺槳推力／扭矩特性。",
      },
      {
        name: "水平平面運動機構（HPMM）",
        detail: "以拘束模試驗量測水動力導數。",
      },
      {
        name: "操縱性能測試（Maneuvering Test）",
        detail: "涵蓋浮力測試、直航測試、耐海測試、之字型測試。",
      },
    ],
    images: {
      hero: "/vehicles/auv/hero.jpg",
      heroAlt: "魚雷型自主水下載具於藍色水下環境航行",
      gallery: [
        {
          src: "/vehicles/auv/pool.jpg",
          alt: "AUV 泳池實測",
          caption: "泳池近距離視覺導航實測",
        },
        {
          src: "/vehicles/auv/cutaway.jpg",
          alt: "AUV 三艙段內部配置",
          caption: "三艙段模組化配置",
        },
        {
          src: "/vehicles/auv/product.jpg",
          alt: "AUV 魚雷型外型",
          caption: "魚雷型 · 17 cm × 180 cm",
        },
        {
          src: "/vehicles/auv/testrig.jpg",
          alt: "螺槳與水動力測試平台",
          caption: "螺槳／水動力測試平台",
        },
        {
          src: "/vehicles/auv/sensor-imu.jpg",
          alt: "AHRS 姿態感測器",
          caption: "AHRS 高精度姿態感測",
        },
        {
          src: "/vehicles/auv/sensor-pressure.jpg",
          alt: "壓力感測器模組",
          caption: "壓力感測 · 深度量測",
        },
      ],
    },
    note: "內容依據海洋科技工程實驗室 AUV 概況資料（2025/10）整理。",
  },

  // ---------------------------------------------------------- ROV
  {
    slug: "rov",
    code: "ROV",
    nameZh: "遙控無人水下載具",
    nameEn: "Remotely Operated Vehicle · BlueROV2 Heavy",
    taglineZh:
      "纜控、八推進器向量式的重載型水下機器人（BlueROV2 Heavy），以四具垂直推進器強化垂直推力與姿態穩定，六自由度近全向操控，勝任海事調查、水下考古與結構檢測。",
    domainZh: "近距離水下",
    domainEn: "Close-range subsea",
    controlZh: "纜控即時操控",
    controlEn: "Tethered · real-time piloting",
    depthLabel: "100–300 m",
    depthMeters: 300,
    order: 2,
    accent: "amber",
    summary:
      "一具纜控、採八推進器（BlueROV2 Heavy）向量式配置的重載型水下機器人：四具向量水平推進器搭配四具垂直推進器，達成六自由度近全向操控、強化垂直推力與姿態穩定，並具備更高的酬載能力。是本中心執行海事調查、水下考古紀錄與水下結構檢測的實務作業主力；相較於自主航行的 AUV，ROV 以「人在迴路」的即時操控，勝任近距離、精細與需即時判斷的水下作業。",
    tasks: [
      {
        zh: "海事調查",
        en: "Maritime Survey",
        detail: "水下地形、標的物與環境影像蒐集。",
        value: "海域普查、工程前期勘查",
      },
      {
        zh: "水下考古紀錄",
        en: "Archaeological Documentation",
        detail: "遺址、沉船與文物之非接觸式影像紀錄。",
        value: "水下文化資產保存與研究",
      },
      {
        zh: "水下結構檢測",
        en: "Structure Inspection",
        detail: "碼頭、船體、橋墩、管線之目視檢測。",
        value: "設施維護、安全檢查",
      },
      {
        zh: "觀測與作業支援",
        en: "Observation & Support",
        detail: "定點懸停觀測，選配機械手臂進行取樣／輕作業。",
        value: "採樣、取回、水下協作",
      },
    ],
    tasksNote:
      "海事調查與水下考古紀錄為本中心（UTRC）網站所載之 ROV 實際作業項目。",
    extendedApplications: [
      "纜控即時操控：作業中可由人員即時判斷與介入，適合複雜、精細或不確定環境",
      "八推進器 Heavy 配置：四具垂直推進器提供強化垂直推力與姿態穩定，並支援機械手臂、聲納等較重酬載",
      "六自由度懸停：向量式推進可原地懸停與微調姿態，利於近距離檢視與拍攝",
      "即時高畫質回傳：影像即時上傳水面，適合考古與檢測的現場判讀",
    ],
    sensors: [
      {
        category: "主攝影機",
        config: "1080p / 30fps 廣角低光源攝影機，搭載傾轉（tilt）雲台",
      },
      {
        category: "照明",
        config: "可調光 Lumen 燈組，標準 2 盞、可擴充至 4 盞，總光通量約 6,000 流明",
      },
      {
        category: "深度 / 溫度",
        config: "高解析壓力與溫度感測器（300 m 級，深度解析約 2 mm）",
      },
      {
        category: "飛控與內建感測",
        config: "Navigator 飛控，內建 IMU、磁力計、漏水感測器",
      },
      {
        category: "可擴充酬載",
        config: "影像／掃描聲納、機械手臂、USBL 定位、DVL、酬載載架等",
      },
    ],
    architecture: [
      {
        title: "推進與操控",
        points: [
          "8 具 T200 推進器（BlueROV2 Heavy）：4 具向量水平 + 4 具垂直配置",
          "達成六自由度（6-DOF）近全向操控、強化垂直推力與姿態穩定，利於重酬載作業",
          "載具經 Fathom 纜線連接水面控制端；水面端執行 BlueOS／QGroundControl，搭配操縱手把即時操控",
        ],
      },
      {
        title: "軟體與電力",
        points: [
          "以 ArduSub／BlueOS 開源架構運作，易於整合感測器與客製化功能",
          "載具端鋰電池供電，典型作業續航約 1–2 小時（依作業強度而定）",
        ],
      },
    ],
    specs: [
      { label: "型式", value: "向量式八推進器 ROV（BlueROV2 Heavy，纜控）" },
      {
        label: "尺寸（長 × 寬 × 高）",
        value: "約 457 × 338 × 254 mm（Heavy 含垂直推進器與酬載載架）",
      },
      { label: "重量（空氣中）", value: "約 12–14 kg（Heavy 配置，依酬載而定）" },
      {
        label: "最大操作深度",
        value: "100 m（壓克力）／ 300 m（鋁合金升級）",
      },
      { label: "推進器", value: "8 × T200（4 向量水平 + 4 垂直，6-DOF）" },
      { label: "最大前進速度", value: "約 1.5 m/s" },
      { label: "攝影機", value: "1080p / 30fps 廣角低光源 + 傾轉雲台" },
      { label: "照明", value: "可達約 6,000 流明（可調光）" },
      { label: "感測", value: "壓力／溫度、IMU、磁力計、漏水感測器" },
      { label: "控制方式", value: "纜控 + 水面端即時操控（BlueOS／ArduSub）" },
      { label: "續航（典型）", value: "約 1–2 小時" },
    ],
    note: "規格為 Blue Robotics BlueROV2 Heavy 原廠公開參考值；本中心實際外殼材質（壓克力 100 m／鋁合金 300 m）、燈組數量與選配酬載以實機配置為準。",
    images: {
      hero: "",
      heroAlt: "六自由度向量式遙控水下載具示意",
      gallery: [],
    },
  },
];

export function getVehicle(slug: string): Vehicle | undefined {
  return VEHICLES.find((v) => v.slug === slug);
}

export function vehiclesByDepth(): Vehicle[] {
  return [...VEHICLES].sort((a, b) => a.order - b.order);
}
