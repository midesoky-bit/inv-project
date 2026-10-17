export function LinkedInIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M4.7 3.5A1.8 1.8 0 1 0 4.7 7a1.8 1.8 0 0 0 0-3.5ZM3.2 8.7h3v12h-3v-12Zm5.1 0h2.9v1.6h.1c.4-.8 1.4-1.7 2.9-1.7 3.1 0 3.7 2 3.7 4.7v7.4h-3v-6.6c0-1.6 0-3.6-2.2-3.6s-2.5 1.7-2.5 3.5v6.7h-3v-12Z" />
    </svg>
  );
}

export function XIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M14.7 10.3 21.4 3h-1.6l-5.8 6.4L9.2 3H3.5l7 9.9L3.5 21h1.6l6.1-6.8L15.3 21h5.7l-6.3-10.7Zm-2.2 2.4-.7-1-5.6-7.8h2.4l4.5 6.3.7 1 5.9 8.2h-2.4l-4.8-6.7Z" />
    </svg>
  );
}

export function YouTubeIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M22 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C18.3 5.4 12 5.4 12 5.4s-6.3 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 9 2 12.2 2 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.5.4 7.8.4 7.8.4s6.3 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6ZM10 15.5v-6.6l5.2 3.3-5.2 3.3Z" />
    </svg>
  );
}

export const SOCIAL_NETWORKS = [
  { label: "linkedin", url: "linkedinUrl", Icon: LinkedInIcon },
  { label: "x", url: "xUrl", Icon: XIcon },
  { label: "youtube", url: "youtubeUrl", Icon: YouTubeIcon },
] as const;
