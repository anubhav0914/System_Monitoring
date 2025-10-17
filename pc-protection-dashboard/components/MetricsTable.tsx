
import React from 'react';
import { AnalyticsEntry } from '../types';

interface MetricsTableProps {
  data: AnalyticsEntry[];
}

const MetricsTable: React.FC<MetricsTableProps> = ({ data }) => {
  const getSecurityEventBadge = (event: string) => {
    if (event.toLowerCase().includes('threat') || event.toLowerCase().includes('suspicious') || event.toLowerCase().includes('block')) {
        return <span className="px-2 py-1 text-xs font-semibold text-red-200 bg-red-800 rounded-full">{event}</span>
    }
    if (event.toLowerCase().includes('scan')) {
        return <span className="px-2 py-1 text-xs font-semibold text-blue-200 bg-blue-800 rounded-full">{event}</span>
    }
    return <span className="px-2 py-1 text-xs font-semibold text-gray-300 bg-gray-700 rounded-full">{event}</span>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3">Timestamp</th>
            <th scope="col" className="px-6 py-3 text-center">CPU (%)</th>
            <th scope="col" className="px-6 py-3 text-center">Memory (GB)</th>
            <th scope="col" className="px-6 py-3">Security Event</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.timestamp} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
              <td className="px-6 py-4 font-medium text-gray-200 whitespace-nowrap">
                {new Date(entry.timestamp).toLocaleString()}
              </td>
              <td className="px-6 py-4 text-center">{entry.cpuUsedPercent.toFixed(2)}</td>
              <td className="px-6 py-4 text-center">{entry.memoryUsedGb.toFixed(2)}</td>
              <td className="px-6 py-4">
                {getSecurityEventBadge(entry.securityEvent)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MetricsTable;
