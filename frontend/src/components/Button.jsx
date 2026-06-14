const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
};

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  loadingText,
  disabled,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-80" />
      )}
      {loading ? loadingText ?? children : children}
    </button>
  );
}
