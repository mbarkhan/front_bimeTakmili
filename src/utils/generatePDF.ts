"use client";

export const generatePDF = async (elementId: string, filename = "reg_Bimeh.pdf") => {
  if (typeof window === "undefined") return; // جلوگیری از SSR

  // ❗ لود شدن فقط در کلاینت
  const html2pdf = (await import("html2pdf.js")).default;

  const element = document.getElementById(elementId);
  if (!element) {
    console.error("❌ عنصر HTML برای تولید PDF پیدا نشد:", elementId);
    return;
  }

  const opt = {
    margin: [0.3, 0.3, 0.3, 0.3],
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: {
      unit: "in",
      format: "a4",
      orientation: "landscape",
    },
  };

  const worker = html2pdf().from(element).set(opt).toPdf();

  const pdf = await worker.get("pdf");

  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.text(
      `صفحه ${i} از ${totalPages}`,
      pdf.internal.pageSize.getWidth() - 60,
      pdf.internal.pageSize.getHeight() - 10
    );
  }

  pdf.save ? pdf.save(filename) : pdf.output("save", filename);
};
