import { NavLink } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const navItems = [
  {
    to: '/',
    label: 'Dashboard',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    to: '/audience',
    label: 'AI Audience Builder',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    to: '/campaigns',
    label: 'Campaign Builder',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V9.882M11 5.882A8.966 8.966 0 0118 12h-7M11 5.882L7.5 3.5M11 9.882v4M11 13.882A8.966 8.966 0 014 12h7" />
      </svg>
    ),
  },
  {
    to: '/analytics',
    label: 'Analytics',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export default function Sidebar({ onNavigate }) {
  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-slate-200/80 bg-white shadow-sidebar lg:h-screen">
      <div className="border-b border-slate-100 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 text-lg font-bold text-white shadow-md shadow-brand-600/30">
            W
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900">WinBack AI CRM</h1>
            <p className="text-xs text-slate-500">Marketing Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 px-4 py-5">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Main Menu
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onNavigate}
            className={({ isActive }) => (isActive ? 'nav-link-active' : 'nav-link-inactive')}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 px-6 py-5">
        <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200/70">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <p className="text-xs font-semibold text-slate-700">API Connected</p>
          </div>
          <p className="mt-1.5 truncate text-xs text-slate-500">{API_BASE_URL.replace('http://', '')}</p>
        </div>
      </div>
    </aside>
  );
}
