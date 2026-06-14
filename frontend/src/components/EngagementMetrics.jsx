import StatTile from './StatTile';
import { formatNumber, formatPercent } from '../utils/format';

export default function EngagementMetrics({ analytics, showRates = true }) {
  if (!analytics) return null;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatTile label="Sent" value={formatNumber(analytics.sent)} accent="brand" />
        <StatTile label="Opened" value={formatNumber(analytics.opened)} accent="green" />
        <StatTile label="Clicked" value={formatNumber(analytics.clicked)} accent="amber" />
        <StatTile label="Failed" value={formatNumber(analytics.failed)} accent="rose" />
      </div>

      {showRates && (
        <div className="mt-6 flex flex-wrap gap-4 rounded-xl bg-slate-50 px-4 py-4 text-sm text-slate-600 ring-1 ring-inset ring-slate-200/70 sm:gap-6 sm:px-5">
          <span>
            Open Rate:{' '}
            <strong className="font-semibold text-slate-900">{formatPercent(analytics.open_rate)}</strong>
          </span>
          <span>
            Click Rate:{' '}
            <strong className="font-semibold text-slate-900">{formatPercent(analytics.click_rate)}</strong>
          </span>
        </div>
      )}
    </>
  );
}
