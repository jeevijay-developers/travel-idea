import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, Share2, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout, PageHero } from "@/components/layout";
import { SEO } from "@/components/seo";
import { supabase } from "@/integrations/supabase/client";

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string | null;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  category: string | null;
  author: string | null;
  published_at: string | null;
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (!error && data) {
      setPost(data);
      // Fetch related posts
      const { data: related } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image, category")
        .eq("is_published", true)
        .neq("id", data.id)
        .limit(3);
      if (related) setRelatedPosts(related);
    }
    setLoading(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-20">
          <div className="max-w-3xl mx-auto animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-64 bg-muted rounded-xl" />
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-4/6" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <PageHero
          title="Post Not Found"
          subtitle="The blog post you're looking for doesn't exist."
          icon={BookOpen}
        />
        <div className="container py-12 text-center">
          <Link to="/blog">
            <Button>View All Posts</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title={`${post.title} - Travel Idea Blog`} 
        description={post.excerpt || `Read ${post.title} on Travel Idea Blog`} 
      />

      {/* Breadcrumb Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90" />
        <div className="absolute inset-0 opacity-[0.08]">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="container relative py-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-primary-foreground/70"
          >
            <Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/blog" className="hover:text-primary-foreground transition-colors">Blog</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-primary-foreground line-clamp-1">{post.title}</span>
          </motion.div>
        </div>
      </section>

      {/* Article */}
      <article className="py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="h-4 w-4" />
                Back to blog
              </Link>

              {post.category && (
                <span className="inline-block px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full mb-4">
                  {post.category}
                </span>
              )}

              <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground">
                {post.author && (
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {post.author}
                  </span>
                )}
                {post.published_at && (
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </span>
                )}
                <button onClick={handleShare} className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </motion.header>

            {/* Cover image */}
            {post.cover_image && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl overflow-hidden mb-8 shadow-lg"
              >
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-auto"
                />
              </motion.div>
            )}

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-lg max-w-none"
            >
              {post.content ? (
                <div 
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <p className="text-muted-foreground">{post.excerpt}</p>
              )}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 p-8 bg-gradient-to-r from-primary to-primary/90 rounded-2xl text-center"
            >
              <h3 className="text-xl font-bold text-primary-foreground mb-2">Ready to travel?</h3>
              <p className="text-primary-foreground/80 mb-4">Let us help you with your visa application.</p>
              <Link to="/visas">
                <Button variant="secondary" size="lg">Explore Visas</Button>
              </Link>
            </motion.div>
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-5xl mx-auto mt-16"
            >
              <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((related, index) => (
                  <motion.div
                    key={related.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Link
                      to={`/blog/${related.slug}`}
                      className="group block bg-card border rounded-2xl overflow-hidden hover:border-accent/50 hover:shadow-lg transition-all"
                    >
                      <div className="h-32 bg-muted overflow-hidden">
                        {related.cover_image ? (
                          <img src={related.cover_image} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-accent/50" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        {related.category && (
                          <span className="text-xs text-accent font-medium">{related.category}</span>
                        )}
                        <h3 className="font-semibold group-hover:text-accent transition-colors line-clamp-2 mt-1">
                          {related.title}
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </article>
    </Layout>
  );
}