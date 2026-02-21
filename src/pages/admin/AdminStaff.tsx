import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Users, Shield, FileText, Plane, Headphones } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type AppRole = "admin" | "blog_editor" | "visa_manager" | "enquiry_handler" | "user";

interface StaffMember {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
  email?: string;
}

const roleLabels: Record<AppRole, { label: string; description: string; icon: React.ComponentType<{ className?: string }> }> = {
  admin: { label: "Admin", description: "Full access to all features", icon: Shield },
  blog_editor: { label: "Blog Editor", description: "Can manage blog posts only", icon: FileText },
  visa_manager: { label: "Visa Manager", description: "Can manage visas, categories, and countries", icon: Plane },
  enquiry_handler: { label: "Enquiry Handler", description: "Can view and update enquiry status only", icon: Headphones },
  user: { label: "User", description: "Regular user with no admin access", icon: Users },
};

const roleColors: Record<AppRole, string> = {
  admin: "bg-primary text-primary-foreground",
  blog_editor: "bg-blue-500 text-white",
  visa_manager: "bg-green-500 text-white",
  enquiry_handler: "bg-purple-500 text-white",
  user: "bg-muted text-muted-foreground",
};

const staffRoles: AppRole[] = ["admin", "blog_editor", "visa_manager", "enquiry_handler"];

const newStaffSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "blog_editor", "visa_manager", "enquiry_handler"]),
});

export default function AdminStaff() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AppRole>("blog_editor");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: staffMembers, isLoading } = useQuery({
    queryKey: ["staff-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .neq("role", "user")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as StaffMember[];
    },
  });

  const createStaffMutation = useMutation({
    mutationFn: async ({ email, password, role }: { email: string; password: string; role: AppRole }) => {
      const { data, error } = await supabase.functions.invoke("manage-staff", {
        body: { action: "create", email, password, role },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Staff member created", description: "The new staff member can now log in." });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating staff member", description: error.message, variant: "destructive" });
    },
  });

  const deleteStaffMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.functions.invoke("manage-staff", {
        body: { action: "delete", userId },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
      toast({ title: "Staff member removed" });
    },
    onError: (error: Error) => {
      toast({ title: "Error removing staff member", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setRole("blog_editor");
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = newStaffSchema.safeParse({ email, password, role });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    createStaffMutation.mutate({ email, password, role });
  };

  const handleDelete = (userId: string, userEmail?: string) => {
    if (confirm(`Are you sure you want to remove ${userEmail || "this staff member"}?`)) {
      deleteStaffMutation.mutate(userId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">Manage staff members and their roles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Staff Member</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Add New Staff Member</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="staff@travelidea.in" />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 8 characters" />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(value) => setRole(value as AppRole)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {staffRoles.map((r) => {
                      const RoleIcon = roleLabels[r].icon;
                      return (
                        <SelectItem key={r} value={r}>
                          <div className="flex items-center gap-2">
                            <RoleIcon className="h-4 w-4" />
                            <span className="font-medium">{roleLabels[r].label}</span>
                            <span className="text-xs text-muted-foreground ml-1">- {roleLabels[r].description}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createStaffMutation.isPending}>
                  {createStaffMutation.isPending ? "Creating..." : "Create Staff Member"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Role descriptions */}
      <div className="grid gap-4 md:grid-cols-4">
        {staffRoles.map((r) => {
          const RoleIcon = roleLabels[r].icon;
          return (
            <div key={r} className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-2 rounded-lg ${roleColors[r]}`}><RoleIcon className="h-4 w-4" /></div>
                <span className="font-medium">{roleLabels[r].label}</span>
              </div>
              <p className="text-sm text-muted-foreground">{roleLabels[r].description}</p>
            </div>
          );
        })}
      </div>

      {/* Staff list */}
      <div className="border rounded-lg bg-card">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading staff members...</div>
        ) : staffMembers && staffMembers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-mono text-sm">{member.user_id.slice(0, 8)}...</TableCell>
                  <TableCell>
                    <Badge className={roleColors[member.role as AppRole]}>
                      {roleLabels[member.role as AppRole]?.label || member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(member.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(member.user_id, member.email)} disabled={deleteStaffMutation.isPending}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No staff members yet</p>
            <p className="text-sm">Add your first staff member to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
