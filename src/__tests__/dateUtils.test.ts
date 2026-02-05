import { describe, it, expect } from "vitest";
import { excelDateToJSDate, formatDate } from "../utils/dateUtils";

describe("dateUtils", () => {
  // ===== excelDateToJSDate 測試 =====
  describe("excelDateToJSDate", () => {
    it("應該正確轉換 Excel 日期 40513 為 2010-12-01", () => {
      const result = excelDateToJSDate(40513);
      expect(result.getFullYear()).toBe(2010);
      expect(result.getMonth()).toBe(11); // 月份從 0 開始，11 = 12月
      expect(result.getDate()).toBe(1);
    });

    it("應該正確轉換 Excel 日期 1 為 1900-01-01 附近", () => {
      const result = excelDateToJSDate(1);
      expect(result.getFullYear()).toBe(1899);
    });

    it("應該正確轉換 Excel 日期 44197 為 2021-01-01", () => {
      const result = excelDateToJSDate(44197);
      expect(result.getFullYear()).toBe(2021);
      expect(result.getMonth()).toBe(0); // 1月
      expect(result.getDate()).toBe(1);
    });
  });

  // ===== formatDate 測試 =====
  describe("formatDate", () => {
    it("應該格式化日期為 YYYY-MM-DD", () => {
      const date = new Date(2010, 11, 1); // 2010-12-01
      const result = formatDate(date);
      expect(result).toBe("2010-12-01");
    });

    it("月份和日期應該補零", () => {
      const date = new Date(2021, 0, 5); // 2021-01-05
      const result = formatDate(date);
      expect(result).toBe("2021-01-05");
    });

    it("應該正確處理年底日期", () => {
      const date = new Date(2023, 11, 31); // 2023-12-31
      const result = formatDate(date);
      expect(result).toBe("2023-12-31");
    });
  });
});
