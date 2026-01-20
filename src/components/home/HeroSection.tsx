import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Clock, Award, ChevronLeft, ChevronRight, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

// Country images imports
import armeniaImg from "@/assets/countries/armenia.jpg";
import australiaImg from "@/assets/countries/australia.jpg";
import cambodiaImg from "@/assets/countries/cambodia.jpg";
import canadaImg from "@/assets/countries/canada.jpg";
import egyptImg from "@/assets/countries/egypt.jpg";
import franceImg from "@/assets/countries/france.jpg";
import germanyImg from "@/assets/countries/germany.jpg";
import japanImg from "@/assets/countries/japan.jpg";
import malaysiaImg from "@/assets/countries/malaysia.jpg";
import singaporeImg from "@/assets/countries/singapore.jpg";
import thailandImg from "@/assets/countries/thailand.jpg";
import turkeyImg from "@/assets/countries/turkey.jpg";
import uaeImg from "@/assets/countries/uae.jpg";
import ukImg from "@/assets/countries/uk.jpg";
import usaImg from "@/assets/countries/usa.jpg";

// Visa cards data with images
const visaCards = [
  { name: "UAE", slug: "uae", image: uaeImg, price: "₹5,999", days: "3-5 days", flag: "🇦🇪" },
  { name: "Thailand", slug: "thailand", image: thailandImg, price: "₹2,499", days: "2-3 days", flag: "🇹🇭" },
  { name: "Singapore", slug: "singapore", image: singaporeImg, price: "₹3,999", days: "3-4 days", flag: "🇸🇬" },
  { name: "Japan", slug: "japan", image: japanImg, price: "₹7,999", days: "5-7 days", flag: "🇯🇵" },
  { name: "Malaysia", slug: "malaysia", image: malaysiaImg, price: "₹2,999", days: "2-3 days", flag: "🇲🇾" },
  { name: "Australia", slug: "australia", image: australiaImg, price: "₹12,999", days: "10-15 days", flag: "🇦🇺" },
  { name: "France", slug: "france", image: franceImg, price: "₹8,999", days: "7-10 days", flag: "🇫🇷" },
  { name: "Germany", slug: "germany", image: germanyImg, price: "₹8,499", days: "7-10 days", flag: "🇩🇪" },
  { name: "UK", slug: "uk", image: ukImg, price: "₹11,999", days: "10-15 days", flag: "🇬🇧" },
  { name: "USA", slug: "usa", image: usaImg, price: "₹14,999", days: "15-20 days", flag: "🇺🇸" },
  { name: "Canada", slug: "canada", image: canadaImg, price: "₹13,999", days: "15-20 days", flag: "🇨🇦" },
  { name: "Turkey", slug: "turkey", image: turkeyImg, price: "₹4,499", days: "3-5 days", flag: "🇹🇷" },
  { name: "Egypt", slug: "egypt", image: egyptImg, price: "₹3,999", days: "3-5 days", flag: "🇪🇬" },
  { name: "Cambodia", slug: "cambodia", image: cambodiaImg, price: "₹2,999", days: "2-3 days", flag: "🇰🇭" },
  { name: "Armenia", slug: "armenia", image: armeniaImg, price: "₹4,999", days: "3-5 days", flag: "🇦🇲" },
];

// Animated headline words
const headlineWords = ["Simplified", "Fast-Tracked", "Hassle-Free", "Guaranteed"];

const trustBadges = [
  { icon: Shield, text: "99% Success Rate" },
  { icon: Clock, text: "Express Processing" },
  { icon: Award, text: "IATA Certified" },
];

