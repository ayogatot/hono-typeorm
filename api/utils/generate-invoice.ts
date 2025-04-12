function generateInvoiceId(prefix = "INV") {
  const now = new Date();

  const year = now.getFullYear().toString().slice(-2); // last two digits of year
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const datePart = `${year}${month}${day}`;

  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4-digit random number

  return `${prefix}-${datePart}-${randomPart}`;
}

export default generateInvoiceId;
