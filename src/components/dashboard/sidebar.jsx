"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CreditCard,
  DollarSign,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Quote,
  User2Icon,
  ClipboardList 
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLogout } from "@/hooks/useLogout";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Book Management",
    href: "/books",
    icon: BookOpen,
    hasSubmenu: true,
    defaultSub: "/books/add",
    submenu: [
      { href: "/books/add", label: "Add New" },
      { href: "/books/all", label: "All Books" },
      { href: "/books/category", label: "Category" },
        ], 
      },
      { name: "All Users", href: "/users", icon: Users },
      { name: "User Preference", href: "/user-preference", icon: User2Icon }, 
      {
        name: "Create Order",
        href: "/create-order",
        icon: ClipboardList ,
        hasSubmenu: true,
        defaultSub: "/create-order/createOrderForm",
        submenu: [
      { href: "/create-order/createOrderForm", label: "Create Order Form" },
      { href: "/create-order/createOrderList", label: "Create Order List" },
        ],
      },
      {
        name: "Subscription Management",
        href: "/subscriptions",
        icon: CreditCard,
        hasSubmenu: true,
        defaultSub: "/subscriptions/add",
        submenu: [
      { href: "/subscriptions/add", label: "Add New" },
      { href: "/subscriptions/all", label: "All Subscription" },
        ],
      },
      {
        name: "Testimonials Management",
        href: "/testimonials",
        icon: Quote,
        hasSubmenu: true,
        defaultSub: "/testimonials/addForm",
        submenu: [
      { href: "/testimonials/addForm", label: "Add Testimonials" },
      { href: "/testimonials/all", label: "All Testimonials" },
        ],
      },
      { name: "Payment & Billing", href: "/billing", icon: DollarSign },
      { name: "Settings",
    //  href: "/settings",
      icon: Settings, 
      // hasSubmenu: true
     },
];

export function Sidebar({ isOpen = false }) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState(""); 
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [activeSubmenuLink, setActiveSubmenuLink] = useState("");

   const { logout } = useLogout();

  useEffect(() => {
    let current = navigation.find((item) =>
      item.hasSubmenu ? pathname.startsWith(item.href) : pathname === item.href
    );

    // Handle /dashboard separately
    if (!current && pathname === "/dashboard") {
      current = navigation.find((item) => item.name === "Dashboard");
    }

    if (current) {
      setActiveMenu(current.name);

      if (current.hasSubmenu) {
        setOpenSubmenu(current.name);
        const subItem = current.submenu.find((sub) => pathname === sub.href);
        setActiveSubmenuLink(subItem ? subItem.href : current.defaultSub);
      } else {
        setOpenSubmenu(null);
        setActiveSubmenuLink("");
      }
    } else {
      setActiveMenu("");
      setOpenSubmenu(null);
      setActiveSubmenuLink("");
    }
  }, [pathname]);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-[#FFEFD5] transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      } flex flex-col`}
      aria-hidden={!isOpen}
      style={{ background: "linear-gradient(90deg, #FFFFFF 0%, #FFFBF5 100%)" }}
    >
      {/* Logo */}
      <Link href="/dashboard">
        <div className="flex h-16 items-center gap-2 px-6 flex-shrink-0">
          <span className="text-2xl cursor-pointer w-42 font-bold text-gray-900">
            <img src="/BookMark.png" alt="BookMark Logo" />
          </span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = activeMenu === item.name;
          return (
            <div key={item.name}>
              <button
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-black text-white" : "text-gray-500 cursor-pointer"
                }`}
                onClick={() => {
                  setActiveMenu(item.name);
                  if (item.hasSubmenu) {
                    const newOpen = openSubmenu === item.name ? null : item.name;
                    setOpenSubmenu(newOpen);
                    if (newOpen) {
                      setActiveSubmenuLink(item.defaultSub);
                      router.push(item.defaultSub);
                    }
                  } else {
                    setActiveSubmenuLink("");
                    setOpenSubmenu(null);
                    router.push(item.href);
                  }
                }}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1 text-left">{item.name}</span>
                {item.hasSubmenu && (
                  <ChevronDown
                    className={`h-4 w-4 opacity-50 transition-transform ${
                      openSubmenu === item.name ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Submenus */}
              {item.hasSubmenu && openSubmenu === item.name && (
                <div className="ml-6 mt-1 flex flex-col gap-1">
                  {item.submenu.map((sub) => {
                    const isSubActive = activeSubmenuLink === sub.href;
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`flex items-center gap-2 block rounded-md px-3 py-2 text-sm transition-colors ${
                          isSubActive ? "text-black" : "text-gray-500"
                        }`}
                        onClick={() => setActiveSubmenuLink(sub.href)}
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 0.5C4.10999 0.5 3.23996 0.763921 2.49994 1.25839C1.75991 1.75285 1.18314 2.45566 0.842544 3.27792C0.50195 4.10019 0.412835 5.00499 0.586468 5.87791C0.760102 6.75082 1.18869 7.55264 1.81802 8.18198C2.44736 8.81132 3.24918 9.2399 4.1221 9.41353C4.99501 9.58717 5.89981 9.49805 6.72208 9.15746C7.54434 8.81686 8.24715 8.24009 8.74162 7.50007C9.23608 6.76005 9.5 5.89002 9.5 5C9.5 3.80653 9.0259 2.66193 8.18198 1.81802C7.33807 0.974106 6.19348 0.5 5 0.5ZM5 6.125C4.7775 6.125 4.55999 6.05902 4.37499 5.9354C4.18998 5.81179 4.04579 5.63609 3.96064 5.43052C3.87549 5.22495 3.85321 4.99875 3.89662 4.78052C3.94003 4.56229 4.04717 4.36184 4.20451 4.2045C4.36184 4.04717 4.5623 3.94002 4.78053 3.89662C4.99875 3.85321 5.22495 3.87549 5.43052 3.96064C5.63609 4.04578 5.81179 4.18998 5.93541 4.37498C6.05902 4.55999 6.125 4.7775 6.125 5C6.125 5.29837 6.00647 5.58452 5.7955 5.79549C5.58452 6.00647 5.29837 6.125 5 6.125Z"
                            fill="#1F1E1E"
                          />
                        </svg>
                        <span>{sub.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Buttons */}
      <div className="flex-shrink-0 p-4 space-y-1">
        {/* <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
          <HelpCircle className="h-5 w-5" />
          Support
        </button> */}
         <button
      onClick={logout}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
    >
      <LogOut className="h-5 w-5" />
      Logout
    </button>
      </div>
    </aside>
  );
}

