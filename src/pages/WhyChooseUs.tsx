import { motion } from "framer-motion";
import { Shield, Zap, Globe, Clock, HeadphonesIcon, Wallet, CheckCircle, Award, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout, PageHero } from "@/components/layout";
import { SEO } from "@/components/seo";

const benefits = [
  { icon: Shield, title: "Stress-Free Process", description: "We handle all paperwork so you can focus on planning." },
  { icon: Wallet, title: "Affordable Pricing", description: "Transparent pricing with no hidden fees." },
  { icon: Globe, title: "100+ Countries", description: "Tourist to business visas across the globe." },
  { icon: Zap, title: "Fast Processing", description: "Get your visa in as little as 24 hours." },
  { icon: HeadphonesIcon, title: "24/7 Support", description: "Round the clock assistance for any queries." },
  { icon: CheckCircle, title: "99% Success Rate", description: "Expert review ensures all requirements are met." }
];

const stats = [
  { value: "50K+", label: "Visas" },
  { value: "100+", label: "Countries" },
  { value: "99%", label: "Success" },
  { value: "10+", label: "Years" }
];

const steps = [
  { step: "01", title: "Choose Your Visa", desc: "Select destination and visa type." },
  { step: "02", title: "Submit Documents", desc: "Upload required documents securely." },
  { step: "03", title: "Expert Review", desc: "Our team verifies your application." },
  { step: "04", title: "Receive Visa", desc: "Get your approved visa delivered." }
];

export default function WhyChooseUs() {
  return (
    <Layout>
      <SEO 
        title="Why Choose Us - Travel Idea" 
        description="Discover why thousands choose Travel Idea for their visa needs." 
      />

      <PageHero
        title="Why Choose Travel Idea?"
        subtitle="We're your travel partners, committed to making your journey smooth from start to finish."
        icon={Sparkles}
        badge="Our Advantage"
      />

      {/* Stats Bar */}
      <section className="bg-muted/50 border-b">
        <div className="container py-5">
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

      {/* Benefits */}
      <section className="py-10">
        <div className="container">
          <h2 className="text-xl md:text-2xl font-display font-bold text-center mb-2">
            The Travel Idea Advantage
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-8 max-w-lg mx-auto">
            Over 50,000 visas processed with 99% success rate.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, i) => (
              <motion.div 
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border rounded-xl p-5 hover:border-accent/50 transition-colors"
              >
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                  <benefit.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{benefit.title}</h3>
                <p className="text-xs text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-10 bg-muted/30">
        <div className="container">
          <h2 className="text-xl md:text-2xl font-display font-bold text-center mb-8">
            Trusted & Certified
          </h2>
          <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {[
              { icon: Shield, title: "ISO9001:2015 Certified", desc: "International quality management standards for consistent service." },
              { icon: Award, title: "IATA Accredited", desc: "Adhering to highest standards set by the International Air Transport Association." }
            ].map((cert, i) => (
              <motion.div 
                key={cert.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border rounded-xl p-5 flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <cert.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{cert.title}</h3>
                  <p className="text-sm text-muted-foreground">{cert.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-10">
        <div className="container">
          <h2 className="text-xl md:text-2xl font-display font-bold text-center mb-2">
            Simple 4-Step Process
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-8">
            Getting your visa has never been easier.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {steps.map((item, i) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative text-center"
              >
                <div className="text-4xl font-bold text-accent/20 mb-2">{item.step}</div>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 bg-gradient-to-r from-accent via-accent to-accent/90">
        <div className="container text-center">
          <h2 className="text-xl md:text-2xl font-display font-bold text-accent-foreground mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-accent-foreground/80 text-sm mb-6 max-w-md mx-auto">
            Join thousands of satisfied travelers who trust us.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/visas">
              <Button variant="secondary" className="shadow-lg">
                Explore Visas
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-accent-foreground/20 text-accent-foreground hover:bg-accent-foreground/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
