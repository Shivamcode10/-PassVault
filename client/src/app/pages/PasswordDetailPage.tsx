import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { usePasswords } from '../context/PasswordContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  ArrowLeft,
  Copy,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Lock,
  Calendar,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';

export function PasswordDetailPage() {

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPassword, deletePassword } = usePasswords();

  const [showPassword, setShowPassword] = useState(false);

  const password = id ? getPassword(id) : undefined;

  if (!password) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Password not found</p>
        <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
      </div>
    );
  }

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${type} copied`);
  };

  const handleDelete = () => {
    deletePassword(password._id);
    toast.success('Password deleted');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="hover:bg-accent"
          >
            <ArrowLeft />
          </Button>

          <div className="flex items-center gap-4">

            <div className="size-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-4xl">
              {password.favicon || '🔐'}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {password.website}
              </h1>
              <p className="text-muted-foreground">
                {password.category}
              </p>
            </div>

          </div>
        </div>

        <div className="flex items-center gap-2">

          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-accent"
            onClick={() => navigate(`/passwords/${password._id}/edit`)}
          >
            <Edit className="mr-2" />
            Edit
          </Button>

          {/* DELETE */}
          <AlertDialog>
            <AlertDialogTrigger asChild>

              <Button className="bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500 hover:text-white">
                <Trash2 className="mr-2" />
                Delete
              </Button>

            </AlertDialogTrigger>

            <AlertDialogContent className="bg-card border-border text-foreground">

              <AlertDialogHeader>
                <AlertDialogTitle>Delete Password?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="bg-muted border-border">
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>

            </AlertDialogContent>

          </AlertDialog>

        </div>
      </div>

      {/* PASSWORD CARD */}
      <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">

        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Lock className="text-indigo-400" />
            Password
          </CardTitle>
        </CardHeader>

        <CardContent>

          <div className="flex items-center gap-2">

            <code className="flex-1 px-4 py-3 rounded-lg bg-muted text-foreground font-mono text-lg break-all">
              {showPassword ? password.password : '••••••••••••'}
            </code>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowPassword(!showPassword)}
              className="hover:bg-accent"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard(password.password, 'Password')}
              className="hover:bg-accent"
            >
              <Copy />
            </Button>

          </div>

          {/* Strength + Length */}
          <div className="mt-4 flex items-center gap-4 text-sm">

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Strength:</span>

              <span
                className={`px-2 py-1 rounded-lg font-medium ${
                  (password.password?.length || 0) >= 12
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-orange-500/20 text-orange-400'
                }`}
              >
                {(password.password?.length || 0) >= 12 ? 'Strong' : 'Weak'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Length:</span>

              <span className="text-foreground font-medium">
                {password.password?.length || 0} characters
              </span>
            </div>

          </div>

        </CardContent>
      </Card>

      {/* CREATED DATE */}
      <Card className="bg-card border-border">

        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="text-indigo-400" />
            Created Date
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-foreground font-medium">
            {password.createdAt
              ? new Date(password.createdAt).toLocaleDateString()
              : 'N/A'}
          </p>
        </CardContent>

      </Card>

      {/* NOTES */}
      {password.notes && (
        <Card className="bg-card border-border">

          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <FileText className="text-indigo-400" />
              Notes
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {password.notes}
            </p>
          </CardContent>

        </Card>
      )}

    </div>
  );
}