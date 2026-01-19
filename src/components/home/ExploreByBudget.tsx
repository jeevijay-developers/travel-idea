import { Link } from "react-router-dom";
import { ArrowRight, DollarSign, Wallet, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

const budgetTiers = [
  {
    id: "budget",
    name: "Budget Friendly",
    description: "Affordable visa options under ₹5,000",
    priceRange: "Under ₹5,000",
    icon: DollarSign,
    color: "from-emerald-400 to-teal-500",
    countries: ["Thailand", "Vietnam", "Cambodia", "Nepal"],
    href: "/visas?budget=low",
  },
  {
    id: "mid-range",
    name: "Mid-Range",
    description: "Popular destinations with moderate fees",
    priceRange: "₹5,000 - ₹15,000",
    icon: Wallet,
    color: "from-blue-400 to-indigo-500",
    countries: ["Singapore", "Malaysia", "Dubai", "Sri Lanka"],
    href: "/visas?budget=mid",
  },
  {
    id: "premium",
    name: "Premium",
    description: "High-value destinations with premium processing",
    priceRange: "Above ₹15,000",
    icon: Crown,
    color: "from-amber-400 to-orange-500",
    countries: ["USA", "UK", "Canada", "Australia", "Schengen"],
    href: "/visas?budget=high",
  },
];

export function ExploreByBudget() {
  return (
    <section className="py-20">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Pricing</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
            Explore by Budget
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Find visa options that fit your travel budget. Transparent pricing with no hidden fees.
          </p>
        </div>

        {/* Budget cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {budgetTiers.map((tier, index) => (
            <Link
              key={tier.id}
              to={tier.href}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient background */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity",
                tier.color
              )} />

              <div className="relative p-8">
                {/* Icon */}
                <div className={cn(
                  "inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br text-white mb-6",
                  tier.color
                )}>
                  <tier.icon className="h-7 w-7" />
                </div>

                {/* Title & price */}
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {tier.name}
                </h3>
                <p className="text-2xl font-bold text-primary mb-3">
                  {tier.priceRange}
                </p>
                <p className="text-muted-foreground text-sm mb-6">
                  {tier.description}
                </p>

                {/* Sample countries */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {tier.countries.map((country) => (
                    <span
                      key={country}
                      className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full"
                    >
                      {country}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                  Explore options
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
