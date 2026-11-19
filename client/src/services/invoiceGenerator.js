import { jsPDF } from 'jspdf';

export const generateInvoicePDF = (order) => {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Colors
  const navy = [16, 42, 67]; // #102A43
  const blue = [37, 99, 235]; // #2563EB
  const gray = [100, 116, 139];
  const darkGray = [30, 41, 59];

  // Header Banner
  doc.setFillColor(...navy);
  doc.rect(0, 0, pageWidth, 36, 'F');

  // Business Name & Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('MERCURY DRYCLEANERS', 14, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(190, 215, 255);
  doc.text('Your Clothes. Our Care. Always Fresh.', 14, 23);
  doc.text('Ghumar Mandi, Ludhiana, Punjab, India | +91 78149 66031', 14, 29);

  // Invoice Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('INVOICE / RECEIPT', pageWidth - 14, 18, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice: ${order.invoiceNumber || 'INV-' + order.orderId}`, pageWidth - 14, 25, { align: 'right' });
  doc.text(`Date: ${order.preferredDate || new Date().toISOString().split('T')[0]}`, pageWidth - 14, 30, { align: 'right' });

  // Bill To & Order Summary Section
  doc.setTextColor(...darkGray);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('BILLED TO:', 14, 48);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(order.customerName || 'Customer', 14, 54);
  doc.text(`Phone: ${order.customerPhone || 'N/A'}`, 14, 60);
  if (order.customerEmail) {
    doc.text(`Email: ${order.customerEmail}`, 14, 66);
  }
  const street = order.pickupAddress?.street ? `${order.pickupAddress.street}, ${order.pickupAddress.city || 'Ludhiana'}` : 'Ghumar Mandi Store';
  doc.text(`Address: ${street}`, 14, 72);

  // Order Details Box (Right)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('ORDER SUMMARY:', pageWidth - 90, 48);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Order ID: ${order.orderId}`, pageWidth - 90, 54);
  doc.text(`Booking Type: ${order.bookingType === 'pickup' ? 'Doorstep Pickup' : 'Store Drop-off'}`, pageWidth - 90, 60);
  doc.text(`Pickup/Drop Date: ${order.preferredDate} (${order.preferredTimeSlot || ''})`, pageWidth - 90, 66);
  doc.text(`Payment Status: ${order.paymentStatus || 'Pending'} (${(order.paymentPreference || 'Cash').toUpperCase()})`, pageWidth - 90, 72);

  // Garment Items Table Header
  const startY = 82;
  doc.setFillColor(234, 243, 255);
  doc.rect(14, startY, pageWidth - 28, 8, 'F');

  doc.setTextColor(...navy);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('GARMENT ITEM', 18, startY + 5.5);
  doc.text('SERVICE TYPE', 85, startY + 5.5);
  doc.text('QTY', 130, startY + 5.5, { align: 'center' });
  doc.text('RATE (INR)', 155, startY + 5.5, { align: 'right' });
  doc.text('TOTAL (INR)', pageWidth - 18, startY + 5.5, { align: 'right' });

  // Table Body
  let currentY = startY + 12;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkGray);

  const items = Array.isArray(order.items) && order.items.length > 0
    ? order.items
    : [{ garmentName: 'Garment Care Package', serviceType: 'Dry Cleaning', quantity: 1, unitPrice: order.subtotal || order.finalTotal, total: order.subtotal || order.finalTotal }];

  items.forEach((item, index) => {
    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, currentY - 4, pageWidth - 28, 7, 'F');
    }
    doc.text(item.garmentName || 'Garment', 18, currentY);
    doc.text(item.serviceType || 'Dry Cleaning', 85, currentY);
    doc.text(String(item.quantity || 1), 130, currentY, { align: 'center' });
    doc.text(`Rs. ${item.unitPrice || 0}`, 155, currentY, { align: 'right' });
    doc.text(`Rs. ${item.total || 0}`, pageWidth - 18, currentY, { align: 'right' });
    currentY += 7;
  });

  // Divider Line
  currentY += 4;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, currentY, pageWidth - 14, currentY);
  currentY += 6;

  // Totals Box (Right Side)
  const totalsX = pageWidth - 90;
  doc.setFontSize(9);
  doc.setTextColor(...gray);

  doc.text('Subtotal:', totalsX, currentY);
  doc.text(`Rs. ${order.subtotal || 0}`, pageWidth - 18, currentY, { align: 'right' });
  currentY += 6;

  if (order.discount && order.discount > 0) {
    doc.text(`Discount (${order.couponApplied?.code || 'Promo'}):`, totalsX, currentY);
    doc.setTextColor(22, 101, 52); // green
    doc.text(`- Rs. ${order.discount}`, pageWidth - 18, currentY, { align: 'right' });
    doc.setTextColor(...gray);
    currentY += 6;
  }

  if (order.pickupCharge && order.pickupCharge > 0) {
    doc.text('Pickup Fee:', totalsX, currentY);
    doc.text(`Rs. ${order.pickupCharge}`, pageWidth - 18, currentY, { align: 'right' });
    currentY += 6;
  }

  if (order.taxes && order.taxes > 0) {
    doc.text('Taxes (GST 5%):', totalsX, currentY);
    doc.text(`Rs. ${order.taxes}`, pageWidth - 18, currentY, { align: 'right' });
    currentY += 6;
  }

  // Grand Total Box
  doc.setFillColor(...navy);
  doc.rect(totalsX - 4, currentY, pageWidth - totalsX - 10, 9, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('FINAL TOTAL:', totalsX, currentY + 6);
  doc.text(`Rs. ${order.finalTotal || 0}`, pageWidth - 18, currentY + 6, { align: 'right' });

  // Special Notes
  if (order.specialInstructions || order.stainsNotes) {
    currentY += 16;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...navy);
    doc.text('GARMENT CARE & INSPECTION NOTES:', 14, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...darkGray);
    if (order.specialInstructions) {
      doc.text(`Instructions: ${order.specialInstructions}`, 14, currentY + 5);
      currentY += 5;
    }
    if (order.stainsNotes) {
      doc.text(`Stains / Delicate Note: ${order.stainsNotes}`, 14, currentY + 5);
      currentY += 5;
    }
  }

  // Footer notes & terms
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 260, pageWidth - 14, 260);

  doc.setFontSize(8);
  doc.setTextColor(...gray);
  doc.text('Care Guarantee: Every garment is treated using certified eco-solvents and specialized vacuum finishing.', 14, 266);
  doc.text('Shop Address: Mercury Drycleaners, Main Market, Ghumar Mandi, Ludhiana, Punjab 141001.', 14, 271);
  doc.text('For questions regarding this invoice, contact us at +91 78149 66031 or garvv22@gmail.com', 14, 276);

  // Save the PDF
  doc.save(`Mercury_Invoice_${order.orderId}.pdf`);
};
