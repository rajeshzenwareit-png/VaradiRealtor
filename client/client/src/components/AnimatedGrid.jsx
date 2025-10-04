// components/AnimatedGrid.jsx
import React from "react";
import { motion } from "framer-motion";

/** Direction-aware variants */
const fromLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
};
const fromRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

/**
 * AnimatedGrid
 * - Alternates left/right slide for each child
 * - Animates when each card enters the viewport
 * - Plays once (does not re-animate on scroll back)
 *
 * Usage:
 * <AnimatedGrid>
 *   {data.map((card, i) => <Card key={i} {...card} />)}
 * </AnimatedGrid>
 */
export default function AnimatedGrid({ children, className = "" }) {
  const kids = React.Children.toArray(children);

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {kids.map((child, idx) => {
        const dir = idx % 2 === 0 ? fromLeft : fromRight;
        return (
          <motion.div
            key={idx}
            variants={dir}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="will-change-transform"
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
}
