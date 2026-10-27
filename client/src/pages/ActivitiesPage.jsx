import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { activityService } from '../services';
import FocusTimer from '../components/activities/FocusTimer';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import {
  ListChecks,
  Clock,
  Coins,
  Star,
  Check,
  History,
  Plus,
  Sparkles,
  Timer,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { generateId, timeAgo } from '../utils/formatters';

export default function ActivitiesPage() {
  const { user, updateUser } = useAuth();
  const { fetchPet, fetchProgress } = useGame();
  const [activityTypes, setActivityTypes] = useState([]);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customType, setCustomType] = useState('task');
  const [customDuration, setCustomDuration] = useState('15');
  const [customNote, setCustomNote] = useState('');
  const [customSubmitting, setCustomSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [typesData, summaryData, historyData] = await Promise.all([
        activityService.getTypes(),
        activityService.getSummary(),
        activityService.getHistory(),
      ]);
      setActivityTypes(typesData.activities);
      setSummary(summaryData.summary);
      setHistory(historyData.activities);
    } catch {
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleComplete = async (activity) => {
    setCompleting(activity.type);
    try {
      const data = await activityService.complete({
        activityType: activity.type,
        title: activity.title,
        durationMinutes: activity.duration || 0,
        idempotencyKey: generateId(),
      });

      if (data.duplicate) {
        toast('This activity was already recorded', { icon: 'ℹ️' });
        return;
      }

      toast.success(data.message);

      // Update user state
      if (data.newBalance !== undefined) {
        updateUser({
          ...user,
          coins: data.newBalance,
          totalXP: data.newTotalXP,
          level: data.newLevel || user.level,
        });
      }

      if (data.leveledUp) {
        toast(`🎉 Level Up! You reached Level ${data.newLevel}!`, {
          duration: 5000,
          icon: '⬆️',
        });
      }

      // Handle newly unlocked achievements
      if (data.unlockedAchievements && data.unlockedAchievements.length > 0) {
        data.unlockedAchievements.forEach((ach) => {
          toast(`🏆 Achievement Unlocked: ${ach.name}!`, {
            icon: '✨',
            duration: 4500,
          });
        });
      }

      fetchPet();
      fetchProgress();
      loadData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCompleting('');
    }
  };

  const handleTimerCompleteSession = async ({ activityType, title, durationMinutes }) => {
    try {
      const data = await activityService.complete({
        activityType: activityType || 'studying',
        title: title || 'Focus Session',
        durationMinutes: durationMinutes || 25,
        idempotencyKey: generateId(),
      });

      if (data.duplicate) {
        toast('Session already recorded', { icon: 'ℹ️' });
        return;
      }

      toast.success(data.message || 'Focus session logged!');

      if (data.newBalance !== undefined) {
        updateUser({
          ...user,
          coins: data.newBalance,
          totalXP: data.newTotalXP,
          level: data.newLevel || user.level,
        });
      }

      if (data.leveledUp) {
        toast(`🎉 Level Up! You reached Level ${data.newLevel}!`, {
          duration: 5000,
          icon: '⬆️',
        });
      }

      if (data.unlockedAchievements && data.unlockedAchievements.length > 0) {
        data.unlockedAchievements.forEach((ach) => {
          toast(`🏆 Achievement Unlocked: ${ach.name}!`, {
            icon: '✨',
            duration: 4500,
          });
        });
      }

      fetchPet();
      fetchProgress();
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCompleteCustom = async (e) => {
    e.preventDefault();
    if (!customTitle.trim()) {
      toast.error('Please enter a task title');
      return;
    }
    setCustomSubmitting(true);
    try {
      const data = await activityService.complete({
        activityType: customType,
        title: customTitle.trim(),
        note: customNote.trim() || undefined,
        durationMinutes: parseInt(customDuration, 10) || 0,
        idempotencyKey: generateId(),
      });

      if (data.duplicate) {
        toast('This activity was already recorded', { icon: 'ℹ️' });
        return;
      }

      toast.success(data.message || `Completed: ${customTitle}!`);

      if (data.newBalance !== undefined) {
        updateUser({
          ...user,
          coins: data.newBalance,
          totalXP: data.newTotalXP,
          level: data.newLevel || user.level,
        });
      }

      if (data.leveledUp) {
        toast(`🎉 Level Up! You reached Level ${data.newLevel}!`, {
          duration: 5000,
          icon: '⬆️',
        });
      }

      if (data.unlockedAchievements && data.unlockedAchievements.length > 0) {
        data.unlockedAchievements.forEach((ach) => {
          toast(`🏆 Achievement Unlocked: ${ach.name}!`, {
            icon: '✨',
            duration: 4500,
          });
        });
      }

      setCustomTitle('');
      setCustomNote('');
      setShowCustomModal(false);
      fetchPet();
      fetchProgress();
      loadData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCustomSubmitting(false);
    }
  };

  if (loading) return <Loading message="Loading activities..." />;

  const isDailyLimitReached = summary?.todayActivities >= summary?.todayLimit;

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink flex items-center gap-2">
            <ListChecks className="w-6 h-6 text-sage-dark" />
            Activities & Habits
          </h1>
          <p className="text-sm text-ink-muted">
            Complete real-life habits to earn coins, XP, and care for your pet
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={showTimer ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setShowTimer(!showTimer)}
            icon={Timer}
          >
            {showTimer ? 'Hide Timer' : 'Focus Timer'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCustomModal(true)}
            disabled={isDailyLimitReached}
            icon={Plus}
          >
            Custom Activity
          </Button>
        </div>
      </div>

      {/* Focus Timer Section (Collapsible) */}
      {showTimer && (
        <FocusTimer
          onCompleteSession={handleTimerCompleteSession}
          disabled={isDailyLimitReached}
        />
      )}

      {/* Daily Goal & Progress Meter */}
      {summary && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display font-bold text-ink">Daily Goal</h3>
              <p className="text-xs text-ink-muted">Earn rewards up to 10 activities per day</p>
            </div>
            <span className="text-sm font-bold text-ink-muted bg-cream px-3 py-1 rounded-xl">
              {summary.todayActivities}/{summary.todayLimit} completed
            </span>
          </div>

          <ProgressBar
            value={summary.todayActivities}
            max={summary.todayLimit}
            color="sage"
            size="md"
          />

          <div className="flex flex-wrap items-center gap-6 mt-4 text-sm pt-2 border-t border-cream-dark">
            <span className="flex items-center gap-1.5 font-medium">
              <Coins className="w-4 h-4 text-peach-dark" />
              <span className="font-bold text-ink">+{summary.todayCoins}</span> coins earned today
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Star className="w-4 h-4 text-lavender-dark" />
              <span className="font-bold text-ink">+{summary.todayXP}</span> XP earned today
            </span>
            {isDailyLimitReached && (
              <span className="text-xs font-semibold text-warning ml-auto">
                🌟 Daily limit reached! Resets tomorrow at midnight.
              </span>
            )}
          </div>
        </Card>
      )}

      {/* Preset Habit Cards */}
      <div>
        <h2 className="font-display text-lg font-bold text-ink mb-3">Daily Habits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {activityTypes.map((activity) => (
            <div
              key={activity.type}
              className="bg-white rounded-2xl p-4.5 border border-cream-dark shadow-soft flex items-center gap-4 hover:shadow-card hover:border-lavender/50 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-sage/20 flex items-center justify-center text-2xl shrink-0">
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-ink truncate">{activity.title}</p>
                <div className="flex items-center gap-2.5 text-xs text-ink-muted mt-1">
                  <span className="flex items-center gap-0.5 font-semibold text-peach-dark">
                    <Coins className="w-3 h-3" /> +{activity.rewards.coins}
                  </span>
                  <span className="flex items-center gap-0.5 font-semibold text-lavender-dark">
                    <Star className="w-3 h-3" /> +{activity.rewards.xp} XP
                  </span>
                  {activity.duration > 0 && (
                    <span className="flex items-center gap-0.5 text-ink-muted">
                      <Clock className="w-3 h-3" /> {activity.duration}m
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleComplete(activity)}
                loading={completing === activity.type}
                disabled={isDailyLimitReached}
                icon={Check}
              >
                Done
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Activity History Toggle */}
      <div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 text-sm font-bold text-ink-muted hover:text-ink transition-colors cursor-pointer"
        >
          <History className="w-4 h-4 text-lavender-dark" />
          <span>{showHistory ? 'Hide' : 'View'} Activity History</span>
          {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showHistory && (
          <div className="mt-3 space-y-2 animate-slide-up">
            {history.length === 0 ? (
              <p className="text-xs text-ink-muted bg-white p-4 rounded-xl text-center">
                No activities logged yet! Complete a habit above to start your streak.
              </p>
            ) : (
              history.slice(0, 10).map((act) => (
                <div
                  key={act._id}
                  className="flex items-center justify-between bg-white rounded-2xl px-4 py-3 shadow-soft border border-cream-dark"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">{act.title}</p>
                    <p className="text-xs text-ink-muted">{timeAgo(act.completionDate)}</p>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-bold text-peach-dark">+{act.rewardCoins} coins</span>
                    <span className="text-ink-muted mx-1.5">•</span>
                    <span className="font-bold text-lavender-dark">+{act.rewardXP} XP</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ─── Custom Activity Modal ─── */}
      <Modal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        title="Log a Custom Activity"
      >
        <form onSubmit={handleCompleteCustom} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase mb-1.5">
              Task or Habit Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Solved 3 LeetCode problems, Drank herbal tea"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-cream-dark focus:outline-none focus:ring-2 focus:ring-lavender text-sm"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase mb-1.5">
                Category
              </label>
              <select
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-cream-dark bg-white focus:outline-none focus:ring-2 focus:ring-lavender text-sm cursor-pointer"
              >
                <option value="task">General Task (+10 🪙)</option>
                <option value="studying">Study / Focus (+20 🪙)</option>
                <option value="exercise">Fitness / Movement (+15 🪙)</option>
                <option value="reading">Reading (+15 🪙)</option>
                <option value="cleaning">Tidying / Chores (+10 🪙)</option>
                <option value="practice">Skill Practice (+15 🪙)</option>
                <option value="hydration">Self-Care (+5 🪙)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase mb-1.5">
                Duration (min)
              </label>
              <input
                type="number"
                min="0"
                max="480"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-dark focus:outline-none focus:ring-2 focus:ring-lavender text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase mb-1.5">
              Reflection or Note (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="How did this activity make you feel?"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-cream-dark focus:outline-none focus:ring-2 focus:ring-lavender text-sm resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCustomModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              loading={customSubmitting}
              icon={Sparkles}
            >
              Record &amp; Earn
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
