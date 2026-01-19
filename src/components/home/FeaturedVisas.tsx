import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Clock, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
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

// Filter categories like Teleport
const filterCategories = [
  { id: "popular", label: "Popular", icon: null },
  { id: "visa-in-a-week", label: "Visa in a week", icon: Zap },
  { id: "easy-visa", label: "Easy Visa", icon: null },
  { id: "seasonal", label: "Season", icon: null },
  { id: "schengen", label: "Schengen Visa", icon: null },
  { id: "visa-free", label: "Visa Free", icon: null },
];

// Sample visa data with images
const visas = [
  {
    id: "uae",
    country: "United Arab Emirates",
    type: "eVisa",
    price: "₹7,399",
    processingDays: 5,
    issuedRecently: 1954,
    isFast: true,
    image: uaeImage,
  },
  {
    id: "usa",
    country: "United States of America",
    type: "Sticker",
    price: "₹17,020",
    additionalFees: "₹2999 (Fees+Tax)",
    processingDays: 270,
    issuedRecently: 2,
    isFast: false,
    image: usaImage,
  },
  {
    id: "south-korea",
    country: "South Korea",
    type: "Sticker",
    price: "₹3,400",
    additionalFees: "₹3199 (Fees+Tax)",
    processingDays: 15,
    issuedRecently: 338,
    isFast: false,
    image: southKoreaImage,
  },
  {
    id: "japan",
    country: "Japan",
    type: "Sticker",
    price: "₹2,000",
    additionalFees: "₹2499 (Fees+Tax)",
    processingDays: 12,
    issuedRecently: 320,
    isFast: true,
    image: japanImage,
  },
  {
    id: "uk",
    country: "United Kingdom",
    type: "Sticker",
    price: "₹12,500",
    processingDays: 21,
    issuedRecently: 156,
    isFast: false,
    image: ukImage,
  },
  {
    id: "singapore",
    country: "Singapore",
    type: "eVisa",
    price: "₹4,500",
    processingDays: 5,
    issuedRecently: 892,
    isFast: true,
    image: singaporeImage,
  },
  {
    id: "thailand",
    country: "Thailand",
    type: "eVisa",
    price: "₹2,500",
    processingDays: 3,
    issuedRecently: 1245,
    isFast: true,
    image: thailandImage,
  },
  {
    id: "malaysia",
    country: "Malaysia",
    type: "eNTRI",
    price: "₹1,800",
    processingDays: 2,
    issuedRecently: 567,
    isFast: true,
    image: malaysiaImage,
  },
  {
    id: "vietnam",
    country: "Vietnam",
    type: "eVisa",
    price: "₹2,000",
    processingDays: 3,
    issuedRecently: 423,
    isFast: true,
    image: vietnamImage,
  },
  {
    id: "australia",
    country: "Australia",
    type: "Sticker",
    price: "₹8,500",
    processingDays: 30,
    issuedRecently: 89,
    isFast: false,
    image: australiaImage,
  },
];

export function FeaturedVisas() {
  const [activeFilter, setActiveFilter] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter visas based on active filter and search
  const filteredVisas = visas.filter((visa) => {
    if (searchQuery) {
      return visa.country.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (activeFilter === "visa-in-a-week") {
      return visa.processingDays <= 7;
    }
    if (activeFilter === "easy-visa") {
      return visa.type === "eVisa" || visa.type === "eNTRI";
    }
    return true;
  });

  return (
    <section className="py-16 bg-background">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Featured VISA
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our most popular visa destinations and start your journey with ease
          </p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          {/* Search */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Where to, captain?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base border-border bg-card"
            />
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {filterCategories.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                  activeFilter === filter.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                )}
              >
                {filter.icon && <filter.icon className="inline-block h-4 w-4 mr-1" />}
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visa cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVisas.slice(0, 8).map((visa, index) => (
            <Link
              key={visa.id}
              to={`/visas/${visa.id}`}
              className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={visa.image}
                  alt={visa.country}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Badge */}
                <div className="absolute top-3 right-3 px-3 py-1 text-xs font-medium bg-travel-success text-white rounded-full">
                  {visa.issuedRecently} issued recently
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Country & type */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {visa.country}
                  </h3>
                  <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                    {visa.type}
                  </span>
                </div>

                {/* Price & processing */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-primary">{visa.price}</p>
                    {visa.additionalFees && (
                      <p className="text-xs text-muted-foreground">{visa.additionalFees}</p>
                    )}
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {visa.isFast && <Zap className="h-3 w-3 text-amber-500" />}
                      <span>Get Visa in</span>
                    </div>
                    <p className="font-medium text-foreground">{visa.processingDays} days</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-10">
          <Link
            to="/visas"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            View All Visas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}