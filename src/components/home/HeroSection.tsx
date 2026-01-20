import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Shield, Clock, Award, ChevronDown, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import heroImage from "@/assets/hero-travel.jpg";

// Popular destinations for rotating showcase
const destinations = [
  { name: "Dubai", country: "UAE", slug: "uae", emoji: "🇦🇪" },
  { name: "Bangkok", country: "Thailand", slug: "thailand", emoji: "🇹🇭" },
  { name: "Singapore", country: "Singapore", slug: "singapore", emoji: "🇸🇬" },
  { name: "Tokyo", country: "Japan", slug: "japan", emoji: "🇯🇵" },
  { name: "Kuala Lumpur", country: "Malaysia", slug: "malaysia", emoji: "🇲🇾" },
  { name: "Sydney", country: "Australia", slug: "australia", emoji: "🇦🇺" },
];

// Animated headline words
const headlineWords = [
  "Simplified",
  "Fast-Tracked",
  "Hassle-Free",
  "Guaranteed",
];

export function HeroSection() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentDestIndex, setCurrentDestIndex] = useState(0);

  // Rotate headline words
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % headlineWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Rotate destinations
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDestIndex((prev) => (prev + 1) % destinations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
    <section className="relative min-h-[95vh] flex items-center overflow-hidden">
      {/* Background with parallax effect */}
      <motion.div
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <img
          src={heroImage}
          alt="Travel destinations"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
      
      {/* Animated particles/dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
            }}
            animate={{
              y: [null, "-20%", null],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container relative z-10 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <motion.div
            className="max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Trust badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-6"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex h-2 w-2"
              >
                <span className="absolute inline-flex h-2 w-2 rounded-full bg-travel-success opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-travel-success" />
              </motion.span>
              <span className="text-xs font-medium text-primary-foreground/90">
                ISO9001:2015 Certified • 50,000+ Happy Travelers
              </span>
            </motion.div>

            {/* Animated Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground leading-[1.1] mb-6"
            >
              Your Visa,{" "}
              <span className="relative inline-block">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={headlineWords[currentWordIndex]}
                    initial={{ opacity: 0, y: 20, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -20, rotateX: 90 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="text-accent inline-block"
                  >
                    {headlineWords[currentWordIndex]}
                  </motion.span>
                </AnimatePresence>
                {/* Underline animation */}
                <motion.span
                  className="absolute -bottom-2 left-0 h-1 bg-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  key={headlineWords[currentWordIndex]}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-primary-foreground/80 mb-8 max-w-lg leading-relaxed"
            >
              Expert visa assistance for{" "}
              <span className="text-primary-foreground font-semibold">100+ countries</span>. 
              Fast processing, transparent pricing, and dedicated support.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 mb-10"
            >
              <Link to="/visas">
                <Button
                  size="lg"
                  className="h-14 px-8 text-base bg-accent hover:bg-accent/90 text-accent-foreground shadow-2xl shadow-accent/30 group"
                >
                  <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Find Your Visa
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-base border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm"
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
                  transition={{ delay: 0.9 + index * 0.15, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20">
                    <badge.icon className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-primary-foreground">{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Rotating Destination Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Background glow */}
              <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full scale-75" />
              
              {/* Destination cards carousel */}
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="inline-flex items-center justify-center w-12 h-12 bg-accent/20 rounded-full mb-3"
                  >
                    <MapPin className="h-6 w-6 text-accent" />
                  </motion.div>
                  <p className="text-sm text-primary-foreground/60 uppercase tracking-wider">Popular Destination</p>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={destinations[currentDestIndex].slug}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="text-6xl mb-4 block"
                    >
                      {destinations[currentDestIndex].emoji}
                    </motion.span>
                    <h3 className="text-3xl font-display font-bold text-primary-foreground mb-2">
                      {destinations[currentDestIndex].name}
                    </h3>
                    <p className="text-primary-foreground/70 mb-6">
                      {destinations[currentDestIndex].country} Visa
                    </p>
                    <Link to={`/visas/${destinations[currentDestIndex].slug}`}>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
                      >
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </motion.div>
                </AnimatePresence>

                {/* Destination indicators */}
                <div className="flex justify-center gap-2 mt-8">
                  {destinations.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentDestIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentDestIndex
                          ? "w-8 bg-accent"
                          : "bg-primary-foreground/30 hover:bg-primary-foreground/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
              >
                🔥 Trending
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-white/90 text-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
              >
                ⚡ Express Processing
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-primary via-primary/95 to-primary backdrop-blur-xl border-t border-primary-foreground/10"
      >
        <div className="container py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "100+", label: "Countries", icon: "🌍" },
              { value: "50K+", label: "Visas Processed", icon: "✈️" },
              { value: "99%", label: "Success Rate", icon: "✅" },
              { value: "24/7", label: "Expert Support", icon: "💬" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                className="text-center group cursor-default"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-lg group-hover:scale-125 transition-transform">{stat.icon}</span>
                  <p className="text-2xl sm:text-3xl font-bold text-primary-foreground">
                    {stat.value}
                  </p>
                </div>
                <p className="text-xs text-primary-foreground/60 uppercase tracking-wider">{stat.label}</p>
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
        className="absolute bottom-28 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-primary-foreground/40 uppercase tracking-widest">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-primary-foreground/20 rounded-full flex items-start justify-center p-1"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-accent rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}