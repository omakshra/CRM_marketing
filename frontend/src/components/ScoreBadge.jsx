import { getScoreBadgeColor } from '../utils/format';

const styles = {
  green: 'bg-emerald-100 text-emerald-800 ring-emerald-300/60',
  yellow: 'bg-amber-100 text-amber-800 ring-amber-300/60',
  red: 'bg-rose-100 text-rose-800 ring-rose-300/60',
};

export default function ScoreBadge({ score }) {
  const color = getScoreBadgeColor(score);

  return (
    <span
      className={`inline-flex min-w-[2.75rem] items-center justify-center rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${styles[color]}`}
    >
      {score}
    </span>
  );
}
