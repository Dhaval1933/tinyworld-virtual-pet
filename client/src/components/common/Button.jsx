import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-lavender hover:bg-lavender-dark text-ink shadow-soft hover:shadow-card',
  secondary: 'bg-sage hover:bg-sage-dark text-ink shadow-soft hover:shadow-card',
  accent: 'bg-peach hover:bg-peach-dark text-ink shadow-soft hover:shadow-card',
  danger: 'bg-danger hover:bg-danger-dark text-white shadow-soft',
  ghost: 'bg-transparent hover:bg-cream-dark text-ink',
  outline: 'border-2 border-lavender text-ink hover:bg-lavender/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-xl
        transition-all duration-200 ease-out
        active:scale-[0.97]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        cursor-pointer
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
}
