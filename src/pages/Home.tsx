import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import {
  HeroSection,
  VisaFinder,
  PopularDestinations,
  HowItWorks,
  WhyChooseUs,
  Testimonials,
  ReviewForm,
  FAQsSection,
  CTAFooterSection,
} from "@/components/home";

const Home = () => {
  return (
    <>
      <SEO />
      <Layout>
        <HeroSection />
        <VisaFinder />
        <PopularDestinations />
        <HowItWorks />
        <WhyChooseUs />
        <Testimonials />
        <ReviewForm />
        <FAQsSection />
        <CTAFooterSection />
      </Layout>
    </>
  );
};

export default Home;