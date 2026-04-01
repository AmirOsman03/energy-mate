import React from 'react';
import { Card, Title, Text, AreaChart, BarChart, DonutChart, Flex, Grid, Button } from '@tremor/react';
import { Filter, TrendingUp, TrendingDown, Info, Calendar, RefreshCw } from 'lucide-react';

const Analytics = ({ data, onRefresh }) => {
  if (!data || !data.monthly_trend || data.monthly_trend.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full">
          <TrendingUp size={32} className="text-slate-400" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Analytics Data</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1 mb-4">
            We couldn't find enough invoice data to generate your reports. Try syncing your Gmail invoices first.
          </p>
          <Button 
            variant="secondary" 
            icon={RefreshCw} 
            onClick={onRefresh}
            className="rounded-xl"
          >
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  const { monthly_trend, seasonal_breakdown, total_spent, avg_monthly, peak_usage_kwh, peak_month } = data;

  return (
    <div className="pb-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Header */}
      <div className="flex justify-between items-end px-1">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Energy Overview
          </h1>
          <Text className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 mt-1">
            <Calendar size={14} /> 2026
          </Text>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            icon={RefreshCw} 
            onClick={onRefresh}
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm"
          />
          <Button 
            variant="secondary" 
            icon={Filter} 
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm"
          />
        </div>
      </div>

      {/* KPI Cards Section (Horizontal Scroll) */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 no-scrollbar snap-x">
        {[
          { label: 'Total Spent', value: `${total_spent.toLocaleString()} ден.`, sub: 'Lifetime total', trend: 'info' },
          { label: 'Avg. Monthly', value: `${avg_monthly.toLocaleString()} ден.`, sub: 'Calculated average', trend: 'down' },
          { label: 'Peak Usage', value: `${peak_usage_kwh.toLocaleString()} kWh`, sub: `${peak_month}`, trend: 'up' },
        ].map((kpi, idx) => (
          <Card key={idx} className="min-w-[240px] snap-start bg-white dark:bg-slate-900 border-none shadow-sm rounded-3xl p-6 transition-all active:scale-95">
            <Text className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">{kpi.label}</Text>
            <Title className="text-xl font-bold text-slate-900 dark:text-white mb-2">{kpi.value}</Title>
            <Flex justifyContent="start" className="gap-1.5">
              {kpi.trend === 'up' && <TrendingUp size={14} className="text-rose-500" />}
              {kpi.trend === 'down' && <TrendingDown size={14} className="text-emerald-500" />}
              {kpi.trend === 'info' && <Info size={14} className="text-indigo-500" />}
              <span className={`text-xs font-semibold ${
                kpi.trend === 'up' ? 'text-rose-500' : 
                kpi.trend === 'down' ? 'text-emerald-500' : 'text-slate-500'
              }`}>
                {kpi.sub}
              </span>
            </Flex>
          </Card>
        ))}
      </div>

      {/* Main Chart (Monthly Trend) */}
      <Card className="rounded-3xl border-none shadow-sm bg-white dark:bg-slate-900 p-6 lg:p-8 transition-colors">
        <Title className="text-lg font-bold text-slate-900 dark:text-white mb-6">Monthly Cost Trend</Title>
        <AreaChart
          className="h-72 mt-4"
          data={monthly_trend}
          index="month"
          categories={['cost']}
          colors={['indigo']}
          showLegend={false}
          showGridLines={false}
          curveType="monotone"
          valueFormatter={(number) => `${Intl.NumberFormat('mk-MK').format(number).toString()} ден.`}
        />
      </Card>

      <Grid numItemsLg={2} className="gap-6">
        {/* Seasonal Overview */}
        <Card className="rounded-3xl border-none shadow-sm bg-white dark:bg-slate-900 p-6 transition-colors">
          <Title className="text-lg font-bold text-slate-900 dark:text-white mb-6">Seasonal Breakdown</Title>
          <BarChart
            className="h-64 mt-4"
            data={seasonal_breakdown}
            index="name"
            categories={['cost']}
            colors={['indigo']}
            showLegend={false}
            showGridLines={false}
            valueFormatter={(number) => `${Intl.NumberFormat('mk-MK').format(number).toString()} ден.`}
          />
        </Card>

        {/* Distribution Section */}
        <Card className="rounded-3xl border-none shadow-sm bg-white dark:bg-slate-900 p-6 transition-colors">
          <Title className="text-lg font-bold text-slate-900 dark:text-white mb-6">Cost Distribution</Title>
          <DonutChart
            className="h-64 mt-4"
            data={seasonal_breakdown}
            category="cost"
            index="name"
            colors={['indigo', 'blue', 'cyan', 'sky']}
            variant="pie"
            valueFormatter={(number) => `${Intl.NumberFormat('mk-MK').format(number).toString()} ден.`}
          />
        </Card>
      </Grid>

      {/* Insights Section */}
      <Card className="rounded-3xl border-none shadow-sm bg-white dark:bg-slate-900 p-6 transition-colors">
        <Title className="text-lg font-bold text-slate-900 dark:text-white mb-6">Smart Insights</Title>
        <div className="space-y-4">
          {[
            { icon: Info, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: `Highest bill was in ${peak_month} (${peak_usage_kwh.toLocaleString()} kWh).` },
            { icon: TrendingUp, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'Consider reducing consumption during peak winter months.' },
            { icon: TrendingDown, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: `Your average monthly spending is ${avg_monthly.toLocaleString()} ден.` },
          ].map((insight, idx) => (
            <Flex key={idx} justifyContent="start" className="gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40">
              <div className={`p-2 rounded-xl ${insight.bg} ${insight.color}`}>
                <insight.icon size={20} />
              </div>
              <Text className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {insight.text}
              </Text>
            </Flex>
          ))}
        </div>
      </Card>

      {/* Bottom Spacing for iPhone Safe Area */}
      <div className="h-4" />
    </div>
  );
};

export default Analytics;
