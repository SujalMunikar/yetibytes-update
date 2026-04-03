import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, 
  Smartphone, 
  Megaphone, 
  Settings, 
  Palette,
  CheckCircle
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import serviceWebDev from "@/assets/service-web-dev.jpg";
import serviceMobile from "@/assets/service-mobile.jpg";

const services = [
  {
    id: "web",
    icon: Code2,
    label: "Web Development",
    title: "Website Development",
    description: "YetiBytes Tech is Nepal's emerging web development company, known for delivering custom web solutions that fuel business growth. We specialize in designing and developing high-quality websites and web applications that stand out in today's digital world.",
    features: [
      {
        title: "Get Effective Consultancy",
        description: "A well laid out process spanning the entire development life cycle."
      },
      {
        title: "Get Eye Catching Content",
        description: "Efficient use of client side scripting for enhanced user interactivity."
      },
      {
        title: "Modern Technologies",
        description: "Built with React, Next.js, and other cutting-edge frameworks."
      }
    ],
    image: serviceWebDev
  },
  {
    id: "mobile",
    icon: Smartphone,
    label: "Mobile App Development",
    title: "Mobile App Development",
    description: "We create stunning native and cross-platform mobile applications for iOS and Android. Our team delivers seamless user experiences with performance-optimized apps that engage users and drive business results.",
    features: [
      {
        title: "Cross-Platform Solutions",
        description: "Build once, deploy everywhere with React Native and Flutter."
      },
      {
        title: "Native Performance",
        description: "Optimized apps that run smoothly on all devices."
      },
      {
        title: "User-Centric Design",
        description: "Intuitive interfaces designed for maximum engagement."
      }
    ],
    image: serviceMobile
  },
  {
    id: "marketing",
    icon: Megaphone,
    label: "Digital Marketing",
    title: "Digital Marketing",
    description: "Boost your online presence with our comprehensive digital marketing services. We create data-driven strategies that increase visibility, drive traffic, and convert visitors into loyal customers.",
    features: [
      {
        title: "SEO Optimization",
        description: "Rank higher in search results with proven SEO strategies."
      },
      {
        title: "Social Media Marketing",
        description: "Engage your audience across all major platforms."
      },
      {
        title: "Analytics & Insights",
        description: "Data-driven decisions for continuous improvement."
      }
    ],
    image: serviceWebDev
  },
  {
    id: "software",
    icon: Settings,
    label: "Software Development",
    title: "Software Development",
    description: "Custom software solutions tailored to your unique business needs. From enterprise applications to specialized tools, we build robust, scalable software that streamlines operations and drives efficiency.",
    features: [
      {
        title: "Custom Solutions",
        description: "Tailored software designed for your specific requirements."
      },
      {
        title: "Scalable Architecture",
        description: "Built to grow with your business needs."
      },
      {
        title: "Ongoing Support",
        description: "Continuous maintenance and updates to keep you running smoothly."
      }
    ],
    image: serviceMobile
  },
  {
    id: "design",
    icon: Palette,
    label: "UI/UX Design",
    title: "UI/UX Design",
    description: "Create memorable digital experiences with our expert UI/UX design services. We combine aesthetics with functionality to deliver interfaces that users love and that drive business success.",
    features: [
      {
        title: "User Research",
        description: "Deep understanding of your target audience's needs."
      },
      {
        title: "Prototyping & Testing",
        description: "Iterative design process for optimal user experience."
      },
      {
        title: "Design Systems",
        description: "Consistent, scalable design components for your brand."
      }
    ],
    image: serviceWebDev
  }
];

const FeaturedServices = () => {
  const [activeService, setActiveService] = useState(services[0]);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <AnimatedSection className="text-center mb-10 md:mb-12">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
            FEATURED SERVICES
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Our versatile teams bring outstanding web solutions to life by seamlessly integrating design, development, and promotion.
          </p>
        </AnimatedSection>

        {/* Service Tabs - Scrollable on mobile */}
        <div className="flex overflow-x-auto scrollbar-hide gap-2 sm:gap-3 mb-10 md:mb-12 pb-2 sm:flex-wrap sm:justify-center">
          {services.map((service) => {
            const isActive = activeService.id === service.id;
            return (
              <motion.button
                key={service.id}
                onClick={() => setActiveService(service)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-300 border whitespace-nowrap text-sm sm:text-base flex-shrink-0 ${
                  isActive 
                    ? "bg-primary text-primary-foreground border-primary shadow-lg" 
                    : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-muted"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <service.icon size={18} />
                <span>{service.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeService.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center"
          >
            {/* Left Content */}
            <div className="order-2 lg:order-1">
              <motion.h3 
                className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 md:mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {activeService.title}
              </motion.h3>
              
              <motion.p 
                className="text-muted-foreground leading-relaxed mb-6 md:mb-8 text-sm sm:text-base"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {activeService.description}
              </motion.p>

              {/* Features */}
              <div className="space-y-4 md:space-y-6">
                {activeService.features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex gap-3"
                  >
                    <CheckCircle className="text-primary flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <h4 className="font-semibold text-primary mb-1 text-sm sm:text-base">
                        {feature.title}
                      </h4>
                      <p className="text-muted-foreground text-xs sm:text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <motion.div 
              className="order-1 lg:order-2 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={activeService.image} 
                  alt={activeService.title}
                  className="w-full h-[220px] sm:h-[300px] md:h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
              
              {/* Decorative elements - hidden on small mobile */}
              <motion.div 
                className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl hidden sm:block"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div 
                className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl hidden sm:block"
                animate={{ scale: [1.2, 1, 1.2] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FeaturedServices;
