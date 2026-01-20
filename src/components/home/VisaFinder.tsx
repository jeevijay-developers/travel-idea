import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Search, MapPin, Briefcase, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const popularDestinations = [
  "United Arab Emirates",
  "Thailand",
  "Singapore",
  "Vietnam",
  "Malaysia",
  "Japan",
  "South Korea",
  "United Kingdom",
  "United States",
  "Australia",
  "France",
  "Germany",
  "Italy",
  "Switzerland",
  "Turkey",
];

const travelPurposes = [
  { value: "tourist", label: "Tourism", icon: "🏖️" },
  { value: "business", label: "Business", icon: "💼" },
  { value: "transit", label: "Transit", icon: "✈️" },
  { value: "medical", label: "Medical", icon: "🏥" },
];

export function VisaFinder() {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const [searchQuery, setSearchQuery] = useState("");
  const [destination, setDestination] = useState("");
  const [purpose, setPurpose] = useState("");

  const handleSearch = () => {
    const query = destination || searchQuery;
    if (query) {
      navigate(`/visas?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/visas");
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section ref={ref} className="py-12 md:py-16 bg-background">
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 rounded-full text-accent text-xs font-medium mb-4">
              <Sparkles className="h-3 w-3" />
              Smart Visa Finder
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground mb-2">
              Find Your Perfect Visa
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
              Enter your destination and we'll show you the best visa options with transparent pricing.
            </p>
          </motion.div>

          {/* Finder Card */}
          <motion.div
            variants={itemVariants}
            className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden"
          >
            {/* Top accent line */}
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

            <div className="p-5 md:p-6">
              {/* Search input */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Where to? (e.g., Dubai, Thailand, UK...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-11 h-12 text-sm bg-muted/50 border-0 rounded-xl"
                />
              </div>

              {/* Select fields */}
              <div className="grid md:grid-cols-2 gap-3 mb-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-accent" />
                    Or choose destination
                  </label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger className="h-10 rounded-lg bg-muted/50 border-0 text-sm">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border rounded-lg">
                      {popularDestinations.map((dest) => (
                        <SelectItem key={dest} value={dest} className="text-sm py-2">
                          {dest}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Briefcase className="h-3 w-3 text-accent" />
                    Travel purpose
                  </label>
                  <Select value={purpose} onValueChange={setPurpose}>
                    <SelectTrigger className="h-10 rounded-lg bg-muted/50 border-0 text-sm">
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border rounded-lg">
                      {travelPurposes.map((p) => (
                        <SelectItem key={p.value} value={p.value} className="text-sm py-2">
                          <span className="flex items-center gap-2">
                            <span>{p.icon}</span>
                            {p.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                className="w-full h-11 text-sm font-semibold rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Find My Visa
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Bottom stats */}
            <div className="grid grid-cols-3 divide-x divide-border border-t bg-muted/30">
              {[
                { value: "100+", label: "Countries" },
                { value: "24hr", label: "Express" },
                { value: "99%", label: "Success" },
              ].map((stat) => (
                <div key={stat.label} className="py-3 text-center">
                  <p className="text-base font-bold text-accent">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div variants={itemVariants} className="mt-5 text-center">
            <p className="text-xs text-muted-foreground mb-2">Popular:</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {["UAE", "Thailand", "Singapore", "Japan", "UK", "USA"].map((country) => (
                <button
                  key={country}
                  onClick={() => navigate(`/visas?search=${country}`)}
                  className="px-3 py-1.5 text-xs font-medium bg-muted hover:bg-muted/80 text-foreground rounded-full transition-colors"
                >
                  {country}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}