const FILTER_LABELS = {
  min_spend: 'Min Spend',
  max_spend: 'Max Spend',
  inactive_days: 'Inactive Days',
  min_purchase_count: 'Min Purchases',
  max_purchase_count: 'Max Purchases',
  city: 'City',
  channel_preference: 'Channel',
};

function formatChipLabel(key, value) {
  if (key === 'min_spend') return `Spend > ₹${value}`;
  if (key === 'max_spend') return `Spend ≤ ₹${value}`;
  if (key === 'inactive_days') return `Inactive > ${value} Days`;
  if (key === 'min_purchase_count') return `Purchases ≥ ${value}`;
  if (key === 'max_purchase_count') return `Purchases ≤ ${value}`;
  if (key === 'city') return `City: ${value}`;
  if (key === 'channel_preference') return `Channel: ${value}`;
  return `${FILTER_LABELS[key] ?? key}: ${value}`;
}

export default function FilterChips({ filters, onChange, onApply, isLoading = false }) {
  const entries = Object.entries(filters ?? {}).filter(([, value]) => value != null && value !== '');

  if (!entries.length) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
        No filters applied yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-brand-200 bg-gradient-to-r from-brand-50 to-indigo-50 px-3 py-2 text-sm text-brand-800 shadow-sm sm:px-4"
          >
            <span className="font-semibold">{formatChipLabel(key, value)}</span>
            <input
              type={typeof value === 'number' ? 'number' : 'text'}
              value={value}
              disabled={isLoading}
              onChange={(event) => {
                const nextValue =
                  typeof value === 'number' ? Number(event.target.value) : event.target.value;
                onChange({ ...filters, [key]: nextValue });
              }}
              className="w-16 rounded-lg border border-brand-200 bg-white px-2 py-1 text-xs font-medium outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 sm:w-20"
            />
          </div>
        ))}
      </div>
      {onApply && (
        <button
          type="button"
          onClick={onApply}
          disabled={isLoading}
          className="btn-secondary !px-4 !py-2 text-xs"
        >
          {isLoading ? 'Applying...' : 'Re-apply Filters'}
        </button>
      )}
    </div>
  );
}
