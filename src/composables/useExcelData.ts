import { ref } from "vue";
import * as XLSX from "xlsx"; //js套件 讀取 Excel檔案
import axios from "axios";
import type {
  TInvoiceRecord,
  TCountryCustomerStats,
  TDailyInvoiceStats,
} from "../types/invoice";

//轉換Excel時間 to  jS Date
function excelDateToJSDate(serial: number): Date {
  const utc_days = Math.floor(serial - 25569); //25569 => 1970-01-01的Excel序列日期
  const utc_value = utc_days * 86400; //1天=>86400秒
  return new Date(utc_value * 1000); //js Data 使用毫秒=>轉換成秒數
}

//format Date to YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function useExcelData() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const countryStats = ref<TCountryCustomerStats[]>([]);
  const dailyStats = ref<TDailyInvoiceStats[]>([]);

  async function loadData() {
    loading.value = true;
    error.value = null;

    try {
      // import.meta.env.BASE_URL 會自動取得 vite.config.ts 的 base 設定
      const response = await axios.get(`${import.meta.env.BASE_URL}exam.xlsx`, {
        responseType: "arraybuffer", //responseType=>限制取回的資料格式  ArrayBuffer 是 JavaScript 用來表示原始二進位資料的物件
      });
      const arrayBuffer = response.data;
      const workbook = XLSX.read(arrayBuffer, { type: "array" }); //type=>指定讀取的資料格式  array=>表示資料是以陣列形式提供的
      //workbook =>表示整個Excel檔案(物件)
      const sheetName = workbook.SheetNames[0]!; //分頁名稱
      const sheet = workbook.Sheets[sheetName]!; //用名稱去取得該分頁的「內容」
      const rawData: TInvoiceRecord[] = XLSX.utils.sheet_to_json(sheet);
      //sheet_to_json =>將Excel分頁的內容轉換成JSON格式的陣列  每一列資料會被轉換成一個物件，物件的屬性名稱對應到Excel的欄位名稱
      // 第一列（標題列）會自動變成每個物件的 key，後面的資料列變成對應的 value。

      //計算各個國家的 CustomerID 數量
      const countryCustomerMap = new Map<string, Set<number>>(); //Map物件  key: Country  value: Set(CustomerID)
      rawData.forEach((record) => {
        if (record.Country && record.CustomerID) {
          if (!countryCustomerMap.has(record.Country)) {
            countryCustomerMap.set(record.Country, new Set()); //new Set() 保持 CustomerID的唯一性，避免重複計算同一個 CustomerID
          }
          countryCustomerMap.get(record.Country)!.add(record.CustomerID); //record.Country取出對應的Set，然後加入CustomerID
        }
      });

      countryStats.value = Array.from(countryCustomerMap.entries()) //entries() =>將Map物件轉換成陣列，每個元素是[key, value]的形式
        .map(([country, customers]) => ({
          //解構  country: key  customers: value
          country,
          customerCount: customers.size,
        }))
        .sort((a, b) => b.customerCount - a.customerCount); //根據customerCount進行排序，從大到小

      //計算每天的 InvoiceDate 數量
      const dateCountMap = new Map<string, number>(); //算總數故不用Set去重
      rawData.forEach((record) => {
        if (record.InvoiceDate) {
          const date = excelDateToJSDate(record.InvoiceDate); //將Excel的序列日期轉換成JavaScript的Date物件
          const dateStr = formatDate(date); //將Date物件格式化成YYYY-MM-DD的字串
          dateCountMap.set(dateStr, (dateCountMap.get(dateStr) || 0) + 1); //如果dateStr已經存在於dateCountMap中，則取出當前的計數值並加1；如果不存在，則使用0作為初始值，然後加1 最後將更新後的計數值存回dateCountMap中。這樣就能統計每個日期出現的次數了
        }
      });

      dailyStats.value = Array.from(dateCountMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch (e) {
      //ts的catch預設是unknown類型 需要進行類型縮小
      error.value = e instanceof Error ? e.message : "Failed to load data";
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    countryStats,
    dailyStats,
    loadData,
  };
}
