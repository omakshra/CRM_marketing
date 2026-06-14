import { Link } from 'react-router-dom';
import AlertMessage from '../components/AlertMessage';
import EmptyState from '../components/EmptyState';
import FunnelChart from '../components/FunnelChart';
import KpiCard from '../components/KpiCard';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import { PageSkeleton } from '../components/Skeleton';
import { useFetch } from '../hooks/useFetch';
import { fetchAnalytics } from '../services/api';
import { hasAnalyticsData } from '../utils/apiError';
import { formatNumber, formatPercent } from '../utils/format';

export default function Analytics() {
  const { data: analytics, loading, error } = useFetch(fetchAnalytics, []);

  if (loading) return <PageSkeleton cards={4} />;

  if (error) {
    return (
      <div className="page-shell">
        <PageHeader title="Analytics" subtitle="Campaign funnel performance and engagement metrics." />
        <AlertMessage type="error" message={error} />
      </div>
    );
  }

  const isEmpty = !hasAnalyticsData(analytics);

  return (
    <div className="page-shell">
      <PageHeader
        title="Analytics"
        subtitle="Campaign funnel performance and engagement metrics at a glance."
      />

      {isEmpty ? (
        <EmptyState
          title="No analytics data yet"
          description="Send a win-back campaign to see sent, opened, clicked, and failed metrics here."
          action={
            <Link to="/campaigns" className="btn-primary inline-flex">
              Go to Campaign Builder
            </Link>
          }
        />
      ) : (
        <>
          <section className="grid gap-5 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard title="Sent" value={formatNumber(analytics.sent)} accent="brand" />
            <KpiCard
              title="Opened"
              value={formatNumber(analytics.opened)}
              subtitle={formatPercent(analytics.open_rate)}
              accent="green"
            />
            <KpiCard
              title="Clicked"
              value={formatNumber(analytics.clicked)}
              subtitle={formatPercent(analytics.click_rate)}
              accent="amber"
            />
            <KpiCard title="Failed" value={formatNumber(analytics.failed)} accent="rose" />
          </section>

          <SectionCard title="Campaign Funnel" subtitle="Sent → Opened → Clicked conversion flow.">
            <FunnelChart data={analytics} />
          </SectionCard>

          <SectionCard title="Engagement Rates" subtitle="Key performance indicators for message engagement.">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 to-white p-5 sm:p-6">
                <p className="text-sm font-semibold text-emerald-700">Open Rate</p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-emerald-900 sm:text-4xl">
                  {formatPercent(analytics.open_rate)}
                </p>
                <p className="mt-2 text-sm text-emerald-600">
                  {analytics.opened} of {analytics.sent} messages opened
                </p>
              </div>
              <div className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50 to-white p-5 sm:p-6">
                <p className="text-sm font-semibold text-amber-700">Click Rate</p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-amber-900 sm:text-4xl">
                  {formatPercent(analytics.click_rate)}
                </p>
                <p className="mt-2 text-sm text-amber-600">
                  {analytics.clicked} of {analytics.opened} opens clicked
                </p>
              </div>
            </div>
          </SectionCard>
        </>
      )}
    </div>
  );
}
