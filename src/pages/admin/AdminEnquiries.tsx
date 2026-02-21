import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Eye, Trash2, Search, MessageSquare, Clock, CheckCircle, X, 
  Phone, Mail, MapPin, Calendar, Download, Filter, User,
  ArrowUpRight, AlertCircle, Inbox
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  visa_id: string | null;
  travel_date: string | null;
  travelers: number | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

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
    
    const { error } = await supabase.from("enquiries").delete().eq("id", id);

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

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Destination", "Travel Date", "Travelers", "Message", "Status", "Date"];
    const csvData = filteredEnquiries.map(e => [
      e.name,
      e.email,
      e.phone || "",
      e.destination || "",
      e.travel_date || "",
      e.travelers?.toString() || "1",
      e.message?.replace(/,/g, ";") || "",
      e.status,
      new Date(e.created_at).toLocaleString()
    ]);
    
    const csv = [headers.join(","), ...csvData.map(row => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enquiries-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast({ title: "Exported successfully" });
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
      case "new": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "contacted": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "resolved": return "bg-green-500/10 text-green-600 border-green-500/20";
      default: return "";
    }
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Inbox className="h-6 w-6 text-blue-500" />
            Customer Enquiries
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and respond to customer enquiries</p>
        </div>
        <Button variant="outline" onClick={exportToCSV} className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-500/10 to-blue-500/5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("new")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{newCount}</p>
                  <p className="text-sm text-muted-foreground">New Enquiries</p>
                </div>
              </div>
              {newCount > 0 && (
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-500/10 to-amber-500/5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("contacted")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold">{contactedCount}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-500/10 to-green-500/5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("resolved")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold">{resolvedCount}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants} className="bg-card border rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading enquiries...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="font-semibold">Contact</TableHead>
                <TableHead className="font-semibold">Destination</TableHead>
                <TableHead className="font-semibold">Travel Date</TableHead>
                <TableHead className="font-semibold">Travelers</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Time</TableHead>
                <TableHead className="w-[100px] font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <Inbox className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {search || statusFilter !== "all" 
                        ? "No enquiries match your filters" 
                        : "No enquiries yet. Enquiries will appear here when users submit the contact form."}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEnquiries.map((e) => (
                  <TableRow 
                    key={e.id} 
                    className={`group hover:bg-muted/30 transition-colors ${e.status === "new" ? "bg-blue-500/5" : ""}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {e.name?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{e.name || "-"}</p>
                          {e.message && (
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{e.message}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <a href={`mailto:${e.email}`} className="flex items-center gap-1 text-sm hover:text-primary transition-colors">
                          <Mail className="h-3 w-3" />
                          {e.email || "-"}
                        </a>
                        {e.phone && (
                          <a href={`tel:${e.phone}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                            <Phone className="h-3 w-3" />
                            {e.phone}
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {e.destination ? (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {e.destination}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {e.travel_date ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {new Date(e.travel_date).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <User className="h-3 w-3 text-muted-foreground" />
                        {e.travelers || 1}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select value={e.status} onValueChange={(v) => handleStatusChange(e.id, v)}>
                        <SelectTrigger className="w-[130px] h-8 border-0 bg-transparent">
                          <Badge className={getStatusColor(e.status)}>
                            {e.status === "new" && <AlertCircle className="h-3 w-3 mr-1" />}
                            {e.status === "contacted" && <Clock className="h-3 w-3 mr-1" />}
                            {e.status === "resolved" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {e.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {getTimeAgo(e.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedEnquiry(e)} title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(e.id)}
                          title="Delete"
                          className="hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </motion.div>

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border rounded-2xl p-6 w-full max-w-lg shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <User className="h-5 w-5" />
                Enquiry Details
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedEnquiry(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Customer Info */}
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">
                    {selectedEnquiry.name?.charAt(0).toUpperCase() || "?"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-lg">{selectedEnquiry.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Submitted {new Date(selectedEnquiry.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <a 
                  href={`mailto:${selectedEnquiry.email}`} 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedEnquiry.email}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                
                {selectedEnquiry.phone && (
                  <a 
                    href={`tel:${selectedEnquiry.phone}`} 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedEnquiry.phone}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                
                {selectedEnquiry.destination && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Interested Destination</p>
                      <p className="font-medium">{selectedEnquiry.destination}</p>
                    </div>
                  </div>
                )}

                {/* Travel Details */}
                {(selectedEnquiry.travel_date || selectedEnquiry.travelers) && (
                  <div className="grid grid-cols-2 gap-3">
                    {selectedEnquiry.travel_date && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Travel Date</p>
                          <p className="font-medium">{new Date(selectedEnquiry.travel_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Travelers</p>
                        <p className="font-medium">{selectedEnquiry.travelers || 1}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message */}
              {selectedEnquiry.message && (
                <div className="p-4 bg-muted/30 rounded-xl border">
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">Message</p>
                  <p className="whitespace-pre-wrap text-sm">{selectedEnquiry.message}</p>
                </div>
              )}

              {/* Actions */}
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
                  <Button variant="outline" onClick={() => window.open(`mailto:${selectedEnquiry.email}`)} className="gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>
                  {selectedEnquiry.phone && (
                    <Button variant="default" onClick={() => window.open(`https://wa.me/${selectedEnquiry.phone.replace(/\D/g, "")}`)} className="gap-2 bg-green-500 hover:bg-green-600">
                      <Phone className="h-4 w-4" />
                      WhatsApp
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
