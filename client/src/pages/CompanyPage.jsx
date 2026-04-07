import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSponsor } from '../utils/api';
import SponsorDetail from '../components/SponsorDetail';
import SimilarCompanies from '../components/SimilarCompanies';

export default function CompanyPage() {
  const { id } = useParams();
  const [sponsor, setSponsor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setSponsor(null);

    getSponsor(id)
      .then(data => {
        if (!cancelled) {
          setSponsor(data);
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
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32" />
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          <div className="flex gap-3">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-full w-24" />
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-full w-20" />
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-full w-28" />
          </div>
          <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !sponsor) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Company not found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">The company you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to search
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to search
      </Link>

      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
        {sponsor.organisation_name}
      </h1>

      <SponsorDetail sponsor={sponsor} />

      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
        <SimilarCompanies companyId={id} />
      </div>
    </div>
  );
}
