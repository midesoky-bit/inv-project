"use client";

import { useEffect } from "react";

type JsonLdScriptProps = {
  id: string;
  json: string;
};

export function JsonLdScript({ id, json }: JsonLdScriptProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = json;
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [id, json]);

  return null;
}
