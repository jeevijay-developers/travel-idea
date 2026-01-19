import { HelmetProvider } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import {
  HeroSection,
  ExploreByCountry,
  ExploreByBudget,
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
        <ExploreByCountry />
        <ExploreByBudget />
        <FeaturedVisas />
        <WhyChooseUs />
        <Testimonials />
        <BlogPreview />
      </Layout>
    </>
  );
};

export default Home;
