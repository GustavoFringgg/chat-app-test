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
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const props = defineProps<{
  data: TDailyInvoiceStats[];
}>();

const chartData = computed<ChartData<"bar">>(() => {
  return {
    labels: props.data.map((d) => d.date),
    datasets: [
      {
        label: "Invoice Count",
        data: props.data.map((d) => d.count),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };
});

const chartOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "top",
    },
    tooltip: {
      callbacks: {
        label: (context) =>
          `Invoices: ${(context.parsed.y ?? 0).toLocaleString()}`,
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Date",
      },
      ticks: {
        maxRotation: 45,
        minRotation: 45,
        autoSkip: true,
        maxTicksLimit: 30,
      },
    },
    y: {
      title: {
        display: true,
        text: "Number of Invoices",
      },
      beginAtZero: true,
      ticks: {
        callback: (value) => value.toLocaleString(),
      },
    },
  },
};
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
