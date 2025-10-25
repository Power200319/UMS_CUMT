import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StudentSidebar } from "./StudentSidebar";
import { StudentNavbar } from "./StudentNavbar";

interface StudentLayoutProps {
  children: ReactNode;
}

export const StudentLayout = ({ children }: StudentLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <StudentSidebar />

        <div className="flex-1 flex flex-col w-full">
          <StudentNavbar />

          <main className="flex-1 p-6 lg:p-8 animate-fade-in">
            {children}
          </main>

        </div>
      </div>
    </SidebarProvider>
  );
};