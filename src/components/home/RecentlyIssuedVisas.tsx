import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { BadgeCheck, TrendingUp, Clock } from "lucide-react";

const recentVisas = [
  { country: "UAE", time: "2 minutes ago", type: "Tourist eVisa" },
  { country: "Thailand", time: "5 minutes ago", type: "Tourist Visa" },
  { country: "Singapore", time: "8 minutes ago", type: "eVisa" },
  { country: "Vietnam", time: "12 minutes ago", type: "Tourist eVisa" },
  { country: "France", time: "15 minutes ago", type: "Schengen Visa" },
  { country: "Japan", time: "20 minutes ago", type: "Sticker Visa" },
  { country: "Malaysia", time: "25 minutes ago", type: "eNTRI" },
  { country: "Turkey", time: "30 minutes ago", type: "Tourist Visa" },
];

const weeklyStats = [
  { country: "UAE", count: 1954, emoji: "🇦🇪" },
  { country: "Thailand", count: 1245, emoji: "🇹🇭" },
  { country: "Singapore", count: 892, emoji: "🇸🇬" },
  { country: "Vietnam", count: 756, emoji: "🇻🇳" },
];

export function RecentlyIssuedVisas() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recentVisas.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const tickerVariants: Variants = {
    enter: { y: 20, opacity: 0 },
    center: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };

  return (
    <section ref={ref} className="py-16 bg-background border-y border-border">
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-8 items-center"
        >
          {/* Live ticker */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-travel-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-travel-success"></span>
              </span>
              <span className="text-sm font-medium text-travel-success">Live Activity</span>
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-6">Recently Issued Visas</h3>

            <div className="bg-card rounded-xl border border-border p-6 h-48 overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  variants={tickerVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="absolute inset-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <BadgeCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-foreground">
                        {recentVisas[currentIndex].country} Visa Approved!
                      </p>
                      <p className="text-muted-foreground">
                        {recentVisas[currentIndex].type}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {recentVisas[currentIndex].time}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress dots */}
              <div className="absolute bottom-4 left-6 right-6 flex justify-center gap-2">
                {recentVisas.slice(0, 5).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex % 5 ? "bg-primary" : "bg-border"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Weekly stats */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">This Week's Stats</span>
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-6">Visas Approved This Week</h3>

            <div className="grid grid-cols-2 gap-4">
              {weeklyStats.map((stat, index) => (
                <motion.div
                  key={stat.country}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  className="bg-card rounded-xl border border-border p-4 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{stat.emoji}</span>
                    <div>
                      <p className="font-semibold text-foreground">{stat.country}</p>
                      <p className="text-primary font-bold">{stat.count.toLocaleString()}+ visas</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-travel-success/10 rounded-lg">
              <p className="text-sm text-travel-success font-medium flex items-center gap-2">
                <BadgeCheck className="h-4 w-4" />
                Over 5,000 visas processed this week
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
