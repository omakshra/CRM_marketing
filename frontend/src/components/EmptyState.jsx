export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state">
      {icon && (
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
          {icon}
        </div>
      )}
      <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{title}</h2>
      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
