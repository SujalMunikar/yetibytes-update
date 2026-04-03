import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Users } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface JobListing {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  type: string | null;
  description: string | null;
  requirements: string | null;
  benefits: string | null;
  salary_range: string | null;
  published: boolean | null;
  created_at: string;
}

interface JobApplication {
  id: string;
  job_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  status: string | null;
  created_at: string;
}

const AdminJobs = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isApplicationsDialogOpen, setIsApplicationsDialogOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [editingJob, setEditingJob] = useState<JobListing | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    description: "",
    requirements: "",
    benefits: "",
    salary_range: "",
    published: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("job_listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingJob) {
        const { error } = await supabase
          .from("job_listings")
          .update(formData)
          .eq("id", editingJob.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Job listing updated successfully.",
        });
      } else {
        const { error } = await supabase.from("job_listings").insert(formData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Job listing created successfully.",
        });
      }

      setIsDialogOpen(false);
      setEditingJob(null);
      setFormData({
        title: "",
        department: "",
        location: "",
        type: "Full-time",
        description: "",
        requirements: "",
        benefits: "",
        salary_range: "",
        published: false,
      });
      fetchJobs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (job: JobListing) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department || "",
      location: job.location || "",
      type: job.type || "Full-time",
      description: job.description || "",
      requirements: job.requirements || "",
      benefits: job.benefits || "",
      salary_range: job.salary_range || "",
      published: job.published || false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job listing?")) return;

    try {
      const { error } = await supabase.from("job_listings").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Job listing deleted successfully.",
      });
      fetchJobs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const togglePublish = async (job: JobListing) => {
    try {
      const { error } = await supabase
        .from("job_listings")
        .update({ published: !job.published })
        .eq("id", job.id);

      if (error) throw error;
      fetchJobs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const viewApplications = (jobId: string) => {
    setSelectedJobId(jobId);
    setIsApplicationsDialogOpen(true);
  };

  const getApplicationCount = (jobId: string) => {
    return applications.filter((app) => app.job_id === jobId).length;
  };

  const getJobApplications = () => {
    if (!selectedJobId) return [];
    return applications.filter((app) => app.job_id === selectedJobId);
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Job Listings">
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingJob(null);
            setFormData({
              title: "",
              department: "",
              location: "",
              type: "Full-time",
              description: "",
              requirements: "",
              benefits: "",
              salary_range: "",
              published: false,
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus size={18} /> New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingJob ? "Edit Job" : "Create New Job"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">Job Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Salary Range</label>
                  <input
                    type="text"
                    value={formData.salary_range}
                    onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                    placeholder="e.g. $50k - $70k"
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Requirements</label>
                <textarea
                  rows={3}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 rounded border-border"
                />
                <label htmlFor="published" className="text-sm font-medium">
                  Published
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="default">
                  {editingJob ? "Update" : "Create"} Job
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Applications Dialog */}
      <Dialog open={isApplicationsDialogOpen} onOpenChange={setIsApplicationsDialogOpen}>
        <DialogContent className="glass-card border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">
              Applications ({getJobApplications().length})
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {getJobApplications().length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No applications yet.</p>
            ) : (
              getJobApplications().map((app) => (
                <div key={app.id} className="p-4 bg-secondary rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{app.full_name}</h4>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{app.email}</p>
                  {app.phone && (
                    <p className="text-sm text-muted-foreground">{app.phone}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Applied: {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : filteredJobs.length === 0 ? (
        <GlassCard hover={false} className="text-center py-12">
          <p className="text-muted-foreground mb-4">No job listings found.</p>
          <Button variant="default" onClick={() => setIsDialogOpen(true)}>
            <Plus size={18} /> Create your first job
          </Button>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <GlassCard key={job.id} hover={false} className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold">{job.title}</h3>
                  {job.published ? (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">
                      Published
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {job.department && <span className="text-primary">{job.department}</span>}
                  {job.department && job.location && " • "}
                  {job.location}
                  {(job.department || job.location) && job.type && " • "}
                  {job.type}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => viewApplications(job.id)}
                  className="gap-1"
                >
                  <Users size={16} />
                  {getApplicationCount(job.id)}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => togglePublish(job)}
                  title={job.published ? "Unpublish" : "Publish"}
                >
                  {job.published ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(job)}>
                  <Edit size={18} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(job.id)}>
                  <Trash2 size={18} className="text-destructive" />
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminJobs;
