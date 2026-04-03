import { motion } from "framer-motion";
import { Target, Eye, Lightbulb, Users, Layers, Handshake } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const reasons = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To design, develop, and deliver cutting-edge technology solutions that empower businesses and drive sustainable growth.",
    position: "left-top",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description: "To be a leading force in global digital transformation by building future-ready technology that connects people.",
    position: "left-middle",
  },
  {
    icon: Lightbulb,
    title: "Creative Minds",
    description: "Business partnership is one of the best ways to expand your business through innovative thinking.",
    position: "left-bottom",
  },
  {
    icon: Users,
    title: "Collaborative Culture",
    description: "We believe the best products are built together. At YetiBytes, you're not just a client — you're a co-creator.",
    position: "right-top",
  },
  {
    icon: Layers,
    title: "Scalable Solutions",
    description: "We build with the future in mind — solutions that grow as your business grows, without compromise.",
    position: "right-middle",
  },
  {
    icon: Handshake,
    title: "Reliable Partnership",
    description: "Building lasting partnerships through trust, transparency, and consistent delivery of excellence.",
    position: "right-bottom",
  },
];

const WhyChooseUs = () => {
  const leftReasons = reasons.filter(r => r.position.includes('left'));
  const rightReasons = reasons.filter(r => r.position.includes('right'));

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/30" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <AnimatedSection className="text-center mb-12 md:mb-16">
          <span className="text-primary font-medium mb-4 block text-sm sm:text-base">Why YetiBytes</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
            Built For You, With You
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-3xl mx-auto">
            YetiBytes is the ultimate destination for tailored solutions that perfectly meet your business needs.
          </p>
        </AnimatedSection>

        <div className="relative max-w-6xl mx-auto">
          {/* Grid Layout */}
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8 items-center">
            {/* Left Column */}
            <div className="space-y-6">
              {leftReasons.map((reason, index) => (
                <AnimatedSection key={reason.title} delay={index * 0.1}>
                  <motion.div 
                    className="group"
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start gap-4 lg:text-right lg:flex-row-reverse">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <reason.icon className="text-primary" size={22} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-lg sm:text-xl font-semibold text-primary mb-1 sm:mb-2 group-hover:text-accent transition-colors">
                          {reason.title}
                        </h3>
                        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                          {reason.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>

            {/* Center Circle - Hidden on mobile, shown on lg */}
            <AnimatedSection delay={0.3} className="hidden lg:flex items-center justify-center py-8 lg:py-0">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                {/* Outer Ring */}
                <div className="w-48 h-48 rounded-full border-4 border-dashed border-primary/20 flex items-center justify-center animate-[spin_30s_linear_infinite]">
                </div>
                
                {/* Inner Circle */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-muted to-card shadow-2xl border border-border flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-display font-bold text-2xl text-foreground">Why</p>
                    <p className="font-display font-bold text-2xl text-primary">Choose Us</p>
                  </div>
                </div>
                
                {/* Connecting dots */}
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                  <motion.div
                    key={angle}
                    className="absolute w-3 h-3 rounded-full bg-primary"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(96px)`,
                    }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </motion.div>
            </AnimatedSection>

            {/* Right Column */}
            <div className="space-y-6">
              {rightReasons.map((reason, index) => (
                <AnimatedSection key={reason.title} delay={0.4 + index * 0.1}>
                  <motion.div 
                    className="group"
                    whileHover={{ x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <reason.icon className="text-primary" size={22} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-lg sm:text-xl font-semibold text-primary mb-1 sm:mb-2 group-hover:text-accent transition-colors">
                          {reason.title}
                        </h3>
                        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                          {reason.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
