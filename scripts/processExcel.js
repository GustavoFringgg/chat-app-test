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
import { excelDateToJSDate, formatDate } from "./utils.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("開始處理 Excel 檔案\n");
// 讀取 Excel
const excelPath = join(__dirname, "../public/exam.xlsx");
console.log(`讀取檔案: ${excelPath}`);

const workbook = XLSX.readFile(excelPath); // workbook =>表示整個Excel檔案(物件)
const sheetName = workbook.SheetNames[0]; // 分頁名稱
const sheet = workbook.Sheets[sheetName]; // 用名稱去取得該分頁的「內容」
const rawData = XLSX.utils.sheet_to_json(sheet);
//sheet_to_json =>將Excel分頁的內容轉換成JSON格式的陣列  每一列資料會被轉換成一個物件，物件的屬性名稱對應到Excel的欄位名稱
// 第一列（標題列）會自動變成每個物件的 key，後面的資料列變成對應的 value。

console.log(`總資料筆數: ${rawData.length.toLocaleString()} 筆\n`);

// 處理國家客戶統計
console.log("計算各國不重複客戶數...");
const countryCustomerMap = new Map();

rawData.forEach((record) => {
  if (record.Country && record.CustomerID) {
    if (!countryCustomerMap.has(record.Country)) {
      countryCustomerMap.set(record.Country, new Set()); //new Set() 保持 CustomerID的唯一性，避免重複計算同一個 CustomerID
    }
    countryCustomerMap.get(record.Country).add(record.CustomerID); //record.Country取出對應的Set，然後加入CustomerID
  }
});

const countryStats = Array.from(countryCustomerMap.entries()) //entries() =>將Map物件轉換成陣列，每個元素是[key, value]的形式
  .map(([country, customers]) => ({
    //解構  country: key  customers: value
    country,
    customerCount: customers.size,
  }))
  .sort((a, b) => b.customerCount - a.customerCount); //根據customerCount進行排序，從大到小

console.log(`國家數量: ${countryStats.length}`);

// 處理每日發票統計
console.log("計算每日發票數量...");
const dateCountMap = new Map();

rawData.forEach((record) => {
  if (record.InvoiceDate) {
    const date = excelDateToJSDate(record.InvoiceDate); //將Excel的序列日期轉換成JavaScript的Date物件
    const dateStr = formatDate(date); //將Date物件格式化成YYYY-MM-DD的字串
    dateCountMap.set(dateStr, (dateCountMap.get(dateStr) || 0) + 1); //如果dateStr已經存在於dateCountMap中，則取出當前的計數值並加1；如果不存在，則使用0作為初始值，然後加1 最後將更新後的計數值存回dateCountMap中。這樣就能統計每個日期出現的次數了
  }
});

const dailyStats = Array.from(dateCountMap.entries())
  .map(([date, count]) => ({ date, count }))
  .sort((a, b) => a.date.localeCompare(b.date));

console.log(`日期數量: ${dailyStats.length}\n`);

// 輸出 JSON 檔案，設定輸出路徑
const publicDir = join(__dirname, "../public");

// 產生 countryStats.json 和 dailyStats.json
const countryStatsPath = join(publicDir, "countryStats.json");
writeFileSync(countryStatsPath, JSON.stringify(countryStats, null, 2));
//將內容寫入檔案（Node.js 內建的 fs 模組）
//將 JS 陣列/物件轉成 JSON 字串，縮排 2 格
//JSON.stringify(value, replacer, space)
console.log(`已產生: ${countryStatsPath}`);

const dailyStatsPath = join(publicDir, "dailyStats.json");
writeFileSync(dailyStatsPath, JSON.stringify(dailyStats, null, 2));
console.log(`已產生: ${dailyStatsPath}`);

// 顯示檔案大小比較
const countryStatsSize = JSON.stringify(countryStats).length;
const dailyStatsSize = JSON.stringify(dailyStats).length;
const totalSize = countryStatsSize + dailyStatsSize;

console.log("\n優化效果:");
console.log(`   原始 Excel: ~23 MB`);
console.log(
  `   JSON 總大小: ${(totalSize / 1024).toFixed(2)} KB (${countryStatsSize + dailyStatsSize} bytes)`,
);
console.log(
  `   壓縮比: ${((1 - totalSize / (23 * 1024 * 1024)) * 100).toFixed(2)}%`,
);

console.log("\n處理完成");
