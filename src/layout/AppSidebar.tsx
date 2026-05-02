import React, { useCallback, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ShoppingBag,
  Store,
  TrendingUp,
  Truck,
  Users,
  Trash2,
} from "lucide-react";
import { LuSquareDashedKanban } from "react-icons/lu";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../lib/AuthProvider";
import { ROLES } from "../routes/ProtectedRoute";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  roles?: string[];
  subItems?: {
    name: string;
    path: string;
    icon?: React.ReactNode;
  }[];
};

const navItems: NavItem[] = [
  {
    name: "Shop",
    icon: <ShoppingBag size={22} />,
    path: "/shop",
  },
   {
    name: "Dealer Shop Details",
    icon: <Store size={22} />,
    path: "/dealer-shop-details",
  },
  {
    name: "Shop Trash",
    icon: <Trash2 size={22} />,
    path: "/shop-trash",
  },
  {
    name: "Admin Management",
    icon: <Users size={22} />,
    path: "/admin-management",
    roles: [ROLES.SUPER_ADMIN],
  },
 
  {
    name: "Profit / Commission",
    icon: <TrendingUp size={22} />,
    path: "/profit-commission",
  },
  {
    name: "Delivery Cost",
    icon: <Truck size={22} />,
    path: "/delivery-cost",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, setMobileOpen, isHovered, setIsHovered } =
    useSidebar();
  const { role } = useAuth();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname],
  );

  const handleMobileClick = () => {
    if (window.innerWidth < 1024) {
      setMobileOpen(false);
    }
  };

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(role || "");
  });

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-100 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed mt-16 lg:mt-0 top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-100 
        ${isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          to="/"
          className="p-6 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-blue-950 rounded-lg flex items-center rotate-180 justify-center text-white font-bold">
            <LuSquareDashedKanban size={24} />
          </div>
          {(isExpanded || isHovered || isMobileOpen) && (
            <span className="font-bold text-xl dark:text-white">
              AdminPanel
            </span>
          )}
        </Link>

        <nav className="px-4 py-4 overflow-y-auto h-[calc(100vh-100px)] no-scrollbar">
          <ul className="flex flex-col gap-2">
            {filteredNavItems.map((item) => (
              <li key={item.name}>
                {item.subItems ? (
                  <>
                    <button
                      onClick={() =>
                        setOpenSubmenu(
                          openSubmenu === item.name ? null : item.name,
                        )
                      }
                      className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
                        openSubmenu === item.name
                          ? "bg-blue-200 text-blue-600"
                          : "text-gray-500 hover:bg-blue-100"
                      }`}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      {(isExpanded || isHovered || isMobileOpen) && (
                        <>
                          <span className="flex-1 text-left font-medium">
                            {item.name}
                          </span>
                          <span className="text-xs transition-transform duration-200">
                            {openSubmenu === item.name ? "▲" : "▼"}
                          </span>
                        </>
                      )}
                    </button>

                    {openSubmenu === item.name &&
                      (isExpanded || isHovered || isMobileOpen) && (
                        <ul className="pl-12 mt-1 space-y-1">
                          {item.subItems.map((sub) => (
                            <li key={sub.name}>
                              <Link
                                to={sub.path}
                                onClick={handleMobileClick}
                                className={`flex items-center gap-3 p-2 text-sm rounded-lg transition-colors ${
                                  isActive(sub.path)
                                    ? "text-blue-600 font-semibold"
                                    : "text-gray-400 hover:text-gray-600"
                                }`}
                              >
                                {sub.icon && (
                                  <span className="shrink-0">{sub.icon}</span>
                                )}
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                  </>
                ) : (
                  <Link
                    to={item.path || "#"}
                    onClick={handleMobileClick}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                      isActive(item.path || "")
                        ? "bg-blue-950 text-white"
                        : "text-gray-500 hover:bg-blue-100"
                    }`}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AppSidebar;
