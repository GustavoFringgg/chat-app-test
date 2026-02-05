# Chart-App-Test

Invoice 數據分析儀表板 - 使用 Vue 3 composition api 讀取 Excel 並視覺化呈現

## 🌐 Demo

[https://gustavofringgg.github.io/chat-app-test/](https://gustavofringgg.github.io/chat-app-test/)

## 預覽

- 圓餅圖：各國不重複客戶數統計
- 長條圖：每日發票數量統計

## 技術棧

### Frontend

- **Vue 3** - Composition API
- **TypeScript** - 類型安全
- **Vite** - 快速打包工具
- **Chart.js + vue-chartjs** - 圖表視覺化
- **Axios** - HTTP 請求
- **XLSX** - Excel 檔案解析

### CI/CD

- **GitHub Actions** - 自動化流程
- **GitHub Pages** - 靜態網站託管

### Testing

- **Vitest** - 單元測試
- **ESLint** - 程式碼檢查

## 專案結構

```
chart-app/
├── .github/workflows/
│   └── deploy.yml           # CI/CD 設定
├── src/
│   ├── __tests__/           # 測試檔案
│   ├── components/          # Vue 元件
│   │   ├── CountryPieChart.vue
│   │   └── DailyInvoiceBarChart.vue
│   ├── composables/         # Composition API
│   │   └── useExcelData.ts
│   ├── types/               # TypeScript 類型
│   └── utils/               # 工具函式
├── public/
│   └── exam.xlsx            # Excel 資料
└── package.json
```

## 🚀 CI/CD 流程

```
git push -> 類型檢查 + 單元測試 --pass--> build --success--> deploy

```

## 安裝與執行

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 執行測試
npm run test

# 類型檢查
npm run type-check

# 打包
npm run build
```
