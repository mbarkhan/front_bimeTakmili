"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const username  =localStorage.getItem("user");

    if (!token || role !== "1") {
      router.push("/login");
    } else {
      setUsername(username || ' کاربر');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-right">
      <header className="flex justify-between items-center bg-white shadow px-6 py-4">
        <h1 className="text-xl font-bold">پنل مدیریت</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">{username}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg"
          >
            خروج
          </button>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
