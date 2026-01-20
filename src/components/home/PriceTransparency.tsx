import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Shield, BadgeCheck, Calculator, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function PriceTransparency() {
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
    <section ref={ref} className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left - Content */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              100% Transparent Pricing
            </span>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What You See is What You Pay
            </h2>
            
            <p className="text-primary-foreground/80 text-lg mb-8">
              No hidden charges, no surprise fees at checkout. Our pricing breakdown shows exactly where your money goes.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <BadgeCheck className="h-6 w-6 text-travel-success" />
                <span>Embassy/Consulate fees included</span>
              </div>
              <div className="flex items-center gap-3">
                <BadgeCheck className="h-6 w-6 text-travel-success" />
                <span>Service charges clearly mentioned</span>
              </div>
              <div className="flex items-center gap-3">
                <BadgeCheck className="h-6 w-6 text-travel-success" />
                <span>No processing fees hidden at checkout</span>
              </div>
              <div className="flex items-center gap-3">
                <BadgeCheck className="h-6 w-6 text-travel-success" />
                <span>GST and taxes included in displayed price</span>
              </div>
            </div>

            <Link
              to="/visas"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              <Calculator className="h-5 w-5" />
              Check Visa Prices
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Right - Price breakdown example */}
          <motion.div variants={itemVariants}>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Sample Price Breakdown</h3>
                <span className="px-3 py-1 bg-travel-success text-white text-sm rounded-full">UAE eVisa</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-white/20">
                  <span className="text-primary-foreground/80">Embassy Fee</span>
                  <span className="font-semibold">₹5,999</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-white/20">
                  <span className="text-primary-foreground/80">Service Fee</span>
                  <span className="font-semibold">₹1,200</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-white/20">
                  <span className="text-primary-foreground/80">GST (18%)</span>
                  <span className="font-semibold">₹200</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold">₹7,399</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-travel-success/20 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <BadgeCheck className="h-5 w-5 text-travel-success" />
                  <span>No hidden charges guarantee</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
