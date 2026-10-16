import { PackageOpen } from 'lucide-react';

export default function EmptyState({
  icon: Icon = PackageOpen,
  title = 'Nothing here yet',
  description = '',
  action,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      <div className="w-16 h-16 rounded-full bg-lavender/20 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-lavender-dark" />
      </div>
      <h3 className="font-display font-bold text-lg text-ink mb-1">{title}</h3>
      {description && (
        <p className="text-ink-muted text-sm max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
