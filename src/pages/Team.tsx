import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Linkedin, Twitter, Github } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  github_url: string | null;
  department: string | null;
  display_order: number;
}

const Team = () => {
  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      // Use the public view that excludes sensitive email addresses
      const { data, error } = await supabase
        .from("team_members_public")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as TeamMember[];
    },
  });

  // Group members by department
  const groupedMembers = teamMembers?.reduce((acc, member) => {
    const dept = member.department || "Team";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  return (
    <main className="pt-20">
      <PageHero
        badge="Our Team"
        badgeIcon={<Users size={16} />}
        title="Meet the"
        titleHighlight="Experts"
        description="The talented people behind YetiBytes who bring your digital visions to life."
      />

      {/* Team Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                  <div className="w-32 h-32 rounded-full bg-muted mx-auto mb-4" />
                  <div className="h-6 bg-muted rounded w-3/4 mx-auto mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : teamMembers?.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Users size={32} className="text-primary" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-2">Team Coming Soon</h3>
              <p className="text-muted-foreground">We're assembling our team profiles. Check back soon!</p>
            </div>
          ) : (
            Object.entries(groupedMembers || {}).map(([department, members]) => (
              <div key={department} className="mb-16 last:mb-0">
                {Object.keys(groupedMembers || {}).length > 1 && (
                  <AnimatedSection className="mb-8">
                    <h2 className="font-display text-2xl font-bold text-center">
                      <span className="text-gradient">{department}</span>
                    </h2>
                  </AnimatedSection>
                )}
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {members.map((member, index) => (
                    <AnimatedSection key={member.id} delay={index * 0.1}>
                      <motion.div
                        className="glass-card rounded-2xl p-6 text-center group h-full"
                        whileHover={{ y: -8, scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Profile Image */}
                        <motion.div
                          className="relative w-32 h-32 mx-auto mb-5"
                          whileHover={{ scale: 1.05 }}
                        >
                          {member.image_url ? (
                            <img
                              src={member.image_url}
                              alt={member.name}
                              className="w-full h-full rounded-full object-cover border-4 border-primary/20 group-hover:border-primary/50 transition-colors"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-4 border-primary/20">
                              <span className="font-display text-4xl font-bold text-primary">
                                {member.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          {/* Glow effect on hover */}
                          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity -z-10" />
                        </motion.div>

                        {/* Info */}
                        <h3 className="font-display text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-primary font-medium text-sm mb-3">
                          {member.role}
                        </p>
                        
                        {member.bio && (
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                            {member.bio}
                          </p>
                        )}

                        {/* Social Links */}
                        <div className="flex items-center justify-center gap-3 pt-2">
                          {member.linkedin_url && (
                            <motion.a
                              href={member.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Linkedin size={16} />
                            </motion.a>
                          )}
                          {member.twitter_url && (
                            <motion.a
                              href={member.twitter_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Twitter size={16} />
                            </motion.a>
                          )}
                          {member.github_url && (
                            <motion.a
                              href={member.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Github size={16} />
                            </motion.a>
                          )}
                        </div>
                      </motion.div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default Team;
