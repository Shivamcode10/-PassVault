import { useNavigate } from "react-router";
import { usePasswords } from "../context/PasswordContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Plus, Key, Shield, AlertTriangle, Eye, EyeOff, Copy } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function Dashboard() {

  const navigate = useNavigate();
  const { passwords } = usePasswords();

  const passwordList = passwords ?? [];

  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  const stats = {
    total: passwordList.length,
    strong: passwordList.filter((p) => p?.password?.length >= 12).length,
    weak: passwordList.filter((p) => p?.password?.length < 12).length,
  };

  const recentPasswords = passwordList.slice(0, 5);

  const togglePasswordVisibility = (id: string) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(id)) newVisible.delete(id);
    else newVisible.add(id);
    setVisiblePasswords(newVisible);
  };

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            Dashboard
          </h1>

          <p className="text-muted-foreground">
            Welcome back! Here's your security overview.
          </p>
        </div>

        <Button
          onClick={() => navigate("/add-password")}
          className="bg-gradient-to-r from-indigo-500 to-purple-600"
        >
          <Plus className="size-5 mr-2" />
          Add Password
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <StatCard icon={Key} title="Total Passwords" value={stats.total} color="from-indigo-500 to-purple-600" description="Stored securely" />
        <StatCard icon={Shield} title="Strong Passwords" value={stats.strong} color="from-green-500 to-emerald-600" description="12+ characters" />
        <StatCard icon={AlertTriangle} title="Weak Passwords" value={stats.weak} color="from-orange-500 to-red-600" description="Need updating" />

      </div>

      {/* Recent Passwords */}
      <Card className="bg-card border-border">

        <CardHeader className="flex flex-row items-center justify-between">

          <CardTitle className="text-foreground">
            Recent Passwords
          </CardTitle>

          <Button
            variant="ghost"
            onClick={() => navigate("/passwords")}
            className="hover:bg-accent text-foreground"
          >
            View All
          </Button>

        </CardHeader>

        <CardContent>

          {recentPasswords.length === 0 ? (

            <div className="text-center py-12">

              <Key className="size-12 mx-auto mb-4 text-muted-foreground" />

              <p className="text-muted-foreground mb-4">
                No passwords yet
              </p>

              <Button
                onClick={() => navigate("/add-password")}
                className="bg-gradient-to-r from-indigo-500 to-purple-600"
              >
                Add Your First Password
              </Button>

            </div>

          ) : (

            <div className="space-y-3">

              {recentPasswords.map((password) => (

                <div
                  key={password._id}   // ✅ FIXED
                  className="group p-4 rounded-lg bg-card border border-border hover:border-indigo-500/50 hover:bg-accent transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(`/passwords/${password._id}`)} // ✅ FIXED
                >

                  <div className="flex items-center gap-4">

                    {/* Icon */}
                    <div className="size-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                      {password.favicon || "🔐"}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">

                      <h3 className="font-semibold mb-1 text-foreground">
                        {password.website}
                      </h3>

                      <p className="text-sm text-muted-foreground truncate">
                        {password.username}
                      </p>

                    </div>

                    {/* Password */}
                    <div className="hidden md:flex items-center gap-3">

                      <code className="w-44 text-center px-3 py-1.5 rounded-lg bg-muted text-foreground text-sm font-mono tracking-widest truncate">
                        {visiblePasswords.has(password._id) // ✅ FIXED
                          ? password.password
                          : "••••••••••••"}
                      </code>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePasswordVisibility(password._id); // ✅ FIXED
                        }}
                        className="hover:bg-accent text-foreground"
                      >
                        {visiblePasswords.has(password._id)
                          ? <EyeOff className="size-4" />
                          : <Eye className="size-4" />}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(password.password, "Password");
                        }}
                        className="hover:bg-accent text-foreground"
                      >
                        <Copy className="size-4" />
                      </Button>

                    </div>

                    {/* Category */}
                    <div className="hidden sm:block">
                      <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-medium">
                        {password.category}
                      </span>
                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </CardContent>

      </Card>

      {/* Security Tip */}
      <Card className="bg-card border-border">

        <CardContent className="p-6">

          <div className="flex items-start gap-4">

            <div className="size-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <Shield className="size-6 text-indigo-400" />
            </div>

            <div className="flex-1">

              <h3 className="font-semibold mb-2 text-foreground">
                Security Tip
              </h3>

              <p className="text-sm text-muted-foreground mb-4">
                Use our password generator to create strong, unique passwords
              </p>

              <Button
                onClick={() => navigate("/generator")}
                variant="outline"
                className="border-border hover:bg-accent text-foreground"
              >
                Open Generator
              </Button>

            </div>

          </div>

        </CardContent>

      </Card>

    </div>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  color,
  description,
}: any) {

  return (
    <Card className="bg-card border-border">

      <CardContent className="p-6">

        <div className="flex items-center justify-between mb-4">

          <div className={`size-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Icon className="size-6 text-white" />
          </div>

          <div className={`text-3xl font-bold bg-gradient-to-br ${color} bg-clip-text text-transparent`}>
            {value}
          </div>

        </div>

        <h3 className="font-semibold mb-1 text-foreground">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground">
          {description}
        </p>

      </CardContent>

    </Card>
  );
}