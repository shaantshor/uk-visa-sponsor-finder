const SIZE_LABELS = {
  startup: 'Startup (<50)',
  scaleup: 'Scaleup (50-500)',
  mid: 'Mid (500-5K)',
  large: 'Large (5K-50K)',
  enterprise: 'Enterprise (50K+)',
};

export default function FilterPanel({ filters, updateFilters, cities, industries }) {
  const activeFilters = [];
  if (filters.city) activeFilters.push({ key: 'city', label: filters.city });
  if (filters.industry) activeFilters.push({ key: 'industry', label: filters.industry });
  if (filters.company_size) activeFilters.push({ key: 'company_size', label: SIZE_LABELS[filters.company_size] || filters.company_size });
  if (filters.is_tech === 'true') activeFilters.push({ key: 'is_tech', label: 'Tech Only' });

  const clearAll = () => {
    updateFilters({ city: '', industry: '', company_size: '', is_tech: '' });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <select
          value={filters.city}
          onChange={(e) => updateFilters({ city: e.target.value })}
          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <option value="">All Cities</option>
          {cities.map((c) => (
            <option key={c.city} value={c.city}>
              {c.city} ({c.count})
            </option>
          ))}
        </select>

        <select
          value={filters.industry}
          onChange={(e) => updateFilters({ industry: e.target.value })}
          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <option value="">All Industries</option>
          {industries.map((i) => (
            <option key={i.industry} value={i.industry}>
              {i.industry} ({i.count})
            </option>
          ))}
        </select>

        <select
          value={filters.company_size}
          onChange={(e) => updateFilters({ company_size: e.target.value })}
          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <option value="">All Sizes</option>
          {Object.entries(SIZE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <button
          onClick={() => updateFilters({ is_tech: filters.is_tech === 'true' ? '' : 'true' })}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            filters.is_tech === 'true'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
        >
          Tech Only
        </button>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm"
            >
              {f.label}
              <button
                onClick={() => updateFilters({ [f.key]: '' })}
                className="ml-1 hover:text-blue-900 dark:hover:text-blue-100"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          <button
            onClick={clearAll}
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
