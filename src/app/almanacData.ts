export const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
export const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;
export const ZODIAC_ANIMALS = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"] as const;
export const LUNAR_MONTHS = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"] as const;
export const LUNAR_DAYS = [
  "初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
  "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
  "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十",
] as const;
export const CN_DIGITS = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"] as const;
export const CN_WEEKDAYS = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"] as const;

export const FORTUNES = ["大吉", "中吉", "小吉", "平", "小凶", "凶"] as const;
export type Fortune = typeof FORTUNES[number];
export const PROFESSIONS = ["product", "developer", "tester", "projectManager", "operations"] as const;
export type Profession = typeof PROFESSIONS[number];

export const FORTUNE_PALETTE: Record<Fortune, { seal: string; dot: string }> = {
  大吉: { seal: "#8B1A1A", dot: "#9B1B1B" },
  中吉: { seal: "#8B1A1A", dot: "#9B1B1B" },
  小吉: { seal: "#A07020", dot: "#B5852A" },
  平: { seal: "#5A4E36", dot: "#7A6E56" },
  小凶: { seal: "#2E2820", dot: "#4A3828" },
  凶: { seal: "#2E2820", dot: "#4A3828" },
};

export const FORTUNE_LEGEND = [
  { dot: "#9B1B1B", label: "吉" },
  { dot: "#B5852A", label: "小吉" },
  { dot: "#7A6E56", label: "平" },
  { dot: "#4A3828", label: "凶" },
] as const;

export const DIRECTIONS = ["正东", "东南", "正南", "西南", "正西", "西北", "正北", "东北"] as const;
export const ELEMENTS = ["木", "火", "土", "金", "水"] as const;
export type Element = typeof ELEMENTS[number];
export type Officer =
  | "建" | "除" | "满" | "平" | "定" | "执"
  | "破" | "危" | "成" | "收" | "开" | "闭";

export const STEM_ELEMENTS: Element[] = ["木", "木", "火", "火", "土", "土", "金", "金", "水", "水"];
export const BRANCH_ELEMENTS: Element[] = ["水", "土", "木", "木", "土", "火", "火", "土", "金", "金", "土", "水"];

export const ELEMENT_DIRECTIONS: Record<Element, { lucky: string; wealth: string }> = {
  木: { lucky: "正东", wealth: "东南" },
  火: { lucky: "正南", wealth: "正东" },
  土: { lucky: "东北", wealth: "西南" },
  金: { lucky: "正西", wealth: "西北" },
  水: { lucky: "正北", wealth: "正西" },
};

export const OFFICERS: { name: Officer; score: number; tags: string[]; avoidTags: string[] }[] = [
  { name: "建", score: 12, tags: ["start", "strategy", "planning"], avoidTags: ["release", "commit"] },
  { name: "除", score: 8, tags: ["cleanup", "analysis", "review"], avoidTags: ["scope"] },
  { name: "满", score: 6, tags: ["growth", "research", "alignment"], avoidTags: ["promise"] },
  { name: "平", score: 0, tags: ["alignment", "ops"], avoidTags: ["decision"] },
  { name: "定", score: 14, tags: ["decision", "planning", "commit"], avoidTags: ["experiment"] },
  { name: "执", score: 4, tags: ["delivery", "review"], avoidTags: ["scope"] },
  { name: "破", score: -24, tags: ["cleanup", "risk"], avoidTags: ["release", "promise", "commit"] },
  { name: "危", score: -16, tags: ["risk", "review"], avoidTags: ["decision", "release"] },
  { name: "成", score: 22, tags: ["release", "delivery", "growth"], avoidTags: ["rewrite"] },
  { name: "收", score: 10, tags: ["review", "analysis", "cleanup"], avoidTags: ["start"] },
  { name: "开", score: 18, tags: ["start", "research", "alignment"], avoidTags: ["closed-door"] },
  { name: "闭", score: -10, tags: ["deepwork", "cleanup"], avoidTags: ["launch", "alignment"] },
];

