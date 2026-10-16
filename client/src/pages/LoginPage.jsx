import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form);
      toast.success(`Welcome back, ${data.user.displayName}! 🌍`);
      if (!data.user.onboardingCompleted) {
        navigate('/onboarding');
      } else {
        navigate('/room');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 page-enter">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-lavender/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🌍</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-ink mb-2">Welcome Back</h1>
          <p className="text-ink-muted">Your tiny world is waiting for you.</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="login-email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-muted" />
                <input
                  id="login-email"
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

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="login-password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-muted" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••"
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
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Log In
            </Button>
          </form>

          <p className="text-center text-sm text-ink-muted mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-lavender-dark hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
