import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import {
  HeroSection,
  FeaturedVisas,
  WhyChooseUs,
  Testimonials,
  FAQsSection,
  BlogPreview,
} from "@/components/home";

const Home = () => {
  return (
    <>
      <SEO />
      <Layout>
        <HeroSection />
        <FeaturedVisas />
        <WhyChooseUs />
        <Testimonials />
        <FAQsSection />
        <BlogPreview />
      </Layout>
    </>
  );
};

export default Home;
