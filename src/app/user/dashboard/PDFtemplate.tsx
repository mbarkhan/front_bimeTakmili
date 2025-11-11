"use client";

import React from "react";
import { RegList } from "@/types/user";
import {
  genders,
  marriedStatus,
  relations,
  relianceStatus,
  basicInsurance,
  bankNames,
} from "@/types/regTypes";

// نوع ورودی‌ها
interface Props {
  mainInsured: RegList[];
  familyMembers: RegList[];
}

const mapValue = (arr: { key: number; name: string }[], key: number | undefined) =>
  arr.find((i) => i.key === Number(key))?.name ?? "";

export default function PdfTemplate({ mainInsured = [], familyMembers = [] }: Props) {
  return (
    <div
      id="pdf-content"
      dir="rtl"
      style={{
        fontFamily: "Tahoma, sans-serif",
        padding: "20px 40px",
        fontSize: "12px",
        color: "#000",
        backgroundColor: "#fff",
      }}
    >
      {/* سربرگ */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img
          src="/logo.png"
          alt="لوگو"
          style={{ width: "80px", marginBottom: "10px" }}
        />
        <h2 style={{ fontWeight: "bold", fontSize: "16px" }}>
          فرم ثبت‌نام بیمه تکمیلی
        </h2>
      </div>

      {/* بیمه‌شده اصلی */}
      <h3
        style={{
          color: "#155e1f",
          marginTop: "20px",
          marginBottom: "10px",
          borderBottom: "2px solid #155e1f",
          paddingBottom: "4px",
          fontSize: "14px",
        }}
      >
        اطلاعات بیمه‌شده اصلی
      </h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #999",
          fontSize: "12px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#d6f5d6", textAlign: "center" }}>
            <th style={{ border: "1px solid #999", padding: "4px" }}>نام</th>
            <th style={{ border: "1px solid #999", padding: "4px" }}>نام خانوادگی</th>
            <th style={{ border: "1px solid #999", padding: "4px" }}>کد ملی</th>
            <th style={{ border: "1px solid #999", padding: "4px" }}>شماره بیمه</th>
            <th style={{ border: "1px solid #999", padding: "4px" }}>تاریخ تولد</th>
            <th style={{ border: "1px solid #999", padding: "4px" }}>وضعیت تأهل</th>
            <th style={{ border: "1px solid #999", padding: "4px" }}>تلفن همراه</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(mainInsured) && mainInsured.length > 0 ? (
            mainInsured.map((r, idx) => (
              <tr
                key={idx}
                style={{ borderBottom: "1px solid #ccc", textAlign: "center" }}
              >
                <td style={{ border: "1px solid #999", padding: "4px" }}>{r.name}</td>
                <td style={{ border: "1px solid #999", padding: "4px" }}>{r.family}</td>
                <td style={{ border: "1px solid #999", padding: "4px" }}>{r.nationalCode}</td>
                <td style={{ border: "1px solid #999", padding: "4px" }}>{r.insuranceCode}</td>
                <td style={{ border: "1px solid #999", padding: "4px" }}>{r.birthDate}</td>
                <td style={{ border: "1px solid #999", padding: "4px" }}>
                  {mapValue(marriedStatus, r.marriedStatus)}
                </td>
                <td style={{ border: "1px solid #999", padding: "4px" }}>{r.mobileNum}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", color: "#777", padding: "8px" }}>
                اطلاعاتی وجود ندارد
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* اعضای خانواده */}
      <h3
        style={{
          color: "#0a4a8a",
          marginTop: "30px",
          marginBottom: "10px",
          borderBottom: "2px solid #0a4a8a",
          paddingBottom: "4px",
          fontSize: "14px",
        }}
      >
        اطلاعات اعضای خانواده
      </h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #999",
          fontSize: "12px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#cfe2ff", textAlign: "center" }}>
            <th style={{ border: "1px solid #999", padding: "4px" }}>نام</th>
            <th style={{ border: "1px solid #999", padding: "4px" }}>نام خانوادگی</th>
            <th style={{ border: "1px solid #999", padding: "4px" }}>کد ملی</th>
            <th style={{ border: "1px solid #999", padding: "4px" }}>نسبت</th>
            <th style={{ border: "1px solid #999", padding: "4px" }}>تکفل</th>
            <th style={{ border: "1px solid #999", padding: "4px" }}>تاریخ تولد</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(familyMembers) && familyMembers.length > 0 ? (
            familyMembers.map((r, idx) => (
              <tr
                key={idx}
                style={{ borderBottom: "1px solid #ccc", textAlign: "center" }}
              >
                <td style={{ border: "1px solid #999", padding: "4px" }}>{r.name}</td>
                <td style={{ border: "1px solid #999", padding: "4px" }}>{r.family}</td>
                <td style={{ border: "1px solid #999", padding: "4px" }}>{r.nationalCode}</td>
                <td style={{ border: "1px solid #999", padding: "4px" }}>
                  {mapValue(relations, r.familyRelation)}
                </td>
                <td style={{ border: "1px solid #999", padding: "4px" }}>
                  {mapValue(relianceStatus, r.relStatus)}
                </td>
                <td style={{ border: "1px solid #999", padding: "4px" }}>{r.birthDate}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", color: "#777", padding: "8px" }}>
                اطلاعاتی وجود ندارد
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* محل امضا */}
      <div style={{ marginTop: "50px", textAlign: "left", fontSize: "13px" }}>
        <p>امضاء بیمه‌شده اصلی: ...........................................................</p>
        <p>تاریخ: ...........................................................</p>
      </div>
    </div>
  );
}
