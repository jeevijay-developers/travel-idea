import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
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
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
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

      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4 border-b">
        <div className="container">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground line-clamp-1">{post.title}</span>
          </div>
        </div>
      </div>

      {/* Article */}
      <article className="py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="h-4 w-4" />
                Back to blog
              </Link>

              {post.category && (
                <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-4">
                  {post.category}
                </span>
              )}

              <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                {post.title}
              </h1>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
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
                <button onClick={handleShare} className="flex items-center gap-2 hover:text-foreground">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </header>

            {/* Cover image */}
            {post.cover_image && (
              <div className="rounded-xl overflow-hidden mb-8">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {post.content ? (
                <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                  {post.content}
                </div>
              ) : (
                <p className="text-muted-foreground">{post.excerpt}</p>
              )}
            </div>

            {/* CTA */}
            <div className="mt-12 p-8 bg-primary rounded-xl text-center">
              <h3 className="text-xl font-bold text-primary-foreground mb-2">Ready to travel?</h3>
              <p className="text-primary-foreground/80 mb-4">Let us help you with your visa application.</p>
              <Link to="/visas">
                <Button variant="secondary">Explore Visas</Button>
              </Link>
            </div>
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="max-w-5xl mx-auto mt-16">
              <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    to={`/blog/${related.slug}`}
                    className="group bg-card border rounded-xl overflow-hidden hover:border-primary/50 transition-colors"
                  >
                    <div className="h-32 bg-muted overflow-hidden">
                      {related.cover_image ? (
                        <img src={related.cover_image} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <span className="text-2xl">✈️</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </Layout>
  );
}