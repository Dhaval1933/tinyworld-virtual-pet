import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { activityService } from '../services';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import { ListChecks, Clock, Coins, Star, Check, History, Trophy, Plus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateId, timeAgo } from '../utils/formatters';

export default function ActivitiesPage() {
  const { user, updateUser } = useAuth();
  const { fetchPet } = useGame();
  const [activityTypes, setActivityTypes] = useState([]);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customType, setCustomType] = useState('task');
  const [customDuration, setCustomDuration] = useState('15');
  const [customNote, setCustomNote] = useState('');
  const [customSubmitting, setCustomSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

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
    } catch (err) {
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (activity) => {
    setCompleting(activity.type);
    try {
      const data = await activityService.complete({
        activityType: activity.type,
        title: activity.title,
        idempotencyKey: generateId(),
      });

      if (data.duplicate) {
        toast('This activity was already recorded', { icon: 'ℹ️' });
        return;
      }

      toast.success(data.message);
      
      // Update user state
      if (data.newBalance !== undefined) {
        updateUser({ ...user, coins: data.newBalance, totalXP: data.newTotalXP, level: data.newLevel || user.level });
      }

      if (data.leveledUp) {
        toast(`🎉 Level Up! You're now level ${data.newLevel}!`, { duration: 5000, icon: '⬆️' });
      }

      fetchPet(); // Refresh pet XP
      loadData(); // Refresh summary + history
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCompleting('');
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
        updateUser({ ...user, coins: data.newBalance, totalXP: data.newTotalXP, level: data.newLevel || user.level });
      }

      if (data.leveledUp) {
        toast(`🎉 Level Up! You're now level ${data.newLevel}!`, { duration: 5000, icon: '⬆️' });
      }

      setCustomTitle('');
      setCustomNote('');
      setShowCustomModal(false);
      fetchPet();
      loadData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCustomSubmitting(false);
    }
  };

  if (loading) return <Loading message="Loading activities..." />;

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink flex items-center gap-2">
            <ListChecks className="w-6 h-6 text-sage-dark" />
            Activities
          </h1>
          <p className="text-sm text-ink-muted">Complete real-life activities to earn rewards</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowCustomModal(true)}
          disabled={summary?.todayActivities >= summary?.todayLimit}
          icon={Plus}
        >
          Custom Activity
        </Button>
      </div>

      {/* Daily Summary */}
      {summary && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-ink">Today's Progress</h3>
            <span className="text-sm font-semibold text-ink-muted">
              {summary.todayActivities}/{summary.todayLimit} activities
            </span>
          </div>
          <ProgressBar
            value={summary.todayActivities}
            max={summary.todayLimit}
            color="sage"
            size="md"
          />
          <div className="flex items-center gap-6 mt-3 text-sm">
            <span className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-peach-dark" />
              <span className="font-semibold text-ink">{summary.todayCoins}</span> coins today
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-lavender-dark" />
              <span className="font-semibold text-ink">{summary.todayXP}</span> XP today
            </span>
          </div>
        </Card>
      )}

      {/* Activity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {activityTypes.map((activity) => (
          <div
            key={activity.type}
            className="bg-white rounded-2xl shadow-soft p-4 flex items-center gap-4 hover:shadow-card transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-sage/15 flex items-center justify-center text-2xl shrink-0">
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-ink">{activity.title}</p>
              <p className="text-xs text-ink-muted flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-0.5">
                  <Coins className="w-3 h-3 text-peach-dark" /> +{activity.rewards.coins}
                </span>
                <span className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-lavender-dark" /> +{activity.rewards.xp} XP
                </span>
                {activity.duration > 0 && (
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-3 h-3" /> {activity.duration}m
                  </span>
                )}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleComplete(activity)}
              loading={completing === activity.type}
              disabled={summary?.todayActivities >= summary?.todayLimit}
              icon={Check}
            >
              Done
            </Button>
          </div>
        ))}
      </div>

      {/* Activity History */}
      <div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink transition-colors cursor-pointer"
        >
          <History className="w-4 h-4" />
          {showHistory ? 'Hide' : 'Show'} Recent Activity
        </button>

        {showHistory && history.length > 0 && (
          <div className="mt-3 space-y-2">
            {history.slice(0, 10).map((act) => (
              <div
                key={act._id}
                className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 shadow-soft"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{act.title}</p>
                  <p className="text-xs text-ink-muted">{timeAgo(act.completionDate)}</p>
                </div>
                <div className="text-right text-xs">
                  <p className="text-peach-dark font-semibold">+{act.rewardCoins} coins</p>
                  <p className="text-lavender-dark font-semibold">+{act.rewardXP} XP</p>
                </div>
              </div>
            ))}
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
              Task or Habit Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Clean my desk, Meditate for 10m"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-cream-dark focus:outline-none focus:ring-2 focus:ring-lavender text-sm"
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
                className="w-full px-3 py-2.5 rounded-xl border border-cream-dark bg-white focus:outline-none focus:ring-2 focus:ring-lavender text-sm"
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
                max="300"
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
              placeholder="How did it feel? What did you achieve?"
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
