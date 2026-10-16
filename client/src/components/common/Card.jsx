export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`
        bg-white rounded-2xl shadow-soft p-5
        ${hover ? 'hover:shadow-card hover:-translate-y-0.5 transition-all duration-200' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-3 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`font-display font-bold text-lg text-ink ${className}`}>
      {children}
    </h3>
  );
}
