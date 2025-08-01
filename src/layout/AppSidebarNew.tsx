"use client";
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

  const renderMenuItems = (navItems: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, "main")}
              className={`menu-item group w-full ${openSubmenu?.index === index ? "menu-item-active" : "menu-item-inactive"} ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
            >
              <span className={`${openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>{nav.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              {(isExpanded || isHovered || isMobileOpen) && <ChevronDownIcon className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""}`} />}
            </button>
          ) : (
            nav.path && (
              <Link href={nav.path} className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}>
                <span className={`${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => { subMenuRefs.current[`main-${index}`] = el; }}
              className="overflow-hidden transition-all duration-300"
              style={{ height: openSubmenu?.index === index ? `${subMenuHeight[`main-${index}`]}px` : "0px" }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link href={subItem.path} className={`menu-dropdown-item ${isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}>
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
  
  const renderSidebarContent = () => {
    if (loading) return <div className="p-4 text-gray-400">Loading...</div>;

    if (profile?.role === 'Admin') {
        return renderMenuItems(adminNavItems);
    }
    if (profile?.role === 'Pharmacy') {
        return renderMenuItems(pharmacyNavItems);
    }
    if (profile?.role === 'Provider') {
        return renderMenuItems(providerNavItems);
    }

    // Return null or an empty fragment if not logged in or role not matched
    return null;
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"} ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image className="dark:hidden" src="/images/logo/logo.svg" alt="Logo" width={150} height={40} onError={(e) => e.currentTarget.src = 'https://placehold.co/150x40/000000/FFFFFF?text=Logo'} />
              <Image className="hidden dark:block" src="/images/logo/logo-dark.svg" alt="Logo" width={150} height={40} onError={(e) => e.currentTarget.src = 'https://placehold.co/150x40/FFFFFF/000000?text=Logo'}/>
            </>
          ) : (
            <Image src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} onError={(e) => e.currentTarget.src = 'https://placehold.co/32x32/000000/FFFFFF?text=L'}/>
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
