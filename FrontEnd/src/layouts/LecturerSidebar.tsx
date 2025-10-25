import { NavLink } from "react-router-dom";
import {
  User,
  FileText,
  Clock,
  BarChart3,
  Calculator,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Profile", url: "/lecturer/profile", icon: User },
  { title: "Teacher Contracts", url: "/lecturer/contracts", icon: FileText },
  { title: "Check In/Out", url: "/lecturer/checkinout", icon: Clock },
  { title: "Teaching Reports", url: "/lecturer/reports", icon: BarChart3 },
  { title: "Score Management", url: "/lecturer/scores", icon: Calculator },
  { title: "Information", url: "/lecturer/information", icon: Info },
];

export const LecturerSidebar = () => {
  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-16">
      <div className="flex flex-col flex-grow bg-white border-r border-blue-100 overflow-y-auto">
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.url === "/lecturer/profile"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="px-4 py-4 border-t border-blue-100 bg-blue-50">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-blue-700">Today's Classes</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-blue-700">Pending Scores</span>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};