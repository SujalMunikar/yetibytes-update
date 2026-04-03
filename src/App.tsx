import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Team from "./pages/Team";
import Portfolio from "./pages/Portfolio";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminPortfolio from "./pages/admin/AdminPortfolio";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminClients from "./pages/admin/AdminClients";
import NotFound from "./pages/NotFound";
import ScrollToTop from "@/components/ui/ScrollToTop";
import FloatingContactButton from "@/components/ui/FloatingContactButton";

const queryClient = new QueryClient();

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -10,
  },
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
    transition={{ duration: 0.35, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Public Routes with Navbar/Footer */}
        <Route path="/" element={
          <PageWrapper>
            <Navbar />
            <Index />
            <Footer />
          </PageWrapper>
        } />
        <Route path="/about" element={
          <PageWrapper>
            <Navbar />
            <About />
            <Footer />
          </PageWrapper>
        } />
        <Route path="/services" element={
          <PageWrapper>
            <Navbar />
            <Services />
            <Footer />
          </PageWrapper>
        } />
        <Route path="/team" element={
          <PageWrapper>
            <Navbar />
            <Team />
            <Footer />
          </PageWrapper>
        } />
        <Route path="/portfolio" element={
          <PageWrapper>
            <Navbar />
            <Portfolio />
            <Footer />
          </PageWrapper>
        } />
        <Route path="/careers" element={
          <PageWrapper>
            <Navbar />
            <Careers />
            <Footer />
          </PageWrapper>
        } />
        <Route path="/blog" element={
          <PageWrapper>
            <Navbar />
            <Blog />
            <Footer />
          </PageWrapper>
        } />
        <Route path="/contact" element={
          <PageWrapper>
            <Navbar />
            <Contact />
            <Footer />
          </PageWrapper>
        } />
        
        {/* Auth Route */}
        <Route path="/auth" element={
          <PageWrapper>
            <Auth />
          </PageWrapper>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <PageWrapper>
            <AdminDashboard />
          </PageWrapper>
        } />
        <Route path="/admin/blog" element={
          <PageWrapper>
            <AdminBlog />
          </PageWrapper>
        } />
        <Route path="/admin/portfolio" element={
          <PageWrapper>
            <AdminPortfolio />
          </PageWrapper>
        } />
        <Route path="/admin/jobs" element={
          <PageWrapper>
            <AdminJobs />
          </PageWrapper>
        } />
        <Route path="/admin/team" element={
          <PageWrapper>
            <AdminTeam />
          </PageWrapper>
        } />
        <Route path="/admin/testimonials" element={
          <PageWrapper>
            <AdminTestimonials />
          </PageWrapper>
        } />
        <Route path="/admin/messages" element={
          <PageWrapper>
            <AdminMessages />
          </PageWrapper>
        } />
        <Route path="/admin/settings" element={
          <PageWrapper>
            <AdminSettings />
          </PageWrapper>
        } />
        <Route path="/admin/clients" element={
          <PageWrapper>
            <AdminClients />
          </PageWrapper>
        } />
        
        <Route path="*" element={
          <PageWrapper>
            <Navbar />
            <NotFound />
            <Footer />
          </PageWrapper>
        } />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <FloatingContactButton />
            <AnimatedRoutes />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
