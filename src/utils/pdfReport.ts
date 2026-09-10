import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { LedgerEntry } from '@/types';

const BRAND_COLOR: [number, number, number] = [37, 99, 235]; // blue-600
const DARK_COLOR: [number, number, number] = [15, 23, 42]; // slate-900
const MUTED_COLOR: [number, number, number] = [100, 116, 139]; // slate-500
const EMERALD: [number, number, number] = [5, 150, 105];
const ROSE: [number, number, number] = [225, 29, 72];

function formatCurrency(amount: number): string {
  return 'Rs. ' + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function addFooter(doc: jsPDF, margin: number, pageWidth: number, pageHeight: number) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...MUTED_COLOR);
    doc.text('Nexora Ledger - Confidential Report', margin, pageHeight - 16);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 16, { align: 'right' });
  }
}

function drawHeader(doc: jsPDF, margin: number, pageWidth: number, title: string) {
  doc.setFillColor(...DARK_COLOR);
  doc.rect(0, 0, pageWidth, 90, 'F');

  doc.setFillColor(...BRAND_COLOR);
  doc.circle(margin + 16, 45, 16, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('N', margin + 16, 50, { align: 'center' });

  doc.setFontSize(18);
  doc.text('NEXORA LEDGER', margin + 42, 40);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('Person-wise Smart Ledger System', margin + 42, 56);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(title, pageWidth - margin, 40, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  const reportDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.text(reportDate, pageWidth - margin, 56, { align: 'right' });
}

function drawSummaryCards(doc: jsPDF, y: number, margin: number, contentWidth: number, totalGiven: number, totalTaken: number, netBalance: number) {
  const cardWidth = (contentWidth - 20) / 3;
  const cardHeight = 70;

  const cards: { label: string; value: string; color: [number, number, number] }[] = [
    { label: 'Total Given', value: formatCurrency(totalGiven), color: EMERALD },
    { label: 'Total Taken', value: formatCurrency(totalTaken), color: ROSE },
    { label: 'Net Balance', value: formatCurrency(Math.abs(netBalance)) + (netBalance >= 0 ? ' (Dr)' : ' (Cr)'), color: DARK_COLOR },
  ];

  cards.forEach((card, i) => {
    const cx = margin + i * (cardWidth + 10);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(1);
    doc.roundedRect(cx, y, cardWidth, cardHeight, 8, 8, 'FD');

    doc.setFillColor(...card.color);
    doc.roundedRect(cx, y, 4, cardHeight, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...MUTED_COLOR);
    doc.text(card.label.toUpperCase(), cx + 16, y + 22);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...card.color);
    doc.text(card.value, cx + 16, y + 46);
  });

  return y + cardHeight;
}

export function generatePersonReport(personName: string, entries: LedgerEntry[]) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  drawHeader(doc, margin, pageWidth, 'Ledger Report');

  // ===== Person info card =====
  let y = 110;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 50, 8, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...DARK_COLOR);
  doc.text('Person:', margin + 16, y + 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(...BRAND_COLOR);
  doc.text(personName, margin + 70, y + 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...MUTED_COLOR);
  const entryCount = entries.length;
  doc.text(
    `${entryCount} transaction${entryCount !== 1 ? 's' : ''} on record`,
    margin + 16,
    y + 38,
  );

  // ===== Summary cards =====
  y += 70;
  const totalGiven = entries.filter(e => e.type === 'given').reduce((s, e) => s + e.amount, 0);
  const totalTaken = entries.filter(e => e.type === 'taken').reduce((s, e) => s + e.amount, 0);
  const netBalance = totalGiven - totalTaken;

  y = drawSummaryCards(doc, y, margin, contentWidth, totalGiven, totalTaken, netBalance);

  // ===== Transactions table =====
  y += 30;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...DARK_COLOR);
  doc.text('Transaction History', margin, y);

  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  autoTable(doc, {
    startY: y + 10,
    head: [['Date', 'Type', 'Amount']],
    body: sortedEntries.map(e => [formatDate(e.date), e.type === 'given' ? 'Given (Dr)' : 'Taken (Cr)', formatCurrency(e.amount)]),
    theme: 'striped',
    headStyles: {
      fillColor: DARK_COLOR,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [51, 65, 85],
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: contentWidth * 0.35 },
      1: { cellWidth: contentWidth * 0.40 },
      2: { halign: 'right', cellWidth: contentWidth * 0.25, fontStyle: 'bold' },
    },
    margin: { left: margin, right: margin },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 1) {
        const type = data.cell.raw as string;
        if (type.startsWith('Given')) {
          data.cell.styles.textColor = EMERALD;
        } else {
          data.cell.styles.textColor = ROSE;
        }
      }
    },
  });

  addFooter(doc, margin, pageWidth, pageHeight);
  doc.save(`Nexora_Ledger_${personName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
}

export function generateFullReport(entries: LedgerEntry[]) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  drawHeader(doc, margin, pageWidth, 'Full Ledger Report');

  // ===== Info card =====
  let y = 110;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 50, 8, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...DARK_COLOR);
  doc.text('Scope:', margin + 16, y + 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(...BRAND_COLOR);
  doc.text('All Persons - Complete Ledger', margin + 60, y + 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...MUTED_COLOR);
  const personCount = new Set(entries.map(e => e.person)).size;
  doc.text(
    `${personCount} person${personCount !== 1 ? 's' : ''}, ${entries.length} transaction${entries.length !== 1 ? 's' : ''} on record`,
    margin + 16,
    y + 38,
  );

  // ===== Summary cards =====
  y += 70;
  const totalGiven = entries.filter(e => e.type === 'given').reduce((s, e) => s + e.amount, 0);
  const totalTaken = entries.filter(e => e.type === 'taken').reduce((s, e) => s + e.amount, 0);
  const netBalance = totalGiven - totalTaken;

  y = drawSummaryCards(doc, y, margin, contentWidth, totalGiven, totalTaken, netBalance);

  // ===== Transactions table with Person column =====
  y += 30;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...DARK_COLOR);
  doc.text('Transaction History', margin, y);

  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  autoTable(doc, {
    startY: y + 10,
    head: [['Date', 'Person', 'Type', 'Amount']],
    body: sortedEntries.map(e => [formatDate(e.date), e.person, e.type === 'given' ? 'Given (Dr)' : 'Taken (Cr)', formatCurrency(e.amount)]),
    theme: 'striped',
    headStyles: {
      fillColor: DARK_COLOR,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [51, 65, 85],
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: contentWidth * 0.20 },
      1: { cellWidth: contentWidth * 0.35 },
      2: { cellWidth: contentWidth * 0.25 },
      3: { halign: 'right', cellWidth: contentWidth * 0.20, fontStyle: 'bold' },
    },
    margin: { left: margin, right: margin },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 2) {
        const type = data.cell.raw as string;
        if (type.startsWith('Given')) {
          data.cell.styles.textColor = EMERALD;
        } else {
          data.cell.styles.textColor = ROSE;
        }
      }
    },
  });

  addFooter(doc, margin, pageWidth, pageHeight);
  doc.save(`Nexora_Ledger_Full_Report_${new Date().toISOString().split('T')[0]}.pdf`);
}
