"use client";

import { bankNames, basicInsurance, genders, marriedStatus, relations, relianceStatus } from "@/types/regTypes";

import React from "react";
const mapValue = (arr: { key: number; name: string }[] | undefined, key: number | undefined) => {
if (!arr) return "";
if (key === undefined || key === null) return "";
const found = arr.find((i) => i.key === Number(key));
return found ? found.name : String(key);
};

export default function PDFTemplate({ mainInsured, familyMembers }: any) {
  const m = mainInsured?.[0] ?? {}; // بیمه‌شده اصلی

  return (
    <div
      id="pdf-content"
      dir="rtl"
      style={{
        fontFamily: "Tahoma, sans-serif",
        padding: "30px",
        fontSize: "12px",
        color: "#000",
        lineHeight: "1.8",
        backgroundColor: "#fff",
        maxWidth: "1100px",
        margin: "0 auto",
        border: "1px solid #aaa",
      }}
    >
      {/* عنوان و لوگو */}
      <div style={{ textAlign: "center", marginBottom: "5px" }}>
        <img
          src="/images/logo.png"
          alt="Logo"
          crossOrigin="anonymous"
          style={{ width: "120px", marginBottom: "0px" }}
        />
        <h2 style={{ fontWeight: "bold", fontSize: "16px" }}>
          درخواست ثبت‌نام بیمه تکمیلی درمان ۱۴۰۴
        </h2>
      </div>

      {/* بخش بیمه‌شده اصلی */}
      <h3 style={{ marginTop: "3px", fontSize: "13px", fontWeight: "bold" }}>
        بیمه‌شده اصلی
      </h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "2px",
        }}
      >
        <colgroup>
          <col style={{ width: "60px" }} />
          <col style={{ width: "150px" }} />
          <col style={{ width: "60px" }} />
          <col style={{ width: "150px" }} />
          <col style={{ width: "60px" }} />
          <col style={{ width: "150px" }} />
        </colgroup>

        <tbody>
          <tr>
            <td style={cellStyle}>کد پرسنلی:</td>
            <td style={cellStyle}>{m.userPcode}</td>

            <td style={cellStyle}>نام:</td>
            <td style={cellStyle}>{m.name}</td>

            <td style={cellStyle}>نام خانوادگی:</td>
            <td style={cellStyle}>{m.family}</td>
          </tr>

          <tr>
            <td style={cellStyle}>نام پدر:</td>
            <td style={cellStyle}>{m.fatherName}</td>

            <td style={cellStyle}>تاریخ تولد:</td>
            <td style={cellStyle}>{m.birthDate}</td>

            <td style={cellStyle}>جنسیت:</td>
            <td style={cellStyle}>{mapValue(genders, m.gender)}</td>
          </tr>

          <tr>
            <td style={cellStyle}>تاهل:</td>
            <td style={cellStyle}>{mapValue(marriedStatus, m.marriedStatus)}</td>

            <td style={cellStyle}>کد ملی:</td>
            <td style={cellStyle}>{m.nationalCode}</td>

            <td style={cellStyle}>تلفن همراه:</td>
            <td style={cellStyle}>{m.mobileNum}</td>
          </tr>

          <tr>
            <td style={cellStyle}>تاریخ استخدام:</td>
            <td style={cellStyle}>{m.empDate}</td>

            <td style={cellStyle}>بیمه پایه:</td>
            <td style={cellStyle}>{mapValue(basicInsurance, m.basicInsurance)}</td>

            <td style={cellStyle}>شماره بیمه:</td>
            <td style={cellStyle}>{m.insuranceCode}</td>
          </tr>

          <tr>
            <td style={cellStyle}>نام بانک:</td>
            <td style={cellStyle}>{mapValue(bankNames,m.bankCode)}</td>

            <td style={cellStyle}>شماره شبا:</td>
            <td style={cellStyle}>{m.shaba}</td>

            <td style={cellStyle}>کد شرکت :</td>
            <td style={cellStyle}>{m.companyName}</td>
          </tr>
        </tbody>
      </table>

      {/* توضیحات */}
      <div
        style={{
          marginTop: "0px",
          border: "1px solid #ccc",
          padding: "10px",
          fontSize: "12px", 
          lineHeight: "1.6",
          backgroundColor: "#f9f9f9",
        }}
      >
        <p>افراد تبعی غیر از همسر، فرزند، پدر و مادر، در صورتی که تحت تکفل نباشند ثبت نام نخواهند شد ضمناً در صورتی که پدر و مادر تحت تکفل هستند لازم است مستندات بیمه ارائه شود.</p>
        <p>ارائه اصل گواهی اشتغال به تحصیل با تاریخ معتبر برای فرزندان پسر بالای 18 سال و صفحه اول و دوم شناسنامه فرزندان دختر بالای 18 سال به امور ثبت نام الزامی است. </p>
        <p>در صورت عدم ارائه گواهی های فوق تا پایان مهلت ثبت نام، بیمه تکمیلی برای سال جاری فعال نخواهد گردید.</p>
      </div>

      {/* جدول افراد تبعی */}
      <h3 style={{ marginTop: "10px", fontSize: "13px", fontWeight: "bold" }}>
        مشخصات افراد تبعی
      </h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "5px",
          fontSize: "11px",
        }}
      >
        <colgroup>
          <col style={{ width: "40px" }} />
          <col style={{ width: "90px" }} />
          <col style={{ width: "110px" }} />
          <col style={{ width: "90px" }} />
          <col style={{ width: "90px" }} />
          <col style={{ width: "60px" }} />
          <col style={{ width: "60px" }} />
          <col style={{ width: "100px" }} />
          <col style={{ width: "70px" }} />
          <col style={{ width: "70px" }} />
          <col style={{ width: "90px" }} />
          <col style={{ width: "100px" }} />
        </colgroup>

        <thead >
          <tr style={{ backgroundColor: "#e6e6e6", textAlign: "center" }}>
            <th style={thStyle}>ردیف</th>
            <th style={thStyle}>نام</th>
            <th style={thStyle}>نام خانوادگی</th>
            <th style={thStyle}>نام پدر</th>
            <th style={thStyle}>تاریخ تولد</th>
            <th style={thStyle}>جنسیت</th>
            <th style={thStyle}>تاهل</th>
            <th style={thStyle}>کد ملی</th>
            <th style={thStyle}>نسبت</th>
            <th style={thStyle}>تکفل</th>
            <th style={thStyle}>بیمه پایه</th>
            <th style={thStyle}>شماره بیمه</th>
          </tr>
        </thead>

       <tbody style={{ height: "30px" }}>
          {(familyMembers ??[]).map((f: any, i: number) => (
            <tr key={i}>
              <td style={tdStyle}>{i + 1}</td>
              <td style={tdStyle}>{f.name}</td>
              <td style={tdStyle}>{f.family}</td>
              <td style={tdStyle}>{f.fatherName}</td>
              <td style={tdStyle}>{f.birthDate}</td>
              <td style={tdStyle}>{mapValue(genders,f.gender)}</td>
              <td style={tdStyle}>{mapValue(marriedStatus,f.marriedStatus)}</td>
              <td style={tdStyle}>{f.nationalCode}</td>
              <td style={tdStyle}>{mapValue(relations,f.familyRelation)}</td>
              <td style={tdStyle}>{mapValue(relianceStatus,f.relStatus)}</td>
              <td style={tdStyle}>{mapValue(basicInsurance,f.basicInsurance)}</td>
              <td style={tdStyle}>{f.insuranceCode}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* امضا */}
      <div style={{ marginTop: "15px", fontSize: "12px", textAlign: "right" }}>
      <p>*تاریخ / *امضا / *اثرانگشت</p>
      </div>
    </div>
  );
}

/* سبک‌ها */
const cellStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "4px 6px",
  textAlign:"center",
  verticalAlign: "middle",
};

const thStyle: React.CSSProperties = {
  border: "1px solid #bbb",
  padding: "4px",
  textAlign: "center",
  background: "#f3f3f3",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  height: "22px",
  textAlign: "center",
};
