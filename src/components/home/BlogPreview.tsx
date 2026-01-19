import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample blog posts - in production, this would come from the database
const blogPosts = [
  {
    id: 1,
    title: "Complete Guide to Thailand e-Visa Application in 2024",
    excerpt: "Everything you need to know about applying for a Thailand e-visa, including requirements, processing times, and tips for a successful application.",
    category: "Visa Tips",
    date: "Jan 15, 2024",
    image: "bg-gradient-to-br from-orange-400 to-red-500",
    slug: "thailand-evisa-guide-2024",
  },
  {
    id: 2,
    title: "Top 10 Visa-Free Destinations for Indian Passport Holders",
    excerpt: "Discover beautiful countries you can visit without the hassle of visa applications. Perfect for spontaneous travelers.",
    category: "Destinations",
    date: "Jan 12, 2024",
    image: "bg-gradient-to-br from-blue-400 to-purple-500",
    slug: "visa-free-destinations-indians",
  },
  {
    id: 3,
    title: "How to Prepare a Strong Schengen Visa Application",
    excerpt: "Expert tips on documentation, cover letters, and common mistakes to avoid when applying for a Schengen visa.",
    category: "Visa Tips",
    date: "Jan 10, 2024",
    image: "bg-gradient-to-br from-teal-400 to-cyan-500",
    slug: "schengen-visa-preparation-tips",
  },
];

export function BlogPreview() {
  return (
    <section className="py-20">
      <div className="container">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Blog</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
              Travel Tips & Insights
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Stay updated with the latest visa news, travel tips, and destination guides.
            </p>
          </div>
          <Button asChild variant="outline" className="w-fit">
            <Link to="/blog">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Blog posts grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image placeholder */}
              <div className={`h-48 ${post.image} opacity-80 group-hover:opacity-100 transition-opacity`} />

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
                <div className="flex items-center gap-2 mt-4 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                  Read more
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
