import type { Locale } from "@/i18n/routing";
import { toEsgCommitment, toService } from "@/lib/cms/localize";
import type {
  CaseStudy,
  EsgCommitment,
  EsgCommitmentRecord,
  Insight,
  Service,
  ServiceRecord,
} from "@/types/cms";

export const SERVICE_RECORDS: ServiceRecord[] = [
  {
    id: "1",
    slug: "media-production",
    order: 1,
    icon: "media",
    title: {
      en: "Media Production",
      ar: "الإنتاج الإعلامي",
    },
    summary: {
      en: "Documentary, corporate, and multi-platform content produced to institutional standards.",
      ar: "محتوى وثائقي ومؤسسي ومتعدد المنصات يُنتَج وفق معايير مؤسسية.",
    },
    description: {
      en: "From documentary and narrative-driven production to corporate and strategic communication content, multi-platform digital assets, and high-quality event coverage — we deliver media that supports positioning, stakeholder alignment, and measurable outcomes across the Middle East.",
      ar: "من الإنتاج الوثائقي والسردي إلى المحتوى المؤسسي والاتصالي الاستراتيجي، والأصول الرقمية متعددة المنصات، وتغطية الفعاليات بجودة عالية — نقدّم إنتاجًا إعلاميًا يدعم التموضع ومواءمة أصحاب المصلحة وتحقيق نتائج قابلة للقياس في أنحاء الشرق الأوسط.",
    },
    highlights: {
      en: [
        "Documentary and narrative-driven production",
        "Corporate and strategic communication content",
        "Multi-platform digital content",
        "High-quality event coverage",
      ],
      ar: [
        "إنتاج وثائقي وسردي",
        "محتوى مؤسسي واتصالي استراتيجي",
        "محتوى رقمي متعدد المنصات",
        "تغطية فعاليات بجودة عالية",
      ],
    },
  },
  {
    id: "2",
    slug: "media-content-management",
    order: 2,
    icon: "content",
    title: {
      en: "Media & Content Management",
      ar: "إدارة الإعلام والمحتوى",
    },
    summary: {
      en: "Structured coverage, narrative design, and multi-channel planning aligned with strategic positioning.",
      ar: "تغطية منظمة وتصميم سردي وتخطيط متعدد القنوات متسق مع التموضع الاستراتيجي.",
    },
    description: {
      en: "We provide structured media coverage for initiatives and events, develop content aligned with institutional positioning, design narratives and message architecture, and plan integrated multi-channel communication programs.",
      ar: "نوفر تغطية إعلامية منظمة للمبادرات والفعاليات، ونطوّر محتوى متسقًا مع التموضع المؤسسي، ونصمم السرديات وبنية الرسائل، ونخطط لبرامج اتصال متكاملة عبر قنوات متعددة.",
    },
    highlights: {
      en: [
        "Structured media coverage for initiatives and events",
        "Content development aligned with strategic positioning",
        "Narrative design and message structuring",
        "Multi-channel communication planning",
      ],
      ar: [
        "تغطية إعلامية منظمة للمبادرات والفعاليات",
        "تطوير محتوى متسق مع التموضع الاستراتيجي",
        "تصميم السرد وبنية الرسائل",
        "تخطيط اتصال متعدد القنوات",
      ],
    },
  },
  {
    id: "3",
    slug: "digital-media-platforms",
    order: 3,
    icon: "digital",
    title: {
      en: "Digital Media & Platforms",
      ar: "الإعلام الرقمي والمنصات",
    },
    summary: {
      en: "Digital presence, campaigns, content systems, and performance frameworks built for influence.",
      ar: "حضور رقمي وحملات وأنظمة محتوى وأطر أداء تُبنى من أجل التأثير لا الضجيج.",
    },
    description: {
      en: "We manage digital presence strategically, design and execute campaigns, build content systems and publishing frameworks, and track performance to optimize reach, relevance, and reputation outcomes.",
      ar: "ندير الحضور الرقمي بشكل استراتيجي، ونصمم وننفّذ الحملات، ونبني أنظمة المحتوى وأطر النشر، ونقيس الأداء لتحسين الوصول والملاءمة ونتائج السمعة.",
    },
    highlights: {
      en: [
        "Strategic management of digital presence",
        "Campaign design and execution",
        "Content systems and publishing frameworks",
        "Performance tracking and optimization",
      ],
      ar: [
        "إدارة استراتيجية للحضور الرقمي",
        "تصميم الحملات وتنفيذها",
        "أنظمة محتوى وأطر نشر",
        "متابعة الأداء وتحسينه",
      ],
    },
  },
  {
    id: "4",
    slug: "public-relations-partnerships",
    order: 4,
    icon: "pr",
    title: {
      en: "Public Relations & Strategic Partnerships",
      ar: "العلاقات العامة والشراكات الاستراتيجية",
    },
    summary: {
      en: "Media positioning, reputation alignment, partnerships, and stakeholder engagement frameworks.",
      ar: "تموضع إعلامي ومواءمة السمعة وشراكات وأطر مشاركة أصحاب المصلحة.",
    },
    description: {
      en: "We support media positioning and relationship management, align reputation and communication with institutional objectives, structure strategic partnerships and collaborations, and design stakeholder engagement frameworks that endure scrutiny.",
      ar: "ندعم التموضع الإعلامي وإدارة العلاقات، ونوائم السمعة والاتصال مع الأهداف المؤسسية، ونهيكل الشراكات والتعاون الاستراتيجي، ونصمم أطر مشاركة أصحاب المصلحة التي تتحمل التدقيق.",
    },
    highlights: {
      en: [
        "Media positioning and relationship management",
        "Reputation and communication alignment",
        "Strategic partnerships and collaborations",
        "Stakeholder engagement frameworks",
      ],
      ar: [
        "التموضع الإعلامي وإدارة العلاقات",
        "مواءمة السمعة والاتصال",
        "شراكات وتعاون استراتيجي",
        "أطر مشاركة أصحاب المصلحة",
      ],
    },
  },
  {
    id: "5",
    slug: "events-exhibitions",
    order: 5,
    icon: "events",
    title: {
      en: "Events & Exhibitions",
      ar: "الفعاليات والمعارض",
    },
    summary: {
      en: "Conferences, exhibitions, and integrated event communication delivered with operational precision.",
      ar: "مؤتمرات ومعارض واتصال متكامل للفعاليات يُنفَّذ بدقة تشغيلية.",
    },
    description: {
      en: "We design and deliver conferences and institutional events, plan and execute exhibitions, structure sponsorships and partner coordination, and integrate event communication from pre-brief through post-event narrative continuity.",
      ar: "نصمم وننفّذ المؤتمرات والفعاليات المؤسسية، ونخطط وننفّذ المعارض، ونهيكل الرعايات وتنسيق الشركاء، وندمج اتصال الفعاليات من الإعداد حتى استمرارية السرد بعد الحدث.",
    },
    highlights: {
      en: [
        "Design and delivery of conferences and institutional events",
        "Exhibition planning and execution",
        "Sponsorship structuring and partner coordination",
        "Integrated event communication",
      ],
      ar: [
        "تصميم المؤتمرات والفعاليات المؤسسية وتقديمها",
        "تخطيط المعارض وتنفيذها",
        "هيكلة الرعايات وتنسيق الشركاء",
        "اتصال متكامل للفعاليات",
      ],
    },
  },
  {
    id: "6",
    slug: "public-affairs-government-relations",
    order: 6,
    icon: "affairs",
    title: {
      en: "Public Affairs & Government Relations",
      ar: "الشؤون العامة والعلاقات الحكومية",
    },
    summary: {
      en: "Government engagement, policy-aligned communication, and institutional positioning counsel.",
      ar: "مشاركة حكومية واتصال متسق مع السياسات ومشورة في التموضع المؤسسي.",
    },
    description: {
      en: "We advise on government and institutional engagement, develop policy-aligned communication strategies, map stakeholders and influence pathways, and support leadership on positioning in complex regulatory and public environments.",
      ar: "نقدّم المشورة في المشاركة الحكومية والمؤسسية، ونطوّر استراتيجيات اتصال متسقة مع السياسات، ونرسم خرائط أصحاب المصلحة ومسارات التأثير، وندعم القيادات في التموضع ضمن بيئات تنظيمية وعامة معقدة.",
    },
    highlights: {
      en: [
        "Government and institutional engagement",
        "Policy-aligned communication strategies",
        "Stakeholder mapping and influence planning",
        "Advisory on institutional positioning",
      ],
      ar: [
        "المشاركة الحكومية والمؤسسية",
        "استراتيجيات اتصال متسقة مع السياسات",
        "رسم أصحاب المصلحة وتخطيط التأثير",
        "مشورة في التموضع المؤسسي",
      ],
    },
  },
  {
    id: "7",
    slug: "capital-markets-financial-communications",
    order: 7,
    icon: "capital",
    title: {
      en: "Capital Markets & Financial Communications",
      ar: "أسواق رأس المال والاتصالات المالية",
    },
    summary: {
      en: "Investor narratives, IR support, and clear financial messaging at pivotal market moments.",
      ar: "سرديات المستثمرين ودعم علاقات المستثمرين ورسائل مالية واضحة في لحظات السوق المحورية.",
    },
    description: {
      en: "We support institutions in communicating with investors and financial stakeholders during fundraising, listings, and major transactions — shaping investment narratives, preparing investor-facing materials, supporting investor relations, and translating complex financial information into clear, consistent messaging that builds confidence.",
      ar: "ندعم المؤسسات في التواصل مع المستثمرين وأصحاب المصلحة الماليين أثناء جمع التمويل والإدراج والصفقات الكبرى — عبر صياغة سرديات الاستثمار، وإعداد مواد موجهة للمستثمرين، ودعم علاقات المستثمرين، وترجمة المعلومات المالية المعقدة إلى رسائل واضحة ومتسقة تبني الثقة.",
    },
    highlights: {
      en: [
        "Shaping investment narratives",
        "Preparing investor-facing materials",
        "Supporting investor relations",
        "Translating complex financial information into clear messaging",
      ],
      ar: [
        "صياغة سرديات الاستثمار",
        "إعداد مواد موجهة للمستثمرين",
        "دعم علاقات المستثمرين",
        "ترجمة المعلومات المالية المعقدة إلى رسائل واضحة",
      ],
    },
  },
];

