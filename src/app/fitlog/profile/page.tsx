'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { userRegisterSchema } from '@/lib/schema/signup';


export default function UpdateProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    gender: '',
    dateOfBirth: '',
    height: '',
    weight: '',
  });


  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

const validateField = (name: string, value: string) => {
  const mappedData = {
    ...formData,
    dateOfBirth: formData.dateOfBirth,
    [name]: value,
  };

  const result = userRegisterSchema.safeParse(mappedData);

  if (!result.success) {
    const issue = result.error.issues.find((i) =>
      i.path[0] === name || (name === 'dateOfBirth' && i.path[0] === 'dateOfBirth')
    );

    if (issue) {
      setFieldErrors((prev) => ({ ...prev, [name]: issue.message }));
    } else {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  } else {
    setFieldErrors((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  }
};


  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user) {
      setFormData({
        fullName: session.user.name || '',
        email: session.user.email || '',
        password: '',
        gender: session.user.gender || '',
        dateOfBirth: session.user.dateOfBirth || '',
        height: session.user.height?.toString() || '',
        weight: session.user.weight?.toString() || '',
      });
    }
  }, [status, session]);

  const onChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Update failed');
      console.log("✅ Update API result:", res);

      const { getSession } = await import("next-auth/react");
    await getSession();           // pulls updated session from server
    router.refresh();   


      
       toast.success('Profile updated! Please re-login to see your updated details.');
      router.refresh();

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-zinc-800 text-white">
      {/* Ambient Lights */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-12%] left-[-10%] w-[420px] h-[420px] bg-cyan-400/25 blur-[140px] rounded-full" />
        <div className="absolute bottom-[6%] right-[8%] w-[380px] h-[380px] bg-pink-500/25 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] bg-white/5 blur-[200px] rounded-full" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Optional illustration (can be replaced) */}
          <div className="hidden lg:flex relative items-center justify-center">
            <div className="absolute -inset-10 -z-10 bg-gradient-to-br from-cyan-400/20 via-pink-500/20 to-transparent blur-[180px] rounded-full" />
            <img
              src="https://illustrations.popsy.co/violet/stretching-girl.svg"
              alt="Fitness Illustration"
              className="w-full max-w-[540px] select-none pointer-events-none drop-shadow-[0_40px_120px_rgba(0,0,0,0.45)] mix-blend-screen opacity-95"
            />
          </div>

          {/* Form */}
          <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.35)] p-6 sm:p-8">
            <h1 className="text-3xl font-extrabold tracking-tight mb-4">Update <span className="text-cyan-400">Your</span> <span className="text-pink-400">Profile</span></h1>
            
            <form onSubmit={handleSubmit} className="space-y-5">
  <Field label="Full Name">
    <input
      type="text"
      name="fullName"
      maxLength={25}
      value={formData.fullName}
      onChange={(e) => {
        onChange('fullName')(e);
        validateField('fullName', e.target.value);
      }}
      onBlur={(e) => validateField('fullName', e.target.value)}
      required
      className={cnInput(fieldErrors.fullName)}
      placeholder="Your name"
    />
    {fieldErrors.fullName && <Err>{fieldErrors.fullName}</Err>}
  </Field>

  <Field label="Date of Birth">
    <input
      type="date"
      name="dateOfBirth"
      value={formData.dateOfBirth}
      onChange={(e) => {
        onChange('dateOfBirth')(e);
        validateField('dateOfBirth', e.target.value);
      }}
      onBlur={(e) => validateField('dateOfBirth', e.target.value)}
      className={cnInput(fieldErrors.dateOfBirth)}
    />
    {fieldErrors.dateOfBirth && <Err>{fieldErrors.dateOfBirth}</Err>}
  </Field>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <Field label="Height (cm)">
      <input
        type="number"
        name="height"
        value={formData.height}
        onChange={(e) => {
          onChange('height')(e);
          validateField('height', e.target.value);
        }}
        onBlur={(e) => validateField('height', e.target.value)}
        placeholder="175"
        className={cnInput(fieldErrors.height)}
      />
      {fieldErrors.height && <Err>{fieldErrors.height}</Err>}
    </Field>

    <Field label="Weight (kg)">
      <input
        type="number"
        name="weight"
        value={formData.weight}
        onChange={(e) => {
          onChange('weight')(e);
          validateField('weight', e.target.value);
        }}
        onBlur={(e) => validateField('weight', e.target.value)}
        placeholder="70"
        className={cnInput(fieldErrors.weight)}
      />
      {fieldErrors.weight && <Err>{fieldErrors.weight}</Err>}
    </Field>
  </div>

  <Field label="Gender">
    <select
      name="gender"
      value={formData.gender}
      onChange={(e) => {
        onChange('gender')(e);
        validateField('gender', e.target.value);
      }}
      onBlur={(e) => validateField('gender', e.target.value)}
      className={cnInput(fieldErrors.gender)}
    >
      <option value="">Select gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
    {fieldErrors.gender && <Err>{fieldErrors.gender}</Err>}
  </Field>

  <div className="pt-2">
    <Button
      type="submit"
      disabled={isLoading}
      className="relative overflow-hidden w-full rounded-xl px-6 py-3 text-white font-semibold bg-gradient-to-r from-cyan-500 to-pink-500 shadow-md transition-all duration-300 group"
    >
      <span className="relative z-10">{isLoading ? 'Saving...' : 'Save Changes'}</span>
      <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 rounded-xl blur-lg transition-transform duration-300" />
    </Button>
  </div>

  {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
</form>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helper UI ---------- */
const inputClassBase =
  'w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm ' +
  'placeholder:text-gray-400 text-white outline-none focus:ring-2 ' +
  'focus:ring-cyan-400/40 focus:border-transparent transition';

const cnInput = (gender: string) => inputClassBase;
function Err({ children }: { children: React.ReactNode }) {
  return <p className="text-red-400 text-xs mt-1">{children}</p>;
}

function Field({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium text-gray-300">{label}</div>
      {children}
    </label>
  );
}
