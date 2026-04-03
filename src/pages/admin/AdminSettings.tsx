import { useState } from "react";
import { User, Key, Shield } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully.",
      });
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout title="Settings">
      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <GlassCard hover={false}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="text-primary" size={24} />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">Profile</h3>
              <p className="text-sm text-muted-foreground">Your account information</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-muted-foreground cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-primary" />
                <span className="font-medium">{isAdmin ? "Administrator" : "User"}</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Change Password */}
        <GlassCard hover={false}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Key className="text-primary" size={24} />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">Security</h3>
              <p className="text-sm text-muted-foreground">Manage your password</p>
            </div>
          </div>

          {isChangingPassword ? (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="default">
                  Update Password
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsChangingPassword(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
              Change Password
            </Button>
          )}
        </GlassCard>

        {/* Admin Notice */}
        {!isAdmin && (
          <GlassCard hover={false} className="border-yellow-500/30 bg-yellow-500/5">
            <div className="flex items-start gap-4">
              <Shield className="text-yellow-400 mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-yellow-400 mb-2">Limited Access</h3>
                <p className="text-muted-foreground text-sm">
                  You have limited access to admin features. Contact an administrator to 
                  request elevated permissions.
                </p>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
