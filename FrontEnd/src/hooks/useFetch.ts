import { useState, useEffect, useCallback } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetch<T>(
  url: string,
  options?: RequestInit,
  dependencies: any[] = []
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock data based on URL
      let mockData: any = null;

      if (url.includes('/staff/dashboard')) {
        mockData = {
          totalStudents: 1250,
          newRegistrations: 45,
          activeClasses: 42,
          certificatesIssued: 89,
          attendanceRate: 92.5,
          registrationTrend: [
            { month: 'Jan', count: 45 },
            { month: 'Feb', count: 52 },
            { month: 'Mar', count: 78 },
            { month: 'Apr', count: 65 },
            { month: 'May', count: 89 },
            { month: 'Jun', count: 120 },
          ],
          departmentDistribution: [
            { name: 'Computer Science', count: 245 },
            { name: 'Business Admin', count: 210 },
            { name: 'Engineering', count: 180 },
            { name: 'Arts & Humanities', count: 156 },
          ],
        };
      } else if (url.includes('/staff/departments')) {
        mockData = [
          {
            id: 1,
            name: 'Computer Science',
            code: 'CS',
            head: 'Dr. Dara',
            contact: 'cs@cumt.edu.kh',
            status: 'active',
          },
          {
            id: 2,
            name: 'Business Administration',
            code: 'BA',
            head: 'Dr. Sreymom',
            contact: 'ba@cumt.edu.kh',
            status: 'active',
          },
        ];
      } else if (url.includes('/staff/classes')) {
        mockData = [
          {
            id: 1,
            name: 'CS-2025-A',
            major: 'Computer Science',
            shift: 'Morning',
            capacity: 30,
            enrolled: 28,
            teacher: 'Mr. Dara',
          },
          {
            id: 2,
            name: 'BA-2025-B',
            major: 'Business Admin',
            shift: 'Afternoon',
            capacity: 35,
            enrolled: 32,
            teacher: 'Ms. Sreymom',
          },
        ];
      }

      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}