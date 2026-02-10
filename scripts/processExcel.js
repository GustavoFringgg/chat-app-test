/**
 * Excel 資料預處理腳本
 * 將 exam.xlsx 轉換成統計後的 JSON 檔案
 *
 * 用法: npm run process-data
 */

import XLSX from "xlsx";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Excel 日期轉換
function excelDateToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  return new Date(utc_value * 1000);
}

// 日期格式化
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

console.log("🚀 開始處理 Excel 檔案...\n");

// 讀取 Excel
const excelPath = join(__dirname, "../public/exam.xlsx");
console.log(`📂 讀取檔案: ${excelPath}`);

const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rawData = XLSX.utils.sheet_to_json(sheet);

console.log(`📊 總資料筆數: ${rawData.length.toLocaleString()} 筆\n`);

// 處理國家客戶統計
console.log("🔄 計算各國不重複客戶數...");
const countryCustomerMap = new Map();

rawData.forEach((record) => {
  if (record.Country && record.CustomerID) {
    if (!countryCustomerMap.has(record.Country)) {
      countryCustomerMap.set(record.Country, new Set());
    }
    countryCustomerMap.get(record.Country).add(record.CustomerID);
  }
});

const countryStats = Array.from(countryCustomerMap.entries())
  .map(([country, customers]) => ({
    country,
    customerCount: customers.size,
  }))
  .sort((a, b) => b.customerCount - a.customerCount);

console.log(`   ✅ 國家數量: ${countryStats.length}`);

// 處理每日發票統計
console.log("🔄 計算每日發票數量...");
const dateCountMap = new Map();

rawData.forEach((record) => {
  if (record.InvoiceDate) {
    const date = excelDateToJSDate(record.InvoiceDate);
    const dateStr = formatDate(date);
    dateCountMap.set(dateStr, (dateCountMap.get(dateStr) || 0) + 1);
  }
});

const dailyStats = Array.from(dateCountMap.entries())
  .map(([date, count]) => ({ date, count }))
  .sort((a, b) => a.date.localeCompare(b.date));

console.log(`   ✅ 日期數量: ${dailyStats.length}\n`);

// 輸出 JSON 檔案
const publicDir = join(__dirname, "../public");

const countryStatsPath = join(publicDir, "countryStats.json");
writeFileSync(countryStatsPath, JSON.stringify(countryStats, null, 2));
console.log(`📁 已產生: ${countryStatsPath}`);

const dailyStatsPath = join(publicDir, "dailyStats.json");
writeFileSync(dailyStatsPath, JSON.stringify(dailyStats, null, 2));
console.log(`📁 已產生: ${dailyStatsPath}`);

// 顯示檔案大小比較
const countryStatsSize = JSON.stringify(countryStats).length;
const dailyStatsSize = JSON.stringify(dailyStats).length;
const totalSize = countryStatsSize + dailyStatsSize;

console.log("\n📈 優化效果:");
console.log(`   原始 Excel: ~23 MB`);
console.log(
  `   JSON 總大小: ${(totalSize / 1024).toFixed(2)} KB (${countryStatsSize + dailyStatsSize} bytes)`,
);
console.log(
  `   壓縮比: ${((1 - totalSize / (23 * 1024 * 1024)) * 100).toFixed(2)}%`,
);

console.log("\n✨ 處理完成！");
