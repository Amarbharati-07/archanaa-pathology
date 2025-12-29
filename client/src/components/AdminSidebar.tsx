import { Calendar, Home, Inbox, Search, Settings, Users, BookOpen, CheckCircle2, Clock, Plus, BarChart3, UserCheck, FileText, Microscope, Package, Settings2, LayoutDashboard, MessageSquare } from "lucide-react";
import { useLocation, Link } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Patients", url: "/admin/patients", icon: UserCheck },
  { title: "Walk-in Collections", url: "/admin/walk-in", icon: Microscope },
  { title: "Reports", url: "/admin/reports", icon: FileText },
  { title: "Tests", url: "/admin/tests", icon: Microscope },
  { title: "Health Packages", url: "/admin/packages", icon: Package },
  { title: "Lab Settings", url: "/admin/settings", icon: Settings2 },
  { title: "Bookings", url: "/admin/bookings", icon: BookOpen },
  { title: "Advertisements", url: "/admin/ads", icon: BarChart3 },
  { title: "Reviews", url: "/admin/reviews", icon: MessageSquare },
];

export function AdminSidebar() {
  const [location] = useLocation();
  const { logout, admin } = useAuth();

  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Microscope className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-900">Archana Pathology</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    className="hover:bg-blue-50 hover:text-blue-600 px-4 py-2 transition-colors"
                  >
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex flex-col gap-2">
          <div className="px-2 py-1">
            <p className="text-xs text-slate-500">Logged in as:</p>
            <p className="text-sm font-semibold text-slate-900 truncate">{admin?.name || "Admin User"}</p>
          </div>
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50 h-9"
          >
            <Settings className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
