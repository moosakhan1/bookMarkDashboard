"use client";

import { StatsCards } from "../../../components/dashboard/stats-cards";
import { RevenueCharts } from "../../../components/dashboard/revenue-charts";
import { TransactionHistory } from "../../../components/dashboard/transaction-history";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <StatsCards />

      {/* Revenue & Users Charts */}
      <RevenueCharts />

      {/* Transaction History Table */}
      <TransactionHistory />
    </div>
  );
}
