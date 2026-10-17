export default function Logo({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <text
        x="0"
        y="64"
        className="fill-[#0B1D36] dark:fill-white"
        fontFamily="var(--font-ibm-plex-sans), sans-serif"
        fontWeight="600"
        fontSize="58"
      >
        <tspan>IN</tspan>
        <tspan className="fill-[#1FA971]">V</tspan>
        <tspan>ENTURE</tspan>
      </text>
      <path d="M118 34 L142 8 L160 22 L146 40 Z" className="fill-[#1FA971]" />
      <text
        x="2"
        y="98"
        className="fill-[#0B1D36] dark:fill-white"
        fontFamily="var(--font-ibm-plex-sans), sans-serif"
        fontWeight="500"
        fontSize="18"
        letterSpacing="7.5"
      >
        COMMUNICATIONS
      </text>
    </svg>
  );
}
