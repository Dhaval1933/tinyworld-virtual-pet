import React, { useState, useEffect, useRef, useCallback } from 'react';
import Button from '../common/Button';
import { Play, Pause, RotateCcw, Check, Timer } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FocusTimer({ onCompleteSession, disabled = false }) {
  const PRESETS = [
    { label: '15m Quick', minutes: 15 },
    { label: '25m Pomodoro', minutes: 25 },
    { label: '45m Deep', minutes: 45 },
  ];

  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [focusTitle, setFocusTitle] = useState('Deep Study & Focus');
  const timerRef = useRef(null);

  const onCompleteRef = useRef(onCompleteSession);
  useEffect(() => {
    onCompleteRef.current = onCompleteSession;
  }, [onCompleteSession]);

  const handleTimerComplete = useCallback(() => {
    toast.success('🎉 Focus session completed! Great job!', { duration: 4000 });
    if (onCompleteRef.current) {
      onCompleteRef.current({
        activityType: 'studying',
        title: `${focusTitle} (${selectedMinutes}m)`,
        durationMinutes: selectedMinutes,
      });
    }
    setSecondsRemaining(selectedMinutes * 60);
  }, [focusTitle, selectedMinutes]);

  // When selectedMinutes changes and timer is not running, reset
  const handleSelectPreset = (mins) => {
    if (isRunning) return;
    setSelectedMinutes(mins);
    setSecondsRemaining(mins * 60);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, handleTimerComplete]);

  const handleManualComplete = () => {
    const elapsedMinutes = Math.max(1, Math.round((selectedMinutes * 60 - secondsRemaining) / 60));
    setIsRunning(false);
    toast.success(`Completed ${elapsedMinutes} minutes of focus!`);
    onCompleteSession({
      activityType: 'studying',
      title: `${focusTitle} (${elapsedMinutes}m)`,
      durationMinutes: elapsedMinutes,
    });
    setSecondsRemaining(selectedMinutes * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsRemaining(selectedMinutes * 60);
  };

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const totalSeconds = selectedMinutes * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalSeconds - secondsRemaining) / totalSeconds) * 100));

  return (
    <div className="bg-gradient-to-br from-lavender/25 via-white to-peach/20 rounded-3xl p-6 border-2 border-lavender/40 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-lavender/40 flex items-center justify-center text-lavender-dark">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-ink text-base">Cozy Focus Timer</h3>
            <p className="text-xs text-ink-muted">Stay in flow and earn coins for your world</p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 bg-white/80 p-1 rounded-2xl border border-cream-dark">
          {PRESETS.map((p) => (
            <button
              key={p.minutes}
              onClick={() => handleSelectPreset(p.minutes)}
              disabled={isRunning}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 ${
                selectedMinutes === p.minutes
                  ? 'bg-lavender-dark text-white shadow-soft'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
        {/* Countdown Display with Circular Ring */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="transparent"
              stroke="#F5EDDF"
              strokeWidth="7"
            />
            {/* Active progress */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="transparent"
              stroke="#B8AEFF"
              strokeWidth="7"
              strokeDasharray={264}
              strokeDashoffset={264 - (264 * progressPercent) / 100}
              strokeLinecap="round"
              className="transition-all duration-500 ease-linear"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-display text-3xl font-bold text-ink tracking-tight">
              {formattedTime}
            </span>
            <span className="text-[11px] font-semibold text-ink-muted uppercase mt-0.5">
              {isRunning ? 'In Flow ✨' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Controls & Session Info */}
        <div className="flex-1 space-y-3 w-full">
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1">
              Focus Goal
            </label>
            <input
              type="text"
              value={focusTitle}
              onChange={(e) => setFocusTitle(e.target.value)}
              disabled={isRunning}
              placeholder="e.g. Study Computer Science, Read Literature"
              className="w-full px-3.5 py-2 rounded-xl border border-cream-dark bg-white text-sm focus:outline-none focus:ring-2 focus:ring-lavender"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button
              variant={isRunning ? 'secondary' : 'primary'}
              size="sm"
              icon={isRunning ? Pause : Play}
              onClick={() => setIsRunning(!isRunning)}
              disabled={disabled}
            >
              {isRunning ? 'Pause' : 'Start Focus'}
            </Button>

            {isRunning && (
              <Button
                variant="outline"
                size="sm"
                icon={Check}
                onClick={handleManualComplete}
                title="Finish session now and log activity"
              >
                Log Now
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              icon={RotateCcw}
              onClick={handleReset}
              disabled={secondsRemaining === selectedMinutes * 60 && !isRunning}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
