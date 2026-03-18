import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
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

export function EditPasswordPage() {

  const navigate = useNavigate();
  const { id } = useParams();
  const { getPassword, updatePassword } = usePasswords();

  const passwordData = id ? getPassword(id) : undefined;

  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [favicon, setFavicon] = useState('🔐');

  useEffect(() => {
    if (passwordData) {
      setWebsite(passwordData.website || '');
      setUsername(passwordData.username || '');
      setPassword(passwordData.password || '');
      setCategory(passwordData.category || '');
      setNotes(passwordData.notes || '');
      setFavicon(passwordData.favicon || '🔐');
    }
  }, [passwordData]);

  if (!passwordData) {
    return <div className="p-6 text-foreground">Loading...</div>;
  }

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
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await updatePassword(passwordData._id, {
        website,
        username,
        password,
        category,
        notes,
        favicon,
      });

      toast.success('Password updated successfully');
      navigate(`/passwords/${passwordData._id}`);
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">

        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="hover:bg-accent"
        >
          <ArrowLeft className="size-5" />
        </Button>

        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Edit Password
          </h1>
          <p className="text-muted-foreground">
            Update your saved password
          </p>
        </div>

      </div>

      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* MAIN FORM */}
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
                      className="pl-11 bg-muted border-border text-foreground"
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
                      className="pl-11 bg-muted border-border text-foreground"
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
                        className="pl-11 bg-muted border-border text-foreground"
                      />
                    </div>

                    <Button type="button" onClick={generatePassword}>
                      <Sparkles className="mr-2 size-4" />
                      Generate
                    </Button>

                  </div>
                </div>

                {/* CATEGORY */}
                <div className="space-y-2">
                  <Label className="text-foreground">Category *</Label>

                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-muted border-border text-foreground">
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
                    className="bg-muted border-border text-foreground"
                  />
                </div>

              </CardContent>
            </Card>

          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">

            {/* ICON SELECT */}
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
                      className={`size-12 rounded-lg text-2xl flex items-center justify-center transition ${
                        favicon === emoji
                          ? 'bg-indigo-500 text-white scale-110'
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
            <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
              <CardHeader>
                <CardTitle className="text-foreground">Preview</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-3">

                  <div className="text-2xl">{favicon}</div>

                  <div>
                    <p className="text-foreground font-semibold">
                      {website || 'Website'}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {username || 'username'}
                    </p>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* UPDATE */}
            <Button type="submit" className="w-full">
              <Save className="mr-2 size-4" />
              Update Password
            </Button>

          </div>

        </div>

      </form>

    </div>
  );
}