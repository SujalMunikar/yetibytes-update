import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, User, Linkedin, Twitter, Github, Upload, X, Loader2 } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  email: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  github_url: string | null;
  department: string | null;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const emptyMember = {
  name: "",
  role: "",
  bio: "",
  image_url: "",
  email: "",
  linkedin_url: "",
  twitter_url: "",
  github_url: "",
  department: "",
  display_order: 0,
  published: false,
};

const AdminTeam = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState(emptyMember);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["admin-team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as TeamMember[];
    },
  });

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('team-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('team-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to storage
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setFormData({ ...formData, image_url: imageUrl });
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image_url: "" });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const createMutation = useMutation({
    mutationFn: async (data: typeof emptyMember) => {
      const { error } = await supabase.from("team_members").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team-members"] });
      toast.success("Team member added successfully");
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof emptyMember }) => {
      const { error } = await supabase
        .from("team_members")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team-members"] });
      toast.success("Team member updated successfully");
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team-members"] });
      toast.success("Team member deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase
        .from("team_members")
        .update({ published })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team-members"] });
      toast.success("Visibility updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const resetForm = () => {
    setFormData(emptyMember);
    setEditingMember(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || "",
      image_url: member.image_url || "",
      email: member.email || "",
      linkedin_url: member.linkedin_url || "",
      twitter_url: member.twitter_url || "",
      github_url: member.github_url || "",
      department: member.department || "",
      display_order: member.display_order,
      published: member.published,
    });
    setImagePreview(member.image_url || null);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      updateMutation.mutate({ id: editingMember.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <AdminLayout title="Team Members">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Manage your team members displayed on the website.
          </p>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingMember ? "Edit Team Member" : "Add New Team Member"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Profile Image</Label>
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      {(imagePreview || formData.image_url) ? (
                        <div className="relative w-24 h-24">
                          <img
                            src={imagePreview || formData.image_url}
                            alt="Preview"
                            className="w-full h-full rounded-xl object-cover border border-border"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted/50">
                          <User size={32} className="text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full"
                      >
                        {uploading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={16} />
                            Upload Image
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Max 5MB. JPG, PNG, or WebP recommended.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role/Position *</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="CEO & Founder"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="Engineering"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@yetibytes.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="A short bio about the team member..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url" className="flex items-center gap-2">
                      <Linkedin size={14} /> LinkedIn
                    </Label>
                    <Input
                      id="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter_url" className="flex items-center gap-2">
                      <Twitter size={14} /> Twitter
                    </Label>
                    <Input
                      id="twitter_url"
                      value={formData.twitter_url}
                      onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github_url" className="flex items-center gap-2">
                      <Github size={14} /> GitHub
                    </Label>
                    <Input
                      id="github_url"
                      value={formData.github_url}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                    />
                    <Label htmlFor="published">Published</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending || uploading}>
                    {editingMember ? "Update" : "Create"} Team Member
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Team Members Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : teamMembers?.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No team members yet. Add your first team member!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Social Links</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers?.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {member.image_url ? (
                          <img
                            src={member.image_url}
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User size={18} className="text-primary" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{member.name}</p>
                          {member.email && (
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.department || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {member.linkedin_url && (
                          <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                            <Linkedin size={16} />
                          </a>
                        )}
                        {member.twitter_url && (
                          <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                            <Twitter size={16} />
                          </a>
                        )}
                        {member.github_url && (
                          <a href={member.github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                            <Github size={16} />
                          </a>
                        )}
                        {!member.linkedin_url && !member.twitter_url && !member.github_url && (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={member.published}
                        onCheckedChange={(checked) =>
                          togglePublishMutation.mutate({ id: member.id, published: checked })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(member)}>
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this team member?")) {
                              deleteMutation.mutate(member.id);
                            }
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTeam;
