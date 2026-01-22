import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plane, MessageSquare, FileText, Globe, Mail, TrendingUp, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function DashboardHome() {
  const [stats, setStats] = useState({ visas: 0, enquiries: 0, blogs: 0, countries: 0, subscribers: 0, newEnquiries: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [visas, enquiries, newEnquiries, blogs, countries, subscribers] = await Promise.all([
      supabase.from("visas").select("id", { count: "exact", head: true }),
      supabase.from("enquiries").select("id", { count: "exact", head: true }),
      supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      supabase.from("countries").select("id", { count: "exact", head: true }),
      supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
    ]);
    setStats({
      visas: visas.count || 0,
      enquiries: enquiries.count || 0,
      newEnquiries: newEnquiries.count || 0,
      blogs: blogs.count || 0,
      countries: countries.count || 0,
      subscribers: subscribers.count || 0,
    });
  };

  const statCards = [
    { icon: Plane, label: "Total Visas", value: stats.visas, color: "text-blue-500", bg: "bg-blue-500/10", href: "/admin/dashboard/visas" },
    { icon: MessageSquare, label: "New Enquiries", value: stats.newEnquiries, color: "text-amber-500", bg: "bg-amber-500/10", href: "/admin/dashboard/enquiries" },
    { icon: Mail, label: "Subscribers", value: stats.subscribers, color: "text-green-500", bg: "bg-green-500/10", href: "/admin/dashboard/newsletter" },
    { icon: FileText, label: "Blog Posts", value: stats.blogs, color: "text-purple-500", bg: "bg-purple-500/10", href: "/admin/dashboard/blog" },
    { icon: Globe, label: "Countries", value: stats.countries, color: "text-orange-500", bg: "bg-orange-500/10", href: "/admin/dashboard/countries" },
    { icon: TrendingUp, label: "Total Enquiries", value: stats.enquiries, color: "text-cyan-500", bg: "bg-cyan-500/10", href: "/admin/dashboard/enquiries" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {statCards.map((stat) => (
          <Link 
            key={stat.label} 
            to={stat.href}
            className="bg-card border rounded-xl p-5 hover:border-accent/50 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/admin/dashboard/visas" className="p-4 bg-card border rounded-lg hover:border-accent/50 transition-colors text-center">
            <Plane className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
            <span className="text-sm font-medium">Add New Visa</span>
          </Link>
          <Link to="/admin/dashboard/blog" className="p-4 bg-card border rounded-lg hover:border-accent/50 transition-colors text-center">
            <FileText className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
            <span className="text-sm font-medium">Write Blog Post</span>
          </Link>
          <Link to="/admin/dashboard/countries" className="p-4 bg-card border rounded-lg hover:border-accent/50 transition-colors text-center">
            <Globe className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
            <span className="text-sm font-medium">Add Country</span>
          </Link>
          <Link to="/admin/dashboard/settings" className="p-4 bg-card border rounded-lg hover:border-accent/50 transition-colors text-center">
            <Mail className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
            <span className="text-sm font-medium">Update Contact</span>
          </Link>
        </div>
      </div>
    </div>
  );
}