import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { enquirySchema, EnquiryFormData } from "@/lib/validation";

export default function Enquiry() {
  const [searchParams] = useSearchParams();
  const visaId = searchParams.get("visa");
  const country = searchParams.get("country");
  
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<EnquiryFormData>({
    name: "",
    email: "",
    phone: "",
    destination: country || "",
    message: ""
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryFormData, string>>>({});

  const validateField = (field: keyof EnquiryFormData, value: string) => {
    const testData = { ...formData, [field]: value };
    const result = enquirySchema.safeParse(testData);
    
    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      if (fieldError) {
        setErrors((prev) => ({ ...prev, [field]: fieldError.message }));
      } else {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleChange = (field: keyof EnquiryFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof EnquiryFormData) => {
    validateField(field, formData[field] || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate all fields
    const result = enquirySchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof EnquiryFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof EnquiryFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      toast({
        title: "Validation Error",
        description: "Please correct the highlighted fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("enquiries").insert({
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone || null,
        destination: result.data.destination,
        visa_id: visaId || null,
        message: result.data.message || null,
        status: "new"
      });

      if (error) {
        // Handle specific database validation errors
        if (error.message.includes("valid_email")) {
          setErrors({ email: "Please enter a valid email address" });
          throw new Error("Invalid email format");
        }
        if (error.message.includes("phone_format")) {
          setErrors({ phone: "Please enter a valid phone number" });
          throw new Error("Invalid phone format");
        }
        throw error;
      }

      setSubmitted(true);
      toast({
        title: "Enquiry Submitted!",
        description: "Our team will contact you within 24 hours.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit enquiry";
      toast({
        title: "Error",
        description: errorMessage === "Invalid email format" || errorMessage === "Invalid phone format" 
          ? "Please correct the highlighted fields" 
          : "Failed to submit enquiry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <SEO title="Enquiry Submitted - Travel Idea" />
        <div className="container py-20">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 bg-travel-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-travel-success" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-4">Thank You!</h1>
            <p className="text-muted-foreground mb-8">
              Your enquiry has been submitted successfully. Our visa specialists will contact you within 24 hours to assist with your {country || "visa"} application.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/visas">
                <Button variant="outline">Explore More Visas</Button>
              </Link>
              <Link to="/">
                <Button>Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title="Send Enquiry - Travel Idea" 
        description="Send a visa enquiry to Travel Idea. Our experts will contact you within 24 hours." 
      />

      {/* Header */}
      <section className="bg-primary py-12">
        <div className="container">
          <Link to="/visas" className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to visas
          </Link>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">
            Send Enquiry
          </h1>
          {country && (
            <p className="text-primary-foreground/80 mt-2">
              Interested in {country} visa
            </p>
          )}
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border rounded-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      onBlur={() => handleBlur("name")}
                      placeholder="Your full name"
                      className={errors.name ? "border-destructive" : ""}
                      maxLength={100}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      placeholder="your@email.com"
                      className={errors.email ? "border-destructive" : ""}
                      maxLength={255}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      onBlur={() => handleBlur("phone")}
                      placeholder="+91 98765 43210"
                      className={errors.phone ? "border-destructive" : ""}
                      maxLength={20}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination Country *</Label>
                    <Input
                      id="destination"
                      required
                      value={formData.destination}
                      onChange={(e) => handleChange("destination", e.target.value)}
                      onBlur={() => handleBlur("destination")}
                      placeholder="e.g., Thailand, Singapore"
                      className={errors.destination ? "border-destructive" : ""}
                      maxLength={100}
                    />
                    {errors.destination && (
                      <p className="text-sm text-destructive">{errors.destination}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    onBlur={() => handleBlur("message")}
                    placeholder="Tell us about your travel plans, dates, or any specific requirements..."
                    rows={4}
                    className={errors.message ? "border-destructive" : ""}
                    maxLength={2000}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive">{errors.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground text-right">
                    {formData.message?.length || 0}/2000
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                  By submitting this form, you agree to our{" "}
                  <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
                  {" "}and consent to be contacted regarding your enquiry.
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Enquiry"}
                </Button>
              </form>
            </div>

            {/* Contact info */}
            <div className="mt-8 text-center text-muted-foreground">
              <p className="mb-2">Or reach us directly:</p>
              <p>
                <a href="tel:+919101197909" className="text-primary hover:underline">+91 9101197909</a>
                {" · "}
                <a href="mailto:b2b@travelidea.in" className="text-primary hover:underline">b2b@travelidea.in</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
