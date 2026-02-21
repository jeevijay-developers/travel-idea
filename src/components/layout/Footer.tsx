import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube,
  Globe, Shield, Award, Send, ArrowRight, Plane, Clock, CheckCircle, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import logoDark from "@/assets/logo.png";
import { ReviewForm } from "@/components/home/ReviewForm";

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: email.trim().toLowerCase() });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already subscribed",
            description: "This email is already on our mailing list.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Subscribed!",
          description: "Thank you for subscribing to our newsletter.",
        });
      }
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className="flex w-full max-w-md gap-2"
      onSubmit={handleSubmit}
    >
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-10 md:h-12 bg-white/90 border-0 text-foreground placeholder:text-muted-foreground flex-1 text-sm"
        disabled={loading}
      />
      <Button 
        type="submit" 
        size="default" 
        className="h-10 md:h-12 bg-primary hover:bg-primary/90 px-4 md:px-6 text-sm"
        disabled={loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
          <>
            Subscribe
            <Send className="ml-2 h-3 w-3 md:h-4 md:w-4" />
          </>
        )}
      </Button>
    </motion.form>
  );
}

const footerLinks = {
  services: [
    { name: "Tourist Visas", href: "/visas?type=tourist" },
    { name: "Business Visas", href: "/visas?type=business" },
    { name: "Transit Visas", href: "/visas?type=transit" },
    { name: "Student Visas", href: "/visas?type=student" },
    { name: "All Visas", href: "/visas" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Why Choose Us", href: "/why-choose-us" },
    { name: "Blogs", href: "/blog" },
    { name: "FAQs", href: "/faqs" },
    { name: "Contact", href: "/contact" },
  ],
  popular: [
    { name: "UAE Visa", href: "/visas/uae" },
    { name: "Thailand Visa", href: "/visas/thailand" },
    { name: "Singapore Visa", href: "/visas/singapore" },
    { name: "Malaysia Visa", href: "/visas/malaysia" },
    { name: "Japan Visa", href: "/visas/japan" },
  ],
  legal: [
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
    { name: "Privacy Policy", href: "/privacy-policy" },
  ],
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#", color: "hover:bg-blue-600" },
  { name: "Twitter", icon: Twitter, href: "#", color: "hover:bg-sky-500" },
  { name: "Instagram", icon: Instagram, href: "#", color: "hover:bg-pink-600" },
  { name: "LinkedIn", icon: Linkedin, href: "#", color: "hover:bg-blue-700" },
  { name: "YouTube", icon: Youtube, href: "#", color: "hover:bg-red-600" },
];

const certifications = [
  { icon: Shield, text: "ISO 9001:2015" },
  { icon: Award, text: "IATA Accredited" },
  { icon: CheckCircle, text: "99% Success" },
];

export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden">
      {/* Review Section */}
      <ReviewForm />

      {/* Main Footer */}
      <div className="bg-primary py-10 md:py-16 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container relative z-10">
          {/* Top section with logo and certifications */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 md:mb-12 pb-8 md:pb-12 border-b border-primary-foreground/10">
            <div className="flex flex-col gap-3">
              <Link to="/" className="inline-block">
                <img src={logoDark} alt="Travel Idea" className="h-10 md:h-14 brightness-0 invert" />
              </Link>
              <p className="text-primary-foreground/70 max-w-sm text-xs md:text-sm leading-relaxed">
                Your trusted partner for hassle-free visa processing.
              </p>
            </div>
            
            {/* Certifications */}
            <div className="flex flex-wrap gap-2 md:gap-4">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.text}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-primary-foreground/5 border border-primary-foreground/10 rounded-full"
                >
                  <cert.icon className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                  <span className="text-[10px] md:text-xs font-medium text-primary-foreground">{cert.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-12 mb-8 md:mb-12">
            {/* Visa Services */}
            <div>
              <h4 className="text-primary-foreground font-semibold mb-3 md:mb-5 flex items-center gap-2 text-sm md:text-base">
                <Globe className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                Visa Services
              </h4>
              <ul className="space-y-2 md:space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-xs md:text-sm text-primary-foreground/60 hover:text-accent transition-colors inline-flex items-center gap-1 group"
                    >
                      <ArrowRight className="h-2.5 w-2.5 md:h-3 md:w-3 opacity-0 -ml-3 md:-ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Destinations */}
            <div>
              <h4 className="text-primary-foreground font-semibold mb-3 md:mb-5 flex items-center gap-2 text-sm md:text-base">
                <Plane className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                Popular Visas
              </h4>
              <ul className="space-y-2 md:space-y-3">
                {footerLinks.popular.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-xs md:text-sm text-primary-foreground/60 hover:text-accent transition-colors inline-flex items-center gap-1 group"
                    >
                      <ArrowRight className="h-2.5 w-2.5 md:h-3 md:w-3 opacity-0 -ml-3 md:-ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-primary-foreground font-semibold mb-3 md:mb-5 text-sm md:text-base">Company</h4>
              <ul className="space-y-2 md:space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-xs md:text-sm text-primary-foreground/60 hover:text-accent transition-colors inline-flex items-center gap-1 group"
                    >
                      <ArrowRight className="h-2.5 w-2.5 md:h-3 md:w-3 opacity-0 -ml-3 md:-ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info - spans 2 cols on mobile */}
            <div className="col-span-2 md:col-span-1 lg:col-span-2">
              <h4 className="text-primary-foreground font-semibold mb-3 md:mb-5 text-sm md:text-base">Contact Us</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
                <a 
                  href="tel:+919101197909" 
                  className="flex items-center gap-2 md:gap-3 group"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-accent/20 flex items-center justify-center group-hover:bg-accent transition-colors shrink-0">
                    <Phone className="h-3 w-3 md:h-4 md:w-4 text-accent group-hover:text-accent-foreground transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs text-primary-foreground/50">Call Us</p>
                    <p className="text-xs md:text-sm text-primary-foreground font-medium">+91 9101197909</p>
                  </div>
                </a>
                <a 
                  href="mailto:b2b@travelidea.in" 
                  className="flex items-center gap-2 md:gap-3 group"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-accent/20 flex items-center justify-center group-hover:bg-accent transition-colors shrink-0">
                    <Mail className="h-3 w-3 md:h-4 md:w-4 text-accent group-hover:text-accent-foreground transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs text-primary-foreground/50">Email Us</p>
                    <p className="text-xs md:text-sm text-primary-foreground font-medium">b2b@travelidea.in</p>
                  </div>
                </a>
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                    <MapPin className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs text-primary-foreground/50">Head Office</p>
                    <p className="text-xs md:text-sm text-primary-foreground/80">
                      G-Square Mall, Tezpur 784001
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                    <Clock className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs text-primary-foreground/50">Hours</p>
                    <p className="text-xs md:text-sm text-primary-foreground/80">
                      Mon - Sat: 9AM - 7PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 md:pt-8 border-t border-primary-foreground/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
              {/* Social Links */}
              <div className="flex items-center gap-2 md:gap-3 order-2 md:order-1">
                <span className="text-[10px] md:text-xs text-primary-foreground/50 mr-1 md:mr-2">Follow Us:</span>
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className={`w-7 h-7 md:w-9 md:h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/70 hover:text-white transition-all ${social.color}`}
                  >
                    <social.icon className="h-3 w-3 md:h-4 md:w-4" />
                  </motion.a>
                ))}
              </div>

              {/* Legal Links */}
              <div className="flex items-center gap-4 md:gap-6 order-1 md:order-2">
                {footerLinks.legal.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-[10px] md:text-xs text-primary-foreground/50 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Copyright */}
              <p className="text-[10px] md:text-xs text-primary-foreground/50 text-center md:text-right order-3">
                © {new Date().getFullYear()} Experience Travelidea Pvt. Ltd.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
