import { motion } from "framer-motion";
import { Search, Lightbulb, Rocket, BarChart3 } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const steps = [
  {
    icon: Search,
    title: "Research",
    description: "We conduct in-depth research on your market and competitors, gaining insights into consumer behavior, local search trends, and industry-specific keywords to tailor our strategies.",
    position: "left",
    color: "from-emerald-400 to-green-500",
  },
  {
    icon: Lightbulb,
    title: "Strategy",
    description: "We develop custom digital strategies to maximize your online presence and effectively connect with your target audience using various digital marketing techniques.",
    position: "right",
    color: "from-green-500 to-teal-500",
  },
  {
    icon: Rocket,
    title: "Execution",
    description: "Our digital marketing experts focus on your objectives and expectations, strategically working to improve rankings, visitor numbers, and conversions.",
    position: "left",
    color: "from-teal-500 to-purple-500",
  },
  {
    icon: BarChart3,
    title: "Tracking",
    description: "We prioritize tracking and monitoring the effectiveness of our marketing campaigns, continuously adjusting our tactics to seize opportunities and refine our efforts.",
    position: "right",
    color: "from-purple-500 to-pink-500",
  },
];

const ProcessFlow = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <AnimatedSection className="text-center mb-12 md:mb-20">
          <span className="text-primary font-medium mb-4 block text-sm sm:text-base">Our Approach</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
            How We Deliver Results
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto">
            A systematic approach to digital success through research, strategy, execution, and continuous optimization.
          </p>
        </AnimatedSection>

        {/* Connected Flow */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Connection Line - only on md+ */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 via-green-500 via-purple-500 to-pink-500 -translate-x-1/2 rounded-full" />
          
          {/* Mobile vertical line */}
          <div className="md:hidden absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-400 via-green-500 via-purple-500 to-pink-500 rounded-full" />
          
          <div className="space-y-6 md:space-y-0">
            {steps.map((step, index) => (
              <AnimatedSection 
                key={step.title} 
                delay={index * 0.15}
                className={`relative md:flex items-center ${step.position === 'right' ? 'md:flex-row-reverse' : ''} md:min-h-[180px]`}
              >
                {/* Content Card */}
                <motion.div 
                  className={`flex-1 pl-14 md:pl-0 ${step.position === 'right' ? 'md:text-left md:pl-8' : 'md:text-right md:pr-8'}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`glass-card rounded-2xl p-5 sm:p-6 border border-border/50 hover:border-primary/30 transition-colors inline-block ${step.position === 'right' ? '' : 'md:ml-auto'}`}>
                    <h3 className="font-display text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm max-w-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>

                {/* Center Circle - Desktop */}
                <motion.div 
                  className="hidden md:block relative z-10 mx-auto md:mx-0 my-4 md:my-0"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} p-1 shadow-xl`}>
                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                      <step.icon className="text-primary" size={28} />
                    </div>
                  </div>
                </motion.div>

                {/* Mobile Circle - left aligned */}
                <motion.div 
                  className="md:hidden absolute left-0 top-4 z-10"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.color} p-0.5 shadow-lg`}>
                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                      <step.icon className="text-primary" size={18} />
                    </div>
                  </div>
                </motion.div>

                {/* Spacer for the other side */}
                <div className="hidden md:block flex-1" />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessFlow;
