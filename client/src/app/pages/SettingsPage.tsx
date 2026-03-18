import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import {
  updateProfile,
  changePassword,
  toggle2FA,
  toggleAutoLock
} from '../services/api';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';

import {
  User,
  Mail,
  Lock,
  Shield,
  LogOut,
  Save,
  Smartphone,
} from 'lucide-react';

import { toast } from 'sonner';

export function SettingsPage() {

  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [twoFactor, setTwoFactor] = useState(false);
  const [autoLock, setAutoLock] = useState(true);

  // 🔥 LOAD USER SETTINGS FROM BACKEND (IMPORTANT)
  useEffect(() => {
    if (user) {
      setTwoFactor((user as any)?.isTwoFactorEnabled || false);
      setAutoLock((user as any)?.autoLockEnabled ?? true);
    }
  }, [user]);

  // ✅ UPDATE PROFILE
  const handleSave = async () => {
    try {
      const res = await updateProfile({ name, email });
      setUser(res.data.user);
      toast.success('Profile updated');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  // ✅ CHANGE PASSWORD
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      return toast.error('Fill all fields');
    }

    try {
      await changePassword({ currentPassword, newPassword });
      toast.success('Password changed');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  // 🔐 TOGGLE 2FA
  const handleToggle2FA = async (value: boolean) => {
    try {
      setTwoFactor(value);
      await toggle2FA(value);

      toast.success(
        value ? '2FA Enabled 🔐' : '2FA Disabled'
      );
    } catch {
      toast.error('Failed to update 2FA');
    }
  };

  // 🔐 TOGGLE AUTO LOCK
  const handleToggleAutoLock = async (value: boolean) => {
    try {
      setAutoLock(value);
      await toggleAutoLock(value);

      toast.success(
        value ? 'Auto Lock Enabled ⏱️' : 'Auto Lock Disabled'
      );
    } catch {
      toast.error('Failed to update Auto Lock');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account</p>
      </div>

      {/* PROFILE */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update details</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">

          <div className="grid grid-cols-2 gap-4">

            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

          </div>

          <Button onClick={handleSave}>
            <Save className="mr-2 size-4" />
            Save
          </Button>

        </CardContent>
      </Card>

      {/* SECURITY */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          <div>
            <Label>Current Password</Label>
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>

          <div>
            <Label>New Password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>

          <Button onClick={handleChangePassword}>
            Change Password
          </Button>

          <Separator />

          {/* 🔐 2FA */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="text-indigo-400" />
              <span>Two-Factor Authentication</span>
            </div>
            <Switch
              checked={twoFactor}
              onCheckedChange={handleToggle2FA}
            />
          </div>

          {/* ⏱️ AUTO LOCK */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Smartphone className="text-purple-400" />
              <span>Auto Lock (10 min)</span>
            </div>
            <Switch
              checked={autoLock}
              onCheckedChange={handleToggleAutoLock}
            />
          </div>

        </CardContent>
      </Card>

      {/* LOGOUT */}
      <Button onClick={handleLogout} className="bg-red-500">
        <LogOut className="mr-2 size-4" />
        Logout
      </Button>

    </div>
  );
}