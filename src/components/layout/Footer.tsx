import { Link } from "react-router-dom";
import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import logoDark from "@/assets/logo.png";

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
    { name: "Blogs", href: "/blog" },
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
    <footer className="w-full bg-[#fcfdfd] text-gray-800 py-12 border-t border-gray-100">
      <div className="container mx-auto px-6 lg:px-16 max-w-7xl">
        
        {/* Brand Header with Logo - dark logo on light background */}
        <div className="mb-10">
          <Link to="/" className="inline-block mb-3">
            <img src={logoDark} alt="Travel Idea" className="h-12" />
          </Link>
          <p className="text-base text-gray-800 font-medium">
            Travelidea Private Limited: Simplifying global journeys.
          </p>
        </div>

        {/* Main Navigation Grid - 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">
          
          {/* Column 1: Visa Services */}
          <div>
            <h3 className="text-xl font-semibold text-primary mb-6">Visa Services</h3>
            <ul className="space-y-4 text-base">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-700 hover:text-primary hover:underline transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Company */}
          <div>
            <h3 className="text-xl font-semibold text-primary mb-6">Company</h3>
            <ul className="space-y-4 text-base">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-700 hover:text-primary hover:underline transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="text-xl font-semibold text-primary mb-6">Legal</h3>
            <ul className="space-y-4 text-base">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-700 hover:text-primary hover:underline transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-xl font-semibold text-primary mb-6">Contact</h3>
            <ul className="space-y-5 text-base">
              <li className="flex items-center group">
                <Phone className="text-primary w-5 h-5 mr-3" />
                <a 
                  href="tel:+919101197909" 
                  className="text-gray-700 hover:text-primary hover:underline transition-colors duration-200"
                >
                  +91 9101197909
                </a>
              </li>
              <li className="flex items-center group">
                <Mail className="text-primary w-5 h-5 mr-3" />
                <a 
                  href="mailto:b2b@travelidea.in" 
                  className="text-gray-700 hover:text-primary hover:underline transition-colors duration-200"
                >
                  b2b@travelidea.in
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section - Social Icons and Copyright */}
        <div className="flex flex-col items-center justify-center pt-4">
          
          {/* Social Icons */}
          <div className="flex space-x-6 mb-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                className="text-primary/80 hover:text-primary text-xl transition-colors duration-200"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          {/* Copyright Text */}
          <p className="text-gray-800 text-base font-normal text-center">
            © {new Date().getFullYear()} Travelidea. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
