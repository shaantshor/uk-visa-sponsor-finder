import { useState, useEffect } from 'react';
import useSyncURL from '../hooks/useSyncURL';
import useSponsors from '../hooks/useSponsors';
import { getCities, getIndustries } from '../utils/api';
import StatsOverview from '../components/StatsOverview';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import SponsorList from '../components/SponsorList';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Pagination from '../components/Pagination';

export default function HomePage() {
  const { filters, updateFilters } = useSyncURL();
  const { data, pagination, loading } = useSponsors(filters);
  const [cities, setCities] = useState([]);
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    getCities().then(setCities).catch(() => {});
    getIndustries().then(setIndustries).catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="py-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
          Find UK Visa Sponsors
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-6">
          Search {pagination.total || '250'}+ companies licensed to sponsor Skilled Worker visas
        </p>
      </section>

      <section className="mb-8">
        <StatsOverview />
      </section>

      <section className="mb-6">
        <SearchBar
          value={filters.search}
          onChange={(value) => updateFilters({ search: value })}
        />
      </section>

      <section className="mb-6">
        <FilterPanel
          filters={filters}
          updateFilters={updateFilters}
          cities={cities}
          industries={industries}
        />
      </section>

      <section className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing <span className="font-medium text-slate-700 dark:text-slate-300">{data.length}</span> of{' '}
          <span className="font-medium text-slate-700 dark:text-slate-300">{pagination.total}</span> sponsors
        </p>
        <select
          value={`${filters.sort}-${filters.order}`}
          onChange={(e) => {
            const [sort, order] = e.target.value.split('-');
            updateFilters({ sort, order });
          }}
          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <option value="organisation_name-asc">Name (A-Z)</option>
          <option value="organisation_name-desc">Name (Z-A)</option>
          <option value="glassdoor_rating-desc">Rating (High to Low)</option>
          <option value="glassdoor_rating-asc">Rating (Low to High)</option>
          <option value="founded_year-desc">Newest First</option>
          <option value="founded_year-asc">Oldest First</option>
          <option value="city-asc">City (A-Z)</option>
        </select>
      </section>

      <section className="mb-8">
        {loading ? <LoadingSkeleton /> : <SponsorList sponsors={data} />}
      </section>

      <section className="pb-12">
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(p) => updateFilters({ page: String(p) })}
        />
      </section>
    </div>
  );
}
