import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Layout, PageHero } from "@/components/layout";
import { SEO } from "@/components/seo";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const faqCategories = [
  {
    name: "General Questions",
    faqs: [
      {
        question: "What is Travel Idea?",
        answer: "Travel Idea (Experience Travelidea Private Limited) is an ISO9001:2015 certified and IATA accredited travel agency specializing in visa services for 100+ countries."
      },
      {
        question: "How do I apply for a visa through Travel Idea?",
        answer: "Browse our visa catalog, select your destination, and click 'Send Enquiry'. Our specialists will contact you within 24 hours."
      },
      {
        question: "What makes Travel Idea different?",
        answer: "We offer a 99% success rate, transparent pricing, 24/7 support, and express processing. Our ISO and IATA certifications ensure reliability."
      }
    ]
  },
  {
    name: "Visa Processing",
    faqs: [
      {
        question: "How long does visa processing take?",
        answer: "Times vary by country. Some eVisas take 3-5 days, while sticker visas for USA or UK may take several weeks."
      },
      {
        question: "What documents do I need?",
        answer: "Common requirements: valid passport (6+ months), photos, travel itinerary, accommodation proof, bank statements, and travel insurance."
      },
      {
        question: "Can I track my application status?",
        answer: "Yes! We provide regular updates via email and phone. Contact our support team anytime for status updates."
      },
      {
        question: "What if my visa is rejected?",
        answer: "With our 99% success rate, rejections are rare. If denied, we'll guide you on reapplication and identify issues."
      }
    ]
  },
  {
    name: "Pricing & Payment",
    faqs: [
      {
        question: "What is included in the visa price?",
        answer: "Our prices include processing fees, document verification, submission, and customer support. Government fees are shown separately."
      },
      {
        question: "Are there hidden fees?",
        answer: "No. We believe in transparency. All fees are displayed upfront before processing."
      }
    ]
  },
  {
    name: "Support & Contact",
    faqs: [
      {
        question: "How can I contact Travel Idea?",
        answer: "Phone: +91 9101197909, Email: b2b@travelidea.in, or visit our offices in Tezpur or Kolkata (Mon-Sat, 9AM-7PM)."
      },
      {
        question: "Do you offer 24/7 support?",
        answer: "Yes, for urgent travel matters. Regular enquiries are handled during business hours with 24-hour response times."
      }
    ]
  }
];

export default function FAQs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenItems(newOpen);
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(
      faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <Layout>
      <SEO 
        title="FAQs - Travel Idea" 
        description="Find answers to frequently asked questions about Travel Idea's visa services." 
      />

      <PageHero
        title="Frequently Asked Questions"
        subtitle="Find quick answers to common questions about our visa services."
        icon={HelpCircle}
        badge="Help Center"
      >
        <div className="relative max-w-sm mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
      </PageHero>

      {/* FAQs */}
      <section className="py-10">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-6">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No FAQs match your search.</p>
              </div>
            ) : (
              filteredCategories.map((category, catIndex) => (
                <motion.div 
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIndex * 0.1 }}
                >
                  <h2 className="text-sm font-semibold text-accent mb-3">{category.name}</h2>
                  <div className="space-y-2">
                    {category.faqs.map((faq, index) => {
                      const id = `${category.name}-${index}`;
                      const isOpen = openItems.has(id);
                      return (
                        <div key={id} className="bg-card border rounded-xl overflow-hidden">
                          <button
                            onClick={() => toggleItem(id)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                          >
                            <span className="font-medium text-sm pr-4">{faq.question}</span>
                            {isOpen ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                            )}
                          </button>
                          <div className={cn(
                            "overflow-hidden transition-all duration-300",
                            isOpen ? "max-h-96" : "max-h-0"
                          )}>
                            <div className="px-4 pb-4 text-sm text-muted-foreground">
                              {faq.answer}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* CTA */}
          <div className="max-w-3xl mx-auto mt-10 p-6 bg-muted/50 rounded-xl text-center">
            <h3 className="font-semibold mb-2">Still have questions?</h3>
            <p className="text-sm text-muted-foreground mb-4">Our team is happy to help.</p>
            <Link to="/contact">
              <Button size="sm" className="bg-accent hover:bg-accent/90">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
