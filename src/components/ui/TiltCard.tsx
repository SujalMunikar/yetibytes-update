import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltIntensity?: number;
  glareEnabled?: boolean;
  perspective?: number;
}

const TiltCard = ({ 
  children, 
  className = "", 
  tiltIntensity = 15,
  glareEnabled = true,
  perspective = 1000,
}: TiltCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [tiltIntensity, -tiltIntensity]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-tiltIntensity, tiltIntensity]), springConfig);
  
  const glareX = useTransform(mouseX, [0, 1], ["-100%", "200%"]);
  const glareY = useTransform(mouseY, [0, 1], ["-100%", "200%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective,
        transformStyle: "preserve-3d",
      }}
      className="relative"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "glass-card rounded-2xl p-6 relative overflow-hidden transition-shadow duration-300 hover:shadow-[var(--shadow-glow)]",
          className
        )}
      >
        {/* Glare effect */}
        {glareEnabled && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-20 rounded-2xl"
            style={{
              background: `radial-gradient(circle at ${glareX} ${glareY}, hsl(var(--primary) / 0.1) 0%, transparent 60%)`,
            }}
          />
        )}
        
        {/* Gradient border on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-[-1px] rounded-2xl bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30" />
          <div className="absolute inset-[1px] rounded-2xl bg-card" />
        </div>
        
        <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TiltCard;
