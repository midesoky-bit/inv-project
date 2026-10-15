module.exports = [
(()=>{"use strict";return[
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$favicon$2e$ico__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/app/favicon.ico (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$favicon$2e$ico__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 48,
    height: 48
};
}),
"[project]/src/app/services/[slug]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ServicePage,
    "dynamicParams",
    ()=>dynamicParams,
    "generateMetadata",
    ()=>generateMetadata,
    "generateStaticParams",
    ()=>generateStaticParams,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$cms$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/services/cms.ts [app-rsc] (ecmascript) <locals>");
;
;
;
;
const revalidate = 3600;
const dynamicParams = true;
async function generateStaticParams() {
    const services = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$cms$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["fetchServices"])();
    return services.map((service)=>({
            slug: service.slug
        }));
}
async function generateMetadata({ params }) {
    const { slug } = await params;
    const service = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$cms$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["fetchServiceBySlug"])(slug);
    if (!service) {
        return {
            title: "Service not found",
            robots: {
                index: false
            }
        };
    }
    const path = `/services/${service.slug}`;
    return {
        title: service.title,
        description: service.summary,
        alternates: {
            canonical: path
        },
        openGraph: {
            type: "website",
            locale: "en_US",
            siteName: "Inventure Communications",
            url: path,
            title: `${service.title} | Inventure Communications`,
            description: service.summary
        }
    };
}
async function ServicePage({ params }) {
    const { slug } = await params;
    const service = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$cms$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["fetchServiceBySlug"])(slug);
    if (!service) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: "bg-inv-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-inv-navy px-6 pt-28 pb-16 text-inv-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-3xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-4 text-xs tracking-[0.18em] text-white/60 uppercase",
                            children: "Service"
                        }, void 0, false, {
                            fileName: "[project]/src/app/services/[slug]/page.tsx",
                            lineNumber: 56,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "font-serif text-4xl tracking-tight md:text-5xl",
                            children: service.title
                        }, void 0, false, {
                            fileName: "[project]/src/app/services/[slug]/page.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-6 text-lg text-white/75",
                            children: service.summary
                        }, void 0, false, {
                            fileName: "[project]/src/app/services/[slug]/page.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/services/[slug]/page.tsx",
                    lineNumber: 55,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/services/[slug]/page.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto max-w-3xl px-6 py-16",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-base leading-relaxed text-inv-slate",
                        children: service.description
                    }, void 0, false, {
                        fileName: "[project]/src/app/services/[slug]/page.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        href: "/#services",
                        className: "mt-10 inline-flex text-sm font-medium text-inv-accent hover:underline",
                        children: "← All services"
                    }, void 0, false, {
                        fileName: "[project]/src/app/services/[slug]/page.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/services/[slug]/page.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/services/[slug]/page.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/cms/client.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "REVALIDATE_SECONDS",
    ()=>REVALIDATE_SECONDS,
    "cmsFetch",
    ()=>cmsFetch,
    "getCmsProvider",
    ()=>getCmsProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$errors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cms/errors.ts [app-rsc] (ecmascript)");
;
const REVALIDATE_SECONDS = 3600;
function getCmsProvider() {
    const value = (process.env.CMS_PROVIDER ?? "mock").toLowerCase();
    if (value === "directus" || value === "supabase" || value === "mock") {
        return value;
    }
    return "mock";
}
async function cmsFetch(path, options = {}) {
    const baseUrl = process.env.CMS_URL;
    if (!baseUrl) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$errors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CmsError"]("CMS_URL is not configured", "CONFIG");
    }
    const token = process.env.CMS_TOKEN;
    const url = `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
    let response;
    try {
        response = await fetch(url, {
            headers: {
                Accept: "application/json",
                ...token ? {
                    Authorization: `Bearer ${token}`
                } : {},
                ...options.headers
            },
            next: {
                tags: options.tags,
                revalidate: options.revalidate ?? REVALIDATE_SECONDS
            }
        });
    } catch (cause) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$errors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CmsError"](`CMS request failed for ${path}`, "NETWORK", cause);
    }
    if (!response.ok) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$errors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CmsError"](`CMS responded ${response.status} for ${path}`, response.status === 404 ? "NOT_FOUND" : "NETWORK");
    }
    try {
        return await response.json();
    } catch (cause) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$errors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CmsError"](`Failed to parse CMS response for ${path}`, "PARSE", cause);
    }
}
}),
"[project]/src/lib/cms/errors.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CmsError",
    ()=>CmsError
]);
class CmsError extends Error {
    code;
    cause;
    constructor(message, code, cause){
        super(message), this.code = code, this.cause = cause;
        this.name = "CmsError";
    }
}
}),
"[project]/src/lib/cms/providers/directus.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "directusFetchCaseStudies",
    ()=>directusFetchCaseStudies,
    "directusFetchEsgCommitments",
    ()=>directusFetchEsgCommitments,
    "directusFetchInsights",
    ()=>directusFetchInsights,
    "directusFetchServiceBySlug",
    ()=>directusFetchServiceBySlug,
    "directusFetchServices",
    ()=>directusFetchServices
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cms/client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$errors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cms/errors.ts [app-rsc] (ecmascript)");
;
;
async function directusFetchServices() {
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cmsFetch"])("/items/services?sort=order", {
        tags: [
            "services"
        ]
    });
    return result.data;
}
async function directusFetchServiceBySlug(slug) {
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cmsFetch"])(`/items/services?filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1`, {
            tags: [
                "services",
                `service:${slug}`
            ]
        });
        return result.data[0] ?? null;
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$errors$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CmsError"] && error.code === "NOT_FOUND") return null;
        throw error;
    }
}
async function directusFetchInsights() {
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cmsFetch"])("/items/insights", {
        tags: [
            "insights"
        ]
    });
    return result.data;
}
async function directusFetchEsgCommitments() {
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cmsFetch"])("/items/esg_commitments?sort=order", {
        tags: [
            "esg"
        ]
    });
    return result.data;
}
async function directusFetchCaseStudies() {
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cmsFetch"])("/items/case_studies", {
        tags: [
            "case-studies"
        ]
    });
    return result.data;
}
}),
"[project]/src/lib/cms/providers/mock.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mockFetchCaseStudies",
    ()=>mockFetchCaseStudies,
    "mockFetchEsgCommitments",
    ()=>mockFetchEsgCommitments,
    "mockFetchInsights",
    ()=>mockFetchInsights,
    "mockFetchServiceBySlug",
    ()=>mockFetchServiceBySlug,
    "mockFetchServices",
    ()=>mockFetchServices
]);
const SERVICES = [
    {
        id: "1",
        slug: "media-production",
        title: "Media Production",
        summary: "Broadcast-quality storytelling that carries institutional narratives with clarity and restraint.",
        description: "From executive films to multi-format campaigns, we produce media that meets the standards of government, enterprise, and multilateral stakeholders across the Middle East.",
        order: 1,
        icon: "media"
    },
    {
        id: "2",
        slug: "digital-media",
        title: "Digital Media",
        summary: "Owned and earned digital ecosystems designed for influence, not noise.",
        description: "We architect digital presence, content systems, and performance frameworks that advance reputation and policy objectives in complex regional markets.",
        order: 2,
        icon: "digital"
    },
    {
        id: "3",
        slug: "events",
        title: "Events",
        summary: "High-stakes convenings staged with diplomatic precision and operational excellence.",
        description: "Summits, forums, and private briefings delivered end-to-end — messaging, staging, stakeholder management, and post-event narrative continuity.",
        order: 3,
        icon: "events"
    },
    {
        id: "4",
        slug: "public-affairs",
        title: "Public Affairs",
        summary: "Strategic counsel at the intersection of policy, reputation, and public discourse.",
        description: "We advise leadership teams on stakeholder mapping, issues management, and communications that withstand scrutiny in the Middle East’s institutional landscape.",
        order: 4,
        icon: "affairs"
    }
];
async function mockFetchServices() {
    return [
        ...SERVICES
    ].sort((a, b)=>a.order - b.order);
}
async function mockFetchServiceBySlug(slug) {
    const services = await mockFetchServices();
    return services.find((s)=>s.slug === slug) ?? null;
}
async function mockFetchInsights() {
    return [];
}
async function mockFetchEsgCommitments() {
    return [];
}
async function mockFetchCaseStudies() {
    return [];
}
}),
"[project]/src/lib/cms/providers/supabase.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabaseFetchCaseStudies",
    ()=>supabaseFetchCaseStudies,
    "supabaseFetchEsgCommitments",
    ()=>supabaseFetchEsgCommitments,
    "supabaseFetchInsights",
    ()=>supabaseFetchInsights,
    "supabaseFetchServiceBySlug",
    ()=>supabaseFetchServiceBySlug,
    "supabaseFetchServices",
    ()=>supabaseFetchServices
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cms/client.ts [app-rsc] (ecmascript)");
;
async function supabaseFetchServices() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cmsFetch"])("/rest/v1/services?select=*&order=order.asc", {
        tags: [
            "services"
        ],
        headers: {
            apikey: process.env.CMS_TOKEN ?? ""
        }
    });
}
async function supabaseFetchServiceBySlug(slug) {
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cmsFetch"])(`/rest/v1/services?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`, {
        tags: [
            "services",
            `service:${slug}`
        ],
        headers: {
            apikey: process.env.CMS_TOKEN ?? ""
        }
    });
    return rows[0] ?? null;
}
async function supabaseFetchInsights() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cmsFetch"])("/rest/v1/insights?select=*", {
        tags: [
            "insights"
        ],
        headers: {
            apikey: process.env.CMS_TOKEN ?? ""
        }
    });
}
async function supabaseFetchEsgCommitments() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cmsFetch"])("/rest/v1/esg_commitments?select=*&order=order.asc", {
        tags: [
            "esg"
        ],
        headers: {
            apikey: process.env.CMS_TOKEN ?? ""
        }
    });
}
async function supabaseFetchCaseStudies() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cmsFetch"])("/rest/v1/case_studies?select=*", {
        tags: [
            "case-studies"
        ],
        headers: {
            apikey: process.env.CMS_TOKEN ?? ""
        }
    });
}
}),
"[project]/src/services/cms.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchCaseStudies",
    ()=>fetchCaseStudies,
    "fetchEsgCommitments",
    ()=>fetchEsgCommitments,
    "fetchInsights",
    ()=>fetchInsights,
    "fetchServiceBySlug",
    ()=>fetchServiceBySlug,
    "fetchServices",
    ()=>fetchServices
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cms/client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$providers$2f$directus$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cms/providers/directus.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$providers$2f$mock$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cms/providers/mock.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$providers$2f$supabase$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cms/providers/supabase.ts [app-rsc] (ecmascript)");
;
;
;
;
async function fetchServices() {
    switch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCmsProvider"])()){
        case "directus":
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$providers$2f$directus$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["directusFetchServices"]();
        case "supabase":
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$providers$2f$supabase$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseFetchServices"]();
        default:
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$providers$2f$mock$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["mockFetchServices"]();
    }
}
async function fetchServiceBySlug(slug) {
    switch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCmsProvider"])()){
        case "directus":
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$providers$2f$directus$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["directusFetchServiceBySlug"](slug);
        case "supabase":
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$providers$2f$supabase$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseFetchServiceBySlug"](slug);
        default:
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$providers$2f$mock$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["mockFetchServiceBySlug"](slug);
    }
}
async function fetchInsights() {
    switch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCmsProvider"])()){
        case "directus":
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$providers$2f$directus$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["directusFetchInsights"]();
        case "supabase":
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$providers$2f$supabase$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseFetchInsights"]();
        default:
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$providers$2f$mock$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["mockFetchInsights"]();
    }
}
async function fetchEsgCommitments() {
    switch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCmsProvider"])()){
        case "directus":
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$providers$2f$directus$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["directusFetchEsgCommitments"]();
        case "supabase":
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$providers$2f$supabase$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseFetchEsgCommitments"]();
        default:
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$providers$2f$mock$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["mockFetchEsgCommitments"]();
    }
}
async function fetchCaseStudies() {
    switch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCmsProvider"])()){
        case "directus":
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$providers$2f$directus$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["directusFetchCaseStudies"]();
        case "supabase":
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$providers$2f$supabase$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["supabaseFetchCaseStudies"]();
        default:
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$providers$2f$mock$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["mockFetchCaseStudies"]();
    }
}
;
}),
]})(),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/favicon.ico (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/favicon.117ezoe8m31dk.ico" + (globalThis["NEXT_CLIENT_ASSET_SUFFIX"] || ''));}),
"[project]/src/app/services/[slug]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/services/[slug]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__17ucxdt23fp2w._.js.map