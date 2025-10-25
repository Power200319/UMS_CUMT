import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Calendar,
  ClipboardCheck,
  FileText,
  Bell,
  MessageSquare,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/student", icon: LayoutDashboard },
  { title: "Profile", url: "/student/profile", icon: User },
  { title: "Schedule", url: "/student/schedule", icon: Calendar },
  { title: "Attendance", url: "/student/attendance", icon: ClipboardCheck },
  { title: "Result", url: "/student/result", icon: FileText },
  { title: "Announcement", url: "/student/announcement", icon: Bell },
  { title: "Feedback", url: "/student/feedback", icon: MessageSquare },
];

export const StudentSidebar = () => {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent>
        <div className="px-4 py-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
              <User className="h-6 w-6 text-sidebar-primary-foreground" />
            </div>
            {open && (
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">Student Portal</h2>
                <p className="text-xs text-sidebar-foreground/70">CUMT UMS</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/student"}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                        )
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};