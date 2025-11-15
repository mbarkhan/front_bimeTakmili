"use client";

import html2pdf from "html2pdf.js";

export const generatePDF = (elementId: string, filename = "reg_Bimeh.pdf") => {
  const element = document.getElementById(elementId);

  if (!element) {
    console.error("❌ عنصر HTML برای تولید PDF پیدا نشد:", elementId);
    return;
  }

  const opt = {
    margin: [0.3, 0.3, 0.3, 0.3] as [number, number, number, number],
    filename: filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: {
      unit: "in",
      format: "a4",
      orientation: "landscape",
    },
  };

  html2pdf()
    .from(element)
    .set(opt as any)
    .toPdf()
    .get("pdf")
    .then((pdf: any) => {
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

      // ذخیره صحیح PDF
      pdf.save ? pdf.save(filename) : pdf.output("save", filename);
    });
};
