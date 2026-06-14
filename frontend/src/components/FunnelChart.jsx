import EmptyState from './EmptyState';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b'];

export default function FunnelChart({ data }) {
  const hasData = data && (data.sent > 0 || data.opened > 0 || data.clicked > 0);

  if (!hasData) {
    return (
      <EmptyState
        title="No funnel data yet"
        description="Send a campaign to see sent → opened → clicked performance here."
      />
    );
  }

  const chartData = [
    { stage: 'Sent', value: data.sent },
    { stage: 'Opened', value: data.opened },
    { stage: 'Clicked', value: data.clicked },
  ];

  return (
    <div className="h-64 w-full rounded-xl bg-slate-50/50 p-4 ring-1 ring-inset ring-slate-200/60 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="stage"
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: 'rgb(99 102 241 / 0.06)' }}
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
              fontSize: '13px',
            }}
          />
          <Bar dataKey="value" radius={[10, 10, 0, 0]} maxBarSize={72}>
            {chartData.map((entry, index) => (
              <Cell key={entry.stage} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
