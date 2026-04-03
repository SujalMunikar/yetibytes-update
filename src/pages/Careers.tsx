import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Clock, Briefcase, ArrowRight, Users, Heart, Zap, Coffee, GraduationCap, Globe, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import GlassCard from "@/components/ui/GlassCard";
import TiltCard from "@/components/ui/TiltCard";
import Scene3DBackground from "@/components/ui/Scene3DBackground";
import careersHero from "@/assets/careers-hero.jpg";
import careersTeam from "@/assets/careers-team.jpg";
import careersCulture from "@/assets/careers-culture.jpg";

const openPositions = [
  {
    id: 1,
    title: "Senior React Developer",
    department: "Engineering",
    location: "Nepal",
    type: "Full-time",
    description: "Build cutting-edge web applications with React and TypeScript.",
  },
  {
    id: 2,
    title: "UI/UX Designer",
    department: "Design",
    location: "Nepal",
    type: "Full-time",
    description: "Create beautiful, intuitive interfaces for our clients.",
  },
  {
    id: 3,
    title: "Mobile Developer (Flutter)",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Develop cross-platform mobile applications using Flutter.",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Nepal",
    type: "Full-time",
    description: "Manage cloud infrastructure and CI/CD pipelines.",
  },
  {
    id: 5,
    title: "Project Manager",
    department: "Operations",
    location: "Nepal",
    type: "Full-time",
    description: "Lead project teams and ensure successful delivery.",
  },
];

const benefits = [
  {
    icon: Users,
    title: "Collaborative Culture",
    description: "Work with talented professionals in a supportive and inclusive environment.",
  },
  {
    icon: Zap,
    title: "Growth Opportunities",
    description: "Continuous learning programs and clear career advancement paths.",
  },
  {
    icon: Heart,
    title: "Health Benefits",
    description: "Comprehensive health insurance coverage for you and your family.",
  },
  {
    icon: Coffee,
    title: "Flexible Work",
    description: "Remote-friendly policies with flexible working hours.",
  },
  {
    icon: GraduationCap,
    title: "Learning Budget",
    description: "Annual budget for courses, certifications, and conferences.",
  },
  {
    icon: Globe,
    title: "Global Projects",
    description: "Work on exciting projects for clients around the world.",
  },
];

const values = [
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for excellence in everything we do.",
  },
  {
    icon: Users,
    title: "Teamwork",
    description: "Together we achieve more than we ever could alone.",
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description: "We embrace new ideas and creative solutions.",
  },
];

const Careers = () => {
  return (
    <main className="overflow-hidden">
      {/* Hero Section with Full Background */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${careersHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        
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
        
        <div className="container mx-auto px-6 relative z-10 pt-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-sm font-semibold text-primary mb-6 border border-primary/20 shadow-lg shadow-primary/5">
                <Sparkles size={16} />
                We're Hiring
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight"
            >
              Build the Future{" "}
              <span className="text-gradient relative">
                With Us
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full"
                />
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Join a team of passionate innovators working on exciting projects for global clients. 
              Shape the future of technology with YetiBytes.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button variant="hero" size="lg" asChild>
                <a href="#positions">
                  View Open Positions
                  <ArrowRight size={18} />
                </a>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/about">
                  Learn About Us
                </Link>
              </Button>
            </motion.div>
          </div>
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
        
        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* Our Culture Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <span className="text-primary font-medium mb-4 block">Our Culture</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                More Than Just a <span className="text-gradient">Workplace</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                At YetiBytes, we believe that great work comes from happy, inspired people. 
                We've built a culture that celebrates creativity, encourages growth, and values 
                every team member's contribution.
              </p>
              
              <div className="space-y-6">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <value.icon className="text-primary" size={24} />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-lg mb-1">{value.title}</h4>
                      <p className="text-muted-foreground">{value.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="relative" style={{ perspective: "1200px" }}>
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-3xl opacity-50" />
                <motion.div 
                  className="relative rounded-3xl overflow-hidden"
                  whileHover={{ rotateY: -4, rotateX: 2, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <img 
                    src={careersCulture} 
                    alt="YetiBytes team culture" 
                    className="w-full h-auto object-cover rounded-3xl"
                  />
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="text-primary font-medium mb-4 block">Why Join Us</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Benefits & Perks
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We take care of our team with comprehensive benefits designed to support your 
              professional growth and personal well-being.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: "1200px" }}>
            {benefits.map((benefit, index) => (
              <AnimatedSection key={benefit.title} delay={index * 0.1}>
                <TiltCard className="h-full" tiltIntensity={10}>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <benefit.icon className="text-primary" size={28} />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </TiltCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team Image Section */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="relative rounded-3xl overflow-hidden">
              <img 
                src={careersTeam} 
                alt="YetiBytes team collaboration" 
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="max-w-2xl">
                  <h3 className="font-display text-3xl font-bold mb-3">Collaborate & Create</h3>
                  <p className="text-muted-foreground text-lg">
                    Work alongside talented individuals who share your passion for innovation and excellence.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="py-24 relative scroll-mt-24">
        <div className="container mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="text-primary font-medium mb-4 block">Open Positions</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Current Opportunities
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're always looking for talented individuals to join our growing team. 
              Find your next career opportunity below.
            </p>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto space-y-4">
            {openPositions.map((position, index) => (
              <AnimatedSection key={position.id} delay={index * 0.1}>
                <motion.div
                  whileHover={{ x: 8, scale: 1.01 }}
                  className="glass-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                          {position.department}
                        </span>
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-muted-foreground">
                          {position.type}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-semibold mb-2">{position.title}</h3>
                      <p className="text-muted-foreground mb-4">{position.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <MapPin size={16} className="text-primary" /> {position.location}
                        </span>
                        <span className="flex items-center gap-2">
                          <Briefcase size={16} className="text-primary" /> {position.department}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button variant="default" asChild>
                        <Link to="/contact">
                          Apply Now <ArrowRight size={16} />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-glow opacity-30" />
        
        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Don't See a <span className="text-gradient">Perfect Fit</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              We're always interested in hearing from talented people. Send us your resume 
              and tell us how you can contribute to our team.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" asChild>
                <Link to="/contact">
                  Get in Touch
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button variant="heroOutline" asChild>
                <a href="mailto:yetibytes8@gmail.com">
                  Send Your Resume
                </a>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
};

export default Careers;