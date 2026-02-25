import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, Clock, Zap, ArrowRight, X, MapPin, Globe, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Layout, PageHero } from "@/components/layout";
import { SEO } from "@/components/seo";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

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
import bahrainImage from "@/assets/countries/bahrain.jpg";
import sriLankaImage from "@/assets/countries/sri-lanka.jpg";
import indonesiaImage from "@/assets/countries/indonesia.jpg";
import franceImage from "@/assets/countries/france.jpg";
import germanyImage from "@/assets/countries/germany.jpg";
import italyImage from "@/assets/countries/italy.jpg";
import switzerlandImage from "@/assets/countries/switzerland.jpg";
import canadaImage from "@/assets/countries/canada.jpg";
import chinaImage from "@/assets/countries/china.jpg";
import turkeyImage from "@/assets/countries/turkey.jpg";
import greeceImage from "@/assets/countries/greece.jpg";
import egyptImage from "@/assets/countries/egypt.jpg";
import saudiArabiaImage from "@/assets/countries/saudi-arabia.jpg";
import omanImage from "@/assets/countries/oman.jpg";
import cambodiaImage from "@/assets/countries/cambodia.jpg";
import hongKongImage from "@/assets/countries/hong-kong.jpg";
import kenyaImage from "@/assets/countries/kenya.jpg";
import moroccoImage from "@/assets/countries/morocco.jpg";
import azerbaijanImage from "@/assets/countries/azerbaijan.jpg";
import uzbekistanImage from "@/assets/countries/uzbekistan.jpg";
import russiaImage from "@/assets/countries/russia.jpg";
import georgiaImage from "@/assets/countries/georgia.jpg";
import philippinesImage from "@/assets/countries/philippines.jpg";
import spainImage from "@/assets/countries/spain.jpg";
import netherlandsImage from "@/assets/countries/netherlands.jpg";
import norwayImage from "@/assets/countries/norway.jpg";
import finlandImage from "@/assets/countries/finland.jpg";
import austriaImage from "@/assets/countries/austria.jpg";
import hungaryImage from "@/assets/countries/hungary.jpg";
import czechRepublicImage from "@/assets/countries/czech-republic.jpg";
import denmarkImage from "@/assets/countries/denmark.jpg";
import swedenImage from "@/assets/countries/sweden.jpg";
import armeniaImage from "@/assets/countries/armenia.jpg";
import ethiopiaImage from "@/assets/countries/ethiopia.jpg";
import madagascarImage from "@/assets/countries/madagascar.jpg";
import laosImage from "@/assets/countries/laos.jpg";

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
  bahrain: bahrainImage,
  "sri-lanka": sriLankaImage,
  indonesia: indonesiaImage,
  france: franceImage,
  germany: germanyImage,
  italy: italyImage,
  switzerland: switzerlandImage,
  canada: canadaImage,
  china: chinaImage,
  turkey: turkeyImage,
  greece: greeceImage,
  egypt: egyptImage,
  "saudi-arabia": saudiArabiaImage,
  oman: omanImage,
  cambodia: cambodiaImage,
  "hong-kong": hongKongImage,
  kenya: kenyaImage,
  morocco: moroccoImage,
  azerbaijan: azerbaijanImage,
  uzbekistan: uzbekistanImage,
  russia: russiaImage,
  georgia: georgiaImage,
  philippines: philippinesImage,
  spain: spainImage,
  netherlands: netherlandsImage,
  norway: norwayImage,
  finland: finlandImage,
  austria: austriaImage,
  hungary: hungaryImage,
  "czech-republic": czechRepublicImage,
  denmark: denmarkImage,
  sweden: swedenImage,
  armenia: armeniaImage,
  ethiopia: ethiopiaImage,
  madagascar: madagascarImage,
  laos: laosImage,
};

// Filter categories
const filterCategories = [
  { id: "all", label: "All", icon: Globe },
  { id: "fast", label: "Express", icon: Zap },
  { id: "budget", label: "Budget" },
  { id: "popular", label: "Popular" },
];

const budgetFilters = [
  { id: "all", label: "Any Price" },
  { id: "low", label: "Under ₹3K" },
  { id: "mid", label: "₹3K - ₹10K" },
  { id: "high", label: "Above ₹10K" },
];

interface Visa {
  id: string;
  title: string;
  visa_type: string;
  price: number;
  additional_fees: string | null;
  processing_days: number;
  is_fast: boolean;
  issued_recently: number;
  short_description: string | null;
  countries: {
    name: string;
    slug: string;
  };
}

