import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { MapPin, Upload, Mail, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: MapPin,
    title: "Choose Destination",
    description: "Select your destination and visa type. Get instant pricing and requirements.",
    features: ["Instant pricing", "Document list", "Timeline"],
  },
  {
    number: "02",
    icon: Upload,
    title: "Submit Documents",
    description: "Upload documents through our secure portal. Our experts verify everything.",
    features: ["Secure upload", "Expert review", "Error check"],
  },
  {
    number: "03",
    icon: Mail,
    title: "Receive Visa",
    description: "Track in real-time. Get your visa via email or courier for sticker visas.",
    features: ["Live tracking", "Email delivery", "Express option"],
  },
];

export function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section ref={ref} className="py-12 md:py-16 bg-background">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-2.5 py-0.5 bg-accent/10 text-accent text-xs font-semibold rounded-full mb-3">
            Simple Process
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground mb-2">
            How It Works
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Getting your visa is as easy as 1-2-3. We've simplified everything.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-5 mb-10"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={cardVariants}
              className="relative"
            >
              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-border via-accent/20 to-border -translate-x-1/2 z-0" />
              )}

              <div className="relative bg-card rounded-xl border border-border p-5 hover:border-accent/30 hover:shadow-md transition-all h-full">
                {/* Step badge */}
                <span className="absolute -top-2.5 left-5 px-2.5 py-1 bg-accent text-accent-foreground text-[10px] font-bold rounded-full">
                  Step {step.number}
                </span>

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground mt-2 mb-4">
                  <step.icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {step.description}
                </p>

                {/* Features */}
                <ul className="space-y-1.5">
                  {step.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-accent shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-center"
        >
          <Link to="/visas">
            <Button size="default" className="h-10 px-6 text-sm bg-accent hover:bg-accent/90 text-accent-foreground">
              Start Your Application
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-2">
            Average processing: 3-15 business days
          </p>
        </motion.div>
      </div>
    </section>
  );
}