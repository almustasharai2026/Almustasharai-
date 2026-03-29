import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import type { Database } from './database.types';

type Message = Database['public']['Tables']['messages']['Row'];

export async function exportToPDF(messages: Message[], title: string, language: 'ar' | 'en') {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);
  let y = 20;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);

  const titleLines = doc.splitTextToSize(title, maxWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 8 + 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  messages.forEach((message) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    const role = message.role === 'user'
      ? (language === 'ar' ? 'المستخدم' : 'User')
      : (language === 'ar' ? 'المحامي' : 'Lawyer');

    doc.text(`${role}:`, margin, y);
    y += 7;

    doc.setFont('helvetica', 'normal');
    const contentLines = doc.splitTextToSize(message.content, maxWidth);
    doc.text(contentLines, margin, y);
    y += contentLines.length * 5 + 10;
  });

  doc.save(`${title}.pdf`);
}

export async function exportToWord(messages: Message[], title: string, language: 'ar' | 'en') {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 32,
        }),
      ],
      spacing: { after: 400 },
    }),
  ];

  messages.forEach((message) => {
    const role = message.role === 'user'
      ? (language === 'ar' ? 'المستخدم' : 'User')
      : (language === 'ar' ? 'المحامي' : 'Lawyer');

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${role}:`,
            bold: true,
            size: 24,
          }),
        ],
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: message.content,
            size: 22,
          }),
        ],
        spacing: { after: 200 },
      })
    );
  });

  const doc = new Document({
    sections: [{
      properties: {},
      children: paragraphs,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title}.docx`;
  link.click();
  URL.revokeObjectURL(url);
}
