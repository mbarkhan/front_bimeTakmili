"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Pencil } from "lucide-react";
import { Company, User } from "@/types/user";
import { BASE_URL } from "@/lib/api"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState<number | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const [editUserId, setEditUserId] = useState<number | null>(null);

  const [newUser, setNewUser] = useState<User>({
    ID: 0,
    personelCode: "",
    name: "",
    family: "",
    mobile: "",
    password: "",
    role: 0,
    companyId: 1,
  });

  const fetchUsers = async (page: number, search: string) => {
    setLoading(true);
    const token = localStorage.getItem("token");

    const query = new URLSearchParams();
    query.set("page", page.toString());
    if (search) query.set("search", search);

    try {
      const res = await fetch(
        `${BASE_URL}/users/upaginated?${query.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setUsers(data.users || data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/company`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    const data = await res.json();
    setCompanies(data);
  };

  const handleDelete = async (user: User) => {
    const token = localStorage.getItem("token");
    if (!confirm(`آیا از حذف ${user.name} ${user.family} مطمئن هستید؟`)) return;

    try {
      const res = await fetch(`${BASE_URL}/users/${user.ID}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (res.ok) {
        fetchUsers(currentPage, searchTerm);
      } else {
        alert("خطا در حذف کاربر");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCSVUpload = async () => {
    if (!csvFile) return;
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", csvFile);

    setUploading(true);
    try {
      const res = await fetch(`${BASE_URL}/users/uploadusers`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      if (!res.ok) {
        alert("خطا در بارگذاری فایل CSV"+ res.text());
        return;
      }

      fetchUsers(currentPage, searchTerm);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateUser = async () => {
    const token = localStorage.getItem("token");
    setCreating(true);

    try {
      const url = `${BASE_URL}/users${editUserId ? `/${editUserId}` : ""}`;

      const method = editUserId ? "PUT" : "POST";
      const finalUser = editUserId ? { ...newUser, ID: editUserId } : newUser;
  console.log("Final user data being sent:", finalUser);
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(finalUser),
      });

      if (res.ok) {
        setNewUser({ ID: 0, personelCode: "", name: "", family: "", mobile: "", password: "", role: 2, companyId: 0 });
        setEditUserId(null);
        fetchUsers(currentPage, searchTerm);
      } else {
        const errorText = await res.text(); // گرفتن متن خطا از پاسخ
        alert("خطا در ذخیره کاربر: " + errorText);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditUserId(user.ID);
    setNewUser({ ...user, password: "" });
  };

  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
    fetchCompanies();
  }, [currentPage, searchTerm]);

  const filteredUsers = Array.isArray(users)
  ? users.filter(
      (u) =>
        (u.personelCode?.includes(searchTerm) || u.name?.includes(searchTerm) || u.family?.includes(searchTerm)) &&
        (companyFilter === "" || u.companyId === companyFilter)
    )
  : [];


  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">مدیریت کاربران</h1>
     
      <div className="flex gap-4">
       <Input className="flex w-80 bg-red-100" placeholder="جستجوی نام یا کد پرسنلی..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
       <select value={companyFilter} onChange={(e) => setCompanyFilter(Number(e.target.value) || "")}
                className="flex border rounded px-3 py-2 bg-red-100">
                <option value="">همه شرکت‌ها</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
       </select>
       <span className="flex text-sm text-gray-500">تعداد: {filteredUsers.length}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <Input className="flex w-1/2 bg-green-100" type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files?.[0] || null)} />
        <Button className="bg-green-100 hover:bg-green-500 text-gray-950"onClick={handleCSVUpload} disabled={!csvFile || uploading}>
          {uploading ? "در حال ارسال..." : "ارسال فایل CSV"}
        </Button>
        
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="text-lg font-semibold">{editUserId ? "ویرایش کاربر" : "افزودن کاربر جدید"}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Input placeholder="کد پرسنلی" value={newUser.personelCode} onChange={(e) => setNewUser({ ...newUser, personelCode: e.target.value })} />
            <Input placeholder="نام" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
            <Input placeholder="نام خانوادگی" value={newUser.family} onChange={(e) => setNewUser({ ...newUser, family: e.target.value })} />
            <Input placeholder="موبایل" value={newUser.mobile} onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })} />
            <Input placeholder="رمز اولیه" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
            <select className="border rounded px-3 py-2 text-sm" value={newUser.companyId} onChange={(e) => setNewUser({ ...newUser, companyId: parseInt(e.target.value) })}>
              <option value={0}>انتخاب شرکت</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select className="border rounded px-3 py-2 text-sm" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: parseInt(e.target.value) })}>
              <option value={2}>کاربر</option>
              <option value={1}>مدیر سیستم</option>
            </select>
          </div>
          <Button onClick={handleCreateUser} disabled={creating}>
            {creating ? "در حال ثبت..." : editUserId ? "ذخیره تغییرات" : "ثبت کاربر"}
          </Button>
{editUserId && (
  <Button
    variant="outline"
    className="ml-2"
    onClick={() => {
      setEditUserId(null);
      setNewUser({
        ID: 0,
        personelCode: "",
        name: "",
        family: "",
        mobile: "",
        password: "",
        role: 2,
        companyId: 0,
      });
    }}
  >
    انصراف
  </Button>
)}


        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">کد پرسنلی</th>
                <th className="p-2 border">نام</th>
                <th className="p-2 border">نام خانوادگی</th>
                <th className="p-2 border">موبایل</th>
                <th className="p-2 border">شرکت</th>
                <th className="p-2 border">نقش</th>
                <th className="p-2 border">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr key="loading">
                  <td colSpan={7} className="text-center p-4">در حال بارگذاری...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr key="empty">
                  <td colSpan={7} className="text-center p-4">هیچ کاربری یافت نشد.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.ID}>
                    <td className="p-2 border">{user.personelCode}</td>
                    <td className="p-2 border">{user.name}</td>
                    <td className="p-2 border">{user.family}</td>
                    <td className="p-2 border">{user.mobile}</td>
                    <td className="p-2 border">{user.company?.name || "—"}</td>
                    <td className="p-2 border">{user.role === 1 ? "ادمین" : "کاربر"}</td>
                    <td className="p-2 border flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(user)} className="text-blue-600 hover:bg-blue-100">
                        <Pencil size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(user)} className="text-red-500 hover:bg-red-100">
                        <Trash2 size={18} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <Button
  className="bg-red-600 hover:bg-red-700 text-white"
  onClick={async () => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید همه کاربران را به جز ادمین حذف کنید؟")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BASE_URL}/users/deleteAll`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (res.ok) {
        alert("همه کاربران به جز ادمین حذف شدند.");
        fetchUsers(currentPage, searchTerm);
      } else {
        const txt = await res.text();
        alert("خطا در حذف کاربران: " + txt);
      }
    } catch (err) {
      console.error(err);
      alert("خطایی رخ داد.");
    }
  }}
>
  حذف همه کاربران (به جز ادمین)
</Button>

      <div className="flex justify-between items-center mt-4">
        <Button variant="outline" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>قبلی</Button>
        <span>صفحه {currentPage}</span>
        <Button variant="outline" onClick={() => setCurrentPage((p) => p + 1)} disabled={users.length < 30}>بعدی</Button>
      </div>
    </div>
  );
}
