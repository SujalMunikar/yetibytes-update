import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import GlassCard from "@/components/ui/GlassCard";
import TiltCard from "@/components/ui/TiltCard";
import PageHero from "@/components/ui/PageHero";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    value: "yetibytes8@gmail.com",
    link: "mailto:yetibytes8@gmail.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    value: "+977 9867077179",
    link: "tel:+9779867077179",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    value: "Nepal",
    link: "#",
  },
  {
    icon: Clock,
    title: "Working Hours",
    value: "Sun-Fri: 9AM - 6PM",
    link: "#",
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase.from("contact_submissions").insert({
      name: formData.name,
      email: formData.email,
      company: formData.company || null,
      subject: formData.subject,
      message: formData.message,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({ name: "", email: "", company: "", subject: "", message: "" });
    }
    
    setIsSubmitting(false);
  };

  return (
    <main className="pt-20">
      {/* Hero */}
      <PageHero
        badge="Contact Us"
        badgeIcon={<Headphones size={16} />}
        title="Let's Build Something"
        titleHighlight="Amazing"
        description="Have a project in mind? Get in touch and let's discuss how we can help."
      />

      {/* Contact Info Cards */}
      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ perspective: "1200px" }}>
            {contactInfo.map((info, index) => (
              <AnimatedSection key={info.title} delay={index * 0.1}>
                <a href={info.link}>
                  <TiltCard className="text-center h-full" tiltIntensity={12}>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <info.icon className="text-primary" size={24} />
                    </div>
                    <h3 className="font-semibold mb-1">{info.title}</h3>
                    <p className="text-muted-foreground text-sm">{info.value}</p>
                  </TiltCard>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <AnimatedSection>
              <span className="text-primary font-medium mb-4 block">Get in Touch</span>
              <h2 className="font-display text-4xl font-bold mb-6">
                Send Us a Message
              </h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form and our team will get back to you within 24 hours. 
                We're excited to hear about your project!
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="text-primary" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Quick Response</h4>
                    <p className="text-muted-foreground text-sm">
                      We typically respond within a few hours during business days.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                      placeholder="Your Company"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="web-development">Web Development</option>
                      <option value="mobile-app">Mobile App</option>
                      <option value="ui-ux-design">UI/UX Design</option>
                      <option value="consultation">General Consultation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>
                      Send Message <Send size={18} />
                    </>
                  )}
                </Button>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-4 overflow-hidden">
              <div className="aspect-[21/9] rounded-xl bg-secondary flex items-center justify-center">
                <motion.div 
                  className="text-center"
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <MapPin className="mx-auto mb-4 text-primary" size={48} />
                  <h3 className="font-display text-xl font-semibold mb-2">Our Office</h3>
                  <p className="text-muted-foreground">Kathmandu, Nepal</p>
                </motion.div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
};

export default Contact;
