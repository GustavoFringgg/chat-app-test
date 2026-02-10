<script setup lang="ts">
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import type { TDailyInvoiceStats } from "../types/invoice";

ChartJS.register(
  CategoryScale, // X 軸（類別軸，用來顯示日期）
  LinearScale, // Y 軸（線性軸，用來顯示發票數量）
  BarElement, // 長條圖的長條元素
  Title, // 圖表標題
  Tooltip, // 滑鼠 hover 提示框
  Legend, // 圖例（標籤說明）
);

const props = defineProps<{
  data: TDailyInvoiceStats[];
}>();

const chartData = computed<ChartData<"bar">>(() => {
  //計算長條圖資料
  return {
    labels: props.data.map((d) => d.date), // X 軸標籤，取出每一天的日期
    datasets: [
      {
        label: "Invoice Count (≥1000)", // 藍色標籤
        data: props.data.map((d) => (d.count >= 1000 ? d.count : null)), // 低於 1000 的給 null（不顯示）
        backgroundColor: "rgba(54, 162, 235, 1)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
      {
        label: "Invoice Count (<1000)", // 紅色標籤
        data: props.data.map((d) => (d.count < 1000 ? d.count : null)), // 高於 1000 的給 null
        backgroundColor: "rgba(255, 99, 132, 1 )",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
    ],
  };
});

const chartOptions = computed<ChartOptions<"bar">>(() => {
  // 長條圖選項
  return {
    responsive: true, // 圖表響應式，會自動調整大小以適應容器
    maintainAspectRatio: false, // 不維持原始寬高比，讓圖表可以填滿整個容器
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        // 滑鼠 hover 提示框
        callbacks: {
          label: (context) =>
            `Invoices: ${(context.parsed.y ?? 0).toLocaleString()}`,
        },
      },
    },
    // === 座標軸設定 ===
    scales: {
      x: {
        // X 軸（日期）
        title: {
          display: true,
          text: "Invoice Date", // X 軸標題
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 20,
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Invoices", // Y 軸標題
        },
        beginAtZero: true, // Y 軸從接近最小值開始，讓差異更明顯
        ticks: {
          callback: (value) => value.toLocaleString(),
        },
      },
    },
  };
});
</script>

<template>
  <div class="chart-container">
    <h2>Daily Invoice Count</h2>
    <div class="chart-wrapper">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-container h2 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.25rem;
}

.chart-wrapper {
  height: 400px;
}
</style>
