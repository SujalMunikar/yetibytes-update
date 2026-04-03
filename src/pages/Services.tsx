import { Link } from "react-router-dom";
import { 
  ArrowRight,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PageHero from "@/components/ui/PageHero";
import FeaturedServices from "@/components/services/FeaturedServices";
import ProcessFlow from "@/components/services/ProcessFlow";
import WhyChooseUs from "@/components/services/WhyChooseUs";
import FAQSection from "@/components/services/FAQSection";
import ServicesGrid from "@/components/services/ServicesGrid";

const Services = () => {
  return (
    <main className="pt-20">
      {/* Hero */}
      <PageHero
        badge="Our Services"
        badgeIcon={<Layers size={16} />}
        title="End-to-End"
        titleHighlight="Digital Solutions"
        description="From concept to launch, we provide comprehensive services to bring your digital vision to life."
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="hero" asChild>
            <Link to="/contact">
              Get a Free Quote
              <ArrowRight size={18} />
            </Link>
          </Button>
          <Button variant="heroOutline" asChild>
            <Link to="/portfolio">
              View Our Work
            </Link>
          </Button>
        </div>
      </PageHero>

      {/* Featured Services with Tabs */}
      <FeaturedServices />

      {/* Services Grid */}
      <ServicesGrid />


      {/* Process Flow */}
      <ProcessFlow />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 md:mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-lg mb-6 md:mb-8">
              Let's discuss how we can help you achieve your goals with our expertise.
            </p>
            <Button variant="hero" asChild className="group">
              <Link to="/contact">
                Get a Free Quote
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
};

export default Services;