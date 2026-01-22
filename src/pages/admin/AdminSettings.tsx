import { useState, useEffect } from "react";
import { Save, Phone, Mail, MapPin, Clock, Globe, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContactSettings {
  phone: string;
  email: string;
  whatsapp: string;
  head_office: { name: string; address: string };
  branch_office: { name: string; address: string };
  business_hours: string;
}

interface SocialSettings {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}

export default function AdminSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [contact, setContact] = useState<ContactSettings>({
    phone: "",
    email: "",
    whatsapp: "",
    head_office: { name: "", address: "" },
    branch_office: { name: "", address: "" },
    business_hours: ""
  });

  const [social, setSocial] = useState<SocialSettings>({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    youtube: ""
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_settings")
      .select("*");

    if (error) {
      toast({ title: "Error loading settings", description: error.message, variant: "destructive" });
    } else if (data) {
      data.forEach(setting => {
        if (setting.setting_key === "contact") {
          setContact(setting.setting_value as unknown as ContactSettings);
        } else if (setting.setting_key === "social") {
          setSocial(setting.setting_value as unknown as SocialSettings);
        }
      });
    }
    setLoading(false);
  };

  const handleSaveContact = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({ setting_value: JSON.parse(JSON.stringify(contact)) })
      .eq("setting_key", "contact");

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Contact settings saved!" });
    }
    setSaving(false);
  };

  const handleSaveSocial = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({ setting_value: JSON.parse(JSON.stringify(social)) })
      .eq("setting_key", "social");

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Social settings saved!" });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Site Settings</h1>

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="contact">Contact Details</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="guidelines">Image Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="contact">
          <div className="bg-card border rounded-xl p-6">
            <div className="grid gap-6">
              {/* Phone & Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Phone Number
                  </Label>
                  <Input
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    placeholder="+91 9101197909"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email Address
                  </Label>
                  <Input
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    placeholder="b2b@travelidea.in"
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4" /> WhatsApp Number (without + symbol)
                </Label>
                <Input
                  value={contact.whatsapp}
                  onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                  placeholder="919101197909"
                />
                <p className="text-xs text-muted-foreground">Used for the floating WhatsApp button</p>
              </div>

              {/* Head Office */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Head Office
                </Label>
                <Input
                  value={contact.head_office.name}
                  onChange={(e) => setContact({ 
                    ...contact, 
                    head_office: { ...contact.head_office, name: e.target.value }
                  })}
                  placeholder="Head Office - Tezpur"
                  className="mb-2"
                />
                <Textarea
                  value={contact.head_office.address}
                  onChange={(e) => setContact({ 
                    ...contact, 
                    head_office: { ...contact.head_office, address: e.target.value }
                  })}
                  placeholder="Full address..."
                  rows={2}
                />
              </div>

              {/* Branch Office */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Branch Office
                </Label>
                <Input
                  value={contact.branch_office.name}
                  onChange={(e) => setContact({ 
                    ...contact, 
                    branch_office: { ...contact.branch_office, name: e.target.value }
                  })}
                  placeholder="Branch Office - Kolkata"
                  className="mb-2"
                />
                <Textarea
                  value={contact.branch_office.address}
                  onChange={(e) => setContact({ 
                    ...contact, 
                    branch_office: { ...contact.branch_office, address: e.target.value }
                  })}
                  placeholder="Full address..."
                  rows={2}
                />
              </div>

              {/* Business Hours */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Business Hours
                </Label>
                <Input
                  value={contact.business_hours}
                  onChange={(e) => setContact({ ...contact, business_hours: e.target.value })}
                  placeholder="Mon - Sat: 9AM - 7PM"
                />
              </div>

              <Button onClick={handleSaveContact} disabled={saving} className="w-full sm:w-auto">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Contact Settings
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="social">
          <div className="bg-card border rounded-xl p-6">
            <div className="grid gap-4">
              {Object.entries(social).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label className="capitalize">{key}</Label>
                  <Input
                    value={value}
                    onChange={(e) => setSocial({ ...social, [key]: e.target.value })}
                    placeholder={`https://${key}.com/your-page`}
                  />
                </div>
              ))}

              <Button onClick={handleSaveSocial} disabled={saving} className="w-full sm:w-auto mt-4">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Social Settings
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="guidelines">
          <div className="bg-card border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Image Upload Guidelines</h2>
            <p className="text-muted-foreground mb-6">
              For best results, please follow these recommended image sizes:
            </p>
            
            <div className="grid gap-4">
              <div className="p-4 bg-muted/50 rounded-lg border">
                <h3 className="font-medium mb-2">📝 Blog Cover Images</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Recommended:</strong> 1200 x 630 pixels (16:9 ratio)</li>
                  <li>• <strong>Minimum:</strong> 800 x 450 pixels</li>
                  <li>• <strong>Max file size:</strong> 5MB</li>
                  <li>• <strong>Formats:</strong> JPG, PNG, WebP</li>
                </ul>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border">
                <h3 className="font-medium mb-2">🌍 Country Images</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Recommended:</strong> 800 x 600 pixels (4:3 ratio)</li>
                  <li>• <strong>Minimum:</strong> 400 x 300 pixels</li>
                  <li>• <strong>Max file size:</strong> 2MB</li>
                  <li>• <strong>Tip:</strong> Use landscape photos showing iconic landmarks</li>
                </ul>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border">
                <h3 className="font-medium mb-2">🏷️ Category Icons</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Recommended:</strong> 200 x 200 pixels (1:1 ratio)</li>
                  <li>• <strong>Format:</strong> PNG with transparent background preferred</li>
                  <li>• <strong>Max file size:</strong> 500KB</li>
                </ul>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border">
                <h3 className="font-medium mb-2">✈️ Visa Product Images</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Images are inherited from the country</li>
                  <li>• Ensure country has a high-quality image set</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <h3 className="font-medium mb-2 text-blue-600">💡 Pro Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Compress images before uploading for faster load times</li>
                  <li>• Use tools like TinyPNG or Squoosh to optimize images</li>
                  <li>• Ensure images are properly licensed for commercial use</li>
                  <li>• Avoid text in images - it won't be translated</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
