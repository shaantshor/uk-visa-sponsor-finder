import ShareButton from './ShareButton';

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < full ? 'text-yellow-400' : i === full && half ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-lg font-medium text-slate-700 dark:text-slate-300 ml-2">{rating}</span>
    </div>
  );
}

const SIZE_LABELS = {
  startup: 'Startup (<50 employees)',
  scaleup: 'Scaleup (50-500 employees)',
  mid: 'Mid-size (500-5,000 employees)',
  large: 'Large (5,000-50,000 employees)',
  enterprise: 'Enterprise (50,000+ employees)',
};

export default function SponsorDetail({ sponsor }) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            {sponsor.industry}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            {sponsor.city}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
            {sponsor.company_size}
          </span>
          {sponsor.is_tech && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
              Tech Company
            </span>
          )}
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300">
            {sponsor.type_rating}
          </span>
        </div>

        {sponsor.glassdoor_rating && <Stars rating={sponsor.glassdoor_rating} />}
      </div>

      {sponsor.description && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">About</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{sponsor.description}</p>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Founded', value: sponsor.founded_year },
            { label: 'Size', value: SIZE_LABELS[sponsor.company_size] || sponsor.company_size },
            { label: 'Global HQ', value: sponsor.hq_city || sponsor.city },
            { label: 'UK Office', value: [sponsor.city, sponsor.county].filter(Boolean).join(', ') },
            { label: 'Glassdoor Rating', value: sponsor.glassdoor_rating ? `${sponsor.glassdoor_rating} / 5.0` : 'N/A' },
            { label: 'Visa Route', value: sponsor.route },
            { label: 'Sponsor Rating', value: sponsor.type_rating },
            { label: 'Industry', value: sponsor.industry },
            { label: 'Sub-Industry', value: sponsor.sub_industry },
          ].map((item) => (
            <div key={item.label} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{item.label}</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{item.value || 'N/A'}</dd>
            </div>
          ))}
        </div>
      </div>

      {sponsor.tech_stack && sponsor.tech_stack.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {sponsor.tech_stack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-600"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Quick Links</h2>
        <div className="flex flex-wrap gap-3">
          {sponsor.website && (
            <a
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Visit Website
            </a>
          )}
          {sponsor.careers_page && (
            <a
              href={sponsor.careers_page}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Careers Page
            </a>
          )}
          <ShareButton />
        </div>
      </div>
    </div>
  );
}
