import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2 } from "lucide-react";

interface Client {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  type: string;
  display_order: number;
}

// Fallback clients when database is empty
const fallbackClients = [
  { id: "1", name: "TechCorp", logo_url: null, website_url: null, type: "client", display_order: 0 },
  { id: "2", name: "InnovateLabs", logo_url: null, website_url: null, type: "client", display_order: 1 },
  { id: "3", name: "DigitalWave", logo_url: null, website_url: null, type: "client", display_order: 2 },
  { id: "4", name: "CloudSync", logo_url: null, website_url: null, type: "partner", display_order: 3 },
  { id: "5", name: "DataFlow", logo_url: null, website_url: null, type: "client", display_order: 4 },
  { id: "6", name: "SmartScale", logo_url: null, website_url: null, type: "partner", display_order: 5 },
];

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const ClientsCarousel = () => {
  const { data: dbClients } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as Client[];
    },
  });

  const clients = dbClients && dbClients.length > 0 ? dbClients : fallbackClients;
  
  // Double the clients array for seamless infinite scroll
  const duplicatedClients = [...clients, ...clients];

  return (
    <div className="relative overflow-hidden py-8">
      {/* Gradient Fade Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Scrolling Container */}
      <motion.div
        className="flex gap-8"
        animate={{
          x: [0, -50 * clients.length * 2],
        }}
        transition={{
          x: {
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          },
        }}
        style={{ width: "fit-content" }}
      >
        {duplicatedClients.map((client, index) => (
          <motion.div
            key={`${client.id}-${index}`}
            className="flex-shrink-0 group"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {client.website_url ? (
              <a
                href={client.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <ClientCard client={client} />
              </a>
            ) : (
              <ClientCard client={client} />
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

const ClientCard = ({ client }: { client: Client }) => (
  <div className="w-40 h-20 glass-card rounded-xl flex items-center justify-center gap-3 px-4 border border-border/50 hover:border-primary/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/10">
    {client.logo_url ? (
      <img
        src={client.logo_url}
        alt={client.name}
        className="w-10 h-10 object-contain"
      />
    ) : (
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
        <span className="font-display font-bold text-primary dark:text-white text-sm">
          {getInitials(client.name)}
        </span>
      </div>
    )}
    <span className="font-medium text-muted-foreground group-hover:text-foreground dark:group-hover:text-white transition-colors text-sm truncate max-w-[80px]">
      {client.name}
    </span>
  </div>
);

export default ClientsCarousel;