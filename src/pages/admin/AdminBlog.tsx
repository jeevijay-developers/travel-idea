import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Pencil, Trash2, X, Eye, EyeOff, Upload, Loader2, 
  FileText, Calendar, User, Tag, Search, Image as ImageIcon,
  BookOpen, CheckCircle, AlertCircle, ExternalLink
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  category: string | null;
  author: string | null;
  is_published: boolean;
  created_at: string;
  published_at: string | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const categoryOptions = [
  "Visa Tips",
  "Travel Guide",
  "Destinations",
  "News",
  "How-To",
  "Country Guide",
  "Travel Insurance",
  "Packing Tips"
];

export default function AdminBlog() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [form, setForm] = useState({
    title: "", 
    slug: "", 
    excerpt: "", 
    content: "", 
    cover_image: "", 
    category: "", 
    author: "Travel Idea Team", 
    is_published: false
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  const resetForm = () => {
    setForm({ 
      title: "", slug: "", excerpt: "", content: "", cover_image: "", 
      category: "", author: "Travel Idea Team", is_published: false 
    });
    setEditing(null);
    setShowForm(false);
    setActiveTab("content");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please select an image file", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Error", description: "Image must be less than 5MB", variant: "destructive" });
      return;
    }

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error } = await supabase.storage.from("blog-images").upload(fileName, file);

    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("blog-images").getPublicUrl(fileName);
    setForm({ ...form, cover_image: urlData.publicUrl });
    toast({ title: "Image uploaded successfully" });
    setUploading(false);
  };

  const handleEdit = (post: BlogPost) => {
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content || "",
      cover_image: post.cover_image || "",
      category: post.category || "",
      author: post.author || "Travel Idea Team",
      is_published: post.is_published
    });
    setEditing(post);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" });
      return;
    }

    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const payload = {
      title: form.title,
      slug,
      excerpt: form.excerpt || null,
      content: form.content || null,
      cover_image: form.cover_image || null,
      category: form.category || null,
      author: form.author || "Travel Idea Team",
      is_published: form.is_published,
      published_at: form.is_published ? new Date().toISOString() : null
    };

    if (editing) {
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Success", description: "Post updated successfully" });
    } else {
      const { error } = await supabase.from("blog_posts").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Success", description: "Post created successfully" });
    }
    resetForm();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post? This action cannot be undone.")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    toast({ title: "Deleted", description: "Post has been removed" });
    fetchData();
  };

  const togglePublish = async (post: BlogPost) => {
    await supabase.from("blog_posts").update({ 
      is_published: !post.is_published,
      published_at: !post.is_published ? new Date().toISOString() : null
    }).eq("id", post.id);
    toast({ title: post.is_published ? "Post unpublished" : "Post published" });
    fetchData();
  };

  const filteredPosts = posts.filter((p) => {
    const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
                          p.category?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
                          (filterStatus === "published" && p.is_published) ||
                          (filterStatus === "draft" && !p.is_published);
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalPosts = posts.length;
  const publishedCount = posts.filter(p => p.is_published).length;
  const draftCount = posts.filter(p => !p.is_published).length;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-purple-500" />
            Blog Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Create and manage blog posts</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-500/10 to-purple-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPosts}</p>
                <p className="text-xs text-muted-foreground">Total Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-500/10 to-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{publishedCount}</p>
                <p className="text-xs text-muted-foreground">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-500/10 to-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{draftCount}</p>
                <p className="text-xs text-muted-foreground">Drafts</p>
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
            placeholder="Search posts by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={filterStatus === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            All
          </Button>
          <Button 
            variant={filterStatus === "published" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus("published")}
          >
            Published
          </Button>
          <Button 
            variant={filterStatus === "draft" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus("draft")}
          >
            Drafts
          </Button>
        </div>
      </motion.div>

      {/* Blog Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {editing ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  {editing ? "Edit Blog Post" : "Create New Post"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Write engaging content for your readers</p>
              </div>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="content" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="media" className="gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Media
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="gap-2">
                    <Tag className="h-4 w-4" />
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      Title <span className="text-destructive">*</span>
                    </Label>
                    <Input 
                      value={form.title} 
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Enter an engaging title..."
                      className="text-lg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Excerpt / Summary</Label>
                    <Textarea 
                      rows={2} 
                      value={form.excerpt} 
                      onChange={(e) => setForm({ ...form, excerpt: e.target.value })} 
                      placeholder="Write a brief summary that appears in blog cards..."
                    />
                    <p className="text-xs text-muted-foreground">{form.excerpt.length}/160 characters recommended</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Content</Label>
                    <RichTextEditor 
                      content={form.content} 
                      onChange={(content) => setForm({ ...form, content })} 
                      placeholder="Write your blog content here..."
                    />
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Cover Image
                    </Label>
                    <p className="text-xs text-muted-foreground mb-3">
                      📐 Recommended: 1200 x 630px (16:9) • Max 5MB • JPG, PNG, WebP
                    </p>
                    
                    {form.cover_image ? (
                      <div className="relative rounded-xl overflow-hidden border">
                        <img src={form.cover_image} alt="Cover preview" className="w-full h-48 object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => window.open(form.cover_image, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Full
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setForm({ ...form, cover_image: "" })}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImageIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP up to 5MB</p>
                      </div>
                    )}
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex-1"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-muted-foreground text-sm">URL:</span>
                      </div>
                      <Input 
                        value={form.cover_image} 
                        onChange={(e) => setForm({ ...form, cover_image: e.target.value })} 
                        placeholder="Or paste image URL..."
                        className="pl-12"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>URL Slug</Label>
                      <Input 
                        value={form.slug} 
                        onChange={(e) => setForm({ ...form, slug: e.target.value })} 
                        placeholder="auto-generated-from-title"
                      />
                      <p className="text-xs text-muted-foreground">
                        URL: /blog/{form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "your-post"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border bg-background"
                      >
                        <option value="">Select category</option>
                        {categoryOptions.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Author
                    </Label>
                    <Input 
                      value={form.author} 
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                      placeholder="Author name"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-transparent rounded-xl border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        {form.is_published ? <Eye className="h-5 w-5 text-green-500" /> : <EyeOff className="h-5 w-5 text-muted-foreground" />}
                      </div>
                      <div>
                        <p className="font-medium">{form.is_published ? "Published" : "Draft"}</p>
                        <p className="text-xs text-muted-foreground">
                          {form.is_published ? "This post is visible to everyone" : "Only visible in admin panel"}
                        </p>
                      </div>
                    </div>
                    <Switch 
                      checked={form.is_published} 
                      onCheckedChange={(v) => setForm({ ...form, is_published: v })} 
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-3 pt-6 border-t mt-6">
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" variant="outline" onClick={() => setForm({ ...form, is_published: false })} className="gap-2">
                  Save as Draft
                </Button>
                <Button type="submit" className="flex-1 gap-2">
                  {form.is_published ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      {editing ? "Update & Publish" : "Publish Post"}
                    </>
                  ) : (
                    <>
                      <Pencil className="h-4 w-4" />
                      {editing ? "Update Post" : "Create Post"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Posts Table */}
      <motion.div variants={itemVariants} className="bg-card border rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Post</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Author</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="w-[140px] font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {search || filterStatus !== "all"
                        ? "No posts match your filters"
                        : "No blog posts yet. Click \"New Post\" to create one."}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((p) => (
                  <TableRow key={p.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {p.cover_image ? (
                          <img src={p.cover_image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-purple-500" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium truncate max-w-[200px]">{p.title || "-"}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">/blog/{p.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {p.category ? (
                        <Badge variant="outline">{p.category}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm">{p.author || "-"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.is_published ? "default" : "secondary"} className="gap-1">
                        {p.is_published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {p.is_published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {p.created_at ? new Date(p.created_at).toLocaleDateString() : "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => togglePublish(p)} 
                          title={p.is_published ? "Unpublish" : "Publish"}
                        >
                          {p.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => window.open(`/blog/${p.slug}`, "_blank")}
                          title="Preview"
                          disabled={!p.is_published}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(p)} title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(p.id)}
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
