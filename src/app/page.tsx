"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      const target = role === "1" ? "/admin/dashboard" : "/user/dashboard";
      router.push(target);
    }
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col justify-between items-center bg-gray-100 py-6"
      dir="rtl"
    >
      <div className="flex flex-col justify-center items-center flex-grow">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-8 text-center">
          سامانه خدمات اداری و رفاهی شرکت پتروشیمی مهاباد
        </h1>

        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition text-lg font-semibold"
        >
          ورود
        </button>
      </div>

      {/* Footer */}
      <footer className="text-gray-600 text-sm mt-6">
        طراحی و اجرا: واحد سرمایه انسانی شرکت پتروشیمی مهاباد
      </footer>
    </div>
  );
}
