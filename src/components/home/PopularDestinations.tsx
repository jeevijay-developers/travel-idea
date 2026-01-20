import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { ArrowRight, Zap } from "lucide-react";
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
    isFast: true,
  },
  {
    country: "Vietnam",
    slug: "vietnam",
    image: vietnamImage,
    visaType: "eVisa",
    processingTime: "5 days",
    price: "₹2,301",
    isFast: true,
  },
  {
    country: "Singapore",
    slug: "singapore",
    image: singaporeImage,
    visaType: "eVisa",
    processingTime: "15 days",
    price: "₹3,280",
    isFast: false,
  },
  {
    country: "Turkey",
    slug: "turkey",
    image: turkeyImage,
    visaType: "Sticker",
    processingTime: "28 days",
    price: "₹18,664",
    isFast: false,
  },
  {
    country: "France",
    slug: "france",
    image: franceImage,
    visaType: "Schengen",
    processingTime: "15 days",
    price: "₹10,650",
    isFast: false,
  },
  {
    country: "Thailand",
    slug: "thailand",
    image: thailandImage,
    visaType: "DAC",
    processingTime: "1 day",
    price: "₹354",
    isFast: true,
  },
];

export function PopularDestinations() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Top Picks
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-3">
            Popular Destinations
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore visa options for the most sought-after travel destinations
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {destinations.map((dest, index) => (
            <motion.div
              key={dest.slug}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Link
                to={`/visas?search=${dest.country}`}
                className="group block relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.country}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Country name overlay */}
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white">{dest.country}</h3>
                  </div>

                  {/* Fast badge */}
                  {dest.isFast && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      FAST
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
                      {dest.visaType}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {dest.processingTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Starting from</p>
                      <p className="text-xl font-bold text-primary">{dest.price}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-primary group-hover:translate-x-1 transition-transform">
                      Apply Now <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-10"
        >
          <Link
            to="/visas"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Explore All Countries
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
