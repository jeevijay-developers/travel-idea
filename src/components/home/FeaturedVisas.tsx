import { Link } from "react-router-dom";
import { ArrowRight, Clock, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample featured visas - in production, this would come from the database
const featuredVisas = [
  {
    id: 1,
    country: "Thailand",
    flag: "🇹🇭",
    type: "Tourist e-Visa",
    price: "₹2,500",
    processingTime: "3-5 days",
    validity: "60 days",
    popular: true,
  },
  {
    id: 2,
    country: "Singapore",
    flag: "🇸🇬",
    type: "Tourist Visa",
    price: "₹4,500",
    processingTime: "5-7 days",
    validity: "30 days",
    popular: true,
  },
  {
    id: 3,
    country: "Dubai",
    flag: "🇦🇪",
    type: "Tourist Visa",
    price: "₹7,500",
    processingTime: "4-6 days",
    validity: "30 days",
    popular: false,
  },
  {
    id: 4,
    country: "Vietnam",
    flag: "🇻🇳",
    type: "e-Visa",
    price: "₹2,000",
    processingTime: "2-3 days",
    validity: "30 days",
    popular: true,
  },
  {
    id: 5,
    country: "Malaysia",
    flag: "🇲🇾",
    type: "eNTRI Visa",
    price: "₹1,800",
    processingTime: "24-48 hours",
    validity: "15 days",
    popular: false,
  },
  {
    id: 6,
    country: "Japan",
    flag: "🇯🇵",
    type: "Tourist Visa",
    price: "₹5,500",
    processingTime: "7-10 days",
    validity: "15 days",
    popular: true,
  },
];

export function FeaturedVisas() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Top Picks</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
              Featured Visas
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Our most popular visa services with fast processing and high success rates.
            </p>
          </div>
          <Button asChild variant="outline" className="w-fit">
            <Link to="/visas">
              View All Visas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Visa cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVisas.map((visa, index) => (
            <Link
              key={visa.id}
              to={`/visas/${visa.country.toLowerCase()}`}
              className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Popular badge */}
              {visa.popular && (
                <div className="absolute top-4 right-4 px-3 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-full">
                  Popular
                </div>
              )}

              <div className="p-6">
                {/* Country & flag */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{visa.flag}</span>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {visa.country}
                    </h3>
                    <p className="text-sm text-muted-foreground">{visa.type}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{visa.processingTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileCheck className="h-4 w-4" />
                    <span>{visa.validity}</span>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <span className="text-sm text-muted-foreground">Starting from</span>
                    <p className="text-xl font-bold text-primary">{visa.price}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
