import { useState, useEffect } from "react";
import { Download, Trash2, Search, Mail, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Subscriber {
  id: string;
  email: string;
  is_active: boolean;
  subscribed_at: string;
  created_at: string;
}

export default function AdminNewsletter() {
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false });
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSubscribers(data || []);
    }
    setLoading(false);
  };

  const handleToggleActive = async (subscriber: Subscriber) => {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({ is_active: !subscriber.is_active })
      .eq("id", subscriber.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: subscriber.is_active ? "Subscriber deactivated" : "Subscriber activated" });
      fetchSubscribers();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this subscriber permanently?")) return;
    
    const { error } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Subscriber deleted" });
      fetchSubscribers();
    }
  };

  const handleExport = () => {
    const activeSubscribers = subscribers.filter(s => s.is_active);
    const csv = [
      "Email,Subscribed Date,Status",
      ...activeSubscribers.map(s => 
        `${s.email},${new Date(s.subscribed_at).toLocaleDateString()},${s.is_active ? "Active" : "Inactive"}`
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Subscribers exported" });
  };

  const filteredSubscribers = subscribers.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = subscribers.filter(s => s.is_active).length;
  const thisMonthCount = subscribers.filter(s => {
    const subDate = new Date(s.subscribed_at);
    const now = new Date();
    return subDate.getMonth() === now.getMonth() && subDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
        <Button onClick={handleExport} variant="outline" disabled={subscribers.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{subscribers.length}</p>
            <p className="text-sm text-muted-foreground">Total Subscribers</p>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
            <Mail className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{activeCount}</p>
            <p className="text-sm text-muted-foreground">Active Subscribers</p>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{thisMonthCount}</p>
            <p className="text-sm text-muted-foreground">This Month</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Subscribed</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredSubscribers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  {search ? "No subscribers match your search" : "No subscribers yet. They'll appear here when users subscribe."}
                </TableCell>
              </TableRow>
            ) : (
              filteredSubscribers.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.email}</TableCell>
                  <TableCell>{new Date(s.subscribed_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={s.is_active ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => handleToggleActive(s)}
                    >
                      {s.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(s.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
