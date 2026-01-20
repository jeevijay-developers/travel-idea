import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Clock, FileText, Calendar, Zap, ArrowLeft, CheckCircle, 
  Globe, Shield, Users, AlertCircle, Phone, Mail, 
  Plane, HelpCircle, ChevronRight, ChevronDown,
  Ban, Check, Info, Send, Sparkles, MapPin, CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { enquirySchema, EnquiryFormData } from "@/lib/validation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

// Questionnaire steps
const questionnaireSteps = [
  { id: 1, title: "Personal Details", icon: Users },
  { id: 2, title: "Contact Info", icon: Mail },
  { id: 3, title: "Travel Plans", icon: Plane },
];

export default function VisaDetail() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [visa, setVisa] = useState<Visa | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<EnquiryFormData>({
    name: "",
    email: "",
    phone: "",
    destination: "",
    message: ""
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryFormData, string>>>({});

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
      setFormData(prev => ({ ...prev, destination: data.countries?.name || "" }));
    }
    setLoading(false);
  };

  const handleChange = (field: keyof EnquiryFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const stepErrors: Partial<Record<keyof EnquiryFormData, string>> = {};
    
    if (step === 1 && !formData.name.trim()) {
      stepErrors.name = "Please enter your name";
    }
    if (step === 2) {
      if (!formData.email.trim()) stepErrors.email = "Please enter your email";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        stepErrors.email = "Please enter a valid email";
      }
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = enquirySchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof EnquiryFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof EnquiryFormData;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from("enquiries").insert({
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone || null,
        destination: result.data.destination,
        visa_id: visa?.id || null,
        message: result.data.message || null,
        status: "new"
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Enquiry Submitted!",
        description: "Our team will contact you within 24 hours.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to submit enquiry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-80 bg-muted rounded-2xl" />
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
        description={visa.short_description || `Apply for ${visa.countries?.name} visa with Travel Idea.`} 
      />

      {/* Hero - Full vibrant image */}
      <section className="relative h-[50vh] min-h-[400px] max-h-[500px]">
        <img
          src={countryImages[visa.countries?.slug] || uaeImage}
          alt={visa.countries?.name}
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text readability - no white fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight className="h-4 w-4" />
                <Link to="/visas" className="hover:text-white transition-colors">Visas</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-white">{visa.countries?.name}</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm mb-4">
                <Sparkles className="h-4 w-4" />
                {visa.visa_type}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-3">
                {visa.countries?.name} Visa
              </h1>
              
              <p className="text-white/80 text-lg mb-6 max-w-xl">
                {visa.title}
              </p>

              {/* Quick stats in hero */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <Clock className="h-5 w-5 text-accent" />
                  <span className="text-white font-medium">{visa.processing_days} Days</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <CreditCard className="h-5 w-5 text-accent" />
                  <span className="text-white font-medium">₹{visa.price.toLocaleString()}</span>
                </div>
                {visa.is_fast && (
                  <div className="flex items-center gap-2 bg-accent/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <Zap className="h-5 w-5 text-accent" />
                    <span className="text-white font-medium">Express Available</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-16">
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Main content - 3 columns */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: Clock, label: "Processing", value: `${visa.processing_days} days`, color: "text-primary" },
                  { icon: Calendar, label: "Validity", value: visa.validity || "30-90 days", color: "text-accent" },
                  { icon: FileText, label: "Type", value: visa.visa_type, color: "text-primary" },
                  { icon: Zap, label: "Fast Track", value: visa.is_fast ? "Yes" : "Standard", color: "text-amber-500" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card border border-border rounded-xl p-4 text-center hover:shadow-md transition-shadow"
                  >
                    <item.icon className={`h-6 w-6 mx-auto mb-2 ${item.color}`} />
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="font-semibold text-sm text-foreground">{item.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* About This Visa */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-primary to-primary/80 p-4">
                  <h2 className="text-lg font-semibold text-primary-foreground flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    About This Visa
                  </h2>
                </div>
                <div className="p-5 space-y-5">
                  <p className="text-muted-foreground leading-relaxed">
                    {visa.description || `The ${visa.countries?.name} ${visa.visa_type} is designed for travelers visiting ${visa.countries?.name} for tourism, leisure, and recreational purposes. This visa grants you legal entry to explore the country's world-renowned attractions and experience its rich cultural heritage.`}
                  </p>

                  {/* Key Highlights Grid */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { icon: Clock, title: "Processing Time", desc: `${visa.processing_days} working days` },
                      { icon: Calendar, title: "Visa Validity", desc: `${visa.validity || "30-90 days"} from issue` },
                      { icon: Plane, title: "Entry Type", desc: "Single / Multiple Entry" },
                      { icon: Users, title: "Stay Duration", desc: "Up to 30-90 days per visit" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <item.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-muted-foreground text-xs">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* What's Included */}
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Check className="h-4 w-4 text-accent" />
                      What's Included
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {[
                        "Complete application assistance",
                        "Document verification & review",
                        "Embassy appointment booking",
                        "Application form filling",
                        "Real-time status updates",
                        "Dedicated visa expert support",
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Application Process */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-accent to-accent/80 p-4">
                  <h2 className="text-lg font-semibold text-accent-foreground flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Application Process
                  </h2>
                </div>
                <div className="p-5">
                  <div className="relative">
                    {[
                      { step: 1, title: "Submit Enquiry", desc: "Fill our simple form with your travel details" },
                      { step: 2, title: "Document Collection", desc: "We guide you on required documents" },
                      { step: 3, title: "Application Review", desc: "Expert review to ensure accuracy" },
                      { step: 4, title: "Embassy Submission", desc: "We submit to the embassy/consulate" },
                      { step: 5, title: "Receive Your Visa", desc: "Get your approved visa delivered" }
                    ].map((step, i, arr) => (
                      <div key={step.step} className="flex gap-4 pb-5 last:pb-0">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                            {step.step}
                          </div>
                          {i < arr.length - 1 && <div className="w-0.5 flex-1 bg-accent/30 mt-2" />}
                        </div>
                        <div className="pt-1">
                          <p className="font-medium text-sm">{step.title}</p>
                          <p className="text-xs text-muted-foreground">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Required Documents */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-primary to-primary/80 p-4">
                  <h2 className="text-lg font-semibold text-primary-foreground flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Required Documents
                  </h2>
                </div>
                <div className="p-5">
                  <div className="grid sm:grid-cols-2 gap-2">
                    {(visa.required_documents || [
                      "Valid Passport (6+ months validity)",
                      "Passport-size Photos",
                      "Confirmed Return Tickets",
                      "Hotel Booking Proof",
                      "Bank Statement (3 months)",
                      "Travel Insurance",
                      "Cover Letter",
                      "Proof of Employment"
                    ]).map((doc, i) => (
                      <div key={i} className="flex items-start gap-2 p-2.5 bg-muted/50 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{doc}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        <strong className="text-foreground">Note:</strong> Additional documents may be required based on your case.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Common Rejection Reasons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-destructive/80 to-destructive/60 p-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Ban className="h-5 w-5" />
                    Common Rejection Reasons
                  </h2>
                </div>
                <div className="p-5 space-y-2">
                  {[
                    "Incomplete or incorrect application form",
                    "Passport with less than 6 months validity",
                    "Insufficient proof of financial stability",
                    "Missing or unclear travel documents",
                    "Previous visa violations or overstays",
                  ].map((reason, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{reason}</span>
                    </div>
                  ))}
                  <p className="pt-3 text-xs text-muted-foreground border-t mt-4">
                    <strong className="text-foreground">Don't worry!</strong> Our team reviews every application to ensure requirements are met.
                  </p>
                </div>
              </motion.div>

              {/* FAQs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-primary to-primary/80 p-4">
                  <h2 className="text-lg font-semibold text-primary-foreground flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Frequently Asked Questions
                  </h2>
                </div>
                <div className="p-5">
                  <Accordion type="single" collapsible className="space-y-2">
                    {[
                      { q: `How long does it take to get a ${visa.countries?.name} visa?`, a: `Standard processing takes ${visa.processing_days} working days. Express processing may be available.` },
                      { q: "Is my visa approval guaranteed?", a: "We maintain a 99% success rate. Our expert review minimizes rejection risks significantly." },
                      { q: "Can I track my visa application status?", a: "Yes! You'll receive real-time updates via email and WhatsApp." },
                      { q: "What happens if my visa gets rejected?", a: "We'll analyze the rejection and guide you on reapplication. Partial refunds may apply." },
                    ].map((faq, i) => (
                      <AccordionItem key={i} value={`faq-${i}`} className="border rounded-xl px-4">
                        <AccordionTrigger className="text-sm text-left font-medium hover:no-underline py-3">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground pb-3">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </motion.div>
            </div>

            {/* Sidebar - 2 columns - Questionnaire Form */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg"
                >
                  {/* Price header */}
                  <div className="bg-gradient-to-r from-accent via-accent to-accent/80 p-5 text-center">
                    <p className="text-accent-foreground/80 text-sm">Starting from</p>
                    <p className="text-4xl font-bold text-accent-foreground">₹{visa.price.toLocaleString()}</p>
                    {visa.additional_fees && (
                      <p className="text-accent-foreground/70 text-xs mt-1">{visa.additional_fees}</p>
                    )}
                    {visa.issued_recently && visa.issued_recently > 0 && (
                      <div className="mt-3 inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs text-white">
                        <Sparkles className="h-3 w-3" />
                        {visa.issued_recently} issued recently
                      </div>
                    )}
                  </div>

                  {submitted ? (
                    <div className="p-6 text-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Our visa specialists will contact you within 24 hours.
                      </p>
                      <Link to="/visas">
                        <Button variant="outline" size="sm">Explore More Visas</Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      {/* Progress Steps */}
                      <div className="flex justify-center gap-1 p-4 border-b bg-muted/30">
                        {questionnaireSteps.map((step, i) => (
                          <div key={step.id} className="flex items-center">
                            <div 
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                                currentStep >= step.id 
                                  ? "bg-accent text-accent-foreground" 
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {step.id}
                            </div>
                            {i < questionnaireSteps.length - 1 && (
                              <div className={`w-8 h-0.5 mx-1 ${currentStep > step.id ? "bg-accent" : "bg-muted"}`} />
                            )}
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleSubmit} className="p-5">
                        {/* Step 1: Personal Details */}
                        {currentStep === 1 && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                          >
                            <div className="text-center mb-4">
                              <Users className="h-8 w-8 text-accent mx-auto mb-2" />
                              <h3 className="font-semibold">What's your name?</h3>
                              <p className="text-xs text-muted-foreground">Let's start with the basics</p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="name">Full Name *</Label>
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                placeholder="Enter your full name"
                                className={`h-11 ${errors.name ? "border-destructive" : ""}`}
                              />
                              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                            </div>
                            <Button type="button" onClick={nextStep} className="w-full h-11 bg-accent hover:bg-accent/90">
                              Continue
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                          </motion.div>
                        )}

                        {/* Step 2: Contact Info */}
                        {currentStep === 2 && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                          >
                            <div className="text-center mb-4">
                              <Mail className="h-8 w-8 text-accent mx-auto mb-2" />
                              <h3 className="font-semibold">How can we reach you?</h3>
                              <p className="text-xs text-muted-foreground">We'll send updates here</p>
                            </div>
                            <div className="space-y-3">
                              <div className="space-y-2">
                                <Label htmlFor="email">Email Address *</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) => handleChange("email", e.target.value)}
                                  placeholder="your@email.com"
                                  className={`h-11 ${errors.email ? "border-destructive" : ""}`}
                                />
                                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                  id="phone"
                                  type="tel"
                                  value={formData.phone}
                                  onChange={(e) => handleChange("phone", e.target.value)}
                                  placeholder="+91 98765 43210"
                                  className="h-11"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-11">
                                Back
                              </Button>
                              <Button type="button" onClick={nextStep} className="flex-1 h-11 bg-accent hover:bg-accent/90">
                                Continue
                              </Button>
                            </div>
                          </motion.div>
                        )}

                        {/* Step 3: Travel Plans */}
                        {currentStep === 3 && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                          >
                            <div className="text-center mb-4">
                              <Plane className="h-8 w-8 text-accent mx-auto mb-2" />
                              <h3 className="font-semibold">Tell us about your trip</h3>
                              <p className="text-xs text-muted-foreground">Any specific requirements?</p>
                            </div>
                            <div className="space-y-3">
                              <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-accent" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Destination</p>
                                  <p className="font-medium text-sm">{visa.countries?.name}</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="message">Additional Details</Label>
                                <Textarea
                                  id="message"
                                  value={formData.message}
                                  onChange={(e) => handleChange("message", e.target.value)}
                                  placeholder="Travel dates, number of travelers, special requirements..."
                                  rows={3}
                                  className="resize-none"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-11">
                                Back
                              </Button>
                              <Button type="submit" disabled={submitting} className="flex-1 h-11 bg-accent hover:bg-accent/90">
                                {submitting ? "Submitting..." : "Submit"}
                                <Send className="h-4 w-4 ml-2" />
                              </Button>
                            </div>
                          </motion.div>
                        )}

                        <p className="text-[10px] text-center text-muted-foreground mt-4">
                          By submitting, you agree to our{" "}
                          <Link to="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link>
                        </p>
                      </form>
                    </>
                  )}

                  {/* Contact info */}
                  <div className="border-t p-4 bg-muted/30">
                    <p className="text-xs text-center text-muted-foreground mb-2">Need immediate help?</p>
                    <div className="flex justify-center gap-4">
                      <a href="tel:+919101197909" className="flex items-center gap-1.5 text-sm text-accent hover:underline">
                        <Phone className="h-4 w-4" />
                        Call Now
                      </a>
                      <a href="mailto:b2b@travelidea.in" className="flex items-center gap-1.5 text-sm text-accent hover:underline">
                        <Mail className="h-4 w-4" />
                        Email
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back button */}
      <section className="pb-10">
        <div className="container">
          <Link to="/visas" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to all visas
          </Link>
        </div>
      </section>
    </Layout>
  );
}
