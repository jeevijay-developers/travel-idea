import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, FileText, Calendar, Zap, ArrowLeft, CheckCircle } from "lucide-react";
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

              {/* Description */}
              <div className="bg-card border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">About This Visa</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {visa.description || visa.short_description || `The ${visa.countries?.name} ${visa.visa_type} is designed for travelers visiting ${visa.countries?.name} for tourism purposes. This visa allows you to explore the country's attractions, culture, and landmarks with ease.`}
                </p>
              </div>

              {/* Required documents */}
              <div className="bg-card border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
                <ul className="space-y-3">
                  {(visa.required_documents || [
                    "Valid Passport (6+ months validity)",
                    "Passport-size Photos (white background)",
                    "Travel Itinerary",
                    "Proof of Accommodation",
                    "Bank Statement (last 3 months)",
                    "Travel Insurance"
                  ]).map((doc, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-travel-success shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{doc}</span>
                    </li>
                  ))}
                </ul>
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