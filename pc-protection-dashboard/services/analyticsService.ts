import { AnalyticsEntry } from '../types';

// T-06: This service now fetches data from the real API endpoint.
export const analyticsService = {
  getLatestEntries: async (): Promise<AnalyticsEntry[]> => {
    try {
      // The frontend will make a request to this relative path.
      // In development, you'll need to proxy this request to your C# backend.
      // In production, the API and frontend can be served under the same domain.
      const response = await fetch('https://system-monitoring-zjlj.onrender.com/api/Analytics');

      if (!response.ok) {
        // The App.tsx component will catch this error.
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data: AnalyticsEntry[] = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch analytics data:", error);
      // Re-throw the error to be handled by the calling component.
      throw error;
    }
  },
};
