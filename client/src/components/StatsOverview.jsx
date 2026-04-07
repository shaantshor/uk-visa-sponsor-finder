import { useState, useEffect } from 'react';
import { getStats } from '../utils/api';

export default function StatsOverview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats().then(setStats).catch(() => {});
  }, []);

  if (!stats) return null;

  const cards = [
    { label: 'Total Sponsors', value: stats.total, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Tech Companies', value: stats.tech_count, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Cities Covered', value: stats.cities?.length || 0, color: 'text-purple-600 dark:text-purple-400' },
    { label: 'Industries', value: stats.industries?.length || 0, color: 'text-amber-600 dark:text-amber-400' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 text-center shadow-sm transition-colors duration-200"
        >
          <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
