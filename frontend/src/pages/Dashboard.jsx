import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AlertMessage from '../components/AlertMessage';
import EmptyState from '../components/EmptyState';
import EngagementMetrics from '../components/EngagementMetrics';
import KpiCard from '../components/KpiCard';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import { PageSkeleton } from '../components/Skeleton';
import { useAudience } from '../context/AudienceContext';
import { fetchAnalytics, fetchCampaigns, fetchCustomers } from '../services/api';
import { hasAnalyticsData } from '../utils/apiError';
import { formatCurrency, formatNumber, formatPercent } from '../utils/format';

export default function Dashboard() {
  const { segmentResult } = useAudience();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalCampaigns: 0,
    analytics: null,
  });

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError('');

      const [customersResult, campaignsResult, analyticsResult] = await Promise.all([
        fetchCustomers(),
        fetchCampaigns(),
        fetchAnalytics(),
      ]);

      if (!active) return;

      const firstError =
        customersResult.error ?? campaignsResult.error ?? analyticsResult.error ?? '';

      if (firstError) {
        setError(firstError);
        setLoading(false);
        return;
      }

      setStats({
        totalCustomers: customersResult.data.total,
        totalCampaigns: campaignsResult.data.total,
        analytics: analyticsResult.data,
      });
      setLoading(false);
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const revenueRecovery = segmentResult?.potential_revenue_recovery ?? 0;

  if (loading) return <PageSkeleton cards={4} />;

  if (error) {
    return (
      <div className="page-shell">
        <PageHeader title="Dashboard" subtitle="Overview of customers, campaigns, and win-back opportunities." />
        <AlertMessage type="error" message={error} />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of customers, campaigns, and win-back opportunities across your CRM."
      />

      <section className="grid gap-5 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Total Customers" value={formatNumber(stats.totalCustomers)} accent="brand" />
        <KpiCard
          title="Total Campaigns"
          value={formatNumber(stats.totalCampaigns)}
          subtitle={stats.totalCampaigns === 0 ? 'Create your first campaign' : undefined}
          accent="slate"
        />
        <KpiCard
          title="Revenue Recovery"
          value={formatCurrency(revenueRecovery)}
          subtitle={segmentResult ? 'From latest audience segment' : 'Build an audience to estimate'}
          accent="green"
        />
        <KpiCard
          title="Messages Sent"
          value={formatNumber(stats.analytics?.sent ?? 0)}
          subtitle={
            hasAnalyticsData(stats.analytics)
              ? `${formatPercent(stats.analytics.open_rate)} open rate`
              : 'No campaigns sent yet'
          }
          accent="amber"
        />
      </section>

      <SectionCard title="Analytics Summary" subtitle="Campaign performance across all channels.">
        {hasAnalyticsData(stats.analytics) ? (
          <EngagementMetrics analytics={stats.analytics} />
        ) : (
          <EmptyState
            title="No analytics data yet"
            description="Create and send a campaign to start tracking engagement metrics."
            action={
              <Link to="/campaigns" className="btn-primary inline-flex">
                Go to Campaign Builder
              </Link>
            }
          />
        )}
      </SectionCard>
    </div>
  );
}
