import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const GlassCard = ({ children, className = "", hover = true, onClick }: GlassCardProps) => {
  return (
    <motion.div
      whileHover={hover ? { y: -8, scale: 1.02 } : undefined}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
      className={cn(
        "glass-card rounded-2xl p-6 relative overflow-hidden group",
        onClick && "cursor-pointer",
        className
      )}
    >
      {/* Gradient border effect on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-[-1px] rounded-2xl bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 animate-gradient" />
        <div className="absolute inset-[1px] rounded-2xl bg-card" />
      </div>
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl pointer-events-none" />
      
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlassCard;
