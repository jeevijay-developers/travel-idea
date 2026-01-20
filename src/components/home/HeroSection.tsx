import { Link } from "react-router-dom";
import { ArrowRight, Play, Shield, Clock, Award, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, type Variants } from "framer-motion";
import heroImage from "@/assets/hero-travel.jpg";

export function HeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const trustBadges = [
    { icon: Shield, text: "99% Success" },
    { icon: Clock, text: "Express Available" },
    { icon: Award, text: "IATA Accredited" },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <img
          src={heroImage}
          alt="Travel destinations"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="container relative z-10 py-12 md:py-16">
        <motion.div
          className="max-w-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Trust badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-foreground/10 backdrop-blur-sm rounded-full border border-primary-foreground/10 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-travel-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-travel-success" />
            </span>
            <span className="text-xs font-medium text-primary-foreground/90">
              ISO9001:2015 Certified • 50,000+ Travelers
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground leading-tight mb-4"
          >
            Your Visa,{" "}
            <span className="text-accent">Simplified</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-primary-foreground/80 mb-8 max-w-lg leading-relaxed"
          >
            Get your visa hassle-free with expert guidance. We process visas for{" "}
            <span className="text-primary-foreground font-medium">100+ countries</span> with 
            fast turnaround and transparent pricing.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-3 mb-8"
          >
            <Link to="/visas">
              <Button
                size="default"
                className="h-11 px-6 text-sm bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg"
              >
                Find Your Visa
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="default"
                variant="outline"
                className="h-11 px-6 text-sm border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Play className="mr-2 h-3 w-3" />
                How It Works
              </Button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4"
          >
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.text}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                className="flex items-center gap-2 text-primary-foreground/80"
              >
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary-foreground/10">
                  <badge.icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-medium">{badge.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="absolute bottom-0 left-0 right-0 bg-primary/90 backdrop-blur-sm border-t border-primary-foreground/10"
      >
        <div className="container py-4">
          <div className="grid grid-cols-4 gap-4">
            {[
              { value: "100+", label: "Countries" },
              { value: "50K+", label: "Visas Done" },
              { value: "99%", label: "Success" },
              { value: "24/7", label: "Support" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.08, duration: 0.4 }}
                className="text-center"
              >
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary-foreground">
                  {stat.value}
                </p>
                <p className="text-[10px] sm:text-xs text-primary-foreground/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1"
      >
        <span className="text-[10px] text-primary-foreground/40 uppercase tracking-wider">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="h-4 w-4 text-primary-foreground/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}