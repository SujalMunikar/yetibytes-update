import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Building2, Upload, X, Loader2, ExternalLink } from "lucide-react";

interface Client {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  type: string;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const emptyClient = {
  name: "",
  logo_url: "",
  website_url: "",
  type: "client",
  display_order: 0,
  published: false,
};

const AdminClients = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState(emptyClient);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: clients, isLoading } = useQuery({
    queryKey: ["admin-clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as Client[];
    },
  });

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('client-logos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('client-logos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setFormData({ ...formData, logo_url: imageUrl });
      toast.success("Logo uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload logo");
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, logo_url: "" });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const createMutation = useMutation({
    mutationFn: async (data: typeof emptyClient) => {
      const { error } = await supabase.from("clients").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client added successfully");
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof emptyClient }) => {
      const { error } = await supabase
        .from("clients")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client updated successfully");
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase
        .from("clients")
        .update({ published })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Visibility updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const resetForm = () => {
    setFormData(emptyClient);
    setEditingClient(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      logo_url: client.logo_url || "",
      website_url: client.website_url || "",
      type: client.type,
      display_order: client.display_order,
      published: client.published,
    });
    setImagePreview(client.logo_url || null);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      updateMutation.mutate({ id: editingClient.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const clientsCount = clients?.filter(c => c.type === 'client').length || 0;
  const partnersCount = clients?.filter(c => c.type === 'partner').length || 0;

  return (
    <AdminLayout title="Clients & Partners">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">
              Manage clients and partners displayed in the carousel.
            </p>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="text-muted-foreground">
                <strong className="text-foreground">{clientsCount}</strong> Clients
              </span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">{partnersCount}</strong> Partners
              </span>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} />
                Add Client/Partner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingClient ? "Edit Client/Partner" : "Add New Client/Partner"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      {(imagePreview || formData.logo_url) ? (
                        <div className="relative w-20 h-20">
                          <img
                            src={imagePreview || formData.logo_url}
                            alt="Preview"
                            className="w-full h-full rounded-xl object-contain border border-border bg-white p-2"
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
                        <div className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted/50">
                          <Building2 size={28} className="text-muted-foreground" />
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
                        id="logo-upload"
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
                            Upload Logo
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Transparent PNG recommended. Max 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Company Name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="partner">Partner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website_url">Website URL</Label>
                  <Input
                    id="website_url"
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    placeholder="https://example.com"
                  />
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
                    {editingClient ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Clients Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : clients?.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No clients or partners yet. Add your first one!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients?.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      {client.logo_url ? (
                        <img
                          src={client.logo_url}
                          alt={client.name}
                          className="w-12 h-12 rounded-lg object-contain bg-white p-1 border border-border"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <Building2 size={20} className="text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        client.type === 'partner' 
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {client.type === 'partner' ? 'Partner' : 'Client'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {client.website_url ? (
                        <a
                          href={client.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <ExternalLink size={14} />
                          Visit
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{client.display_order}</TableCell>
                    <TableCell>
                      <Switch
                        checked={client.published}
                        onCheckedChange={(checked) =>
                          togglePublishMutation.mutate({ id: client.id, published: checked })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(client)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this client/partner?")) {
                              deleteMutation.mutate(client.id);
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

export default AdminClients;