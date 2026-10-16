import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { onboardingService } from '../services';
import Button from '../components/common/Button';
import { PET_SPECIES, ROOM_THEMES, ACTIVITY_CATEGORIES } from '../utils/constants';
import { ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const STEPS = ['welcome', 'pet', 'name', 'theme', 'focus', 'complete'];

const petEmojis = {
  mochi: '😺',
  pebble: '🐰',
  sprout: '🌱',
};

export default function OnboardingPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [choices, setChoices] = useState({
    petSpecies: '',
    petName: '',
    roomTheme: 'cozy',
    focusCategory: 'learning',
  });

  const currentStep = STEPS[step];

  const canProceed = () => {
    if (currentStep === 'pet') return !!choices.petSpecies;
    if (currentStep === 'name') return choices.petName.trim().length >= 1;
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const data = await onboardingService.complete(choices);
      updateUser(data.user);
      toast.success(data.message || 'Welcome to TinyWorld! 🎉');
      navigate('/room');
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-lavender-dark scale-110' : 'bg-lavender/30'
              }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-card p-8 animate-pop-in" key={currentStep}>
          {/* Step: Welcome */}
          {currentStep === 'welcome' && (
            <div className="text-center">
              <div className="text-6xl mb-4">🌍</div>
              <h1 className="font-display text-3xl font-bold text-ink mb-3">
                Welcome to TinyWorld{user?.displayName ? `, ${user.displayName}` : ''}!
              </h1>
              <p className="text-ink-muted leading-relaxed mb-8">
                You're about to create your own tiny world — a cozy place where your pet companion lives,
                grows, and thrives as you take care of yourself. Let's get started!
              </p>
              <Button onClick={handleNext} icon={ArrowRight} size="lg">
                Let's Begin
              </Button>
            </div>
          )}

          {/* Step: Choose Pet */}
          {currentStep === 'pet' && (
            <div>
              <h2 className="font-display text-2xl font-bold text-ink mb-2 text-center">
                Choose Your Companion
              </h2>
              <p className="text-ink-muted text-center mb-6">
                Pick a creature to join your tiny world.
              </p>
              <div className="space-y-3">
                {PET_SPECIES.map((pet) => (
                  <button
                    key={pet.id}
                    onClick={() => setChoices((prev) => ({ ...prev, petSpecies: pet.id }))}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      choices.petSpecies === pet.id
                        ? 'border-lavender-dark bg-lavender/10 shadow-glow-lavender'
                        : 'border-cream-dark hover:border-lavender bg-cream/30'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-full bg-lavender/20 flex items-center justify-center text-3xl shrink-0">
                      {petEmojis[pet.id]}
                    </div>
                    <div className="text-left">
                      <p className="font-display font-bold text-ink">{pet.name}</p>
                      <p className="text-sm text-ink-muted">{pet.description}</p>
                    </div>
                    {choices.petSpecies === pet.id && (
                      <Check className="w-5 h-5 text-lavender-dark ml-auto shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Name Pet */}
          {currentStep === 'name' && (
            <div className="text-center">
              <div className="text-5xl mb-4">{petEmojis[choices.petSpecies] || '🐾'}</div>
              <h2 className="font-display text-2xl font-bold text-ink mb-2">
                Name Your {PET_SPECIES.find((p) => p.id === choices.petSpecies)?.name || 'Pet'}
              </h2>
              <p className="text-ink-muted mb-6">Give your companion a special name.</p>
              <input
                type="text"
                value={choices.petName}
                onChange={(e) => setChoices((prev) => ({ ...prev, petName: e.target.value }))}
                maxLength={20}
                placeholder="Type a name..."
                className="w-full text-center text-xl font-display font-bold px-4 py-3 rounded-xl border-2 border-cream-dark bg-cream/50 text-ink placeholder:text-ink-muted/40 focus:outline-none focus:border-lavender-dark focus:ring-2 focus:ring-lavender/30 transition-all"
                autoFocus
              />
              <p className="text-xs text-ink-muted mt-2">{choices.petName.length}/20 characters</p>
            </div>
          )}

          {/* Step: Room Theme */}
          {currentStep === 'theme' && (
            <div>
              <h2 className="font-display text-2xl font-bold text-ink mb-2 text-center">
                Choose a Room Theme
              </h2>
              <p className="text-ink-muted text-center mb-6">
                Where will {choices.petName || 'your pet'} call home?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {ROOM_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setChoices((prev) => ({ ...prev, roomTheme: theme.id }))}
                    className={`p-4 rounded-xl border-2 transition-all text-center cursor-pointer ${
                      choices.roomTheme === theme.id
                        ? 'border-lavender-dark shadow-glow-lavender'
                        : 'border-cream-dark hover:border-lavender'
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-lg mx-auto mb-2"
                      style={{ backgroundColor: theme.color }}
                    />
                    <p className="font-semibold text-sm text-ink">{theme.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Focus Category */}
          {currentStep === 'focus' && (
            <div>
              <h2 className="font-display text-2xl font-bold text-ink mb-2 text-center">
                What would you like to focus on?
              </h2>
              <p className="text-ink-muted text-center mb-6">
                Choose an activity category to start with. You can always do everything!
              </p>
              <div className="space-y-2">
                {ACTIVITY_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setChoices((prev) => ({ ...prev, focusCategory: cat.id }))}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all cursor-pointer text-left ${
                      choices.focusCategory === cat.id
                        ? 'border-lavender-dark bg-lavender/10'
                        : 'border-cream-dark hover:border-lavender'
                    }`}
                  >
                    <span className="font-semibold text-sm text-ink">{cat.name}</span>
                    {choices.focusCategory === cat.id && (
                      <Check className="w-4 h-4 text-lavender-dark ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Complete */}
          {currentStep === 'complete' && (
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce-gentle">
                {petEmojis[choices.petSpecies] || '🐾'}
              </div>
              <h2 className="font-display text-2xl font-bold text-ink mb-2">
                {choices.petName} is ready!
              </h2>
              <p className="text-ink-muted mb-6 leading-relaxed">
                Your {PET_SPECIES.find((p) => p.id === choices.petSpecies)?.name} companion
                is excited to move into your{' '}
                {ROOM_THEMES.find((t) => t.id === choices.roomTheme)?.name} room!
              </p>
              <div className="bg-cream rounded-xl p-4 mb-6 text-left space-y-2 text-sm">
                <p><span className="font-semibold text-ink">Pet:</span> {choices.petName} the {choices.petSpecies}</p>
                <p><span className="font-semibold text-ink">Room:</span> {ROOM_THEMES.find((t) => t.id === choices.roomTheme)?.name}</p>
                <p><span className="font-semibold text-ink">Starter coins:</span> 200 🪙</p>
                <p><span className="font-semibold text-ink">Starter items:</span> Bed, Rug, Plant</p>
              </div>
              <Button
                onClick={handleComplete}
                loading={loading}
                size="lg"
                icon={Sparkles}
              >
                Enter Your World
              </Button>
            </div>
          )}

          {/* Navigation */}
          {currentStep !== 'welcome' && currentStep !== 'complete' && (
            <div className="flex items-center justify-between mt-8">
              <Button variant="ghost" onClick={handleBack} icon={ArrowLeft} size="sm">
                Back
              </Button>
              <Button onClick={handleNext} disabled={!canProceed()} icon={ArrowRight} size="sm">
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
