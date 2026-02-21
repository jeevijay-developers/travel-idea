import { useState, useEffect } from "react";
import { TablePagination, paginate } from "@/components/admin/TablePagination";
import { Plus, Pencil, Trash2, X, Globe, Search, MapPin, Flag, Map, Hash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Country {
  id: string;
  name: string;
  slug: string;
  code: string;
  region: string | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const regions = ["Asia", "Europe", "Africa", "North America", "South America", "Oceania", "Middle East"];

export default function AdminCountries() {
  const { toast } = useToast();
  const [countries, setCountries] = useState<Country[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Country | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", code: "", region: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("countries").select("*").order("name");
    if (data) setCountries(data);
    setLoading(false);
  };

  const resetForm = () => {
    setForm({ name: "", slug: "", code: "", region: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (country: Country) => {
    setForm({ name: country.name, slug: country.slug, code: country.code, region: country.region || "" });
    setEditing(country);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-");
    const payload = { name: form.name, slug, code: form.code.toUpperCase(), region: form.region || null };

    if (editing) {
      const { error } = await supabase.from("countries").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Success", description: "Country updated successfully" });
    } else {
      const { error } = await supabase.from("countries").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Success", description: "Country created successfully" });
    }
    resetForm();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this country? This will also delete associated visas.")) return;
    await supabase.from("countries").delete().eq("id", id);
    toast({ title: "Deleted", description: "Country removed successfully" });
    fetchData();
  };

  const filteredCountries = countries.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.region && c.region.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRegion = regionFilter === "all" || c.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  // Get unique regions from countries
  const uniqueRegions = [...new Set(countries.map(c => c.region).filter(Boolean))] as string[];

  const stats = {
    total: countries.length,
    byRegion: uniqueRegions.length,
    withRegion: countries.filter(c => c.region).length,
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Manage Countries</h1>
            <p className="text-muted-foreground text-sm">Add and manage destination countries</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Country
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 border-teal-200/50 dark:border-teal-800/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Countries</p>
                <p className="text-3xl font-bold text-teal-600">{stats.total}</p>
              </div>
              <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900/30">
                <Globe className="h-5 w-5 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-200/50 dark:border-indigo-800/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Regions Covered</p>
                <p className="text-3xl font-bold text-indigo-600">{stats.byRegion}</p>
              </div>
              <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                <Map className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-200/50 dark:border-emerald-800/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">With Region Tag</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.withRegion}</p>
              </div>
              <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search countries by name, code, or region..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-10"
          />
        </div>
        <Select value={regionFilter} onValueChange={(v) => { setRegionFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Map className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {uniqueRegions.map(region => (
              <SelectItem key={region} value={region}>{region}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border rounded-xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30">
                    <Globe className="h-5 w-5 text-teal-600" />
                  </div>
                  <h2 className="text-xl font-bold">{editing ? "Edit" : "Add"} Country</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    Country Name *
                  </Label>
                  <Input 
                    required 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., United Arab Emirates"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      Slug
                    </Label>
                    <Input 
                      value={form.slug} 
                      onChange={(e) => setForm({ ...form, slug: e.target.value })} 
                      placeholder="auto-generated" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-muted-foreground" />
                      Country Code *
                    </Label>
                    <Input 
                      required 
                      maxLength={2} 
                      value={form.code} 
                      onChange={(e) => setForm({ ...form, code: e.target.value })} 
                      placeholder="e.g., AE"
                      className="uppercase"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Map className="h-4 w-4 text-muted-foreground" />
                    Region
                  </Label>
                  <Select value={form.region} onValueChange={(value) => setForm({ ...form, region: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                  >
                    {editing ? "Update Country" : "Create Country"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <motion.div variants={itemVariants} className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Country</TableHead>
              <TableHead className="font-semibold">Code</TableHead>
              <TableHead className="font-semibold">Slug</TableHead>
              <TableHead className="font-semibold">Region</TableHead>
              <TableHead className="w-[120px] font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-muted-foreground">Loading countries...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCountries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 rounded-full bg-muted">
                      <Globe className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">No countries found</p>
                      <p className="text-sm text-muted-foreground">
                        {searchQuery || regionFilter !== "all" ? "Try adjusting your filters" : "Click \"Add Country\" to create one"}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginate(filteredCountries, currentPage).map((c, index) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-6 rounded overflow-hidden shadow-sm border">
                        <img 
                          src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                          alt={`${c.name} flag`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/40x30?text=?";
                          }}
                        />
                      </div>
                      <span className="font-medium">{c.name || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono font-bold">
                      {c.code || "-"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {c.slug || "-"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {c.region ? (
                      <Badge className="bg-gradient-to-r from-teal-500/20 to-teal-600/20 text-teal-700 dark:text-teal-300 border-teal-300/50">
                        <MapPin className="h-3 w-3 mr-1" />
                        {c.region}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEdit(c)}
                        className="hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(c.id)}
                        className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination currentPage={currentPage} totalItems={filteredCountries.length} onPageChange={setCurrentPage} />
      </motion.div>
    </motion.div>
  );
}
