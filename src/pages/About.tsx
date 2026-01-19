import { Shield, Award, MapPin, Phone, Mail, Clock, Users, Globe, Heart } from "lucide-react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";

const certifications = [
  {
    icon: Shield,
    title: "ISO9001:2015 Certified",
    description: "Quality management system certified for consistent service delivery"
  },
  {
    icon: Award,
    title: "IATA Accredited",
    description: "International Air Transport Association recognized travel agency"
  }
];

const values = [
  {
    icon: Heart,
    title: "Customer First",
    description: "Your travel dreams are our priority. We go above and beyond to make your journey seamless."
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "With visa services for 100+ countries, we help you explore the world without boundaries."
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Our experienced visa specialists have processed over 50,000 applications successfully."
  },
  {
    icon: Clock,
    title: "Fast Processing",
    description: "We understand your time is valuable. Our streamlined process ensures quick turnaround."
  }
];

export default function About() {
  return (
    <Layout>
      <SEO 
        title="About Us - Travel Idea" 
        description="Learn about Experience Travelidea Private Limited, an ISO9001:2015 certified and IATA accredited travel agency providing stress-free visa services." 
      />

      {/* Hero */}
      <section className="bg-primary py-20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-6">
              Making Travel Dreams Come True
            </h1>
            <p className="text-xl text-primary-foreground/80">
              Experience Travelidea Private Limited is your trusted partner for hassle-free visa services, helping thousands of travelers explore the world with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                "To make stress-free travel possible at affordable pricing"
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                At Travel Idea, we believe that everyone deserves to explore the world. Founded with a vision to simplify visa processing, we've grown into one of the most trusted visa service providers in India.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our team of dedicated visa specialists works tirelessly to ensure your applications are processed accurately and efficiently, giving you peace of mind while you plan your next adventure.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "100+", label: "Countries Served" },
                { value: "50K+", label: "Visas Processed" },
                { value: "99%", label: "Success Rate" },
                { value: "24/7", label: "Support Available" }
              ].map((stat) => (
                <div key={stat.label} className="bg-card border rounded-xl p-6 text-center">
                  <p className="text-3xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-12">
            Our Certifications
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {certifications.map((cert) => (
              <div key={cert.title} className="bg-card border rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <cert.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{cert.title}</h3>
                <p className="text-muted-foreground">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-4">
            Why We Do What We Do
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our core values guide everything we do, ensuring you receive the best possible service.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-card border rounded-xl p-6 hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-12">
            Our Offices
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Head Office */}
            <div className="bg-card border rounded-xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">Head Office</span>
                  <h3 className="text-xl font-semibold">Tezpur, Assam</h3>
                </div>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Experience Travelidea Private Limited<br />
                  Ground Floor, G-Square Mall<br />
                  (Sohum Building, Tezpur Main Rd)<br />
                  Tezpur, Assam 784001
                </p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href="tel:+919101197909" className="hover:text-primary">+91 9101197909</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:b2b@travelidea.in" className="hover:text-primary">b2b@travelidea.in</a>
                </div>
              </div>
            </div>

            {/* Branch Office */}
            <div className="bg-card border rounded-xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-secondary/50 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Branch Office</span>
                  <h3 className="text-xl font-semibold">Kolkata, West Bengal</h3>
                </div>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Regus Grandeur Offices Private Limited<br />
                  PS Arcadia, 9th Floor<br />
                  4A Camac Street<br />
                  Kolkata 700016
                </p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+91 33 6651 3201 / 3202</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Contact us today and let us handle your visa requirements while you focus on planning your adventure.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-background text-foreground rounded-lg font-medium hover:bg-background/90 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </Layout>
  );
}