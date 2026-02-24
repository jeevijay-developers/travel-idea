import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Clock, FileText, Calendar, Zap, ArrowLeft, CheckCircle, 
  Globe, Shield, Users, AlertCircle, Phone, Mail, 
  Plane, HelpCircle, ChevronRight,
  Ban, Check, Info, Send, Sparkles, MapPin, CreditCard,
  Star, Award, Headphones, ArrowRight
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

// Country images - fallback for countries without image_url
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
import franceImage from "@/assets/countries/france.jpg";
import germanyImage from "@/assets/countries/germany.jpg";
import italyImage from "@/assets/countries/italy.jpg";
import spainImage from "@/assets/countries/spain.jpg";
import netherlandsImage from "@/assets/countries/netherlands.jpg";
import switzerlandImage from "@/assets/countries/switzerland.jpg";
import canadaImage from "@/assets/countries/canada.jpg";
import chinaImage from "@/assets/countries/china.jpg";
import indonesiaImage from "@/assets/countries/indonesia.jpg";
import turkeyImage from "@/assets/countries/turkey.jpg";
import egyptImage from "@/assets/countries/egypt.jpg";
import sriLankaImage from "@/assets/countries/sri-lanka.jpg";
import omanImage from "@/assets/countries/oman.jpg";
import bahrainImage from "@/assets/countries/bahrain.jpg";
import saudiArabiaImage from "@/assets/countries/saudi-arabia.jpg";
import russiaImage from "@/assets/countries/russia.jpg";
import greeceImage from "@/assets/countries/greece.jpg";
import austriaImage from "@/assets/countries/austria.jpg";
import hungaryImage from "@/assets/countries/hungary.jpg";
import czechRepublicImage from "@/assets/countries/czech-republic.jpg";
import denmarkImage from "@/assets/countries/denmark.jpg";
import swedenImage from "@/assets/countries/sweden.jpg";
import norwayImage from "@/assets/countries/norway.jpg";
import finlandImage from "@/assets/countries/finland.jpg";
import philippinesImage from "@/assets/countries/philippines.jpg";
import cambodiaImage from "@/assets/countries/cambodia.jpg";
import laosImage from "@/assets/countries/laos.jpg";
import moroccoImage from "@/assets/countries/morocco.jpg";
import kenyaImage from "@/assets/countries/kenya.jpg";
import ethiopiaImage from "@/assets/countries/ethiopia.jpg";
import madagascarImage from "@/assets/countries/madagascar.jpg";
import georgiaImage from "@/assets/countries/georgia.jpg";
import armeniaImage from "@/assets/countries/armenia.jpg";
import azerbaijanImage from "@/assets/countries/azerbaijan.jpg";
import uzbekistanImage from "@/assets/countries/uzbekistan.jpg";
import hongKongImage from "@/assets/countries/hong-kong.jpg";

// Map of country slugs to images
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
  france: franceImage,
  germany: germanyImage,
  italy: italyImage,
  spain: spainImage,
  netherlands: netherlandsImage,
  switzerland: switzerlandImage,
  canada: canadaImage,
  china: chinaImage,
  indonesia: indonesiaImage,
  turkey: turkeyImage,
  egypt: egyptImage,
  "sri-lanka": sriLankaImage,
  oman: omanImage,
  bahrain: bahrainImage,
  "saudi-arabia": saudiArabiaImage,
  russia: russiaImage,
  greece: greeceImage,
  austria: austriaImage,
  hungary: hungaryImage,
  "czech-republic": czechRepublicImage,
  denmark: denmarkImage,
  sweden: swedenImage,
  norway: norwayImage,
  finland: finlandImage,
  philippines: philippinesImage,
  cambodia: cambodiaImage,
  laos: laosImage,
  morocco: moroccoImage,
  kenya: kenyaImage,
  ethiopia: ethiopiaImage,
  madagascar: madagascarImage,
  georgia: georgiaImage,
  armenia: armeniaImage,
  azerbaijan: azerbaijanImage,
  uzbekistan: uzbekistanImage,
  "hong-kong": hongKongImage,
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
  is_featured: boolean;
  issued_recently: number | null;
  countries: {
    id: string;
    name: string;
    slug: string;
    code: string;
    image_url: string | null;
    region: string | null;
  };
}

// Questionnaire steps
const questionnaireSteps = [
  { id: 1, title: "Personal Details", icon: Users },
  { id: 2, title: "Contact Info", icon: Mail },
  { id: 3, title: "Travel Plans", icon: Plane },
];

