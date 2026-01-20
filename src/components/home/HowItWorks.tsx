import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { MapPin, Upload, Mail, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: MapPin,
    title: "Choose Your Destination",
    description: "Select your destination country and visa type. Our system instantly shows you requirements, pricing, and processing times.",
    features: ["Instant pricing", "Document checklist", "Processing timeline"],
    color: "bg-primary",
  },
  {
    number: "02",
    icon: Upload,
    title: "Submit Documents",
    description: "Upload your passport, photos, and documents through our secure portal. Our experts verify everything before submission.",
    features: ["Secure upload", "Expert verification", "Error checking"],
    color: "bg-accent",
  },
  {
    number: "03",
    icon: Mail,
    title: "Receive Your Visa",
    description: "Track your application in real-time. Once approved, receive your visa via email or courier for sticker visas.",
    features: ["Real-time tracking", "Email delivery", "Express available"],
    color: "bg-travel-success",
  },
];

export function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section ref={ref} className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-muted/50 to-transparent -z-10" />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-semibold rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Getting your visa is as easy as 1-2-3. We've simplified the entire process
            so you can focus on planning your trip.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={cardVariants}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-border via-accent/30 to-border -translate-x-1/2 z-0" />
              )}

              <div className="relative bg-card rounded-2xl border border-border p-8 hover:border-accent/30 hover:shadow-xl transition-all duration-300 h-full">
                {/* Step number */}
                <div className="absolute -top-4 left-8">
                  <span className="inline-block px-4 py-2 bg-accent text-accent-foreground text-sm font-bold rounded-full shadow-lg">
                    Step {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${step.color} text-white mt-4 mb-6`}>
                  <step.icon className="h-8 w-8" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {step.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {step.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-accent shrink-0" />
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
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center"
        >
          <Link to="/visas">
            <Button size="lg" className="h-14 px-10 text-lg bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/25">
              Start Your Application
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            Average processing time: 3-15 business days
          </p>
        </motion.div>
      </div>
    </section>
  );
}