"use client";

import { useEffect, useRef, useState } from "react";
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
  empGroup,
  accountType,
} from "@/types/regTypes";
import { Pencil, Trash2, Upload } from "lucide-react";
import { MainEditModal, FamilyEditModal } from "./editModals";
import { BASE_URL } from "@/lib/api";
import { generatePDF } from "@/utils/generatePDF";
import PDFTemplate from "@/components/PDFTemplate";

type AnyReg = RegList;

const mapValue = (
  arr: { key: number; name: string }[] | undefined,
  key: number | undefined
) => {
  if (!arr) return "";
  if (key === undefined || key === null) return "";
  const found = arr.find((i) => i.key === Number(key));
  return found ? found.name : String(key);
};

export default function RegListByUserPage() {
  const [records, setRecords] = useState<AnyReg[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState<AnyReg | null>(null);
  const [editingFamily, setEditingFamily] = useState<AnyReg | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<number, File>>({});
  const router = useRouter();
  const [personalCode, setPersonalCode] = useState<string | null>(null);
  const [uploadingForId, setUploadingForId] = useState<number | null>(null);
  const MAX_FILE_SIZE = 300 * 1024;

 

  const fetchRecords = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setLoading(true);
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/register/mylist`, {
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPersonalCode(localStorage.getItem("personelCode"));
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (
    id: number | undefined,
    name: string,
    family: string
  ) => {
    if (id == null) {
      alert("این رکورد شناسه حذف ندارد.");
      return;
    }

    if (!confirm(`آیا از حذف "${name} ${family}" مطمئن هستید؟`)) return;
    if (id < 0) {
      setRecords((prev) => prev.filter((r) => getId(r) !== id));
      return;
    }

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`${BASE_URL}/register/del/${id}`, {
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

  const FinalConfirmationCheck = () => {
    return records.some((r) => !r.regConfirmed); //درصورتی که ثبت نهایی شده
  };

  const handleAddFamily = () => {
    const newRecord: AnyReg = {
      ID: -records.length,
      userId: records[0].userId,
      userPcode: personalCode ?? "",
      shenasname: "",
      phoneNum: "",
      familyRelation: 0,
      name: "",
      family: "",
      fatherName: "",
      nationalCode: "",
      birthDate: "",
      gender: 0,
      marriedStatus: 0,
      relStatus: 0,
      basicInsurance: 0,
      insuranceCode: "",
      bankAccount: "",
      shaba: "",
      empDate: "",
      mobileNum: "",
      empGroupCode: 0,
      bankCode: 0,
      bankAccountTp: "5",
      bankAccountOwner: "",
      mainPersonelCode: "",
      mainNationalCode: records[0].mainNationalCode,
      requestReason: 0,
      empType: 0,
      preInsurance: 0,
      coverMonths: 0,
      companyName: "",
      documents: "",
      regConfirmed: false,
    };

    setRecords((prev) => [...prev, newRecord]);
    setEditingFamily(newRecord);
  };

  const mainInsured = records.filter((r) => Number(r.familyRelation) === 1);
  const familyMembers = records.filter((r) => Number(r.familyRelation) !== 1);

  const openEditModal = (r: AnyReg) => {
    setEditingRecord({ ...r });
  };
  const openFamilyEditModal = (r: AnyReg) => {
    setEditingFamily({ ...r });
  };

  const handleRemoveDocument = async (r: RegList) => {
    const recordId = getId(r);
    if (!recordId) return;

    // اگر فایل جدید  (هنوز ذخیره نشده)
    if (uploadedFiles[recordId]) {
      setUploadedFiles((prev) => {
        const copy = { ...prev };
        delete copy[recordId];
        return copy;
      });
      return;
    }

    // اگر فایل قدیمی از سرور است
    if (r.documents) {
      if (!confirm("آیا از حذف این مدرک مطمئن هستید؟")) return;

      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        const res = await fetch(`${BASE_URL}/register/deletedoc/${recordId}`, {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) throw new Error("خطا در حذف فایل از سرور");

        // حذف از records تا در UI هم ناپدید شود
        setRecords((prev) =>
          prev.map((x) => (getId(x) === recordId ? { ...x, documents: "" } : x))
        );

        alert("مدرک با موفقیت حذف شد ✅");
      } catch (err) {
        console.error(err);
        alert("حذف مدرک با خطا مواجه شد ❌");
      }
    }
  };

  const handleFinalSave = async (isFinal: boolean) => {
    if (!FinalConfirmationCheck()){
      generatePDF( "pdf-content", records[0].mainPersonelCode.toString() + "-reg_Bimeh.pdf" );
      return;
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/login");
      return;
    }

    const allRecords = [...mainInsured, ...familyMembers];

    allRecords.forEach((r) => {
      if (r.ID < 0) r.ID = 0;
      r.userPcode = r.mainPersonelCode = personalCode ?? "";
      r.mainNationalCode = r.shenasname = r.nationalCode;
      r.phoneNum = mainInsured[0].mobileNum;
      r.empGroupCode = empGroup;
      r.bankCode = mainInsured[0].bankCode;
      r.bankAccountTp = accountType;
      r.bankAccountOwner = mainInsured[0].bankAccountOwner;
      r.requestReason = 23;
      r.empType = 1;
      r.empDate = mainInsured[0].empDate;
      r.bankAccount = mainInsured[0].bankAccount;
      r.shaba = mainInsured[0].shaba;
      r.preInsurance = 0;
      r.coverMonths = mainInsured[0].coverMonths;
      r.companyName = mainInsured[0].companyName;
      r.regConfirmed = isFinal;
    });

    try {
      const formData = new FormData();

      // 1) رکوردها
      formData.append("records", JSON.stringify(allRecords));

      // 2) فایل‌ها
      Object.entries(uploadedFiles).forEach(([id, file]) => {
        formData.append(`files[${id}]`, file);
      });

      const res = await fetch(`${BASE_URL}/register/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // ❌ Content-Type را عمداً نمی‌گذاریم
        },
        body: formData,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`خطا در ذخیره: ${txt}`);
      }

      const saved = await res.json();
      setRecords(saved);

      alert("اطلاعات و فایل‌ها با موفقیت ذخیره شدند ✅."); 
      
      if (isFinal) generatePDF( "pdf-content", records[0].mainPersonelCode.toString() + "-reg_Bimeh.pdf" );

      // بعد از موفقیت، فایل‌های موقت را خالی کن
      setUploadedFiles({});
    } catch (error) {
      console.error("خطا در ذخیره نهایی:", error);
      alert("ذخیره نهایی با خطا مواجه شد ❌");
    }
  };

  const renderMainTable = (data: AnyReg[]) => (
    <div
      dir="rtl"
      className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-6"
    >
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
            <tr key={getId(r) ?? idx}>
              <td className="px-4 py-3">{r.name}</td>
              <td className="px-4 py-3">{r.family}</td>
              <td className="px-4 py-3">{r.fatherName}</td>
              <td className="px-4 py-3">{r.nationalCode}</td>
              <td className="px-4 py-3">{r.birthDate}</td>
              <td className="px-4 py-3">{mapValue(genders, r.gender)}</td>
              <td className="px-4 py-3">
                {mapValue(marriedStatus, r.marriedStatus)}
              </td>
              <td className="px-4 py-3">{r.mobileNum}</td>
              <td className="px-4 py-3">{r.empDate}</td>
              <td className="px-4 py-3 w-20">
                {mapValue(basicInsurance, r.basicInsurance)}
              </td>
              <td className="px-4 py-3">{r.insuranceCode}</td>
              <td className="px-4 py-3">{mapValue(bankNames, r.bankCode)}</td>
              <td className="px-4 py-3">{r.bankAccount}</td>
              <td className="px-4 py-3">{r.shaba}</td>
              {FinalConfirmationCheck() && ( //درصورتی که ثبت نهایی شده
                <td className="px-4 py-3">
                  <button
                    className="p-1.5 text-blue-500 hover:text-blue-700"
                    onClick={() => openEditModal(r)}
                  >
                    <Pencil size={18} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  const renderFamilyTable = (data: AnyReg[]) => (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-6">
      <table
        className="min-w-full text-sm divide-y divide-gray-200"
        style={{ direction: "rtl" }}
      >
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
                <td className="px-4 py-3" align="center">
                  {r.name}
                </td>
                <td className="px-4 py-3" align="center">
                  {r.family}
                </td>
                <td className="px-4 py-3" align="center">
                  {r.fatherName}
                </td>
                <td className="px-4 py-3" align="center">
                  {r.nationalCode}
                </td>
                <td className="px-4 py-3" align="center">
                  {r.birthDate}
                </td>
                <td className="px-4 py-3" align="center">
                  {mapValue(genders, r.gender)}
                </td>
                <td className="px-4 py-3" align="center">
                  {mapValue(marriedStatus, r.marriedStatus)}
                </td>
                <td className="px-4 py-3" align="center">
                  {mapValue(relations, r.familyRelation)}
                </td>
                <td className="px-4 py-3" align="center">
                  {mapValue(relianceStatus, r.relStatus)}
                </td>
                <td className="px-4 py-3" align="center">
                  {mapValue(basicInsurance, r.basicInsurance)}
                </td>
                <td className="px-4 py-3" align="center">
                  {r.insuranceCode}
                </td>
                {FinalConfirmationCheck() && ( //درصورتی که ثبت نهایی شده
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      className="p-1.5 text-blue-500 hover:text-blue-700"
                      title="ویرایش"
                      onClick={() => openFamilyEditModal(r)}
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      className="p-1.5 text-red-500 hover:text-red-700"
                      title="حذف"
                      onClick={() => handleDelete(getId(r), r.name, r.family)}
                    >
                      <Trash2 size={18} />
                    </button>

                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      hidden
                      id={`upload-${getId(r)}`}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        if (file.size > 300 * 1024) {
                          alert("❌ حجم فایل باید کمتر از 300 کیلوبایت باشد");
                          return;
                        }

                        setUploadedFiles((prev) => ({
                          ...prev,
                          [getId(r)!]: file,
                        }));
                      }}
                    />
                    { ( ([3, 4].includes(r.familyRelation) && r.relStatus == 1) || ([7, 8].includes(r.familyRelation) && calcAgeFromJalaliSimple(r.birthDate)>18) || ([5,6].includes(r.familyRelation)))
                       && (<label
                        htmlFor={`upload-${getId(r)}`}
                        className="p-1.5 text-green-600 hover:text-green-800 cursor-pointer"
                        title="بارگذاری"
                      >
                        <Upload size={20} />
                      </label>
                    )}

                    {/* دکمه حذف مدرک  */}
                    {(uploadedFiles[getId(r)!] || r.documents) && (
                      <button
                        className="p-1 px-2 bg-red-600 text-white rounded hover:bg-red-800 text-xs"
                        onClick={() => handleRemoveDocument(r)}
                      >
                        حذف مدرک
                      </button>
                    )}
                  </td>
                )}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
  const getId = (r: RegList) =>
    (r as any).ID ?? (r as any).id ?? (r as any).Id ?? undefined;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold ">ثبت‌نام بیمه تکمیلی من</h2>

      {/* جدول بیمه‌شده اصلی */}
      {mainInsured.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-green-700 mb-3">
            بیمه‌شده اصلی
          </h3>
          <Card className="shadow-sm border border-gray-100">
            <CardContent className="p-0 overflow-x-auto">
              {renderMainTable(mainInsured)}
            </CardContent>
          </Card>
        </div>
      )}

      {/* جدول اعضای خانواده */}
      <div className="mb-8">
        <div className="flex justify-between items-center w-full mb-3">
          <h3 className="text-lg font-semibold text-blue-700">اعضای خانواده</h3>
          {FinalConfirmationCheck() && ( //درصورتی که ثبت نهایی شده
            <button
              className="gap-1 px-3 py-1.5 bg-gray-500 hover:bg-blue-700 text-white rounded-lg shadow transition flex items-center"
              onClick={handleAddFamily}
            >
              <span className="text-lg">+</span> افزودن عضو
            </button>
          )}
        </div>

        <Card className="shadow-sm border border-gray-100">
          <CardContent className="p-0 overflow-x-auto">
            {renderFamilyTable(familyMembers)}
          </CardContent>
        </Card>
      </div>

      {/* دکمه ذخیره موقت */}
      {FinalConfirmationCheck() && (
        <div className="flex justify-center">
          <button
            className="px-6 py-2 bg-purple-400 hover:bg-green-700 text-yellow-300 rounded-lg shadow-md transition"
            onClick={() => {
              handleFinalSave(false);
            }}
          >
            ثبت موقت
          </button>
        </div>
      )}

      {
        <div className="flex justify-center mt-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setOpenConfirm(true);
              handleFinalSave(true)
            }}
            className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
          >
            📄 تایید نهایی و دریافت فایل ثبت نام
          </a>
        </div>
      }

      {/* نمایش فایل‌های آپلود شده */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-md font-semibold mb-2">فایل‌های آپلود شده:</h3>

        <div className="flex flex-wrap gap-4">
          {records
            .filter((r) => {
              const id = getId(r)!;
              return uploadedFiles[id] || r.documents; // فقط آنهایی که فایل دارند
            })
            .map((r) => {
              const recordId = getId(r)!;
              const uploadedFile = uploadedFiles[recordId]; // فایل جدید
              const existingFile = r.documents; // فایل قدیمی از سرور

              return (
                <div
                  key={recordId}
                  className="border p-2 rounded w-40 relative"
                >
                  {/* نام فایل */}
                  <p className="text-sm font-medium truncate">
                    {uploadedFile
                      ? uploadedFile.name
                      : existingFile?.split("/").pop()}
                  </p>

                  {/* پیش‌نمایش */}
                  {uploadedFile ? (
                    uploadedFile.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(uploadedFile)}
                        alt={uploadedFile.name}
                        className="mt-2 w-full h-40 object-contain border rounded"
                      />
                    ) : (
                      <p className="mt-2 text-xs text-gray-600">
                        PDF بارگذاری شد
                      </p>
                    )
                  ) : existingFile ? (
                    existingFile.endsWith(".pdf") ? (
                      <a
                        href={existingFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-xs mt-2 block"
                      >
                        مشاهده PDF
                      </a>
                    ) : (
                      <img
                        src={existingFile}
                        alt="document"
                        className="mt-2 w-full h-40 object-contain border rounded"
                      />
                    )
                  ) : null}
                </div>
              );
            })}
        </div>
      </div>

      {/* قالب PDF برای دانلود — پنهان از دید کاربر */}
      <div style={{ display: "none" }}>
        <PDFTemplate mainInsured={mainInsured} familyMembers={familyMembers} />
      </div>

      {/* مودال ویرایش بیمه‌شده اصلی */}
      {editingRecord && (
        <MainEditModal
          editingRecord={editingRecord}
          setEditingRecord={setEditingRecord}
          setRecords={setRecords}
          getId={getId}
          personalCode={personalCode}
          genders={genders}
          marriedStatus={marriedStatus}
          basicInsurance={basicInsurance}
          bankNames={bankNames}
          preInsurance={preInsurance}
        />
      )}

      {editingFamily && (
        <FamilyEditModal
          editingFamily={editingFamily}
          setEditingFamily={setEditingFamily}
          setRecords={setRecords}
          records={records}
          getId={getId}
          genders={genders}
          marriedStatus={marriedStatus}
          basicInsurance={basicInsurance}
          relations={relations}
          relianceStatus={relianceStatus}
        />
      )}
    </div>
  );
}

