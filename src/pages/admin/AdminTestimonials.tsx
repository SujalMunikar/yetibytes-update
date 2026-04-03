import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star, Quote, Upload, X } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string | null;
  image_url: string | null;
  quote: string;
  rating: number;
  published: boolean;
  display_order: number;
}

const emptyTestimonial: Omit<Testimonial, "id"> = {
  name: "",
  role: "",
  company: "",
  image_url: "",
  quote: "",
  rating: 5,
  published: false,
  display_order: 0,
};

const AdminTestimonials = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<Omit<Testimonial, "id">>(emptyTestimonial);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('testimonial-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('testimonial-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, image_url: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as Testimonial[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Testimonial, "id">) => {
      const { error } = await supabase.from("testimonials").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      toast.success("Testimonial created successfully");
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to create testimonial: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Omit<Testimonial, "id"> }) => {
      const { error } = await supabase.from("testimonials").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      toast.success("Testimonial updated successfully");
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to update testimonial: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      toast.success("Testimonial deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete testimonial: " + error.message);
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from("testimonials").update({ published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      toast.success("Testimonial status updated");
    },
    onError: (error) => {
      toast.error("Failed to update status: " + error.message);
    },
  });

  const resetForm = () => {
    setFormData(emptyTestimonial);
    setEditingTestimonial(null);
    setIsDialogOpen(false);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company || "",
      image_url: testimonial.image_url || "",
      quote: testimonial.quote,
      rating: testimonial.rating,
      published: testimonial.published,
      display_order: testimonial.display_order,
    });
    setImagePreview(testimonial.image_url || null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = formData.image_url;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const submitData = {
        ...formData,
        company: formData.company || null,
        image_url: imageUrl || null,
      };

      if (editingTestimonial) {
        updateMutation.mutate({ id: editingTestimonial.id, data: submitData });
      } else {
        createMutation.mutate(submitData);
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AdminLayout title="Testimonials">
      <div className="flex justify-end mb-6">
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Client Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role/Title *</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                    placeholder="CEO, Marketing Director..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company || ""}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company Name"
                />
              </div>

              <div className="space-y-2">
                <Label>Client Photo</Label>
                <div className="flex items-start gap-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                      <Quote size={24} className="text-muted-foreground" />
                    </div>
                  )}
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
                      className="w-full"
                    >
                      <Upload size={16} className="mr-2" />
                      Upload Photo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Recommended: Square image, at least 200x200px
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quote">Testimonial Quote *</Label>
                <Textarea
                  id="quote"
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  required
                  rows={4}
                  placeholder="What did the client say about your work?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          size={24}
                          className={star <= formData.rating ? "fill-primary text-primary" : "text-muted-foreground"}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                <Label htmlFor="published">Published</Label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending || isUploading}>
                  {isUploading ? "Uploading..." : editingTestimonial ? "Update" : "Create"} Testimonial
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading testimonials...</div>
      ) : testimonials && testimonials.length > 0 ? (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Quote</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        {testimonial.image_url ? (
                          <img
                            src={testimonial.image_url}
                            alt={testimonial.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <Quote size={16} className="text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}{testimonial.company && `, ${testimonial.company}`}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate text-muted-foreground">{testimonial.quote}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-0.5">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={12} className="fill-primary text-primary" />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{testimonial.display_order}</TableCell>
                  <TableCell>
                    <Switch
                      checked={testimonial.published}
                      onCheckedChange={(checked) =>
                        togglePublishMutation.mutate({ id: testimonial.id, published: checked })
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(testimonial)}>
                        <Pencil size={14} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 size={14} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this testimonial from {testimonial.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMutation.mutate(testimonial.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg border">
          <Quote size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No testimonials yet</h3>
          <p className="text-muted-foreground mb-4">Add your first client testimonial to showcase on the website.</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus size={16} className="mr-2" />
            Add Testimonial
          </Button>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTestimonials;