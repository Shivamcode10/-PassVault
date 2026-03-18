import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Key, Shield, Zap, Lock, Eye, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-500/30 rounded-full blur-3xl" />

        {/* Navbar */}
        <nav className="relative border-b border-white/10 backdrop-blur-xl bg-gray-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Key className="size-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  PassVault
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="hover:bg-white/10"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/signup')}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Secure Your Digital Life
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
              The most secure and user-friendly password manager. Store, generate,
              and manage all your passwords in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-lg px-8 py-6"
              >
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/login')}
                className="border-white/20 hover:bg-white/10 text-lg px-8 py-6"
              >
                Sign In
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Shield}
              title="Military-Grade Encryption"
              description="Your data is encrypted with AES-256 encryption, the same standard used by governments."
            />
            <FeatureCard
              icon={Zap}
              title="Auto-Fill Passwords"
              description="Automatically fill in your passwords across all your devices and browsers."
            />
            <FeatureCard
              icon={Lock}
              title="Secure Password Generator"
              description="Generate strong, unique passwords for all your accounts instantly."
            />
            <FeatureCard
              icon={Eye}
              title="Dark Web Monitoring"
              description="Get alerts if your passwords are found in data breaches."
            />
            <FeatureCard
              icon={Smartphone}
              title="Cross-Platform Sync"
              description="Access your passwords on desktop, mobile, and browser extensions."
            />
            <FeatureCard
              icon={Key}
              title="Zero-Knowledge Security"
              description="We can't see your passwords. Only you have access to your vault."
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/10 backdrop-blur-xl bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400 text-sm">
            © 2026 PassVault. All rights reserved. Built with security in mind.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:bg-white/10">
      <div className="size-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="size-6 text-indigo-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}