export const LUCKY_STARS = [
  "玉堂吉星", "天喜临门", "月德佑身", "天乙护驾",
  "紫微当值", "文昌高照", "天官赐福", "三合贵人",
];

export const NOBLE_PEOPLE_BY_STEM = [
  "资深设计师", "用户代表", "技术总监", "研发经理", "数据分析师",
  "运营负责人", "首席架构师", "产品VP", "财务总监", "CTO",
];

export const CLASH_ROLES_BY_BRANCH = [
  "增长同学", "测试工程师", "项目经理", "后端工程师", "法务同学", "UI设计师",
  "数据工程师", "产品助理", "前端工程师", "运营同学", "研发经理", "商业化同学",
] as const;

export const PROFESSION_PROFILES: Record<Profession, {
  label: string;
  shortLabel: string;
  title: string;
  noblePeople: string[];
  clashRoles: string[];
  preferredTags: string[];
  cautiousTags: string[];
  quotes: string[];
}> = {
  product: {
    label: "产品",
    shortLabel: "产品",
    title: "产品黄历",
    noblePeople: ["资深设计师", "用户代表", "数据分析师", "研发经理", "运营负责人"],
    clashRoles: ["前端工程师", "测试工程师", "项目经理", "商业化同学", "法务同学"],
    preferredTags: ["research", "planning", "strategy", "alignment", "analysis"],
    cautiousTags: ["promise", "scope", "release"],
    quotes: [
      "需求是用户的问题，方案才是产品经理的答案。",
      "优先级永远是最难的决定，但也是最重要的能力。",
      "不要问用户要什么功能，要问他们在解决什么问题。",
      "路线图是指南针，不是铁路时刻表。",
    ],
  },
  developer: {
    label: "开发",
    shortLabel: "开发",
    title: "开发黄历",
    noblePeople: ["架构师", "测试工程师", "资深后端", "DevOps同学", "产品经理"],
    clashRoles: ["需求方", "临时插单人", "环境管理员", "接口提供方", "项目经理"],
    preferredTags: ["deepwork", "delivery", "review", "cleanup", "commit"],
    cautiousTags: ["scope", "promise", "release"],
    quotes: [
      "先让代码可读，再让性能可测。",
      "今天少一点技术债，明天少一次线上火情。",
      "好的接口像好的约定，边界清楚，彼此轻松。",
      "重构不是炫技，是给未来的自己留路。",
    ],
  },
  tester: {
    label: "测试",
    shortLabel: "测试",
    title: "测试黄历",
    noblePeople: ["开发负责人", "产品经理", "自动化同学", "用户代表", "运维同学"],
    clashRoles: ["跳过自测的人", "口头改需求的人", "临时上线人", "环境污染源", "不写验收标准的人"],
    preferredTags: ["review", "analysis", "risk", "cleanup", "experiment"],
    cautiousTags: ["release", "promise", "scope"],
    quotes: [
      "好的测试不是找茬，是替用户提前遇见问题。",
      "复现路径写清楚，修复速度自然快起来。",
      "边界条件里，常藏着产品真实的脾气。",
      "质量不是最后一道门，是每一步都有人看见。",
    ],
  },
  projectManager: {
    label: "项目",
    shortLabel: "项目",
    title: "项目黄历",
    noblePeople: ["研发经理", "产品负责人", "测试负责人", "业务负责人", "资源协调人"],
    clashRoles: ["范围漂移者", "排期乐观派", "缺席决策人", "临时变更方", "依赖延期方"],
    preferredTags: ["planning", "alignment", "delivery", "risk", "review"],
    cautiousTags: ["scope", "promise", "closed-door"],
    quotes: [
      "风险提前一天说，是管理；上线当天说，是事故。",
      "排期不是愿望清单，是团队承诺的边界。",
      "把依赖摊开，项目就少一半玄学。",
      "会议的价值，在于会后每个人都知道下一步。",
    ],
  },
  operations: {
    label: "运营",
    shortLabel: "运营",
    title: "运营黄历",
    noblePeople: ["数据分析师", "产品经理", "增长负责人", "用户代表", "内容负责人"],
    clashRoles: ["临时改口径的人", "预算守门人", "渠道接口人", "素材延期方", "审批缺席人"],
    preferredTags: ["growth", "analysis", "alignment", "review", "ops"],
    cautiousTags: ["promise", "scope", "release"],
    quotes: [
      "运营不是把声量做大，而是把有效动作做深。",
      "每一次活动复盘，都是下一次增长的地图。",
      "用户路径越清楚，转化就越少靠运气。",
      "好运营会让数据说话，也会听见数据之外的人话。",
    ],
  },
};

