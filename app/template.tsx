"use client";

import { m, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { EASE_OUT } from "@/components/motion/variants";

// True until the first client render has committed. On the very first page
// load the content must be visible straight from the server HTML: rendering
// it at opacity 0 kept the whole page (and the hero image, our LCP element)
// invisible until JavaScript had loaded — ~3 s on a mid-range phone.
let isFirstLoad = true;

// App Router remounts template.tsx on every navigation, giving each route a
// soft fade + lift entrance on client-side navigations only.
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  // Server and hydration render: no entrance (matches, no opacity 0 in HTML).
  // Later navigations: isFirstLoad is false → animate in.
  const [animateIn] = useState(() => typeof window !== "undefined" && !isFirstLoad);

  useEffect(() => {
    isFirstLoad = false;
  }, []);

  if (reduced || !animateIn) return <>{children}</>;
  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
    >
      {children}
    </m.div>
  );
}
