"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api"; // مسیر دقیق با توجه به پروژه ممکن است کمی فرق کند

export default function LoginPage() {
  const [personelCode, setPersonelCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
const [loading, setLoading] = useState(false);



  const handleLogin = async () => {
     setLoading(true);
    try {
      const data = await login(personelCode, password); // فراخوانی متد وارد شده

      const payload = JSON.parse(atob(data.token.split(".")[1]));
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", data.user.name + " " + data.user.family);
      localStorage.setItem("role", payload.role.toString());
      localStorage.setItem("personelCode", data.user.personelCode.toString());


      router.push(payload.role === 1 ? "/admin/dashboard" : "/user/dashboard");
    } catch (err: any) {
      setError(err.message);

    }finally{
      setLoading(false);
    }
     
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/font-face.css"
        rel="stylesheet"
      />
      <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4" dir="rtl">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-center mb-6">
            <img src="/images/logo.png" alt="لوگو" className="w-30 h-30" />
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 font-vazir">
            سامانه خدمات اداری و رفاهی شرکت پتروشیمی مهاباد            
          </h2>
          <h6 className="text-l text-center text-gray-400 mb-6 font-vazir">
            - ثبت نام بیمه تکمیلی
          </h6>
          

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={personelCode}
              onChange={(e) => setPersonelCode(e.target.value)}
              placeholder="کد پرسنلی"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-3 flex items-center text-gray-500 text-xl"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

         <button
  type="submit"
  disabled={loading}
  className={`w-full text-white font-bold py-3 rounded-lg transition ${
    loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  {loading ? "لطفاً صبر کنید..." : "ورود"}
</button>

          </form>
        </div>
      </div>

      <style jsx global>{`
        body {
          font-family: 'Vazir', sans-serif;
        }
      `}</style>
    </>
  );
}