export type Activity = {
  label: string;
  tags: string[];
  elements: Element[];
  risk?: number;
};

export const AUSPICIOUS_ACTIVITIES: Activity[] = [
  { label: "头脑风暴", tags: ["start", "research"], elements: ["木", "火"] },
  { label: "用户调研", tags: ["research"], elements: ["水", "木"] },
  { label: "竞品分析", tags: ["analysis"], elements: ["金", "水"] },
  { label: "撰写PRD", tags: ["planning", "commit"], elements: ["土", "金"] },
  { label: "需求评审", tags: ["review", "alignment"], elements: ["土", "金"] },
  { label: "数据复盘", tags: ["analysis", "review"], elements: ["水", "金"] },
  { label: "跨部门对齐", tags: ["alignment"], elements: ["土", "火"] },
  { label: "产品规划", tags: ["strategy", "planning"], elements: ["木", "土"] },
  { label: "绘制原型", tags: ["start", "planning"], elements: ["木", "金"] },
  { label: "用户访谈", tags: ["research"], elements: ["水", "木"] },
  { label: "路演汇报", tags: ["growth", "alignment"], elements: ["火", "土"] },
  { label: "技术方案评审", tags: ["review", "commit"], elements: ["金", "水"] },
  { label: "拆解OKR", tags: ["strategy", "planning"], elements: ["木", "土"] },
  { label: "版本规划", tags: ["planning", "delivery"], elements: ["土", "金"] },
  { label: "A/B测试", tags: ["experiment", "analysis"], elements: ["水", "火"] },
  { label: "指标分析", tags: ["analysis"], elements: ["水", "金"] },
  { label: "战略梳理", tags: ["strategy"], elements: ["木", "土"] },
  { label: "上下游对接", tags: ["alignment", "delivery"], elements: ["土", "火"] },
  { label: "制定迭代计划", tags: ["planning", "delivery"], elements: ["土", "金"] },
  { label: "组织产品沙龙", tags: ["alignment", "growth"], elements: ["火", "木"] },
  { label: "推进立项流程", tags: ["start", "commit"], elements: ["木", "土"] },
  { label: "撰写竞分报告", tags: ["analysis", "review"], elements: ["金", "水"] },
  { label: "灰度发布", tags: ["release", "delivery"], elements: ["火", "金"], risk: 2 },
  { label: "整理需求池", tags: ["cleanup", "review"], elements: ["土", "水"] },
  { label: "代码评审", tags: ["review", "commit"], elements: ["金", "水"] },
  { label: "修复技术债", tags: ["cleanup", "deepwork"], elements: ["土", "金"] },
  { label: "封装公共组件", tags: ["delivery", "deepwork"], elements: ["木", "金"] },
  { label: "补齐单元测试", tags: ["review", "risk"], elements: ["水", "金"] },
  { label: "编写测试用例", tags: ["planning", "risk"], elements: ["水", "土"] },
  { label: "回归核心流程", tags: ["review", "risk"], elements: ["金", "水"] },
  { label: "梳理风险清单", tags: ["risk", "planning"], elements: ["土", "水"] },
  { label: "同步里程碑", tags: ["alignment", "delivery"], elements: ["土", "火"] },
  { label: "更新项目计划", tags: ["planning", "delivery"], elements: ["土", "木"] },
  { label: "依赖逐项确认", tags: ["alignment", "risk"], elements: ["土", "金"] },
  { label: "活动复盘", tags: ["ops", "analysis", "review"], elements: ["水", "金"] },
  { label: "用户分层运营", tags: ["ops", "growth", "analysis"], elements: ["水", "木"] },
  { label: "优化转化路径", tags: ["ops", "growth"], elements: ["木", "火"] },
  { label: "梳理渠道数据", tags: ["ops", "analysis"], elements: ["水", "土"] },
];

