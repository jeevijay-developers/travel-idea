import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Sample country data - in production, this would come from the database
const countries = [
  { id: 1, name: "Thailand", flag: "🇹🇭", visaCount: 5, image: "bg-gradient-to-br from-orange-400 to-red-500" },
  { id: 2, name: "Singapore", flag: "🇸🇬", visaCount: 3, image: "bg-gradient-to-br from-red-400 to-pink-500" },
  { id: 3, name: "Dubai", flag: "🇦🇪", visaCount: 4, image: "bg-gradient-to-br from-yellow-400 to-orange-500" },
  { id: 4, name: "Malaysia", flag: "🇲🇾", visaCount: 4, image: "bg-gradient-to-br from-blue-400 to-indigo-500" },
  { id: 5, name: "Vietnam", flag: "🇻🇳", visaCount: 3, image: "bg-gradient-to-br from-red-500 to-yellow-500" },
  { id: 6, name: "Japan", flag: "🇯🇵", visaCount: 4, image: "bg-gradient-to-br from-rose-400 to-pink-500" },
  { id: 7, name: "USA", flag: "🇺🇸", visaCount: 6, image: "bg-gradient-to-br from-blue-500 to-red-500" },
  { id: 8, name: "UK", flag: "🇬🇧", visaCount: 5, image: "bg-gradient-to-br from-blue-600 to-red-600" },
];

export function ExploreByCountry() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Destinations</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
              Explore by Country
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Select your destination and discover available visa options with clear pricing and requirements.
            </p>
          </div>
          <Link
            to="/visas"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            View all countries
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Country grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {countries.map((country, index) => (
            <Link
              key={country.id}
              to={`/visas?country=${country.name}`}
              className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 ${country.image} opacity-10 group-hover:opacity-20 transition-opacity`} />
              
              <div className="relative p-6">
                {/* Flag */}
                <div className="text-5xl mb-4">{country.flag}</div>
                
                {/* Country name */}
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {country.name}
                </h3>
                
                {/* Visa count */}
                <p className="text-sm text-muted-foreground mt-1">
                  {country.visaCount} visa types available
                </p>

                {/* Arrow indicator */}
                <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
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