export const ESG_COMMITMENT_RECORDS: EsgCommitmentRecord[] = [
  {
    id: "esg-1",
    order: 1,
    title: {
      en: "Responsible Operations",
      ar: "عمليات مسؤولة",
    },
    summary: {
      en: "A digital-first operating model that reduces paper use, streamlines workflows, and minimizes environmental impact across internal operations.",
      ar: "نموذج تشغيل رقمي أولًا يقلّل استخدام الورق، ويُبسّط سير العمل، ويخفّض الأثر البيئي في عملياتنا الداخلية.",
    },
  },
  {
    id: "esg-2",
    order: 2,
    title: {
      en: "Sustainable Communication",
      ar: "اتصال مستدام",
    },
    summary: {
      en: "Integrating ESG and sustainability narratives into client communication with clarity, credibility, and alignment to stakeholder expectations.",
      ar: "دمج سرديات الحوكمة البيئية والاجتماعية والاستدامة في اتصال العملاء بوضوح ومصداقية ومواءمة مع توقعات أصحاب المصلحة.",
    },
  },
  {
    id: "esg-3",
    order: 3,
    title: {
      en: "Measurable Impact",
      ar: "أثر قابل للقياس",
    },
    summary: {
      en: "Communication that drives awareness, supports informed decision-making, and contributes to long-term institutional positioning.",
      ar: "اتصال يعزّز الوعي، ويدعم اتخاذ قرارات مستنيرة، ويساهم في التموضع المؤسسي على المدى الطويل.",
    },
  },
];

export async function mockFetchServices(locale: Locale): Promise<Service[]> {
  return [...SERVICE_RECORDS]
    .sort((a, b) => a.order - b.order)
    .map((record) => toService(record, locale));
}

export async function mockFetchServiceBySlug(
  slug: string,
  locale: Locale,
): Promise<Service | null> {
  const record = SERVICE_RECORDS.find((s) => s.slug === slug);
  if (!record) return null;
  return toService(record, locale);
}

export async function mockFetchInsights(locale: Locale): Promise<Insight[]> {
  void locale;
  return [];
}

export async function mockFetchEsgCommitments(
  locale: Locale,
): Promise<EsgCommitment[]> {
  return [...ESG_COMMITMENT_RECORDS]
    .sort((a, b) => a.order - b.order)
    .map((record) => toEsgCommitment(record, locale));
}

export async function mockFetchCaseStudies(locale: Locale): Promise<CaseStudy[]> {
  void locale;
  return [];
}
