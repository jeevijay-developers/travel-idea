import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { ArrowRight, Zap, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";

// Country images
import uaeImage from "@/assets/countries/uae.jpg";
import vietnamImage from "@/assets/countries/vietnam.jpg";
import singaporeImage from "@/assets/countries/singapore.jpg";
import turkeyImage from "@/assets/countries/turkey.jpg";
import franceImage from "@/assets/countries/france.jpg";
import thailandImage from "@/assets/countries/thailand.jpg";

const destinations = [
  {
    country: "United Arab Emirates",
    slug: "uae",
    image: uaeImage,
    visaType: "eVisa",
    processingTime: "5 days",
    price: "₹7,399",
    rating: 4.9,
    reviews: 1250,
    isFast: true,
  },
  {
    country: "Vietnam",
    slug: "vietnam",
    image: vietnamImage,
    visaType: "eVisa",
    processingTime: "5 days",
    price: "₹2,301",
    rating: 4.8,
    reviews: 890,
    isFast: true,
  },
  {
    country: "Singapore",
    slug: "singapore",
    image: singaporeImage,
    visaType: "eVisa",
    processingTime: "15 days",
    price: "₹3,280",
    rating: 4.9,
    reviews: 1100,
    isFast: false,
  },
  {
    country: "Turkey",
    slug: "turkey",
    image: turkeyImage,
    visaType: "Sticker",
    processingTime: "28 days",
    price: "₹18,664",
    rating: 4.7,
    reviews: 560,
    isFast: false,
  },
  {
    country: "France",
    slug: "france",
    image: franceImage,
    visaType: "Schengen",
    processingTime: "15 days",
    price: "₹10,650",
    rating: 4.8,
    reviews: 780,
    isFast: false,
  },
  {
    country: "Thailand",
    slug: "thailand",
    image: thailandImage,
    visaType: "DAC",
    processingTime: "1 day",
    price: "₹354",
    rating: 4.9,
    reviews: 2100,
    isFast: true,
  },
];

export function PopularDestinations() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section ref={ref} className="py-24 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
        >
          <div>
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-semibold rounded-full mb-4">
              Top Picks
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
              Popular Destinations
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg">
              Explore visa options for the most sought-after travel destinations with transparent pricing
            </p>
          </div>
          <Link
            to="/visas"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-semibold transition-colors group"
          >
            View all destinations
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {destinations.map((dest) => (
            <motion.div
              key={dest.slug}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to={`/visas?search=${dest.country}`}
                className="group block relative overflow-hidden rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-2xl transition-all duration-500"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.country}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <span className="px-3 py-1.5 text-xs font-bold bg-card/95 backdrop-blur-sm text-foreground rounded-full shadow-lg">
                      {dest.visaType}
                    </span>
                    {dest.isFast && (
                      <span className="px-3 py-1.5 text-xs font-bold bg-travel-gold text-primary rounded-full flex items-center gap-1 shadow-lg">
                        <Zap className="h-3 w-3" />
                        EXPRESS
                      </span>
                    )}
                  </div>

                  {/* Country name overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{dest.country}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-travel-gold">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span className="text-sm font-medium text-white">{dest.rating}</span>
                      </div>
                      <span className="text-xs text-white/70">({dest.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Starting from</p>
                      <p className="text-2xl font-bold text-foreground">{dest.price}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-xs">Processing</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{dest.processingTime}</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <span className="flex items-center justify-center gap-2 text-sm font-semibold text-accent group-hover:gap-3 transition-all">
                      Apply Now
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}