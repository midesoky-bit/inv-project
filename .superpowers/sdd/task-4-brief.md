### Task 4: HeroSection, ServiceGrid, and homepage

**Files:**
- Create: `src/components/home/HeroSection.tsx`
- Create: `src/components/home/ServiceCardMotion.tsx` (leaf client motion)
- Create: `src/components/home/ServiceGrid.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `fetchServices()`, `Button`, `Service` type
- Produces: homepage composition with Hero + ServiceGrid

- [ ] **Step 1: Implement HeroSection (client leaf for motion)**

Create `src/components/home/HeroSection.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[88vh] items-center bg-inv-navy px-6 pt-24 pb-20 text-inv-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(58,107,140,0.25),_transparent_55%)]"
      />
      <div className="relative mx-auto w-full max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-6 font-serif text-sm tracking-[0.2em] text-white/70 uppercase"
        >
          Inventure Communications
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: "easeOut" }}
          className="max-w-3xl font-serif text-4xl leading-tight tracking-tight text-balance sm:text-5xl md:text-6xl"
        >
          Strategic communications for decision-makers
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
          className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
        >
          We counsel institutions across the Middle East on reputation, media,
          and public affairs — with clarity, discipline, and regional fluency.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18, ease: "easeOut" }}
          className="mt-10 flex flex-wrap items-center gap-6"
        >
          <Button href="/#services">Explore our services</Button>
          <Button href="/#contact" variant="ghost">
            Contact
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Implement ServiceGrid + motion leaf**

Create `src/components/home/ServiceCardMotion.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type ServiceCardMotionProps = {
  href: string;
  title: string;
  summary: string;
  index: number;
};

export function ServiceCardMotion({
  href,
  title,
  summary,
  index,
}: ServiceCardMotionProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="group border border-inv-navy/10 bg-inv-white p-8 transition-colors hover:border-inv-accent/40"
    >
      <Link href={href} className="block space-y-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-inv-accent">
        <h3 className="font-serif text-2xl tracking-tight text-inv-navy">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-inv-slate">{summary}</p>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-inv-accent transition-transform group-hover:translate-x-1">
          Learn more
          <span aria-hidden>→</span>
        </span>
      </Link>
    </motion.article>
  );
}
```

Create `src/components/home/ServiceGrid.tsx`:

```tsx
import { ServiceCardMotion } from "@/components/home/ServiceCardMotion";
import type { Service } from "@/types/cms";

type ServiceGridProps = {
  services: Service[];
};

export function ServiceGrid({ services }: ServiceGridProps) {
  return (
    <section
      id="services"
      className="bg-inv-mist px-6 py-20 md:py-28"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-medium tracking-[0.18em] text-inv-accent uppercase">
            Capabilities
          </p>
          <h2
            id="services-heading"
            className="font-serif text-3xl tracking-tight text-inv-navy md:text-4xl"
          >
            Core offerings
          </h2>
          <p className="mt-4 text-base text-inv-slate">
            Integrated communications disciplines for institutional clients.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service, index) => (
            <ServiceCardMotion
              key={service.id}
              href={`/services/${service.slug}`}
              title={service.title}
              summary={service.summary}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire homepage** (Amendment C2: homepage canonical)

Replace `src/app/page.tsx`:

```tsx
import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { ServiceGrid } from "@/components/home/ServiceGrid";
import { fetchServices } from "@/services/cms";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const services = await fetchServices();

  return (
    <>
      <HeroSection />
      <ServiceGrid services={services} />
    </>
  );
}
```

- [ ] **Step 4: Build verify**

```powershell
npm run build
```

Expected: successful build; homepage route present.

- [ ] **Step 5: Commit**

```powershell
git add src/components/home src/app/page.tsx
git commit -m "feat: add institutional hero and CMS-backed service grid"
```

---

