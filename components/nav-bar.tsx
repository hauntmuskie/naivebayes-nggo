"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  BarChart3,
  BookOpen,
  History,
  Users,
  FileText,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import GapuraAngkasaLogo from "@/public/gapura_angkasa.png";

const navItems = [
  {
    href: "/admin/dashboard",
    label: "Dasbor",
    icon: <LayoutDashboard size={18} className="text-blue-500" />,
    description: "Gambaran & wawasan",
    color: "text-blue-500",
    hoverColor: "group-hover:text-blue-400",
  },
  {
    href: "/admin/models",
    label: "Latih Model",
    icon: <Database size={18} className="text-green-500" />,
    description: "Buat & kelola model",
    color: "text-green-500",
    hoverColor: "group-hover:text-green-400",
    subItems: [
      {
        href: "/admin/models/catalog",
        label: "Katalog",
        icon: <BookOpen size={16} />,
        description: "Jelajahi model",
      },
    ],
  },
  {
    href: "/admin/classify",
    label: "Klasifikasi Data",
    icon: <BarChart3 size={18} className="text-purple-500" />,
    description: "Buat prediksi",
    color: "text-purple-500",
    hoverColor: "group-hover:text-purple-400",
    subItems: [
      {
        href: "/admin/classify/history",
        label: "Riwayat",
        icon: <History size={16} />,
        description: "Lihat klasifikasi sebelumnya",
      },
    ],
  },
  {
    href: "/admin/passengers",
    label: "Data Penumpang",
    icon: <Users size={18} className="text-orange-500" />,
    description: "Kelola data sampel",
    color: "text-orange-500",
    hoverColor: "group-hover:text-orange-400",
  },
  {
    href: "/admin/reports",
    label: "Laporan",
    icon: <FileText size={18} className="text-emerald-500" />,
    description: "Laporan analisis",
    color: "text-emerald-500",
    hoverColor: "group-hover:text-emerald-400",
  },
];

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    // Clear the auth session cookie
    document.cookie =
      "auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    toast.success("Logout berhasil!", {
      description: "Anda telah keluar dari sistem",
    });

    router.push("/login");
    router.refresh();
  };

  const isClient = typeof window !== "undefined";
  const currentPath = isClient && mounted ? pathname || "/" : "/";
  return (
    <>
      <nav
        className={`no-print hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border z-50 transition-opacity duration-200 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        style={{ visibility: mounted ? "visible" : "hidden" }}
      >
        <div className="p-6 border-b border-sidebar-border">
          <Link
            href="/admin/dashboard"
            className="flex justify-center rounded-2xl items-center gap-3"
          >
            <Image
              src={GapuraAngkasaLogo}
              alt="Gapura Angkasa Logo"
              width={120}
              height={120}
              priority
              className="object-cover p-2"
            />
          </Link>
        </div>
        <div className="flex-1 p-4 space-y-2">
          <div className="mb-4">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-3">
              Navigasi
            </div>
            {navItems.map((item) => {
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isActive = hasSubItems
                ? currentPath.startsWith(item.href) &&
                  currentPath !== "/admin" &&
                  item.href !== "/admin"
                : currentPath === item.href;
              const showSubItems =
                hasSubItems &&
                currentPath.startsWith(item.href) &&
                currentPath !== "/admin" &&
                item.href !== "/admin";

              return (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <div
                      className={`transition-colors ${
                        isActive
                          ? item.color
                          : `text-muted-foreground ${item.hoverColor}`
                      }`}
                    >
                      {React.cloneElement(item.icon, {
                        className: isActive
                          ? item.color
                          : `text-muted-foreground ${item.hoverColor} transition-colors`,
                      })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </div>
                    </div>
                    {isActive && (
                      <div className="h-2 w-2 bg-primary rounded-full" />
                    )}
                  </Link>
                  {showSubItems && (
                    <div className="ml-6 mt-2 space-y-1 border-l border-sidebar-border pl-4">
                      {item.subItems!.map((subItem) => {
                        const isSubActive = currentPath === subItem.href;
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={`group flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200 text-sm ${
                              isSubActive
                                ? "bg-sidebar-accent/70 text-sidebar-accent-foreground"
                                : "text-muted-foreground hover:bg-sidebar-accent/30 hover:text-sidebar-accent-foreground"
                            }`}
                          >
                            <div className="text-muted-foreground">
                              {subItem.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium">
                                {subItem.label}
                              </div>
                              <div className="text-xs text-muted-foreground/80 truncate">
                                {subItem.description}
                              </div>
                            </div>
                            {isSubActive && (
                              <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-4 border-t border-sidebar-border">
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Keluar
          </Button>
          <div className="text-xs text-muted-foreground mt-2 opacity-70">
            {new Date().getFullYear()} • Gapura Angkasa
          </div>
        </div>
      </nav>
      <nav
        className={`lg:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border z-40 transition-opacity duration-200 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        style={{ visibility: mounted ? "visible" : "hidden" }}
      >
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isActive = hasSubItems
              ? currentPath.startsWith(item.href) &&
                currentPath !== "/admin" &&
                item.href !== "/admin"
              : currentPath === item.href;
            const isRootPage = currentPath === item.href;

            return (
              <div key={item.href} className="flex flex-col items-center">
                <Link
                  href={item.href}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? item.color
                      : `text-muted-foreground ${item.hoverColor}`
                  }`}
                >
                  <div className="transition-colors">
                    {React.cloneElement(item.icon, {
                      className: isActive
                        ? item.color
                        : `text-muted-foreground ${item.hoverColor} transition-colors`,
                    })}
                  </div>
                  <span className="text-xs font-medium">
                    {item.label.split(" ")[0]}
                  </span>
                  {isActive && (
                    <div className="h-1 w-6 bg-primary rounded-full" />
                  )}
                </Link>
                {hasSubItems && isRootPage && (
                  <div className="absolute bottom-16 bg-sidebar border border-sidebar-border rounded-lg shadow-lg p-2 min-w-32 left-1/2 transform -translate-x-1/2">
                    {item.subItems!.map((subItem) => {
                      const isSubActive = currentPath === subItem.href;
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-xs whitespace-nowrap ${
                            isSubActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-muted-foreground hover:bg-sidebar-accent/50"
                          }`}
                        >
                          {subItem.icon}
                          {subItem.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
}
