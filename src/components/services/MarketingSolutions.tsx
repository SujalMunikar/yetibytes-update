import { motion } from "framer-motion";
import { Share2, Megaphone, Video, Search } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const solutions = [
  {
    step: "01",
    icon: Share2,
    title: "Social Media Marketing",
    description: "We create engaging social media content to captivate your audience and drive traffic to your site across all platforms.",
    color: "bg-green-500",
  },
  {
    step: "02",
    icon: Megaphone,
    title: "Mobile App Marketing",
    description: "Our mobile app marketing ensures your app stands out in app stores with compelling descriptions and visuals.",
    color: "bg-teal-500",
  },
  {
    step: "03",
    icon: Video,
    title: "Video Marketing",
    description: "Capturing your audience's attention with comprehensive video advertising services and green advertising strategies.",
    color: "bg-purple-500",
  },
  {
    step: "04",
    icon: Search,
    title: "Local SEO Services",
    description: "Boost your local business presence with our SEO services. We improve visibility in local search results.",
    color: "bg-teal-500",
  },
];

const MarketingSolutions = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <span className="text-primary font-medium mb-4 block">Digital Marketing</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Customized Digital Marketing Solutions
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Our role as a top digital agency has been solidified by consistently delivering superior results for our clients.
          </p>
        </AnimatedSection>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-[60px] left-0 right-0 h-[2px] border-t-2 border-dashed border-primary/30" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solutions.map((solution, index) => (
              <AnimatedSection key={solution.title} delay={index * 0.1}>
                <motion.div 
                  className="relative flex flex-col items-center"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Icon */}
                  <motion.div 
                    className="w-16 h-16 rounded-xl bg-card border border-border flex items-center justify-center mb-4 shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <solution.icon className="text-primary" size={28} />
                  </motion.div>
                  
                  {/* Step Number Circle */}
                  <div className="relative z-10 w-8 h-8 rounded-full bg-primary flex items-center justify-center mb-2 ring-4 ring-background">
                    <span className="text-xs font-bold text-primary-foreground">{index + 1}</span>
                  </div>
                  
                  {/* Step Label */}
                  <span className="font-display text-3xl font-bold text-primary mb-4">{solution.step}</span>
                  
                  {/* Card with Arrow */}
                  <div className="relative w-full">
                    {/* Arrow pointing up */}
                    <div 
                      className={`absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[12px] border-transparent`}
                      style={{ borderBottomColor: `hsl(var(--${solution.color === 'bg-green-500' ? 'primary' : solution.color === 'bg-teal-500' ? 'accent' : solution.color === 'bg-purple-500' ? 'primary' : 'accent'}))` }}
                    />
                    
                    {/* Card */}
                    <div className={`${solution.color} rounded-xl p-6 text-white min-h-[180px]`}>
                      <h3 className="font-display text-xl font-semibold mb-3 text-center">
                        {solution.title}
                      </h3>
                      <p className="text-white/90 text-sm text-center leading-relaxed">
                        {solution.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingSolutions;
