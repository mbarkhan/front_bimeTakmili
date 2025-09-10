"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { RegList } from "@/types/user";
import { motion, AnimatePresence } from "framer-motion";
import {
  genders,
  marriedStatus,
  relations,
  relianceStatus,
  basicInsurance,
  bankNames,
  preInsurance,
} from "@/types/regTypes";
import { Pencil, Trash2 } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { mapValues } from "lodash";

type AnyReg = RegList;

const mapValue = (arr: { key: number; name: string }[] | undefined, key: number | undefined) => {
  if (!arr) return "";
  if (key === undefined || key === null) return "";
  const found = arr.find((i) => i.key === Number(key));
  return found ? found.name : String(key);
};

export default function RegListByUserPage() {
  const [records, setRecords] = useState<AnyReg[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState<AnyReg | null>(null);
  const router = useRouter();

  const getId = (r: AnyReg) =>
    (r as any).ID ?? (r as any).id ?? (r as any).Id ?? undefined;

  const fetchRecords = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setLoading(true);
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register/mylist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      const arr: AnyReg[] = Array.isArray(data) ? data : [data];
      setRecords(arr);
    } catch (error) {
      console.error("خطا در واکشی اطلاعات:", error);
      alert("خطا در دریافت اطلاعات ثبت‌نام.");
    } finally {
      setLoading(false);
    }
  };

  const [companies, setCompanies] = useState<{ id: number; name: string }[]>([]);
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/company`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        if (!res.ok) throw new Error("خطا در دریافت لیست شرکت‌ها");
        const data = await res.json();
        setCompanies(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: number | undefined, name: string, family: string) => {
    if (id == null) {
      alert("این رکورد شناسه حذف ندارد.");
      return;
    }
    if (!confirm(`آیا از حذف "${name} ${family}" مطمئن هستید؟`)) return;
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register/del/${id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!res.ok) throw new Error("خطا در حذف رکورد");
      setRecords((prev) => prev.filter((r) => getId(r) !== id));
    } catch (error) {
      console.error(error);
      alert("حذف انجام نشد");
    }
  };

  const mainInsured = records.filter((r) => Number(r.familyRelation) === 1);
  const familyMembers = records.filter((r) => Number(r.familyRelation) !== 1);

  const openEditModal = (r: AnyReg) => {
    setEditingRecord({ ...r });
  };

  const handleSubmit = async () => {
    if (!editingRecord) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const id = getId(editingRecord);
    if (!id) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(editingRecord),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "خطا در ویرایش رکورد");
      }
      setRecords((prev) => prev.map((p) => (getId(p) === id ? editingRecord : p)));
      setEditingRecord(null);
    } catch (err) {
      console.error(err);
      alert("خطا در ویرایش رکورد: " + String(err));
    }
  };

  const handleCreate = async (record: AnyReg) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(record),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "خطا در ثبت رکورد جدید");
      }
      const created = await res.json();
      setRecords((prev) => [...prev, created]);
      setEditingRecord(null);
      alert("رکورد جدید با موفقیت ثبت شد.");
    } catch (err) {
      console.error(err);
      alert("خطا در ثبت رکورد جدید: " + String(err));
    }
  };

  const EditModal = editingRecord && (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto p-6">
        <h3 className="text-lg font-semibold mb-6 text-center">
          {getId(editingRecord) ? "ویرایش" : "ایجاد جدید"}: {editingRecord.name}{" "}
          {editingRecord.family}
        </h3>
        {/* اینجا فیلدهای فرم ویرایش باقی می‌مونه */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 rounded border"
            onClick={() => setEditingRecord(null)}
          >
            انصراف
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white"
            onClick={() => {
              if (!editingRecord) return;
              const id = getId(editingRecord);
              if (id) {
                handleSubmit();
              } else {
                handleCreate(editingRecord);
              }
            }}
          >
            ثبت
          </button>
        </div>
      </div>
    </div>
  );

  const renderMainTable = (data: AnyReg[]) => (
    <div dir="rtl" className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-6">
      <table className="min-w-full items-center text-sm divide-y divide-gray-300">
        <thead className="bg-gradient-to-r from-green-600 to-green-900 text-white">
          <tr>
            <th className="px-4 py-3">نام</th>
            <th className="px-4 py-3">نام خانوادگی</th>
            <th className="px-4 py-3">نام پدر</th>
            <th className="px-4 py-3">کد ملی</th>
            <th className="px-4 py-3">تاریخ تولد</th>
            <th className="px-4 py-3">جنسیت</th>
            <th className="px-4 py-3">وضعیت تأهل</th>
            <th className="px-4 py-3">موبایل</th>
            <th className="px-4 py-3">تاریخ استخدام</th>
            <th className="px-4 py-3 w-20">بیمه پایه</th>
            <th className="px-4 py-3">شماره بیمه</th>
            <th className="px-4 py-3">بانک</th>
            <th className="px-4 py-3">شماره حساب</th>
            <th className="px-4 py-3">شبا</th>
            <th className="px-4 py-3">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, idx) => (
            <tr  key={getId(r) ?? idx}>
              <td className="px-4 py-3">{r.name}</td>
              <td className="px-4 py-3">{r.family}</td>
              <td className="px-4 py-3">{r.fatherName}</td>
              <td className="px-4 py-3">{r.nationalCode}</td>
              <td className="px-4 py-3">{r.birthDate}</td>
              <td className="px-4 py-3">{mapValue(genders, r.gender)}</td>
              <td className="px-4 py-3">{mapValue(marriedStatus, r.marriedStatus)}</td>
              <td className="px-4 py-3">{r.mobileNum}</td>
              <td className="px-4 py-3">{r.empDate}</td>
              <td className="px-4 py-3 w-20">{mapValue(basicInsurance, r.basicInsurance)}</td>
              <td className="px-4 py-3">{r.insuranceCode}</td>
              <td className="px-4 py-3">{mapValue(bankNames,r.bankCode)}</td>
              <td className="px-4 py-3">{r.bankAccount}</td>
              <td className="px-4 py-3">{r.shaba}</td>
              <td className="px-4 py-3">
                <button
                  className="p-1.5 text-blue-500 hover:text-blue-700"
                  onClick={() => openEditModal(r)}
                >
                  <Pencil size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderFamilyTable = (data: AnyReg[]) => (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-6">
      <table className="min-w-full text-sm divide-y divide-gray-200" style={{ direction: "rtl" }}>
        <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <tr>
            <th className="px-4 py-3">نام</th>
            <th className="px-4 py-3">نام خانوادگی</th>
            <th className="px-4 py-3">نام پدر</th>
            <th className="px-4 py-3">کد ملی</th>
            <th className="px-4 py-3">تاریخ تولد</th>
            <th className="px-4 py-3">جنسیت</th>
            <th className="px-4 py-3">تأهل</th>
            <th className="px-4 py-3">نسبت</th>
            <th className="px-4 py-3">وضعیت تکفل</th>
            <th className="px-4 py-3 w-20">بیمه پایه</th>
            <th className="px-4 py-3">شماره بیمه</th>
            <th className="px-4 py-3">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {data.map((r, idx) => (
              <motion.tr
                key={getId(r) ?? idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">{r.family}</td>
                <td className="px-4 py-3">{r.fatherName}</td>
                <td className="px-4 py-3">{r.nationalCode}</td>
                <td className="px-4 py-3">{r.birthDate}</td>
                <td className="px-4 py-3">{mapValue(genders,r.gender)}</td>
                <td className="px-4 py-3">{mapValue(marriedStatus, r.marriedStatus)}</td>
                <td className="px-4 py-3">{mapValue(relations, r.familyRelation)}</td>
                <td className="px-4 py-3">{mapValue(relianceStatus, r.relStatus)}</td>
                <td className="px-4 py-3">{mapValue(basicInsurance, r.basicInsurance)}</td>
                <td className="px-4 py-3">{r.insuranceCode}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    className="p-1.5 text-blue-500 hover:text-blue-700"
                    onClick={() => openEditModal(r)}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    className="p-1.5 text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(getId(r), r.name, r.family)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-blue-700">ثبت‌نام بیمه تکمیلی من</h2>

      {/* جدول بیمه‌شده اصلی */}
      {mainInsured.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-green-700 mb-3">بیمه‌شده اصلی</h3>
          <Card className="shadow-sm border border-gray-100">
            <CardContent className="p-0 overflow-x-auto">
              {renderMainTable(mainInsured)}
            </CardContent>
          </Card>
        </div>
      )}

      {/* جدول اعضای خانواده */}
      {familyMembers.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-blue-700 mb-3">اعضای خانواده</h3>
          <Card className="shadow-sm border border-gray-100">
            <CardContent className="p-0 overflow-x-auto">
              {renderFamilyTable(familyMembers)}
            </CardContent>
          </Card>
        </div>
      )}

      {/* مودال ویرایش */}
      {EditModal}
    </div>
  );
}
