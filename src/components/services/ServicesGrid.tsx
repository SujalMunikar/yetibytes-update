import { 
  Cloud, 
  Zap, 
  Shield, 
  Database,
  Cpu
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ServiceInfoCard from "./ServiceInfoCard";

const services = [
  {
    icon: Cloud,
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure on AWS, Azure, and Google Cloud.",
    features: [
      "Cloud Migration",
      "DevOps & CI/CD",
      "Serverless Architecture",
      "Cloud Security",
    ],
    color: "from-green-500 to-teal-500",
  },
  {
    icon: Database,
    title: "Backend Development",
    description: "Robust backend systems and APIs that power your applications.",
    features: [
      "RESTful APIs",
      "GraphQL Development",
      "Microservices",
      "Database Design",
    ],
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Zap,
    title: "API Integration",
    description: "Connect your applications with third-party services seamlessly.",
    features: [
      "Payment Gateways",
      "Social Media APIs",
      "CRM Integration",
      "Custom Integrations",
    ],
    color: "from-emerald-500 to-green-500",
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "Protect your digital assets with enterprise-grade security.",
    features: [
      "Security Audits",
      "Penetration Testing",
      "Compliance",
      "Data Protection",
    ],
    color: "from-red-500 to-rose-500",
  },
  {
    icon: Cpu,
    title: "AI & Machine Learning",
    description: "Leverage AI to automate processes and gain insights.",
    features: [
      "Machine Learning Models",
      "Natural Language Processing",
      "Computer Vision",
      "Predictive Analytics",
    ],
    color: "from-teal-500 to-purple-500",
  },
];

const ServicesGrid = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-12 md:mb-16">
          <span className="text-primary font-medium mb-4 block text-sm sm:text-base">More Services</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 md:mb-6">Beyond Development & Design</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            From cloud infrastructure to AI and cybersecurity, we provide the technology backbone your business needs.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <ServiceInfoCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
              features={service.features}
              color={service.color}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
