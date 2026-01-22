import { useState, useEffect } from "react";
import { Eye, Trash2, Search, MessageSquare, Clock, CheckCircle, X, Phone, Mail, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  destination: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

export default function AdminEnquiries() {
  const { toast } = useToast();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setEnquiries(data || []);
    }
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("enquiries")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Status updated" });
      fetchEnquiries();
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this enquiry permanently?")) return;
    
    const { error } = await supabase
      .from("enquiries")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Enquiry deleted" });
      fetchEnquiries();
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(null);
      }
    }
  };

  const filteredEnquiries = enquiries.filter(e => {
    const matchesSearch = 
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase()) ||
      e.destination?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const newCount = enquiries.filter(e => e.status === "new").length;
  const contactedCount = enquiries.filter(e => e.status === "contacted").length;
  const resolvedCount = enquiries.filter(e => e.status === "resolved").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "default";
      case "contacted": return "secondary";
      case "resolved": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Enquiries</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{newCount}</p>
            <p className="text-sm text-muted-foreground">New Enquiries</p>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
            <Clock className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{contactedCount}</p>
            <p className="text-sm text-muted-foreground">Contacted</p>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{resolvedCount}</p>
            <p className="text-sm text-muted-foreground">Resolved</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredEnquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {search || statusFilter !== "all" 
                    ? "No enquiries match your filters" 
                    : "No enquiries yet. Enquiries will appear here when users submit the contact form."}
                </TableCell>
              </TableRow>
            ) : (
              filteredEnquiries.map((e) => (
                <TableRow key={e.id} className={e.status === "new" ? "bg-blue-500/5" : ""}>
                  <TableCell className="font-medium">{e.name || "-"}</TableCell>
                  <TableCell>{e.email || "-"}</TableCell>
                  <TableCell>{e.destination || "-"}</TableCell>
                  <TableCell>
                    <Select value={e.status} onValueChange={(v) => handleStatusChange(e.id, v)}>
                      <SelectTrigger className="w-[120px] h-8">
                        <Badge variant={getStatusColor(e.status)}>{e.status}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{e.created_at ? new Date(e.created_at).toLocaleDateString() : "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedEnquiry(e)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Enquiry Details</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedEnquiry(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {selectedEnquiry.name?.charAt(0).toUpperCase() || "?"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{selectedEnquiry.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Submitted {new Date(selectedEnquiry.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                <a href={`mailto:${selectedEnquiry.email}`} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEnquiry.email}</span>
                </a>
                {selectedEnquiry.phone && (
                  <a href={`tel:${selectedEnquiry.phone}`} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEnquiry.phone}</span>
                  </a>
                )}
                {selectedEnquiry.destination && (
                  <div className="flex items-center gap-3 p-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Interested in: <strong>{selectedEnquiry.destination}</strong></span>
                  </div>
                )}
              </div>

              {selectedEnquiry.message && (
                <div className="p-4 bg-muted/30 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Message</p>
                  <p className="whitespace-pre-wrap">{selectedEnquiry.message}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <Select value={selectedEnquiry.status} onValueChange={(v) => handleStatusChange(selectedEnquiry.id, v)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => window.open(`mailto:${selectedEnquiry.email}`)}>
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  {selectedEnquiry.phone && (
                    <Button variant="outline" onClick={() => window.open(`https://wa.me/${selectedEnquiry.phone.replace(/\D/g, "")}`)}>
                      <Phone className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}