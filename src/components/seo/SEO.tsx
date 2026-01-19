import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const defaultMeta = {
  title: "Travel Idea - Stress-Free Visa Services at Affordable Pricing",
  description: "Get your visa hassle-free with Travel Idea. We offer visa services for 100+ countries with expert guidance, fast processing, and affordable prices. ISO9001:2015 Certified & IATA Accredited.",
  keywords: "visa services, tourist visa, business visa, travel visa, visa application, visa assistance, international travel, visa processing",
  image: "/og-image.jpg",
  url: "https://travelidea.in",
};

export function SEO({
  title,
  description = defaultMeta.description,
  keywords = defaultMeta.keywords,
  image = defaultMeta.image,
  url = defaultMeta.url,
  type = "website",
}: SEOProps) {
  const fullTitle = title ? `${title} | Travel Idea` : defaultMeta.title;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content="Experience Travelidea Private Limited" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
