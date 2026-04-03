import { useState, useEffect } from "react";
import { Mail, Eye, Trash2, Search, CheckCircle, Clock } from "lucide-react";
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
} from "@/components/ui/dialog";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string | null;
  subject: string | null;
  message: string;
  status: string | null;
  notes: string | null;
  created_at: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
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

  const viewMessage = async (message: ContactSubmission) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);

    if (message.status === "unread") {
      try {
        const { error } = await supabase
          .from("contact_submissions")
          .update({ status: "read" })
          .eq("id", message.id);

        if (error) throw error;
        fetchMessages();
      } catch (error) {
        console.error("Error updating message status:", error);
      }
    }
  };

  const markAsReplied = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status: "replied" })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message marked as replied.",
      });
      setIsDialogOpen(false);
      fetchMessages();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Message deleted successfully.",
      });
      fetchMessages();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "unread":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400 flex items-center gap-1">
            <Mail size={12} /> Unread
          </span>
        );
      case "read":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400 flex items-center gap-1">
            <Clock size={12} /> Pending
          </span>
        );
      case "replied":
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400 flex items-center gap-1">
            <CheckCircle size={12} /> Replied
          </span>
        );
      default:
        return null;
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <AdminLayout title="Contact Messages">
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        {unreadCount > 0 && (
          <div className="px-4 py-2 rounded-xl bg-primary/10 text-primary flex items-center gap-2">
            <Mail size={18} />
            <span className="font-medium">{unreadCount} unread</span>
          </div>
        )}
      </div>

      {/* Message Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="mt-4 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{selectedMessage.name}</h3>
                  <p className="text-muted-foreground">{selectedMessage.email}</p>
                  {selectedMessage.company && (
                    <p className="text-sm text-muted-foreground">{selectedMessage.company}</p>
                  )}
                </div>
                {getStatusBadge(selectedMessage.status)}
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-1">Subject</p>
                <p className="font-medium">{selectedMessage.subject || "No subject"}</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-2">Message</p>
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Received: {new Date(selectedMessage.created_at).toLocaleString()}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`mailto:${selectedMessage.email}`)}
                  >
                    Reply via Email
                  </Button>
                  {selectedMessage.status !== "replied" && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => markAsReplied(selectedMessage.id)}
                    >
                      Mark as Replied
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : filteredMessages.length === 0 ? (
        <GlassCard hover={false} className="text-center py-12">
          <Mail className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground">No messages found.</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <GlassCard
              key={message.id}
              hover={false}
              className={`flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer transition-all ${
                message.status === "unread" ? "border-l-4 border-l-primary" : ""
              }`}
              onClick={() => viewMessage(message)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold">{message.name}</h3>
                  {getStatusBadge(message.status)}
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {message.email}
                  {message.company && ` • ${message.company}`}
                </p>
                <p className="text-sm text-foreground">
                  {message.subject || "No subject"} — <span className="text-muted-foreground line-clamp-1">{message.message}</span>
                </p>
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <span className="text-xs text-muted-foreground">
                  {new Date(message.created_at).toLocaleDateString()}
                </span>
                <Button variant="ghost" size="icon" onClick={() => viewMessage(message)}>
                  <Eye size={18} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(message.id)}>
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

export default AdminMessages;
