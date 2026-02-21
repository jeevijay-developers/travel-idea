import { Star, Quote } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  name: string;
  location: string | null;
  rating: number;
  review_text: string;
  destination: string | null;
}

const fallbackTestimonials: Review[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    location: "Mumbai",
    rating: 5,
    review_text: "Travel Idea made my Thailand visa incredibly smooth. Got my e-visa in just 3 days!",
    destination: "Thailand",
  },
  {
    id: "2",
    name: "Priya Patel",
    location: "Bangalore",
    rating: 5,
    review_text: "Excellent service for my Singapore business visa. Very responsive.",
    destination: "Singapore",
  },
  {
    id: "3",
    name: "Amit Kumar",
    location: "Delhi",
    rating: 5,
    review_text: "Applied for Schengen visa. Clear guidance and got approved first time!",
    destination: "Schengen",
  },
  {
    id: "4",
    name: "Sneha Reddy",
    location: "Hyderabad",
    rating: 5,
    review_text: "Best visa service. Transparent pricing, quick processing, great support.",
    destination: "Dubai",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Testimonials() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const { data: approvedReviews } = useQuery({
    queryKey: ["approved-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, name, location, rating, review_text, destination")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data as Review[];
    },
  });

  const testimonials = approvedReviews && approvedReviews.length > 0 ? approvedReviews : fallbackTestimonials;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section ref={sectionRef} className="py-10 md:py-16 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 md:mb-8"
        >
          <span className="inline-block px-2.5 py-0.5 bg-accent/10 text-accent text-xs font-semibold rounded-full mb-2 md:mb-3">
            Testimonials
          </span>
          <h2 className="text-xl md:text-2xl lg:text-4xl font-display font-bold text-foreground mb-1.5 md:mb-2">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm max-w-md mx-auto px-4">
            Thousands of happy travelers trust us with their visa needs.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={cardVariants}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="relative p-4 md:p-5 rounded-xl bg-card border border-border hover:shadow-md transition-all"
            >
              <Quote className="absolute top-3 right-3 md:top-4 md:right-4 h-5 w-5 md:h-6 md:w-6 text-primary/10" />

              <div className="flex items-center gap-0.5 mb-2 md:mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 md:h-3.5 md:w-3.5 fill-travel-gold text-travel-gold" />
                ))}
              </div>

              <p className="text-foreground text-xs md:text-sm mb-3 md:mb-4 leading-relaxed line-clamp-3">
                "{testimonial.review_text}"
              </p>

              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] md:text-xs font-semibold shrink-0">
                  {getInitials(testimonial.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-xs md:text-sm truncate">{testimonial.name}</p>
                  {testimonial.location && (
                    <p className="text-[10px] md:text-xs text-muted-foreground">{testimonial.location}</p>
                  )}
                </div>
                {testimonial.destination && (
                  <span className="px-1.5 md:px-2 py-0.5 text-[9px] md:text-[10px] bg-secondary text-secondary-foreground rounded-full shrink-0">
                    {testimonial.destination}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
