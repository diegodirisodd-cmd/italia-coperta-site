"use client";

import { useEffect, useState } from "react";

/**
 * True only on devices with a real, fine pointer that can hover (mouse /
 * trackpad). Returns false during SSR and on touch devices, so hover-only
 * effects (spotlight, magnetic CTA, 3D tilt) can be skipped entirely there
 * instead of merely hidden. Reacts to input changes (e.g. attaching a mouse).
 */
export function usePointerFine() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return fine;
}
