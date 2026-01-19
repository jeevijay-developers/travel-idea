import { Star, Quote } from "lucide-react";

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
  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Thousands of happy travelers trust us with their visa needs.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="relative p-6 md:p-8 rounded-xl bg-card border border-border animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/10" />

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {testimonial.avatar}
                </div>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
