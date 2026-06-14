export default function SectionCard({ title, subtitle, children, className = '' }) {
  return (
    <section className={`card ${className}`}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h2 className="section-title">{title}</h2>}
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
