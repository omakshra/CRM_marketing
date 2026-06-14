export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="card flex flex-col items-center justify-center py-16">
      <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand-600" />
      <p className="mt-4 text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
}
