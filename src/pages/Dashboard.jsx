import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../api/services/dashboardService';
import { NeoCard } from '../components/NeoCard';
import { RecentActivities } from '../components/RecentActivities';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats().then(res => setStats(res.data));
  }, []);

  if (!stats) return <div className="p-8">Loading...</div>;

  return (
    <div className="w-full pb-10">
      <h1 className="text-4xl font-black mb-8 uppercase tracking-tight">System Overview</h1>

      {/* Baris Atas: Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <NeoCard color="bg-neo-yellow">
          <p className="font-bold uppercase text-sm mb-1">Pending PR</p>
          <p className="text-5xl font-black">{stats.widgets.pr_pending}</p>
        </NeoCard>
        
        <NeoCard color="bg-neo-blue">
          <p className="font-bold uppercase text-sm mb-1">Open Tenders</p>
          <p className="text-5xl font-black">{stats.widgets.tenders_open}</p>
        </NeoCard>

        <NeoCard color="bg-neo-green">
          <p className="font-bold uppercase text-sm mb-1">Completed PO</p>
          <p className="text-5xl font-black">{stats.widgets.po_completed}</p>
        </NeoCard>
      </div>

      {/* Baris Bawah: Finance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <NeoCard className="flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-black mb-4 uppercase">Budget Analysis</h2>
            <div className="space-y-4">
              <div className="flex justify-between font-bold">
                <span>Used Budget</span>
                <span>Rp {stats.finance.yearly_budget.used.toLocaleString('id-ID')}</span>
              </div>
              {/* Progress Bar Neubrutalism */}
              <div className="w-full h-8 border-2 border-black bg-white overflow-hidden">
                <div 
                  className="h-full bg-neo-red border-r-2 border-black" 
                  style={{ width: `${(stats.finance.yearly_budget.used / stats.finance.yearly_budget.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm font-bold italic">* Available: Rp {stats.finance.yearly_budget.available.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </NeoCard>

        <NeoCard color="bg-white">
          <h2 className="text-2xl font-black mb-4 uppercase">Monthly Spend</h2>
          <p className="text-4xl font-black text-neo-red">
            Rp {Number(stats.finance.monthly_expenditure).toLocaleString('id-ID')}
          </p>
          <p className="mt-4 font-medium italic">Data per bulan Mei 2026</p>
        </NeoCard>
      </div>

      <RecentActivities activities={stats.recent_activities} />
    </div>
  );
};

export default Dashboard;