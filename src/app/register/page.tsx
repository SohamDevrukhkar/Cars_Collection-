'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCollectionStore } from '@/lib/store';

export default function RegisterPage() {
  const router = useRouter();
  const { setActiveUserId } = useCollectionStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveUserId('user_vip_001');
    router.push('/account');
  };

  return (
    <div className="bg-[#060606] text-foreground min-h-screen w-full max-w-[100vw] overflow-x-hidden flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8 sm:mb-10">
          <p className="font-eyebrow text-accent text-[10px] sm:text-xs tracking-widest uppercase mb-2">
            MEMBERSHIP REGISTRY
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-foreground font-light mb-2">
            Create Account
          </h1>
          <p className="font-body text-secondary text-xs sm:text-sm">
            Join the private circle of collectors and receive priority allocation access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5">
          <div>
            <label className="block font-eyebrow text-[11px] text-tertiary mb-2 uppercase tracking-wider">
              FULL NAME
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Lord / Lady / Mr / Ms..."
              className="w-full bg-[#111111] border border-border/40 rounded px-4 py-3 text-[16px] sm:text-sm text-foreground placeholder-tertiary focus:border-accent outline-none min-h-[48px] transition-colors"
            />
          </div>

          <div>
            <label className="block font-eyebrow text-[11px] text-tertiary mb-2 uppercase tracking-wider">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@domain.com"
              className="w-full bg-[#111111] border border-border/40 rounded px-4 py-3 text-[16px] sm:text-sm text-foreground placeholder-tertiary focus:border-accent outline-none min-h-[48px] transition-colors"
            />
          </div>

          <div>
            <label className="block font-eyebrow text-[11px] text-tertiary mb-2 uppercase tracking-wider">
              PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#111111] border border-border/40 rounded px-4 py-3 text-[16px] sm:text-sm text-foreground placeholder-tertiary focus:border-accent outline-none min-h-[48px] transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="btn btn-primary w-full min-h-[52px] sm:min-h-[48px] text-xs font-semibold tracking-widest uppercase"
            >
              REQUEST MEMBERSHIP →
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="font-body text-tertiary text-xs">
            Already registered?{' '}
            <Link
              href="/login"
              className="text-accent hover:underline font-medium ml-1 inline-flex items-center min-h-[36px]"
            >
              Sign in to account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
