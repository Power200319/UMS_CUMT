import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { AdminNavbar } from "./AdminNavbar";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col w-full">
          <AdminNavbar />
          
          <main className="flex-1 p-6 lg:p-8 animate-fade-in">
            {children}
          </main>
          
          <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
            © 2025 Education Admin System. All rights reserved.
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};
