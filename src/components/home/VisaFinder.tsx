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
  { value: "tourist", label: "Tourism / Holiday", icon: "🏖️" },
  { value: "business", label: "Business Travel", icon: "💼" },
  { value: "transit", label: "Transit / Stopover", icon: "✈️" },
  { value: "medical", label: "Medical Treatment", icon: "🏥" },
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
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section ref={ref} className="py-20 bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: "40px 40px"
        }} />
      </div>

      <div className="container relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Smart Visa Finder
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              Find Your Perfect Visa
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Enter your destination and travel purpose. We'll show you the best visa options
              with transparent pricing and processing times.
            </p>
          </motion.div>

          {/* Premium Finder Card */}
          <motion.div
            variants={itemVariants}
            className="relative bg-card rounded-3xl border border-border shadow-xl overflow-hidden"
          >
            {/* Card gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

            <div className="p-8 md:p-10">
              {/* Search input */}
              <div className="relative mb-6">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Where to, captain? (e.g., Dubai, Thailand, UK...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-14 h-16 text-lg bg-muted/50 border-0 rounded-2xl focus:ring-2 focus:ring-accent/50"
                />
              </div>

              {/* Select fields */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {/* Destination */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent" />
                    Or choose from popular destinations
                  </label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger className="h-14 rounded-xl bg-muted/50 border-0">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border rounded-xl">
                      {popularDestinations.map((dest) => (
                        <SelectItem key={dest} value={dest} className="py-3">
                          {dest}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Travel Purpose */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-accent" />
                    Travel Purpose
                  </label>
                  <Select value={purpose} onValueChange={setPurpose}>
                    <SelectTrigger className="h-14 rounded-xl bg-muted/50 border-0">
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border rounded-xl">
                      {travelPurposes.map((p) => (
                        <SelectItem key={p.value} value={p.value} className="py-3">
                          <span className="flex items-center gap-3">
                            <span className="text-lg">{p.icon}</span>
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
                size="lg"
                className="w-full h-16 text-lg font-semibold rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300"
              >
                Find My Visa
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </div>

            {/* Bottom stats */}
            <div className="grid grid-cols-3 divide-x divide-border border-t bg-muted/30">
              {[
                { value: "100+", label: "Countries" },
                { value: "24hr", label: "Express Available" },
                { value: "99%", label: "Success Rate" },
              ].map((stat) => (
                <div key={stat.label} className="py-5 text-center">
                  <p className="text-xl font-bold text-accent">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Popular quick links */}
          <motion.div
            variants={itemVariants}
            className="mt-8 text-center"
          >
            <p className="text-sm text-muted-foreground mb-4">Popular destinations:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["UAE", "Thailand", "Singapore", "Japan", "UK", "USA"].map((country) => (
                <button
                  key={country}
                  onClick={() => navigate(`/visas?search=${country}`)}
                  className="px-4 py-2 text-sm font-medium bg-muted hover:bg-muted/80 text-foreground rounded-full transition-colors"
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