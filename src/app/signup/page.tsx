'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { z } from 'zod';

// ---- Import your Zod schema (adjust path if needed)
import { userRegisterSchema } from '@/lib/schema/signup'; 
// NOTE: If your schema file expects `dateOfBirth` (not `dob`), we map it below.

export default function SignupPage() {
  const router = useRouter();

  // ---- Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',          // <input name="dob" />
    height: '',
    weight: '',
    gender: '',       // keep if required by schema
    agree: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [k: string]: string }>({});
  const [error, setError] = useState('');

  // ---- Helpers
  const onChange =
    (name: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        e.target.type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
      setFormData((prev) => ({ ...prev, [name]: value as any }));
    };

  const validateAll = () => {
    // Map frontend keys to schema keys (convert dob -> dateOfBirth)
    const dataForSchema = {
      ...formData,
      dateOfBirth: formData.dob,
      height: formData.height,
      weight: formData.weight,
    };

    const result = userRegisterSchema.safeParse(dataForSchema);
    if (!result.success) {
      const errs: { [k: string]: string } = {};
      result.error.issues.forEach((iss) => {
        const field = (iss.path?.[0] as string) || 'form';
        errs[field] = iss.message;
      });
      setFieldErrors(errs);
      return false;
    }
    setFieldErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validate on submit
    const ok = validateAll();
    if (!ok) return;

    setIsLoading(true);
    try {
      // Prepare payload for API route
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        dateOfBirth: formData.dob, // API/schema expects dateOfBirth
        gender: formData.gender || undefined, // if optional
        height: formData.height, // strings are fine; server schema likely coerce.number()
        weight: formData.weight,
        agree: formData.agree,
      };

      const res = await axios.post('/api/auth/register', payload);
      if (res.status === 201) {
        router.push('/login');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong');
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

      {/* Wrapper */}
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        {/* Brand + Link */}
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-pink-500 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" className="text-white" viewBox="0 0 24 24">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </span>
            <span className="text-xl font-extrabold tracking-wide">FitLog</span>
          </Link>
          <div className="text-sm text-gray-300">
            Already have an account?{" "}
            <Link href="/login" className="underline decoration-pink-400 decoration-2 underline-offset-4 hover:text-white">
              Log in
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Illustration */}
          <div className="hidden lg:flex relative items-center justify-center">
            <div className="absolute -inset-10 -z-10 bg-gradient-to-br from-cyan-400/20 via-pink-500/20 to-transparent blur-[180px] rounded-full" />
            <img
              src="https://illustrations.popsy.co/violet/stretching-girl.svg"
              alt="Fitness Illustration"
              className="w-full max-w-[540px] select-none pointer-events-none drop-shadow-[0_40px_120px_rgba(0,0,0,0.45)] mix-blend-screen opacity-95"
            />
          </div>

          {/* Glassmorphic Form */}
          <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.35)] p-6 sm:p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-extrabold tracking-tight">
                Create your <span className="text-cyan-400">Fit</span>
                <span className="text-pink-400">Log</span> account
              </h1>
              <p className="mt-2 text-sm text-gray-300">
                Personalize your dashboard with accurate health metrics and goals.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={onChange('fullName')}
                    required
                    className={cnInput(fieldErrors.fullName)}
                    placeholder="Alex Carter"
                  />
                  {fieldErrors.fullName && <Err>{fieldErrors.fullName}</Err>}
                </Field>
                <Field label="Email Address">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange('email')}
                    required
                    className={cnInput(fieldErrors.email)}
                    placeholder="alex@example.com"
                  />
                  {fieldErrors.email && <Err>{fieldErrors.email}</Err>}
                </Field>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Password">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={onChange('password')}
                    required
                    className={cnInput(fieldErrors.password)}
                    placeholder="••••••••"
                  />
                  {fieldErrors.password && <Err>{fieldErrors.password}</Err>}
                </Field>
                <Field label="Confirm Password">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={onChange('confirmPassword')}
                    required
                    className={cnInput(fieldErrors.confirmPassword)}
                    placeholder="••••••••"
                  />
                  {fieldErrors.confirmPassword && <Err>{fieldErrors.confirmPassword}</Err>}
                </Field>
              </div>

              {/* Date of Birth */}
              <Field label="Date of Birth">
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={onChange('dob')}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className={cnInput(fieldErrors.dateOfBirth || fieldErrors.dob)}
                />
                {(fieldErrors.dateOfBirth || fieldErrors.dob) && (
                  <Err>{fieldErrors.dateOfBirth || fieldErrors.dob}</Err>
                )}
              </Field>

              {/* Height & Weight (Metric only) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Height (cm)">
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={onChange('height')}
                    required
                    min={0}
                    className={cnInput(fieldErrors.height)}
                    placeholder="175"
                  />
                  {fieldErrors.height && <Err>{fieldErrors.height}</Err>}
                </Field>
                <Field label="Weight (kg)">
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={onChange('weight')}
                    required
                    min={0}
                    className={cnInput(fieldErrors.weight)}
                    placeholder="70"
                  />
                  {fieldErrors.weight && <Err>{fieldErrors.weight}</Err>}
                </Field>
              </div>

              {/* Gender (keep if your schema requires it) */}
              <Field label="Gender">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={onChange('gender')}
                  className={cnInput(fieldErrors.gender)}
                  required
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                {fieldErrors.gender && <Err>{fieldErrors.gender}</Err>}
              </Field>

              {/* Terms */}
              <label className="flex items-start gap-3 text-sm text-gray-300">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={onChange('agree')}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-cyan-400"
                  required
                />
                <span>
                  I agree to the{' '}
                  <Link href="/terms" className="text-cyan-300 hover:text-white underline decoration-cyan-400/70">
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-cyan-300 hover:text-white underline decoration-cyan-400/70">
                    Privacy Policy
                  </Link>.
                </span>
              </label>
              {fieldErrors.agree && <Err>{fieldErrors.agree}</Err>}

              {/* Submit */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="relative overflow-hidden w-full rounded-xl px-6 py-3 text-white font-semibold
                             bg-gradient-to-r from-cyan-500 to-pink-500 shadow-md transition-all duration-300 group"
                >
                  <span className="relative z-10">{isLoading ? 'Creating...' : 'Create Account'}</span>
                  <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 rounded-xl blur-lg transition-transform duration-300" />
                </Button>
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center mt-2">{error}</p>
              )}

              <p className="text-xs text-gray-400 text-center mt-1">
                Free during beta. No spam. Unsubscribe anytime.
              </p>
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

const cnInput = (hasError?: string) =>
  `${inputClassBase} ${hasError ? 'border-red-500 focus:ring-red-400/40' : ''}`;

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

function Err({ children }: { children: React.ReactNode }) {
  return <p className="text-red-400 text-xs mt-1">{children}</p>;
}
