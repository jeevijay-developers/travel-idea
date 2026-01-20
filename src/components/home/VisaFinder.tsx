import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Search, MapPin, Briefcase, ArrowRight, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

const nationalities = [
  "Indian",
  "American",
  "British",
  "Australian",
  "Canadian",
  "German",
  "French",
];

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
  { value: "tourist", label: "Tourist / Holiday", icon: "🏖️" },
  { value: "business", label: "Business", icon: "💼" },
  { value: "transit", label: "Transit", icon: "✈️" },
  { value: "medical", label: "Medical", icon: "🏥" },
];

export function VisaFinder() {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const [destination, setDestination] = useState("");
  const [nationality, setNationality] = useState("Indian");
  const [purpose, setPurpose] = useState("");

  const handleSearch = () => {
    if (destination) {
      navigate(`/visas?search=${encodeURIComponent(destination)}`);
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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } 
    },
  };

  return (
    <section ref={ref} className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Search className="h-4 w-4" />
              Smart Visa Finder
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Find Your Visa in Seconds
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Tell us where you're going and we'll show you the best visa options with pricing and processing times
            </p>
          </motion.div>

          {/* Finder Card */}
          <motion.div
            variants={itemVariants}
            className="bg-card rounded-2xl border border-border shadow-xl p-6 md:p-8"
          >
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {/* Destination */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Where are you travelling?
                </label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {popularDestinations.map((dest) => (
                      <SelectItem key={dest} value={dest}>
                        {dest}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Nationality */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Plane className="h-4 w-4 text-primary" />
                  Your Nationality
                </label>
                <Select value={nationality} onValueChange={setNationality}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {nationalities.map((nat) => (
                      <SelectItem key={nat} value={nat}>
                        {nat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Travel Purpose */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Travel Purpose
                </label>
                <Select value={purpose} onValueChange={setPurpose}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {travelPurposes.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
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
              size="lg" 
              className="w-full h-14 text-lg font-semibold"
            >
              Find My Visa
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">100+</p>
                <p className="text-xs text-muted-foreground">Countries</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">24hr</p>
                <p className="text-xs text-muted-foreground">Express Available</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">99%</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
