import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Clock, FileText, Calendar, Zap, ArrowLeft, CheckCircle, 
  Globe, Shield, Users, AlertCircle, Phone, Mail, 
  MapPin, Plane, CreditCard, HelpCircle, ChevronRight,
  Ban, Check, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { supabase } from "@/integrations/supabase/client";

// Country images
import uaeImage from "@/assets/countries/uae.jpg";
import usaImage from "@/assets/countries/usa.jpg";
import japanImage from "@/assets/countries/japan.jpg";
import singaporeImage from "@/assets/countries/singapore.jpg";
import thailandImage from "@/assets/countries/thailand.jpg";
import malaysiaImage from "@/assets/countries/malaysia.jpg";
import vietnamImage from "@/assets/countries/vietnam.jpg";
import ukImage from "@/assets/countries/uk.jpg";
import southKoreaImage from "@/assets/countries/south-korea.jpg";
import australiaImage from "@/assets/countries/australia.jpg";

const countryImages: Record<string, string> = {
  uae: uaeImage,
  usa: usaImage,
  japan: japanImage,
  singapore: singaporeImage,
  thailand: thailandImage,
  malaysia: malaysiaImage,
  vietnam: vietnamImage,
  uk: ukImage,
  "south-korea": southKoreaImage,
  australia: australiaImage,
};

interface Visa {
  id: string;
  title: string;
  visa_type: string;
  short_description: string | null;
  description: string | null;
  price: number;
  additional_fees: string | null;
  processing_days: number;
  validity: string | null;
  required_documents: string[] | null;
  is_fast: boolean;
  issued_recently: number;
  countries: {
    name: string;
    slug: string;
    code: string;
  };
}

