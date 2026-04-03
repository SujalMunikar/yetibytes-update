import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PageHero from "@/components/ui/PageHero";

const categories = ["All", "Web Apps", "Mobile Apps", "E-Commerce", "UI/UX"];

const projects = [
  {
    id: 1,
    title: "FinanceFlow Dashboard",
    category: "Web Apps",
    description: "A comprehensive financial management platform for enterprises",
    tags: ["React", "Node.js", "PostgreSQL"],
    color: "from-green-500/20 to-purple-500/20",
  },
  {
    id: 2,
    title: "ShopNepal E-Commerce",
    category: "E-Commerce",
    description: "Full-featured e-commerce platform for Nepali businesses",
    tags: ["Next.js", "Stripe", "MongoDB"],
    color: "from-green-500/20 to-teal-500/20",
  },
  {
    id: 3,
    title: "TrekMate Mobile App",
    category: "Mobile Apps",
    description: "Trekking companion app for Himalayan adventures",
    tags: ["React Native", "Firebase", "Maps API"],
    color: "from-orange-500/20 to-red-500/20",
  },
  {
    id: 4,
    title: "MediCare Portal",
    category: "Web Apps",
    description: "Healthcare management system for hospitals",
    tags: ["Vue.js", "Python", "MySQL"],
    color: "from-emerald-500/20 to-green-500/20",
  },
  {
    id: 5,
    title: "FoodHub Delivery",
    category: "Mobile Apps",
    description: "On-demand food delivery application",
    tags: ["Flutter", "Node.js", "Redis"],
    color: "from-pink-500/20 to-rose-500/20",
  },
  {
    id: 6,
    title: "CraftBazaar Marketplace",
    category: "E-Commerce",
    description: "Handcraft marketplace connecting artisans globally",
    tags: ["React", "GraphQL", "AWS"],
    color: "from-amber-500/20 to-yellow-500/20",
  },
  {
    id: 7,
    title: "EduLearn Platform",
    category: "Web Apps",
    description: "Online learning platform with live classes",
    tags: ["Next.js", "WebRTC", "PostgreSQL"],
    color: "from-teal-500/20 to-violet-500/20",
  },
  {
    id: 8,
    title: "Brand Identity System",
    category: "UI/UX",
    description: "Complete brand design and UI kit for startups",
    tags: ["Figma", "Design System", "Branding"],
    color: "from-fuchsia-500/20 to-pink-500/20",
  },
];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = projects.filter(
    (project) => activeCategory === "All" || project.category === activeCategory
  );

  return (
    <main className="pt-20">
      {/* Hero */}
      <PageHero
        badge="Our Portfolio"
        badgeIcon={<Briefcase size={16} />}
        title="Featured"
        titleHighlight="Projects"
        description="Explore our latest work and see how we've helped businesses transform digitally."
      />

      {/* Filter */}
      <section className="pb-12">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "glass-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </motion.button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <motion.div layout className="grid md:grid-cols-2 gap-8" style={{ perspective: "1200px" }}>
              <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -8, rotateY: -3, rotateX: 2 }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="group"
                >
                  <div className="glass-card rounded-2xl overflow-hidden">
                    {/* Project Image Placeholder */}
                    <div className={`aspect-video bg-gradient-to-br ${project.color} relative overflow-hidden`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-display font-bold text-foreground/20">
                          {project.title.charAt(0)}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="default" size="sm">
                          View Project <ExternalLink size={14} />
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <span className="text-primary text-sm font-medium">{project.category}</span>
                      <h3 className="font-display text-xl font-semibold mt-2 mb-3">{project.title}</h3>
                      <p className="text-muted-foreground mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        <div className="container mx-auto px-6 relative">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-4xl font-bold mb-6">
              Have a Project in Mind?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Let's create something amazing together.
            </p>
            <Button variant="hero" asChild>
              <Link to="/contact">
                Start Your Project
                <ArrowRight size={18} />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
};

export default Portfolio;
