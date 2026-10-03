'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-background text-foreground min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center max-w-2xl relative z-10"
      >
        {/* 404 Number - Large and Cinematic */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-12"
        >
          <p className="font-display text-9xl md:text-[12rem] font-light tracking-widest text-foreground/20 leading-none">
            404
          </p>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <p className="font-eyebrow text-accent tracking-cinematic text-sm mb-4 uppercase">
            The Vehicle Could Not Be Found
          </p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">
            Page Not Found
          </h1>
          <p className="font-serif text-2xl text-secondary italic">
            This allocation does not exist in our collection.
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-body text-secondary text-lg leading-relaxed mb-12 max-w-lg mx-auto"
        >
          The URL you requested either has been retired from our private inventory, or was never part of THE COLLECTION. Our concierge team is standing by to assist you.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/cars" className="btn btn-primary">
            Return to The Collection →
          </Link>
          <Link href="/" className="btn btn-secondary">
            Home
          </Link>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="font-eyebrow text-tertiary text-xs tracking-cinematic mt-16 uppercase"
        >
          Need assistance? Contact our concierge team at info@thecollection.co
        </motion.p>
      </motion.div>
    </div>
  );
}
