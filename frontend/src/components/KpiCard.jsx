const accentStyles = {
  brand: {
    icon: 'bg-brand-100 text-brand-600',
    bar: 'bg-brand-500',
    badge: 'bg-brand-50 text-brand-700 ring-brand-200',
  },
  green: {
    icon: 'bg-emerald-100 text-emerald-600',
    bar: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  },
  amber: {
    icon: 'bg-amber-100 text-amber-600',
    bar: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 ring-amber-200',
  },
  rose: {
    icon: 'bg-rose-100 text-rose-600',
    bar: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700 ring-rose-200',
  },
  slate: {
    icon: 'bg-slate-200 text-slate-600',
    bar: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-700 ring-slate-200',
  },
};

const icons = {
  brand: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  green: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2m9-4a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  amber: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  rose: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  slate: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V9.882M11 5.882A8.966 8.966 0 0118 12h-7M11 5.882L7.5 3.5M11 9.882v4M11 13.882A8.966 8.966 0 014 12h7" />
    </svg>
  ),
};

export default function KpiCard({ title, value, subtitle, accent = 'brand' }) {
  const style = accentStyles[accent] ?? accentStyles.brand;

  return (
    <div className="card-hover group relative overflow-hidden">
      <div className={`absolute inset-x-0 top-0 h-1 ${style.bar}`} />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{value}</p>
          {subtitle && (
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{subtitle}</p>
          )}
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.icon}`}>
          {icons[accent] ?? icons.brand}
        </div>
      </div>
    </div>
  );
}
