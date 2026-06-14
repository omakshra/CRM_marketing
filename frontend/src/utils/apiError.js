/**
 * Normalize API errors from Axios / FastAPI into user-facing strings.
 */
export function getApiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback;

  const detail = error.response?.data?.detail;

  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg ?? JSON.stringify(item)).join(', ');
  }
  if (error.message === 'Network Error') {
    return 'Unable to reach the server. Make sure the backend is running.';
  }

  return fallback;
}

export function hasAnalyticsData(analytics) {
  if (!analytics) return false;
  return analytics.sent > 0 || analytics.opened > 0 || analytics.clicked > 0 || analytics.failed > 0;
}
