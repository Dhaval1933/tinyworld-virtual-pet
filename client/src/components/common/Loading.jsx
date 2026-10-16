import { Loader2 } from 'lucide-react';

export default function Loading({ message = 'Loading...', fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-cream z-50">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-lavender/30 border-t-lavender-dark animate-spin" />
        </div>
        <p className="mt-4 text-ink-muted font-medium animate-pulse-soft">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 text-lavender-dark animate-spin" />
      <p className="mt-3 text-ink-muted text-sm">{message}</p>
    </div>
  );
}
