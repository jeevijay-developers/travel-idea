import { useState, useEffect } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Plane, FolderOpen, Globe, FileText, MessageSquare, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Plane, label: "Visas", path: "/admin/dashboard/visas" },
  { icon: FolderOpen, label: "Categories", path: "/admin/dashboard/categories" },
  { icon: Globe, label: "Countries", path: "/admin/dashboard/countries" },
  { icon: FileText, label: "Blog Posts", path: "/admin/dashboard/blog" },
  { icon: MessageSquare, label: "Enquiries", path: "/admin/dashboard/enquiries" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("admin_authenticated") !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <SEO title="Admin Dashboard - Travel Idea" />
      
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-primary">
        <img src={logo} alt="Travel Idea" className="h-8" />
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="text-primary-foreground">
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-primary transform transition-transform lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-6 hidden lg:block">
            <img src={logo} alt="Travel Idea" className="h-10" />
          </div>
          <nav className="px-4 py-6 lg:py-0 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors",
                  location.pathname === item.path && "bg-primary-foreground/10 text-primary-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <Button variant="ghost" className="w-full justify-start text-primary-foreground/70 hover:text-primary-foreground" onClick={handleLogout}>
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8 min-h-screen">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}