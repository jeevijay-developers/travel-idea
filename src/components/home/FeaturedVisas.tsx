import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

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
  { id: "visa-in-a-week", label: "Fast", icon: Zap },
  { id: "easy-visa", label: "Easy", icon: null },
  { id: "schengen", label: "Schengen", icon: null },
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
    country: "United States",
    type: "Sticker",
    price: "₹17,020",
    additionalFees: "+₹2999",
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
    additionalFees: "+₹3199",
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
    additionalFees: "+₹2499",
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
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <section ref={sectionRef} className="py-10 md:py-16 bg-background">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={headerVariants}
          className="text-center mb-6 md:mb-10"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 md:mb-3">
            Featured VISA
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto px-4">
            Explore our most popular visa destinations
          </p>
        </motion.div>

        {/* Search and filters - mobile optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-4 mb-6 md:mb-10"
        >
          {/* Search */}
          <div className="relative max-w-md w-full mx-auto md:mx-0">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 md:pl-12 h-10 md:h-12 text-sm md:text-base border-border bg-card"
            />
          </div>

          {/* Filter pills - horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:justify-center lg:justify-start">
            {filterCategories.map((filter, index) => (
              <motion.button
                key={filter.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 border whitespace-nowrap shrink-0",
                  activeFilter === filter.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                )}
              >
                {filter.icon && <filter.icon className="inline-block h-3 w-3 md:h-4 md:w-4 mr-1" />}
                {filter.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Visa cards grid - responsive */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6"
        >
          {filteredVisas.slice(0, 8).map((visa) => (
            <motion.div key={visa.id} variants={cardVariants}>
              <Link
                to={`/visas/${visa.id}`}
                className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 block"
              >
                {/* Image - smaller on mobile */}
                <div className="relative h-28 sm:h-36 md:h-44 lg:h-48 overflow-hidden">
                  <img
                    src={visa.image}
                    alt={visa.country}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Badge */}
                  <div className="absolute top-2 right-2 md:top-3 md:right-3 px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-xs font-medium bg-travel-success text-primary-foreground rounded-full">
                    {visa.issuedRecently} issued
                  </div>
                </div>

                {/* Content - compact on mobile */}
                <div className="p-2.5 md:p-4">
                  {/* Country & type */}
                  <div className="flex items-start justify-between gap-1 mb-1.5 md:mb-2">
                    <h3 className="font-semibold text-xs md:text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {visa.country}
                    </h3>
                    <span className="text-[9px] md:text-xs px-1.5 md:px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full shrink-0">
                      {visa.type}
                    </span>
                  </div>

                  {/* Price & processing - stacked on mobile */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <div>
                      <p className="text-sm md:text-lg font-bold text-primary">{visa.price}</p>
                      {visa.additionalFees && (
                        <p className="text-[9px] md:text-xs text-muted-foreground">{visa.additionalFees}</p>
                      )}
                    </div>
                    <div className="text-left sm:text-right text-[10px] md:text-sm text-muted-foreground">
                      <div className="flex items-center gap-0.5 sm:justify-end">
                        {visa.isFast && <Zap className="h-2.5 w-2.5 md:h-3 md:w-3 text-amber-500" />}
                        <span className="text-[9px] md:text-xs">{visa.processingDays}d</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View all button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-6 md:mt-10"
        >
          <Link
            to="/visas"
            className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-primary text-primary-foreground rounded-lg text-sm md:text-base font-medium hover:bg-primary/90 transition-colors"
          >
            View All Visas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
