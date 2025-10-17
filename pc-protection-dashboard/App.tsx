
import React, { useState, useEffect } from 'react';
import { AnalyticsEntry } from './types';
import { analyticsService } from './services/analyticsService';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [data, setData] = useState<AnalyticsEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      setError(null);
      const result = await analyticsService.getLatestEntries();
      setData(result);
      console.log("Fetched analytics data:", result);
    } catch (err) {
      setError('Failed to fetch analytics data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    
    let intervalId: number;
    if (isSimulating) {
        intervalId = window.setInterval(() => {
            fetchData();
        }, 15000); // T-02: Data collection every 15 seconds
    }

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [isSimulating]);
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">PC Protection Dashboard</h1>
            <p className="text-gray-400">Real-time system monitoring and analytics.</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`text-sm font-medium ${isSimulating ? 'text-green-400' : 'text-yellow-400'}`}>
              {isSimulating ? 'Live Simulation' : 'Paused'}
            </span>
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-lg shadow-md transition-colors duration-300"
            >
              {isSimulating ? 'Pause' : 'Resume'}
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <p className="text-xl">Loading initial data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 text-red-300 p-4 rounded-lg text-center">
            <p>{error}</p>
          </div>
        ) : (
          <Dashboard data={data} />
        )}
      </div>
    </div>
  );
};

export default App;
