import { Shield, Clock, Headphones, Globe, Wallet, Award } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const features = [
  {
    icon: Shield,
    title: "99% Success Rate",
    description: "Expert documentation review ensures maximum approval chances for your visa application.",
  },
  {
    icon: Clock,
    title: "Fast Processing",
    description: "Express processing available for urgent travel. Get your visa in as little as 24 hours.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated support team is available round the clock to assist you at every step.",
  },
  {
    icon: Globe,
    title: "100+ Countries",
    description: "Comprehensive visa services covering destinations across all continents.",
  },
  {
    icon: Wallet,
    title: "Transparent Pricing",
    description: "No hidden fees or surprise charges. Know exactly what you pay upfront.",
  },
  {
    icon: Award,
    title: "Certified Excellence",
    description: "ISO 9001:2015 certified and IATA accredited for quality assurance.",
  },
];

export function WhyChooseUs() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <section ref={sectionRef} className="py-20 bg-muted/30">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={headerVariants}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Benefits</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
            Why Choose Travel Idea?
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            We're committed to making your visa journey smooth, stress-free, and successful.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300"
            >
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                <feature.icon className="h-6 w-6" />
              </motion.div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
