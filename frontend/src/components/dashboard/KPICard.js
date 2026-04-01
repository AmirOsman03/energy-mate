import React, { useState, useEffect } from 'react';
import { Card, Text, Metric, Flex, SparkAreaChart } from '@tremor/react';

const KPICard = ({ title, value, icon: Icon, data, color }) => {
  const [animatedData, setAnimatedData] = useState(data);

  // Synchronize animatedData with data prop when it changes (e.g. on load)
  useEffect(() => {
    if (data && data.length > 0) {
      setAnimatedData(data);
    }
  }, [data]);

  // Pulse effect: subtly jitter the data points using a sine wave
  useEffect(() => {
    if (!data || data.length === 0) return;

    let phase = 0;
    const interval = setInterval(() => {
      phase += 0.5; // Increment phase
      setAnimatedData(currentData => 
        currentData.map((item, idx) => ({
          ...item,
          // Add a pulse (+/- 5%) based on sine wave to create a smooth breathing motion
          value: item.value * (1 + (Math.sin(phase + idx) * 0.05))
        }))
      );
    }, 1000); // Update every 2 seconds for a constant "living" feel

    return () => clearInterval(interval);
  }, [data]);

  return (
    <Card className="ring-indigo-600/5 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <Flex alignItems="start">
        <div className="space-y-1">
          <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</Text>
          <Metric className="text-slate-900 dark:text-slate-50 font-bold">{value}</Metric>
        </div>
        <div className={`p-2 rounded-lg bg-${color}-50 dark:bg-${color}-900/20 transition-colors`}>
          <Icon size={20} className={`text-${color}-600 dark:text-${color}-400`} />
        </div>
      </Flex>
      <div className="mt-4 h-12">
        <SparkAreaChart
          key={title} // Static key to keep chart mounted
          data={animatedData}
          categories={['value']}
          index={'month'} 
          colors={[color]}
          className="h-full w-full"
          showAnimation={true}
          animationDuration={1800} // Longer duration for smooth path transitions
        />
      </div>
    </Card>
  );
};

export default KPICard;
