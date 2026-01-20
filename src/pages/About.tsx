import { motion } from "framer-motion";
import { Shield, Award, MapPin, Phone, Mail, Clock, Users, Globe, Heart, Sparkles, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout, PageHero } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";

const certifications = [
  {
    icon: Shield,
    title: "ISO9001:2015 Certified",
    description: "Quality management system certified for consistent service delivery"
  },
  {
    icon: Award,
    title: "IATA Accredited",
    description: "International Air Transport Association recognized travel agency"
  }
];

const values = [
  {
    icon: Heart,
    title: "Customer First",
    description: "Your travel dreams are our priority. We go above and beyond."
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Visa services for 100+ countries across the world."
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "50,000+ applications processed successfully."
  },
  {
    icon: Clock,
    title: "Fast Processing",
    description: "Streamlined process for quick turnaround times."
  }
];

const stats = [
  { value: "100+", label: "Countries" },
  { value: "50K+", label: "Visas" },
  { value: "99%", label: "Success" },
  { value: "24/7", label: "Support" }
];

export default function About() {
  return (
    <Layout>
      <SEO 
        title="About Us - Travel Idea" 
        description="Learn about Experience Travelidea Private Limited, an ISO9001:2015 certified and IATA accredited travel agency." 
      />

      <PageHero
        title="Making Travel Dreams Come True"
        subtitle="Experience Travelidea Private Limited is your trusted partner for hassle-free visa services."
        icon={Sparkles}
        badge="About Us"
      />

      {/* Stats Bar */}
      <section className="bg-muted/50 border-b">
        <div className="container py-6">
          <div className="grid grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-xl md:text-2xl font-bold text-accent">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl md:text-2xl font-display font-bold mb-4">Our Mission</h2>
              <p className="text-accent font-medium mb-4 text-sm">
                "To make stress-free travel possible at affordable pricing"
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                At Travel Idea, we believe everyone deserves to explore the world. Founded to simplify visa processing, we've grown into one of India's most trusted visa providers.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our dedicated visa specialists work tirelessly to ensure your applications are processed accurately and efficiently.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-3"
            >
              {certifications.map((cert, i) => (
                <div key={cert.title} className="bg-card border rounded-xl p-5 hover:border-accent/50 transition-colors">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                    <cert.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{cert.title}</h3>
                  <p className="text-xs text-muted-foreground">{cert.description}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <h2 className="text-xl md:text-2xl font-display font-bold text-center mb-2">
            Why We Do What We Do
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-8 max-w-lg mx-auto">
            Our core values guide everything we do.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((value, i) => (
              <motion.div 
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border rounded-xl p-5 hover:border-accent/50 transition-colors"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <value.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{value.title}</h3>
                <p className="text-xs text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-xl md:text-2xl font-display font-bold text-center mb-8">
            Our Offices
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Head Office */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card border rounded-xl p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <span className="text-xs font-medium text-accent uppercase tracking-wide">Head Office</span>
                  <h3 className="font-semibold">Tezpur, Assam</h3>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Ground Floor, G-Square Mall, Tezpur Main Rd, Tezpur 784001</p>
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  <a href="tel:+919101197909" className="hover:text-accent">+91 9101197909</a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  <a href="mailto:b2b@travelidea.in" className="hover:text-accent">b2b@travelidea.in</a>
                </p>
              </div>
            </motion.div>

            {/* Branch Office */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card border rounded-xl p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Branch Office</span>
                  <h3 className="font-semibold">Kolkata, West Bengal</h3>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>PS Arcadia, 9th Floor, 4A Camac Street, Kolkata 700016</p>
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  <span>+91 33 6651 3201 / 3202</span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 bg-gradient-to-r from-accent via-accent to-accent/90">
        <div className="container text-center">
          <h2 className="text-xl md:text-2xl font-display font-bold text-accent-foreground mb-3">
            Ready to Start Your Journey?
          </h2>
          <p className="text-accent-foreground/80 text-sm mb-6 max-w-md mx-auto">
            Contact us today and let us handle your visa requirements.
          </p>
          <Link to="/contact">
            <Button variant="secondary" className="shadow-lg">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
