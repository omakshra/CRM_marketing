import { useState } from 'react';
import AlertMessage from '../components/AlertMessage';
import Button from '../components/Button';
import CustomerTable from '../components/CustomerTable';
import EmptyState from '../components/EmptyState';
import FilterChips from '../components/FilterChips';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import StatTile from '../components/StatTile';
import { useAudience } from '../context/AudienceContext';
import { fetchSegment } from '../services/api';
import { filtersToQuery, formatCurrency } from '../utils/format';

const DEFAULT_QUERY =
  "Customers who spent more than ₹5000 and haven't purchased in 90 days";

export default function AudienceBuilder() {
  const {
    segmentResult,
    setSegmentResult,
    selectedCustomerIds,
    toggleCustomerSelection,
    selectAllCustomers,
    toggleSelectAllCustomers,
  } = useAudience();
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function runSegmentation(searchQuery) {
    setLoading(true);
    setError('');

    const result = await fetchSegment(searchQuery);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSegmentResult(result.data);
    setFilters(result.data.filters);
    selectAllCustomers(result.data.customers.map((row) => row.customer.id));
    setLoading(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await runSegmentation(query);
  }

  async function handleReapplyFilters() {
    const rebuiltQuery = filtersToQuery(filters);
    setQuery(rebuiltQuery);
    await runSegmentation(rebuiltQuery);
  }

  return (
    <div className="page-shell">
      <PageHeader
        title="AI Audience Builder"
        subtitle="Describe your audience in natural language. Gemini converts it into smart, editable filters."
      />

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="label" htmlFor="nl-query">
            Natural Language Query
          </label>
          <textarea
            id="nl-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            rows={4}
            className="input-field resize-none"
            placeholder={DEFAULT_QUERY}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" loading={loading} loadingText="Analyzing...">
            Build Audience
          </Button>
          {segmentResult?.filter_source && (
            <span className="badge-brand capitalize">Source: {segmentResult.filter_source}</span>
          )}
        </div>

        <AlertMessage type="error" message={error} />
      </form>

      {!segmentResult && !loading && (
        <EmptyState
          title="Build your first audience"
          description="Enter a natural language query above to segment customers with AI-powered filters and win-back scores."
        />
      )}

      {loading && <LoadingSpinner label="Gemini is interpreting your query..." />}

      {segmentResult && !loading && (
        <>
          <SectionCard title="AI-Generated Filters" subtitle="Edit chips and re-apply to refine your audience.">
            <FilterChips
              filters={filters}
              onChange={setFilters}
              onApply={handleReapplyFilters}
              isLoading={loading}
            />
          </SectionCard>

          <section className="grid gap-5 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4">
            <StatTile label="Matched Customers" value={segmentResult.summary.customer_count} className="card-hover" />
            <StatTile
              label="Avg Spend"
              value={formatCurrency(segmentResult.summary.average_spend)}
              className="card-hover"
            />
            <StatTile label="Avg Score" value={segmentResult.summary.average_score} className="card-hover" />
            <StatTile
              label="Revenue Recovery"
              value={formatCurrency(segmentResult.potential_revenue_recovery)}
              accent="green"
              className="card-hover"
            />
          </section>

          <section className="space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="section-title">Win-Back Scored Customers</h2>
                <p className="section-subtitle">Sorted by highest win-back potential.</p>
              </div>
              <span className="badge-neutral">{selectedCustomerIds.length} selected for campaign</span>
            </div>

            {segmentResult.customers.length === 0 ? (
              <EmptyState
                title="No customers matched"
                description="Your filters did not match any customers. Try broadening spend or inactivity criteria."
              />
            ) : (
              <CustomerTable
                customers={segmentResult.customers}
                showInsights
                selectable
                selectedIds={selectedCustomerIds}
                onToggleSelect={toggleCustomerSelection}
                onToggleSelectAll={() =>
                  toggleSelectAllCustomers(segmentResult.customers.map((row) => row.customer.id))
                }
              />
            )}
          </section>
        </>
      )}
    </div>
  );
}
