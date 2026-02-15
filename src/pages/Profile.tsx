import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-display text-2xl font-bold tracking-wider">PROFILE</h1>

      <div className="gaming-card p-6">
        <div className="mb-6 flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="gradient-primary text-xl text-primary-foreground">
              {user?.username?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-display text-lg font-bold">{user?.username}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Username</Label>
            <Input defaultValue={user?.username} className="mt-1.5" />
          </div>
          <div>
            <Label>Email</Label>
            <Input defaultValue={user?.email} className="mt-1.5" />
          </div>
          <div>
            <Label>Full Name</Label>
            <Input defaultValue={user?.fullName || ''} placeholder="Your full name" className="mt-1.5" />
          </div>
          <Button className="gradient-primary border-0 font-semibold" onClick={() => toast.success('Profile updated!')}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
