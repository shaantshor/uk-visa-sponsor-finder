import { useState, useEffect } from 'react';
import { getSponsors } from '../utils/api';

export default function useSponsors(filters) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getSponsors(filters)
      .then(res => {
        if (!cancelled) {
          setData(res.data);
          setPagination(res.pagination);
          setError(null);
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [filters.search, filters.city, filters.industry, filters.company_size, filters.is_tech, filters.page, filters.sort, filters.order]);

  return { data, pagination, loading, error };
}
