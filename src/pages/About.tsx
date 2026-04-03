import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Target, Award, Heart, ArrowRight, CheckCircle, MapPin, Building, Sparkles, Linkedin, Twitter, Github, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import GlassCard from "@/components/ui/GlassCard";
import TiltCard from "@/components/ui/TiltCard";
import PageHero from "@/components/ui/PageHero";
import Globe3D from "@/components/ui/Globe3D";
import aboutOffice from "@/assets/about-office.jpg";
import aboutTeam from "@/assets/about-team.jpg";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  github_url: string | null;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string | null;
  image_url: string | null;
  quote: string;
  rating: number;
}

const values = [
  {
    icon: Target,
    title: "Innovation First",
    description: "We embrace cutting-edge technologies to deliver future-proof solutions.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Users,
    title: "Client Success",
    description: "Your success is our priority. We go above and beyond to exceed expectations.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We maintain the highest standards in everything we create.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Heart,
    title: "Integrity",
    description: "Honest communication and transparent processes build lasting relationships.",
    color: "from-green-500 to-teal-500",
  },
];

const About = () => {
  const { data: teamMembers, isLoading: isLoadingTeam } = useQuery({
    queryKey: ["about-team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("id, name, role, bio, image_url, linkedin_url, twitter_url, github_url")
        .eq("published", true)
        .order("display_order", { ascending: true })
        .limit(4);
      if (error) throw error;
      return data as TeamMember[];
    },
  });

  const { data: testimonials, isLoading: isLoadingTestimonials } = useQuery({
    queryKey: ["about-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("id, name, role, company, image_url, quote, rating")
        .eq("published", true)
        .order("display_order", { ascending: true })
        .limit(6);
      if (error) throw error;
      return data as Testimonial[];
    },
  });

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <PageHero
        badge="About YetiBytes"
        badgeIcon={<Sparkles size={16} />}
        title="We're Building the"
        titleHighlight="Future of Tech"
        description="Founded in Nepal, YetiBytes is a leading software development company dedicated to transforming businesses through innovative digital solutions."
      />

      {/* Office Image Banner */}
      <section className="pb-16">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div style={{ perspective: "1200px" }}>
              <motion.div 
                className="relative rounded-3xl overflow-hidden h-[400px] group"
                whileHover={{ scale: 1.01, rotateY: -2, rotateX: 1 }}
                transition={{ duration: 0.4 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <img 
                  src={aboutOffice} 
                  alt="YetiBytes Headquarters in Nepal" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
                <div className="absolute inset-0 flex items-center" style={{ transform: "translateZ(30px)" }}>
                  <div className="px-8 md:px-16 max-w-xl">
                    <div className="glass-card rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building className="text-primary" size={20} />
                        </div>
                        <span className="text-primary font-medium">Our Headquarters</span>
                      </div>
                      <h3 className="font-display text-2xl font-bold mb-2">
                        Kathmandu, Nepal
                      </h3>
                      <p className="text-muted-foreground">
                        Where innovation meets the Himalayas. Our state-of-the-art office is the heart of YetiBytes.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <span className="text-primary font-medium mb-4 block">Our Story</span>
              <h2 className="font-display text-4xl font-bold mb-6">
                From Himalayan Roots to Global Reach
              </h2>
              <p className="text-muted-foreground mb-6">
                YetiBytes was founded with a vision to put Nepal on the global tech map. 
                What started as a small team of passionate developers has grown into a 
                full-service digital agency serving clients worldwide.
              </p>
              <p className="text-muted-foreground mb-6">
                Our name "YetiBytes" represents the fusion of our Himalayan heritage 
                with modern technology. Like the legendary Yeti, we're rare, powerful, 
                and leave a lasting impression.
              </p>
              <div className="space-y-3">
                {[
                  "10+ years of industry experience",
                  "150+ successful projects delivered",
                  "Clients across 15+ countries",
                  "Award-winning design team",
                ].map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-all duration-300 cursor-default"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                  >
                    <CheckCircle size={20} className="text-primary" />
                    <span className="text-foreground font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div style={{ perspective: "1200px" }}>
                <motion.div 
                  className="relative rounded-3xl overflow-hidden h-[500px] group"
                  whileHover={{ scale: 1.02, rotateY: -4, rotateX: 2 }}
                  transition={{ duration: 0.4 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <img 
                    src={aboutTeam} 
                    alt="YetiBytes Team Brainstorming" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6" style={{ transform: "translateZ(40px)" }}>
                    <div className="glass-card rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground">Creative Collaboration</p>
                          <p className="text-sm text-muted-foreground">Where ideas come to life</p>
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

      {/* Values Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="text-primary font-medium mb-4 block">Our Values</span>
            <h2 className="font-display text-4xl font-bold">What Drives Us</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ perspective: "1200px" }}>
            {values.map((value, index) => (
              <AnimatedSection key={value.title} delay={index * 0.1}>
                <TiltCard className="h-full text-center group/value" tiltIntensity={12}>
                  <motion.div 
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mx-auto mb-5 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <value.icon className="text-white" size={32} />
                  </motion.div>
                  <h3 className="font-display text-xl font-semibold mb-3 group-hover/value:text-primary transition-colors">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </TiltCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="text-primary font-medium mb-4 block">Testimonials</span>
            <h2 className="font-display text-4xl font-bold mb-6">What Our Clients Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it — hear from the businesses we've helped transform
            </p>
          </AnimatedSection>

          {isLoadingTestimonials ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="glass-card p-6 h-64 rounded-2xl">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <div key={j} className="w-4 h-4 bg-muted rounded" />
                      ))}
                    </div>
                    <div className="h-20 bg-muted rounded mb-4" />
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted" />
                      <div>
                        <div className="h-4 bg-muted rounded w-24 mb-2" />
                        <div className="h-3 bg-muted rounded w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : testimonials && testimonials.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <AnimatedSection key={testimonial.id} delay={index * 0.1}>
                  <GlassCard className="h-full relative group">
                    {/* Quote Icon */}
                    <div className="absolute -top-4 -left-2 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center rotate-180">
                      <Quote className="text-primary" size={20} />
                    </div>
                    
                    {/* Rating */}
                    <div className="flex gap-1 mb-4 pt-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={16} className="fill-primary text-primary" />
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <p className="text-muted-foreground mb-6 italic leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border">
                      {testimonial.image_url ? (
                        <img 
                          src={testimonial.image_url} 
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                          <span className="text-lg font-display font-bold text-primary-foreground">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </GlassCard>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Quote size={32} className="text-primary" />
              </div>
              <p className="text-muted-foreground">Client testimonials coming soon!</p>
            </div>
          )}

          {/* Success Stats */}
          <AnimatedSection delay={0.3}>
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "98%", label: "Client Satisfaction" },
                { value: "150+", label: "Projects Delivered" },
                { value: "50+", label: "Happy Clients" },
                { value: "15+", label: "Countries Served" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-6 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="text-primary font-medium mb-4 block">Our Team</span>
            <h2 className="font-display text-4xl font-bold mb-6">Meet the Experts</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A diverse team of passionate professionals dedicated to delivering excellence
            </p>
          </AnimatedSection>

          {isLoadingTeam ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center animate-pulse">
                  <div className="w-32 h-32 rounded-full bg-muted mx-auto mb-4" />
                  <div className="h-5 bg-muted rounded w-24 mx-auto mb-2" />
                  <div className="h-4 bg-muted rounded w-20 mx-auto" />
                </div>
              ))}
            </div>
          ) : teamMembers && teamMembers.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                  <AnimatedSection key={member.id} delay={index * 0.1}>
                    <motion.div
                      whileHover={{ y: -8 }}
                      className="text-center group"
                    >
                      <motion.div 
                        className="relative w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow"
                        whileHover={{ scale: 1.05 }}
                      >
                        {member.image_url ? (
                          <img 
                            src={member.image_url} 
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <span className="text-3xl font-display font-bold text-primary-foreground">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        {/* Hover overlay with social links */}
                        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {member.linkedin_url && (
                            <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform">
                              <Linkedin size={14} />
                            </a>
                          )}
                          {member.twitter_url && (
                            <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform">
                              <Twitter size={14} />
                            </a>
                          )}
                          {member.github_url && (
                            <a href={member.github_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform">
                              <Github size={14} />
                            </a>
                          )}
                        </div>
                      </motion.div>
                      <h3 className="font-display font-semibold text-lg group-hover:text-primary transition-colors">{member.name}</h3>
                      <p className="text-muted-foreground">{member.role}</p>
                    </motion.div>
                  </AnimatedSection>
                ))}
              </div>

              {/* View All Team Button */}
              <AnimatedSection className="text-center mt-12" delay={0.3}>
                <Button variant="outline" asChild className="group">
                  <Link to="/team">
                    View Full Team
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </AnimatedSection>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-primary" />
              </div>
              <p className="text-muted-foreground">Our team profiles are coming soon!</p>
              <Button variant="outline" asChild className="mt-4">
                <Link to="/team">View Team Page</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Global Reach Section with 3D Globe */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <AnimatedSection className="text-center mb-12">
            <span className="text-primary font-medium mb-4 block">Global Reach</span>
            <h2 className="font-display text-4xl font-bold mb-4">From Nepal to the World</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Based in Kathmandu, we serve clients across 15+ countries with seamless collaboration
            </p>
          </AnimatedSection>
          <AnimatedSection>
            <GlassCard className="p-6 md:p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MapPin className="text-primary" size={24} />
                    </div>
                    <span className="text-primary font-medium">Headquarters</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-4">Kathmandu, Nepal</h3>
                  <p className="text-muted-foreground mb-6">
                    Where mountains meet innovation. Our central hub connects us to clients 
                    in the US, Europe, Middle East, and Asia-Pacific.
                  </p>
                  <div className="space-y-2 text-muted-foreground">
                    <p>📍 Kathmandu, Nepal</p>
                    <p>📧 yetibytes8@gmail.com</p>
                    <p>📞 +977 9867077179</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {["USA", "UK", "Germany", "UAE", "India", "Singapore", "Japan", "Australia"].map((country) => (
                      <span key={country} className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">
                        {country}
                      </span>
                    ))}
                  </div>
                </div>
                <Globe3D />
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        <div className="container mx-auto px-6 relative">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-4xl font-bold mb-6">
              Want to Join Our Team?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              We're always looking for talented individuals who share our passion for technology.
            </p>
            <Button variant="hero" asChild className="group">
              <Link to="/careers">
                View Open Positions
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
};

export default About;