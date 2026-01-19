import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import logo from "@/assets/logo.png";

const footerLinks = {
  services: [
    { name: "Tourist Visas", href: "/visas?type=tourist" },
    { name: "Business Visas", href: "/visas?type=business" },
    { name: "Transit Visas", href: "/visas?type=transit" },
    { name: "Student Visas", href: "/visas?type=student" },
    { name: "All Visas", href: "/visas" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Why Choose Us", href: "/why-choose-us" },
    { name: "Blog", href: "/blog" },
    { name: "FAQs", href: "/faqs" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
];

export function Footer() {
  return (
    <footer className="gradient-dark text-primary-foreground">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img src={logo} alt="Travel Idea" className="h-10" />
            </Link>
            <p className="text-primary-foreground/80 text-sm mb-6 leading-relaxed">
              Experience Travelidea Private Limited - Making stress-free travel possible at affordable pricing.
            </p>
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 text-xs font-medium bg-primary-foreground/10 rounded-full border border-primary-foreground/20">
                ISO9001:2015
              </span>
              <span className="px-3 py-1 text-xs font-medium bg-primary-foreground/10 rounded-full border border-primary-foreground/20">
                IATA Accredited
              </span>
            </div>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Visa Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-primary-foreground/10">
              <h4 className="text-sm font-semibold mb-3">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+919101197909" className="flex items-start gap-3 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>+91 9101197909</span>
                </a>
              </li>
              <li>
                <a href="mailto:b2b@travelidea.in" className="flex items-start gap-3 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>b2b@travelidea.in</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-primary-foreground mb-1">Head Office (Tezpur)</p>
                  <p>Ground Floor, G-Square Mall<br />(Sohum Building, Tezpur Main Rd)<br />Tezpur, Assam 784001</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-primary-foreground mb-1">Branch Office (Kolkata)</p>
                  <p>Regus Grandeur Offices<br />PS Arcadia, 9th Floor<br />4A Camac Street, Kolkata 700016</p>
                  <p className="mt-1">+91 33 6651 3201/3202</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Experience Travelidea Private Limited. All rights reserved.</p>
          <p>Making stress-free travel possible at affordable pricing</p>
        </div>
      </div>
    </footer>
  );
}