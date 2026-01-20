import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Zap, Clock, ArrowRight, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const expressCountries = [
  { country: "UAE", time: "24 hours", price: "₹8,999" },
  { country: "Thailand", time: "Same day", price: "₹3,500" },
  { country: "Singapore", time: "48 hours", price: "₹5,500" },
  { country: "Malaysia", time: "24 hours", price: "₹2,500" },
  { country: "Vietnam", time: "24 hours", price: "₹3,200" },
  { country: "Turkey", time: "48 hours", price: "₹20,000" },
];

export function ExpressVisa() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
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
    <section ref={ref} className="py-20 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full text-amber-600 dark:text-amber-400 text-sm font-medium mb-4">
            <Zap className="h-4 w-4" />
            Express Processing
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Travelling Soon? We've Got You Covered
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Need your visa urgently? Our express processing service gets you approved in record time.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
        >
          {expressCountries.map((item, index) => (
            <motion.div
              key={item.country}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-amber-500/50 transition-all group"
            >
              {/* Express badge */}
              <div className="absolute -top-3 right-4 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <Zap className="h-3 w-3" />
                EXPRESS
              </div>

              <h3 className="text-xl font-bold text-foreground mb-4">{item.country}</h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <Clock className="h-4 w-4" />
                  <span className="font-semibold">{item.time}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">From</p>
                  <p className="text-lg font-bold text-primary">{item.price}</p>
                </div>
              </div>

              <Link
                to={`/visas?search=${item.country}`}
                className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                Get Express Visa <ArrowRight className="h-3 w-3" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-6 mb-10"
        >
          <div className="flex items-center gap-2 text-sm">
            <BadgeCheck className="h-5 w-5 text-travel-success" />
            <span>Priority processing queue</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BadgeCheck className="h-5 w-5 text-travel-success" />
            <span>Dedicated visa expert</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BadgeCheck className="h-5 w-5 text-travel-success" />
            <span>Real-time status updates</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BadgeCheck className="h-5 w-5 text-travel-success" />
            <span>Money-back guarantee</span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center"
        >
          <Link to="/visas">
            <Button size="lg" className="h-14 px-8 text-lg bg-amber-500 hover:bg-amber-600 text-white">
              <Zap className="mr-2 h-5 w-5" />
              Get Express Visa Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
