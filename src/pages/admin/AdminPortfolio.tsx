import { useState, useEffect, useRef } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Upload, X, Image } from "lucide-react";
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

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  tags: string[] | null;
  client_name: string | null;
  project_url: string | null;
  featured_image: string | null;
  gallery_images: string[] | null;
  published: boolean | null;
  featured: boolean | null;
  created_at: string;
}

const AdminPortfolio = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const featuredInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    tags: "",
    client_name: "",
    project_url: "",
    published: false,
    featured: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("portfolio_projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const uploadImage = async (file: File, folder: string): Promise<string> => {
    const ext = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const { error } = await supabase.storage.from("portfolio-images").upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from("portfolio-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImageFile(file);
      setFeaturedImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setGalleryFiles((prev) => [...prev, ...files]);
    setGalleryPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeGalleryPreview = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingGalleryImage = (index: number) => {
    setExistingGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setEditingProject(null);
    setFeaturedImageFile(null);
    setFeaturedImagePreview(null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setExistingGalleryImages([]);
    setFormData({
      title: "", slug: "", description: "", category: "", tags: "",
      client_name: "", project_url: "", published: false, featured: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const slug = formData.slug || generateSlug(formData.title);
      const tags = formData.tags.split(",").map((t) => t.trim()).filter(Boolean);

      let featuredImageUrl = editingProject?.featured_image || null;
      if (featuredImageFile) {
        featuredImageUrl = await uploadImage(featuredImageFile, "featured");
      }

      // Upload new gallery images
      const newGalleryUrls = await Promise.all(
        galleryFiles.map((file) => uploadImage(file, "gallery"))
      );
      const allGalleryImages = [...existingGalleryImages, ...newGalleryUrls];

      const projectData = {
        title: formData.title,
        slug,
        description: formData.description,
        category: formData.category,
        tags,
        client_name: formData.client_name,
        project_url: formData.project_url,
        published: formData.published,
        featured: formData.featured,
        featured_image: featuredImageUrl,
        gallery_images: allGalleryImages.length > 0 ? allGalleryImages : null,
      };

      if (editingProject) {
        const { error } = await supabase
          .from("portfolio_projects")
          .update(projectData)
          .eq("id", editingProject.id);
        if (error) throw error;
        toast({ title: "Success", description: "Project updated successfully." });
      } else {
        const { error } = await supabase.from("portfolio_projects").insert(projectData);
        if (error) throw error;
        toast({ title: "Success", description: "Project created successfully." });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchProjects();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFeaturedImagePreview(project.featured_image || null);
    setExistingGalleryImages(project.gallery_images || []);
    setFormData({
      title: project.title,
      slug: project.slug,
      description: project.description || "",
      category: project.category || "",
      tags: project.tags?.join(", ") || "",
      client_name: project.client_name || "",
      project_url: project.project_url || "",
      published: project.published || false,
      featured: project.featured || false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const { error } = await supabase.from("portfolio_projects").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Project deleted successfully." });
      fetchProjects();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const togglePublish = async (project: Project) => {
    try {
      const { error } = await supabase
        .from("portfolio_projects")
        .update({ published: !project.published })
        .eq("id", project.id);
      if (error) throw error;
      fetchProjects();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Portfolio Projects">
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus size={18} /> New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingProject ? "Edit Project" : "Create New Project"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated-from-title"
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                />
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

              {/* Featured Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Featured Image</label>
                <input
                  ref={featuredInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedImageChange}
                  className="hidden"
                />
                {featuredImagePreview ? (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border">
                    <img src={featuredImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setFeaturedImageFile(null);
                        setFeaturedImagePreview(null);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => featuredInputRef.current?.click()}
                    className="w-full h-32 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <Upload size={24} />
                    <span className="text-sm">Click to upload featured image</span>
                  </button>
                )}
              </div>

              {/* Gallery Images Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Gallery Images</label>
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryChange}
                  className="hidden"
                />
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {existingGalleryImages.map((url, i) => (
                    <div key={`existing-${i}`} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingGalleryImage(i)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs hover:scale-110 transition-transform"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {galleryPreviews.map((url, i) => (
                    <div key={`new-${i}`} className="relative aspect-square rounded-lg overflow-hidden border border-primary/30">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryPreview(i)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs hover:scale-110 transition-transform"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <Image size={20} />
                    <span className="text-xs">Add</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="React, Node.js, PostgreSQL"
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Client Name</label>
                  <input
                    type="text"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Project URL</label>
                  <input
                    type="url"
                    value={formData.project_url}
                    onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded border-border"
                  />
                  <label htmlFor="published" className="text-sm font-medium">Published</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-border"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">Featured</label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="default" disabled={isUploading}>
                  {isUploading ? "Uploading..." : editingProject ? "Update" : "Create"} Project
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : filteredProjects.length === 0 ? (
        <GlassCard hover={false} className="text-center py-12">
          <p className="text-muted-foreground mb-4">No projects found.</p>
          <Button variant="default" onClick={() => setIsDialogOpen(true)}>
            <Plus size={18} /> Create your first project
          </Button>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <GlassCard key={project.id} hover={false} className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Thumbnail */}
              {project.featured_image && (
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                  <img src={project.featured_image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold">{project.title}</h3>
                  {project.featured && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-400">
                      Featured
                    </span>
                  )}
                  {project.published ? (
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
                  {project.category && <span className="text-primary">{project.category}</span>}
                  {project.category && project.client_name && " • "}
                  {project.client_name && <span>{project.client_name}</span>}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => togglePublish(project)} title={project.published ? "Unpublish" : "Publish"}>
                  {project.published ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                  <Edit size={18} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)}>
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

export default AdminPortfolio;
