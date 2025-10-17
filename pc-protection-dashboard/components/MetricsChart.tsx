
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AnalyticsEntry } from '../types';

interface MetricsChartProps {
  data: AnalyticsEntry[];
}

const MetricsChart: React.FC<MetricsChartProps> = ({ data }) => {
  const chartData = data.map(entry => ({
    time: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    CPU: entry.cpuUsedPercent,
    Memory: entry.memoryUsedGb,
  })).reverse();

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 5, right: 30, left: 0, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
          <XAxis dataKey="time" stroke="#9ca3af" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" stroke="#22d3ee" label={{ value: 'CPU (%)', angle: -90, position: 'insideLeft', fill: '#22d3ee', dy: 40 }} />
          <YAxis yAxisId="right" orientation="right" stroke="#a78bfa" label={{ value: 'Memory (GB)', angle: -90, position: 'insideRight', fill: '#a78bfa', dx: -20, dy: -40 }}/>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #444444' }}
            labelStyle={{ color: '#ffffff' }}
          />
          <Legend wrapperStyle={{ color: '#ffffff' }} />
          <Line yAxisId="left" type="monotone" dataKey="CPU" stroke="#22d3ee" strokeWidth={2} activeDot={{ r: 8 }} dot={{ r: 4 }}/>
          <Line yAxisId="right" type="monotone" dataKey="Memory" stroke="#a78bfa" strokeWidth={2} activeDot={{ r: 8 }} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsChart;
