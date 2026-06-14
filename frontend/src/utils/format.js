export function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-IN').format(value ?? 0);
}

export function formatPercent(value) {
  return `${Number(value ?? 0).toFixed(1)}%`;
}

export function getScoreBadgeColor(score) {
  if (score >= 70) return 'green';
  if (score >= 40) return 'yellow';
  return 'red';
}

export function filtersToQuery(filters) {
  const parts = ['customers'];

  if (filters.min_spend != null) {
    parts.push(`who spent more than ${filters.min_spend}`);
  }
  if (filters.max_spend != null) {
    parts.push(`who spent less than ${filters.max_spend}`);
  }
  if (filters.inactive_days != null) {
    parts.push(`inactive for ${filters.inactive_days} days`);
  }
  if (filters.min_purchase_count != null) {
    parts.push(`with at least ${filters.min_purchase_count} purchases`);
  }
  if (filters.city) {
    parts.push(`in ${filters.city}`);
  }
  if (filters.channel_preference) {
    parts.push(`preferring ${filters.channel_preference}`);
  }

  return parts.join(' ');
}

export function renderMessageTemplate(template, customer) {
  if (!template || !customer) return template ?? '';
  return template.replace(/\{\{name\}\}/g, customer.name ?? 'Customer');
}
