import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import {
  HeroSection,
  FeaturedVisas,
  WhyChooseUs,
  Testimonials,
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
        <BlogPreview />
      </Layout>
    </>
  );
};

export default Home;