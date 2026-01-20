import { Shield, Clock, Headphones, Globe, Wallet, Award, CheckCircle } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const features = [
  {
    icon: Shield,
    title: "99% Success Rate",
    description: "Expert documentation review ensures maximum approval chances for your visa application.",
    highlight: "Industry Leading",
  },
  {
    icon: Clock,
    title: "Express Processing",
    description: "Need it fast? Get your visa in as little as 24 hours with our express service.",
    highlight: "24hr Available",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated support team is available round the clock to assist you at every step.",
    highlight: "Always Available",
  },
  {
    icon: Globe,
    title: "100+ Countries",
    description: "Comprehensive visa services covering destinations across all continents worldwide.",
    highlight: "Global Coverage",
  },
  {
    icon: Wallet,
    title: "Transparent Pricing",
    description: "No hidden fees or surprise charges. Know exactly what you pay upfront.",
    highlight: "No Hidden Fees",
  },
  {
    icon: Award,
    title: "Certified Excellence",
    description: "ISO 9001:2015 certified and IATA accredited for quality assurance.",
    highlight: "IATA Accredited",
  },
];

export function WhyChooseUs() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section ref={sectionRef} className="py-24 bg-primary relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-sm font-semibold rounded-full mb-4">
            Why Travel Idea
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
            The Smart Choice for Visa Services
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            We're committed to making your visa journey smooth, stress-free, and successful.
            Here's what sets us apart.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="group p-8 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 hover:bg-primary-foreground/10 hover:border-accent/30 transition-all duration-300"
            >
              {/* Highlight badge */}
              <span className="inline-block px-2.5 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full mb-4">
                {feature.highlight}
              </span>

              {/* Icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/20 text-accent mb-5 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                <feature.icon className="h-7 w-7" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-primary-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-primary-foreground/70 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 pt-16 border-t border-primary-foreground/10"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {[
              "ISO 9001:2015 Certified",
              "IATA Accredited Agency",
              "Secure & Encrypted",
              "50,000+ Happy Customers",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-primary-foreground/80">
                <CheckCircle className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}