export default function Visas() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  
  const [visas, setVisas] = useState<Visa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeFilter, setActiveFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchVisas();
  }, []);

  const fetchVisas = async () => {
    const { data, error } = await supabase
      .from("visas")
      .select(`
        id,
        title,
        visa_type,
        price,
        additional_fees,
        processing_days,
        is_fast,
        issued_recently,
        short_description,
        countries (
          name,
          slug
        )
      `)
      .order("issued_recently", { ascending: false });

    if (!error && data) {
      setVisas(data as Visa[]);
    }
    setLoading(false);
  };

  // Filter visas
  const filteredVisas = visas.filter((visa) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!visa.countries?.name.toLowerCase().includes(query) && 
          !visa.title.toLowerCase().includes(query)) {
        return false;
      }
    }

    if (activeFilter === "fast" && !visa.is_fast) return false;
    if (activeFilter === "budget" && visa.price > 3000) return false;
    if (activeFilter === "popular" && (visa.issued_recently || 0) < 500) return false;

    if (budgetFilter === "low" && visa.price >= 3000) return false;
    if (budgetFilter === "mid" && (visa.price < 3000 || visa.price > 10000)) return false;
    if (budgetFilter === "high" && visa.price <= 10000) return false;

    return true;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setActiveFilter("all");
    setBudgetFilter("all");
  };

  return (
    <Layout>
      <SEO 
        title="All Visas - Travel Idea" 
        description="Explore visa options for 100+ countries. Find the right visa for your travel needs with transparent pricing and fast processing." 
      />

      <PageHero
        title="Explore All Visas"
        subtitle="Find the perfect visa for your destination with transparent pricing and fast processing."
        icon={Globe}
        badge="100+ Countries Available"
      />

      {/* Search and Filters */}
      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b shadow-sm">
        <div className="container py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-muted/50 border-0 rounded-lg text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Filter toggle for mobile */}
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden h-10"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>

            {/* Category filters */}
            <div className={cn(
              "flex flex-wrap gap-2",
              !showFilters && "hidden lg:flex"
            )}>
              {filterCategories.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    activeFilter === filter.id
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {filter.icon && <filter.icon className="inline-block h-3 w-3 mr-1" />}
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Budget filters */}
            <div className={cn(
              "flex flex-wrap gap-2",
              !showFilters && "hidden lg:flex"
            )}>
              {budgetFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setBudgetFilter(filter.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    budgetFilter === filter.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8 md:py-12">
        <div className="container">
          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredVisas.length}</span> visa{filteredVisas.length !== 1 ? "s" : ""}
            </p>
            {(searchQuery || activeFilter !== "all" || budgetFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="text-xs text-accent hover:underline flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Clear filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border animate-pulse overflow-hidden">
                  <div className="h-44 bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVisas.length === 0 ? (
            <div className="text-center py-16 max-w-lg mx-auto">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <Search className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Can't find the visa you're looking for?</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Don't worry! Even if a visa isn't listed on our website, our team can arrange it for you. 
                Reach out to us directly and we'll help you with your visa requirements.
              </p>
              <div className="bg-card border rounded-xl p-6 mb-6">
                <p className="text-sm font-medium text-muted-foreground mb-3">Contact our visa experts</p>
                <a
                  href="tel:+919101197909"
                  className="inline-flex items-center gap-2 text-2xl font-bold text-accent hover:underline"
                >
                  <Phone className="h-6 w-6" />
                  +91 9101197909
                </a>
                <p className="text-xs text-muted-foreground mt-2">Available Mon–Sat, 10 AM – 7 PM IST</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button onClick={clearFilters} variant="outline" size="sm">
                  Clear All Filters
                </Button>
                <Link to="/contact">
                  <Button variant="default" size="sm">
                    Send an Enquiry
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredVisas.map((visa, index) => (
                <motion.div
                  key={visa.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                >
                  <Link
                    to={`/visas/${visa.countries?.slug}`}
                    className="group block overflow-hidden rounded-2xl bg-card border border-border hover:border-accent/50 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image - Full vibrant, no overlay */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={countryImages[visa.countries?.slug] || uaeImage}
                        alt={visa.countries?.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                        <span className="px-2 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm text-foreground rounded-md shadow-sm">
                          {visa.visa_type}
                        </span>
                        {visa.is_fast && (
                          <span className="px-2 py-1 text-xs font-medium bg-amber-400 text-amber-900 rounded-md flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            Express
                          </span>
                        )}
                      </div>
                      {/* Issued badge */}
                      {visa.issued_recently && visa.issued_recently > 0 && (
                        <div className="absolute bottom-3 left-3 px-2 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-md">
                          {visa.issued_recently}+ issued
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Country name with flag placeholder */}
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-accent" />
                        <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                          {visa.countries?.name}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3 min-h-[2rem]">
                        {visa.short_description || `Get your ${visa.visa_type} for ${visa.countries?.name} with hassle-free processing.`}
                      </p>

                      {/* Price and Processing */}
                      <div className="flex items-end justify-between pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">From</p>
                          <p className="text-xl font-bold text-accent">₹{visa.price.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs">{visa.processing_days} days</span>
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="mt-3 pt-3 border-t flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {visa.additional_fees && Number(visa.additional_fees) > 0
                            ? `+₹${Number(visa.additional_fees).toLocaleString()} (fee+taxes)`
                            : "All inclusive"}
                        </span>
                        <span className="text-xs font-medium text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                          View
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-accent via-accent to-accent/90">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-accent-foreground mb-3">
              Can't find what you're looking for?
            </h2>
            <p className="text-accent-foreground/80 text-sm mb-6 max-w-md mx-auto">
              Contact us for personalized visa assistance. Our experts are ready to help.
            </p>
            <Link to="/contact">
              <Button size="lg" variant="secondary" className="gap-2 shadow-lg">
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
