import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { ScrollToTop } from "@/components/layout";
import Home from "./pages/Home";
import Visas from "./pages/Visas";
import VisaDetail from "./pages/VisaDetail";
import About from "./pages/About";
import WhyChooseUs from "./pages/WhyChooseUs";
import Contact from "./pages/Contact";
import Enquiry from "./pages/Enquiry";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import FAQs from "./pages/FAQs";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DashboardHome from "./pages/admin/DashboardHome";
import AdminVisas from "./pages/admin/AdminVisas";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCountries from "./pages/admin/AdminCountries";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminReviews from "./pages/admin/AdminReviews";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/visas" element={<Visas />} />
              <Route path="/visas/:slug" element={<VisaDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/why-choose-us" element={<WhyChooseUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/enquiry" element={<Enquiry />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />}>
                <Route index element={<DashboardHome />} />
                <Route path="visas" element={<AdminVisas />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="countries" element={<AdminCountries />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="enquiries" element={<AdminEnquiries />} />
                <Route path="newsletter" element={<AdminNewsletter />} />
                <Route path="staff" element={<AdminStaff />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
