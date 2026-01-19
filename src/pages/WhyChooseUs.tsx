import { Shield, Zap, Globe, Clock, HeadphonesIcon, Wallet, CheckCircle, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";

const benefits = [
  {
    icon: Shield,
    title: "Stress-Free Process",
    description: "We handle all the paperwork and documentation, so you can focus on planning your trip."
  },
  {
    icon: Wallet,
    title: "Affordable Pricing",
    description: "Transparent pricing with no hidden fees. Get the best value for your visa processing."
  },
  {
    icon: Globe,
    title: "100+ Countries",
    description: "From tourist visas to business visas, we cover destinations across the globe."
  },
  {
    icon: Zap,
    title: "Fast Processing",
    description: "Express processing available for urgent travel needs. Get your visa in as little as 24 hours."
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Our dedicated support team is available round the clock to assist you with any queries."
  },
  {
    icon: CheckCircle,
    title: "99% Success Rate",
    description: "Our expert review process ensures your application meets all requirements."
  }
];

const stats = [
  { value: "50,000+", label: "Visas Processed" },
  { value: "100+", label: "Countries Covered" },
  { value: "99%", label: "Success Rate" },
  { value: "10+", label: "Years Experience" }
];

export default function WhyChooseUs() {
  return (
    <Layout>
      <SEO 
        title="Why Choose Us - Travel Idea" 
        description="Discover why thousands of travelers choose Travel Idea for their visa needs. ISO certified, IATA accredited, and trusted by 50,000+ customers." 
      />

      {/* Hero */}
      <section className="bg-primary py-20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-6">
              Why Choose Travel Idea?
            </h1>
            <p className="text-xl text-primary-foreground/80">
              We're more than just a visa service. We're your travel partners, committed to making your journey smooth from start to finish.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-muted/30 border-b">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-4">
            The Travel Idea Advantage
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            We've processed over 50,000 visas with a 99% success rate. Here's what sets us apart.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={benefit.title} 
                className="bg-card border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-12">
              Trusted & Certified
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card border rounded-xl p-8 flex items-start gap-6">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">ISO9001:2015 Certified</h3>
                  <p className="text-muted-foreground">
                    Our quality management system meets international standards, ensuring consistent and reliable service delivery for every customer.
                  </p>
                </div>
              </div>
              <div className="bg-card border rounded-xl p-8 flex items-start gap-6">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">IATA Accredited</h3>
                  <p className="text-muted-foreground">
                    As an IATA accredited agency, we adhere to the highest standards set by the International Air Transport Association.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-4">
            Simple 4-Step Process
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Getting your visa has never been easier. Follow our streamlined process.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Choose Your Visa", desc: "Select your destination and visa type from our extensive catalog." },
              { step: "02", title: "Submit Documents", desc: "Upload required documents through our secure portal." },
              { step: "03", title: "Expert Review", desc: "Our team reviews and verifies your application." },
              { step: "04", title: "Receive Visa", desc: "Get your approved visa delivered to your doorstep." }
            ].map((item, index) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-8 right-0 w-12 h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join thousands of satisfied travelers who have trusted us with their visa needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/visas">
              <Button size="lg" variant="secondary">
                Explore Visas
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}