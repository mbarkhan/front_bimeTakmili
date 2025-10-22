// types/options.ts
export type OptionType = {
  key: number;
  name: string;
};

export const genders: OptionType[] = [
  { key: 1, name: "مرد" },
  { key: 2, name: "زن" },
  { key: 3, name: "دوجنسی/نامشخص" },
  { key: 4, name: "تعیین نشده" },
];

export const marriedStatus: OptionType[] = [
  { key: 2, name: "مجرد" },
  { key: 3, name: "متاهل" },
  { key: 5, name: "سایر" },
];

export const relations: OptionType[] = [
  { key: 1, name: "بیمه شده اصلی" },
  { key: 2, name: "همسر" },
  { key: 3, name: "پدر" },
  { key: 4, name: "مادر" },
  { key: 5, name: "خواهر" },
  { key: 6, name: "برادر" },
  { key: 7, name: "پسر" },
  { key: 8, name: "دختر" },
];

export const relianceStatus: OptionType[] = [
  { key: 1, name: "تحت تکفل" },
  { key: 2, name: "غیر تحت تکفل" },
  { key: 3, name: "بیمه شده اصلی" },
];

export const empGroup: number = 3;

export const basicInsurance: OptionType[] = [
  { key: 144, name: "تامین اجتماعی" },
  { key: 32, name: "بیمه سلامت" },
  { key: 33, name: "سامانه ایزی مد" },
  { key: 5, name: "ایران" },
  { key: 38, name: "بانک" },
  { key: 39, name: "شرکت ملی نفتکش" },
  { key: 7, name: "دانا" },
  { key: 40, name: "فاقد بیمه گر پایه" },
  { key: 41, name: "ملی صنایع مس ایران" },
  { key: 42, name: "پالایش نفت" },
  { key: 145, name: "نیروهای مسلح" },
  { key: 146, name: "کمیته امداد" },
  { key: 19, name: "دی" },
  { key: 147, name: "خدمات درمانی" },
  { key: 20, name: "هما" },
  { key: 28, name: "سایر" },
];

export const bankNames: OptionType[] = [
  { key: 1, name: "آینده" },
  { key: 2, name: "اقتصاد نوین" },
  { key: 3, name: "ایران زمین" },
  { key: 4, name: "تجارت" },
  { key: 5, name: "توسعه صادرات" },
  { key: 6, name: "رفاه کارگران" },
  { key: 7, name: "سپه" },
  { key: 8, name: "صادرات" },
  { key: 9, name: "کشاورزی" },
  { key: 10, name: "مسکن" },
  { key: 11, name: "ملی" },
  { key: 12, name: "انصار" },
  { key: 13, name: "رسالت" },
  { key: 14, name: "شهر" },
  { key: 15, name: "صنعت و معدن" },
  { key: 16, name: "ملت" },
  { key: 17, name: "پاسارگاد" },
  { key: 18, name: "توسعه تعاون" },
  { key: 20, name: "دی" },
  { key: 21, name: "سامان" },
  { key: 22, name: "سرمایه" },
  { key: 23, name: "سینا" },
  { key: 24, name: "قرض الحسنه مهر ایران" },
  { key: 25, name: "مالی اعتباری بنیاد" },
  { key: 26, name: "موسسه مالی و اعتباری عسگریه" },
  { key: 27, name: "پارسیان" },
  { key: 28, name: "پست بانک" },
  { key: 29, name: "کارآفرین" },
  { key: 31, name: "قوامین" },
  { key: 32, name: "حکمت ایرانیان" },
  { key: 33, name: "کوثر" },
  { key: 34, name: "گردشگری" },
  { key: 35, name: "انصارالمجاهدین" },
  { key: 30, name: "سایر" },
];

export const accountType: string = "5";

export const regReasons: OptionType[] = [
  { key: 23, name: "لیست اولیه" },
  { key: 2, name: "تولد" },
  { key: 25, name: "ازدواج" },
  { key: 3, name: "استخدام" },
  { key: 20, name: "جدیدالورود تبعی" },
];

export const excludeReasons: OptionType[] = [
  { key: 1, name: "فوت" },
  { key: 5, name: "قطع رابطه همکاري با کارفرما" },
  { key: 7, name: "خروج از کفالت" },
  { key: 8, name: "طلاق" },
  { key: 11, name: "انصراف" },
];

export const empTypes: OptionType[] = [
  { key: 1, name: "قراردادی" },
  { key: 9, name: "سایر" },
];

export const preInsurance: OptionType[]=[
  {key:5, name:"ایران"},
  {key:-1, name:"سایر"}
];

export const companyTypes: Record<number, string> = {
  1: "قراردادی - مدت معین",
  2: "تأمین نیرو",
  3: "پیمانکار حجمی",
};