export function HeroSection() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Rotate headline words
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % headlineWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll cards
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const cardWidth = 200;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft >= maxScroll - 10) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -250, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 250, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, []);

  return (
    <section className="relative min-h-[100svh] flex flex-col bg-gradient-to-br from-primary via-primary to-primary/95 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Gradient orbs for visual interest */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-accent/15 rounded-full blur-3xl" />

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-4 pt-20 pb-8 md:pt-24 md:pb-12">
        <div className="w-full max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground leading-tight mb-4"
            >
              Your Visa,{" "}
              <span className="relative inline-block min-w-[200px] md:min-w-[280px]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={headlineWords[currentWordIndex]}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4 }}
                    className="text-accent inline-block"
                  >
                    {headlineWords[currentWordIndex]}
                  </motion.span>
                </AnimatePresence>
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-accent rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  key={headlineWords[currentWordIndex]}
                  transition={{ duration: 0.4, delay: 0.2 }}
                />
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8 px-4"
            >
              Expert visa assistance for <span className="text-primary-foreground font-semibold">100+ countries</span>.
              Fast processing, transparent pricing, guaranteed approval.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
            >
              <Link to="/visas">
                <Button
                  size="lg"
                  className="h-14 px-8 text-base bg-accent hover:bg-accent/90 text-accent-foreground shadow-2xl shadow-accent/30 group"
                >
                  <Plane className="mr-2 h-5 w-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                  Find Your Visa
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  className="h-14 px-8 text-base bg-white/20 border-2 border-white/50 text-white hover:bg-white/30 hover:border-white backdrop-blur-sm"
                >
                  Talk to Expert
                </Button>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-3 md:gap-6"
            >
              {trustBadges.map((badge, index) => (
                <div
                  key={badge.text}
                  className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20">
                    <badge.icon className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-primary-foreground">{badge.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Visa Cards Carousel Section */}
      <div className="relative pb-24 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="w-full"
        >
          {/* Section header */}
          <div className="text-center mb-6 px-4">
            <p className="text-primary-foreground/60 text-sm uppercase tracking-widest mb-2">Popular Destinations</p>
            <h3 className="text-xl md:text-2xl font-display font-semibold text-primary-foreground">
              Explore Visa Options
            </h3>
          </div>

          {/* Carousel container */}
          <div className="relative group">
            {/* Navigation buttons */}
            <button
              onClick={scrollLeft}
              className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full shadow-xl flex items-center justify-center transition-all ${
                canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </button>
            <button
              onClick={scrollRight}
              className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full shadow-xl flex items-center justify-center transition-all ${
                canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </button>

            {/* Gradient fades */}
            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-primary/100 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-primary/100 to-transparent z-10 pointer-events-none" />

            {/* Cards container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide px-6 md:px-12 py-2 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {visaCards.map((card, index) => (
                <Link
                  key={card.slug}
                  to={`/visas/${card.slug}`}
                  className="flex-shrink-0 group/card"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.05, duration: 0.5 }}
                    className="relative w-40 sm:w-44 md:w-48 bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  >
                    {/* Card image */}
                    <div className="relative h-24 sm:h-28 md:h-32 overflow-hidden">
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Flag badge */}
                      <div className="absolute top-2 left-2 text-xl md:text-2xl">
                        {card.flag}
                      </div>
                      
                      {/* Processing time badge */}
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        <span className="text-[10px] md:text-xs font-medium text-primary">{card.days}</span>
                      </div>
                    </div>

                    {/* Card content */}
                    <div className="p-3 md:p-4">
                      <h4 className="font-display font-bold text-foreground text-sm md:text-base mb-1">
                        {card.name} Visa
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-accent font-bold text-sm md:text-base">{card.price}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 group-hover/card:text-accent transition-colors">
                          Apply <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-xl border-t border-white/10"
      >
        <div className="container py-4 md:py-5">
          <div className="grid grid-cols-4 gap-2 md:gap-8">
            {[
              { value: "100+", label: "Countries", icon: "🌍" },
              { value: "50K+", label: "Visas Issued", icon: "✈️" },
              { value: "99%", label: "Success Rate", icon: "✅" },
              { value: "24/7", label: "Expert Support", icon: "💬" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-1 md:gap-2 mb-1">
                  <span className="text-base md:text-xl">{stat.icon}</span>
                  <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary-foreground">
                    {stat.value}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs md:text-sm text-primary-foreground/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
