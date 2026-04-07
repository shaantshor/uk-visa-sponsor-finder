import { useState, useEffect } from 'react';
import { getSimilarCompanies } from '../utils/api';
import SponsorCard from './SponsorCard';
import LoadingSkeleton from './LoadingSkeleton';

export default function SimilarCompanies({ companyId }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getSimilarCompanies(companyId)
      .then(data => {
        if (!cancelled) setCompanies(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [companyId]);

  if (loading) return <LoadingSkeleton count={3} />;
  if (companies.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Similar Companies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((company) => (
          <SponsorCard key={company.id} sponsor={company} />
        ))}
      </div>
    </div>
  );
}
