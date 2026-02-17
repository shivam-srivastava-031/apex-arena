import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Trophy, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Form side */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2">
            <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-lg">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold tracking-wider">ARENA</span>
          </Link>

          <h1 className="mb-2 font-display text-2xl font-bold tracking-wider">WELCOME BACK</h1>
          <p className="mb-8 text-muted-foreground">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="gamer@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" checked={remember} onCheckedChange={(v) => setRemember(v as boolean)} />
                <Label htmlFor="remember" className="text-sm">Remember me</Label>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="gradient-primary w-full border-0 font-semibold">
              {loading ? 'Signing in...' : 'Login'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>

      {/* Gradient side */}
      <div className="gradient-hero relative hidden flex-1 items-center justify-center lg:flex">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-1/4 top-1/3 h-64 w-64 rounded-full bg-primary blur-[80px]" />
          <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-secondary blur-[80px]" />
        </div>
        <div className="relative text-center text-primary-foreground">
          <Trophy className="mx-auto mb-6 h-16 w-16 animate-pulse-glow" />
          <h2 className="font-display text-3xl font-bold tracking-wider">ARENA ESPORTS</h2>
          <p className="mt-3 max-w-xs text-primary-foreground/70">
            Join India's fastest growing competitive gaming platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
