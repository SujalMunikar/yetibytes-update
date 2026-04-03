import { motion } from "framer-motion";
import { ReactNode } from "react";

type AnimationDirection = "up" | "down" | "left" | "right" | "fade";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: AnimationDirection;
  duration?: number;
}

const getInitialPosition = (direction: AnimationDirection) => {
  switch (direction) {
    case "down":
      return { opacity: 0, y: -50 };
    case "up":
      return { opacity: 0, y: 50 };
    case "left":
      return { opacity: 0, x: 50 };
    case "right":
      return { opacity: 0, x: -50 };
    case "fade":
    default:
      return { opacity: 0 };
  }
};

const AnimatedSection = ({ 
  children, 
  className = "", 
  delay = 0,
  direction = "down",
  duration = 0.7,
}: AnimatedSectionProps) => {
  return (
    <motion.div
      initial={getInitialPosition(direction)}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
