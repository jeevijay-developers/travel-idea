import { useState, useEffect } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Plane, FolderOpen, Globe, FileText, MessageSquare, LogOut, Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import logoWhite from "@/assets/logo-white.png";

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
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/admin");
      } else if (!isAdmin) {
        // User is authenticated but not an admin
        navigate("/admin?error=not_authorized");
      }
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/admin");
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="animate-pulse text-primary-foreground">Loading...</div>
      </div>
    );
  }

  // Show unauthorized message if authenticated but not admin
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <SEO title="Access Denied - Travel Idea" />
        <div className="bg-card border rounded-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have admin privileges. Please contact the administrator if you believe this is an error.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={handleLogout} variant="outline">
              Sign Out
            </Button>
            <Link to="/">
              <Button variant="ghost" className="w-full">
                Back to Website
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Don't render dashboard content if not authorized
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <SEO title="Admin Dashboard - Travel Idea" />
      
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-primary">
        <img src={logoWhite} alt="Travel Idea" className="h-8" />
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
            <img src={logoWhite} alt="Travel Idea" className="h-10" />
          </div>
          
          {/* User info */}
          <div className="px-4 py-2 border-b border-primary-foreground/10 mb-4">
            <p className="text-xs text-primary-foreground/50">Logged in as</p>
            <p className="text-sm text-primary-foreground truncate">{user.email}</p>
          </div>
          
          <nav className="px-4 space-y-1">
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
            <Button 
              variant="ghost" 
              className="w-full justify-start text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10" 
              onClick={handleLogout}
            >
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
