export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 animate-pulse"
        >
          <div className="flex justify-between mb-3">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-12" />
          </div>
          <div className="flex gap-2 mb-3">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20" />
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-24" />
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-16" />
          </div>
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, j) => (
              <div key={j} className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded" />
            ))}
          </div>
          <div className="flex gap-1.5 mb-3">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-16" />
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-14" />
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-12" />
          </div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
        </div>
      ))}
    </div>
  );
}
