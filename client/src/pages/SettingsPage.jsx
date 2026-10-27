import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { userService, petService } from '../services';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { Settings as SettingsIcon, User, Heart, Save, LogOut, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const { pet, setPet } = useGame();
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [petName, setPetName] = useState(pet?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPet, setSavingPet] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    setSavingPassword(true);
    try {
      await userService.changePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully! 🔒');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const data = await userService.updateProfile({ displayName });
      updateUser(data.user);
      toast.success('Profile updated! ✨');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePetName = async (e) => {
    e.preventDefault();
    setSavingPet(true);
    try {
      const data = await petService.updateName(petName);
      setPet(data.pet);
      toast.success('Pet name updated! 🐾');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingPet(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('See you soon! 👋');
      navigate('/');
    } catch {
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="page-enter space-y-6 max-w-xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-ink-muted" />
          Settings
        </h1>
        <p className="text-sm text-ink-muted">Manage your profile and preferences</p>
      </div>

      {/* Profile */}
      <Card>
        <h3 className="font-display font-bold text-ink mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-lavender-dark" />
          Profile
        </h3>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              minLength={2}
              maxLength={30}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream/50 text-ink focus:outline-none focus:border-lavender-dark focus:ring-2 focus:ring-lavender/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream/30 text-ink-muted cursor-not-allowed"
            />
            <p className="text-xs text-ink-muted mt-1">Email cannot be changed</p>
          </div>
          <Button type="submit" loading={savingProfile} icon={Save} size="sm">
            Save Profile
          </Button>
        </form>
      </Card>

      {/* Pet Name */}
      {pet && (
        <Card>
          <h3 className="font-display font-bold text-ink mb-4 flex items-center gap-2">
            <Heart className="w-4 h-4 text-peach-dark" />
            Pet Settings
          </h3>
          <form onSubmit={handleSavePetName} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Pet Name</label>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                minLength={1}
                maxLength={20}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream/50 text-ink focus:outline-none focus:border-lavender-dark focus:ring-2 focus:ring-lavender/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Species</label>
              <p className="text-ink-muted capitalize">{pet.species}</p>
            </div>
            <Button type="submit" loading={savingPet} icon={Save} size="sm" variant="secondary">
              Save Pet Name
            </Button>
          </form>
        </Card>
      )}

      {/* Password Security */}
      <Card>
        <h3 className="font-display font-bold text-ink mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-sky-dark" />
          Security & Password
        </h3>
        <form onSubmit={handleSavePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream/50 text-ink focus:outline-none focus:border-lavender-dark focus:ring-2 focus:ring-lavender/30 transition-all"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream/50 text-ink focus:outline-none focus:border-lavender-dark focus:ring-2 focus:ring-lavender/30 transition-all"
              placeholder="Minimum 8 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream/50 text-ink focus:outline-none focus:border-lavender-dark focus:ring-2 focus:ring-lavender/30 transition-all"
              placeholder="Re-enter new password"
            />
          </div>
          <Button type="submit" loading={savingPassword} icon={Lock} size="sm">
            Update Password
          </Button>
        </form>
      </Card>

      {/* Account info */}
      <Card>
        <h3 className="font-display font-bold text-ink mb-3">Account</h3>
        <div className="space-y-2 text-sm text-ink-muted">
          <p>Level: {user?.level || 1}</p>
          <p>Total XP: {user?.totalXP || 0}</p>
          <p>Coins: {user?.coins || 0}</p>
          <p>Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
        </div>
        <div className="mt-5 pt-4 border-t border-cream-dark">
          <Button variant="danger" size="sm" onClick={handleLogout} icon={LogOut}>
            Log Out
          </Button>
        </div>
      </Card>
    </div>
  );
}
