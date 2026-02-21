import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { TablePagination, paginate } from "@/components/admin/TablePagination";
import { 
  Eye, Trash2, Search, MessageSquare, Clock, CheckCircle, X, 
  Phone, Mail, MapPin, Calendar, Download, Filter, User,
  ArrowUpRight, AlertCircle, Inbox, XCircle, UserPlus
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  assigned_to: string | null;
}

interface StaffHandler {
  user_id: string;
  email: string;
}

const statusOptions = [
  { value: "pending", label: "Pending", icon: AlertCircle, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { value: "contacted", label: "Contacted", icon: Phone, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { value: "closed", label: "Closed", icon: CheckCircle, color: "bg-green-500/10 text-green-600 border-green-500/20" },
  { value: "lost", label: "Lost", icon: XCircle, color: "bg-red-500/10 text-red-600 border-red-500/20" },
];

const dateFilters = [
  { value: "all", label: "All Time" },
  { value: "7d", label: "7 Days" },
  { value: "1m", label: "1 Month" },
  { value: "6m", label: "6 Months" },
  { value: "1y", label: "1 Year" },
];

const getDateThreshold = (filter: string): Date | null => {
  const now = new Date();
  switch (filter) {
    case "7d": return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "1m": return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    case "6m": return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    case "1y": return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    default: return null;
  }
};

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
  const { userRole, isAdmin } = useAuth();
  const isEnquiryHandler = userRole === "enquiry_handler";
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [handlers, setHandlers] = useState<StaffHandler[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { 
    fetchEnquiries(); 
    if (isAdmin) fetchHandlers();
  }, [isAdmin]);

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

  const fetchHandlers = async () => {
    // Get all users with enquiry_handler role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "enquiry_handler");
    
    if (!roleData || roleData.length === 0) {
      setHandlers([]);
      return;
    }

    // Get emails via edge function
    const { data: staffData } = await supabase.functions.invoke("manage-staff", {
      body: { action: "list" },
    });

    if (staffData?.staff) {
      const handlerIds = new Set(roleData.map(r => r.user_id));
      const handlerList: StaffHandler[] = staffData.staff
        .filter((s: any) => handlerIds.has(s.user_id))
        .map((s: any) => ({ user_id: s.user_id, email: s.email }));
      setHandlers(handlerList);
    }
  };

  const handleAssign = async (enquiryId: string, handlerUserId: string | null) => {
    const assignValue = handlerUserId === "unassign" ? null : handlerUserId;
    const { error } = await supabase
      .from("enquiries")
      .update({ assigned_to: assignValue })
      .eq("id", enquiryId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: assignValue ? "Enquiry assigned" : "Enquiry unassigned" });
      fetchEnquiries();
      if (selectedEnquiry?.id === enquiryId) {
        setSelectedEnquiry({ ...selectedEnquiry, assigned_to: assignValue });
      }
    }
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
    if (isEnquiryHandler) return;
    if (!confirm("Delete this enquiry permanently?")) return;
    
    const { error } = await supabase.from("enquiries").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Enquiry deleted" });
      fetchEnquiries();
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Destination", "Travel Date", "Travelers", "Message", "Status", "Assigned To", "Date"];
    const csvData = filteredEnquiries.map(e => [
      e.name, e.email, e.phone || "", e.destination || "", e.travel_date || "",
      e.travelers?.toString() || "1", e.message?.replace(/,/g, ";") || "",
      e.status, getHandlerEmail(e.assigned_to) || "Unassigned",
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

  const getHandlerEmail = (userId: string | null) => {
    if (!userId) return null;
    return handlers.find(h => h.user_id === userId)?.email || null;
  };

  const filteredEnquiries = useMemo(() => {
    const dateThreshold = getDateThreshold(dateFilter);
    return enquiries.filter(e => {
      const matchesSearch = 
        e.name?.toLowerCase().includes(search.toLowerCase()) ||
        e.email?.toLowerCase().includes(search.toLowerCase()) ||
        e.destination?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || e.status === statusFilter;
      const matchesDate = !dateThreshold || new Date(e.created_at) >= dateThreshold;
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [enquiries, search, statusFilter, dateFilter]);

  // Stats based on current date filter
  const stats = useMemo(() => {
    const dateThreshold = getDateThreshold(dateFilter);
    const filtered = dateThreshold 
      ? enquiries.filter(e => new Date(e.created_at) >= dateThreshold) 
      : enquiries;
    return {
      pending: filtered.filter(e => e.status === "pending").length,
      contacted: filtered.filter(e => e.status === "contacted").length,
      closed: filtered.filter(e => e.status === "closed").length,
      lost: filtered.filter(e => e.status === "lost").length,
    };
  }, [enquiries, dateFilter]);

  const getStatusMeta = (status: string) => statusOptions.find(s => s.value === status) || statusOptions[0];

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
          <p className="text-muted-foreground text-sm mt-1">
            {isEnquiryHandler ? "View and update your assigned enquiries" : "Manage, assign, and respond to customer enquiries"}
          </p>
        </div>
        {!isEnquiryHandler && (
          <Button variant="outline" onClick={exportToCSV} className="gap-2">
            <Download className="h-4 w-4" />Export CSV
          </Button>
        )}
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statusOptions.map(({ value, label, icon: Icon, color }) => (
          <Card 
            key={value}
            className={`border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${statusFilter === value ? 'ring-2 ring-primary' : ''}`} 
            onClick={() => { setStatusFilter(statusFilter === value ? "all" : value); setCurrentPage(1); }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats[value as keyof typeof stats]}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, email, destination..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" /><SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={(v) => { setDateFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[140px]">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" /><SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dateFilters.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
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
          <>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="font-semibold">Contact</TableHead>
                <TableHead className="font-semibold">Destination</TableHead>
                <TableHead className="font-semibold">Travel Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                {isAdmin && <TableHead className="font-semibold">Assigned To</TableHead>}
                <TableHead className="font-semibold">Time</TableHead>
                <TableHead className="w-[100px] font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 8 : 7} className="text-center py-12">
                    <Inbox className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {search || statusFilter !== "all" || dateFilter !== "all"
                        ? "No enquiries match your filters" 
                        : isEnquiryHandler ? "No enquiries assigned to you yet." : "No enquiries yet."}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                paginate(filteredEnquiries, currentPage).map((e) => {
                  const meta = getStatusMeta(e.status);
                  return (
                    <TableRow key={e.id} className={`group hover:bg-muted/30 transition-colors ${e.status === "pending" ? "bg-blue-500/5" : ""}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">{e.name?.charAt(0).toUpperCase() || "?"}</span>
                          </div>
                          <div>
                            <p className="font-medium">{e.name || "-"}</p>
                            {e.message && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{e.message}</p>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <a href={`mailto:${e.email}`} className="flex items-center gap-1 text-sm hover:text-primary transition-colors"><Mail className="h-3 w-3" />{e.email || "-"}</a>
                          {e.phone && <a href={`tel:${e.phone}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"><Phone className="h-3 w-3" />{e.phone}</a>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {e.destination ? <div className="flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" />{e.destination}</div> : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell>
                        {e.travel_date ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {(() => { const [y, m, d] = e.travel_date!.split('-'); return `${d}/${m}/${y}`; })()}
                          </div>
                        ) : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell>
                        <Select value={e.status} onValueChange={(v) => handleStatusChange(e.id, v)}>
                          <SelectTrigger className="w-[130px] h-8 border-0 bg-transparent">
                            <Badge className={meta.color}>
                              <meta.icon className="h-3 w-3 mr-1" />{meta.label}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <Select 
                            value={e.assigned_to || "unassigned"} 
                            onValueChange={(v) => handleAssign(e.id, v === "unassigned" ? "unassign" : v)}
                          >
                            <SelectTrigger className="w-[160px] h-8">
                              <div className="flex items-center gap-1 text-sm truncate">
                                <UserPlus className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                <span className="truncate">{getHandlerEmail(e.assigned_to) || "Unassigned"}</span>
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unassigned">Unassigned</SelectItem>
                              {handlers.map(h => (
                                <SelectItem key={h.user_id} value={h.user_id}>{h.email}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />{getTimeAgo(e.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedEnquiry(e)} title="View Details"><Eye className="h-4 w-4" /></Button>
                          {!isEnquiryHandler && (
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)} title="Delete" className="hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          <TablePagination currentPage={currentPage} totalItems={filteredEnquiries.length} onPageChange={setCurrentPage} />
          </>
        )}
      </motion.div>

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2"><User className="h-5 w-5" />Enquiry Details</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedEnquiry(null)}><X className="h-5 w-5" /></Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">{selectedEnquiry.name?.charAt(0).toUpperCase() || "?"}</span>
                </div>
                <div>
                  <p className="font-semibold text-lg">{selectedEnquiry.name}</p>
                  <p className="text-sm text-muted-foreground">Submitted {new Date(selectedEnquiry.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <a href={`mailto:${selectedEnquiry.email}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center"><Mail className="h-5 w-5 text-blue-500" /></div>
                  <div className="flex-1"><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{selectedEnquiry.email}</p></div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                {selectedEnquiry.phone && (
                  <a href={`tel:${selectedEnquiry.phone}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center"><Phone className="h-5 w-5 text-green-500" /></div>
                    <div className="flex-1"><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium">{selectedEnquiry.phone}</p></div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                {selectedEnquiry.destination && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center"><MapPin className="h-5 w-5 text-orange-500" /></div>
                    <div><p className="text-sm text-muted-foreground">Interested Destination</p><p className="font-medium">{selectedEnquiry.destination}</p></div>
                  </div>
                )}
                {(selectedEnquiry.travel_date || selectedEnquiry.travelers) && (
                  <div className="grid grid-cols-2 gap-3">
                    {selectedEnquiry.travel_date && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center"><Calendar className="h-5 w-5 text-purple-500" /></div>
                        <div><p className="text-sm text-muted-foreground">Travel Date</p><p className="font-medium">{(() => { const [y, m, d] = selectedEnquiry.travel_date!.split('-'); return `${d}/${m}/${y}`; })()}</p></div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center"><User className="h-5 w-5 text-indigo-500" /></div>
                      <div><p className="text-sm text-muted-foreground">Travelers</p><p className="font-medium">{selectedEnquiry.travelers || 1}</p></div>
                    </div>
                  </div>
                )}

                {/* Assigned handler info */}
                {isAdmin && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center"><UserPlus className="h-5 w-5 text-cyan-500" /></div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Assigned To</p>
                      <Select 
                        value={selectedEnquiry.assigned_to || "unassigned"} 
                        onValueChange={(v) => handleAssign(selectedEnquiry.id, v === "unassigned" ? "unassign" : v)}
                      >
                        <SelectTrigger className="w-full h-8 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {handlers.map(h => (
                            <SelectItem key={h.user_id} value={h.user_id}>{h.email}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              {selectedEnquiry.message && (
                <div className="p-4 bg-muted/30 rounded-xl border">
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">Message</p>
                  <p className="whitespace-pre-wrap text-sm">{selectedEnquiry.message}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <Select value={selectedEnquiry.status} onValueChange={(v) => handleStatusChange(selectedEnquiry.id, v)}>
                  <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => window.open(`mailto:${selectedEnquiry.email}`)} className="gap-2"><Mail className="h-4 w-4" />Email</Button>
                  {selectedEnquiry.phone && (
                    <Button variant="default" onClick={() => window.open(`https://wa.me/${selectedEnquiry.phone!.replace(/\D/g, "")}`)} className="gap-2 bg-green-500 hover:bg-green-600"><Phone className="h-4 w-4" />WhatsApp</Button>
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
