"use client";

import { useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  type Transition as MotionTransition,
} from "framer-motion";

interface ExperienceItem {
  text: string;
  image: string;
  link?: string;
}

interface HoverImageRevealProps {
  items: ExperienceItem[];
  textColor?: string;
  dimColor?: string;
  accentColor?: string;
  fontSize?: string;
  imageWidth?: number;
  imageHeight?: number;
  rounded?: number;
  offsetX?: number;
  offsetY?: number;
  followStrength?: number;
  transition?: MotionTransition;
}

const DEFAULT_TRANSITION: MotionTransition = {
  type: "spring",
  stiffness: 400,
  damping: 40,
  mass: 1,
};

export default function HoverImageReveal({
  items,
  textColor = "var(--foreground)",
  dimColor = "var(--secondary-dark)",
  accentColor = "var(--primary)",
  fontSize = "clamp(2rem, 5vw, 4rem)",
  imageWidth = 320,
  imageHeight = 420,
  rounded = 20,
  offsetX = 200,
  offsetY = -50,
  followStrength = 3,
  transition = DEFAULT_TRANSITION,
}: HoverImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const stiffness = 60 + followStrength * 5;
  const x = useSpring(rawX, { stiffness, damping: 28, mass: 0.5 });
  const y = useSpring(rawY, { stiffness, damping: 28, mass: 0.5 });

  const anyActive = hovered != null;

  const onMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set(e.clientX - rect.left + offsetX);
    rawY.set(e.clientY - rect.top + offsetY);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={() => setHovered(null)}
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "12px",
        padding: "24px 0",
        cursor: "default",
      }}
    >
      {/* Floating image */}
      <motion.div
        className="hidden md:block"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          width: imageWidth,
          height: imageHeight,
          borderRadius: rounded,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 2,
          boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
        }}
        animate={{ opacity: anyActive ? 1 : 0 }}
        transition={transition}
      >
        {items.map((item, i) => {
          const yPos = hovered == null ? "100%" : i < hovered ? "-100%" : i > hovered ? "100%" : "0%";
          return (
            <motion.div
              key={i}
              initial={false}
              animate={{ y: yPos }}
              transition={transition}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "hidden" }}
            >
              <img
                src={item.image}
                alt={item.text}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Text items */}
      <div
        onMouseLeave={() => setHovered(null)}
        style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px", width: "100%" }}
      >
        {items.map((item, i) => {
          const isHovered = hovered === i;
          const color = anyActive ? (isHovered ? accentColor : dimColor) : textColor;
          const textStyle: CSSProperties = {
            display: "block",
            color,
            transition: "color 0.25s ease",
            whiteSpace: "pre",
            fontFamily: "var(--font-heading), serif",
            fontSize,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          };

          const inner = (
            <motion.div
              style={{ position: "relative" }}
              animate={{ y: isHovered ? "-100%" : "0%" }}
              transition={transition}
            >
              <span style={textStyle}>{item.text}</span>
              <span aria-hidden style={{ ...textStyle, position: "absolute", top: "100%", left: 0, width: "100%" }}>{item.text}</span>
            </motion.div>
          );

          return (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              style={{ overflow: "hidden", cursor: item.link ? "pointer" : "default", padding: "8px 0" }}
            >
              {item.link ? (
                <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>{inner}</a>
              ) : (
                inner
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
