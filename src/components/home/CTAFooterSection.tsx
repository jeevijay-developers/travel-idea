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

  return (
    <section ref={ref} className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Icon */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6"
          >
            <Plane className="h-8 w-8" />
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Ready to Apply for Your Visa?
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto"
          >
            Start your hassle-free visa application today. Our experts are ready to help you every step of the way.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
          >
            <Link to="/visas">
              <Button
                size="lg"
                className="h-14 px-8 text-lg bg-white text-primary hover:bg-white/90 shadow-xl"
              >
                Apply Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <a
              href="https://wa.me/919101197909"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg border-white/30 bg-white/10 hover:bg-white/20 text-primary-foreground"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp Us
              </Button>
            </a>
          </motion.div>

          {/* Contact info */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm"
          >
            <a
              href="tel:+919101197909"
              className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <Phone className="h-4 w-4" />
              +91 9101197909
            </a>
            <span className="hidden sm:block text-primary-foreground/40">|</span>
            <span className="text-primary-foreground/80">
              Available 24/7 for your queries
            </span>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-10 border-t border-white/20"
          >
            <div className="text-center">
              <p className="text-2xl font-bold">100+</p>
              <p className="text-xs text-primary-foreground/70">Countries</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold">50K+</p>
              <p className="text-xs text-primary-foreground/70">Happy Travelers</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold">99%</p>
              <p className="text-xs text-primary-foreground/70">Success Rate</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold">ISO</p>
              <p className="text-xs text-primary-foreground/70">9001:2015</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
