import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AlertMessage from '../components/AlertMessage';
import Button from '../components/Button';
import CustomerTable from '../components/CustomerTable';
import EmptyState from '../components/EmptyState';
import MessagePreview from '../components/MessagePreview';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import { useAudience } from '../context/AudienceContext';
import { submitCampaign, submitCampaignSend } from '../services/api';

const DEFAULT_TEMPLATE = 'Hi {{name}}, we miss you! Enjoy 15% off your next order.';

export default function CampaignBuilder() {
  const {
    segmentResult,
    selectedCustomerIds,
    toggleCustomerSelection,
    toggleSelectAllCustomers,
  } = useAudience();
  const [name, setName] = useState('');
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [campaignId, setCampaignId] = useState(null);
  const [status, setStatus] = useState('');
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const selectedCustomers = useMemo(() => {
    if (!segmentResult?.customers) return [];
    return segmentResult.customers.filter((row) => selectedCustomerIds.includes(row.customer.id));
  }, [segmentResult, selectedCustomerIds]);

  const previewCustomer = selectedCustomers[0]?.customer ?? segmentResult?.customers?.[0]?.customer;
  const isBusy = creating || sending;

  async function handleCreateCampaign() {
    if (!name.trim()) {
      setError('Campaign name is required.');
      return;
    }
    if (!segmentResult?.segment?.id) {
      setError('Build an audience first on the AI Audience Builder page.');
      return;
    }
    if (!selectedCustomerIds.length) {
      setError('Select at least one customer.');
      return;
    }

    setCreating(true);
    setError('');
    setStatus('');

    const result = await submitCampaign({
      name: name.trim(),
      segment_id: segmentResult.segment.id,
      message_template: template,
      customer_ids: selectedCustomerIds,
    });

    if (result.error) {
      setError(result.error);
    } else {
      setCampaignId(result.data.id);
      setStatus(`Campaign "${result.data.name}" created (ID: ${result.data.id}). Ready to send.`);
    }

    setCreating(false);
  }

  async function handleSendCampaign() {
    if (!campaignId) {
      setError('Create the campaign before sending.');
      return;
    }

    setSending(true);
    setError('');

    const result = await submitCampaignSend(campaignId);

    if (result.error) {
      setError(result.error);
    } else {
      setStatus(result.data.message);
    }

    setSending(false);
  }

  if (!segmentResult) {
    return (
      <div className="page-shell">
        <EmptyState
          icon={
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V9.882M11 5.882A8.966 8.966 0 0118 12h-7M11 5.882L7.5 3.5M11 9.882v4M11 13.882A8.966 8.966 0 014 12h7" />
            </svg>
          }
          title="Campaign Builder"
          description="Build an audience first to select customers for your win-back campaign."
          action={
            <Link to="/audience" className="btn-primary inline-flex">
              Go to AI Audience Builder
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <PageHeader
        title="Campaign Builder"
        subtitle="Create and send personalized win-back campaigns to your segmented audience."
      />

      <section className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Campaign Details" subtitle="Configure your campaign name and message template." className="space-y-5">
          <div>
            <label className="label" htmlFor="campaign-name">
              Campaign Name
            </label>
            <input
              id="campaign-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="input-field"
              placeholder="March Win-Back Offer"
            />
          </div>

          <div>
            <label className="label" htmlFor="message-template">
              Message Template
              <span className="ml-2 text-xs font-normal text-slate-400">Use {'{{name}}'} merge tag</span>
            </label>
            <textarea
              id="message-template"
              value={template}
              onChange={(event) => setTemplate(event.target.value)}
              rows={6}
              className="input-field resize-none font-mono text-[13px]"
            />
          </div>

          <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
            <Button onClick={handleCreateCampaign} loading={creating} loadingText="Creating..." disabled={isBusy}>
              Create Campaign
            </Button>
            <Button
              variant="secondary"
              onClick={handleSendCampaign}
              loading={sending}
              loadingText="Sending..."
              disabled={isBusy || !campaignId}
            >
              Send Campaign
            </Button>
          </div>

          <AlertMessage type="success" message={status} />
          <AlertMessage type="error" message={error} />
        </SectionCard>

        <MessagePreview template={template} sampleCustomer={previewCustomer} />
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-title">Customer Selection</h2>
            <p className="section-subtitle">Choose recipients for this campaign.</p>
          </div>
          <span className="badge-neutral">{selectedCustomerIds.length} customers selected</span>
        </div>
        <CustomerTable
          customers={segmentResult.customers}
          selectable
          selectedIds={selectedCustomerIds}
          onToggleSelect={toggleCustomerSelection}
          onToggleSelectAll={() =>
            toggleSelectAllCustomers(segmentResult.customers.map((row) => row.customer.id))
          }
        />
      </section>
    </div>
  );
}
