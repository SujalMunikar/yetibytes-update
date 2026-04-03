import { motion } from "framer-motion";
import { LucideIcon, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceInfoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  color: string;
  index: number;
}

const ServiceInfoCard = ({ icon: Icon, title, description, features, color, index }: ServiceInfoCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, rotateY: -3, rotateX: 2, boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.1)" }}
      style={{ perspective: "800px", transformStyle: "preserve-3d" }}
      className="bg-card rounded-2xl p-5 sm:p-6 border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
        {/* Icon with gradient background */}
        <motion.div 
          className={cn(
            "w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg",
            `bg-gradient-to-br ${color}`
          )}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="text-white" size={22} />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-1">
            {title}
          </h3>
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      
      {/* Features grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-3 sm:mt-4">
        {features.map((feature, idx) => (
          <motion.div 
            key={feature}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (index * 0.1) + (idx * 0.05) }}
            className="flex items-center gap-2"
          >
            <CheckCircle size={14} className="text-primary flex-shrink-0" />
            <span className="text-xs sm:text-sm text-foreground">{feature}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ServiceInfoCard;
