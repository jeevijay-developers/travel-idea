import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import {
  HeroSection,
  VisaFinder,
  StatsCounter,
  PopularDestinations,
  VisaTypesExplained,
  HowItWorks,
  WhyChooseUs,
  PriceTransparency,
  ExpressVisa,
  RecentlyIssuedVisas,
  Testimonials,
  CorporateVisas,
  FAQsSection,
  BlogPreview,
  CTAFooterSection,
} from "@/components/home";

const Home = () => {
  return (
    <>
      <SEO />
      <Layout>
        <HeroSection />
        <VisaFinder />
        <StatsCounter />
        <PopularDestinations />
        <VisaTypesExplained />
        <HowItWorks />
        <WhyChooseUs />
        <PriceTransparency />
        <ExpressVisa />
        <RecentlyIssuedVisas />
        <Testimonials />
        <CorporateVisas />
        <FAQsSection />
        <BlogPreview />
        <CTAFooterSection />
      </Layout>
    </>
  );
};

export default Home;
