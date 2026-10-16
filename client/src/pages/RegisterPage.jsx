import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { Mail, Lock, Eye, EyeOff, User, AtSign } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
    username: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register({
        displayName: form.displayName,
        email: form.email,
        password: form.password,
        username: form.username || undefined,
      });
      toast.success('Account created! Let\'s set up your world 🎉');
      navigate('/onboarding');
    } catch (err) {
      toast.error(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 page-enter">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-sage/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🌱</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-ink mb-2">Create Your World</h1>
          <p className="text-ink-muted">Join TinyWorld and start your cozy journey.</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name */}
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="reg-name">
                Display Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-muted" />
                <input
                  id="reg-name"
                  type="text"
                  name="displayName"
                  value={form.displayName}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={30}
                  placeholder="What should we call you?"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-dark bg-cream/50 text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-lavender-dark focus:ring-2 focus:ring-lavender/30 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="reg-email">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-muted" />
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="hello@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-dark bg-cream/50 text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-lavender-dark focus:ring-2 focus:ring-lavender/30 transition-all"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="reg-username">
                Username <span className="text-ink-muted font-normal">(optional)</span>
              </label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-muted" />
                <input
                  id="reg-username"
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  minLength={3}
                  maxLength={20}
                  pattern="[a-z0-9_]+"
                  placeholder="tiny_explorer"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-dark bg-cream/50 text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-lavender-dark focus:ring-2 focus:ring-lavender/30 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="reg-password">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-muted" />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-cream-dark bg-cream/50 text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-lavender-dark focus:ring-2 focus:ring-lavender/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-ink-muted mt-1">Minimum 6 characters</p>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg" variant="secondary">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-ink-muted mt-5">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-lavender-dark hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
