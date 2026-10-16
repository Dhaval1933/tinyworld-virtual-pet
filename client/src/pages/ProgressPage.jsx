import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { progressService } from '../services';
import Card, { CardTitle } from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import Loading from '../components/common/Loading';
import {
  BarChart3, Coins, Star, Trophy, ListChecks,
  Package, Lock, Unlock, TrendingUp,
} from 'lucide-react';
import { formatNumber, timeAgo } from '../utils/formatters';
import toast from 'react-hot-toast';

export default function ProgressPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [progressData, achievementData] = await Promise.all([
        progressService.getProgress(),
        progressService.getAchievements(),
      ]);
      setProgress(progressData.progress);
      setAchievements(achievementData.achievements);
    } catch (err) {
      toast.error('Failed to load progress');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading progress..." />;
  if (!progress) return null;

  const lp = progress.levelProgress;

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-ink flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-lavender-dark" />
          Progress
        </h1>
        <p className="text-sm text-ink-muted">Track your journey in TinyWorld</p>
      </div>

      {/* Level & XP */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-display text-3xl font-bold text-ink">Level {lp.level}</p>
            <p className="text-sm text-ink-muted">
              {formatNumber(lp.currentXP)} / {formatNumber(lp.requiredXP)} XP to next level
            </p>
          </div>
          <div className="w-16 h-16 rounded-full bg-lavender/20 flex items-center justify-center">
            <Star className="w-8 h-8 text-lavender-dark" />
          </div>
        </div>
        <ProgressBar
          value={lp.currentXP}
          max={lp.requiredXP}
          color="lavender"
          size="lg"
        />
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="text-center">
          <Coins className="w-6 h-6 text-peach-dark mx-auto mb-2" />
          <p className="font-bold text-xl text-ink">{formatNumber(user?.coins || 0)}</p>
          <p className="text-xs text-ink-muted">Coins</p>
        </Card>
        <Card className="text-center">
          <TrendingUp className="w-6 h-6 text-sage-dark mx-auto mb-2" />
          <p className="font-bold text-xl text-ink">{formatNumber(lp.totalXP)}</p>
          <p className="text-xs text-ink-muted">Total XP</p>
        </Card>
        <Card className="text-center">
          <ListChecks className="w-6 h-6 text-sky-dark mx-auto mb-2" />
          <p className="font-bold text-xl text-ink">{progress.stats.totalActivities}</p>
          <p className="text-xs text-ink-muted">Activities</p>
        </Card>
        <Card className="text-center">
          <Package className="w-6 h-6 text-lavender-dark mx-auto mb-2" />
          <p className="font-bold text-xl text-ink">{progress.stats.totalItems}</p>
          <p className="text-xs text-ink-muted">Items Owned</p>
        </Card>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="font-display text-xl font-bold text-ink mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-peach-dark" />
          Achievements
          <span className="text-sm font-normal text-ink-muted">
            ({achievements.filter((a) => a.unlocked).length}/{achievements.length})
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.achievementId}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                ach.unlocked
                  ? 'border-success/30 bg-success/5'
                  : 'border-cream-dark bg-cream/30 opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  ach.unlocked ? 'bg-success/20' : 'bg-cream-dark'
                }`}
              >
                {ach.unlocked ? (
                  <Unlock className="w-5 h-5 text-success-dark" />
                ) : (
                  <Lock className="w-5 h-5 text-ink-muted" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-ink">{ach.name}</p>
                <p className="text-xs text-ink-muted truncate">{ach.description}</p>
                {ach.unlocked && ach.unlockedAt && (
                  <p className="text-[10px] text-success-dark mt-0.5">
                    Unlocked {timeAgo(ach.unlockedAt)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {progress.recentActivities?.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold text-ink mb-3">Recent Activity</h2>
          <div className="space-y-2">
            {progress.recentActivities.map((act) => (
              <div
                key={act._id}
                className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-soft"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{act.title}</p>
                  <p className="text-xs text-ink-muted">{timeAgo(act.completionDate)}</p>
                </div>
                <div className="text-right text-xs">
                  <p className="text-peach-dark font-semibold">+{act.rewardCoins}</p>
                  <p className="text-lavender-dark font-semibold">+{act.rewardXP} XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
