import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin,
  ArrowUpRight
} from "lucide-react";
import yetibytesLogo from "@/assets/yetibytes-logo.png";

const footerLinks = {
  company: [
    { name: "About Us", path: "/about" },
    { name: "Our Team", path: "/team" },
    { name: "Careers", path: "/careers" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ],
  services: [
    { name: "Website Development", path: "/services" },
    { name: "Application Development", path: "/services" },
    { name: "UI/UX Design", path: "/services" },
    { name: "Software Development", path: "/services" },
    { name: "Digital Marketing", path: "/services" },
  ],
  resources: [
    { name: "Portfolio", path: "/portfolio" },
    { name: "Case Studies", path: "/portfolio" },
    { name: "Documentation", path: "/blog" },
    { name: "Support", path: "/contact" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

const Footer = () => {
  return (
    <footer className="relative bg-card border-t border-border">
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-6">
              <img 
                src={yetibytesLogo} 
                alt="YetiBytes Tech Private Limited" 
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              At YetiBytes, we empower businesses with smart, scalable, and secure IT solutions. From custom software development to digital strategy — we turn technology into your competitive edge.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:yetibytes8@gmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                <Mail size={18} />
                <span>yetibytes8@gmail.com</span>
                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="tel:+9779867077179" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                <Phone size={18} />
                <span>+977 9867077179</span>
                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin size={18} />
                <span>Nepal</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} YetiBytes Tech Private Limited. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <social.icon size={18} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
