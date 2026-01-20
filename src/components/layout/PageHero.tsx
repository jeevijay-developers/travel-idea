import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: string;
  children?: ReactNode;
  size?: "sm" | "md";
}

export function PageHero({ title, subtitle, icon: Icon, badge, children, size = "sm" }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

      {/* Content */}
      <div className={`container relative ${size === "sm" ? "py-8 md:py-10" : "py-10 md:py-14"}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl"
        >
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs font-medium mb-3">
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {badge}
            </div>
          )}

          {/* Title */}
          <h1 className={`font-display font-bold text-primary-foreground mb-2 ${
            size === "sm" ? "text-2xl md:text-3xl" : "text-2xl md:text-4xl"
          }`}>
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-primary-foreground/70 text-sm md:text-base max-w-xl">
              {subtitle}
            </p>
          )}

          {/* Additional content */}
          {children && <div className="mt-4">{children}</div>}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
}
