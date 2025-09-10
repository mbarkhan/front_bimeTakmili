"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import { Home, Shield, Lock, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  activePattern: RegExp;
}

export function SidebarMenu({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
   /* {
      name: "صفحه اصلی",
      href: "/user/dashboard",
      icon: <Home className="h-5 w-5" />,
      activePattern: /^\/user(\/dashboard)?$/,
    },*/
    {
      name: "ثبت‌نام بیمه تکمیلی",
      href: "/user/insurance",
      icon: <Shield className="h-5 w-5" />,
      activePattern: /^\/user(\/dashboard)?$/,
    },
    {
      name: "تغییر رمز عبور",
      href: "/user/changepass",
      icon: <Lock className="h-5 w-5" />,
      activePattern: /^\/user\/changepass/,
    },
  ];

  const isActive = (pattern: RegExp) => pattern.test(pathname);
  const username = typeof window !== 'undefined' ? localStorage.getItem("user") || "کاربر" : "کاربر";
  const personelCode = typeof window !== 'undefined' ? localStorage.getItem("personelCode") || "" : "";

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.sidebar-menu')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={cn("sidebar-menu", className)}>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 right-4 z-50 bg-white shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative inset-y-0 right-0 w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0",
          "flex flex-col h-screen"
        )}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <img 
                src="/logo.png" 
                alt="لوگو" 
                className="h-16 w-auto object-contain"
              />
            
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">بستن منو</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
           
            <div>
              <p className="font-medium text-gray-900">{username}</p>
              {personelCode && (
                <p className="text-xs text-gray-500">کد پرسنلی: {personelCode}</p>
              )}
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  isActive(item.activePattern)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => setIsOpen(false)}
              >
                <span className="ml-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t">
          <Link
            href="/login"
            className="flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            onClick={() => {
              localStorage.clear();
              setIsOpen(false);
            }}
          >
            <LogOut className="h-5 w-5 ml-3" />
            خروج از حساب کاربری
          </Link>
        </div>
      </aside>
    </div>
  );
}
