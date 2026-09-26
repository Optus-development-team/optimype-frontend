import { jsPDF } from 'jspdf';
import { DEMO_COMPANY_NAME, DEMO_ROLE } from '@/lib/dashboardConstants';

/**
 * Generates a Products & Stock PDF report using jsPDF (no canvas).
 * @param {Array} products – array from useDemoData
 */
function exportProductsPDF(products) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const now = new Date();

  // ── Brand colours ──────────────────────────────────────
  const NAVY   = [0,   43,  91];   // #002B5B
  const CYAN   = [6,  182, 212];   // #06B6D4
  const WHITE  = [255, 255, 255];
  const LIGHT  = [241, 245, 249];  // table row alt
  const DARK   = [30,  41,  59];   // text
  const GREEN  = [34, 197, 94];
  const RED    = [239, 68,  68];

  // ── Header bar ─────────────────────────────────────────
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageW, 22, 'F');

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('OptuSBMS  ·  Products & Stock Report', 12, 14);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Company: ${DEMO_COMPANY_NAME}`, pageW - 12, 8, { align: 'right' });
  doc.text(`Generated: ${now.toLocaleString()}`, pageW - 12, 14, { align: 'right' });

  // ── Summary strip ──────────────────────────────────────
  const total    = products.length;
  const lowStock = products.filter(p => p.current_stock <= p.reorder_point).length;
  const ok       = total - lowStock;

  doc.setFillColor(...CYAN);
  doc.rect(0, 22, pageW, 12, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text(`Total products: ${total}`, 12, 30);
  doc.text(`OK: ${ok}`, 80, 30);
  doc.text(`Needs reorder: ${lowStock}`, 130, 30);

  // ── Table ──────────────────────────────────────────────
  const cols = [
    { header: 'SKU',          w: 40 },
    { header: 'Name',         w: 70 },
    { header: 'Stock',        w: 30, align: 'right' },
    { header: 'Reorder Point',w: 40, align: 'right' },
    { header: 'Status',       w: 30, align: 'center' },
  ];

  const startX  = 12;
  let   cursorY = 42;
  const rowH    = 9;

  // Table header row
  doc.setFillColor(...NAVY);
  doc.rect(startX, cursorY, pageW - startX * 2, rowH, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...WHITE);

  let xPos = startX + 3;
  cols.forEach(col => {
    doc.text(col.header, xPos, cursorY + 6, { align: col.align === 'right' ? 'right' : col.align === 'center' ? 'center' : 'left', baseline: 'alphabetic' });
    xPos += col.w;
  });

  cursorY += rowH;

  // Data rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  products.forEach((p, i) => {
    const needsReorder = p.current_stock <= p.reorder_point;

    // Alternate row background
    if (i % 2 === 0) {
      doc.setFillColor(...LIGHT);
      doc.rect(startX, cursorY, pageW - startX * 2, rowH, 'F');
    }

    doc.setTextColor(...DARK);
    let cx = startX + 3;

    // SKU
    doc.text(String(p.sku ?? ''), cx, cursorY + 6); cx += cols[0].w;
    // Name
    doc.text(String(p.name ?? ''), cx, cursorY + 6); cx += cols[1].w;
    // Stock (right-aligned)
    doc.text(String(p.current_stock ?? 0), cx - 3, cursorY + 6, { align: 'right' }); cx += cols[2].w;
    // Reorder Point (right-aligned)
    doc.text(String(p.reorder_point ?? 0), cx - 3, cursorY + 6, { align: 'right' }); cx += cols[3].w;
    // Status badge (coloured text)
    doc.setTextColor(...(needsReorder ? RED : GREEN));
    doc.setFont('helvetica', 'bold');
    doc.text(needsReorder ? 'REORDER' : 'OK', cx - 3, cursorY + 6, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...DARK);

    cursorY += rowH;

    // New page if needed
    if (cursorY > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      cursorY = 20;
    }
  });

  // ── Footer line ────────────────────────────────────────
  doc.setDrawColor(...CYAN);
  doc.setLineWidth(0.5);
  doc.line(startX, cursorY + 4, pageW - startX, cursorY + 4);
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('OptuSBMS – Confidential', startX, cursorY + 9);
  doc.text(`Page 1 of ${doc.getNumberOfPages()}`, pageW - startX, cursorY + 9, { align: 'right' });

  doc.save(`optus-products-${now.toISOString().slice(0, 10)}.pdf`);
}

export const DashboardHeader = ({ products = [], productsLoading = false }) => {
  return (
    <div className="dashboard-header">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="logo-box" style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #06B6D4 0%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
            }}>
              <i className="fas fa-building" style={{ fontSize: '1.5rem', color: 'white' }}></i>
            </div>
            <div>
              <h1>OptuSBMS</h1>
              <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: 0 }}>{DEMO_COMPANY_NAME}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportProductsPDF(products)}
              disabled={productsLoading || products.length === 0}
              className="company-badge"
              style={{
                cursor: productsLoading || products.length === 0 ? 'not-allowed' : 'pointer',
                opacity: productsLoading || products.length === 0 ? 0.5 : 1,
                background: 'transparent',
                border: '2px solid var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.3s ease',
              }}
              title="Export Products & Stock as PDF"
            >
              <i className="fas fa-file-pdf"></i>
              Export PDF
            </button>
            <div className="company-badge">
              <i className="fas fa-user-shield" style={{ marginRight: '0.5rem' }}></i>
              {DEMO_ROLE}
            </div>
            <div className="live-indicator">
              <span className="live-indicator-dot"></span>
              <span className="live-indicator-text">Real-time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
