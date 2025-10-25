import { ReactNode } from "react";
import { LecturerNavbar } from "./LecturerNavbar";
import { LecturerSidebar } from "./LecturerSidebar";

interface LecturerLayoutProps {
  children: ReactNode;
}

export const LecturerLayout = ({ children }: LecturerLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <LecturerNavbar />

      <div className="flex">
        <LecturerSidebar />

        <main className="flex-1 lg:ml-64 p-6 lg:p-8 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};