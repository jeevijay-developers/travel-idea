import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Plane, MessageSquare, FileText, Globe, Mail, TrendingUp, ArrowRight, 
  Users, Clock, CheckCircle, AlertCircle, BarChart3, Calendar, 
  Zap, Eye, PenLine, Plus, ChevronRight, Sparkles, Phone, XCircle, UserCheck
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface RecentEnquiry {
  id: string;
  name: string;
  email: string;
  destination: string | null;
  status: string;
  created_at: string;
}

interface RecentBlog {
  id: string;
  title: string;
  is_published: boolean;
  created_at: string;
}

interface TopVisa {
  id: string;
  title: string;
  country_name: string;
  enquiry_count: number;
}

interface HandlerStat {
  user_id: string;
  email: string;
  pending: number;
  contacted: number;
  closed: number;
  lost: number;
  total: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function DashboardHome() {
  const [stats, setStats] = useState({ 
    visas: 0, 
    enquiries: 0, 
    blogs: 0, 
    countries: 0, 
    subscribers: 0, 
    newEnquiries: 0,
    publishedBlogs: 0,
    featuredVisas: 0,
    resolvedEnquiries: 0
  });
  const [recentEnquiries, setRecentEnquiries] = useState<RecentEnquiry[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<RecentBlog[]>([]);
  const [enquiryTrend, setEnquiryTrend] = useState<{date: string; count: number}[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<{name: string; value: number; color: string}[]>([]);
  const [handlerStats, setHandlerStats] = useState<HandlerStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchRecentEnquiries(), fetchRecentBlogs(), fetchEnquiryTrend(), fetchHandlerStats()]);
    setLoading(false);
  };

  const fetchStats = async () => {
    const [visas, enquiries, newEnquiries, resolvedEnquiries, blogs, publishedBlogs, countries, subscribers, featuredVisas] = await Promise.all([
      supabase.from("visas").select("id", { count: "exact", head: true }),
      supabase.from("enquiries").select("id", { count: "exact", head: true }),
      supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "resolved"),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("countries").select("id", { count: "exact", head: true }),
      supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
      supabase.from("visas").select("id", { count: "exact", head: true }).eq("is_featured", true),
    ]);
    
    setStats({
      visas: visas.count || 0,
      enquiries: enquiries.count || 0,
      newEnquiries: newEnquiries.count || 0,
      resolvedEnquiries: resolvedEnquiries.count || 0,
      blogs: blogs.count || 0,
      publishedBlogs: publishedBlogs.count || 0,
      countries: countries.count || 0,
      subscribers: subscribers.count || 0,
      featuredVisas: featuredVisas.count || 0,
    });

    // Status distribution for pie chart
    const newCount = newEnquiries.count || 0;
    const contactedCount = (enquiries.count || 0) - (newEnquiries.count || 0) - (resolvedEnquiries.count || 0);
    const resolved = resolvedEnquiries.count || 0;
    
