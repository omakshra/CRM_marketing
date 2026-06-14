import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)]">
      <div className="flex lg:min-h-screen">
        <div
          className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>

        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          />
        )}

        <main className="min-w-0 flex-1">
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-md lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="btn-secondary !px-3 !py-2"
              aria-label="Open menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-slate-900">WinBack AI CRM</span>
            <div className="w-10" />
          </div>

          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
