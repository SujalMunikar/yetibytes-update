import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Search, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PageHero from "@/components/ui/PageHero";

const blogPosts = [
  {
    id: 1,
    title: "The Future of Web Development: Trends to Watch in 2025",
    excerpt: "Explore the emerging technologies and frameworks shaping the future of web development.",
    category: "Technology",
    date: "Jan 5, 2026",
    readTime: "5 min read",
    color: "from-green-500/20 to-purple-500/20",
  },
  {
    id: 2,
    title: "How AI is Transforming Software Development",
    excerpt: "Discover how artificial intelligence is revolutionizing the way we build software.",
    category: "AI & ML",
    date: "Jan 3, 2026",
    readTime: "7 min read",
    color: "from-green-500/20 to-teal-500/20",
  },
  {
    id: 3,
    title: "Building Scalable Cloud Architecture",
    excerpt: "Best practices for designing cloud infrastructure that grows with your business.",
    category: "Cloud",
    date: "Dec 28, 2025",
    readTime: "6 min read",
    color: "from-orange-500/20 to-red-500/20",
  },
  {
    id: 4,
    title: "UI/UX Design Principles for Modern Apps",
    excerpt: "Learn the essential design principles that create exceptional user experiences.",
    category: "Design",
    date: "Dec 22, 2025",
    readTime: "4 min read",
    color: "from-pink-500/20 to-rose-500/20",
  },
  {
    id: 5,
    title: "Cybersecurity Best Practices for Startups",
    excerpt: "Essential security measures every startup should implement from day one.",
    category: "Security",
    date: "Dec 18, 2025",
    readTime: "8 min read",
    color: "from-emerald-500/20 to-green-500/20",
  },
  {
    id: 6,
    title: "Remote Team Management: Lessons Learned",
    excerpt: "Insights from managing distributed teams across multiple time zones.",
    category: "Business",
    date: "Dec 15, 2025",
    readTime: "5 min read",
    color: "from-amber-500/20 to-yellow-500/20",
  },
];

const categories = ["All", "Technology", "AI & ML", "Cloud", "Design", "Security", "Business"];

const Blog = () => {
  return (
    <main className="pt-20">
      {/* Hero */}
      <PageHero
        badge="Our Blog"
        badgeIcon={<BookOpen size={16} />}
        title="Insights &"
        titleHighlight="Resources"
        description="Stay updated with the latest trends, tutorials, and insights from our team."
      />

      {/* Search & Filter */}
      <section className="pb-12">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-3 rounded-xl glass-card border border-border bg-transparent focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 rounded-full text-sm font-medium glass-card text-muted-foreground hover:text-foreground transition-colors"
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <AnimatedSection key={post.id} delay={index * 0.1}>
                <motion.article
                  whileHover={{ y: -8 }}
                  className="glass-card rounded-2xl overflow-hidden group h-full flex flex-col"
                >
                  {/* Image */}
                  <div className={`aspect-video bg-gradient-to-br ${post.color} relative`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl font-display font-bold text-foreground/10">
                        {post.title.charAt(0)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-primary text-sm font-medium">{post.category}</span>
                    <h3 className="font-display text-xl font-semibold mt-2 mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-1">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {post.readTime}
                      </span>
                    </div>
                  </div>
                </motion.article>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.3}>
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Articles
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        <div className="container mx-auto px-6 relative">
          <AnimatedSection className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-4xl font-bold mb-6">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Get the latest insights delivered straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl glass-card border border-border bg-transparent focus:border-primary focus:outline-none transition-colors"
              />
              <Button variant="default" size="lg">
                Subscribe <ArrowRight size={16} />
              </Button>
            </form>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
};

export default Blog;
