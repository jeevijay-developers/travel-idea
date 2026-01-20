import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import heroImage from "@/assets/hero-travel.jpg";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/visas?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const statsVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Background image */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-primary/60" />

      {/* Content */}
      <div className="container relative z-10 py-20">
        <motion.div
          className="max-w-2xl mx-auto text-center text-primary-foreground"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full border border-primary-foreground/20 mb-8"
          >
            <span className="w-2 h-2 bg-travel-success rounded-full animate-pulse" />
            <span className="text-sm font-medium">ISO9001:2015 Certified & IATA Accredited</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-6 leading-tight"
          >
            Stress-Free Travel at{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Affordable Pricing</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute bottom-2 left-0 w-full h-3 bg-primary-foreground/20 -z-10 rounded origin-left"
              />
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-primary-foreground/90 mb-10 max-w-xl mx-auto"
          >
            Get your visa hassle-free with expert guidance. We process visas for 100+ countries with fast turnaround and transparent pricing.
          </motion.p>

          {/* Search bar */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Where to, captain? (e.g., Thailand, USA, UK...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-base bg-background text-foreground border-0 shadow-xl"
              />
            </div>
            <Button type="submit" size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 shadow-xl">
              Search Visas
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.form>

          {/* Quick links */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3">
            <span className="text-sm text-primary-foreground/70">Popular:</span>
            {["Thailand", "Singapore", "Dubai", "Malaysia", "Vietnam"].map((country, index) => (
              <motion.div
                key={country}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
              >
                <Link
                  to={`/visas?search=${country}`}
                  className="text-sm px-3 py-1.5 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full border border-primary-foreground/20 transition-colors"
                >
                  {country}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-primary-foreground/20 max-w-2xl mx-auto"
          >
            {[
              { value: "100+", label: "Countries" },
              { value: "50K+", label: "Visas Processed" },
              { value: "99%", label: "Success Rate" },
              { value: "24/7", label: "Support" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={statsVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.2 + index * 0.15 }}
                className="text-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + index * 0.15, duration: 0.5 }}
                  className="text-3xl sm:text-4xl font-bold mb-1"
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