export default function VisaDetail() {
  const { slug } = useParams();
  const [visa, setVisa] = useState<Visa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisa();
  }, [slug]);

  const fetchVisa = async () => {
    const { data, error } = await supabase
      .from("visas")
      .select(`
        *,
        countries (
          name,
          slug,
          code
        )
      `)
      .eq("countries.slug", slug)
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      setVisa(data as Visa);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-muted rounded-xl" />
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!visa) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Visa not found</h1>
          <p className="text-muted-foreground mb-8">The visa you're looking for doesn't exist.</p>
          <Link to="/visas">
            <Button>View All Visas</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title={`${visa.countries?.name} Visa - Travel Idea`} 
        description={visa.short_description || `Apply for ${visa.countries?.name} visa with Travel Idea. Fast processing, transparent pricing.`} 
      />

      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4 border-b">
        <div className="container">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/visas" className="text-muted-foreground hover:text-foreground">Visas</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{visa.countries?.name}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={countryImages[visa.countries?.slug] || uaeImage}
          alt={visa.countries?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container">
            <Link to="/visas" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to all visas
            </Link>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              {visa.countries?.name} {visa.visa_type}
            </h1>
            <p className="text-muted-foreground">{visa.title}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border rounded-xl p-4 text-center">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Processing Time</p>
                  <p className="font-semibold">{visa.processing_days} days</p>
                </div>
                <div className="bg-card border rounded-xl p-4 text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Validity</p>
                  <p className="font-semibold">{visa.validity || "30-90 days"}</p>
                </div>
                <div className="bg-card border rounded-xl p-4 text-center">
                  <FileText className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-semibold">{visa.visa_type}</p>
                </div>
                <div className="bg-card border rounded-xl p-4 text-center">
                  <Zap className="h-6 w-6 mx-auto mb-2 text-amber-500" />
                  <p className="text-sm text-muted-foreground">Fast Track</p>
                  <p className="font-semibold">{visa.is_fast ? "Available" : "Standard"}</p>
                </div>
              </div>

              {/* About This Visa - Enhanced */}
              <div className="bg-card border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  About This Visa
                </h2>
                
                <div className="space-y-6">
                  {/* Main Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {visa.description || `The ${visa.countries?.name} ${visa.visa_type} is designed for travelers visiting ${visa.countries?.name} for tourism, leisure, and recreational purposes. This visa grants you legal entry to explore the country's world-renowned attractions, experience its rich cultural heritage, savor local cuisines, and create unforgettable memories.`}
                  </p>

                  {/* Key Highlights */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Processing Time</p>
                        <p className="text-muted-foreground text-sm">{visa.processing_days} working days (standard processing)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Visa Validity</p>
                        <p className="text-muted-foreground text-sm">{visa.validity || "30-90 days"} from date of issue</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Plane className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Entry Type</p>
                        <p className="text-muted-foreground text-sm">Single / Multiple Entry (as applicable)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Stay Duration</p>
                        <p className="text-muted-foreground text-sm">Up to 30-90 days per visit</p>
                      </div>
                    </div>
                  </div>

                  {/* What's Included */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Check className="h-4 w-4 text-travel-success" />
                      What's Included in Our Service
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {[
                        "Complete application assistance",
                        "Document verification & review",
                        "Embassy appointment booking",
                        "Application form filling",
                        "Real-time status updates",
                        "Dedicated visa expert support",
                        "Travel insurance guidance",
                        "Pre-departure travel tips"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-travel-success shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Eligibility */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      Who Can Apply
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        Indian passport holders traveling for tourism, business, or transit
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        Applicants with a valid passport (minimum 6 months validity)
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        Travelers with proof of sufficient funds and confirmed travel plans
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Application Process */}
              <div className="bg-card border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Application Process
                </h2>
                <div className="space-y-4">
                  {[
                    { step: 1, title: "Submit Enquiry", desc: "Fill out our simple enquiry form with your travel details" },
                    { step: 2, title: "Document Collection", desc: "Our team will guide you on required documents and collect them" },
                    { step: 3, title: "Application Review", desc: "Expert review of your application to ensure accuracy" },
                    { step: 4, title: "Embassy Submission", desc: "We submit your application to the embassy/consulate" },
                    { step: 5, title: "Receive Your Visa", desc: "Get your approved visa delivered to your email/address" }
                  ].map((step, index) => (
                    <div key={step.step} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                          {step.step}
                        </div>
                        {index < 4 && <div className="w-0.5 h-full bg-border mt-2" />}
                      </div>
                      <div className="pb-6">
                        <p className="font-medium">{step.title}</p>
                        <p className="text-sm text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required documents */}
              <div className="bg-card border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Required Documents
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {(visa.required_documents || [
                    "Valid Passport (6+ months validity)",
                    "Passport-size Photos (white background)",
                    "Confirmed Return Flight Tickets",
                    "Hotel Booking / Accommodation Proof",
                    "Bank Statement (last 3 months)",
                    "Travel Insurance",
                    "Cover Letter / Travel Itinerary",
                    "Proof of Employment / Business"
                  ]).map((doc, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-travel-success shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{doc}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Important Note</p>
                      <p className="text-sm text-muted-foreground">Additional documents may be required based on your specific case. Our visa experts will guide you through the exact requirements after you submit your enquiry.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Common Rejection Reasons */}
              <div className="bg-card border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Ban className="h-5 w-5 text-destructive" />
                  Common Rejection Reasons (Avoid These!)
                </h2>
                <div className="space-y-3">
                  {[
                    "Incomplete or incorrect application form",
                    "Passport with less than 6 months validity",
                    "Insufficient proof of financial stability",
                    "Missing or unclear travel documents",
                    "Previous visa violations or overstays",
                    "Unclear purpose of travel"
                  ].map((reason, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{reason}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  <strong className="text-foreground">Don't worry!</strong> Our expert team reviews every application to ensure all requirements are met before submission.
                </p>
              </div>

              {/* FAQs */}
              <div className="bg-card border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {[
                    { 
                      q: `How long does it take to get a ${visa.countries?.name} visa?`, 
                      a: `Standard processing takes ${visa.processing_days} working days. Express processing may be available for urgent travel needs.` 
                    },
                    { 
                      q: "Is my visa approval guaranteed?", 
                      a: "While we maintain a 99% success rate, visa approval is ultimately at the discretion of the embassy. Our expert review minimizes rejection risks significantly." 
                    },
                    { 
                      q: "Can I track my visa application status?", 
                      a: "Yes! You'll receive real-time updates via email and WhatsApp throughout the application process." 
                    },
                    { 
                      q: "What happens if my visa gets rejected?", 
                      a: "We'll analyze the rejection reason and guide you on reapplication. In some cases, partial refunds may apply as per our policy." 
                    },
                    { 
                      q: "Do I need to visit the embassy in person?", 
                      a: `This depends on the visa type. For most ${visa.visa_type} applications, we can process without your physical presence at the embassy.` 
                    }
                  ].map((faq, index) => (
                    <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                      <p className="font-medium mb-2">{faq.q}</p>
                      <p className="text-sm text-muted-foreground">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card border rounded-xl p-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground">Starting from</p>
                  <p className="text-4xl font-bold text-primary">₹{visa.price.toLocaleString()}</p>
                  {visa.additional_fees && (
                    <p className="text-sm text-muted-foreground mt-1">{visa.additional_fees}</p>
                  )}
                </div>

                {visa.issued_recently && visa.issued_recently > 0 && (
                  <div className="bg-travel-success/10 text-travel-success text-sm text-center py-2 rounded-lg mb-6">
                    {visa.issued_recently} visas issued recently
                  </div>
                )}

                <Link to={`/enquiry?visa=${visa.id}&country=${visa.countries?.name}`}>
                  <Button className="w-full" size="lg">
                    Send Enquiry
                  </Button>
                </Link>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Our team will contact you within 24 hours
                </p>

                <div className="border-t mt-6 pt-6">
                  <p className="text-sm font-medium mb-3">Need help?</p>
                  <p className="text-sm text-muted-foreground">
                    Call us at <a href="tel:+919101197909" className="text-primary hover:underline">+91 9101197909</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}