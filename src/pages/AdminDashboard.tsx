import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password || !adminSecret) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      await api.adminCreateCreator(username, email, password, adminSecret);
      setMessage({ type: 'success', text: 'Creator account created successfully!' });
      setPassword('');
      // Keep admin secret for convenience
      
      // Auto-redirect to login with email pre-fill
      navigate('/login', { state: { email: email } });
    } catch (err: any) {
      console.error('Creator creation failed', err);
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to create creator account. Check your secret key.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4">
      <Card className="w-full max-w-md border-zinc-200 dark:border-zinc-800 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
          <CardDescription>
            Enrol new Creator accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
              <div className={`p-3 rounded-md text-sm ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                  : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="adminSecret">Admin Secret Key</Label>
              <Input
                id="adminSecret"
                type="password"
                placeholder="Enter admin secret"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                required
              />
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-800 my-4 pt-4">
              <h3 className="font-semibold mb-4">New Creator Details</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="creator_username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="creator@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Initial password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Creator Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
