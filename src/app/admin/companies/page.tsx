"use client";

import { companyTypes } from "@/types/regTypes";
import { Edit2, Edit3, FileEdit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type Company = {
  id: number;
  comType: number;
  name: string;
  description: string;
  active: boolean;
};

export default function CompanyListPage() {
  const [comType, setComType] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchCompanies = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/company`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    const data = await res.json();
    const sortedData = [...data].sort((a, b) => a.id - b.id);
    setCompanies(sortedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comType || !name) {
      setError("نوع شرکت و نام شرکت الزامی است.");
      return;
    }

    setError("");
    const token = localStorage.getItem("token");
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/company/${editingId}`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/company`;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        comType: Number(comType),
        name,
        description,
        active,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "خطا در ذخیره‌سازی.");
      return;
    }

    const updatedCompany = await res.json();

    if (editingId) {
      setCompanies((prev) =>
        prev.map((c) => (c.id === editingId ? updatedCompany : c))
      );
    } else {
      setCompanies((prev) => [...prev, updatedCompany]);
    }

    setComType("");
    setName("");
    setDescription("");
    setActive(true);
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("آیا از حذف این شرکت مطمئن هستید؟")) return;

    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/company/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (res.ok) {
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert("خطا در حذف شرکت.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md mt-10" dir="rtl">
      <h2 className="text-lg font-bold mb-6 text-center text-gray-700">
         مدیریت فهرست شرکت ها
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            نوع شرکت <span className="text-red-500">*</span>
          </label>
          <select
            value={comType}
            onChange={(e) => setComType(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">انتخاب کنید</option>
            <option value="1">قراردادی - مدت معین</option>
            <option value="2">تأمین نیرو</option>
            <option value="3">پیمانکار حجمی</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            نام شرکت <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثلاً پتروشیمی مهاباد"
            className="w-full border px-4 py-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">شرح</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full border px-4 py-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="flex items-center gap-2 md:col-span-2">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label className="text-gray-700">فعال</label>
        </div>

        {error && <p className="text-red-600 text-sm md:col-span-2">{error}</p>}

        <div className="flex justify-center md:col-span-2">
          <button
            type="submit"
            className="flex w-44 justify-center bg-blue-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition"
          >
            {editingId ? "ویرایش " : "ثبت"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setComType("");
                setName("");
                setDescription("");
                setActive(true);
              }}
              className="flex w-44 justify-center bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition "
            >
              انصراف
            </button>
          )}
        </div>
      </form>

      <h3 className="text-xl font-semibold mb-4">فهرست شرکت‌ها</h3>

      {loading ? (
        <p className="text-center text-gray-500">در حال بارگذاری...</p>
      ) : companies.length === 0 ? (
        <p className="text-gray-600">هیچ شرکتی ثبت نشده است.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-right border border-gray-300">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">شناسه</th>
                <th className="px-4 py-2 border">نام شرکت</th>
                <th className="px-4 py-2 border">نوع</th>
                <th className="px-4 py-2 border">شرح</th>
                <th className="px-4 py-2 border">وضعیت</th>
                <th className="px-4 py-2 border">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c, i) => (
                <tr key={c.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border">{c.id}</td>
                  <td className="px-4 py-2 border font-semibold">{c.name}</td>
                  <td className="px-4 py-2 border">{companyTypes[c.comType]}</td>
                  <td className="px-4 py-2 border">{c.description || "-"}</td>
                  <td className="px-4 py-2 border">
                    <span className={`px-2 py-1 text-xs rounded ${
                      c.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
                    }`}>
                      {c.active ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td className="px-4 py-2 border space-x-2 space-x-reverse">
                    <button
                      onClick={() => {
                        setEditingId(c.id);
                        setComType(c.comType.toString());
                        setName(c.name);
                        setDescription(c.description || "");
                        setActive(c.active);
                      }}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      <FileEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                     <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
