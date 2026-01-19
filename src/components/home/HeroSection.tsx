import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import heroImage from "@/assets/hero-travel.jpg";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/visas?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-primary/60" />

      {/* Content */}
      <div className="container relative z-10 py-20">
        <div className="max-w-3xl mx-auto text-center text-primary-foreground">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full border border-primary-foreground/20 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-travel-success rounded-full animate-pulse" />
            <span className="text-sm font-medium">ISO9001:2015 Certified & IATA Accredited</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Stress-Free Travel at{" "}
            <span className="relative">
              <span className="relative z-10">Affordable Pricing</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-primary-foreground/20 -z-10 rounded" />
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Get your visa hassle-free with expert guidance. We process visas for 100+ countries with fast turnaround and transparent pricing.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Where to, captain? (e.g., Thailand, USA, UK...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-base bg-background text-foreground border-0 shadow-xl"
              />
            </div>
            <Button type="submit" size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 shadow-xl">
              Search Visas
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-3 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <span className="text-sm text-primary-foreground/70">Popular:</span>
            {["Thailand", "Singapore", "Dubai", "Malaysia", "Vietnam"].map((country) => (
              <Link
                key={country}
                to={`/visas?search=${country}`}
                className="text-sm px-3 py-1.5 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full border border-primary-foreground/20 transition-colors"
              >
                {country}
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-primary-foreground/20 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            {[
              { value: "100+", label: "Countries" },
              { value: "50K+", label: "Visas Processed" },
              { value: "99%", label: "Success Rate" },
              { value: "24/7", label: "Support" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}