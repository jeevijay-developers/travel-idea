import { Star, Quote } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    location: "Mumbai",
    avatar: "RS",
    rating: 5,
    text: "Travel Idea made my Thailand visa incredibly smooth. Got my e-visa in just 3 days!",
    destination: "Thailand",
  },
  {
    id: 2,
    name: "Priya Patel",
    location: "Bangalore",
    avatar: "PP",
    rating: 5,
    text: "Excellent service for my Singapore business visa. Very responsive and professional.",
    destination: "Singapore",
  },
  {
    id: 3,
    name: "Amit Kumar",
    location: "Delhi",
    avatar: "AK",
    rating: 5,
    text: "Applied for Schengen visa. Clear guidance and got approved on first attempt!",
    destination: "Schengen",
  },
  {
    id: 4,
    name: "Sneha Reddy",
    location: "Hyderabad",
    avatar: "SR",
    rating: 5,
    text: "Best visa service. Transparent pricing, quick processing, and great support.",
    destination: "Dubai",
  },
];

export function Testimonials() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

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
    <section ref={sectionRef} className="py-12 md:py-16 bg-background">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <span className="inline-block px-2.5 py-0.5 bg-accent/10 text-accent text-xs font-semibold rounded-full mb-3">
            Testimonials
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground mb-2">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Thousands of happy travelers trust us with their visa needs.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-4"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={cardVariants}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="relative p-5 rounded-xl bg-card border border-border hover:shadow-md transition-all"
            >
              {/* Quote icon */}
              <Quote className="absolute top-4 right-4 h-6 w-6 text-primary/10" />

              {/* Rating */}
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-travel-gold text-travel-gold" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground text-sm mb-4 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                  {testimonial.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
                <span className="px-2 py-0.5 text-[10px] bg-secondary text-secondary-foreground rounded-full shrink-0">
                  {testimonial.destination}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}