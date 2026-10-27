import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { progressService } from '../services';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import Loading from '../components/common/Loading';
import {
  BarChart3,
  Coins,
  Star,
  Trophy,
  ListChecks,
  Package,
  Lock,
  Unlock,
  TrendingUp,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { formatNumber, timeAgo } from '../utils/formatters';
import toast from 'react-hot-toast';

export default function ProgressPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [progressData, achievementData] = await Promise.all([
        progressService.getProgress(),
        progressService.getAchievements(),
      ]);
      setProgress(progressData.progress);
      setAchievements(achievementData.achievements);
    } catch {
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading message="Loading your progress..." />;
  if (!progress) return null;

  const lp = progress.levelProgress;
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-ink flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-lavender-dark" />
          Progress &amp; Achievements
        </h1>
        <p className="text-sm text-ink-muted">
          Your journey, leveling milestones, and unlocked badges in TinyWorld
        </p>
      </div>

      {/* Level & XP Gauge */}
      <Card className="bg-gradient-to-br from-white via-cream to-lavender/15 border-2 border-lavender/30">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-lavender-dark bg-lavender/30 px-2.5 py-0.5 rounded-full">
                Player Rank
              </span>
            </div>
            <p className="font-display text-3xl font-bold text-ink mt-1">Level {lp.level}</p>
            <p className="text-xs text-ink-muted mt-0.5">
              {formatNumber(lp.currentXP)} / {formatNumber(lp.requiredXP)} XP to Level {lp.level + 1}
            </p>
          </div>

          <div className="w-16 h-16 rounded-3xl bg-lavender/30 flex items-center justify-center shadow-inner">
            <Star className="w-8 h-8 text-lavender-dark animate-pulse-soft" />
          </div>
        </div>

        <ProgressBar
          value={lp.currentXP}
          max={lp.requiredXP}
          color="lavender"
          size="lg"
        />
        <div className="flex justify-between items-center text-[11px] font-semibold text-ink-muted mt-2">
          <span>Level {lp.level}</span>
          <span>{Math.round(lp.progress * 100)}%</span>
          <span>Level {lp.level + 1}</span>
        </div>
      </Card>

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Card className="text-center p-4">
          <div className="w-10 h-10 rounded-2xl bg-peach/20 flex items-center justify-center mx-auto mb-2 text-peach-dark">
            <Coins className="w-5 h-5" />
          </div>
          <p className="font-display font-bold text-2xl text-ink">
            {formatNumber(user?.coins || 0)}
          </p>
          <p className="text-xs font-semibold text-ink-muted">Coin Balance</p>
        </Card>

        <Card className="text-center p-4">
          <div className="w-10 h-10 rounded-2xl bg-lavender/25 flex items-center justify-center mx-auto mb-2 text-lavender-dark">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="font-display font-bold text-2xl text-ink">
            {formatNumber(lp.totalXP)}
          </p>
          <p className="text-xs font-semibold text-ink-muted">Total XP Earned</p>
        </Card>

        <Card className="text-center p-4">
          <div className="w-10 h-10 rounded-2xl bg-sage/25 flex items-center justify-center mx-auto mb-2 text-sage-dark">
            <ListChecks className="w-5 h-5" />
          </div>
          <p className="font-display font-bold text-2xl text-ink">
            {progress.stats.totalActivities}
          </p>
          <p className="text-xs font-semibold text-ink-muted">Habits Completed</p>
        </Card>

        <Card className="text-center p-4">
          <div className="w-10 h-10 rounded-2xl bg-sky/30 flex items-center justify-center mx-auto mb-2 text-sky-dark">
            <Package className="w-5 h-5" />
          </div>
          <p className="font-display font-bold text-2xl text-ink">
            {progress.stats.totalItems}
          </p>
          <p className="text-xs font-semibold text-ink-muted">Unique Items</p>
        </Card>
      </div>

      {/* Achievements Showcase */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2">
            <Trophy className="w-5 h-5 text-peach-dark" />
            Achievements
          </h2>
          <span className="text-xs font-bold text-ink bg-white px-3 py-1 rounded-full border border-cream-dark shadow-xs">
            {unlockedCount} / {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {achievements.map((ach) => (
            <div
              key={ach.achievementId}
              className={`p-4 rounded-3xl border-2 transition-all flex items-start gap-3.5 ${
                ach.unlocked
                  ? 'border-success/40 bg-white shadow-soft'
                  : 'border-cream-dark/60 bg-cream/40 opacity-60'
              }`}
            >
              {/* Achievement Badge Icon */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  ach.unlocked
                    ? 'bg-success/20 text-success-dark shadow-xs'
                    : 'bg-cream-dark text-ink-muted'
                }`}
              >
                {ach.unlocked ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <h3 className="font-bold text-sm text-ink truncate">{ach.name}</h3>
                  {ach.rewardCoins > 0 && (
                    <span className="text-[11px] font-bold text-peach-dark bg-peach/15 px-2 py-0.5 rounded-full shrink-0">
                      +{ach.rewardCoins} 🪙
                    </span>
                  )}
                </div>

                <p className="text-xs text-ink-muted leading-relaxed mb-1.5">
                  {ach.description}
                </p>

                {ach.unlocked && ach.unlockedAt && (
                  <p className="text-[10px] font-semibold text-success-dark">
                    Unlocked {timeAgo(ach.unlockedAt)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wallet Ledger / Transaction History */}
      {progress.recentTransactions && progress.recentTransactions.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2 mb-3">
            <Receipt className="w-5 h-5 text-ink-muted" />
            Wallet Activity Ledger
          </h2>

          <div className="bg-white rounded-3xl p-4 border border-cream-dark shadow-soft space-y-2">
            {progress.recentTransactions.slice(0, 8).map((tx) => {
              const isEarn = tx.transactionType === 'earn';

              return (
                <div
                  key={tx._id}
                  className="flex items-center justify-between py-2 border-b border-cream-dark/50 last:border-none"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs ${
                        isEarn ? 'bg-success/15 text-success-dark' : 'bg-danger/15 text-danger-dark'
                      }`}
                    >
                      {isEarn ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-ink">{tx.reason}</p>
                      <p className="text-[10px] text-ink-muted">{timeAgo(tx.createdAt)}</p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold ${
                      isEarn ? 'text-success-dark' : 'text-danger-dark'
                    }`}
                  >
                    {isEarn ? `+${tx.amount}` : `-${tx.amount}`} 🪙
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
