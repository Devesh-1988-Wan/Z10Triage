// src/components/ui/sidebar.tsx

import React, { createContext, useContext } from 'react';
import { Home, LayoutDashboard, Settings } from 'lucide-react';
import { cn } from "@/lib/utils"

// Create a context for the sidebar state
const SidebarContext = createContext<{ collapsed: boolean }>({ collapsed: false });

// Custom hook to use the sidebar context
export const useSidebar = () => useContext(SidebarContext);

// SidebarProvider component to wrap the sidebar and provide context
export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
    // In a real application, you might want to manage the collapsed state here
    const [collapsed, setCollapsed] = React.useState(false); 
    return (
        <SidebarContext.Provider value={{ collapsed }}>
            {children}
        </SidebarContext.Provider>
    );
};


// Main Sidebar component
export const Sidebar = ({ children }: { children: React.ReactNode }) => {
    const { collapsed } = useSidebar();
    return (
        <aside className={cn("h-full", { "w-64": !collapsed, "w-16": collapsed })}>
            <nav className="h-full flex flex-col border-r shadow-sm">
                {children}
            </nav>
        </aside>
    );
};

export const SidebarHeader = ({ children }: { children: React.ReactNode }) => {
    const { collapsed } = useSidebar();
    return (
        <div className={cn("p-4 pb-2 flex justify-between items-center", { "px-2": collapsed })}>
            <div className={cn("flex items-center gap-2", { "w-full": !collapsed })}>
                {children}
            </div>
        </div>
    );
};


export const SidebarContent = ({ children }: { children: React.ReactNode }) => {
    return <div className="flex-1 px-3">{children}</div>;
};

export const SidebarFooter = ({ children }: { children: React.ReactNode }) => {
    return <div className="border-t flex p-3">{children}</div>;
};

export const SidebarMenu = ({ children }: { children: React.ReactNode }) => {
    return <ul className="flex-1 px-3">{children}</ul>
};

export const SidebarMenuItem = ({ children }: { children: React.ReactNode }) => {
    return <li className="relative">{children}</li>
};

export const SidebarMenuButton = ({ children, href, isActive }: { children: React.ReactNode, href: string, isActive?: boolean }) => {
    const { collapsed } = useSidebar();
    return (
        <a href={href} className={cn(
            "flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group",
            {
                "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800": isActive,
                "hover:bg-indigo-50 text-gray-600": !isActive
            }
        )}>
            {children}
            {!collapsed && <span className="ml-3">{ (children as React.ReactElement[])[1] }</span>}
        </a>
    )
};


export const SidebarComponent: React.FC = () => {
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-lg">Z10</span>
                        </div>
                        <span className="font-semibold">Z10 Triage</span>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton href="/" isActive>
                                <Home />
                                Home
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton href="/dashboard">
                                <LayoutDashboard />
                                Dashboard
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton href="#">
                                <Settings />
                                Settings
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </SidebarProvider>
    );
};