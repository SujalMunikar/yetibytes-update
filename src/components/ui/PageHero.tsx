import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";
import Scene3DBackground from "./Scene3DBackground";
interface PageHeroProps {
  badge?: string;
  badgeIcon?: ReactNode;
  title: string;
  titleHighlight?: string;
  description: string;
  backgroundImage?: string;
  children?: ReactNode;
  fullHeight?: boolean;
  showScrollIndicator?: boolean;
}

const PageHero = ({
  badge,
  badgeIcon,
  title,
  titleHighlight,
  description,
  backgroundImage,
  children,
  fullHeight = false,
  showScrollIndicator = false,
}: PageHeroProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax effect - background moves slower than scroll
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden ${
        fullHeight ? "min-h-screen flex items-center justify-center" : "py-24 md:py-32"
      }`}
    >
      {/* Background Image with Parallax */}
      {backgroundImage && (
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            y: backgroundY,
            scale: backgroundScale,
          }}
        />
      )}
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 ${backgroundImage ? 'bg-background/75' : ''}`} />
      
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      {/* 3D Background Scene */}
      <Scene3DBackground />
      
      {/* Animated Glow Effects */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-30 animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Floating Particles */}
      <motion.div
        animate={{ y: [-15, 15, -15], x: [-5, 5, -5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-[15%] w-3 h-3 rounded-full bg-primary/40"
      />
      <motion.div
        animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-1/3 left-[10%] w-2 h-2 rounded-full bg-primary/30"
      />
      <motion.div
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-[20%] w-4 h-4 rounded-full bg-accent/30"
      />
      <motion.div
        animate={{ y: [15, -15, 15], rotate: [0, 180, 360] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        className="absolute top-[40%] left-[20%] w-6 h-6 rounded-lg border border-primary/20 bg-primary/5"
      />
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [360, 180, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-[35%] right-[10%] w-8 h-8 rounded-xl border border-accent/20 bg-accent/5"
      />
      
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
                           linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <motion.div 
        style={{ opacity: contentOpacity, y: contentY }}
        className={`container mx-auto px-6 relative z-10 ${fullHeight ? 'pt-20' : ''}`}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-sm font-semibold text-primary mb-6 border border-primary/20 shadow-lg shadow-primary/5">
                {badgeIcon}
                {badge}
              </span>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight overflow-hidden"
          >
            {/* Animated words - main title */}
            <span className="inline-block overflow-hidden">
              {title.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  className="inline-block mr-[0.25em]"
                  initial={{ y: 80, opacity: 0, rotateX: -90 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 12,
                    delay: 0.1 + index * 0.1,
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
            {titleHighlight && (
              <>
                {" "}
                <span className="text-gradient relative inline-block overflow-hidden">
                  {titleHighlight.split(" ").map((word, index) => (
                    <motion.span
                      key={index}
                      className="inline-block mr-[0.25em]"
                      initial={{ y: 80, opacity: 0, rotateX: -90 }}
                      animate={{ y: 0, opacity: 1, rotateX: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 12,
                        delay: 0.3 + title.split(" ").length * 0.1 + index * 0.12,
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 + title.split(" ").length * 0.1 + (titleHighlight?.split(" ").length || 0) * 0.12 }}
                    className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full origin-left"
                  />
                </span>
              </>
            )}
            {/* Typing Cursor */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{
                delay: 1 + title.split(" ").length * 0.1 + (titleHighlight?.split(" ").length || 0) * 0.12,
                duration: 1,
                repeat: Infinity,
                repeatDelay: 0,
                times: [0, 0.1, 0.5, 0.6],
              }}
              className="inline-block w-[3px] sm:w-1 h-[0.9em] bg-primary ml-1 align-middle rounded-sm"
            />
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {description}
          </motion.p>

          {/* Children (CTA buttons, etc.) */}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-primary/40 flex items-start justify-center p-2 bg-background/30 backdrop-blur-sm"
          >
            <motion.div
              animate={{ height: ["20%", "60%", "20%"] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 bg-primary rounded-full"
            />
          </motion.div>
        </motion.div>
      )}

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default PageHero;
