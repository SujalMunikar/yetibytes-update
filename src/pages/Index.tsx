import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Code2, Smartphone, Cloud, Palette, Zap, Shield, ChevronRight, Users, Award, Rocket } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import GlassCard from "@/components/ui/GlassCard";
import TiltCard from "@/components/ui/TiltCard";
import TestimonialsCarousel from "@/components/ui/TestimonialsCarousel";
import ClientsCarousel from "@/components/ui/ClientsCarousel";
import FloatingContactButton from "@/components/ui/FloatingContactButton";
import HeroScene3D from "@/components/ui/HeroScene3D";
import heroBg from "@/assets/hero-bg.jpg";
import servicesBg from "@/assets/services-bg.jpg";
import teamCollab from "@/assets/team-collab.jpg";
import clientSuccess from "@/assets/client-success.jpg";
import bgGeometricLight from "@/assets/bg-geometric-light.png";
import waveDecoration from "@/assets/wave-decoration.png";
const services = [
  {
    icon: Code2,
    title: "Website Development",
    description: "Custom web applications built with modern technologies for scalability and performance.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Smartphone,
    title: "Application Development",
    description: "Native and cross-platform mobile solutions that engage users on any device.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Beautiful, intuitive interfaces that create memorable user experiences.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Cloud,
    title: "Software Development",
    description: "Robust, scalable software solutions using the latest technologies.",
    color: "from-green-500 to-teal-500",
  },
  {
    icon: Zap,
    title: "Digital Marketing",
    description: "Strategic digital marketing to boost your brand visibility and reach.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "IT Consulting",
    description: "Expert guidance to help you make smart technology decisions.",
    color: "from-teal-500 to-purple-500",
  },
];

const stats = [
  { value: "150+", label: "Projects Delivered" },
  { value: "50+", label: "Happy Clients" },
  { value: "10+", label: "Years Experience" },
  { value: "25+", label: "Team Members" },
];

const fallbackTestimonials = [
  {
    quote: "YetiBytes transformed our digital presence completely. Their attention to detail and technical expertise is unmatched.",
    author: "Rajesh Sharma",
    role: "CEO, TechStartup Nepal",
    rating: 5,
  },
  {
    quote: "Working with YetiBytes was a game-changer for our business. They delivered beyond our expectations.",
    author: "Priya Thapa",
    role: "Founder, E-Commerce Plus",
    rating: 5,
  },
  {
    quote: "Professional, innovative, and always on time. YetiBytes is our go-to partner for all tech projects.",
    author: "Sunil Gurung",
    role: "CTO, FinanceApp",
    rating: 5,
  },
];

