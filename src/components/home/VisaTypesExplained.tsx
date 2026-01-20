import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Monitor, FileText, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const visaTypes = [
  {
    icon: Monitor,
    title: "eVisa",
    subtitle: "Online, Fast Approval",
    description: "Apply 100% online, receive your visa via email. No embassy visit required. Perfect for last-minute travel plans.",
    examples: ["UAE", "Vietnam", "Singapore", "Turkey"],
    processingTime: "1-5 days",
    color: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: FileText,
    title: "Sticker Visa",
    subtitle: "Embassy Submission",
    description: "Traditional visa stamped in your passport. We handle the entire embassy process for you, from documentation to submission.",
    examples: ["USA", "UK", "Japan", "Australia"],
    processingTime: "7-30 days",
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Clock,
    title: "DAC / ETA",
    subtitle: "Pre-Travel or On Arrival",
    description: "Electronic Travel Authorization or Document Authentication. Quick approval for visa-free or simplified entry countries.",
    examples: ["Thailand", "Malaysia", "Sri Lanka", "Kenya"],
    processingTime: "24-48 hours",
    color: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-500/10",
  },
];

export function VisaTypesExplained() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
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
            Education
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-3">
            Visa Types Explained
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Understanding visa types helps you plan better. Here's a quick guide to the most common visa categories.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8"
        >
          {visaTypes.map((type, index) => (
            <motion.div
              key={type.title}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative rounded-2xl bg-card border border-border overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              
              <div className="relative p-6">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${type.bgColor} ${type.iconColor} mb-4`}>
                  <type.icon className="h-7 w-7" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-foreground mb-1">{type.title}</h3>
                <p className="text-sm text-primary font-medium mb-3">{type.subtitle}</p>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {type.description}
                </p>

                {/* Examples */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {type.examples.map((example) => (
                    <span
                      key={example}
                      className="px-2 py-1 text-xs bg-secondary rounded-full text-secondary-foreground"
                    >
                      {example}
                    </span>
                  ))}
                </div>

                {/* Processing time */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Processing Time</p>
                    <p className="font-semibold text-foreground">{type.processingTime}</p>
                  </div>
                  <Link
                    to="/visas"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Learn More <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
