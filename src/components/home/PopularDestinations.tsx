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
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section ref={ref} className="py-12 md:py-16 bg-muted/30">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8"
        >
          <div>
            <span className="inline-block px-2.5 py-0.5 bg-accent/10 text-accent text-xs font-semibold rounded-full mb-3">
              Top Picks
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground">
              Popular Destinations
            </h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-md">
              Explore visa options for the most sought-after travel destinations
            </p>
          </div>
          <Link
            to="/visas"
            className="inline-flex items-center gap-1.5 text-accent hover:text-accent/80 text-sm font-semibold transition-colors group"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        >
          {destinations.map((dest) => (
            <motion.div
              key={dest.slug}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to={`/visas?search=${dest.country}`}
                className="group block overflow-hidden rounded-xl bg-card border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.country}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    <span className="px-2 py-1 text-[10px] font-bold bg-card/90 backdrop-blur-sm text-foreground rounded-md">
                      {dest.visaType}
                    </span>
                    {dest.isFast && (
                      <span className="px-2 py-1 text-[10px] font-bold bg-travel-gold text-primary rounded-md flex items-center gap-0.5">
                        <Zap className="h-2.5 w-2.5" />
                        EXPRESS
                      </span>
                    )}
                  </div>

                  {/* Country name */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-base font-bold text-white mb-0.5">{dest.country}</h3>
                    <div className="flex items-center gap-1.5">
                      <Star className="h-3 w-3 fill-travel-gold text-travel-gold" />
                      <span className="text-xs text-white/90">{dest.rating}</span>
                      <span className="text-[10px] text-white/60">({dest.reviews})</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-muted-foreground">From</p>
                      <p className="text-lg font-bold text-foreground">{dest.price}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
                        <Clock className="h-3 w-3" />
                        <span className="text-[10px]">Processing</span>
                      </div>
                      <p className="text-xs font-semibold text-foreground">{dest.processingTime}</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <span className="flex items-center justify-center gap-1.5 text-xs font-semibold text-accent group-hover:gap-2 transition-all">
                      Apply Now
                      <ArrowRight className="h-3.5 w-3.5" />
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