import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { MapPin, Upload, Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: MapPin,
    title: "Choose Destination & Visa",
    description: "Select your destination country and visa type. Our system will show you the exact requirements and pricing.",
    time: "2 mins",
  },
  {
    number: "02",
    icon: Upload,
    title: "Upload Documents",
    description: "Submit your passport copy, photos, and required documents through our secure portal. We verify everything for you.",
    time: "10 mins",
  },
  {
    number: "03",
    icon: Mail,
    title: "Receive Visa on Email",
    description: "Once approved, your visa is delivered directly to your inbox. For sticker visas, we courier your passport back.",
    time: "1-15 days",
  },
];

export function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const stepVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-3">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Getting your visa is as easy as 1-2-3. We've simplified the entire process so you can focus on planning your trip.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="relative max-w-4xl mx-auto"
        >
          {/* Connection line */}
          <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20 hidden sm:block md:-translate-x-px" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={stepVariants}
              className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 last:mb-0 ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Step number circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={isVisible ? { scale: 1 } : {}}
                transition={{ delay: 0.4 + index * 0.2, type: "spring", stiffness: 200 }}
                className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground shadow-lg md:absolute md:left-1/2 md:-translate-x-1/2"
              >
                <step.icon className="h-8 w-8" />
              </motion.div>

              {/* Content card */}
              <div className={`flex-1 ${index % 2 === 1 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-primary/30 transition-all">
                  <div className={`flex items-center gap-3 mb-3 ${index % 2 === 1 ? "md:justify-end" : ""}`}>
                    <span className="text-4xl font-bold text-primary/20">{step.number}</span>
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">{step.time}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>

              {/* Empty space for alternating layout */}
              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-12"
        >
          <Link to="/visas">
            <Button size="lg" className="h-14 px-8 text-lg">
              Start Your Application
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
