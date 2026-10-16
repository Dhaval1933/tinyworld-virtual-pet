const colorMap = {
  lavender: { bar: 'bg-lavender-dark', track: 'bg-lavender/30' },
  sage: { bar: 'bg-sage-dark', track: 'bg-sage/30' },
  peach: { bar: 'bg-peach-dark', track: 'bg-peach/30' },
  sky: { bar: 'bg-sky-dark', track: 'bg-sky/30' },
  danger: { bar: 'bg-danger', track: 'bg-danger/20' },
  success: { bar: 'bg-success-dark', track: 'bg-success/20' },
};

export default function ProgressBar({
  value = 0,
  max = 100,
  color = 'lavender',
  size = 'md',
  showLabel = false,
  label = '',
  className = '',
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const colors = colorMap[color] || colorMap.lavender;

  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-ink-muted">{label}</span>
          <span className="text-xs font-semibold text-ink-light">
            {Math.round(value)}/{max}
          </span>
        </div>
      )}
      <div className={`w-full ${heights[size]} rounded-full ${colors.track} overflow-hidden`}>
        <div
          className={`${heights[size]} rounded-full ${colors.bar} transition-all duration-500 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
