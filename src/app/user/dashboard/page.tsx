"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { RegList } from "@/type/user";
import { motion, AnimatePresence } from "framer-motion";

export default function RegListByUserPage() {
  const [records, setRecords] = useState<RegList[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchRecords = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // اگر توکن وجود نداشت، به صفحه لاگین منتقل شود
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register/mylist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      setRecords(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("خطا در واکشی اطلاعات:", error);
      alert("خطا در دریافت اطلاعات ثبت‌نام.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold border-b pb-2 text-blue-700">ثبت‌نام بیمه تکمیلی من</h2>

      <Card className="shadow-md">
        <CardContent className="overflow-x-auto">
          {loading ? (
            <p className="p-4 animate-pulse text-gray-500">در حال بارگذاری...</p>
          ) : records.length === 0 ? (
            <p className="p-4 text-red-600">رکوردی یافت نشد.</p>
          ) : (
            <table className="min-w-full text-sm border mt-4">
              <thead className="bg-blue-100 text-blue-900">
                <tr>
                  <th className="border p-2">کد پرسنلی</th>
                  <th className="border p-2">نام</th>
                  <th className="border p-2">نام خانوادگی</th>
                  <th className="border p-2">کد ملی</th>
                  <th className="border p-2">شرکت</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {records.map((r, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="border p-2">{r.userPcode}</td>
                      <td className="border p-2">{r.name}</td>
                      <td className="border p-2">{r.family}</td>
                      <td className="border p-2">{r.nationalCode}</td>
                      <td className="border p-2">{r.companyName}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
