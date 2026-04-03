import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import yetibytesLogo from "@/assets/yetibytes-logo.png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Team", path: "/team" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Careers", path: "/careers" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const { theme } = useTheme();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "glass-card border-b border-border/50 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <img 
                src={yetibytesLogo} 
                alt="YetiBytes Tech Private Limited" 
                className="h-12 w-auto object-contain"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-4 py-2 group"
              >
                <span
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.name}
                </span>
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Theme Toggle, Login & CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <Button variant="outline" size="sm" asChild className="gap-2">
                <Link to="/admin">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" asChild className="gap-2 border-primary/50 hover:border-primary hover:bg-primary/10">
                <Link to="/auth">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
            <Button variant="default" size="default" asChild>
              <Link to="/contact">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-80 glass-card border-l border-border p-8 pt-24"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      className={`block py-3 text-lg font-medium transition-colors ${
                        location.pathname === link.path
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="pt-4 flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <ThemeToggle />
                  </div>
                  {user ? (
                    <Button variant="outline" className="w-full justify-start gap-2" asChild>
                      <Link to="/admin">
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full justify-start gap-2" asChild>
                      <Link to="/auth">
                        <LogIn className="h-4 w-4" />
                        Login
                      </Link>
                    </Button>
                  )}
                  <Button variant="default" size="lg" className="w-full" asChild>
                    <Link to="/contact">Get Started</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
