import { useState, useEffect } from "react";
import { TablePagination, paginate } from "@/components/admin/TablePagination";
import { Plus, Pencil, Trash2, X, Tags, Search, FileText, LayoutGrid, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
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

export default function AdminCategories() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("categories").select("*").order("name");
    if (data) setCategories(data);
    setLoading(false);
  };

  const resetForm = () => {
    setForm({ name: "", slug: "", description: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || "" });
    setEditing(cat);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-");
    const payload = { name: form.name, slug, description: form.description || null };

    if (editing) {
      const { error } = await supabase.from("categories").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Success", description: "Category updated successfully" });
    } else {
      const { error } = await supabase.from("categories").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Success", description: "Category created successfully" });
    }
    resetForm();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? This may affect associated visas.")) return;
    await supabase.from("categories").delete().eq("id", id);
    toast({ title: "Deleted", description: "Category removed successfully" });
    fetchData();
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const stats = {
    total: categories.length,
    withDescription: categories.filter(c => c.description).length,
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
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
            <Tags className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Manage Categories</h1>
            <p className="text-muted-foreground text-sm">Organize your visa types into categories</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200/50 dark:border-purple-800/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Categories</p>
                <p className="text-3xl font-bold text-purple-600">{stats.total}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <LayoutGrid className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/50 dark:border-blue-800/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">With Description</p>
                <p className="text-3xl font-bold text-blue-600">{stats.withDescription}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-200/50 dark:border-amber-800/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-3xl font-bold text-amber-600">
                  {stats.total > 0 ? Math.round((stats.withDescription / stats.total) * 100) : 0}%
                </p>
              </div>
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <Sparkles className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search Bar */}
      <motion.div variants={itemVariants} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories by name, slug, or description..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          className="pl-10"
        />
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
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Tags className="h-5 w-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold">{editing ? "Edit" : "Add"} Category</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Tags className="h-4 w-4 text-muted-foreground" />
                    Category Name *
                  </Label>
                  <Input 
                    required 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Popular Destinations" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Slug
                  </Label>
                  <Input 
                    value={form.slug} 
                    onChange={(e) => setForm({ ...form, slug: e.target.value })} 
                    placeholder="auto-generated if empty" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Description
                  </Label>
                  <Textarea 
                    value={form.description} 
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief description of this category..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  >
                    {editing ? "Update Category" : "Create Category"}
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
              <TableHead className="font-semibold">Category Name</TableHead>
              <TableHead className="font-semibold">Slug</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="w-[120px] font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-muted-foreground">Loading categories...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 rounded-full bg-muted">
                      <Tags className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">No categories found</p>
                      <p className="text-sm text-muted-foreground">
                        {searchQuery ? "Try adjusting your search" : "Click \"Add Category\" to create one"}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginate(filteredCategories, currentPage).map((c, index) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                        <Tags className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-medium">{c.name || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {c.slug || "-"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <span className="text-muted-foreground line-clamp-2">{c.description || "-"}</span>
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
        <TablePagination currentPage={currentPage} totalItems={filteredCategories.length} onPageChange={setCurrentPage} />
      </motion.div>
    </motion.div>
  );
}
