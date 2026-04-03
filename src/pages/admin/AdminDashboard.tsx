import { useEffect, useState } from "react";
import { FileText, Briefcase, Users, Mail, TrendingUp, Eye } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import GlassCard from "@/components/ui/GlassCard";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  blogPosts: number;
  portfolioProjects: number;
  jobListings: number;
  contactMessages: number;
  unreadMessages: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    blogPosts: 0,
    portfolioProjects: 0,
    jobListings: 0,
    contactMessages: 0,
    unreadMessages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [blogRes, portfolioRes, jobsRes, messagesRes, unreadRes] = await Promise.all([
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("portfolio_projects").select("id", { count: "exact", head: true }),
        supabase.from("job_listings").select("id", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "unread"),
      ]);

      setStats({
        blogPosts: blogRes.count || 0,
        portfolioProjects: portfolioRes.count || 0,
        jobListings: jobsRes.count || 0,
        contactMessages: messagesRes.count || 0,
        unreadMessages: unreadRes.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Blog Posts",
      value: stats.blogPosts,
      icon: FileText,
      color: "from-green-500/20 to-green-600/20",
      iconColor: "text-green-400",
    },
    {
      title: "Portfolio Projects",
      value: stats.portfolioProjects,
      icon: Briefcase,
      color: "from-green-500/20 to-green-600/20",
      iconColor: "text-green-400",
    },
    {
      title: "Job Listings",
      value: stats.jobListings,
      icon: Users,
      color: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-400",
    },
    {
      title: "Contact Messages",
      value: stats.contactMessages,
      icon: Mail,
      color: "from-orange-500/20 to-orange-600/20",
      iconColor: "text-orange-400",
      badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} unread` : undefined,
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-xl text-muted-foreground">
          Welcome back! Here's an overview of your content.
        </h2>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <GlassCard key={stat.title} hover={false} className="relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-50`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center ${stat.iconColor}`}>
                  <stat.icon size={24} />
                </div>
                {stat.badge && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary">
                    {stat.badge}
                  </span>
                )}
              </div>
              <p className="text-3xl font-display font-bold mb-1">
                {isLoading ? "..." : stat.value}
              </p>
              <p className="text-muted-foreground text-sm">{stat.title}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard hover={false}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="text-primary" size={20} />
            </div>
            <h3 className="font-display text-lg font-semibold">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <a
              href="/admin/blog"
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <FileText size={18} className="text-muted-foreground" />
              <span>Create new blog post</span>
            </a>
            <a
              href="/admin/portfolio"
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Briefcase size={18} className="text-muted-foreground" />
              <span>Add portfolio project</span>
            </a>
            <a
              href="/admin/jobs"
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Users size={18} className="text-muted-foreground" />
              <span>Post job listing</span>
            </a>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Eye className="text-primary" size={20} />
            </div>
            <h3 className="font-display text-lg font-semibold">Site Preview</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Preview your live website and see how your content appears to visitors.
          </p>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            Open website in new tab →
          </a>
        </GlassCard>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
