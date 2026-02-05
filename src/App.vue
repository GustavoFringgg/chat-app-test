<script setup lang="ts">
import { onMounted } from "vue";
import { useExcelData } from "./composables/useExcelData";
import CountryPieChart from "./components/CountryPieChart.vue";
import DailyInvoiceBarChart from "./components/DailyInvoiceBarChart.vue";

const { loading, error, countryStats, dailyStats, loadData } = useExcelData();

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="app">
    <header>
      <h1>Invoice Data Analytics Dashboard</h1>
    </header>

    <main>
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading data...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>Error: {{ error }}</p>
        <button @click="loadData">Retry</button>
      </div>

      <div v-else class="charts-grid">
        <CountryPieChart :data="countryStats" />
        <DailyInvoiceBarChart :data="dailyStats" />
      </div>

      <div v-if="!loading && !error" class="stats-summary">
        <div class="stat-card">
          <h3>Total Countries</h3>
          <p class="stat-value">{{ countryStats.length }}</p>
        </div>
        <div class="stat-card">
          <h3>Total Unique Customers</h3>
          <p class="stat-value">
            {{
              countryStats
                .reduce((sum, s) => sum + s.customerCount, 0)
                .toLocaleString()
            }}
          </p>
        </div>
        <div class="stat-card">
          <h3>Total Days</h3>
          <p class="stat-value">{{ dailyStats.length }}</p>
        </div>
        <div class="stat-card">
          <h3>Total Invoices</h3>
          <p class="stat-value">
            {{
              dailyStats.reduce((sum, s) => sum + s.count, 0).toLocaleString()
            }}
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: #f5f7fa;
}

header {
  background: linear-gradient(135deg, #667eea 0%, #7b9ede 100%);
  color: white;
  padding: 20px;
  text-align: center;
}

header h1 {
  margin: 0;
  font-size: 1.75rem;
}

main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e0e0e0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
} /* css loading */

/* @keyframes 定義動畫 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error {
  text-align: center;
  padding: 40px;
  color: #e53935;
}

.error button {
  margin-top: 16px;
  padding: 8px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error button:hover {
  background: #5a6fd6;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  margin: 0 0 8px 0;
  font-size: 0.875rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
}

@media (max-width: 600px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
