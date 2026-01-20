import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Send, Mail, Phone, User, MapPin, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Layout, PageHero } from "@/components/layout";
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
  const [currentStep, setCurrentStep] = useState(1);
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
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof EnquiryFormData) => {
    validateField(field, formData[field] || "");
  };

  const validateStep = (step: number): boolean => {
    const stepErrors: Partial<Record<keyof EnquiryFormData, string>> = {};
    
    if (step === 1 && !formData.name.trim()) {
      stepErrors.name = "Please enter your name";
    }
    if (step === 2) {
      if (!formData.email.trim()) stepErrors.email = "Please enter your email";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        stepErrors.email = "Please enter a valid email";
      }
    }
    if (step === 3 && !formData.destination.trim()) {
      stepErrors.destination = "Please enter your destination";
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

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

  const steps = [
    { id: 1, label: "Name", icon: User },
    { id: 2, label: "Contact", icon: Mail },
    { id: 3, label: "Destination", icon: MapPin },
    { id: 4, label: "Details", icon: MessageSquare },
  ];

  if (submitted) {
    return (
      <Layout>
        <SEO title="Enquiry Submitted - Travel Idea" />
        <PageHero
          title="Enquiry Submitted"
          subtitle="We've received your request and will get back to you shortly."
          icon={CheckCircle}
        />
        <div className="container py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-accent" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-4">Thank You!</h2>
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
          </motion.div>
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

      <PageHero
        title="Send Enquiry"
        subtitle={country ? `Get assistance for your ${country} visa application` : "We're here to help with your visa needs"}
        icon={Send}
        badge="Quick Response Guaranteed"
      />

      {/* Form Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-2 md:gap-4">
                {steps.map((step, i) => (
                  <div key={step.id} className="flex items-center">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: currentStep >= step.id ? 1 : 0.8 }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                        currentStep >= step.id
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <step.icon className="h-4 w-4" />
                      <span className="hidden sm:inline text-sm font-medium">{step.label}</span>
                    </motion.div>
                    {i < steps.length - 1 && (
                      <div className={`w-8 md:w-12 h-0.5 mx-2 ${currentStep > step.id ? "bg-accent" : "bg-muted"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 p-6 text-center">
                <Sparkles className="h-8 w-8 text-accent mx-auto mb-2" />
                <h2 className="text-xl font-semibold text-primary-foreground">
                  Step {currentStep} of 4
                </h2>
                <p className="text-primary-foreground/70 text-sm">
                  {currentStep === 1 && "Let's start with your name"}
                  {currentStep === 2 && "How can we reach you?"}
                  {currentStep === 3 && "Where would you like to go?"}
                  {currentStep === 4 && "Any additional details?"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8" noValidate>
                {/* Step 1: Name */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="text-lg font-semibold">What's your name?</h3>
                      <p className="text-sm text-muted-foreground">We'd love to know who we're helping</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        onBlur={() => handleBlur("name")}
                        placeholder="Enter your full name"
                        className={`h-12 text-lg ${errors.name ? "border-destructive" : ""}`}
                        maxLength={100}
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>
                    <Button type="button" onClick={nextStep} className="w-full h-12 bg-accent hover:bg-accent/90">
                      Continue
                    </Button>
                  </motion.div>
                )}

                {/* Step 2: Contact */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="text-lg font-semibold">How can we reach you?</h3>
                      <p className="text-sm text-muted-foreground">We'll send updates to your email</p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          onBlur={() => handleBlur("email")}
                          placeholder="your@email.com"
                          className={`h-12 ${errors.email ? "border-destructive" : ""}`}
                          maxLength={255}
                        />
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          onBlur={() => handleBlur("phone")}
                          placeholder="+91 98765 43210"
                          className={`h-12 ${errors.phone ? "border-destructive" : ""}`}
                          maxLength={20}
                        />
                        {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-12">
                        Back
                      </Button>
                      <Button type="button" onClick={nextStep} className="flex-1 h-12 bg-accent hover:bg-accent/90">
                        Continue
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Destination */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="text-lg font-semibold">Where are you headed?</h3>
                      <p className="text-sm text-muted-foreground">Tell us your dream destination</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destination Country *</Label>
                      <Input
                        id="destination"
                        value={formData.destination}
                        onChange={(e) => handleChange("destination", e.target.value)}
                        onBlur={() => handleBlur("destination")}
                        placeholder="e.g., Thailand, Singapore, Japan"
                        className={`h-12 text-lg ${errors.destination ? "border-destructive" : ""}`}
                        maxLength={100}
                      />
                      {errors.destination && <p className="text-sm text-destructive">{errors.destination}</p>}
                    </div>
                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-12">
                        Back
                      </Button>
                      <Button type="button" onClick={nextStep} className="flex-1 h-12 bg-accent hover:bg-accent/90">
                        Continue
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Message */}
                {currentStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="text-lg font-semibold">Any additional details?</h3>
                      <p className="text-sm text-muted-foreground">Travel dates, requirements, questions...</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        onBlur={() => handleBlur("message")}
                        placeholder="Tell us about your travel plans, dates, or any specific requirements..."
                        rows={5}
                        className={`resize-none ${errors.message ? "border-destructive" : ""}`}
                        maxLength={2000}
                      />
                      {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                      <p className="text-xs text-muted-foreground text-right">
                        {formData.message?.length || 0}/2000
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground">
                      By submitting this form, you agree to our{" "}
                      <Link to="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link>
                      {" "}and consent to be contacted regarding your enquiry.
                    </div>
                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-12">
                        Back
                      </Button>
                      <Button type="submit" disabled={loading} className="flex-1 h-12 bg-accent hover:bg-accent/90">
                        {loading ? "Submitting..." : "Submit Enquiry"}
                        <Send className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-muted-foreground mb-3">Or reach us directly:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="tel:+919101197909" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-card border rounded-full text-sm hover:bg-muted transition-colors"
                >
                  <Phone className="h-4 w-4 text-accent" />
                  +91 9101197909
                </a>
                <a 
                  href="mailto:b2b@travelidea.in" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-card border rounded-full text-sm hover:bg-muted transition-colors"
                >
                  <Mail className="h-4 w-4 text-accent" />
                  b2b@travelidea.in
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}