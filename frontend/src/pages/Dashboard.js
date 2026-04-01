import React from 'react';
import { Zap, DollarSign, Activity } from 'lucide-react';
import { Card, Badge, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from '@tremor/react';
import KPICard from '../components/dashboard/KPICard';
import { chartData } from '../data/mockData';

const Dashboard = ({ user, summary, invoices }) => {
  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 transition-colors">
          Good afternoon, {user?.name || 'Guest'}
        </h1>
        <p className="text-sm lg:text-base text-slate-500 dark:text-slate-400">Here's the current state of your energy ecosystem.</p>
      </div>

      {/* Context Card */}
      <Card className="bg-indigo-600 border-none shadow-lg shadow-indigo-200/50 p-4 lg:p-6 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Campsite Facility Optimization</h3>
            <p className="text-indigo-100 text-sm max-w-lg">
              Your primary facility is currently running {summary.alerts ? 'above' : 'within'} seasonal average.
              {summary.alerts && " " + summary.alerts}
            </p>
          </div>
          <Badge color="indigo" className="bg-white/20 text-white border-none shrink-0">Optimization Ready</Badge>
        </div>
      </Card>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <KPICard
          title="Prev. Month Consumption"
          value={`${(summary.prev_month_kwh || 0).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kWh`}
          icon={Zap}
          data={chartData}
          color="indigo"
        />
        <KPICard
          title="Prev. Month Cost"
          value={`${(summary.prev_month_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ден`}
          icon={DollarSign}
          data={chartData}
          color="emerald"
        />
        <KPICard
          title="Avg. Daily Usage"
          value={`${(summary.avg_daily_usage || 0).toFixed(2)} kWh`}
          icon={Activity}
          data={chartData}
          color="amber"
        />
        <KPICard
          title="Total Consumption"
          value={`${(summary.total_kwh || 0).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kWh`}
          icon={Zap}
          data={chartData}
          color="blue"
        />
        <KPICard
          title="Total Cost"
          value={`${(summary.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ден`}
          icon={DollarSign}
          data={chartData}
          color="cyan"
        />
      </div>

      {/* Invoices Table */}
      <div className="overflow-hidden">
         <Card className="border-slate-200 dark:border-slate-800 shadow-sm p-0 overflow-hidden bg-white dark:bg-slate-900 transition-colors">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Recent Invoices</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHead className="bg-slate-50 dark:bg-slate-800/50">
                <TableRow>
                  <TableHeaderCell className="dark:text-slate-400">Invoice #</TableHeaderCell>
                  <TableHeaderCell className="dark:text-slate-400">Amount</TableHeaderCell>
                  <TableHeaderCell className="dark:text-slate-400">kWh</TableHeaderCell>
                  <TableHeaderCell className="dark:text-slate-400">Due Date</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.slice(0, 5).map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <TableCell className="font-medium text-slate-900 dark:text-slate-100">{item.invoice_number || 'Manual'}</TableCell>
                    <TableCell className="dark:text-slate-300">{(item.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} ден</TableCell>
                    <TableCell className="dark:text-slate-300">{item.kwh || 'N/A'}</TableCell>
                    <TableCell className="dark:text-slate-300">{item.due_date || item.created_at}</TableCell>
                  </TableRow>
                ))}
                {invoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-slate-500 dark:text-slate-400">No invoices found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
