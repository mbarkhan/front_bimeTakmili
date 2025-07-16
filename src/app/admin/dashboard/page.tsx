export default function AdminDashboard() {
  return (
    <div className="flex flex-col items-center gap-4 max-w-xs mx-auto mt-10">
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold">
        بارگذاری لیست کاربران
      </button>
      <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold">
        بارگذاری لیست افراد تبعی
      </button>
      <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-bold">
        ریست کردن رمز
      </button>
      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold">
        فهرست شرکت‌ها
      </button>
      <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold">
        رزرو
      </button>
    </div>
  );
}