export const INAUSPICIOUS_ACTIVITIES: Activity[] = [
  { label: "仓促拍板", tags: ["decision"], elements: ["火"], risk: 3 },
  { label: "随意改需求", tags: ["scope"], elements: ["木"], risk: 3 },
  { label: "越权指挥研发", tags: ["alignment"], elements: ["火"], risk: 3 },
  { label: "轻率画大饼", tags: ["promise"], elements: ["火", "木"], risk: 3 },
  { label: "强推无用功能", tags: ["scope"], elements: ["土"], risk: 2 },
  { label: "召开无效晨会", tags: ["alignment"], elements: ["土"], risk: 1 },
  { label: "擅自扩展范围", tags: ["scope"], elements: ["木"], risk: 3 },
  { label: "临时砍需求", tags: ["decision"], elements: ["金"], risk: 2 },
  { label: "承诺不可行方案", tags: ["promise", "commit"], elements: ["火"], risk: 3 },
  { label: "绕过评审上线", tags: ["release", "review"], elements: ["火", "金"], risk: 3 },
  { label: "单方面修改排期", tags: ["commit", "alignment"], elements: ["金"], risk: 2 },
  { label: "需求文档注水", tags: ["planning"], elements: ["水"], risk: 2 },
  { label: "跳过用户验证", tags: ["research"], elements: ["水"], risk: 3 },
  { label: "盲目照抄竞品", tags: ["analysis"], elements: ["金"], risk: 2 },
  { label: "无评审合并代码", tags: ["commit", "review"], elements: ["金"], risk: 3 },
  { label: "生产环境试手气", tags: ["release", "risk"], elements: ["火"], risk: 3 },
  { label: "忽略偶现缺陷", tags: ["risk", "review"], elements: ["水"], risk: 3 },
  { label: "口头确认验收", tags: ["commit", "alignment"], elements: ["土"], risk: 2 },
  { label: "压缩测试周期", tags: ["release", "risk"], elements: ["金"], risk: 3 },
  { label: "隐藏关键依赖", tags: ["closed-door", "risk"], elements: ["水"], risk: 3 },
  { label: "临时改活动口径", tags: ["ops", "scope"], elements: ["木"], risk: 3 },
  { label: "无数据追踪上线", tags: ["ops", "release", "analysis"], elements: ["火"], risk: 3 },
];

export const PM_QUOTES = [
  "需求是用户的问题，方案才是产品经理的答案。",
  "好的PRD让工程师不用反复追问，好的沟通让PRD不用写太详细。",
  "优先级永远是最难的决定，但也是最重要的能力。",
  "数据是镜子，用户是老师，市场是考官。",
  "迭代不是修补，而是在正确方向上持续前进。",
  "功能做减法，体验做加法，逻辑做乘法。",
  "一个没有对齐的需求，消耗的资源是对齐后的十倍。",
  "不要问用户要什么功能，要问他们在解决什么问题。",
  "产品经理的核心竞争力：在不确定中做出相对正确的决定。",
  "路线图是指南针，不是铁路时刻表。",
  "产品的边界，就是团队能力的边界。",
  "用户说要更快的马，但你要先弄清楚他们要去哪里。",
] as const;