function calcAgeFromJalaliSimple(birthDate?: string): number {
  if (!birthDate) return 0;

  // تبدیل اعداد فارسی به انگلیسی
  const normalize = (s: string) =>
    s.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));

  const norm = normalize(birthDate.trim());
  const parts = norm.split("/");
  if (parts.length !== 3) return 0;

  const by = parseInt(parts[0]); // سال تولد شمسی
  const bm = parseInt(parts[1]);
  const bd = parseInt(parts[2]);

  if (isNaN(by) || isNaN(bm) || isNaN(bd)) return 0;

  // تاریخ امروز میلادی
  const today = new Date();

  // تبدیل تقریبی میلادی به شمسی
  // فرمول ساده: سال شمسی = سال میلادی - 621 یا 622
  let jy = today.getFullYear() - 621;

  // تخمین شروع سال شمسی (حدود 21 مارس)
  const march = new Date(today.getFullYear(), 2, 21);

  if (today < march) {
    jy = today.getFullYear() - 622;
  }

  // ماه و روز شمسی امروز (تقریبی)
  const jm = today.getMonth() + 1;
  const jd = today.getDate();

  let age = jy - by;

  // اگر تولد امسال هنوز نرسیده باشد
  if (jm < bm || (jm === bm && jd < bd)) {
    age--;
  }

  return  age ;
}
