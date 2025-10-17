
import React from 'react';
import { AnalyticsEntry } from '../types';
import StatusCard from './StatusCard';
import MetricsChart from './MetricsChart';
import MetricsTable from './MetricsTable';
import { CpuIcon, MemoryIcon, ShieldIcon } from './icons';

interface DashboardProps {
  data: AnalyticsEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const latestEntry = data.length > 0 ? data[0] : null;

  const getStatusColor = (value: number, thresholds: { warn: number, danger: number}) => {
    if (value >= thresholds.danger) return 'red';
    if (value >= thresholds.warn) return 'yellow';
    return 'green';
  }

  // FIX: Modified getSecurityStatus to accept a nullable entry and return a strongly typed object.
  // This ensures the color property has a literal type ('red', 'green', or 'gray') instead of a generic string.
  const getSecurityStatus = (entry: AnalyticsEntry | null): { color: 'red' | 'green' | 'gray', text: string } => {
    if (!entry) {
        return { color: 'gray', text: 'Unknown' };
    }
    const event = entry.securityEvent;
    if (event.toLowerCase().includes('threat') || event.toLowerCase().includes('suspicious') || event.toLowerCase().includes('block')) {
        return { color: 'red', text: 'Action Required' };
    }
    return { color: 'green', text: 'Secure' };
  }

  const cpuStatus = latestEntry ? getStatusColor(latestEntry.cpuUsedPercent, { warn: 60, danger: 85 }) : 'gray';
  const memoryStatus = latestEntry ? getStatusColor((latestEntry.memoryUsedGb / 16) * 100, { warn: 70, danger: 90 }) : 'gray'; // Assuming 16GB total memory
  const securityStatus = getSecurityStatus(latestEntry);

  return (
    <main>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatusCard
          title="CPU Utilization"
          value={latestEntry ? `${latestEntry.cpuUsedPercent}%` : 'N/A'}
          statusColor={cpuStatus}
          icon={<CpuIcon className="h-8 w-8" />}
        />
        <StatusCard
          title="Memory Used"
          value={latestEntry ? `${latestEntry.memoryUsedGb} GB` : 'N/A'}
          statusColor={memoryStatus}
          icon={<MemoryIcon className="h-8 w-8" />}
        />
        <StatusCard
          title="Security Status"
          value={latestEntry ? securityStatus.text : 'N/A'}
          description={latestEntry?.securityEvent}
          statusColor={securityStatus.color}
          icon={<ShieldIcon className="h-8 w-8" />}
        />
      </section>

      <section className="bg-gray-800 p-6 rounded-lg shadow-xl mb-6">
        <h2 className="text-xl font-bold mb-4 text-white">Performance History</h2>
        <MetricsChart data={data} />
      </section>

      <section className="bg-gray-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-white">Event Log</h2>
        <MetricsTable data={data} />
      </section>
    </main>
  );
};

export default Dashboard;
