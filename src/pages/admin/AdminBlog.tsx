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

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  featured_image: string | null;
  published: boolean | null;
  created_at: string;
}

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    featured_image: "",
    published: false,
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image must be less than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, featured_image: publicUrl });

      toast({
        title: "Success",
        description: "Image uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, featured_image: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const slug = formData.slug || generateSlug(formData.title);
      
      if (editingPost) {
        const { error } = await supabase
          .from("blog_posts")
          .update({
            title: formData.title,
            slug,
            excerpt: formData.excerpt,
            content: formData.content,
            category: formData.category,
            featured_image: formData.featured_image || null,
            published: formData.published,
          })
          .eq("id", editingPost.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Blog post updated successfully.",
        });
      } else {
        const { error } = await supabase.from("blog_posts").insert({
          title: formData.title,
          slug,
          excerpt: formData.excerpt,
          content: formData.content,
          category: formData.category,
          featured_image: formData.featured_image || null,
          published: formData.published,
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Blog post created successfully.",
        });
      }

      setIsDialogOpen(false);
      setEditingPost(null);
      setFormData({ title: "", slug: "", excerpt: "", content: "", category: "", featured_image: "", published: false });
      fetchPosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content || "",
      category: post.category || "",
      featured_image: post.featured_image || "",
      published: post.published || false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post deleted successfully.",
      });
      fetchPosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({ published: !post.published })
        .eq("id", post.id);

      if (error) throw error;
      fetchPosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Blog Posts">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingPost(null);
            setFormData({ title: "", slug: "", excerpt: "", content: "", category: "", featured_image: "", published: false });
          }
        }}>
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus size={18} /> New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingPost ? "Edit Post" : "Create New Post"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
                <label className="block text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              
              {/* Featured Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Featured Image</label>
                {formData.featured_image ? (
                  <div className="relative rounded-xl overflow-hidden border border-border">
                    <img 
                      src={formData.featured_image} 
                      alt="Featured" 
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-muted-foreground">Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Image size={24} className="text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">Click to upload image</span>
                        <span className="text-xs text-muted-foreground">Max 5MB</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Excerpt</label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
                  {editingPost ? "Update" : "Create"} Post
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Posts List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : filteredPosts.length === 0 ? (
        <GlassCard hover={false} className="text-center py-12">
          <p className="text-muted-foreground mb-4">No blog posts found.</p>
          <Button variant="default" onClick={() => setIsDialogOpen(true)}>
            <Plus size={18} /> Create your first post
          </Button>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <GlassCard key={post.id} hover={false} className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Thumbnail */}
              {post.featured_image && (
                <div className="w-full sm:w-20 h-32 sm:h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={post.featured_image} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{post.title}</h3>
                  {post.published ? (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-accent/20 text-accent-foreground">
                      Published
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {post.category && <span className="text-primary">{post.category}</span>}
                  {post.category && " • "}
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => togglePublish(post)}
                  title={post.published ? "Unpublish" : "Publish"}
                >
                  {post.published ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(post)}>
                  <Edit size={18} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
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

export default AdminBlog;
