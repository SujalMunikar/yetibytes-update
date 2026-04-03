import { motion } from "framer-motion";
import { Globe, Target, DollarSign, Accessibility, CheckCircle } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const benefits = [
  { icon: Globe, label: "Global Reach", color: "from-green-500 to-emerald-500" },
  { icon: Target, label: "Targeted Advertising", color: "from-green-600 to-green-400" },
  { icon: DollarSign, label: "Cost-Effective", color: "from-teal-500 to-emerald-500" },
  { icon: Accessibility, label: "Accessibility", color: "from-teal-500 to-purple-500" },
];

const features = [
  { title: "SEO & Analytics", description: "Drive traffic and track performance with real-time analytics." },
  { title: "Social Media Growth", description: "Engage users and grow your brand across social platforms." },
];

const MarketingBenefits = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-muted/30 via-background to-muted/30" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <AnimatedSection>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-primary">
              Digital Marketing
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Boost your brand's online presence with our comprehensive digital marketing strategies. 
              From SEO and PPC to social media management, we help you connect with your audience.
            </p>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div 
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="text-primary" size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          {/* Right Content - Radial Layout */}
          <AnimatedSection delay={0.2}>
            <div className="relative flex items-center justify-center min-h-[400px]">
              {/* Center Circle */}
              <motion.div 
                className="relative z-10 w-36 h-36 rounded-full bg-gradient-to-br from-muted to-card shadow-2xl flex items-center justify-center border border-border"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center">
                  <p className="font-display font-semibold text-sm text-muted-foreground">Benefits of</p>
                  <p className="font-display font-bold text-lg text-foreground">Digital</p>
                  <p className="font-display font-bold text-lg text-foreground">Marketing</p>
                </div>
              </motion.div>

              {/* Connecting Lines and Benefits */}
              {benefits.map((benefit, index) => {
                const angle = -45 + index * 30; // Spread on the right side
                const radius = 160;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;

                return (
                  <motion.div
                    key={benefit.label}
                    className="absolute flex items-center"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                  >
                    {/* Connecting Line (SVG would be ideal, using pseudo-element approach) */}
                    <div className="absolute w-16 h-[2px] bg-gradient-to-r from-border to-primary/30 -left-16 top-1/2 -translate-y-1/2" 
                      style={{ 
                        transform: `translateY(-50%) rotate(${angle}deg)`,
                        transformOrigin: 'right center'
                      }}
                    />
                    
                    {/* Icon Circle */}
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      <benefit.icon className="text-foreground" size={20} />
                    </motion.div>
                    
                    {/* Label Pill */}
                    <motion.div 
                      className={`ml-2 px-4 py-2 rounded-full bg-gradient-to-r ${benefit.color} text-white font-medium text-sm shadow-lg`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {benefit.label}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default MarketingBenefits;
