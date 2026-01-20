import { motion } from "framer-motion";
import { Shield, Award, MapPin, Phone, Mail, Clock, Users, Globe, Heart, Sparkles, CheckCircle, Plane, Star, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout, PageHero } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";

// Import country images for visual variety
import uaeImage from "@/assets/countries/uae.jpg";
import japanImage from "@/assets/countries/japan.jpg";
import thailandImage from "@/assets/countries/thailand.jpg";
import singaporeImage from "@/assets/countries/singapore.jpg";

const certifications = [
  {
    icon: Shield,
    title: "ISO9001:2015 Certified",
    description: "Quality management system certified"
  },
  {
    icon: Award,
    title: "IATA Accredited",
    description: "Recognized travel agency"
  }
];

const values = [
  {
    icon: Heart,
    title: "Customer First",
    description: "Your travel dreams are our priority. We go above and beyond.",
    color: "from-rose-500/20 to-pink-500/20"
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Visa services for 100+ countries across the world.",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "50,000+ applications processed successfully.",
    color: "from-amber-500/20 to-orange-500/20"
  },
  {
    icon: Clock,
    title: "Fast Processing",
    description: "Streamlined process for quick turnaround times.",
    color: "from-emerald-500/20 to-teal-500/20"
  }
];

const stats = [
  { value: "100+", label: "Countries", icon: Globe },
  { value: "50K+", label: "Visas", icon: Plane },
  { value: "99%", label: "Success", icon: CheckCircle },
  { value: "24/7", label: "Support", icon: Clock }
];

const destinations = [
  { image: uaeImage, name: "UAE" },
  { image: japanImage, name: "Japan" },
  { image: thailandImage, name: "Thailand" },
  { image: singaporeImage, name: "Singapore" }
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

      {/* Stats Bar with Animation */}
      <section className="bg-muted/50 border-b">
        <div className="container py-6 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-3 md:p-4 rounded-xl bg-background/50 border"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/10 mb-2 md:mb-3">
                  <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                </div>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-accent">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section with Images */}
      <section className="py-10 md:py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full mb-4">
                Our Mission
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-4 md:mb-6">
                Stress-Free Travel at <span className="text-accent">Affordable Pricing</span>
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4 md:mb-6">
                At Travel Idea, we believe everyone deserves to explore the world. Founded to simplify visa processing, we've grown into one of India's most trusted visa providers.
              </p>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 md:mb-8">
                Our dedicated visa specialists work tirelessly to ensure your applications are processed accurately and efficiently, with complete transparency at every step.
              </p>
              
              {/* Certifications */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {certifications.map((cert, i) => (
                  <motion.div 
                    key={cert.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card border rounded-xl p-4 md:p-5 hover:border-accent/50 hover:shadow-lg transition-all group"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
                      <cert.icon className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-sm md:text-base mb-1">{cert.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{cert.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Image Grid */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {destinations.map((dest, i) => (
                  <motion.div
                    key={dest.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    className={`relative rounded-xl overflow-hidden ${i === 0 || i === 3 ? 'aspect-square' : 'aspect-[4/3]'}`}
                  >
                    <img 
                      src={dest.image} 
                      alt={dest.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 right-2 md:right-3">
                      <span className="text-white font-semibold text-xs md:text-sm">{dest.name}</span>
                    </div>
                    {i === 0 && (
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 md:w-10 md:h-10 bg-accent rounded-full flex items-center justify-center"
                      >
                        <Star className="h-4 w-4 md:h-5 md:w-5 text-accent-foreground" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-10 md:py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
              Our Values
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-2 md:mb-3">
              Why We Do What We Do
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
              Our core values guide everything we do.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {values.map((value, i) => (
              <motion.div 
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-card border rounded-xl p-4 md:p-6 hover:shadow-xl transition-all group relative overflow-hidden"
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div className="relative">
                  <motion.div 
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 md:mb-4"
                  >
                    <value.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </motion.div>
                  <h3 className="font-semibold text-sm md:text-base mb-1 md:mb-2">{value.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-10 md:py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full mb-3">
              <Building2 className="inline-block h-3 w-3 mr-1" />
              Our Offices
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold">
              Visit Us
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
            {/* Head Office */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 rounded-xl p-5 md:p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-start gap-3 md:gap-4 mb-4">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 md:w-14 md:h-14 bg-accent/20 rounded-xl flex items-center justify-center shrink-0"
                >
                  <MapPin className="h-6 w-6 md:h-7 md:w-7 text-accent" />
                </motion.div>
                <div>
                  <span className="text-[10px] md:text-xs font-medium text-accent uppercase tracking-wide">Head Office</span>
                  <h3 className="font-bold text-base md:text-lg">Tezpur, Assam</h3>
                </div>
              </div>
              <div className="space-y-2 md:space-y-3 text-sm">
                <p className="text-muted-foreground text-xs md:text-sm">
                  Ground Floor, G-Square Mall (Sohum Building), Tezpur Main Rd, Tezpur 784001
                </p>
                <a href="tel:+919101197909" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors text-xs md:text-sm">
                  <Phone className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent" />
                  <span>+91 9101197909</span>
                </a>
                <a href="mailto:b2b@travelidea.in" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors text-xs md:text-sm">
                  <Mail className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent" />
                  <span>b2b@travelidea.in</span>
                </a>
              </div>
            </motion.div>

            {/* Branch Office */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-card border rounded-xl p-5 md:p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-start gap-3 md:gap-4 mb-4">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-muted rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6 md:h-7 md:w-7 text-muted-foreground" />
                </div>
                <div>
                  <span className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wide">Branch Office</span>
                  <h3 className="font-bold text-base md:text-lg">Kolkata, West Bengal</h3>
                </div>
              </div>
              <div className="space-y-2 md:space-y-3 text-sm">
                <p className="text-muted-foreground text-xs md:text-sm">
                  Regus Grandeur Offices, PS Arcadia 9th Floor, 4A Camac Street, Kolkata 700016
                </p>
                <div className="flex items-center gap-2 text-foreground text-xs md:text-sm">
                  <Phone className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                  <span>+91 33 6651 3201 / 3202</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 md:py-14 bg-gradient-to-r from-accent via-accent to-accent/90 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>
        <motion.div
          animate={{ x: [0, 100, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"
        />
        
        <div className="container relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Plane className="mx-auto h-10 w-10 md:h-12 md:w-12 text-accent-foreground/80 mb-4" />
            <h2 className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-accent-foreground mb-3 md:mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-accent-foreground/80 text-sm md:text-base mb-6 md:mb-8 max-w-md mx-auto">
              Contact us today and let us handle your visa requirements.
            </p>
            <Link to="/contact">
              <Button variant="secondary" size="lg" className="shadow-lg">
                Get in Touch
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
