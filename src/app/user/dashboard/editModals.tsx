"use client";

import { useState } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { RegList } from "@/types/user";

// ==============================
// Main Edit Modal
// ==============================
export function MainEditModal({
editingRecord,
setEditingRecord,
setRecords,
getId,
/*personalCode,
empGroup,
accountType,*/
genders,
marriedStatus,
basicInsurance,
bankNames,
preInsurance,
}: any) {
const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});

    const requiredFields = [
    "name",
    "family",
    "fatherName",
    "nationalCode",
    "birthDate",
    "gender",
    "marriedStatus",
    "mobileNum",
    "empDate",
    "basicInsurance",
    "insuranceCode",
    "bankCode",
    "bankAccount",
    "shaba",
    "preInsurance",
    ];

    const validateMainFields = (record: any) => {
    const newErrors: { [key: string]: boolean } = {};
    let valid = true;

    requiredFields.forEach((f) => {
    if (!record[f]) {
    newErrors[f] = true;
    valid = false;
    }

    if (record.nationalCode.length !== 10) {
    newErrors["nationalCode"] = true;
    valid = false;
    }

    if (record.shaba.length !== 24) {
    newErrors["shaba"] = true;
    valid = false;
    }
    });

    setFieldErrors(newErrors);
    return valid;
    };

    if (!editingRecord) return null;

    return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-40 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto p-6">
            <h3 className="text-lg font-semibold mb-6 text-center">
                ویرایش: {editingRecord.name} {editingRecord.family}
            </h3>

            <div className="flex flex-col space-y-4">
                {/* نام */}
                <label className="flex flex-col">
                    <span className="text-sm text-gray-600">نام</span>
                    <input className={`border rounded px-2 py-1 ${ fieldErrors["name"] ? "border-red-500"
                        : "border-gray-300" }`} value={editingRecord.name ?? "" } onChange={(e)=> {
                    setEditingRecord({ ...editingRecord, name: e.target.value });
                    setFieldErrors((prev) => ({ ...prev, name: false }));
                    }}
                    />
                </label>

                {/* نام خانوادگی */}
                <label className="flex flex-col">
                    <span className="text-sm text-gray-600">نام خانوادگی</span>
                    <input className={`border rounded px-2 py-1 ${ fieldErrors["family"] ? "border-red-500"
                        : "border-gray-300" }`} value={editingRecord.family ?? "" } onChange={(e)=> {
                    setEditingRecord({ ...editingRecord, family: e.target.value });
                    setFieldErrors((prev) => ({ ...prev, family: false }));
                    }}
                    />
                </label>

                {/* نام پدر */}
                <label className="flex flex-col">
                    <span className="text-sm text-gray-600">نام پدر</span>
                    <input className={`border rounded px-2 py-1 ${ fieldErrors["fatherName"] ? "border-red-500"
                        : "border-gray-300" }`} value={editingRecord.fatherName ?? "" } onChange={(e)=> {
                    setEditingRecord({
                    ...editingRecord,
                    fatherName: e.target.value,
                    });
                    setFieldErrors((prev) => ({ ...prev, fatherName: false }));
                    }}
                    />
                </label>

                {/* کد ملی */}
                <label className="flex flex-col">
                    <span className="text-sm text-gray-600">کد ملی</span>
                    <input maxLength={10} type="number" className={`border rounded px-2 py-1 ${
                        fieldErrors["nationalCode"] ? "border-red-500" : "border-gray-300" }`}
                        value={editingRecord.nationalCode ?? "" } onChange={(e)=> {
                    setEditingRecord({
                    ...editingRecord,
                    nationalCode: e.target.value,
                    });
                    setFieldErrors((prev) => ({ ...prev, nationalCode: false }));
                    }}
                    />
                </label>

                {/* تاریخ تولد */}
                <label className="flex flex-col">
                    <span className="text-sm text-gray-600">تاریخ تولد</span>
                    <DatePicker calendar={persian} locale={persian_fa} value={editingRecord.birthDate || "" }
                        onChange={(d: any)=> {
                        const v = d ? d.format("YYYY/MM/DD") : "";
                        setEditingRecord({ ...editingRecord, birthDate: v });
                        setFieldErrors((prev) => ({ ...prev, birthDate: false }));
                        }}
                        format="YYYY/MM/DD"
                        className={`w-full ${
                        fieldErrors["birthDate"]
                        ? "border-red-500"
                        : "border-gray-300"
                        }`}
                        />
                </label>

                {/* جنسیت */}
                <label className="flex flex-col">
                    <span className="text-sm text-gray-600">جنسیت</span>
                    <select className={`border rounded p-2 ${ fieldErrors["gender"] ? "border-red-500"
                        : "border-gray-300" }`} value={editingRecord.gender ?? "" } onChange={(e)=> {
                        setEditingRecord({
                        ...editingRecord,
                        gender: Number(e.target.value),
                        });
                        setFieldErrors((prev) => ({ ...prev, gender: false }));
                        }}
                        >
                        <option value="">انتخاب کنید</option>
                        {genders.map((g: any) => (
                        <option key={g.key} value={g.key}>
                            {g.name}
                        </option>
                        ))}
                    </select>
                </label>

                {/* وضعیت تأهل */}
                <label className="flex flex-col">
                    <span className="text-sm text-gray-600">وضعیت تأهل</span>
                    <select className={`border rounded p-2 ${ fieldErrors["marriedStatus"] ? "border-red-500"
                        : "border-gray-300" }`} value={editingRecord.marriedStatus ?? "" } onChange={(e)=> {
                        setEditingRecord({
                        ...editingRecord,
                        marriedStatus: Number(e.target.value),
                        });
                        setFieldErrors((prev) => ({
                        ...prev,
                        marriedStatus: false,
                        }));
                        }}
                        >
                        <option value="">انتخاب کنید</option>
                        {marriedStatus.map((m: any) => (
                        <option key={m.key} value={m.key}>
                            {m.name}
                        </option>
                        ))}
                    </select>
                </label>

                {/* موبایل */}
                <label className="flex flex-col">
                    <span className="text-sm text-gray-600">موبایل</span>
                    <input type="number" className={`border rounded px-2 py-1 ${ fieldErrors["mobileNum"]
                        ? "border-red-500" : "border-gray-300" }`} value={editingRecord.mobileNum ?? "" }
                        onChange={(e)=> {
                    setEditingRecord({
                    ...editingRecord,
                    mobileNum: e.target.value,
                    });
                    setFieldErrors((prev) => ({ ...prev, mobileNum: false }));
                    }}
                    />
                </label>

                {/* تاریخ استخدام */}
                <label className="flex flex-col">
                    <span className="text-sm text-gray-600">تاریخ استخدام</span>
                    <DatePicker calendar={persian} locale={persian_fa} value={editingRecord.empDate || "" }
                        onChange={(d: any)=> {
                        const v = d ? d.format("YYYY/MM/DD") : "";
                        setEditingRecord({ ...editingRecord, empDate: v });
                        setFieldErrors((prev) => ({ ...prev, empDate: false }));
                        }}
                        format="YYYY/MM/DD"
                        className={`w-full ${
                        fieldErrors["empDate"] ? "border-red-500" : "border-gray-300"
                        }`}
                        />
                </label>

                {/* بیمه پایه */}
                <label className="flex flex-col">
                    <span className="text-sm text-gray-600">بیمه پایه</span>
                    <select className={`border rounded p-2 ${ fieldErrors["basicInsurance"] ? "border-red-500"
                        : "border-gray-300" }`}
                        value={editingRecord.basicInsurance ?? 144} 
                        onChange={(e)=> {
                        setEditingRecord({
                        ...editingRecord,
                        basicInsurance: Number(e.target.value),
                        });
                        setFieldErrors((prev) => ({
                        ...prev,
                        basicInsurance: false,
                        }));
                        }}
                        >
                        <option value="">انتخاب کنید</option>
                        {basicInsurance.map((b: any) => (
                        <option key={b.key} value={b.key}>
                            {b.name}
                        </option>
                        ))}
                    </select>
                </label>

                {/* شماره بیمه */}
                <label className="flex flex-col">
                    <span className="text-sm text-gray-600">شماره بیمه پایه</span>
                    <input className={`border rounded px-2 py-1 ${ fieldErrors["insuranceCode"] ? "border-red-500"
                        : "border-gray-300" }`} value={editingRecord.insuranceCode ?? "" } onChange={(e)=> {
                    setEditingRecord({
                    ...editingRecord,
                    insuranceCode: e.target.value,
                    });
                    setFieldErrors((prev) => ({
                    ...prev,
                    insuranceCode: false,
                    }));
                    }}
                    />
                </label>

                {/* بانک */}
                <label className="flex flex-col">
                    <span className="text-sm text-gray-600">بانک</span>
                    <select className={`border rounded p-2 ${ fieldErrors["bankCode"] ? "border-red-500"
                        : "border-gray-300" }`} value={editingRecord.bankCode ?? "" } onChange={(e)=> {
                        setEditingRecord({
                        ...editingRecord,
                        bankCode: Number(e.target.value),
                        });
                        setFieldErrors((prev) => ({ ...prev, bankCode: false }));
                        }}
                        >
                        <option value="">انتخاب کنید</option>
                        {bankNames.map((b: any) => (
                        <option key={b.key} value={b.key}>
                            {b.name}
                        </option>
                        ))}
                    </select>
                </label>

                {/* شماره حساب */}
                <label className="flex flex-col">
                    <span className="text-sm text-gray-600">شماره حساب</span>
                    <input type="number" className={`border rounded px-2 py-1 ${ fieldErrors["bankAccount"]
                        ? "border-red-500" : "border-gray-300" }`} value={editingRecord.bankAccount ?? "" }
                        onChange={(e)=> {
                    setEditingRecord({
                    ...editingRecord,
                    bankAccount: e.target.value,
                    });
                    setFieldErrors((prev) => ({ ...prev, bankAccount: false }));
                    }}
                    />
                </label>

                {/* شبا */}
                <label className="flex flex-col">
                    <span className="text-sm text-gray-600">شبا بدون IR</span>
                    <input maxLength={24} type="number" className={`border rounded px-2 py-1 ${ fieldErrors["shaba"]
                        ? "border-red-500" : "border-gray-300" }`} value={editingRecord.shaba ?? "" } onChange={(e)=> {
                    setEditingRecord({ ...editingRecord, shaba: e.target.value });
                    setFieldErrors((prev) => ({ ...prev, shaba: false }));
                    }}
                    />
                </label>

                {/* بیمه‌گر قبلی */}
                <label className="flex flex-col">
                    <span className="text-sm text-gray-600">بیمه‌گر قبلی</span>
                    <select className={`border rounded p-2 ${ fieldErrors["preInsurance"] ? "border-red-500"
                        : "border-gray-300" }`} value={editingRecord.preInsurance ?? 5 } onChange={(e)=> {
                        setEditingRecord({
                        ...editingRecord,
                        preInsurance: Number(e.target.value),
                        });
                        setFieldErrors((prev) => ({ ...prev, preInsurance: false }));
                        }}
                        >
                        <option value="">انتخاب کنید</option>
                        {preInsurance.map((p: any) => (
                        <option key={p.key} value={p.key}>
                            {p.name}
                        </option>
                        ))}
                    </select>
                </label>
            </div>

            {/* دکمه‌های پایین مودال */}
            <div className="flex justify-end gap-3 mt-6">
                <button className="px-4 py-2 rounded border" onClick={()=> setEditingRecord(null)}
                    >
                    انصراف
                </button>
                <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={()=> {
                    if (!validateMainFields(editingRecord)) {
                    alert("تمام داده‌ها را صحیح وارد کنید.");
                    return;
                    }
                    const id = getId(editingRecord);
                    if (!id) return;

                    editingRecord.coverMonths = 12;
                    editingRecord.familyRelation = 1;
                    editingRecord.relStatus = 3;
                    editingRecord.bankAccountOwner =    editingRecord.name + " " + editingRecord.family;

                    setRecords((prev: any) =>
                    prev.map((p: any) => (getId(p) === id ? editingRecord : p))
                    );
                    setEditingRecord(null);
                    }}
                    >
                    تایید
                </button>
            </div>
        </div>
    </div>
    );
    }

    // ==============================
    // Family Edit Modal
    // ==============================
    
   export function FamilyEditModal({
  editingFamily,
  setEditingFamily,
  setRecords,
  records,
  getId,
  genders,
  relations,
  marriedStatus,
  relianceStatus,
  basicInsurance,
}: any) {
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});
  const mainInsured = records.find((r: RegList) => r.familyRelation === 1);

  const requiredFields = [
    "name",
    "family",
    "fatherName",
    "nationalCode",
    "birthDate",
    "gender",
    "familyRelation",
    "marriedStatus",
    "relStatus",
    "basicInsurance",
  ];

  const validateFamilyFields = (record: any) => {
    const newErrors: { [key: string]: boolean } = {};
    let valid = true;

    requiredFields.forEach((f) => {
      if (!record[f]) {
        newErrors[f] = true;
        valid = false;
      }

      if (record.nationalCode.length !== 10) {
        newErrors["nationalCode"] = true;
        valid = false;
      }
    });

    setFieldErrors(newErrors);
    return valid;
  };

  if (!editingFamily) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto p-6">
        <h3 className="text-lg font-semibold mb-6 text-center">
          ویرایش عضو خانواده: {editingFamily.name} {editingFamily.family}
        </h3>

        <div className="flex flex-col space-y-4">
          {/* نام */}
          <label className="flex flex-col">
            <span className="text-sm text-gray-600">نام</span>
            <input
              className={`border rounded px-2 py-1 ${
                fieldErrors["name"] ? "border-red-500" : "border-gray-300"
              }`}
              value={editingFamily.name ?? ""}
              onChange={(e) => {
                setEditingFamily({ ...editingFamily, name: e.target.value });
                setFieldErrors((prev) => ({ ...prev, name: false }));
              }}
            />
          </label>

          {/* نام خانوادگی */}
          <label className="flex flex-col">
            <span className="text-sm text-gray-600">نام خانوادگی</span>
            <input
              className={`border rounded px-2 py-1 ${
                fieldErrors["family"] ? "border-red-500" : "border-gray-300"
              }`}
              value={editingFamily.family ?? ""}
              onChange={(e) => {
                setEditingFamily({ ...editingFamily, family: e.target.value });
                setFieldErrors((prev) => ({ ...prev, family: false }));
              }}
            />
          </label>

          {/* نام پدر */}
          <label className="flex flex-col">
            <span className="text-sm text-gray-600">نام پدر</span>
            <input
              className={`border rounded px-2 py-1 ${
                fieldErrors["fatherName"] ? "border-red-500" : "border-gray-300"
              }`}
              value={editingFamily.fatherName ?? ""}
              onChange={(e) => {
                setEditingFamily({
                  ...editingFamily,
                  fatherName: e.target.value,
                });
                setFieldErrors((prev) => ({ ...prev, fatherName: false }));
              }}
            />
          </label>

          {/* کد ملی */}
          <label className="flex flex-col">
            <span className="text-sm text-gray-600">کد ملی</span>
            <input
              maxLength={10}
              type="number"
              className={`border rounded px-2 py-1 ${
                fieldErrors["nationalCode"]
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={editingFamily.nationalCode ?? ""}
              onChange={(e) => {
                setEditingFamily({
                  ...editingFamily,
                  nationalCode: e.target.value,
                });
                setFieldErrors((prev) => ({ ...prev, nationalCode: false }));
              }}
            />
          </label>

          {/* تاریخ تولد */}
          <label className="flex flex-col">
            <span className="text-sm text-gray-600">تاریخ تولد</span>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={editingFamily.birthDate || ""}
              onChange={(d: any) => {
                const v = d ? d.format("YYYY/MM/DD") : "";
                setEditingFamily({ ...editingFamily, birthDate: v });
                setFieldErrors((prev) => ({ ...prev, birthDate: false }));
              }}
              format="YYYY/MM/DD"
              className={`w-full ${
                fieldErrors["birthDate"]
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
          </label>

          {/* جنسیت */}
          <label className="flex flex-col">
            <span className="text-sm text-gray-600">جنسیت</span>
            <select
              className={`border rounded p-2 ${
                fieldErrors["gender"] ? "border-red-500" : "border-gray-300"
              }`}
              value={editingFamily.gender ?? ""}
              onChange={(e) => {
                setEditingFamily({
                  ...editingFamily,
                  gender: Number(e.target.value),
                });
                setFieldErrors((prev) => ({ ...prev, gender: false }));
              }}
            >
              <option value="">انتخاب کنید</option>
              {genders.map((g: any) => (
                <option key={g.key} value={g.key}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>

          {/* نسبت */}
          <label className="flex flex-col">
            <span className="text-sm text-gray-600">نسبت</span>
            <select
              className={`border rounded p-2 ${
                fieldErrors["familyRelation"]
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={editingFamily.familyRelation ?? ""}
              onChange={(e) => {
                const newRelation = Number(e.target.value);
                let updated = { ...editingFamily, familyRelation: newRelation };
                setFieldErrors((prev) => ({ ...prev, familyRelation: false }));

                // 👇 اگر نسبت همسر، پسر یا دختر باشد
                if ([2, 7, 8].includes(newRelation)) {
                  updated = {
                    ...updated,
                    relStatus: relianceStatus[0]?.key || "",
                    insuranceCode: mainInsured?.insuranceCode || "",
                    basicInsurance: mainInsured.basicInsurance || "",
                  };
                }

                setEditingFamily(updated);
              }}
            >
              <option value="">انتخاب کنید</option>
              {relations.map((r: any) => (
                <option key={r.key} value={r.key}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>

          {/* وضعیت تأهل */}
          <label className="flex flex-col">
            <span className="text-sm text-gray-600">وضعیت تأهل</span>
            <select
              className={`border rounded p-2 ${
                fieldErrors["marriedStatus"]
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={editingFamily.marriedStatus ?? ""}
              onChange={(e) => {
                setEditingFamily({
                  ...editingFamily,
                  marriedStatus: Number(e.target.value),
                });
                setFieldErrors((prev) => ({
                  ...prev,
                  marriedStatus: false,
                }));
              }}
            >
              <option value="">انتخاب کنید</option>
              {marriedStatus.map((m: any) => (
                <option key={m.key} value={m.key}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>

          {/* وضعیت تکفل */}
          <label className="flex flex-col">
            <span className="text-sm text-gray-600">وضعیت تکفل</span>
            <select
              className={`border rounded p-2 ${
                fieldErrors["relStatus"]
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={editingFamily.relStatus ?? ""}
              onChange={(e) => {
                setEditingFamily({
                  ...editingFamily,
                  relStatus: Number(e.target.value),
                });
                setFieldErrors((prev) => ({
                  ...prev,
                  relStatus: false,
                }));
              }}
            >
              <option value="">انتخاب کنید</option>
              {relianceStatus.map((r: any) => (
                <option key={r.key} value={r.key}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>

          {/* بیمه پایه */}
          <label className="flex flex-col">
            <span className="text-sm text-gray-600">بیمه پایه</span>
            <select
              className={`border rounded p-2 ${
                fieldErrors["basicInsurance"]
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={editingFamily.basicInsurance ?? ""}
              onChange={(e) => {
                setEditingFamily({
                  ...editingFamily,
                  basicInsurance: Number(e.target.value),
                });
                setFieldErrors((prev) => ({
                  ...prev,
                  basicInsurance: false,
                }));
              }}
            >
              <option value="">انتخاب کنید</option>
              {basicInsurance.map((b: any) => (
                <option key={b.key} value={b.key}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>

          {/* شماره بیمه */}
          <label className="flex flex-col">
            <span className="text-sm text-gray-600">شماره بیمه</span>
            <input
              className={`border rounded px-2 py-1 ${
                fieldErrors["insuranceCode"]
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={editingFamily.insuranceCode ?? ""}
              onChange={(e) => {
                setEditingFamily({
                  ...editingFamily,
                  insuranceCode: e.target.value,
                });
                setFieldErrors((prev) => ({
                  ...prev,
                  insuranceCode: false,
                }));
              }}
            />
          </label>
        </div>

        {/* دکمه‌های پایین مودال */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 rounded border"
            onClick={() => setEditingFamily(null)}
          >
            انصراف
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white"
            onClick={() => {
              if (!validateFamilyFields(editingFamily)) {
                alert("تمام داده‌ها را صحیح وارد کنید.");
                return;
              }
              const id = getId(editingFamily);
              if (!id) return;

              setRecords((prev: any) =>
                prev.map((p: any) => (getId(p) === id ? editingFamily : p))
              );
              setEditingFamily(null);
            }}
          >
            تایید
          </button>
        </div>
      </div>
    </div>
  );
}