import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useCountUp } from "@/hooks/use-count-up";
import { Globe, FileCheck, TrendingUp, Headphones } from "lucide-react";

interface StatItemProps {
  end: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
  delay: number;
  enabled: boolean;
}

function StatItem({ end, suffix, label, icon: Icon, delay, enabled }: StatItemProps) {
  const { formattedValue } = useCountUp({
    end,
    suffix,
    duration: 2500,
    delay: delay * 200,
    enabled,
  });

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6, 
        delay: delay * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94] 
      },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      className="relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={enabled ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: delay * 0.2 + 0.3, duration: 0.5 }}
        className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
      >
        <Icon className="h-6 w-6" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={enabled ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: delay * 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-4xl md:text-5xl font-bold text-foreground mb-2"
      >
        {formattedValue}
      </motion.div>
      
      <p className="text-muted-foreground font-medium">{label}</p>
      
      {/* Decorative gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}

export function StatsCounter() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  const stats = [
    { end: 100, suffix: "+", label: "Countries Covered", icon: Globe },
    { end: 50, suffix: "K+", label: "Visas Processed", icon: FileCheck },
    { end: 99, suffix: "%", label: "Success Rate", icon: TrendingUp },
    { end: 24, suffix: "/7", label: "Expert Support", icon: Headphones },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <section ref={ref} className="py-20 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Trusted by Thousands
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Our Track Record Speaks
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              {...stat}
              delay={index}
              enabled={isVisible}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
