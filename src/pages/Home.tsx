import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import {
  HeroSection,
  PopularDestinations,
  HowItWorks,
  WhyChooseUs,
  Testimonials,
  FAQsSection,
  CTAFooterSection,
} from "@/components/home";

const Home = () => {
  return (
    <>
      <SEO />
      <Layout>
        <HeroSection />
        <PopularDestinations />
        <HowItWorks />
        <WhyChooseUs />
        <Testimonials />
        <FAQsSection />
        <CTAFooterSection />
      </Layout>
    </>
  );
};

export default Home;