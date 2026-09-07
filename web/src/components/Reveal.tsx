"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  y?: number;
}

/**
 * Scroll-reveal wrapper.
 *
 * IMPORTANT: `useReducedMotion()` returns false during SSR but may return true
 * on the client. To avoid a hydration mismatch, the rendered element type and
 * its `initial` (which motion serializes to inline style) must NOT depend on
 * the reduced-motion flag — only the non-serialized `transition` does. Reduced
 * motion therefore collapses the reveal to an instant appearance.
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }
      }
      {...rest}
    >
      {children}
    </motion.div>
  );
}
