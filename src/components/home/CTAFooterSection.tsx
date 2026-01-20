import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { ArrowRight, Phone, MessageCircle, Plane } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CTAFooterSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section ref={ref} className="py-12 md:py-16 bg-primary text-primary-foreground">
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Icon */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-foreground/10 mb-4"
          >
            <Plane className="h-6 w-6" />
          </motion.div>

          {/* Heading */}
          <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            Ready to Apply for Your Visa?
          </motion.h2>

          <motion.p variants={itemVariants} className="text-sm text-primary-foreground/70 mb-6 max-w-md mx-auto">
            Start your hassle-free visa application today. Our experts are ready to help.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <Link to="/visas">
              <Button size="default" className="h-10 px-6 text-sm bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Apply Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="https://wa.me/919101197909" target="_blank" rel="noopener noreferrer">
              <Button
                size="default"
                variant="outline"
                className="h-10 px-6 text-sm border-primary-foreground/20 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </a>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <a href="tel:+919101197909" className="flex items-center gap-1.5 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              <Phone className="h-3.5 w-3.5" />
              +91 9101197909
            </a>
            <span className="text-primary-foreground/30">•</span>
            <span className="text-primary-foreground/70">Available 24/7</span>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-primary-foreground/10"
          >
            {[
              { value: "100+", label: "Countries" },
              { value: "50K+", label: "Travelers" },
              { value: "99%", label: "Success" },
              { value: "ISO", label: "9001:2015" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-[10px] text-primary-foreground/60">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}