export default function StatTile({ label, value, accent = 'default', className = '' }) {
  const accents = {
    default: '',
    brand: 'border-brand-200/70 bg-brand-50/40',
    green: 'border-emerald-200/70 bg-emerald-50/50',
    amber: 'border-amber-200/70 bg-amber-50/50',
    rose: 'border-rose-200/70 bg-rose-50/50',
  };

  const labelColors = {
    default: 'text-slate-500',
    brand: 'text-brand-600',
    green: 'text-emerald-600',
    amber: 'text-amber-600',
    rose: 'text-rose-600',
  };

  const valueColors = {
    default: 'text-slate-900',
    brand: 'text-slate-900',
    green: 'text-emerald-900',
    amber: 'text-amber-900',
    rose: 'text-rose-900',
  };

  return (
    <div className={`stat-tile ${accents[accent]} ${className}`}>
      <p className={`stat-tile-label ${labelColors[accent]}`}>{label}</p>
      <p className={`stat-tile-value ${valueColors[accent]}`}>{value}</p>
    </div>
  );
}
