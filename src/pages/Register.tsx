import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Trophy, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email';
    if (!username.trim()) e.username = 'Username is required';
    else if (username.length < 3) e.username = 'Min 3 characters';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Min 6 characters';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!terms) e.terms = 'You must accept the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(email, username, password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Gradient side */}
      <div className="gradient-hero relative hidden flex-1 items-center justify-center lg:flex">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-1/4 top-1/3 h-64 w-64 rounded-full bg-primary blur-[80px]" />
          <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-secondary blur-[80px]" />
        </div>
        <div className="relative text-center text-primary-foreground">
          <Trophy className="mx-auto mb-6 h-16 w-16 animate-pulse-glow" />
          <h2 className="font-display text-3xl font-bold tracking-wider">JOIN THE BATTLE</h2>
          <p className="mt-3 max-w-xs text-primary-foreground/70">
            Create your account and start competing in tournaments today
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2">
            <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-lg">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold tracking-wider">ARENA</span>
          </Link>

          <h1 className="mb-2 font-display text-2xl font-bold tracking-wider">CREATE ACCOUNT</h1>
          <p className="mb-8 text-muted-foreground">Start your esports journey</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="gamer@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="ProGamer99" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1.5" />
              {errors.username && <p className="mt-1 text-xs text-destructive">{errors.username}</p>}
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
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1.5" />
              {errors.confirmPassword && <p className="mt-1 text-xs text-destructive">{errors.confirmPassword}</p>}
            </div>
            <div className="flex items-start gap-2">
              <Checkbox id="terms" checked={terms} onCheckedChange={(v) => setTerms(v as boolean)} className="mt-0.5" />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                I agree to the <span className="text-primary">Terms of Service</span> and <span className="text-primary">Privacy Policy</span>
              </Label>
            </div>
            {errors.terms && <p className="text-xs text-destructive">{errors.terms}</p>}

            <Button type="submit" disabled={loading} className="gradient-primary w-full border-0 font-semibold">
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
