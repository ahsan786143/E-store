"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,

  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { IoMdClose } from "react-icons/io";
import { adminAppSidebarMenu } from "@/lib/adminSidebarMenu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

const AppSideBar = () => {
       const {toggleSidebar} = useSidebar()

  return (
    <Sidebar className="bg-black text-white z-50">
      {/* --- Sidebar Header --- */}
      <SidebarHeader className="border-b h-14 p-0" >
        <div className="flex  justify-between items-center px-4">
          {/* Light Logo */}
          <img
            src="/assets/images/logo-black.png"
            width="150"
            height="150"
            alt="Logo dark"
            className="max-w-[100px] block dark:hidden"
          />

          {/* Dark Logo */}
          <img
            src="/assets/images/logo-white.png"
            width="150"
            height="150"
            alt="Logo light"
            className="max-w-[100px] hidden dark:block"
          />
       

        {/* Close Button (visible only on mobile) */}
        <Button
          onClick={toggleSidebar}
          type="button"
          size="icon"
          className="md:hidden hover: cursor-pointer my-3"
        >
          <IoMdClose className="text-xl" />
        </Button>
         </div>
      </SidebarHeader >

      {/* --- Sidebar Content --- */}
      <SidebarContent className="p-3" >
        <SidebarMenu className="text-black">
          {adminAppSidebarMenu.map((menu, index) => (
  <Collapsible key={index} className="group/collapsible">
    <SidebarMenuItem>
     <CollapsibleTrigger asChild>
  <SidebarMenuButton asChild className="font-semibold px-2 py-5 w-full text-left">
    <button type="button" className="flex items-center w-full">
      <Link href={menu.url || "#"}>
      <div className="flex items-center gap-3 "> <menu.icon />
      {menu.title}</div>
       
    
         </Link>
      {menu.submenu?.length > 0 && (
        <LuChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
      )}
      
    </button>
  </SidebarMenuButton>
</CollapsibleTrigger>


      {/* Submenu section */}
      {menu.submenu && menu.submenu.length > 0 && (
        <CollapsibleContent>
          <SidebarMenuSub>
            {menu.submenu.map((submenuItem, subIndex) => (
              <SidebarMenuSubItem key={subIndex}>
                <SidebarMenuSubButton asChild className="font-semibold px-2 py-5">
                  <Link href={submenuItem.url || "#"}>
                    <span>{submenuItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      )}
     

    </SidebarMenuItem>
  </Collapsible>
))}


        </SidebarMenu>
      </SidebarContent>

      {/* --- Sidebar Footer --- */}
      <SidebarFooter className="p-4 border-t border-gray-700">
        <p className="text-sm text-gray-400">© 2025 E-Store</p>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSideBar;
