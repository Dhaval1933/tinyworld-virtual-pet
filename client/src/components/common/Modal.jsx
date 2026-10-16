import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, className = '' }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-sm animate-pop-in"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className={`
          bg-white rounded-2xl shadow-float
          w-full max-w-lg max-h-[85vh] overflow-y-auto
          animate-slide-up
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-cream-dark">
          <h2 className="font-display font-bold text-xl text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-cream-dark transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-ink-muted" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
