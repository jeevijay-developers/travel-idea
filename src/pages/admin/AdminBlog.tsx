import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
}

export default function AdminBlog() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", cover_image: "", category: "", author: "Travel Idea Team", is_published: false
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data);
  };

  const resetForm = () => {
    setForm({ title: "", slug: "", excerpt: "", content: "", cover_image: "", category: "", author: "Travel Idea Team", is_published: false });
    setEditing(null);
    setShowForm(false);
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
      toast({ title: "Post updated" });
    } else {
      const { error } = await supabase.from("blog_posts").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Post created" });
    }
    resetForm();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    toast({ title: "Post deleted" });
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Blog Posts</h1>
        <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4 mr-2" />Add Post</Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editing ? "Edit" : "Add"} Blog Post</h2>
              <Button variant="ghost" size="icon" onClick={resetForm}><X /></Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g., Visa Tips" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cover Image URL</Label>
                <Input value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Short summary..." />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <RichTextEditor 
                  content={form.content} 
                  onChange={(content) => setForm({ ...form, content })} 
                  placeholder="Write your blog content here..."
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Author</Label>
                  <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} />
                  <Label>Publish immediately</Label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit">{editing ? "Update" : "Create"} Post</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-card border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No blog posts found. Click "Add Post" to create one.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title || "-"}</TableCell>
                  <TableCell>{p.category || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={p.is_published ? "default" : "secondary"}>
                      {p.is_published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>{p.created_at ? new Date(p.created_at).toLocaleDateString() : "-"}</TableCell>
                  <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => togglePublish(p)} title={p.is_published ? "Unpublish" : "Publish"}>
                      {p.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
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