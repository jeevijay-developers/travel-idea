import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
  countries?: { name: string };
}

interface Country {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

export default function AdminVisas() {
  const { toast } = useToast();
  const [visas, setVisas] = useState<Visa[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Visa | null>(null);
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
    const [visasRes, countriesRes, categoriesRes] = await Promise.all([
      supabase.from("visas").select("*, countries(name)").order("created_at", { ascending: false }),
      supabase.from("countries").select("id, name").order("name"),
      supabase.from("categories").select("id, name").order("name")
    ]);
    if (visasRes.data) setVisas(visasRes.data);
    if (countriesRes.data) setCountries(countriesRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
  };

  const resetForm = () => {
    setForm({
      title: "", visa_type: "eVisa", short_description: "", description: "",
      price: "", additional_fees: "", processing_days: "7", validity: "30 days",
      required_documents: "", country_id: "", category_id: "", is_featured: false, is_fast: false, issued_recently: "0"
    });
    setEditing(null);
    setShowForm(false);
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
      toast({ title: "Visa updated" });
    } else {
      const { error } = await supabase.from("visas").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Visa created" });
    }
    resetForm();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this visa?")) return;
    await supabase.from("visas").delete().eq("id", id);
    toast({ title: "Visa deleted" });
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Visas</h1>
        <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4 mr-2" />Add Visa</Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editing ? "Edit" : "Add"} Visa</h2>
              <Button variant="ghost" size="icon" onClick={resetForm}><X /></Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country *</Label>
                  <Select value={form.country_id} onValueChange={(v) => setForm({ ...form, country_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Visa Type *</Label>
                  <Select value={form.visa_type} onValueChange={(v) => setForm({ ...form, visa_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eVisa">eVisa</SelectItem>
                      <SelectItem value="Sticker">Sticker</SelectItem>
                      <SelectItem value="eNTRI">eNTRI</SelectItem>
                      <SelectItem value="On Arrival">On Arrival</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Short Description</Label>
                <Input value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Full Description</Label>
                <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Price (₹) *</Label>
                  <Input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Additional Fees</Label>
                  <Input value={form.additional_fees} onChange={(e) => setForm({ ...form, additional_fees: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Processing Days *</Label>
                  <Input type="number" required value={form.processing_days} onChange={(e) => setForm({ ...form, processing_days: e.target.value })} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Validity</Label>
                  <Input value={form.validity} onChange={(e) => setForm({ ...form, validity: e.target.value })} placeholder="e.g., 30 days" />
                </div>
                <div className="space-y-2">
                  <Label>Issued Recently</Label>
                  <Input type="number" value={form.issued_recently} onChange={(e) => setForm({ ...form, issued_recently: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Required Documents (one per line)</Label>
                <Textarea rows={4} value={form.required_documents} onChange={(e) => setForm({ ...form, required_documents: e.target.value })} placeholder="Valid Passport&#10;Photos&#10;Bank Statement" />
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} />
                  <Label>Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_fast} onCheckedChange={(v) => setForm({ ...form, is_fast: v })} />
                  <Label>Fast Processing</Label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit">{editing ? "Update" : "Create"} Visa</Button>
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
              <TableHead>Country</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Days</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No visas found. Click "Add Visa" to create one.
                </TableCell>
              </TableRow>
            ) : (
              visas.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.title || "-"}</TableCell>
                  <TableCell>{v.countries?.name || "-"}</TableCell>
                  <TableCell>{v.visa_type || "-"}</TableCell>
                  <TableCell>₹{v.price?.toLocaleString() || "0"}</TableCell>
                  <TableCell>{v.processing_days ?? "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(v)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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