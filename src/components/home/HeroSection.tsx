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

  const floatVariants: Variants = {
    initial: { y: 0 },
    animate: {
      y: [-5, 5, -5],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const trustBadges = [
    { icon: Shield, text: "99% Success Rate" },
    { icon: Clock, text: "Express Processing" },
    { icon: Award, text: "IATA Accredited" },
  ];

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background with parallax effect */}
      <motion.div
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <img
          src={heroImage}
          alt="Travel destinations"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />

      {/* Decorative elements */}
      <motion.div
        variants={floatVariants}
        initial="initial"
        animate="animate"
        className="absolute top-20 right-[15%] w-72 h-72 bg-accent/20 rounded-full blur-3xl"
      />
      <motion.div
        variants={floatVariants}
        initial="initial"
        animate="animate"
        style={{ animationDelay: "1s" }}
        className="absolute bottom-20 left-[10%] w-96 h-96 bg-travel-teal/15 rounded-full blur-3xl"
      />

      {/* Content */}
      <div className="container relative z-10 py-16">
        <motion.div
          className="max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Trust badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-3 px-4 py-2.5 glass-dark rounded-full border border-primary-foreground/10 mb-8"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-travel-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-travel-success" />
            </span>
            <span className="text-sm font-medium text-primary-foreground/90">
              ISO9001:2015 Certified • Trusted by 50,000+ Travelers
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground leading-[1.1] mb-6"
          >
            Your Visa,{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-travel-teal">Simplified</span>
              <motion.svg
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 8C50 2 150 2 198 8"
                  stroke="hsl(var(--travel-teal))"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </motion.svg>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-primary-foreground/80 mb-10 max-w-2xl leading-relaxed"
          >
            Get your visa hassle-free with expert guidance. We process visas for{" "}
            <span className="text-primary-foreground font-semibold">100+ countries</span> with 
            fast turnaround and transparent pricing. No hidden fees, ever.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <Link to="/visas">
              <Button
                size="lg"
                className="h-14 px-8 text-base bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300"
              >
                Find Your Visa
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm"
              >
                <Play className="mr-2 h-4 w-4" />
                How It Works
              </Button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-6"
          >
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                className="flex items-center gap-2 text-primary-foreground/80"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-foreground/10 backdrop-blur-sm">
                  <badge.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{badge.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Stats bar at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute bottom-0 left-0 right-0 glass-dark border-t border-primary-foreground/10"
      >
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "100+", label: "Countries Covered" },
              { value: "50,000+", label: "Visas Processed" },
              { value: "99%", label: "Success Rate" },
              { value: "24/7", label: "Expert Support" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <p className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-primary-foreground/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-28 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-xs text-primary-foreground/50 uppercase tracking-wider">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="h-5 w-5 text-primary-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}