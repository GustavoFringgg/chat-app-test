<script setup lang="ts">
import { computed } from "vue";
import { Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  ArcElement, //圓餅圖弧形元素(圓餅圖需要)
  Tooltip, //滑鼠hover提示
  Legend, //圖例
  type ChartData,
  type ChartOptions,
} from "chart.js";
import type { TCountryCustomerStats } from "../types/invoice";

//註冊功能
ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps<{
  data: TCountryCustomerStats[];
}>();

//產生圓餅圖顏色的陣列
function generateColors(count: number): string[] {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * 360) / count; //計算色相角度
    colors.push(`hsl(${hue}, 70%, 60%)`);
  } //["hsl(0, 70%, 60%)", "hsl(90, 70%, 60%)", ...]
  return colors;
}

//計算圓餅圖資料
//ChartData<"bar">	長條圖
//ChartData<"line"> 折線圖
//<'pie'> => chart.js提供的TS型別
const chartData = computed<ChartData<"pie">>(() => {
  const topCountries = props.data.slice(0, 20); //能取前10名資料，因為composable有排序
  const others = props.data.slice(10); //剩下的資料歸類為others

  const labels = topCountries.map((d) => d.country); //取出前10名的國家名稱
  const values = topCountries.map((d) => d.customerCount); //取出前10的名的國家不重複數量

  if (others.length > 0) {
    labels.push("Others");
    values.push(others.reduce((sum, d) => sum + d.customerCount, 0));
  }

  const colors = generateColors(labels.length); //依照標籤數量去產生相對應的顏色

  return {
    labels, //圓餅圖區塊名稱
    datasets: [
      // 資料集（陣列)
      {
        data: values, // 圓餅圖區塊數值
        backgroundColor: colors, // 圓餅圖區塊背景顏色
        borderColor: colors.map((c) => c.replace("60%", "40%")), //讓邊框顏色暗一點
        borderWidth: 2,
      },
    ],
  };
});

const chartOptions: ChartOptions<"pie"> = {
  responsive: true, // 響應式：圖表會隨視窗大小自動縮放
  maintainAspectRatio: false, // 不維持固定比例：讓圖表填滿容器
  plugins: {
    // === 圖例設定（右邊那排國家名稱列表）===
    legend: {
      position: "right",
      labels: {
        font: {
          size: 12,
        },
      },
    },

    // === 滑鼠 hover 提示框設定 ===
    tooltip: {
      callbacks: {
        label: (context) => {
          // context <- Chart.js 自動傳入的參數
          const total = (context.dataset.data as number[]).reduce(
            (a, b) => a + b,
            0,
          );
          const value = context.parsed;
          const percentage = ((value / total) * 100).toFixed(1);
          return `${context.label}: ${value} customers ${percentage}%`;
        },
      },
    },
  },
};
</script>

<template>
  <div class="chart-container">
    <h2>Unique Customers by Country</h2>
    <div class="chart-wrapper">
      <Pie :data="chartData" :options="chartOptions" />
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
