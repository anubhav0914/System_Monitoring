
import React from 'react';

interface StatusCardProps {
  title: string;
  value: string;
  description?: string;
  statusColor: 'green' | 'yellow' | 'red' | 'gray';
  icon: React.ReactNode;
}

const colorClasses = {
  green: {
    bg: 'bg-green-500/10',
    border: 'border-green-500',
    text: 'text-green-400',
  },
  yellow: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500',
    text: 'text-yellow-400',
  },
  red: {
    bg: 'bg-red-500/10',
    border: 'border-red-500',
    text: 'text-red-400',
  },
  gray: {
    bg: 'bg-gray-600/10',
    border: 'border-gray-600',
    text: 'text-gray-400',
  },
};

const StatusCard: React.FC<StatusCardProps> = ({ title, value, description, statusColor, icon }) => {
  const classes = colorClasses[statusColor];

  return (
    <div className={`bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 ${classes.border} flex items-start space-x-4`}>
        <div className={`p-3 rounded-full ${classes.bg} ${classes.text}`}>
            {icon}
        </div>
        <div>
            <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-bold text-white">{value}</p>
            {description && <p className="text-xs text-gray-500 mt-1 truncate" title={description}>{description}</p>}
        </div>
    </div>
  );
};

export default StatusCard;
