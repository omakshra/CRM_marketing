import { renderMessageTemplate } from '../utils/format';

export default function MessagePreview({ template, sampleCustomer }) {
  const preview = renderMessageTemplate(template, sampleCustomer);

  return (
    <div className="card h-full">
      <div className="card-header">
        <p className="section-title">Live Preview</p>
        <p className="section-subtitle">See how your message renders with merge tags.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-inner">
        <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-3">
          <div className="h-3 w-3 rounded-full bg-rose-400" />
          <div className="h-3 w-3 rounded-full bg-amber-400" />
          <div className="h-3 w-3 rounded-full bg-emerald-400" />
          <span className="ml-2 text-xs font-medium text-slate-400">Message Preview</span>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-800">
          {preview || 'Enter a message template to see preview...'}
        </p>
      </div>

      {sampleCustomer && (
        <p className="mt-4 text-xs text-slate-500">
          Previewing for{' '}
          <span className="font-semibold text-slate-700">{sampleCustomer.name}</span>
        </p>
      )}
    </div>
  );
}
