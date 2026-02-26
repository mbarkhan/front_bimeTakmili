"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BASE_URL } from "@/lib/api";
import { Menu, LogOut, User, Shield, Lock, X, ShieldPlus, HelpCircle } from "lucide-react";
import clsx from "clsx";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [username, setUsername] = useState("کاربر");
  const [personelCode, setPersonelCode] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("user");
    const code = localStorage.getItem("personelCode");

    if (!token) {
      router.push("/login");
    } else {
      setUsername(name || "کاربر");
      setPersonelCode(code || "");
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top bar */}
      <div className="flex justify-between items-center bg-white shadow p-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-blue-600 hover:text-blue-800"
        >
          <Menu size={28} />
        </button>
        <h1 className="font-bold text-lime-600 text-center flex-1 text-xl">
          سامانه خدمات اداری و رفاهی سرمایه انسانی
        </h1>
      </div>

      {/* Sidebar Modal */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 flex"
          onClick={() => setSidebarOpen(false)}
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50" />

          {/* Sidebar content */}
          <aside
            className={clsx(
              "bg-white shadow-md w-72 h-full z-50 transition-transform duration-300 ease-in-out",
              "fixed right-0 top-0 transform",
              sidebarOpen ? "translate-x-0" : "translate-x-full",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 space-y-6 h-full flex flex-col justify-between">
              <div>
                {/* Close Button */}
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-4 left-4 text-gray-600 hover:text-gray-800"
                >
                  <X size={22} />
                </button>

                {/* User Info */}
                <div className="text-center border-b pb-4">
                  <img
                    src="/images/logo.png"
                    alt="لوگو"
                    className="w-20 h-20 mx-auto mb-2"
                  />
                  <User className="mx-auto mb-1 text-blue-500" />
                  <p className="font-semibold">{username}</p>
                  {personelCode && (
                    <p className="text-sm text-gray-500">
                      کد پرسنلی: {personelCode}
                    </p>
                  )}
                </div>

                {/* Menu */}
                <nav className="space-y-2 mt-6">
                  <button
                    onClick={() => setSubMenuOpen(!subMenuOpen)}
                    className="flex items-center justify-between w-full text-gray-700 hover:bg-gray-200 p-2 rounded-md"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldPlus size={18} className="text-green-600" />
                      بیمه تکمیلی درمان
                    </span>
                    {subMenuOpen ? "▲" : "▼"}
                  </button>
                  {/* زیرمنو */}
                  {subMenuOpen && (
                    <div className="mr-6 mt-1 space-y-2">
                  <Link
                    href="/user/dashboard"
                    className="flex items-center gap-2 text-gray-700 hover:bg-gray-200 p-2 rounded-md"
                  >
                    <Shield size={18} className="text-blue-600" />
                    ثبت‌نام
                  </Link>

                   <Link
                    href={`${BASE_URL}/uploads/bime_reg_guide.pdf`}
                    className="flex items-center gap-2 text-gray-700 hover:bg-gray-200 p-2 rounded-md"
                  >
                    <HelpCircle size={18} className="text-purple-600" />
                    راهنمای ثبت نام
                  </Link>

                    </div>
                  )}

                  <Link
                    href="/user/chngpass"
                    className="flex items-center gap-2 text-gray-700 hover:bg-gray-200 p-2 rounded-md"
                  >
                    <Lock size={18} className="text-yellow-800" />
                    تغییر رمز عبور
                  </Link>
                </nav>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 hover:bg-red-100 p-2 rounded-md"
              >
                <LogOut size={18} />
                خروج
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
