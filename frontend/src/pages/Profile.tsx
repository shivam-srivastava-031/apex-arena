import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateProfile } from '@/services/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [bgmiId, setBgmiId] = useState('');
  const [ffId, setFfId] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile || user) {
      // Prioritize profile data, fallback to user data (since AuthContext blends them depending on your fetch structure)
      const dataSrc = profile || user;
      setFullName(dataSrc.name || dataSrc.full_name || '');
      setPhone(dataSrc.phone || '');
      setDob(dataSrc.dob || dataSrc.date_of_birth || '');
      setBgmiId(dataSrc.bgmiId || dataSrc.bgmi_id || '');
      setFfId(dataSrc.ffId || dataSrc.ff_id || '');
    }
  }, [profile, user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    try {
      await updateProfile({
        name: fullName,
        phone,
        dob: dob || null,
        bgmiId,
        ffId,
      });
      toast.success('Profile updated successfully!');
      refreshProfile();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-display text-2xl font-bold tracking-wider">PROFILE</h1>

      <div className="gaming-card p-6">
        <div className="mb-8 flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-20 w-20">
              {avatarPreview ? (
                <AvatarImage src={avatarPreview} alt="Avatar" />
              ) : (
                <AvatarFallback className="gradient-primary text-2xl text-primary-foreground">
                  {(profile?.username || user?.email || '?').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground transition-transform hover:scale-110"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">{user?.name || user?.username || 'User'}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" className="mt-1.5" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={user?.email || ''} readOnly className="mt-1.5 bg-muted/50" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Phone Number</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="mt-1.5" />
            </div>
            <div>
              <Label>Date of Birth</Label>
              <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-1.5" />
            </div>
          </div>

          <div className="border-t border-border pt-5">
            <h3 className="mb-4 font-display text-sm font-bold tracking-wider">GAME IDs</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>BGMI ID</Label>
                <Input value={bgmiId} onChange={(e) => setBgmiId(e.target.value)} placeholder="Enter your BGMI ID" className="mt-1.5" />
              </div>
              <div>
                <Label>Free Fire ID</Label>
                <Input value={ffId} onChange={(e) => setFfId(e.target.value)} placeholder="Enter your Free Fire ID" className="mt-1.5" />
              </div>
            </div>
          </div>

          <Button className="gradient-primary border-0 font-semibold" onClick={handleSave} disabled={loading}>
            {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>) : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
