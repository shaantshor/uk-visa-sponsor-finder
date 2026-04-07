import { Link } from 'react-router-dom';
import useTheme from '../hooks/useTheme';
import ThemeToggle from './ThemeToggle';

export default function Layout({ children }) {
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              SponsorWatch UK
            </span>
          </Link>
          <ThemeToggle dark={dark} toggle={toggle} />
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>SponsorWatch UK &mdash; Data sourced from the GOV.UK Register of Licensed Sponsors</p>
          <p className="mt-1">
            <a
              href="https://github.com/shaantshor/uk-visa-sponsor-finder"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
