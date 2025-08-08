'use client';

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "@/context/AuthContext"; // Import the useAuth hook

import {
  ChevronDownIcon,
  GridIcon,
  ListIcon,
  PieChartIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons/index";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// --- Role-Specific Navigation Items ---

const pharmacyNavItems: NavItem[] = [
  {
    icon: <ListIcon />,
    name: "Request Medicine",
    path: "/dashboard/request-medicine",
  },
  {
    icon: <ListIcon />,
    name: "My Requests",
    path: "/dashboard/my-requests",
  },
  {
    icon: <TableIcon />,
    name: "My Orders",
    path: "/dashboard/orders",
  }
];

const providerNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Open Requests",
    path: "/dashboard/requests",
  },
  {
    icon: <TableIcon />,
    name: "My Sales",
    path: "/dashboard/sales",
  }
];

// --- NEW: Admin Navigation Items ---
const adminNavItems: NavItem[] = [
    {
        icon: <PieChartIcon />,
        name: "Admin Dashboard",
        path: "/dashboard",
    },
    {
        icon: <UserCircleIcon />,
        name: "User Management",
        path: "/dashboard/users",
    },
    {
        icon: <TableIcon />,
        name: "All Orders",
        path: "/dashboard/admin/orders",
    },
    {
        icon: <ListIcon />,
        name: "Medicine Management",
        path: "/dashboard/medicines",
    },
];


const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { profile, loading } = useAuth();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) => (prev?.type === menuType && prev.index === index ? null : { type: menuType, index }));
  };

  useEffect(() => {
    if (openSubmenu) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      const el = subMenuRefs.current[key];
      if (el) {
        setSubMenuHeight((p) => ({ ...p, [key]: el.scrollHeight }));
      }
    }
  }, [openSubmenu]);

  useEffect(() => {
    let matched = false;
    // This effect is now only relevant for submenus, which only admins might have in future
    const checkItems = (items: NavItem[], type: "main" | "others") => {
        items.forEach((nav, index) => {
            if (nav.subItems?.some(sub => isActive(sub.path))) {
                setOpenSubmenu({ type, index });
                matched = true;
            }
        });
    };
    if (profile?.role === 'Admin') { // Example if admins get submenus
        checkItems(adminNavItems, "main");
    }
    if (!matched) setOpenSubmenu(null);
  }, [pathname, isActive, profile]);

  const renderMenuItems = (navItems: NavItem[]) => {
    // Define shared menu item classes for consistency
    const baseMenuItem = "flex items-center gap-3 p-3 rounded-lg transition-colors duration-200";
    const inactiveMenuItem = "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white";
    const activeMenuItem = "bg-[#08d9b3]/10 text-[#08d9b3] font-semibold";

    return (
        <ul className="flex flex-col gap-2">
            {navItems.map((nav, index) => (
                <li key={nav.name}>
                    {nav.subItems ? (
                        <button
                            onClick={() => handleSubmenuToggle(index, "main")}
                            className={`w-full ${baseMenuItem} ${openSubmenu?.index === index ? activeMenuItem : inactiveMenuItem}`}
                        >
                            <span className="w-6 h-6">{nav.icon}</span>
                            {(isExpanded || isHovered || isMobileOpen) && <span className="flex-grow text-left">{nav.name}</span>}
                            {(isExpanded || isHovered || isMobileOpen) && <ChevronDownIcon className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.index === index ? "rotate-180" : ""}`} />}
                        </button>
                    ) : (
                        nav.path && (
                            <Link href={nav.path} className={`${baseMenuItem} ${isActive(nav.path) ? activeMenuItem : inactiveMenuItem}`}>
                                <span className="w-6 h-6">{nav.icon}</span>
                                {(isExpanded || isHovered || isMobileOpen) && <span>{nav.name}</span>}
                            </Link>
                        )
                    )}
                    {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                        <div
                            ref={(el) => { subMenuRefs.current[`main-${index}`] = el; }}
                            className="overflow-hidden transition-all duration-300"
                            style={{ height: openSubmenu?.type === 'main' && openSubmenu.index === index ? `${subMenuHeight[`main-${index}`]}px` : "0px" }}
                        >
                            <ul className="mt-2 space-y-1 pl-9">
                                {nav.subItems.map((subItem) => (
                                    <li key={subItem.name}>
                                        <Link href={subItem.path} className={`block px-4 py-2 text-sm rounded-md transition-colors ${isActive(subItem.path) ? "text-[#08d9b3] font-medium" : "text-gray-500 hover:text-[#08d9b3] dark:text-gray-400 dark:hover:text-[#08d9b3]"}`}>
                                            {subItem.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
};
  
  const renderSidebarContent = () => {
    if (loading) return <div className="p-4 text-center text-gray-400">Loading...</div>;

    switch (profile?.role) {
      case 'Admin':
        return renderMenuItems(adminNavItems);
      case 'Pharmacy':
        return renderMenuItems(pharmacyNavItems);
      case 'Provider':
        return renderMenuItems(providerNavItems);
      default:
        // You might want a fallback for users who are logged in but have no role
        return <div className="p-4 text-center text-gray-400">No navigation items available.</div>;
    }
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-4 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"} ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image className="dark:hidden" src="/images/logo/logo.svg" alt="Logo" width={150} height={40} onError={(e) => e.currentTarget.src = 'https://placehold.co/150x40/000000/FFFFFF?text=Logo'} />
              <Image className="hidden dark:block" src="/images/logo/logo.svg" alt="Logo" width={150} height={40} onError={(e) => e.currentTarget.src = 'https://placehold.co/150x40/FFFFFF/000000?text=Logo'}/>
            </>
          ) : (
            <Image src="/images/logo/auth-logo.svg" alt="Logo" width={32} height={32} onError={(e) => e.currentTarget.src = 'https://placehold.co/32x32/000000/FFFFFF?text=L'}/>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
            {renderSidebarContent()}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
