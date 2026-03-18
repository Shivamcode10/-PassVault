import { useState } from 'react';
import { useNavigate } from 'react-router';
import { usePasswords } from '../context/PasswordContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Search, Eye, EyeOff, Copy } from 'lucide-react';
import { toast } from 'sonner';

export function AllPasswords() {
  const navigate = useNavigate();
  const { passwords, deletePassword } = usePasswords();

  const [searchQuery, setSearchQuery] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(passwords.map((p) => p.category)))];

  const filteredPasswords = passwords.filter((password) => {
    const matchesSearch =
      password.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
      password.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || password.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const togglePasswordVisibility = (id: string) => {
    const newVisible = new Set(visiblePasswords);
    newVisible.has(id) ? newVisible.delete(id) : newVisible.add(id);
    setVisiblePasswords(newVisible);
  };

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            All Passwords
          </h1>
          <p className="text-muted-foreground">
            Manage and organize your passwords
          </p>
        </div>

        <Button
          onClick={() => navigate('/add-password')}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
        >
          <Plus className="size-5 mr-2" />
          Add Password
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />

          <Input
            type="search"
            placeholder="Search passwords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 bg-card border-border text-foreground placeholder-muted-foreground focus:border-indigo-500/50 focus:bg-accent"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600'
                  : 'border-border hover:bg-accent text-foreground'
              }
            >
              {category}
            </Button>
          ))}
        </div>

      </div>

      {/* List */}
      {filteredPasswords.length === 0 ? (

        <div className="text-center py-12 bg-card border border-border rounded-2xl">
          <Search className="size-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No passwords found</p>
        </div>

      ) : (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {filteredPasswords.map((password) => (

            <div
              key={password._id}
              className="group p-6 rounded-xl bg-card border border-border hover:border-indigo-500/50 hover:bg-accent transition-all duration-200 cursor-pointer"
              onClick={() => navigate(`/passwords/${password._id}`)}
            >

              <div className="flex items-start gap-4">

                <div className="size-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-2xl">
                  🔐
                </div>

                <div className="flex-1 min-w-0">

                  <h3 className="font-semibold text-foreground">
                    {password.website}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {password.username}
                  </p>

                  {/* PASSWORD ROW */}
                  <div className="flex items-center gap-2 mt-3">

                    <code className="flex-1 px-3 py-2 rounded-lg bg-muted text-foreground text-sm font-mono truncate">
                      {visiblePasswords.has(password._id)
                        ? password.password
                        : '••••••••••••'}
                    </code>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePasswordVisibility(password._id);
                      }}
                      className="hover:bg-accent text-foreground"
                    >
                      {visiblePasswords.has(password._id) ? <EyeOff /> : <Eye />}
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(password.password, 'Password');
                      }}
                      className="hover:bg-accent text-foreground"
                    >
                      <Copy />
                    </Button>

                    {/* EDIT */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/passwords/${password._id}/edit`);
                      }}
                      className="hover:bg-blue-500/20 text-blue-400"
                    >
                      ✏️
                    </Button>

                    {/* DELETE */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!window.confirm("Delete this password?")) return;
                        await deletePassword(password._id);
                      }}
                      className="hover:bg-red-500/20 text-red-400"
                    >
                      🗑
                    </Button>

                  </div>

                </div>
              </div>
            </div>

          ))}

        </div>

      )}
    </div>
  );
}