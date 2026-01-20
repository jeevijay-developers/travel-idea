import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, type Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

// Sample blog posts - in production, this would come from the database
const blogPosts = [
  {
    id: 1,
    title: "Complete Guide to Thailand e-Visa Application in 2024",
    excerpt: "Everything you need to know about applying for a Thailand e-visa, including requirements, processing times, and tips for a successful application.",
    category: "Visa Tips",
    date: "Jan 15, 2024",
    slug: "thailand-evisa-guide-2024",
  },
  {
    id: 2,
    title: "Top 10 Visa-Free Destinations for Indian Passport Holders",
    excerpt: "Discover beautiful countries you can visit without the hassle of visa applications. Perfect for spontaneous travelers.",
    category: "Destinations",
    date: "Jan 12, 2024",
    slug: "visa-free-destinations-indians",
  },
  {
    id: 3,
    title: "How to Prepare a Strong Schengen Visa Application",
    excerpt: "Expert tips on documentation, cover letters, and common mistakes to avoid when applying for a Schengen visa.",
    category: "Visa Tips",
    date: "Jan 10, 2024",
    slug: "schengen-visa-preparation-tips",
  },
];

export function BlogPreview() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

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
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section ref={sectionRef} className="py-20 bg-muted/30">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={headerVariants}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Blog</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
              Travel Tips & Insights
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Stay updated with the latest visa news, travel tips, and destination guides.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Button asChild variant="outline" className="w-fit">
              <Link to="/blog">
                View All Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Blog posts grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {blogPosts.map((post) => (
            <motion.div key={post.id} variants={cardVariants}>
              <Link
                to={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 block"
              >
                {/* Placeholder image */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden"
                >
                  <span className="text-4xl">📝</span>
                </motion.div>

                <div className="p-6">
                  {/* Category & date */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Read more */}
                  <motion.div
                    className="flex items-center gap-2 mt-4 text-primary font-medium text-sm"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    Read more
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
