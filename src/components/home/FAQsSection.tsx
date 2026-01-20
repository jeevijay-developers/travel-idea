import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "What is Travel Idea?",
    answer: "Travel Idea is an ISO9001:2015 certified and IATA accredited travel agency specializing in visa services for 100+ countries with expert guidance and transparent pricing."
  },
  {
    question: "How do I apply for a visa?",
    answer: "Browse our visa catalog, select your destination, and click 'Send Enquiry'. Our specialists will contact you within 24 hours to guide you through the process."
  },
  {
    question: "How long does processing take?",
    answer: "Processing varies by country. Some eVisas take 3-5 days, while sticker visas may take several weeks. Check individual visa pages for specific timelines."
  },
  {
    question: "What documents do I need?",
    answer: "Common requirements include valid passport, photos, travel itinerary, accommodation proof, bank statements, and travel insurance. Specific requirements vary by destination."
  },
  {
    question: "Are there hidden fees?",
    answer: "No. We believe in complete transparency. All fees are clearly displayed upfront before processing."
  },
  {
    question: "How can I contact you?",
    answer: "Call us at +91 9101197909, email b2b@travelidea.in, or visit our offices in Tezpur or Kolkata. Available Monday-Saturday, 9 AM-7 PM."
  }
];

export function FAQsSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const toggleItem = (index: number) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(index)) {
      newOpen.delete(index);
    } else {
      newOpen.add(index);
    }
    setOpenItems(newOpen);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-muted/30">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Quick answers to common questions about our visa services.
          </p>
        </motion.div>

        {/* FAQs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="max-w-2xl mx-auto space-y-2"
        >
          {faqs.map((faq, index) => {
            const isOpen = openItems.has(index);
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
                >
                  <span className="font-medium text-sm pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isOpen ? "text-accent" : "text-muted-foreground"
                    )} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 text-muted-foreground text-sm leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-center mt-6"
        >
          <Link to="/faqs" className="text-accent text-sm font-medium hover:underline">
            View all FAQs →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}