import { ref } from "vue";
import axios from "axios";
import type {
  TCountryCustomerStats,
  TDailyInvoiceStats,
} from "../types/invoice";

/**
 * 載入預處理好的統計資料
 *
 * 優化說明：
 * - 原本：載入 23MB Excel + 遍歷 51 萬筆資料
 * - 現在：載入 12KB JSON（已預處理好的統計結果）
 * - 效能提升：載入速度快 100 倍以上，記憶體使用減少 99%
 */
export function useExcelData() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const countryStats = ref<TCountryCustomerStats[]>([]);
  const dailyStats = ref<TDailyInvoiceStats[]>([]);

  async function loadData() {
    loading.value = true;
    error.value = null;

    try {
      const baseUrl = import.meta.env.BASE_URL;
      //baseUrl: /chat-app-test/
      // 同時載入兩個 JSON 檔案（並行請求）
      const [countryResponse, dailyResponse] = await Promise.all([
        axios.get<TCountryCustomerStats[]>(`${baseUrl}countryStats.json`),
        axios.get<TDailyInvoiceStats[]>(`${baseUrl}dailyStats.json`),
      ]);

      countryStats.value = countryResponse.data;
      dailyStats.value = dailyResponse.data;
    } catch (e) {
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
