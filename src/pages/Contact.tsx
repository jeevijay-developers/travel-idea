import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Layout, PageHero } from "@/components/layout";
import { SEO } from "@/components/seo";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("enquiries").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        destination: formData.destination,
        message: formData.message,
        status: "new"
      });

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({ name: "", email: "", phone: "", destination: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Head Office - Tezpur",
      content: "Ground Floor, G-Square Mall, Tezpur Main Rd, Tezpur 784001",
      accent: true
    },
    {
      icon: MapPin,
      title: "Branch - Kolkata",
      content: "PS Arcadia, 9th Floor, 4A Camac Street, Kolkata 700016",
      accent: false
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+91 9101197909",
      href: "tel:+919101197909",
      accent: true
    },
    {
      icon: Mail,
      title: "Email",
      content: "b2b@travelidea.in",
      href: "mailto:b2b@travelidea.in",
      accent: true
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon - Sat: 9AM - 7PM",
      accent: false
    }
  ];

  return (
    <Layout>
      <SEO 
        title="Contact Us - Travel Idea" 
        description="Get in touch with Travel Idea for visa enquiries. Visit our offices in Tezpur and Kolkata." 
      />

      <PageHero
        title="Contact Us"
        subtitle="Have questions? We're here to help with all your visa needs."
        icon={MessageSquare}
        badge="Get in Touch"
      />

      {/* Contact Info + Form */}
      <section className="py-10">
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold mb-5">Contact Information</h2>
              <div className="space-y-4">
                {contactInfo.map((item, i) => (
                  <motion.div 
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-3"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      item.accent ? "bg-accent/10" : "bg-muted"
                    }`}>
                      <item.icon className={`h-4 w-4 ${item.accent ? "text-accent" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.title}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-medium hover:text-accent transition-colors">
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-sm font-medium">{item.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="bg-card border rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-5">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs">Full Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="destination" className="text-xs">Interested Destination</Label>
                      <Input
                        id="destination"
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        placeholder="e.g., Thailand"
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message" className="text-xs">Message *</Label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we help you?"
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full h-10 bg-accent hover:bg-accent/90" disabled={loading}>
                    {loading ? "Sending..." : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
