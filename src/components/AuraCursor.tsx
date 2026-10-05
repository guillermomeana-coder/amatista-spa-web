"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

interface AuraCursorProps {
  /** Primary glow color (default: primary purple from design system) */
  color?: string;
  /** Secondary glow color for dual-layer effect */
  secondaryColor?: string;
  /** Size of the main aura circle in px (default: 300) */
  size?: number;
  /** Size of the inner core glow in px (default: 150) */
  coreSize?: number;
  /** Blur amount in px for the main aura (default: 80) */
  blur?: number;
  /** Blur amount in px for the core (default: 40) */
  coreBlur?: number;
  /** Opacity 0-1 for the main aura (default: 0.15) */
  opacity?: number;
  /** Opacity 0-1 for the core (default: 0.25) */
  coreOpacity?: number;
  /** GSAP easing duration in seconds (default: 0.8) */
  smoothing?: number;
  /** Whether to pulse gently (default: true) */
  pulse?: boolean;
  /** Disable on touch devices (default: true) */
  disableOnTouch?: boolean;
  /** z-index for the cursor layer (default: 9999) */
  zIndex?: number;
}

export default function AuraCursor({
  color = "var(--primary)",
  secondaryColor = "var(--primary-light)",
  size = 300,
  coreSize = 150,
  blur = 80,
  coreBlur = 40,
  opacity = 0.15,
  coreOpacity = 0.25,
  smoothing = 0.8,
  pulse = true,
  disableOnTouch = true,
  zIndex = 9999,
}: AuraCursorProps) {
  const auraRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -500, y: -500 });
  const visible = useRef(false);
  const rafId = useRef<number>(0);

  const updatePosition = useCallback(
    (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (!visible.current && auraRef.current && coreRef.current) {
        visible.current = true;
        gsap.to([auraRef.current, coreRef.current], {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    },
    []
  );

  const hideAura = useCallback(() => {
    visible.current = false;
    if (auraRef.current && coreRef.current) {
      gsap.to([auraRef.current, coreRef.current], {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, []);

  useEffect(() => {
    // Skip on touch devices
    if (disableOnTouch && "ontouchstart" in window) return;

    const aura = auraRef.current;
    const core = coreRef.current;
    if (!aura || !core) return;

    // Set initial positions offscreen
    gsap.set([aura, core], { x: -500, y: -500, opacity: 0 });

    // Smooth follow loop with GSAP quickTo for buttery performance
    const xAura = gsap.quickTo(aura, "x", {
      duration: smoothing,
      ease: "power3.out",
    });
    const yAura = gsap.quickTo(aura, "y", {
      duration: smoothing,
      ease: "power3.out",
    });
    const xCore = gsap.quickTo(core, "x", {
      duration: smoothing * 0.6,
      ease: "power3.out",
    });
    const yCore = gsap.quickTo(core, "y", {
      duration: smoothing * 0.6,
      ease: "power3.out",
    });

    // Pulse animation
    let pulseTween: gsap.core.Tween | null = null;
    if (pulse) {
      pulseTween = gsap.to(aura, {
        scale: 1.08,
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

    // Animation frame for updating positions
    const tick = () => {
      const { x, y } = mousePos.current;
      xAura(x - size / 2);
      yAura(y - size / 2);
      xCore(x - coreSize / 2);
      yCore(y - coreSize / 2);
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    // Listen globally
    document.addEventListener("mousemove", updatePosition);
    document.addEventListener("mouseleave", hideAura);

    return () => {
      cancelAnimationFrame(rafId.current);
      document.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mouseleave", hideAura);
      pulseTween?.kill();
    };
  }, [
    size,
    coreSize,
    smoothing,
    pulse,
    disableOnTouch,
    updatePosition,
    hideAura,
  ]);

  // Don't render on touch devices (SSR safe)
  if (typeof window !== "undefined" && disableOnTouch && "ontouchstart" in window) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex,
        overflow: "hidden",
      }}
    >
      {/* Outer aura glow */}
      <div
        ref={auraRef}
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color} 0%, ${secondaryColor} 40%, transparent 70%)`,
          filter: `blur(${blur}px)`,
          opacity: 0,
          willChange: "transform",
          mixBlendMode: "normal",
        }}
      />
      {/* Inner core glow (brighter, tighter) */}
      <div
        ref={coreRef}
        style={{
          position: "absolute",
          width: coreSize,
          height: coreSize,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          filter: `blur(${coreBlur}px)`,
          opacity: 0,
          willChange: "transform",
          mixBlendMode: "normal",
        }}
      />
    </div>
  );
}
