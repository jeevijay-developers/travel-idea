import { Star, Quote } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    location: "Mumbai, India",
    avatar: "RS",
    rating: 5,
    text: "Travel Idea made my Thailand visa process incredibly smooth. Got my e-visa in just 3 days. Highly recommended!",
    destination: "Thailand",
  },
  {
    id: 2,
    name: "Priya Patel",
    location: "Bangalore, India",
    avatar: "PP",
    rating: 5,
    text: "Excellent service for my Singapore business visa. The team was responsive and handled everything professionally.",
    destination: "Singapore",
  },
  {
    id: 3,
    name: "Amit Kumar",
    location: "Delhi, India",
    avatar: "AK",
    rating: 5,
    text: "Applied for a Schengen visa through Travel Idea. Clear guidance on documents and got approved on first attempt!",
    destination: "Schengen",
  },
  {
    id: 4,
    name: "Sneha Reddy",
    location: "Hyderabad, India",
    avatar: "SR",
    rating: 5,
    text: "Best visa service I've used. Transparent pricing, quick processing, and amazing customer support throughout.",
    destination: "Dubai",
  },
];

export function Testimonials() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, x: -30, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={headerVariants}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Thousands of happy travelers trust us with their visa needs.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-6 lg:gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={cardVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="relative p-6 md:p-8 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow"
            >
              {/* Quote icon */}
              <motion.div
                initial={{ opacity: 0, rotate: -20 }}
                animate={isVisible ? { opacity: 0.1, rotate: 0 } : { opacity: 0, rotate: -20 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Quote className="absolute top-6 right-6 h-8 w-8 text-primary" />
              </motion.div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
                  >
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  </motion.div>
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold"
                >
                  {testimonial.avatar}
                </motion.div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
                <div className="ml-auto">
                  <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                    {testimonial.destination} Visa
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
