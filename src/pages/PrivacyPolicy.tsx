import { Shield } from "lucide-react";
import { Layout, PageHero } from "@/components/layout";
import { SEO } from "@/components/seo";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <SEO 
        title="Privacy Policy - Travel Idea" 
        description="Learn how Travel Idea collects, uses, and protects your personal information." 
      />

      <PageHero
        title="Privacy Policy"
        subtitle="Last updated: January 2024"
        icon={Shield}
      />

      <section className="py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <div className="space-y-8 text-muted-foreground">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">1. Introduction</h2>
                <p>
                  Experience Travelidea Private Limited ("Travel Idea", "we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Personal Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Full name, date of birth, nationality</li>
                  <li>Contact information (email, phone number, address)</li>
                  <li>Passport details and travel documents</li>
                  <li>Employment and financial information (as required for visa applications)</li>
                  <li>Photographs and biometric data</li>
                </ul>
                <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Automatically Collected Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address and location data</li>
                  <li>Usage data and browsing patterns</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process visa applications on your behalf</li>
                  <li>Communicate with you about your application status</li>
                  <li>Provide customer support and respond to enquiries</li>
                  <li>Improve our website and services</li>
                  <li>Comply with legal obligations</li>
                  <li>Send promotional materials (with your consent)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">4. Information Sharing</h2>
                <p>We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Embassies, consulates, and immigration authorities (for visa processing)</li>
                  <li>Third-party service providers who assist in our operations</li>
                  <li>Legal authorities when required by law</li>
                </ul>
                <p className="mt-4">We do not sell your personal information to third parties.</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">5. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, secure servers, and access controls.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">6. Data Retention</h2>
                <p>
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Visa application data is typically retained for 7 years.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">7. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data (subject to legal requirements)</li>
                  <li>Object to processing of your data</li>
                  <li>Withdraw consent for marketing communications</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">8. Cookies</h2>
                <p>
                  Our website uses cookies to enhance your browsing experience. Cookies are small files stored on your device that help us analyze web traffic and improve our services. You can choose to disable cookies through your browser settings.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">9. Third-Party Links</h2>
                <p>
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">10. Children's Privacy</h2>
                <p>
                  Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children without parental consent. If you believe we have collected such information, please contact us immediately.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">11. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">12. Contact Us</h2>
                <p>
                  If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
                </p>
                <ul className="list-none mt-4 space-y-1">
                  <li><strong>Email:</strong> b2b@travelidea.in</li>
                  <li><strong>Phone:</strong> +91 9101197909</li>
                  <li><strong>Address:</strong> Ground Floor, G-Square Mall, Tezpur Main Rd, Tezpur, Assam 784001</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}