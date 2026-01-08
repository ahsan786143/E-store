import React from "react";
import AppSidebar from "@/components/admin/AppSideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Topbar from "@/components/admin/Topbar";
import { ThemeProvider } from "@/components/admin/ThemeProvider";

const Layout = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar />
        <div className="md:w-[calc(100vw-16rem)] w-full border-2">
          <div className="pt-[70px] px-8 min-h-[calc(100vh-40px)] pb-10">
            <Topbar />
            {children}
          </div>
          <div className="border-t h-20 flex items-center justify-center bg-gray-50 dark:bg-background text-sm">
            © 2025 E-store — All rights reserved
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Layout;
