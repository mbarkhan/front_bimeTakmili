"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RegList } from "@/type/user";

export default function RegListByUserPage() {
  const [pcode, setPcode] = useState("");
  const [records, setRecords] = useState<RegList[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    if (!pcode) {
      alert("کد پرسنلی را وارد کنید");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/reglist/user/${pcode}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      if (!res.ok) throw new Error("خطا در دریافت داده");
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error(error);
      alert("خطا در بارگذاری داده‌ها");
    } finally {
      setLoading(false);
    }
    console.log(records)
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">لیست رکوردهای کاربر</h1>

      <div className="flex gap-4">
        <Input
          placeholder="کد پرسنلی..."
          value={pcode}
          onChange={(e) => setPcode(e.target.value)}
        />
        <Button onClick={fetchRecords} disabled={loading}>
          {loading ? "در حال جستجو..." : "جستجو"}
        </Button>
      </div>

      <Card>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <p className="p-4">در حال بارگذاری...</p>
          ) : records.length === 0 ? (
            <p className="p-4">رکوردی یافت نشد</p>
          ) : (
            <table className="min-w-full text-sm border mt-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">کد پرسنلی</th>
                  <th className="border p-2">نام</th>
                  <th className="border p-2">نام خانوادگی</th>
                  <th className="border p-2">کد ملی</th>
                  <th className="border p-2">شرکت</th>
                  {/* بقیه فیلدهای reglist را هم می‌توان اضافه کرد */}
                </tr>
              </thead>
              <tbody>
                {records.map((r, idx) => (
                  <tr key={idx}>
                    <td className="border p-2">{r.userPcode}</td>
                    <td className="border p-2">{r.name}</td>
                    <td className="border p-2">{r.family}</td>
                    <td className="border p-2">{r.nationalCode}</td>
                    <td className="border p-2">{r.companyName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
