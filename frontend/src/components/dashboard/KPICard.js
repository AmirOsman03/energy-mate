import React from 'react';
import { Card, Text, Metric, Flex, SparkAreaChart } from '@tremor/react';

const KPICard = ({ title, value, icon: Icon, data, color }) => (
  <Card className="ring-indigo-600/5 shadow-sm border-slate-200">
    <Flex alignItems="start">
      <div className="space-y-1">
        <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{title}</Text>
        <Metric className="text-slate-900 font-bold">{value}</Metric>
      </div>
      <div className={`p-2 rounded-lg bg-${color}-50`}>
        <Icon size={20} className={`text-${color}-600`} />
      </div>
    </Flex>
    <div className="mt-4 h-12">
      <SparkAreaChart
        data={data}
        categories={['value']}
        index={'month'}
        colors={[color]}
        className="h-full w-full"
      />
    </div>
  </Card>
);

export default KPICard;
