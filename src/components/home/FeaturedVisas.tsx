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
    <section ref={sectionRef} className="py-16 bg-background">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={headerVariants}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Featured VISA
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our most popular visa destinations and start your journey with ease
          </p>
        </motion.div>

        {/* Search and filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10"
        >
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
            {filterCategories.map((filter, index) => (
              <motion.button
                key={filter.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Visa cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredVisas.slice(0, 8).map((visa) => (
            <motion.div key={visa.id} variants={cardVariants}>
              <Link
                to={`/visas/${visa.id}`}
                className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 block"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={visa.image}
                    alt={visa.country}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1 text-xs font-medium bg-travel-success text-primary-foreground rounded-full">
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
            </motion.div>
          ))}
        </motion.div>

        {/* View all button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-10"
        >
          <Link
            to="/visas"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            View All Visas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
