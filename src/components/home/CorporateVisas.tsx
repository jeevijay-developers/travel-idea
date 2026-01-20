import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Users, Building2, Briefcase, UserCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const offerings = [
  {
    icon: Users,
    title: "Family Travel",
    description: "Special packages for family visa applications. Discounts for 3+ members traveling together.",
    benefit: "Up to 15% off",
  },
  {
    icon: Building2,
    title: "Corporate Visas",
    description: "Dedicated account management for businesses. Volume discounts and priority processing.",
    benefit: "Priority Queue",
  },
  {
    icon: Briefcase,
    title: "Group Bookings",
    description: "Planning a group trip? Get bulk discounts for 10+ travelers with coordinated processing.",
    benefit: "Bulk Discounts",
  },
  {
    icon: UserCheck,
    title: "Dedicated Manager",
    description: "Your personal visa expert handles everything. One point of contact for all your travel needs.",
    benefit: "Personal Support",
  },
];

export function CorporateVisas() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
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
            For Business & Groups
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-3">
            Corporate & Group Solutions
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Special services for families, businesses, and groups. Get dedicated support and exclusive discounts.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          {offerings.map((item, index) => (
            <motion.div
              key={item.title}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="relative bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-primary/30 transition-all group"
            >
              {/* Benefit badge */}
              <div className="absolute -top-3 right-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                {item.benefit}
              </div>

              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <item.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
              </div>

              <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center"
        >
          <Link to="/contact">
            <Button size="lg" variant="outline" className="h-12 px-6">
              Contact for Group Enquiry
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
