# SDD Progress Ledger

Branch: feat/inventure-website-bootstrap
Plan: docs/superpowers/plans/2026-10-15-inventure-communications-website.md
Order: 1 → 2 → 3 → 4 → 5 → 7 → 8 → 6

Task 1: complete (commits df31300..02f8a98, review clean after gitignore fix)

Task 2: complete (commits 02f8a98..b6b45a6, review clean; minors: remote providers untested)

Task 3: complete (commits b6b45a6..2d75868, review clean)

Task 4: complete (commits 2d75868..5f1c71c, review clean)

Task 5: complete (commits 5f1c71c..11af923, review clean; note: cacheComponents true may affect Task 8 segment revalidate)

Task 7: complete (commits 11af923..54a71f1, review clean; sitemap revalidate deferred)

Task 8: complete (commits 54a71f1..5f13fbc, review clean; cacheComponents disabled for ISR)

Task 6: complete (commits 5f13fbc..07b3552, review clean after lint fix)

Final review: approve; fixes bb431ef for SSR motion/header/site URL
All tasks complete.

# Reference layout

Branch: feat/reference-layout
Plan: docs/superpowers/plans/2026-10-17-reference-layout.md
Base: 90c0192
Order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

Task 1: complete (commits 90c0192..f451b0b, review clean). Minors: .dark does not restate --inv-accent; accent test selector hits @custom-variant dark before the .dark rule (plan-mandated helper).

Task 2: complete (commits f451b0b..9e4db29, review clean after xl breakpoint fix). Minor: header language switcher still shows from md while the drawer stays through xl, so both switchers appear between 768px and 1279px.

Task 3: complete (commits 9e4db29..5992f08, review clean). Minor: service detail "All services" still links to /#services until the services index exists.

Task 4: complete (commits 5992f08..491d8e4, review clean after breadcrumb landmark name). Minor: about test does not lock the breadcrumb.

Task 5: complete (commits 491d8e4..70ddf0f, review clean). Minor: ServiceGrid aria-labelledby is a fixed id.

Task 6: complete (commits 70ddf0f..aa55901, review clean). Minor: work-item slugs are not asserted; duplicate forum.webp can warn about LCP.

Task 7: complete (commits aa55901..4259a13, review clean). Minor: insights and careers metadata description is the empty sentence.

Task 8: complete (commits 4259a13..1be8ecf, review clean). Minor: static sitemap paths use priority 0.8; sitemap test samples three URLs.

Final review: with fixes. Fix commit 06794f0 addresses icon keys, published-only listings, duplicate language switcher, unused header service fetch, accent-test anchor, and listing metadata descriptions.

