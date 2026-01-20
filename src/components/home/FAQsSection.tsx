import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const faqs = [
  {
    question: "What is Travel Idea?",
    answer: "Travel Idea (Experience Travelidea Private Limited) is an ISO9001:2015 certified and IATA accredited travel agency specializing in visa services. We help travelers obtain visas for 100+ countries with expert guidance and transparent pricing."
  },
  {
    question: "How do I apply for a visa through Travel Idea?",
    answer: "Simply browse our visa catalog, select your destination country, and click 'Send Enquiry'. Our visa specialists will contact you within 24 hours to guide you through the application process and document requirements."
  },
  {
    question: "How long does visa processing take?",
    answer: "Processing times vary by country and visa type. Some eVisas (like UAE and Thailand) can be processed in 3-5 days, while sticker visas for countries like the USA or UK may take several weeks. Check individual visa pages for specific timelines."
  },
  {
    question: "What documents do I need for a visa application?",
    answer: "Common requirements include a valid passport (6+ months validity), passport-size photographs, travel itinerary, proof of accommodation, bank statements, and travel insurance. Specific requirements vary by destination and are listed on each visa page."
  },
  {
    question: "Are there any hidden fees?",
    answer: "No. We believe in complete transparency. All fees are clearly displayed on our website. Any additional fees (like embassy fees or courier charges) are communicated upfront before processing."
  },
  {
    question: "How can I contact Travel Idea?",
    answer: "You can reach us via phone at +91 9101197909, email at b2b@travelidea.in, or visit our offices in Tezpur (Assam) or Kolkata (West Bengal). Our team is available Monday to Saturday, 9 AM to 7 PM."
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

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <section ref={sectionRef} className="py-16 bg-muted/30">
      <div className="container">
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={headerVariants}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find quick answers to common questions about our visa services.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="max-w-3xl mx-auto space-y-3"
        >
          {faqs.map((faq, index) => {
            const isOpen = openItems.has(index);
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-card border rounded-xl overflow-hidden shadow-sm"
              >
                <motion.button
                  onClick={() => toggleItem(index)}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors"
                >
                  <span className="font-medium pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      isOpen ? "text-primary" : "text-muted-foreground"
                    )} />
                  </motion.div>
                </motion.button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-muted-foreground">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-8"
        >
          <a 
            href="/faqs" 
            className="text-primary font-medium hover:underline"
          >
            View all FAQs →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
