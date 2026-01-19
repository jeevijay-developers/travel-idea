import { useState, useEffect } from "react";
import { Plane, MessageSquare, FileText, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function DashboardHome() {
  const [stats, setStats] = useState({ visas: 0, enquiries: 0, blogs: 0, countries: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [visas, enquiries, blogs, countries] = await Promise.all([
      supabase.from("visas").select("id", { count: "exact", head: true }),
      supabase.from("enquiries").select("id", { count: "exact", head: true }),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      supabase.from("countries").select("id", { count: "exact", head: true }),
    ]);
    setStats({
      visas: visas.count || 0,
      enquiries: enquiries.count || 0,
      blogs: blogs.count || 0,
      countries: countries.count || 0,
    });
  };

  const statCards = [
    { icon: Plane, label: "Total Visas", value: stats.visas, color: "text-blue-500" },
    { icon: MessageSquare, label: "Enquiries", value: stats.enquiries, color: "text-green-500" },
    { icon: FileText, label: "Blog Posts", value: stats.blogs, color: "text-purple-500" },
    { icon: Globe, label: "Countries", value: stats.countries, color: "text-orange-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-card border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}