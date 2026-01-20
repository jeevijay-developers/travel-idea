import { Shield, Clock, Headphones, Globe, Wallet, Award, CheckCircle } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const features = [
  {
    icon: Shield,
    title: "99% Success Rate",
    description: "Expert review ensures maximum approval chances.",
    highlight: "Industry Leading",
  },
  {
    icon: Clock,
    title: "Express Processing",
    description: "Get your visa in as little as 24 hours.",
    highlight: "24hr Available",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our team is available round the clock.",
    highlight: "Always Available",
  },
  {
    icon: Globe,
    title: "100+ Countries",
    description: "Comprehensive coverage across all continents.",
    highlight: "Global Coverage",
  },
  {
    icon: Wallet,
    title: "Transparent Pricing",
    description: "No hidden fees. Know what you pay upfront.",
    highlight: "No Hidden Fees",
  },
  {
    icon: Award,
    title: "Certified Excellence",
    description: "ISO 9001:2015 certified & IATA accredited.",
    highlight: "IATA Accredited",
  },
];

export function WhyChooseUs() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-primary">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-2.5 py-0.5 bg-accent/20 text-accent text-xs font-semibold rounded-full mb-3">
            Why Travel Idea
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-primary-foreground mb-2">
            The Smart Choice for Visa Services
          </h2>
          <p className="text-primary-foreground/70 text-sm max-w-lg mx-auto">
            We're committed to making your visa journey smooth and successful.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all"
            >
              {/* Highlight badge */}
              <span className="inline-block px-2 py-0.5 bg-accent/20 text-accent text-[10px] font-semibold rounded-full mb-3">
                {feature.highlight}
              </span>

              {/* Icon */}
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/20 text-accent mb-3">
                <feature.icon className="h-5 w-5" />
              </div>

              {/* Content */}
              <h3 className="text-base font-bold text-primary-foreground mb-1.5">
                {feature.title}
              </h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-10 pt-8 border-t border-primary-foreground/10"
        >
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
            {[
              "ISO 9001:2015",
              "IATA Accredited",
              "Secure & Encrypted",
              "50K+ Customers",
            ].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-primary-foreground/80">
                <CheckCircle className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-medium">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}