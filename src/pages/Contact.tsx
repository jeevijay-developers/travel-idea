import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, CheckCircle, Plane, Globe, Headphones, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Layout, PageHero } from "@/components/layout";
import { SEO } from "@/components/seo";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Import images
import uaeImage from "@/assets/countries/uae.jpg";
import thailandImage from "@/assets/countries/thailand.jpg";
import singaporeImage from "@/assets/countries/singapore.jpg";

const quickLinks = [
  {
    icon: Plane,
    title: "Visa Services",
    description: "Explore all visa options",
    href: "/visas",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    icon: Globe,
    title: "Popular Destinations",
    description: "UAE, Thailand, Singapore",
    href: "/visas",
    color: "from-amber-500/20 to-orange-500/20"
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "We're here to help",
    href: "tel:+919101197909",
    color: "from-emerald-500/20 to-teal-500/20"
  }
];

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
        title="Get in Touch"
        subtitle="Have questions? We're here to help with all your visa needs."
        icon={MessageSquare}
        badge="Contact Us"
      />

      {/* Quick Links Section */}
      <section className="py-8 md:py-10 bg-muted/30 border-b">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {quickLinks.map((link, i) => (
              <motion.a
                key={link.title}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -3, scale: 1.02 }}
                className="flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl bg-card border hover:border-accent/50 hover:shadow-lg transition-all group relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors shrink-0">
                    <link.icon className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm md:text-base">{link.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{link.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-10 md:py-16">
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-8 md:gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full mb-4">
                  Contact Info
                </span>
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">How to Reach Us</h2>
              </motion.div>
              
              <div className="space-y-3 md:space-y-4 mb-8">
                {contactInfo.map((item, i) => (
                  <motion.div 
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 5 }}
                    className={`flex gap-3 md:gap-4 p-3 md:p-4 rounded-xl border transition-all ${
                      item.accent ? 'bg-accent/5 border-accent/20 hover:border-accent/40' : 'bg-card hover:border-border/80'
                    }`}
                  >
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center shrink-0 ${
                      item.accent ? "bg-accent/10" : "bg-muted"
                    }`}>
                      <item.icon className={`h-5 w-5 md:h-6 md:w-6 ${item.accent ? "text-accent" : "text-muted-foreground"}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">{item.title}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm md:text-base font-medium hover:text-accent transition-colors">
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-sm md:text-base font-medium">{item.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mini Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="hidden md:block"
              >
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Popular Destinations</p>
                <div className="grid grid-cols-3 gap-2">
                  {[uaeImage, thailandImage, singaporeImage].map((img, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square rounded-lg overflow-hidden"
                    >
                      <img src={img} alt="Destination" className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="bg-card border rounded-2xl p-5 md:p-8 shadow-lg relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                      <Send className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-bold">Send us a Message</h2>
                      <p className="text-xs md:text-sm text-muted-foreground">We'll respond within 24 hours</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 md:space-y-2">
                        <Label htmlFor="name" className="text-xs md:text-sm">Full Name *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your name"
                          className="h-10 md:h-12"
                        />
                      </div>
                      <div className="space-y-1.5 md:space-y-2">
                        <Label htmlFor="email" className="text-xs md:text-sm">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                          className="h-10 md:h-12"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 md:space-y-2">
                        <Label htmlFor="phone" className="text-xs md:text-sm">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="h-10 md:h-12"
                        />
                      </div>
                      <div className="space-y-1.5 md:space-y-2">
                        <Label htmlFor="destination" className="text-xs md:text-sm">Interested Destination</Label>
                        <Input
                          id="destination"
                          value={formData.destination}
                          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                          placeholder="e.g., Thailand"
                          className="h-10 md:h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                      <Label htmlFor="message" className="text-xs md:text-sm">Message *</Label>
                      <Textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="How can we help you?"
                        rows={4}
                        className="resize-none"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-11 md:h-12 bg-accent hover:bg-accent/90 text-sm md:text-base" 
                      disabled={loading}
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full"
                        />
                      ) : (
                        <>
                          <Send className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Trust indicators */}
                  <div className="mt-6 pt-6 border-t flex flex-wrap items-center justify-center gap-4 md:gap-6">
                    {[
                      { icon: CheckCircle, text: "Quick Response" },
                      { icon: CheckCircle, text: "Expert Advice" },
                      { icon: CheckCircle, text: "No Spam" }
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-1.5 text-muted-foreground">
                        <item.icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent" />
                        <span className="text-xs md:text-sm">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