const Index = () => {
  const { data: dbTestimonials } = useQuery({
    queryKey: ["homepage-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: true })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  const testimonials = dbTestimonials && dbTestimonials.length > 0
    ? dbTestimonials.map(t => ({
        quote: t.quote,
        author: t.name,
        role: t.company ? `${t.role}, ${t.company}` : t.role,
        rating: t.rating || 5,
        image: t.image_url,
      }))
    : fallbackTestimonials;

  return (
    <main className="overflow-hidden">
      {/* Floating Contact Button */}
      <FloatingContactButton />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-background/75" />
        
        {/* 3D Scene */}
        <HeroScene3D />
        
        {/* Animated Glow Effects */}
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] opacity-30 animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="container mx-auto px-6 relative z-10 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-sm font-semibold text-primary mb-6 border border-primary/20 shadow-lg shadow-primary/5">
                <Rocket size={16} />
                Nepal's Premier IT Partner
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight overflow-hidden"
            >
              {/* Animated words - first line */}
              <span className="inline-block overflow-hidden">
                {"Innovative IT Solutions.".split(" ").map((word, index) => (
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
              </span>{" "}
              <span className="text-gradient relative inline-block overflow-hidden">
                {"Real Business Impact.".split(" ").map((word, index) => (
                  <motion.span
                    key={index}
                    className="inline-block mr-[0.25em]"
                    initial={{ y: 80, opacity: 0, rotateX: -90 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 12,
                      delay: 0.4 + index * 0.12,
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full origin-left"
                />
              </span>
              {/* Typing Cursor */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{
                  delay: 1.2,
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 0,
                  times: [0, 0.1, 0.5, 0.6],
                }}
                className="inline-block w-[3px] sm:w-1 h-[0.9em] bg-primary ml-1 align-middle rounded-sm"
              />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              At YetiBytes, we empower businesses with smart, scalable, and secure IT solutions. 
              From custom software development to digital strategy — we turn technology into your competitive edge.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button variant="hero" asChild>
                <Link to="/contact">
                  Start Your Project
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button variant="heroOutline" asChild>
                <Link to="/portfolio">
                  View Our Work
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
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
        </div>
        
        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        {/* Geometric Background for Light Mode */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-0 transition-opacity duration-500"
          style={{ backgroundImage: `url(${bgGeometricLight})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8" style={{ perspective: "1000px" }}>
            {stats.map((stat, index) => (
              <AnimatedSection key={stat.label} delay={index * 0.1}>
                <motion.div 
                  className="text-center p-6 rounded-2xl hover:bg-primary/5 transition-all duration-300 cursor-default hover-3d"
                  whileHover={{ scale: 1.05, z: 20 }}
                >
                  <motion.span
                    className="block font-display text-4xl md:text-5xl font-bold text-gradient mb-2"
                  >
                    {stat.value}
                  </motion.span>
                  <span className="text-muted-foreground">{stat.label}</span>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Wave Decoration Divider */}
      <div className="relative h-40 -mb-10 overflow-hidden flex flex-col items-center justify-center">
        {/* Animated Text */}
        <motion.div
          className="relative z-10 text-center mb-4"
          initial={{ y: -50, opacity: 0, scale: 0.8 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ 
            type: "spring",
            stiffness: 120,
            damping: 14,
            mass: 0.6
          }}
        >
          <motion.span 
            className="text-sm font-medium text-primary/80 tracking-widest uppercase"
            initial={{ letterSpacing: "0.5em", opacity: 0 }}
            whileInView={{ letterSpacing: "0.2em", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Trusted By Industry Leaders
          </motion.span>
        </motion.div>
        
        <motion.img 
          src={waveDecoration} 
          alt="" 
          className="absolute bottom-0 left-0 w-full h-auto opacity-40 dark:opacity-20"
          initial={{ y: -80, opacity: 0, scaleY: 0.5 }}
          whileInView={{ y: 0, opacity: 0.4, scaleY: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 12,
            mass: 0.8,
            duration: 0.8
          }}
        />
        <motion.img 
          src={waveDecoration} 
          alt="" 
          className="absolute bottom-1 left-[3%] w-full h-auto opacity-20 dark:opacity-10 blur-[2px]"
          initial={{ y: -100, opacity: 0, scaleY: 0.3 }}
          whileInView={{ y: 0, opacity: 0.2, scaleY: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ 
            type: "spring",
            stiffness: 80,
            damping: 10,
            mass: 1,
            delay: 0.15
          }}
        />
        <motion.img 
          src={waveDecoration} 
          alt="" 
          className="absolute bottom-2 left-[-2%] w-full h-auto opacity-10 dark:opacity-5 blur-[4px] scale-105"
          initial={{ y: -120, opacity: 0, scaleY: 0.2 }}
          whileInView={{ y: 0, opacity: 0.1, scaleY: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ 
            type: "spring",
            stiffness: 60,
            damping: 8,
            mass: 1.2,
            delay: 0.3
          }}
        />
      </div>

      {/* Clients/Partners Carousel */}
      <section className="py-16 relative">
        <div className="container mx-auto px-6">
          <AnimatedSection className="text-center mb-8">
            <span className="text-primary font-medium mb-4 block">Trusted By</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Our Partners & Clients
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're proud to work with innovative companies across industries
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <ClientsCarousel />
          </AnimatedSection>
        </div>
      </section>

      {/* Services Section with Background Image */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-10"
          style={{ backgroundImage: `url(${servicesBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        
        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <span className="text-primary font-medium mb-4 block">What We Do</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Our Services
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We offer comprehensive digital solutions tailored to your business needs
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: "1200px" }}>
            {services.map((service, index) => (
              <AnimatedSection key={service.title} delay={index * 0.1}>
                <TiltCard className="h-full group/card" tiltIntensity={10}>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 group-hover/card:scale-110 group-hover/card:shadow-lg transition-all duration-300`}>
                    <service.icon className="text-white" size={28} />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3 group-hover/card:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1 text-primary font-medium hover:gap-3 transition-all duration-300"
                  >
                    Learn More <ChevronRight size={16} className="group-hover/card:translate-x-1 transition-transform" />
                  </Link>
                </TiltCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - With Team Image */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <span className="text-primary font-medium mb-4 block">Why YetiBytes</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Your Success is Our Mission
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                We combine technical expertise with creative innovation to deliver 
                solutions that exceed expectations. Our team is dedicated to turning 
                your vision into reality.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: Users, text: "Expert Team with 10+ Years Experience" },
                  { icon: Award, text: "Award-Winning Design & Development" },
                  { icon: Zap, text: "Agile Methodology for Fast Delivery" },
                  { icon: Shield, text: "Enterprise-Grade Security Standards" },
                ].map((item, index) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 transition-all duration-300 cursor-default"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <item.icon className="text-primary" size={20} />
                    </div>
                    <span className="text-foreground font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10">
                <Button variant="default" size="lg" asChild className="group">
                  <Link to="/about">
                    Learn More About Us
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="relative" style={{ perspective: "1200px" }}>
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl opacity-50" />
                <motion.div 
                  className="relative rounded-3xl overflow-hidden shadow-2xl"
                  whileHover={{ 
                    scale: 1.02,
                    rotateY: -3,
                    rotateX: 2,
                  }}
                  transition={{ duration: 0.4 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <img 
                    src={teamCollab} 
                    alt="YetiBytes Team Collaboration" 
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6" style={{ transform: "translateZ(40px)" }}>
                    <div className="glass-card rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground">Collaborative Team</p>
                          <p className="text-sm text-muted-foreground">Working together for your success</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <Users className="text-primary" size={24} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Image Banner Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div style={{ perspective: "1200px" }}>
              <motion.div 
                className="relative rounded-3xl overflow-hidden h-[300px] md:h-[400px]"
                whileHover={{ scale: 1.01, rotateY: -2, rotateX: 1 }}
                transition={{ duration: 0.4 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <img 
                  src={clientSuccess} 
                  alt="Client Success Partnership" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
                <div className="absolute inset-0 flex items-center" style={{ transform: "translateZ(30px)" }}>
                  <div className="px-8 md:px-16 max-w-2xl">
                    <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">
                      Building <span className="text-gradient">Lasting Partnerships</span>
                    </h3>
                    <p className="text-muted-foreground text-lg mb-6">
                      We don't just deliver projects — we build relationships that drive long-term success for your business.
                    </p>
                    <Button variant="hero" asChild className="group">
                      <Link to="/contact">
                        Partner With Us
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative overflow-hidden">
        {/* Geometric Background for Light Mode */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 dark:opacity-0 transition-opacity duration-500"
          style={{ backgroundImage: `url(${bgGeometricLight})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <span className="text-primary font-medium mb-4 block">Testimonials</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              What Our Clients Say
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Don't just take our word for it — hear from the businesses we've helped transform
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <TestimonialsCarousel testimonials={testimonials} autoplayDelay={4000} />
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-glow opacity-30" />
        
        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your{" "}
              <span className="text-gradient">Digital Presence</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Let's discuss how we can help you achieve your business goals with 
              cutting-edge technology solutions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" asChild className="group">
                <Link to="/contact">
                  Get a Free Consultation
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="heroOutline" asChild className="group">
                <Link to="/portfolio">
                  Explore Our Work
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
};

export default Index;