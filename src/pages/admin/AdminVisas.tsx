import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Pencil, Trash2, X, Search, Filter, Plane, Clock, 
  DollarSign, FileText, Zap, Star, Eye, Globe, CheckCircle,
  ChevronDown, AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Visa {
  id: string;
  title: string;
  visa_type: string;
  price: number;
  processing_days: number;
  is_featured: boolean;
  is_fast: boolean;
  country_id: string;
  category_id: string | null;
  validity: string | null;
  short_description: string | null;
  countries?: { name: string; code: string };
  categories?: { name: string };
}

interface Country {
  id: string;
  name: string;
  code: string;
}

interface Category {
  id: string;
  name: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function AdminVisas() {
  const { toast } = useToast();
  const [visas, setVisas] = useState<Visa[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Visa | null>(null);
  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");
  
  const [form, setForm] = useState({
    title: "",
    visa_type: "eVisa",
    short_description: "",
    description: "",
    price: "",
    additional_fees: "",
    processing_days: "7",
    validity: "30 days",
    required_documents: "",
    country_id: "",
    category_id: "",
    is_featured: false,
    is_fast: false,
    issued_recently: "0"
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [visasRes, countriesRes, categoriesRes] = await Promise.all([
      supabase.from("visas").select("*, countries(name, code), categories(name)").order("created_at", { ascending: false }),
      supabase.from("countries").select("id, name, code").order("name"),
      supabase.from("categories").select("id, name").order("name")
    ]);
    if (visasRes.data) setVisas(visasRes.data);
    if (countriesRes.data) setCountries(countriesRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    setLoading(false);
  };

  const resetForm = () => {
    setForm({
      title: "", visa_type: "eVisa", short_description: "", description: "",
      price: "", additional_fees: "", processing_days: "7", validity: "30 days",
      required_documents: "", country_id: "", category_id: "", is_featured: false, is_fast: false, issued_recently: "0"
    });
    setEditing(null);
    setShowForm(false);
    setActiveTab("basic");
  };

  const handleEdit = async (visa: Visa) => {
    const { data } = await supabase.from("visas").select("*").eq("id", visa.id).single();
    if (data) {
      setForm({
        title: data.title,
        visa_type: data.visa_type,
        short_description: data.short_description || "",
        description: data.description || "",
        price: String(data.price),
        additional_fees: data.additional_fees || "",
        processing_days: String(data.processing_days),
        validity: data.validity || "",
        required_documents: (data.required_documents || []).join("\n"),
        country_id: data.country_id,
        category_id: data.category_id || "",
        is_featured: data.is_featured,
        is_fast: data.is_fast,
        issued_recently: String(data.issued_recently || 0)
      });
      setEditing(data);
      setShowForm(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.country_id || !form.title || !form.price) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const payload = {
      title: form.title,
      visa_type: form.visa_type,
      short_description: form.short_description || null,
      description: form.description || null,
      price: parseFloat(form.price),
      additional_fees: form.additional_fees || null,
      processing_days: parseInt(form.processing_days),
      validity: form.validity || null,
      required_documents: form.required_documents ? form.required_documents.split("\n").filter(Boolean) : null,
      country_id: form.country_id,
      category_id: form.category_id || null,
      is_featured: form.is_featured,
      is_fast: form.is_fast,
      issued_recently: parseInt(form.issued_recently) || 0
    };

    if (editing) {
      const { error } = await supabase.from("visas").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Success", description: "Visa updated successfully" });
    } else {
      const { error } = await supabase.from("visas").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Success", description: "Visa created successfully" });
    }
    resetForm();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this visa? This action cannot be undone.")) return;
    const { error } = await supabase.from("visas").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Deleted", description: "Visa has been removed" });
    fetchData();
  };

  const toggleFeatured = async (visa: Visa) => {
    await supabase.from("visas").update({ is_featured: !visa.is_featured }).eq("id", visa.id);
    toast({ title: visa.is_featured ? "Removed from featured" : "Added to featured" });
    fetchData();
  };

  const filteredVisas = visas.filter((v) => {
    const matchesSearch = v.title?.toLowerCase().includes(search.toLowerCase()) ||
                          v.countries?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = filterCountry === "all" || v.country_id === filterCountry;
    const matchesCategory = filterCategory === "all" || v.category_id === filterCategory;
    return matchesSearch && matchesCountry && matchesCategory;
  });

  // Stats
  const totalVisas = visas.length;
  const featuredCount = visas.filter(v => v.is_featured).length;
  const fastTrackCount = visas.filter(v => v.is_fast).length;
  const avgPrice = visas.length > 0 ? Math.round(visas.reduce((a, b) => a + b.price, 0) / visas.length) : 0;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Plane className="h-6 w-6 text-primary" />
            Manage Visas
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Create and manage visa services</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Visa
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-500/10 to-blue-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalVisas}</p>
                <p className="text-xs text-muted-foreground">Total Visas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-500/10 to-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{featuredCount}</p>
                <p className="text-xs text-muted-foreground">Featured</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-500/10 to-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{fastTrackCount}</p>
                <p className="text-xs text-muted-foreground">Fast Track</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-500/10 to-purple-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{avgPrice.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Avg Price</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search visas by title or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCountry} onValueChange={setFilterCountry}>
          <SelectTrigger className="w-[180px]">
            <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="All Countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Visa Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {editing ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  {editing ? "Edit Visa" : "Create New Visa"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Fill in the visa details below</p>
              </div>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="basic" className="gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Basic</span>
                  </TabsTrigger>
                  <TabsTrigger value="pricing" className="gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="hidden sm:inline">Pricing</span>
                  </TabsTrigger>
                  <TabsTrigger value="details" className="gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="hidden sm:inline">Details</span>
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Documents</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        Country <span className="text-destructive">*</span>
                      </Label>
                      <Select value={form.country_id} onValueChange={(v) => setForm({ ...form, country_id: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              <span className="flex items-center gap-2">
                                <span className="text-lg">{c.code}</span>
                                {c.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        Visa Title <span className="text-destructive">*</span>
                      </Label>
                      <Input 
                        value={form.title} 
                        onChange={(e) => setForm({ ...form, title: e.target.value })} 
                        placeholder="e.g., UAE Tourist Visa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        Visa Type <span className="text-destructive">*</span>
                      </Label>
                      <Select value={form.visa_type} onValueChange={(v) => setForm({ ...form, visa_type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eVisa">eVisa</SelectItem>
                          <SelectItem value="Sticker">Sticker Visa</SelectItem>
                          <SelectItem value="eNTRI">eNTRI</SelectItem>
                          <SelectItem value="On Arrival">On Arrival</SelectItem>
                          <SelectItem value="Tourist">Tourist Visa</SelectItem>
                          <SelectItem value="Business">Business Visa</SelectItem>
                          <SelectItem value="Transit">Transit Visa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Short Description (shown on card)</Label>
                    <Input 
                      value={form.short_description} 
                      onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                      placeholder="Brief description for visa cards..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>About This Visa (full description)</Label>
                    <Textarea 
                      rows={4} 
                      value={form.description} 
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Detailed description about the visa, requirements, benefits..."
                    />
                  </div>
                </TabsContent>

                <TabsContent value="pricing" className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        Price (₹) <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="number" 
                          value={form.price} 
                          onChange={(e) => setForm({ ...form, price: e.target.value })}
                          className="pl-10"
                          placeholder="e.g., 5999"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Additional Fees (if any)</Label>
                      <Input 
                        value={form.additional_fees} 
                        onChange={(e) => setForm({ ...form, additional_fees: e.target.value })}
                        placeholder="e.g., VFS charges: ₹500"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Pricing Tips</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Include all service charges in the main price. Use "Additional Fees" for government or VFS charges that may vary.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        Processing Days <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="number" 
                          value={form.processing_days} 
                          onChange={(e) => setForm({ ...form, processing_days: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Validity</Label>
                      <Input 
                        value={form.validity} 
                        onChange={(e) => setForm({ ...form, validity: e.target.value })} 
                        placeholder="e.g., 30 days, 1 year"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Recently Issued</Label>
                      <Input 
                        type="number" 
                        value={form.issued_recently} 
                        onChange={(e) => setForm({ ...form, issued_recently: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6 pt-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-500/10 to-transparent rounded-xl border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                          <Star className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="font-medium">Featured Visa</p>
                          <p className="text-xs text-muted-foreground">Show on homepage</p>
                        </div>
                      </div>
                      <Switch 
                        checked={form.is_featured} 
                        onCheckedChange={(v) => setForm({ ...form, is_featured: v })} 
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-transparent rounded-xl border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <Zap className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">Fast Track</p>
                          <p className="text-xs text-muted-foreground">Express processing</p>
                        </div>
                      </div>
                      <Switch 
                        checked={form.is_fast} 
                        onCheckedChange={(v) => setForm({ ...form, is_fast: v })} 
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Required Documents
                    </Label>
                    <p className="text-xs text-muted-foreground mb-2">Enter each document on a new line</p>
                    <Textarea 
                      rows={8} 
                      value={form.required_documents} 
                      onChange={(e) => setForm({ ...form, required_documents: e.target.value })}
                      placeholder="Valid Passport (min 6 months validity)&#10;2 Passport size photos (white background)&#10;Bank Statement (last 3 months)&#10;Travel Itinerary&#10;Hotel Booking&#10;Flight Tickets"
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm font-medium text-primary">Documents Preview:</p>
                    <ul className="mt-2 space-y-1">
                      {form.required_documents.split("\n").filter(Boolean).map((doc, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {doc}
                        </li>
                      ))}
                      {!form.required_documents && (
                        <li className="text-sm text-muted-foreground">No documents added yet</li>
                      )}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-3 pt-6 border-t mt-6">
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 gap-2">
                  {editing ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {editing ? "Update Visa" : "Create Visa"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Visa Table */}
      <motion.div variants={itemVariants} className="bg-card border rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading visas...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Visa</TableHead>
                <TableHead className="font-semibold">Country</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Price</TableHead>
                <TableHead className="font-semibold">Processing</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="w-[120px] font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <Plane className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {search || filterCountry !== "all" || filterCategory !== "all"
                        ? "No visas match your filters"
                        : "No visas found. Click \"Add Visa\" to create one."}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredVisas.map((v) => (
                  <TableRow key={v.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Plane className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{v.title || "-"}</p>
                          {v.categories?.name && (
                            <Badge variant="outline" className="text-xs mt-1">{v.categories.name}</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{v.countries?.code}</span>
                        <span>{v.countries?.name || "-"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{v.visa_type || "-"}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">₹{v.price?.toLocaleString() || "0"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{v.processing_days} days</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {v.is_featured && (
                          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1">
                            <Star className="h-3 w-3" /> Featured
                          </Badge>
                        )}
                        {v.is_fast && (
                          <Badge className="bg-green-500/10 text-green-600 border-green-500/20 gap-1">
                            <Zap className="h-3 w-3" /> Fast
                          </Badge>
                        )}
                        {!v.is_featured && !v.is_fast && (
                          <span className="text-muted-foreground text-sm">Standard</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => toggleFeatured(v)}
                          title={v.is_featured ? "Remove from featured" : "Add to featured"}
                        >
                          <Star className={`h-4 w-4 ${v.is_featured ? "fill-amber-500 text-amber-500" : ""}`} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(v)} title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(v.id)}
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
    </motion.div>
  );
}
