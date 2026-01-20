import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, type Variants } from "framer-motion";
import heroImage from "@/assets/hero-travel.jpg";

export function HeroSection() {

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

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Link to="/visas">
              <Button size="lg" className="h-14 px-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl">
                Explore All Visas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="h-14 px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Contact Us
              </Button>
            </Link>
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
