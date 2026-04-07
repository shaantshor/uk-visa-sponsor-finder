import { Link } from 'react-router-dom';

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < full ? 'text-yellow-400' : i === full && half ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">{rating}</span>
    </div>
  );
}

export default function SponsorCard({ sponsor }) {
  const techStack = sponsor.tech_stack || [];
  const visibleTech = techStack.slice(0, 3);
  const extraCount = techStack.length - 3;

  return (
    <Link
      to={`/company/${sponsor.id}`}
      className="block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-slate-900 dark:text-white leading-tight">
          {sponsor.organisation_name}
        </h3>
        {sponsor.is_tech && (
          <span className="shrink-0 px-2 py-0.5 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full">
            Tech
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
          {sponsor.city}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
          {sponsor.industry}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
          {sponsor.company_size}
        </span>
      </div>

      {sponsor.glassdoor_rating && <Stars rating={sponsor.glassdoor_rating} />}

      {visibleTech.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {visibleTech.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 rounded-md border border-slate-200 dark:border-slate-600"
            >
              {tech}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="px-2 py-0.5 text-xs text-slate-400 dark:text-slate-500">
              +{extraCount} more
            </span>
          )}
        </div>
      )}

      {sponsor.description && (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed overflow-hidden whitespace-nowrap text-ellipsis">
          {sponsor.description}
        </p>
      )}
    </Link>
  );
}
