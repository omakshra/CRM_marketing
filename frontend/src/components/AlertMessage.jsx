const styles = {
  error: 'alert-error',
  success: 'alert-success',
};

export default function AlertMessage({ type = 'error', message }) {
  if (!message) return null;
  return <div className={styles[type]} role="alert">{message}</div>;
}
