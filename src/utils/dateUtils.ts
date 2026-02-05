/**
 * 將 Excel 序列日期轉換成 JavaScript Date 物件
 * Excel 的日期是從 1900-01-01 開始的天數
 * JavaScript 的 Date 是從 1970-01-01 開始的毫秒數
 *
 * @param serial - Excel 序列日期數字 (例如: 40513)
 * @returns JavaScript Date 物件
 */
export function excelDateToJSDate(serial: number): Date {
  const utc_days = Math.floor(serial - 25569); // 25569 是 1970-01-01 在 Excel 的序列日期
  const utc_value = utc_days * 86400; // 1天 = 86400秒
  return new Date(utc_value * 1000); // JavaScript 用毫秒
}

/**
 * 將 Date 物件格式化成 YYYY-MM-DD 字串
 *
 * @param date - JavaScript Date 物件
 * @returns 格式化後的日期字串 (例如: "2010-12-01")
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
