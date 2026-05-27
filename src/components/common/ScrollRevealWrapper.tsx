"use client";

import { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface Props {
  children: ReactNode;
  className?: string;
  threshold?: number;
  as?: React.ElementType;
  ariaLabel?: string;
}

export default function ScrollRevealWrapper({ 
  children, 
  className = "", 
  threshold = 0.15, 
  as: Component = "div",
  ariaLabel
}: Props) {
  const { ref, isRevealed } = useScrollReveal({ threshold });
  
  return (
    <Component 
      ref={ref} 
      className={`${className} ${isRevealed ? "is-revealed" : ""}`}
      aria-label={ariaLabel}
    >
      {children}
    </Component>
  );
}
