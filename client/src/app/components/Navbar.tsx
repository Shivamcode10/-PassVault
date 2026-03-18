import { Search, Bell, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from '../context/AuthContext';
import { usePasswords } from '../context/PasswordContext';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

export function Navbar() {

  const { user, logout } = useAuth();
  const { passwords } = usePasswords();
  const navigate = useNavigate();

  // ✅ FIX: sync with actual DOM (IMPORTANT)
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // ✅ LIVE SEARCH
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const filtered = passwords.filter((p: any) =>
      p.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(filtered.slice(0, 5));
  }, [searchQuery, passwords]);

  // ✅ CLEAN TOGGLE (ONLY THIS SHOULD CONTROL THEME)
  const toggleTheme = () => {
    const html = document.documentElement;

    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-xl">

      <div className="h-full px-4 lg:px-8 flex items-center justify-between">

        {/* 🔍 SEARCH */}
        <div className="flex-1 max-w-xl relative">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />

          <Input
            type="search"
            placeholder="Search passwords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border text-foreground placeholder-muted-foreground focus:border-indigo-500/50 focus:bg-accent"
          />

          {/* RESULTS */}
          {results.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-card border border-border rounded-lg shadow-lg z-50">

              {results.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    navigate(`/passwords/${item._id}`);
                    setSearchQuery("");
                    setResults([]);
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-accent cursor-pointer"
                >
                  <div className="text-xl">
                    {item.favicon || "🔐"}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {item.website}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.username}
                    </p>
                  </div>
                </div>
              ))}

              <div
                onClick={() => {
                  navigate(`/passwords?search=${searchQuery}`);
                  setSearchQuery("");
                  setResults([]);
                }}
                className="text-center py-2 text-indigo-400 text-sm hover:bg-accent cursor-pointer"
              >
                View all results
              </div>

            </div>
          )}

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 ml-6">

          {/* 🌙 THEME BUTTON */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:bg-accent text-foreground"
          >
            {isDark ? <Moon /> : <Sun />}
          </Button>

          {/* 👤 USER */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-3 hover:bg-accent h-10 px-3">

                <div className="size-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-semibold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>

                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-foreground">
                    {user?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user?.email}
                  </div>
                </div>

              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 bg-card border-border">

              <DropdownMenuLabel className="text-muted-foreground">
                My Account
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => navigate('/settings')}
                className="focus:bg-accent text-foreground cursor-pointer"
              >
                Settings
              </DropdownMenuItem>

              <DropdownMenuItem className="focus:bg-accent text-foreground cursor-pointer">
                Help & Support
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="focus:bg-red-500/20 text-red-400 cursor-pointer"
              >
                Logout
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>

        </div>

      </div>
    </header>
  );
}