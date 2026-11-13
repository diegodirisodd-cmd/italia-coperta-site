"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Lavoro } from "@/lib/lavori";

/**
 * Photo or short muted video for a job. Videos autoplay muted in loop only
 * while on screen (and never with reduced motion), so they cost nothing until
 * the visitor scrolls to them; the poster is the job's photo.
 */
export function LavoroMedia({
  lavoro,
  fill = false,
  sizes,
  priority = false,
  className = "",
}: {
  lavoro: Lavoro;
  fill?: boolean;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  if (lavoro.video) {
    return (
      <video
        ref={ref}
        src={lavoro.video}
        poster={lavoro.image}
        muted
        loop
        playsInline
        preload="none"
        aria-label={lavoro.alt}
        width={lavoro.width}
        height={lavoro.height}
        className={`${fill ? "absolute inset-0 h-full w-full object-cover" : "h-auto w-full"} ${className}`}
      />
    );
  }

  return fill ? (
    <Image src={lavoro.image} alt={lavoro.alt} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />
  ) : (
    <Image
      src={lavoro.image}
      alt={lavoro.alt}
      width={lavoro.width}
      height={lavoro.height}
      sizes={sizes}
      priority={priority}
      className={`h-auto w-full ${className}`}
    />
  );
}
