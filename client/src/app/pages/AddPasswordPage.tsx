import { useState } from 'react';
import { useNavigate } from 'react-router';
import { usePasswords } from '../context/PasswordContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Globe, User, Lock, Sparkles, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  'Personal',
  'Work',
  'Finance',
  'Shopping',
  'Social Media',
  'Development',
  'Other',
];

const EMOJIS = ['🔐','🌐','📧','💼','🎬','🎮','💳','🏦','📱','🔑'];

export function AddPasswordPage() {

  const navigate = useNavigate();
  const { addPassword } = usePasswords();

  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [favicon, setFavicon] = useState('🔐');

  const generatePassword = () => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

    let newPassword = '';
    for (let i = 0; i < 16; i++) {
      newPassword += chars[Math.floor(Math.random() * chars.length)];
    }

    setPassword(newPassword);
    toast.success('Password generated!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!website || !username || !password || !category) {
      toast.error('Please fill in all required fields');
      return;
    }

    await addPassword({ website, username, password, category, notes });

    toast.success('Password added successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">

        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="hover:bg-accent text-foreground"
        >
          <ArrowLeft className="size-5" />
        </Button>

        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            Add New Password
          </h1>

          <p className="text-muted-foreground">
            Securely store a new password
          </p>
        </div>

      </div>

      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* MAIN */}
          <div className="lg:col-span-2 space-y-6">

            <Card className="bg-card border-border">

              <CardHeader>
                <CardTitle className="text-foreground">
                  Password Details
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">

                {/* WEBSITE */}
                <div className="space-y-2">
                  <Label className="text-foreground">Website *</Label>

                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />

                    <Input
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="pl-11 bg-card border-border text-foreground placeholder-muted-foreground focus:border-indigo-500/50 focus:bg-accent"
                      placeholder="GitHub, Gmail..."
                    />
                  </div>
                </div>

                {/* USERNAME */}
                <div className="space-y-2">
                  <Label className="text-foreground">Username *</Label>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />

                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-11 bg-card border-border text-foreground placeholder-muted-foreground focus:border-indigo-500/50 focus:bg-accent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="space-y-2">
                  <Label className="text-foreground">Password *</Label>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />

                      <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-11 bg-card border-border text-foreground placeholder-muted-foreground focus:border-indigo-500/50 focus:bg-accent"
                      />
                    </div>

                    <Button
                      type="button"
                      onClick={generatePassword}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600"
                    >
                      <Sparkles className="size-5 mr-2" />
                      Generate
                    </Button>
                  </div>
                </div>

                {/* CATEGORY */}
                <div className="space-y-2">
                  <Label className="text-foreground">Category *</Label>

                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-card border-border text-foreground">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>

                    <SelectContent className="bg-card border-border text-foreground">
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* NOTES */}
                <div className="space-y-2">
                  <Label className="text-foreground">Notes</Label>

                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-card border-border text-foreground placeholder-muted-foreground focus:border-indigo-500/50 focus:bg-accent"
                  />
                </div>

              </CardContent>
            </Card>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">

            {/* ICON */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Icon</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFavicon(emoji)}
                      className={`size-12 rounded-lg text-2xl flex items-center justify-center ${
                        favicon === emoji
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 scale-110'
                          : 'bg-muted hover:bg-accent'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* PREVIEW */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Preview</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-3">

                  <div className="size-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-2xl">
                    {favicon}
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">
                      {website || 'Website'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {username || 'username@email.com'}
                    </p>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* SAVE */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              <Save className="size-5 mr-2" />
              Save Password
            </Button>

          </div>

        </div>

      </form>
    </div>
  );
}