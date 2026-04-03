import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What technologies do you specialize in?",
    answer: "We specialize in modern web technologies including React, Next.js, TypeScript, Node.js, and cloud platforms like AWS, Azure, and Google Cloud. For mobile development, we work with React Native, Flutter, and native iOS/Android development."
  },
  {
    question: "How long does a typical project take?",
    answer: "Project timelines vary based on complexity and scope. A simple website might take 4-6 weeks, while a complex web application could take 3-6 months. We provide detailed timelines during our initial consultation after understanding your requirements."
  },
  {
    question: "Do you offer ongoing maintenance and support?",
    answer: "Yes! We offer comprehensive maintenance and support packages that include regular updates, security patches, performance monitoring, and technical support. We believe in building long-term partnerships with our clients."
  },
  {
    question: "What is your development process?",
    answer: "We follow an agile methodology with iterative development cycles. This includes discovery & planning, design, development, testing, deployment, and ongoing optimization. You'll have regular check-ins and demos throughout the process."
  },
  {
    question: "Can you work with our existing team?",
    answer: "Absolutely! We frequently collaborate with in-house teams, providing additional expertise and capacity. We can integrate seamlessly with your existing workflows, tools, and processes."
  },
  {
    question: "What are your payment terms?",
    answer: "We typically work with milestone-based payments for project work. For ongoing engagements, we offer monthly retainer options. We're flexible and can discuss payment structures that work best for your organization."
  },
  {
    question: "Do you provide NDA and confidentiality agreements?",
    answer: "Yes, we take confidentiality seriously. We're happy to sign NDAs before any project discussions and ensure all team members working on your project adhere to strict confidentiality protocols."
  },
  {
    question: "How do you ensure project quality?",
    answer: "Quality is embedded in our process. We use code reviews, automated testing, continuous integration, and thorough QA processes. Every project undergoes rigorous testing before deployment to ensure it meets our high standards."
  }
];

const FAQSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-glow opacity-30" />
      
      <div className="container mx-auto px-6 relative">
        <AnimatedSection className="text-center mb-16">
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <HelpCircle size={16} className="text-primary" />
            <span className="text-sm font-medium">FAQ</span>
          </motion.div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Got questions? We've got answers. If you can't find what you're looking for, 
            feel free to reach out to us directly.
          </p>
        </AnimatedSection>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AnimatedSection key={index} delay={index * 0.05}>
                <AccordionItem 
                  value={`item-${index}`}
                  className="glass-card rounded-xl px-6 border-0 overflow-hidden group data-[state=open]:shadow-lg data-[state=open]:shadow-primary/10 transition-all duration-300"
                >
                  <AccordionTrigger className="text-left font-display text-lg font-medium hover:no-underline hover:text-primary transition-colors py-5 [&[data-state=open]]:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </AnimatedSection>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <AnimatedSection className="text-center mt-12" delay={0.3}>
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a href="/contact" className="text-primary hover:underline font-medium">
              Contact our team
            </a>
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FAQSection;
