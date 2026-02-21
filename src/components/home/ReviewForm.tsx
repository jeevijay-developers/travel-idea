import { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export function ReviewForm() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    destination: "",
    rating: 0,
    review_text: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating === 0) {
      toast({ title: "Please select a rating", variant: "destructive" });
      return;
    }
    if (!form.name.trim() || !form.email.trim() || !form.review_text.trim()) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      location: form.location.trim() || null,
      destination: form.destination.trim() || null,
      rating: form.rating,
      review_text: form.review_text.trim(),
    });

    setIsSubmitting(false);
    if (error) {
      toast({ title: "Failed to submit review", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Thank you!", description: "Your review has been submitted and will appear after approval." });
      setForm({ name: "", email: "", location: "", destination: "", rating: 0, review_text: "" });
      setHoveredStar(0);
    }
  };

  const activeRating = hoveredStar || form.rating;

  return (
    <section ref={sectionRef} className="py-10 md:py-16 bg-muted/30">
      <div className="container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 md:mb-8"
        >
          <span className="inline-block px-2.5 py-0.5 bg-accent/10 text-accent text-xs font-semibold rounded-full mb-2">
            Share Your Experience
          </span>
          <h2 className="text-xl md:text-2xl lg:text-4xl font-display font-bold text-foreground mb-1.5">
            Leave a Review
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm max-w-md mx-auto">
            Your feedback helps us improve and helps other travelers make informed decisions.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-xl p-5 md:p-6 space-y-4"
        >
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Your Rating *</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setForm((p) => ({ ...p, rating: star }))}
                  className="p-0.5 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-7 w-7 transition-colors ${
                      star <= activeRating
                        ? "fill-travel-gold text-travel-gold"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Name *</label>
              <Input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Your name"
                maxLength={100}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="your@email.com"
                maxLength={255}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Location</label>
              <Input
                value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                placeholder="e.g. Mumbai"
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Destination</label>
              <Input
                value={form.destination}
                onChange={(e) => setForm((p) => ({ ...p, destination: e.target.value }))}
                placeholder="e.g. Thailand"
                maxLength={100}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Your Review *</label>
            <Textarea
              value={form.review_text}
              onChange={(e) => setForm((p) => ({ ...p, review_text: e.target.value }))}
              placeholder="Tell us about your experience..."
              rows={4}
              maxLength={500}
              required
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </motion.form>
      </div>
    </section>
  );
}
