import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FloatingContactButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 400px
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const contactOptions = [
    {
      icon: Mail,
      label: "Email Us",
      href: "mailto:hello@yetibytes.com",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Phone,
      label: "Call Us",
      href: "tel:+9771234567890",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: MapPin,
      label: "Visit Us",
      to: "/contact",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-50">
          {/* Contact Options */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-16 right-0 mb-2 flex flex-col gap-3"
              >
                {contactOptions.map((option, index) => (
                  <motion.div
                    key={option.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {option.to ? (
                      <Link to={option.to}>
                        <motion.div
                          whileHover={{ scale: 1.05, x: -5 }}
                          className="flex items-center gap-3 glass-card rounded-full py-2 px-4 pr-5 shadow-lg cursor-pointer border border-border/50 hover:border-primary/30 transition-colors"
                        >
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${option.color} flex items-center justify-center`}>
                            <option.icon className="text-white" size={18} />
                          </div>
                          <span className="font-medium text-foreground whitespace-nowrap">
                            {option.label}
                          </span>
                        </motion.div>
                      </Link>
                    ) : (
                      <a href={option.href}>
                        <motion.div
                          whileHover={{ scale: 1.05, x: -5 }}
                          className="flex items-center gap-3 glass-card rounded-full py-2 px-4 pr-5 shadow-lg cursor-pointer border border-border/50 hover:border-primary/30 transition-colors"
                        >
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${option.color} flex items-center justify-center`}>
                            <option.icon className="text-white" size={18} />
                          </div>
                          <span className="font-medium text-foreground whitespace-nowrap">
                            {option.label}
                          </span>
                        </motion.div>
                      </a>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Button
              onClick={() => setIsOpen(!isOpen)}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 p-0"
              aria-label={isOpen ? "Close contact menu" : "Open contact menu"}
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? (
                  <X className="text-primary-foreground" size={24} />
                ) : (
                  <MessageCircle className="text-primary-foreground" size={24} />
                )}
              </motion.div>
            </Button>

            {/* Pulse Ring Effect */}
            {!isOpen && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/50"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FloatingContactButton;
