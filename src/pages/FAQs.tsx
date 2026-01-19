import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { cn } from "@/lib/utils";

const faqCategories = [
  {
    name: "General Questions",
    faqs: [
      {
        question: "What is Travel Idea?",
        answer: "Travel Idea (Experience Travelidea Private Limited) is an ISO9001:2015 certified and IATA accredited travel agency specializing in visa services. We help travelers obtain visas for 100+ countries with expert guidance and transparent pricing."
      },
      {
        question: "How do I apply for a visa through Travel Idea?",
        answer: "Simply browse our visa catalog, select your destination country, and click 'Send Enquiry'. Our visa specialists will contact you within 24 hours to guide you through the application process and document requirements."
      },
      {
        question: "What makes Travel Idea different from other visa agencies?",
        answer: "We offer a 99% success rate, transparent pricing with no hidden fees, 24/7 customer support, and express processing options. Our ISO and IATA certifications ensure quality and reliability in every application."
      }
    ]
  },
  {
    name: "Visa Processing",
    faqs: [
      {
        question: "How long does visa processing take?",
        answer: "Processing times vary by country and visa type. Some eVisas (like UAE and Thailand) can be processed in 3-5 days, while sticker visas for countries like the USA or UK may take several weeks. Check individual visa pages for specific timelines."
      },
      {
        question: "What documents do I need for a visa application?",
        answer: "Common requirements include a valid passport (6+ months validity), passport-size photographs, travel itinerary, proof of accommodation, bank statements, and travel insurance. Specific requirements vary by destination and are listed on each visa page."
      },
      {
        question: "Can I track my visa application status?",
        answer: "Yes! After submitting your application, our team will provide regular updates via email and phone. You can also contact our support team anytime for status updates."
      },
      {
        question: "What if my visa application is rejected?",
        answer: "While our 99% success rate minimizes rejections, if your application is denied, we'll provide guidance on reapplication and help identify issues. Some service fees may be non-refundable depending on the stage of processing."
      }
    ]
  },
  {
    name: "Pricing & Payment",
    faqs: [
      {
        question: "What is included in the visa price?",
        answer: "Our prices include visa processing fees, document verification, application submission, and customer support. Government fees and taxes are shown separately where applicable."
      },
      {
        question: "Are there any hidden fees?",
        answer: "No. We believe in complete transparency. All fees are clearly displayed on our website. Any additional fees (like embassy fees or courier charges) are communicated upfront before processing."
      },
      {
        question: "What payment methods do you accept?",
        answer: "Currently, we operate on an enquiry-based model. After you submit an enquiry, our team will discuss payment options which may include bank transfer, UPI, and other methods."
      }
    ]
  },
  {
    name: "Support & Contact",
    faqs: [
      {
        question: "How can I contact Travel Idea?",
        answer: "You can reach us via phone at +91 9101197909, email at b2b@travelidea.in, or visit our offices in Tezpur (Assam) or Kolkata (West Bengal). Our team is available Monday to Saturday, 9 AM to 7 PM."
      },
      {
        question: "Do you offer 24/7 support?",
        answer: "Yes, for urgent travel matters, we provide 24/7 emergency support. Regular enquiries are handled during business hours with responses within 24 hours."
      },
      {
        question: "Can I visit your office in person?",
        answer: "Absolutely! Our head office is located at G-Square Mall, Tezpur Main Road, Tezpur, Assam 784001. Our Kolkata branch is at PS Arcadia, 9th Floor, 4A Camac Street, Kolkata 700016."
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
        description="Find answers to frequently asked questions about Travel Idea's visa services, processing times, pricing, and more." 
      />

      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mb-8">
            Find quick answers to common questions about our visa services.
          </p>
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-background"
            />
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-8">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No FAQs match your search. Try a different query.</p>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div key={category.name}>
                  <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
                  <div className="space-y-3">
                    {category.faqs.map((faq, index) => {
                      const id = `${category.name}-${index}`;
                      const isOpen = openItems.has(id);
                      return (
                        <div key={id} className="bg-card border rounded-xl overflow-hidden">
                          <button
                            onClick={() => toggleItem(id)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                          >
                            <span className="font-medium pr-4">{faq.question}</span>
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                            )}
                          </button>
                          <div className={cn(
                            "overflow-hidden transition-all duration-300",
                            isOpen ? "max-h-96" : "max-h-0"
                          )}>
                            <div className="px-4 pb-4 text-muted-foreground">
                              {faq.answer}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* CTA */}
          <div className="max-w-3xl mx-auto mt-12 p-8 bg-muted/30 rounded-xl text-center">
            <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">Our team is happy to help you with any queries.</p>
            <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}