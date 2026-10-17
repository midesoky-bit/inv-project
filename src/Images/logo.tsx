import React from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "h-12 w-auto" }: LogoProps) {
  return (
    <svg 
      viewBox="0 0 540 160" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* INVENTURE */}
      <g className="fill-[#0B1D36] dark:fill-white">
        {/* I */}
        <path d="M25 45h16v60H25V45z"/>
        {/* N */}
        <path d="M53 45h15l19 36V45h15v60H88L68 67v38H53V45z"/>
      </g>

      {/* حرف الـ V والأخضر المتجه للصعود */}
      <g className="fill-[#1FA971]">
        {/* V */}
        <path d="M114 45h15.5l10.5 40 2.5-9 6-19.5 5.5-11.5H169l-22.5 60h-11L114 45z"/>
        {/* السهم المتجه للصعود */}
        <path d="M192 68l7.5-13.5 14 7L233 41l5.5 13L245 42l15-13 8 9.5-22.5 19.5-6.5-11-13 14 6 10-41-13.5z"/>
      </g>

      {/* ENTURE */}
      <g className="fill-[#0B1D36] dark:fill-white">
        {/* E */}
        <path d="M178 45h35v12h-20v11h17v12h-17v13h21v12h-36V45z"/>
        {/* N */}
        <path d="M225 45h15l19 36V45h15v60H260L240 67v38h-15V45z"/>
        {/* T */}
        <path d="M289 45h38v12h-12v48h-14v-48h-12V45z"/>
        {/* U */}
        <path d="M339 45h15v38c0 7 4 10 9 10s9-3 9-10V45h15v38c0 15-9 24-24 24s-24-9-24-24V45z"/>
        {/* R */}
        <path d="M399 45h21c13 0 20 5 20 14 0 7-5 12-11 13l13 33h-16l-11-29h-2V105h-14V45zm14 26h6c4 0 7-1 7-5s-3-5-7-5h-6v10z"/>
        {/* E */}
        <path d="M455 45h35v12h-20v11h17v12h-17v13h21v12h-36V45z"/>
      </g>

      {/* COMMUNICATIONS */}
      <g className="fill-[#0B1D36] dark:fill-white" opacity="0.95">
        {/* C */}
        <path d="M31 125c-5 0-9 4-9 9s4 9 9 9c4 0 7-3 8-6h3c-1 5-6 8-11 8-7 0-12-5-12-11s5-11 12-11c5 0 10 3 11 8h-3c-1-3-4-6-8-6z"/>
        {/* O */}
        <path d="M54 123c7 0 11 5 11 11s-4 11-11 11-11-5-11-11 4-11 11-11zm0 3c-5 0-8 3-8 8s3 8 8 8 8-3 8-8-3-8-8-8z"/>
        {/* M */}
        <path d="M72 124h4l5 13 5-13h4v19h-3v-15l-5 13h-2l-5-13v15h-3v-19z"/>
        {/* M */}
        <path d="M99 124h4l5 13 5-13h4v19h-3v-15l-5 13h-2l-5-13v15h-3v-19z"/>
        {/* U */}
        <path d="M127 124h3v12c0 3 1 4 4 4s4-1 4-4v-12h3v12c0 5-3 7-7 7s-7-2-7-7v-12z"/>
        {/* N */}
        <path d="M149 124h3l5 11v-11h3v19h-3l-5-11v11h-3v-19z"/>
        {/* I */}
        <path d="M171 124h3v19h-3v-19z"/>
        {/* C */}
        <path d="M189 125c-5 0-9 4-9 9s4 9 9 9c4 0 7-3 8-6h3c-1 5-6 8-11 8-7 0-12-5-12-11s5-11 12-11c5 0 10 3 11 8h-3c-1-3-4-6-8-6z"/>
        {/* A */}
        <path d="M211 124h3l5 19h-3l-1-4h-6l-1 4h-3l5-19zm3 12l-2-8-2 8h4z"/>
        {/* T */}
        <path d="M226 124h11v3h-4v16h-3v-16h-4v-3z"/>
        {/* I */}
        <path d="M245 124h3v19h-3v-19z"/>
        {/* O */}
        <path d="M264 123c7 0 11 5 11 11s-4 11-11 11-11-5-11-11 4-11 11-11zm0 3c-5 0-8 3-8 8s3 8 8 8 8-3 8-8-3-8-8-8z"/>
        {/* N */}
        <path d="M285 124h3l5 11v-11h3v19h-3l-5-11v11h-3v-19z"/>
        {/* S */}
        <path d="M306 137c0-4 3-5 7-6 4-1 5-2 5-4s-2-3-4-3-4 1-5 4h-3c1-4 4-6 8-6 5 0 7 2 7 5 0 4-3 5-7 6-4 1-5 2-5 4s2 3 4 3 4-1 5-4h3c-1 4-4 6-8 6-5 0-7-2-7-5z"/>
      </g>
    </svg>
  );
}