    setStatusDistribution([
      { name: "New", value: newCount, color: "#3b82f6" },
      { name: "Contacted", value: Math.max(0, contactedCount), color: "#f59e0b" },
      { name: "Resolved", value: resolved, color: "#22c55e" },
    ]);
  };

  const fetchRecentEnquiries = async () => {
    const { data } = await supabase
      .from("enquiries")
      .select("id, name, email, destination, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    if (data) setRecentEnquiries(data);
  };

  const fetchRecentBlogs = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, is_published, created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    if (data) setRecentBlogs(data);
  };

  const fetchEnquiryTrend = async () => {
    const { data } = await supabase
      .from("enquiries")
      .select("created_at")
      .order("created_at", { ascending: true });
    
    if (data) {
      // Group by date
      const grouped: Record<string, number> = {};
      data.forEach((e) => {
        const date = new Date(e.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        grouped[date] = (grouped[date] || 0) + 1;
      });
      
      // Get last 7 days
      const last7Days = Object.entries(grouped).slice(-7).map(([date, count]) => ({ date, count }));
      setEnquiryTrend(last7Days.length > 0 ? last7Days : [{ date: "Today", count: 0 }]);
    }
  };

  const fetchHandlerStats = async () => {
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "enquiry_handler");
    
    if (!roleData || roleData.length === 0) {
      setHandlerStats([]);
      return;
    }

    const { data: staffData } = await supabase.functions.invoke("manage-staff", {
      body: { action: "list" },
    });

    const { data: enquiryData } = await supabase
      .from("enquiries")
      .select("assigned_to, status")
      .not("assigned_to", "is", null);

    const handlerIds = new Set(roleData.map(r => r.user_id));
    const emailMap: Record<string, string> = {};
    if (staffData?.staff) {
      staffData.staff.forEach((s: any) => {
        if (handlerIds.has(s.user_id)) {
          emailMap[s.user_id] = s.email;
        }
      });
    }

    const statsMap: Record<string, HandlerStat> = {};
    roleData.forEach(r => {
      statsMap[r.user_id] = {
        user_id: r.user_id,
        email: emailMap[r.user_id] || "Unknown",
        pending: 0, contacted: 0, closed: 0, lost: 0, total: 0,
      };
    });

    if (enquiryData) {
      enquiryData.forEach(e => {
        if (e.assigned_to && statsMap[e.assigned_to]) {
          const stat = statsMap[e.assigned_to];
          stat.total++;
          if (e.status === "pending") stat.pending++;
          else if (e.status === "contacted") stat.contacted++;
          else if (e.status === "closed") stat.closed++;
          else if (e.status === "lost") stat.lost++;
        }
      });
    }

    setHandlerStats(Object.values(statsMap));
  };

  const statCards = [
    { icon: Plane, label: "Total Visas", value: stats.visas, subtext: `${stats.featuredVisas} featured`, color: "text-blue-500", bg: "from-blue-500/20 to-blue-600/5", iconBg: "bg-blue-500", href: "/admin/dashboard/visas" },
    { icon: MessageSquare, label: "New Enquiries", value: stats.newEnquiries, subtext: `${stats.enquiries} total`, color: "text-amber-500", bg: "from-amber-500/20 to-amber-600/5", iconBg: "bg-amber-500", href: "/admin/dashboard/enquiries" },
    { icon: Mail, label: "Subscribers", value: stats.subscribers, subtext: "Newsletter", color: "text-green-500", bg: "from-green-500/20 to-green-600/5", iconBg: "bg-green-500", href: "/admin/dashboard/newsletter" },
    { icon: FileText, label: "Blog Posts", value: stats.blogs, subtext: `${stats.publishedBlogs} published`, color: "text-purple-500", bg: "from-purple-500/20 to-purple-600/5", iconBg: "bg-purple-500", href: "/admin/dashboard/blog" },
    { icon: Globe, label: "Countries", value: stats.countries, subtext: "Active destinations", color: "text-orange-500", bg: "from-orange-500/20 to-orange-600/5", iconBg: "bg-orange-500", href: "/admin/dashboard/countries" },
    { icon: CheckCircle, label: "Resolved", value: stats.resolvedEnquiries, subtext: "Enquiries closed", color: "text-emerald-500", bg: "from-emerald-500/20 to-emerald-600/5", iconBg: "bg-emerald-500", href: "/admin/dashboard/enquiries" },
  ];

  const quickActions = [
    { icon: Plus, label: "Add Visa", desc: "Create new visa service", href: "/admin/dashboard/visas", color: "bg-blue-500" },
    { icon: PenLine, label: "Write Blog", desc: "Create blog post", href: "/admin/dashboard/blog", color: "bg-purple-500" },
    { icon: Globe, label: "Add Country", desc: "New destination", href: "/admin/dashboard/countries", color: "bg-orange-500" },
    { icon: Users, label: "Manage Staff", desc: "Team access", href: "/admin/dashboard/staff", color: "bg-green-500" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new": return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">New</Badge>;
      case "contacted": return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Contacted</Badge>;
      case "resolved": return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Resolved</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with Travel Idea.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, i) => (
          <Link key={stat.label} to={stat.href}>
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`relative overflow-hidden bg-gradient-to-br ${stat.bg} border rounded-2xl p-5 group cursor-pointer transition-all hover:shadow-lg hover:border-accent/50`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm font-medium text-foreground/80">{stat.label}</p>
                    <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-white/5 to-white/0 rounded-full" />
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
        {/* Enquiry Trend Chart */}
        <Card className="lg:col-span-2 border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Enquiry Trend
              </CardTitle>
              <Badge variant="outline" className="text-xs">Last 7 Days</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enquiryTrend}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      background: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Enquiry Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {statusDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                  <span>{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.label} to={action.href}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-card border rounded-xl hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-6">
        {/* Recent Enquiries */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                Recent Enquiries
              </CardTitle>
              <Link to="/admin/dashboard/enquiries">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentEnquiries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No enquiries yet</p>
            ) : (
              recentEnquiries.map((enquiry) => (
                <div key={enquiry.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {enquiry.name?.charAt(0).toUpperCase() || "?"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{enquiry.name}</p>
                      <p className="text-xs text-muted-foreground">{enquiry.destination || enquiry.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(enquiry.status)}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Blogs */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-500" />
                Recent Blog Posts
              </CardTitle>
              <Link to="/admin/dashboard/blog">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentBlogs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No blog posts yet</p>
            ) : (
              recentBlogs.map((blog) => (
                <div key={blog.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{blog.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(blog.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={blog.is_published ? "default" : "secondary"} className="text-xs">
                    {blog.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Enquiry Handler Performance */}
      {handlerStats.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-cyan-500" />
                Enquiry Handler Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {handlerStats.map((handler) => (
                  <div key={handler.user_id} className="p-4 rounded-xl bg-muted/30 border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-cyan-600">{handler.email.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{handler.email}</p>
                        <p className="text-xs text-muted-foreground">{handler.total} total assigned</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="text-center p-2 rounded-lg bg-blue-500/10">
                        <AlertCircle className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                        <p className="text-lg font-bold text-blue-600">{handler.pending}</p>
                        <p className="text-[10px] text-muted-foreground">Pending</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-amber-500/10">
                        <Phone className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                        <p className="text-lg font-bold text-amber-600">{handler.contacted}</p>
                        <p className="text-[10px] text-muted-foreground">Contacted</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-green-500/10">
                        <CheckCircle className="h-4 w-4 text-green-500 mx-auto mb-1" />
                        <p className="text-lg font-bold text-green-600">{handler.closed}</p>
                        <p className="text-[10px] text-muted-foreground">Closed</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-red-500/10">
                        <XCircle className="h-4 w-4 text-red-500 mx-auto mb-1" />
                        <p className="text-lg font-bold text-red-600">{handler.lost}</p>
                        <p className="text-[10px] text-muted-foreground">Lost</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Performance Summary */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-primary/0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Enquiry Resolution Rate</span>
                  <span className="font-medium">
                    {stats.enquiries > 0 ? Math.round((stats.resolvedEnquiries / stats.enquiries) * 100) : 0}%
                  </span>
                </div>
                <Progress value={stats.enquiries > 0 ? (stats.resolvedEnquiries / stats.enquiries) * 100 : 0} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Blog Publishing Rate</span>
                  <span className="font-medium">
                    {stats.blogs > 0 ? Math.round((stats.publishedBlogs / stats.blogs) * 100) : 0}%
                  </span>
                </div>
                <Progress value={stats.blogs > 0 ? (stats.publishedBlogs / stats.blogs) * 100 : 0} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Featured Visas</span>
                  <span className="font-medium">
                    {stats.visas > 0 ? Math.round((stats.featuredVisas / stats.visas) * 100) : 0}%
                  </span>
                </div>
                <Progress value={stats.visas > 0 ? (stats.featuredVisas / stats.visas) * 100 : 0} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
