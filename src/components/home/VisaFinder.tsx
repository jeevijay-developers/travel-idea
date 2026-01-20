import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { MapPin, Briefcase, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const travelPurposes = [
  { value: "tourist", label: "Tourism", icon: "🏖️" },
  { value: "business", label: "Business", icon: "💼" },
  { value: "transit", label: "Transit", icon: "✈️" },
  { value: "medical", label: "Medical", icon: "🏥" },
];

interface Country {
  id: string;
  name: string;
  slug: string;
}

export function VisaFinder() {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const [destination, setDestination] = useState("");
  const [purpose, setPurpose] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      const { data, error } = await supabase
        .from("countries")
        .select("id, name, slug")
        .order("name");

      if (!error && data) {
        setCountries(data);
      }
      setIsLoading(false);
    };

    fetchCountries();
  }, []);

  const handleSearch = () => {
    if (destination) {
      const country = countries.find((c) => c.id === destination);
      if (country) {
        navigate(`/visas?search=${encodeURIComponent(country.name)}`);
      }
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

  // Get first 6 countries for quick links
  const quickLinks = countries.slice(0, 6);

  return (
    <section ref={ref} className="py-12 md:py-16 bg-background">
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="max-w-3xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/10 rounded-full text-accent text-xs font-medium mb-3">
              <Sparkles className="h-3 w-3" />
              Smart Visa Finder
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-foreground mb-2">
              Find Your Perfect Visa
            </h2>
            <p className="text-muted-foreground text-xs md:text-sm max-w-md mx-auto">
              Select your destination and we'll show you the best visa options.
            </p>
          </motion.div>

          {/* Finder Card */}
          <motion.div
            variants={itemVariants}
            className="bg-card rounded-xl border border-border shadow-lg overflow-hidden"
          >
            {/* Top accent line */}
            <div className="h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />

            <div className="p-4 md:p-5">
              {/* Select fields */}
              <div className="grid md:grid-cols-2 gap-3 mb-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-accent" />
                    Select Destination
                  </label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger className="h-10 rounded-lg bg-muted/50 border-0 text-sm">
                      <SelectValue placeholder={isLoading ? "Loading..." : "Choose a country"} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border rounded-lg max-h-60">
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.id} className="text-sm py-2">
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Briefcase className="h-3 w-3 text-accent" />
                    Travel Purpose
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
                className="w-full h-10 text-sm font-semibold rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground"
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
                <div key={stat.label} className="py-2.5 text-center">
                  <p className="text-sm font-bold text-accent">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick links */}
          {quickLinks.length > 0 && (
            <motion.div variants={itemVariants} className="mt-4 text-center">
              <p className="text-xs text-muted-foreground mb-2">Popular:</p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {quickLinks.map((country) => (
                  <button
                    key={country.id}
                    onClick={() => navigate(`/visas?search=${encodeURIComponent(country.name)}`)}
                    className="px-2.5 py-1 text-xs font-medium bg-muted hover:bg-muted/80 text-foreground rounded-full transition-colors"
                  >
                    {country.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
