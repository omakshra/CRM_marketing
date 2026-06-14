import ScoreBadge from './ScoreBadge';
import EmptyState from './EmptyState';
import { formatCurrency } from '../utils/format';

function CustomerAvatar({ name }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
      {name?.charAt(0) ?? '?'}
    </div>
  );
}

function MobileCustomerCard({ row, selectable, selected, onToggleSelect, showInsights }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        {selectable && (
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelect}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
        )}
        <CustomerAvatar name={row.customer.name} />
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-slate-900">{row.customer.name}</div>
          <div className="truncate text-xs text-slate-500">{row.customer.email}</div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500">Spend</span>
              <p className="font-medium text-slate-800">{formatCurrency(row.customer.total_spend)}</p>
            </div>
            <div>
              <span className="text-slate-500">Purchases</span>
              <p className="font-medium text-slate-800">{row.customer.purchase_count}</p>
            </div>
            <div>
              <span className="text-slate-500">City</span>
              <p className="font-medium text-slate-800">{row.customer.city}</p>
            </div>
            {showInsights && (
              <div>
                <span className="text-slate-500">Score</span>
                <div className="mt-1">
                  <ScoreBadge score={row.score} />
                </div>
              </div>
            )}
          </div>
          {showInsights && (
            <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-xs">
              <div>
                <span className="font-semibold text-slate-600">Reason:</span>
                <p className="mt-0.5 leading-relaxed text-slate-600">{row.reason}</p>
              </div>
              <div>
                <span className="font-semibold text-slate-600">Recommendation:</span>
                <p className="mt-0.5 leading-relaxed text-slate-600">{row.recommendation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CustomerTable({
  customers = [],
  showInsights = false,
  selectable = false,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
}) {
  if (!customers.length) {
    return (
      <EmptyState
        title="No customers found"
        description="Try adjusting your filters or search query to find matching customers."
      />
    );
  }

  const allSelected = customers.every((row) => selectedIds.includes(row.customer.id));

  return (
    <>
      <div className="space-y-3 md:hidden">
        {selectable && (
          <label className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={onToggleSelectAll}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Select all
          </label>
        )}
        {customers.map((row) => (
          <MobileCustomerCard
            key={row.customer.id}
            row={row}
            selectable={selectable}
            selected={selectedIds.includes(row.customer.id)}
            onToggleSelect={() => onToggleSelect(row.customer.id)}
            showInsights={showInsights}
          />
        ))}
      </div>

      <div className="table-shell hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="table-head">
              <tr>
                {selectable && (
                  <th className="table-cell w-12">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={onToggleSelectAll}
                      className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                  </th>
                )}
                <th className="table-cell text-left">Customer</th>
                <th className="table-cell text-left">Spend</th>
                <th className="table-cell text-left">Purchases</th>
                <th className="table-cell text-left">City</th>
                {showInsights && (
                  <>
                    <th className="table-cell text-left">Score</th>
                    <th className="table-cell min-w-[10rem] text-left lg:min-w-[12rem]">Reason</th>
                    <th className="table-cell min-w-[10rem] text-left lg:min-w-[12rem]">Recommendation</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {customers.map((row, index) => (
                <tr
                  key={row.customer.id}
                  className={`transition-colors hover:bg-brand-50/30 ${index % 2 === 1 ? 'bg-slate-50/40' : ''}`}
                >
                  {selectable && (
                    <td className="table-cell">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.customer.id)}
                        onChange={() => onToggleSelect(row.customer.id)}
                        className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                    </td>
                  )}
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <CustomerAvatar name={row.customer.name} />
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900">{row.customer.name}</div>
                        <div className="truncate text-xs text-slate-500">{row.customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell font-medium text-slate-800">
                    {formatCurrency(row.customer.total_spend)}
                  </td>
                  <td className="table-cell text-slate-700">{row.customer.purchase_count}</td>
                  <td className="table-cell text-slate-700">{row.customer.city}</td>
                  {showInsights && (
                    <>
                      <td className="table-cell">
                        <ScoreBadge score={row.score} />
                      </td>
                      <td className="table-cell max-w-xs leading-relaxed text-slate-600">{row.reason}</td>
                      <td className="table-cell max-w-xs leading-relaxed text-slate-600">{row.recommendation}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