// Default documents if none provided
const defaultDocuments = [
  "Valid Passport (6+ months validity)",
  "Passport-size Photos (White Background)",
  "Confirmed Return Tickets",
  "Hotel Booking / Accommodation Proof",
  "Bank Statement (Last 3 months)",
  "Travel Insurance",
  "Cover Letter / Travel Itinerary",
  "Proof of Employment / Business"
];

export default function VisaDetail() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [visa, setVisa] = useState<Visa | null>(null);
  const [relatedVisas, setRelatedVisas] = useState<Visa[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [travelDate, setTravelDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [formData, setFormData] = useState<EnquiryFormData>({
    name: "",
    email: "",
    phone: "",
    destination: "",
    message: ""
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryFormData, string>>>({});

  useEffect(() => {
    if (slug) {
      fetchVisa();
    }
  }, [slug]);

  const fetchVisa = async () => {
    setLoading(true);
    
    // First get the country by slug
    const { data: countryData, error: countryError } = await supabase
      .from("countries")
      .select("id, name, slug, code, image_url, region")
      .eq("slug", slug)
      .single();

    if (countryError || !countryData) {
      setLoading(false);
      return;
    }

    // Then get the visa for this country
    const { data: visaData, error: visaError } = await supabase
      .from("visas")
      .select("*")
      .eq("country_id", countryData.id)
      .limit(1)
      .maybeSingle();

    if (!visaError && visaData) {
      const fullVisa: Visa = {
        ...visaData,
        countries: countryData
      };
      setVisa(fullVisa);
      setFormData(prev => ({ ...prev, destination: countryData.name || "" }));
      
      // Fetch related visas from same region
      fetchRelatedVisas(countryData.region, countryData.id);
    }
    
    setLoading(false);
  };

  const fetchRelatedVisas = async (region: string | null, excludeCountryId: string) => {
    if (!region) return;
    
    const { data } = await supabase
      .from("visas")
      .select(`
        id, title, visa_type, price, processing_days, is_fast,
        countries!inner (id, name, slug, code, image_url, region)
      `)
      .eq("countries.region", region)
      .neq("country_id", excludeCountryId)
      .limit(4);

    if (data) {
      setRelatedVisas(data as unknown as Visa[]);
    }
  };

  const getCountryImage = (countrySlug: string, imageUrl: string | null): string => {
    if (imageUrl) return imageUrl;
    return countryImages[countrySlug] || uaeImage;
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
        status: "new",
        travel_date: travelDate || null,
        return_date: returnDate || null,
        travelers: travelers,
      } as any);

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
          <div className="animate-pulse space-y-6">
            <div className="h-64 md:h-80 bg-muted rounded-2xl" />
            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 space-y-4">
                <div className="h-8 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-32 bg-muted rounded" />
              </div>
              <div className="lg:col-span-2">
                <div className="h-96 bg-muted rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!visa) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-3">Visa Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We don't have visa information for this destination yet. Please check back later or explore our available visas.
            </p>
            <Link to="/visas">
              <Button className="bg-accent hover:bg-accent/90">
                <ArrowLeft className="mr-2 h-4 w-4" />
                View All Visas
              </Button>
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const countryImage = getCountryImage(visa.countries.slug, visa.countries.image_url);
  const documents = visa.required_documents && visa.required_documents.length > 0 
    ? visa.required_documents 
    : defaultDocuments;

  return (
    <Layout>
      <SEO 
        title={`${visa.countries.name} ${visa.visa_type} - Travel Idea`} 
        description={visa.short_description || `Apply for ${visa.countries.name} ${visa.visa_type} with Travel Idea. ${visa.processing_days} days processing. Starting from ₹${visa.price.toLocaleString()}`} 
      />

      {/* Hero Section */}
      <section className="relative h-[45vh] min-h-[320px] md:min-h-[400px] max-h-[500px]">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={countryImage}
          alt={visa.countries.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
        
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs md:text-sm text-white/70 mb-3 md:mb-4">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                <Link to="/visas" className="hover:text-white transition-colors">Visas</Link>
                <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                <span className="text-white">{visa.countries.name}</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs md:text-sm">
                  <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
                  {visa.visa_type}
                </span>
                {visa.is_fast && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/30 backdrop-blur-sm rounded-full text-white text-xs md:text-sm">
                    <Zap className="h-3 w-3 md:h-4 md:w-4" />
                    Express
                  </span>
                )}
                {visa.is_featured && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/30 backdrop-blur-sm rounded-full text-white text-xs md:text-sm">
                    <Star className="h-3 w-3 md:h-4 md:w-4" />
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-2 md:mb-3">
                {visa.countries.name} Visa
              </h1>
              
              <p className="text-white/80 text-sm md:text-lg mb-4 md:mb-6 max-w-xl line-clamp-2">
                {visa.title}
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-2 md:gap-3">
                <div className="flex items-center gap-1.5 md:gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-lg">
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-accent" />
                  <span className="text-white font-medium text-xs md:text-sm">{visa.processing_days} Days</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-lg">
                  <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-accent" />
                  <span className="text-white font-medium text-xs md:text-sm">₹{visa.price.toLocaleString()}</span>
                </div>
                {visa.validity && (
                  <div className="flex items-center gap-1.5 md:gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-lg">
                    <Calendar className="h-4 w-4 md:h-5 md:w-5 text-accent" />
                    <span className="text-white font-medium text-xs md:text-sm">{visa.validity}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-6 md:gap-8">
            {/* Main content */}
            <div className="lg:col-span-3 space-y-6 md:space-y-8">
              
              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
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
                    whileHover={{ y: -3 }}
                    className="bg-card border border-border rounded-xl p-3 md:p-4 text-center hover:shadow-lg transition-all"
                  >
                    <item.icon className={`h-5 w-5 md:h-6 md:w-6 mx-auto mb-1.5 md:mb-2 ${item.color}`} />
                    <p className="text-[10px] md:text-xs text-muted-foreground mb-0.5">{item.label}</p>
                    <p className="font-semibold text-xs md:text-sm text-foreground">{item.value}</p>
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
                <div className="bg-gradient-to-r from-primary to-primary/80 p-3 md:p-4">
                  <h2 className="text-base md:text-lg font-semibold text-primary-foreground flex items-center gap-2">
                    <Globe className="h-4 w-4 md:h-5 md:w-5" />
                    About {visa.countries.name} {visa.visa_type}
                  </h2>
                </div>
                <div className="p-4 md:p-5 space-y-4 md:space-y-5">
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    {visa.description || visa.short_description || `The ${visa.countries.name} ${visa.visa_type} allows travelers to visit ${visa.countries.name} for tourism, leisure, and recreational purposes. This visa grants you legal entry to explore the country's world-renowned attractions and experience its rich cultural heritage.`}
                  </p>

                  {/* Key Highlights */}
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    {[
                      { icon: Clock, title: "Processing Time", desc: `${visa.processing_days} working days` },
                      { icon: Calendar, title: "Visa Validity", desc: visa.validity || "30-90 days" },
                      { icon: Plane, title: "Entry Type", desc: "Single / Multiple Entry" },
                      { icon: Users, title: "Stay Duration", desc: "Up to 30-90 days" },
                    ].map((item, i) => (
                      <motion.div 
                        key={i} 
                        whileHover={{ scale: 1.02 }}
                        className="flex items-start gap-2 md:gap-3 p-2.5 md:p-3 bg-muted/50 rounded-xl"
                      >
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <item.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-xs md:text-sm truncate">{item.title}</p>
                          <p className="text-muted-foreground text-[10px] md:text-xs truncate">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* What's Included */}
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Check className="h-4 w-4 text-accent" />
                      What's Included
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        "Complete application assistance",
                        "Document verification & review",
                        "Embassy appointment booking",
                        "Application form filling",
                        "Real-time status updates",
                        "Dedicated visa expert support",
                      ].map((item, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                          className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground"
                        >
                          <CheckCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent shrink-0" />
                          <span>{item}</span>
                        </motion.div>
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
                <div className="bg-gradient-to-r from-accent to-accent/80 p-3 md:p-4">
                  <h2 className="text-base md:text-lg font-semibold text-accent-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 md:h-5 md:w-5" />
                    How to Apply
                  </h2>
                </div>
                <div className="p-4 md:p-5">
                  <div className="relative">
                    {[
                      { step: 1, title: "Submit Enquiry", desc: "Fill our simple form with your travel details" },
                      { step: 2, title: "Document Collection", desc: "We guide you on required documents" },
                      { step: 3, title: "Expert Review", desc: "Our team reviews for accuracy" },
                      { step: 4, title: "Embassy Submission", desc: "We handle the submission process" },
                      { step: 5, title: "Get Your Visa", desc: "Receive your approved visa" }
                    ].map((step, i, arr) => (
                      <motion.div 
                        key={step.step} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="flex gap-3 md:gap-4 pb-4 last:pb-0"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs md:text-sm font-bold">
                            {step.step}
                          </div>
                          {i < arr.length - 1 && <div className="w-0.5 flex-1 bg-accent/30 mt-2" />}
                        </div>
                        <div className="pt-0.5 md:pt-1">
                          <p className="font-medium text-xs md:text-sm">{step.title}</p>
                          <p className="text-[10px] md:text-xs text-muted-foreground">{step.desc}</p>
                        </div>
                      </motion.div>
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
                <div className="bg-gradient-to-r from-primary to-primary/80 p-3 md:p-4">
                  <h2 className="text-base md:text-lg font-semibold text-primary-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 md:h-5 md:w-5" />
                    Required Documents
                  </h2>
                </div>
                <div className="p-4 md:p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {documents.map((doc, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.05 }}
                        className="flex items-start gap-2 p-2.5 bg-muted/50 rounded-lg"
                      >
                        <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span className="text-xs md:text-sm text-muted-foreground">{doc}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] md:text-xs text-muted-foreground">
                        <strong className="text-foreground">Note:</strong> Additional documents may be required based on your specific case.
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
                <div className="bg-gradient-to-r from-destructive/80 to-destructive/60 p-3 md:p-4">
                  <h2 className="text-base md:text-lg font-semibold text-white flex items-center gap-2">
                    <Ban className="h-4 w-4 md:h-5 md:w-5" />
                    Avoid These Mistakes
                  </h2>
                </div>
                <div className="p-4 md:p-5 space-y-2">
                  {[
                    "Incomplete or incorrect application form",
                    "Passport with less than 6 months validity",
                    "Insufficient proof of financial stability",
                    "Missing or unclear travel documents",
                    "Previous visa violations or overstays",
                  ].map((reason, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs md:text-sm">
                      <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{reason}</span>
                    </div>
                  ))}
                  <p className="pt-3 text-[10px] md:text-xs text-muted-foreground border-t mt-4">
                    <strong className="text-foreground">Don't worry!</strong> Our expert team reviews every application to ensure all requirements are met.
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
                <div className="bg-gradient-to-r from-primary to-primary/80 p-3 md:p-4">
                  <h2 className="text-base md:text-lg font-semibold text-primary-foreground flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 md:h-5 md:w-5" />
                    FAQs
                  </h2>
                </div>
                <div className="p-4 md:p-5">
                  <Accordion type="single" collapsible className="space-y-2">
                    {[
                      { q: `How long does ${visa.countries.name} visa processing take?`, a: `Standard processing takes ${visa.processing_days} working days. Express processing may be available for urgent travel.` },
                      { q: "What is your visa success rate?", a: "We maintain a 99% success rate. Our expert review process minimizes rejection risks significantly." },
                      { q: "Can I track my visa application?", a: "Yes! You'll receive real-time updates via email and WhatsApp at every stage of your application." },
                      { q: "What if my visa gets rejected?", a: "We'll analyze the rejection reason and guide you on reapplication. Partial refunds may apply per our policy." },
                      { q: `What is the visa fee for ${visa.countries.name}?`, a: `The visa fee starts from ₹${visa.price.toLocaleString()}. ${visa.additional_fees && Number(visa.additional_fees) > 0 ? `+₹${Number(visa.additional_fees).toLocaleString()} (fee+taxes)` : 'All inclusive'}` },
                    ].map((faq, i) => (
                      <AccordionItem key={i} value={`faq-${i}`} className="border rounded-xl px-3 md:px-4">
                        <AccordionTrigger className="text-xs md:text-sm text-left font-medium hover:no-underline py-3">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-xs md:text-sm text-muted-foreground pb-3">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </motion.div>
            </div>

            {/* Sidebar - Enquiry Form */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg"
                >
                  {/* Price header */}
                  <div className="bg-gradient-to-r from-accent via-accent to-accent/80 p-4 md:p-5 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                      <div 
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                          backgroundSize: "20px 20px",
                        }}
                      />
                    </div>
                    <div className="relative">
                      <p className="text-accent-foreground/80 text-xs md:text-sm">Starting from</p>
                      <p className="text-3xl md:text-4xl font-bold text-accent-foreground">₹{visa.price.toLocaleString()}</p>
                      {visa.additional_fees && Number(visa.additional_fees) > 0 && (
                        <p className="text-accent-foreground/70 text-[10px] md:text-xs mt-1">+₹{Number(visa.additional_fees).toLocaleString()} (fee+taxes)</p>
                      )}
                      {visa.issued_recently && visa.issued_recently > 0 && (
                        <motion.div 
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="mt-3 inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-[10px] md:text-xs text-white"
                        >
                          <Sparkles className="h-3 w-3" />
                          {visa.issued_recently} issued recently
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Travel Date & Travelers Selection */}
                  <div className="p-3 md:p-4 border-b bg-muted/20 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="travel-date" className="text-xs md:text-sm font-medium flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-accent" />
                          Travel Date
                        </Label>
                        <Input
                          id="travel-date"
                          type="date"
                          value={travelDate}
                          onChange={(e) => setTravelDate(e.target.value)}
                          min={(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })()}
                          className="h-9 md:h-10 text-xs md:text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="return-date" className="text-xs md:text-sm font-medium flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-accent" />
                          Return Date
                        </Label>
                        <Input
                          id="return-date"
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          min={travelDate || (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })()}
                          className="h-9 md:h-10 text-xs md:text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="travelers" className="text-xs md:text-sm font-medium flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-accent" />
                        Number of Travelers
                      </Label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 shrink-0"
                          onClick={() => setTravelers(Math.max(1, travelers - 1))}
                          disabled={travelers <= 1}
                        >
                          −
                        </Button>
                        <Input
                          id="travelers"
                          type="number"
                          value={travelers}
                          onChange={(e) => setTravelers(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                          min={1}
                          max={20}
                          className="h-9 md:h-10 text-center text-xs md:text-sm"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 shrink-0"
                          onClick={() => setTravelers(Math.min(20, travelers + 1))}
                          disabled={travelers >= 20}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>

                  {submitted ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 text-center"
                    >
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.5 }}
                        className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <CheckCircle className="h-8 w-8 text-accent" />
                      </motion.div>
                      <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Our visa specialists will contact you within 24 hours.
                      </p>
                      <Link to="/visas">
                        <Button variant="outline" size="sm">Explore More Visas</Button>
                      </Link>
                    </motion.div>
                  ) : (
                    <>
                      {/* Progress Steps */}
                      <div className="flex justify-center gap-1 p-3 md:p-4 border-b bg-muted/30">
                        {questionnaireSteps.map((step, i) => (
                          <div key={step.id} className="flex items-center">
                            <motion.div 
                              animate={currentStep >= step.id ? { scale: [1, 1.1, 1] } : {}}
                              className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-xs font-medium transition-colors ${
                                currentStep >= step.id 
                                  ? "bg-accent text-accent-foreground" 
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {step.id}
                            </motion.div>
                            {i < questionnaireSteps.length - 1 && (
                              <div className={`w-6 md:w-8 h-0.5 mx-0.5 md:mx-1 transition-colors ${currentStep > step.id ? "bg-accent" : "bg-muted"}`} />
                            )}
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleSubmit} className="p-4 md:p-5">
                        {/* Step 1 */}
                        {currentStep === 1 && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                          >
                            <div className="text-center mb-4">
                              <Users className="h-7 w-7 md:h-8 md:w-8 text-accent mx-auto mb-2" />
                              <h3 className="font-semibold text-sm md:text-base">What's your name?</h3>
                              <p className="text-[10px] md:text-xs text-muted-foreground">Let's start with the basics</p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="name" className="text-xs md:text-sm">Full Name *</Label>
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                placeholder="Enter your full name"
                                className={`h-10 md:h-11 ${errors.name ? "border-destructive" : ""}`}
                              />
                              {errors.name && <p className="text-[10px] md:text-xs text-destructive">{errors.name}</p>}
                            </div>
                            <Button type="button" onClick={nextStep} className="w-full h-10 md:h-11 bg-accent hover:bg-accent/90">
                              Continue
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                          </motion.div>
                        )}

                        {/* Step 2 */}
                        {currentStep === 2 && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                          >
                            <div className="text-center mb-4">
                              <Mail className="h-7 w-7 md:h-8 md:w-8 text-accent mx-auto mb-2" />
                              <h3 className="font-semibold text-sm md:text-base">How can we reach you?</h3>
                              <p className="text-[10px] md:text-xs text-muted-foreground">We'll send updates here</p>
                            </div>
                            <div className="space-y-3">
                              <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs md:text-sm">Email Address *</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) => handleChange("email", e.target.value)}
                                  placeholder="your@email.com"
                                  className={`h-10 md:h-11 ${errors.email ? "border-destructive" : ""}`}
                                />
                                {errors.email && <p className="text-[10px] md:text-xs text-destructive">{errors.email}</p>}
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="phone" className="text-xs md:text-sm">Phone Number</Label>
                                <Input
                                  id="phone"
                                  type="tel"
                                  value={formData.phone}
                                  onChange={(e) => handleChange("phone", e.target.value)}
                                  placeholder="+91 98765 43210"
                                  className="h-10 md:h-11"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-10 md:h-11">
                                Back
                              </Button>
                              <Button type="button" onClick={nextStep} className="flex-1 h-10 md:h-11 bg-accent hover:bg-accent/90">
                                Continue
                              </Button>
                            </div>
                          </motion.div>
                        )}

                        {/* Step 3 */}
                        {currentStep === 3 && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                          >
                            <div className="text-center mb-4">
                              <Plane className="h-7 w-7 md:h-8 md:w-8 text-accent mx-auto mb-2" />
                              <h3 className="font-semibold text-sm md:text-base">Tell us about your trip</h3>
                              <p className="text-[10px] md:text-xs text-muted-foreground">Any specific requirements?</p>
                            </div>
                            <div className="space-y-3">
                              <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-accent shrink-0" />
                                <div>
                                  <p className="text-[10px] md:text-xs text-muted-foreground">Destination</p>
                                  <p className="font-medium text-sm">{visa.countries.name}</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="message" className="text-xs md:text-sm">Additional Details</Label>
                                <Textarea
                                  id="message"
                                  value={formData.message}
                                  onChange={(e) => handleChange("message", e.target.value)}
                                  placeholder="Travel dates, number of travelers, special requirements..."
                                  rows={3}
                                  className="resize-none text-sm"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-10 md:h-11">
                                Back
                              </Button>
                              <Button type="submit" disabled={submitting} className="flex-1 h-10 md:h-11 bg-accent hover:bg-accent/90">
                                {submitting ? "Submitting..." : "Submit"}
                                <Send className="h-4 w-4 ml-2" />
                              </Button>
                            </div>
                          </motion.div>
                        )}

                        <p className="text-[9px] md:text-[10px] text-center text-muted-foreground mt-4">
                          By submitting, you agree to our{" "}
                          <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>
                        </p>
                      </form>
                    </>
                  )}

                  {/* Contact info */}
                  <div className="border-t p-3 md:p-4 bg-muted/30">
                    <p className="text-[10px] md:text-xs text-center text-muted-foreground mb-2">Need immediate help?</p>
                    <div className="flex justify-center gap-4">
                      <a href="tel:+919101197909" className="flex items-center gap-1.5 text-xs md:text-sm text-accent hover:underline">
                        <Phone className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        Call Now
                      </a>
                      <a href="mailto:b2b@travelidea.in" className="flex items-center gap-1.5 text-xs md:text-sm text-accent hover:underline">
                        <Mail className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        Email
                      </a>
                    </div>
                  </div>
                </motion.div>

                {/* Trust badges */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 p-4 bg-card border border-border rounded-xl"
                >
                  <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                    {[
                      { icon: Shield, text: "99% Success" },
                      { icon: Award, text: "IATA" },
                      { icon: Headphones, text: "24/7" },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-1.5 text-muted-foreground">
                        <item.icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent" />
                        <span className="text-[10px] md:text-xs font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Visas */}
      {relatedVisas.length > 0 && (
        <section className="py-8 md:py-12 bg-muted/30 border-t">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg md:text-xl font-bold">More {visa.countries.region} Visas</h2>
                <p className="text-xs md:text-sm text-muted-foreground">Explore other destinations in the region</p>
              </div>
              <Link to="/visas" className="text-xs md:text-sm text-accent hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {relatedVisas.map((relVisa, i) => (
                <motion.div
                  key={relVisa.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link 
                    to={`/visas/${relVisa.countries.slug}`}
                    className="block bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="relative h-24 md:h-32">
                      <img 
                        src={getCountryImage(relVisa.countries.slug, relVisa.countries.image_url)} 
                        alt={relVisa.countries.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white font-semibold text-xs md:text-sm truncate">{relVisa.countries.name}</p>
                      </div>
                    </div>
                    <div className="p-2.5 md:p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm font-bold text-primary">₹{relVisa.price.toLocaleString()}</span>
                        <span className="text-[10px] md:text-xs text-muted-foreground">{relVisa.processing_days}d</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back button */}
      <section className="py-6 md:py-10">
        <div className="container">
          <Link to="/visas" className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to all visas
          </Link>
        </div>
      </section>
    </Layout>
  );
}
