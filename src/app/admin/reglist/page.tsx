"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RegList, Company } from "@/types/user";
import * as XLSX from "xlsx";
import { BASE_URL } from "@/lib/api"

export default function RegisterListPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [records, setRecords] = useState<RegList[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState<string>("");

  // refs برای اسکرول بالا/پایین و خود جدول
  const topScrollRef = useRef<HTMLDivElement>(null);
  const bottomScrollRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const [topWidth, setTopWidth] = useState<number>(0);
  const syncing = useRef(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/register/admin`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : [data]);
      console.log(data);
    } catch (error) {
      console.error("خطا در بارگذاری اطلاعات:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!confirm("آیا از بارگذاری داده‌ها مطمئن هستید؟")) return;
    //if (!confirm("با بارگذاری داده‌ها کلیه داده‌های قبلی حذف می‌شوند. ادامه می‌دهید؟")) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BASE_URL}/register/uploadlist`, {
        method: "POST",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
        body: formData,
      });
      const result = await res.json();
      alert(result.message);
      fetchRecords();
    } catch (error) {
      alert("خطا در آپلود فایل" + error);
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleExportExcel = () => {
    const mappedRecords = records.map((r) => ({
      "کد پرسنلی": r.userPcode,
      "نام": r.name,
      "نام خانوادگی": r.family,
      "نام پدر": r.fatherName,
      "تاریخ تولد": r.birthDate,
      "جنسیت": r.gender,
      "وضعیت تاهل": r.marriedStatus,
      "کد ملی": r.nationalCode,
      "شماره شناسنامه": r.shenasname,
      "تلفن": r.phoneNum,
      "همراه": r.mobileNum,
      "نسبت": r.familyRelation,
      "تکفل": r.relStatus,
      "کد گروه": r.empGroupCode,
      "تاریخ استخدام": r.empDate,
      "بیمه پایه": r.basicInsurance,
      "کد بیمه": r.insuranceCode,
      "کد بانک": r.bankCode,
      "شماره حساب": r.bankAccount,
      "شبا": r.shaba,
      "نوع حساب": r.bankAccountTp,
      "صاحب حساب": r.bankAccountOwner,
      "کد پرسنلی اصلی": r.mainPersonelCode,
      "کد ملی اصلی": r.mainNationalCode,
      "علت درخواست": r.requestReason,
      "نوع استخدام": r.empType,
      "بیمه قبلی": r.preInsurance,
      "تعداد ماه پوشش": r.coverMonths,
      "شرکت": r.companyName,
    }));

    const ws = XLSX.utils.json_to_sheet(mappedRecords);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "لیست ثبت‌نام");
    XLSX.writeFile(wb, "register_list.xlsx");
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // محاسبه‌ی عرض واقعی جدول و سینک اسکرول‌ها
  useLayoutEffect(() => {
    const top = topScrollRef.current;
    const bottom = bottomScrollRef.current;
    const table = tableRef.current;
    if (!top || !bottom || !table) return;

    const updateWidths = () => {
      // عرض اسکرول‌پذیر جدول
      const width = table.scrollWidth;
      setTopWidth(width);
      // هم‌تراز کردن موقعیت اسکرول بالا با پایین
      top.scrollLeft = bottom.scrollLeft;
    };

    updateWidths();

    const ro = new ResizeObserver(updateWidths);
    ro.observe(table);

    const onTopScroll = () => {
      if (!top || !bottom) return;
      if (syncing.current) return;
      syncing.current = true;
      bottom.scrollLeft = top.scrollLeft;
      syncing.current = false;
    };

    const onBottomScroll = () => {
      if (!top || !bottom) return;
      if (syncing.current) return;
      syncing.current = true;
      top.scrollLeft = bottom.scrollLeft;
      syncing.current = false;
    };

    top.addEventListener("scroll", onTopScroll, { passive: true });
    bottom.addEventListener("scroll", onBottomScroll, { passive: true });
    window.addEventListener("resize", updateWidths);

    return () => {
      ro.disconnect();
      top.removeEventListener("scroll", onTopScroll);
      bottom.removeEventListener("scroll", onBottomScroll);
      window.removeEventListener("resize", updateWidths);
    };
  }, [records]);

  // فیلتر؛ (عین قبل نگه داشتم تا رفتار فعلی‌تون تغییر نکنه)
  const filteredRecords = records.filter(
    (r) =>
      (r.name?.toLowerCase().includes(search.toLowerCase()) || "") &&
      (r.family?.toLowerCase().includes(search.toLowerCase()) || "") &&
      (r.nationalCode?.toLowerCase().includes(search.toLowerCase()) || "") &&
      (r.mobileNum?.toLowerCase().includes(search.toLowerCase()) || "") &&
      (r.companyName?.toLowerCase().includes(companyFilter.toLowerCase()) || "")
  );

  const uniqueCompanies = Array.from(new Set(records.map((r) => r.companyName)));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">فهرست ثبت‌نام بیمه تکمیلی</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <Input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <Button className="bg-cyan-300 hover:bg-cyan-500 text-black" onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? "در حال آپلود..." : "آپلود فایل CSV"}
        </Button>
        <Button className="bg-lime-300 hover:bg-lime-600 text-black" onClick={handleExportExcel}>خروجی Excel</Button>
      </div>
      
      <div className="flex gap-4">
      <Input
        className="flex w-1/4" placeholder="جستجو در اطلاعات..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className="flex w-1/4 border p-2 rounded"
        value={companyFilter}
        onChange={(e) => setCompanyFilter(e.target.value)}
      >
        <option value="">همه شرکت‌ها</option>
        {uniqueCompanies.map((companyName, idx) => (
          <option key={idx} value={companyName}>
            {companyName}
          </option>
        ))}
      </select>

      <p className="text-sm text-gray-600 mt-2">تعداد رکوردها: {filteredRecords.length}</p>
      </div>

      <Card>
        {/* نوار اسکرول افقی بالا (dir=ltr برای رفتار درست در RTL) */}
        <div
          ref={topScrollRef}
          className="overflow-x-auto"
          style={{ height: 16, direction: "ltr" }}
          aria-hidden="true"
        >
          <div style={{ width: topWidth, height: 1 }} />
        </div>

        {/* جدول با اسکرول افقی پایین */}
        <CardContent
          ref={bottomScrollRef}
          className="overflow-x-auto"
          style={{ direction: "ltr" }}
        >
          {loading ? (
            <p className="p-4">در حال بارگذاری اطلاعات...</p>
          ) : filteredRecords.length === 0 ? (
            <p className="p-4">هیچ اطلاعاتی وجود ندارد</p>
          ) : (
            <table ref={tableRef} className="min-w-full text-sm border mt-4" style={{ direction: "rtl" }}>
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">کد پرسنلی</th>
                  <th className="border p-2">نام</th>
                  <th className="border p-2">نام خانوادگی</th>
                  <th className="border p-2">نام پدر</th>
                  <th className="border p-2">تاریخ تولد</th>
                  <th className="border p-2">جنسیت</th>
                  <th className="border p-2">وضعیت تاهل</th>
                  <th className="border p-2">کد ملی</th>
                  <th className="border p-2">شماره شناسنامه</th>
                  <th className="border p-2">تلفن</th>
                  <th className="border p-2">همراه</th>
                  <th className="border p-2">نسبت</th>
                  <th className="border p-2">تکفل</th>
                  <th className="border p-2">کد گروه</th>
                  <th className="border p-2">تاریخ استخدام</th>
                  <th className="border p-2">بیمه پایه</th>
                  <th className="border p-2">کد بیمه</th>
                  <th className="border p-2">کد بانک</th>
                  <th className="border p-2">شماره حساب</th>
                  <th className="border p-2">شبا</th>
                  <th className="border p-2">نوع حساب</th>
                  <th className="border p-2">صاحب حساب</th>
                  <th className="border p-2">کد پرسنلی اصلی</th>
                  <th className="border p-2">کد ملی اصلی</th>
                  <th className="border p-2">علت درخواست</th>
                  <th className="border p-2">نوع استخدام</th>
                  <th className="border p-2">بیمه قبلی</th>
                  <th className="border p-2">تعداد ماه پوشش</th>
                  <th className="border p-2">شرکت</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((r, idx) => (
                  <tr key={idx}>
                    <td className="border p-2">{r.userPcode}</td>
                    <td className="border p-2">{r.name}</td>
                    <td className="border p-2">{r.family}</td>
                    <td className="border p-2">{r.fatherName}</td>
                    <td className="border p-2">{r.birthDate}</td>
                    <td className="border p-2">{r.gender}</td>
                    <td className="border p-2">{r.marriedStatus}</td>
                    <td className="border p-2">{r.nationalCode}</td>
                    <td className="border p-2">{r.shenasname}</td>
                    <td className="border p-2">{r.phoneNum}</td>
                    <td className="border p-2">{r.mobileNum}</td>
                    <td className="border p-2">{r.familyRelation}</td>
                    <td className="border p-2">{r.relStatus}</td>
                    <td className="border p-2">{r.empGroupCode}</td>
                    <td className="border p-2">{r.empDate}</td>
                    <td className="border p-2">{r.basicInsurance}</td>
                    <td className="border p-2">{r.insuranceCode}</td>
                    <td className="border p-2">{r.bankCode}</td>
                    <td className="border p-2">{r.bankAccount}</td>
                    <td className="border p-2">{r.shaba}</td>
                    <td className="border p-2">{r.bankAccountTp}</td>
                    <td className="border p-2">{r.bankAccountOwner}</td>
                    <td className="border p-2">{r.mainPersonelCode}</td>
                    <td className="border p-2">{r.mainNationalCode}</td>
                    <td className="border p-2">{r.requestReason}</td>
                    <td className="border p-2">{r.empType}</td>
                    <td className="border p-2">{r.preInsurance}</td>
                    <td className="border p-2">{r.coverMonths}</td>
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
