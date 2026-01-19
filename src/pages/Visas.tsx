import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Filter, Clock, Zap, ArrowRight, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
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

// Filter categories
const filterCategories = [
  { id: "all", label: "All Visas" },
  { id: "fast", label: "Fast Processing", icon: Zap },
  { id: "budget", label: "Budget Friendly" },
  { id: "popular", label: "Most Popular" },
];

const budgetFilters = [
  { id: "all", label: "All Budgets" },
  { id: "low", label: "Under ₹3,000" },
  { id: "mid", label: "₹3,000 - ₹10,000" },
  { id: "high", label: "Above ₹10,000" },
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
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!visa.countries?.name.toLowerCase().includes(query) && 
          !visa.title.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Category filter
    if (activeFilter === "fast" && !visa.is_fast) return false;
    if (activeFilter === "budget" && visa.price > 3000) return false;
    if (activeFilter === "popular" && (visa.issued_recently || 0) < 500) return false;

    // Budget filter
    if (budgetFilter === "low" && visa.price >= 3000) return false;
    if (budgetFilter === "mid" && (visa.price < 3000 || visa.price > 10000)) return false;
    if (budgetFilter === "high" && visa.price <= 10000) return false;

    return true;
  });

  return (
    <Layout>
      <SEO 
        title="All Visas - Travel Idea" 
        description="Explore visa options for 100+ countries. Find the right visa for your travel needs with transparent pricing and fast processing." 
      />

      {/* Header */}
      <section className="bg-primary py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
            Explore Visas
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl">
            Find the perfect visa for your travel destination. We offer transparent pricing and fast processing for 100+ countries.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-muted/30 border-b">
        <div className="container">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by country or visa type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-background"
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
              className="lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>

            {/* Filter pills */}
            <div className={cn(
              "flex flex-wrap gap-2",
              !showFilters && "hidden lg:flex"
            )}>
              {filterCategories.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                    activeFilter === filter.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary/50"
                  )}
                >
                  {filter.icon && <filter.icon className="inline-block h-4 w-4 mr-1" />}
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Budget filter */}
            <div className={cn(
              "flex flex-wrap gap-2",
              !showFilters && "hidden lg:flex"
            )}>
              {budgetFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setBudgetFilter(filter.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                    budgetFilter === filter.id
                      ? "bg-secondary text-secondary-foreground border-secondary"
                      : "bg-background text-muted-foreground border-border hover:border-secondary/50"
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
      <section className="py-12">
        <div className="container">
          {/* Results count */}
          <p className="text-muted-foreground mb-6">
            Showing {filteredVisas.length} visa{filteredVisas.length !== 1 ? "s" : ""}
          </p>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl border animate-pulse">
                  <div className="h-48 bg-muted rounded-t-xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVisas.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">No visas found matching your criteria</p>
              <Button onClick={() => { setSearchQuery(""); setActiveFilter("all"); setBudgetFilter("all"); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredVisas.map((visa, index) => (
                <Link
                  key={visa.id}
                  to={`/visas/${visa.countries?.slug}`}
                  className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={countryImages[visa.countries?.slug] || uaeImage}
                      alt={visa.countries?.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {visa.issued_recently && visa.issued_recently > 0 && (
                      <div className="absolute top-3 right-3 px-3 py-1 text-xs font-medium bg-travel-success text-white rounded-full">
                        {visa.issued_recently} issued recently
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {visa.countries?.name}
                      </h3>
                      <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                        {visa.visa_type}
                      </span>
                    </div>

                    {/* 2-line truncated description */}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[2.5rem]">
                      {visa.short_description || `Get your ${visa.visa_type} for ${visa.countries?.name} with hassle-free processing.`}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xl font-bold text-primary">₹{visa.price.toLocaleString()}</p>
                        {visa.additional_fees && (
                          <p className="text-xs text-muted-foreground">{visa.additional_fees}</p>
                        )}
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {visa.is_fast && <Zap className="h-3 w-3 text-amber-500" />}
                          <Clock className="h-3 w-3" />
                        </div>
                        <p className="font-medium text-foreground">{visa.processing_days} days</p>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <div className="flex items-center justify-end text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
                      View Details
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Contact us for personalized visa assistance. Our experts are ready to help you with any destination.
          </p>
          <Link to="/contact">
            <Button size="lg" variant="secondary" className="gap-2">
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}