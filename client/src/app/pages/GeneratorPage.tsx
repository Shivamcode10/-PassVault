import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Copy, Check, RefreshCw, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

export function GeneratorPage() {
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = '';
    let guaranteedChars = '';

    if (options.uppercase) {
      charset += uppercase;
      guaranteedChars += uppercase[Math.floor(Math.random() * uppercase.length)];
    }
    if (options.lowercase) {
      charset += lowercase;
      guaranteedChars += lowercase[Math.floor(Math.random() * lowercase.length)];
    }
    if (options.numbers) {
      charset += numbers;
      guaranteedChars += numbers[Math.floor(Math.random() * numbers.length)];
    }
    if (options.symbols) {
      charset += symbols;
      guaranteedChars += symbols[Math.floor(Math.random() * symbols.length)];
    }

    if (charset === '') {
      toast.error('Please select at least one character type');
      return;
    }

    let newPassword = guaranteedChars;

    for (let i = guaranteedChars.length; i < options.length; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)];
    }

    newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');

    setPassword(newPassword);
    setCopied(false);
  };

  useEffect(() => {
    generatePassword();
  }, [options.length, options.uppercase, options.lowercase, options.numbers, options.symbols]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success('Password copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getPasswordStrength = () => {
    let strength = 0;
    if (options.length >= 12) strength++;
    if (options.length >= 16) strength++;
    if (options.uppercase) strength++;
    if (options.lowercase) strength++;
    if (options.numbers) strength++;
    if (options.symbols) strength++;

    if (strength <= 2) return { label: 'Weak', color: 'from-red-500 to-orange-500', width: '33%' };
    if (strength <= 4) return { label: 'Medium', color: 'from-yellow-500 to-orange-500', width: '66%' };
    return { label: 'Strong', color: 'from-green-500 to-emerald-500', width: '100%' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4">
          <Sparkles className="size-8 text-white" />
        </div>

        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Password Generator
        </h1>

        <p className="text-muted-foreground">
          Create strong and secure passwords instantly
        </p>
      </div>

      {/* Main Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">
            Generated Password
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* Password Display */}
          <div className="relative">
            <div className="flex items-center gap-3 p-6 rounded-xl bg-muted border border-border">

              {/* PASSWORD TEXT */}
              <div className="flex-1 min-w-0 font-mono text-xl break-all text-foreground">
                {password || 'Click generate to create a password'}
              </div>

              {/* BUTTONS */}
              <div className="flex gap-2 flex-shrink-0">

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={copyToClipboard}
                  disabled={!password}
                  className="hover:bg-accent"
                >
                  {copied ? (
                    <Check className="size-5 text-green-400" />
                  ) : (
                    <Copy className="size-5" />
                  )}
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={generatePassword}
                  className="hover:bg-accent"
                >
                  <RefreshCw className="size-5" />
                </Button>

              </div>

            </div>
          </div>

          {/* Strength */}
          {password && (
            <div className="space-y-2">

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Password Strength
                </span>

                <span className="font-semibold text-foreground">
                  {strength.label}
                </span>
              </div>

              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${strength.color}`}
                  style={{ width: strength.width }}
                />
              </div>

            </div>
          )}

        </CardContent>
      </Card>

      {/* Options */}
      <Card className="bg-card border-border">

        <CardHeader>
          <CardTitle className="text-foreground">
            Customization Options
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* Length */}
          <div className="space-y-3">

            <div className="flex justify-between">
              <Label className="text-foreground">
                Password Length
              </Label>

              <span className="text-indigo-400 font-semibold px-3 py-1 rounded-lg bg-indigo-500/20">
                {options.length}
              </span>
            </div>

            <Slider
              value={[options.length]}
              onValueChange={(value) => setOptions({ ...options, length: value[0] })}
              min={4}
              max={32}
              step={1}
            />

          </div>

          {/* OPTIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Option label="Uppercase (A-Z)" icon="Aa" color="bg-indigo-500/20" checked={options.uppercase} onChange={(v: boolean) => setOptions({ ...options, uppercase: v })} />
            <Option label="Lowercase (a-z)" icon="abc" color="bg-purple-500/20" checked={options.lowercase} onChange={(v: boolean) => setOptions({ ...options, lowercase: v })} />
            <Option label="Numbers (0-9)" icon="123" color="bg-pink-500/20" checked={options.numbers} onChange={(v: boolean) => setOptions({ ...options, numbers: v })} />
            <Option label="Symbols (!@#$...)" icon="!@#" color="bg-orange-500/20" checked={options.symbols} onChange={(v: boolean) => setOptions({ ...options, symbols: v })} />

          </div>

        </CardContent>
      </Card>

    </div>
  );
}

function Option({ label, icon, color, checked, onChange }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">

      <div className="flex items-center gap-3">

        <div className={`size-10 rounded-lg ${color} flex items-center justify-center`}>
          <span className="text-lg text-white">{icon}</span>
        </div>

        <Label className="text-foreground cursor-pointer">
          {label}
        </Label>

      </div>

      <Switch checked={checked} onCheckedChange={onChange} />

    </div>
  );
}