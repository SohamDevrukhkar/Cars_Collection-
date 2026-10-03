'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
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
            SECURITY & CREDENTIALS
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-foreground font-light mb-2">
            Reset Password
          </h1>
          <p className="font-body text-secondary text-xs sm:text-sm">
            Enter your authorized email to receive a confidential reset link
          </p>
        </div>

        {sent ? (
          <div className="card p-6 sm:p-8 text-center space-y-4">
            <p className="font-serif text-lg text-accent">Reset Instructions Dispatched</p>
            <p className="font-body text-secondary text-xs leading-relaxed">
              If an active client profile exists for <span className="text-foreground">{email}</span>, a secure authentication token has been dispatched.
            </p>
            <Link
              href="/login"
              className="btn btn-primary w-full min-h-[52px] sm:min-h-[48px] text-xs font-semibold tracking-widest uppercase block mt-4"
            >
              RETURN TO SIGN IN
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5">
            <div>
              <label className="block font-eyebrow text-[11px] text-tertiary mb-2 uppercase tracking-wider">
                REGISTERED EMAIL
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

            <div className="pt-2">
              <button
                type="submit"
                className="btn btn-primary w-full min-h-[52px] sm:min-h-[48px] text-xs font-semibold tracking-widest uppercase"
              >
                SEND RESET INSTRUCTIONS →
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="font-body text-secondary hover:text-accent transition-colors text-xs inline-flex items-center min-h-[36px]"
          >
            ← Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
