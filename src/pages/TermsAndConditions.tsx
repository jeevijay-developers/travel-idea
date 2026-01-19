import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";

export default function TermsAndConditions() {
  return (
    <Layout>
      <SEO 
        title="Terms & Conditions - Travel Idea" 
        description="Read the terms and conditions for using Travel Idea's visa services." 
      />

      <section className="bg-primary py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">
            Terms & Conditions
          </h1>
          <p className="text-primary-foreground/80 mt-2">Last updated: January 2024</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <div className="space-y-8 text-muted-foreground">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">1. Introduction</h2>
                <p>
                  Welcome to Travel Idea, operated by Experience Travelidea Private Limited. By accessing and using our website and services, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">2. Services</h2>
                <p>
                  Travel Idea provides visa processing assistance services for various countries. We act as an intermediary between applicants and embassies/consulates. We do not guarantee visa approval as the final decision rests with the respective immigration authorities.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">3. User Responsibilities</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and complete information in all applications</li>
                  <li>Submit genuine and valid documents as required</li>
                  <li>Comply with all visa requirements of the destination country</li>
                  <li>Respond promptly to requests for additional information</li>
                  <li>Keep your contact information updated</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">4. Fees and Payment</h2>
                <p>
                  All fees are displayed on our website. Service fees are separate from government/embassy fees. Some fees may be non-refundable once processing has begun. Payment terms will be communicated upon enquiry confirmation.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">5. Refund Policy</h2>
                <p>
                  Refunds are processed on a case-by-case basis. Government fees and embassy charges are generally non-refundable. Service fees may be partially refundable if the application has not been submitted. Full details will be provided during the application process.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">6. Limitation of Liability</h2>
                <p>
                  Travel Idea shall not be liable for visa rejections, delays caused by embassies/consulates, changes in visa requirements, or any consequential damages arising from the use of our services. We are not responsible for any travel arrangements affected by visa processing times or outcomes.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">7. Intellectual Property</h2>
                <p>
                  All content on this website, including text, graphics, logos, and images, is the property of Experience Travelidea Private Limited and is protected by copyright laws. Unauthorized use is prohibited.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">8. Privacy</h2>
                <p>
                  Your use of our services is also governed by our Privacy Policy. By using our services, you consent to the collection and use of your information as described in our Privacy Policy.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">9. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this website. Continued use of our services constitutes acceptance of the modified terms.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">10. Contact Information</h2>
                <p>
                  For questions about these Terms and Conditions, please contact us at:
                </p>
                <ul className="list-none mt-4 space-y-1">
                  <li><strong>Email:</strong> b2b@travelidea.in</li>
                  <li><strong>Phone:</strong> +91 9101197909</li>
                  <li><strong>Address:</strong> Ground Floor, G-Square Mall, Tezpur Main Rd, Tezpur, Assam 784001</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">11. Governing Law</h2>
                <p>
                  These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Assam, India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}