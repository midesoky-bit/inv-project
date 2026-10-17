import type { SVGProps } from "react";

/**
 * Inventure Communications logo.
 *
 * Dark mode: the navy letters and tagline switch to white. It responds to
 *  - the `.dark` class or `data-theme="dark"` on any ancestor (next-themes, Tailwind class mode), and
 *  - the OS setting `prefers-color-scheme: dark`, unless the page forces light mode
 *    with a `.light` class or `data-theme="light"`.
 *
 * To override the colors from outside, set CSS variables on the element, e.g.
 *   <Logo style={{ ["--inv-navy" as string]: "#000" }} />
 */
const css = `
.inv-logo { --inv-navy: #142544; --inv-shade: #16955a; }
.inv-logo .inv-navy { fill: var(--inv-navy); }
.inv-logo .inv-shade { fill: var(--inv-shade); }

.dark .inv-logo,
[data-theme="dark"] .inv-logo {
  --inv-navy: #ffffff;
  --inv-shade: #1fb871;
}

@media (prefers-color-scheme: dark) {
  :root:not(.light):not([data-theme="light"]) .inv-logo {
    --inv-navy: #ffffff;
    --inv-shade: #1fb871;
  }
}
`;

export function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2576 1075"
      role="img"
      aria-label="Inventure Communications"
      className={className ? `inv-logo ${className}` : "inv-logo"}
      {...props}
    >
      <title>Inventure Communications</title>
      <style>{css}</style>

      {/* Navy (white in dark mode) letters */}
      <g className="inv-navy">
        {/* I */}
        <rect x="92" y="381" width="71" height="306" />
        {/* N */}
        <path d="M212 381H272L410 562V381H481V687H421L282 502V687H212Z" />
        {/* V (left arm) */}
        <path d="M505 381H590L662 572L623 678Z" />
        {/* E */}
        <path d="M857 381H1067V441H928V502H1051V560H928V627H1073V687H857Z" />
        {/* N */}
        <path d="M1113 381H1173L1312 562V381H1383V687H1323L1184 502V687H1113Z" />
        {/* T */}
        <path d="M1415 381H1655V441H1570V687H1500V441H1415Z" />
        {/* U */}
        <path d="M1688 381H1757V570C1757 610 1785 628 1818 628C1852 628 1878 610 1878 570V540L1948 468V575C1948 645 1895 692 1818 692C1745 692 1690 640 1690 597Z" />
        {/* R */}
        <path
          fillRule="evenodd"
          d="M1993 381H2100C2190 381 2237 425 2237 487C2237 535 2210 565 2177 578L2240 687H2165L2108 594H2063V687H1993ZM2063 441V534H2113C2147 534 2165 518 2165 488C2165 458 2147 441 2113 441Z"
        />
        {/* E */}
        <path d="M2277 381H2485V441H2347V502H2470V560H2347V627H2490V687H2277Z" />
      </g>

      {/* Bright green accents (same in both modes) */}
      <g fill="#0acb6e">
        {/* V (right arm, upper piece) */}
        <path d="M749 381H831L812 432C808 442 800 446 790 450L718 483Z" />
        {/* V (right arm, lower piece) */}
        <path d="M800 455L716 687H638L690 540C698 515 712 508 730 498Z" />
        {/* Growth arrow through U */}
        <path d="M1757 405L1830 470L1975 295L1945 265L2073 250L2062 380L2032 350L1830 555L1760 497L1688 572V485Z" />
      </g>

      {/* Green shading */}
      <g className="inv-shade">
        <path d="M563 524L662 572L623 678Z" />
        <path d="M1688 485L1757 405V497L1688 572Z" />
      </g>

      {/* Tagline */}
      <text
        className="inv-navy"
        x="92"
        y="858"
        fontFamily="Montserrat, 'Segoe UI', Arial, sans-serif"
        fontSize="125"
        fontWeight="500"
        textLength="2398"
        lengthAdjust="spacing"
      >
        COMMUNICATIONS
      </text>
    </svg>
  );
}

export default Logo;
