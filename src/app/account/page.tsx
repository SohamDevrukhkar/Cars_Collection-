'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCollectionStore } from '@/lib/store';

export default function AccountPage() {
  const { wishlist, savedConfigurations, testDriveBookings, purchaseRequests } = useCollectionStore();

  const sections = [
    {
      title: 'Saved Garage',
      count: wishlist.length,
      href: '/account/saved',
      desc: 'Vehicles bookmarked in your private collection',
      icon: '♡',
    },
    {
      title: 'Bespoke Configurations',
      count: savedConfigurations.length,
      href: '/account/configurations',
      desc: 'Atelier custom specifications and options',
      icon: '⚙',
    },
    {
      title: 'Test Drive Bookings',
      count: testDriveBookings.length,
      href: '/account/test-drives',
      desc: 'Scheduled private circuit and road sessions',
      icon: '🏁',
    },
    {
      title: 'Allocation Requests',
      count: purchaseRequests.length,
      href: '/account/purchases',
      desc: 'Confidential acquisition and reservation records',
      icon: '📋',
    },
  ];

  return (
    <div className="bg-[#060606] text-foreground min-h-screen w-full max-w-[100vw] overflow-x-hidden px-4 sm:px-6 md:px-8 py-10 sm:py-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <p className="font-eyebrow text-accent text-[10px] sm:text-xs tracking-widest uppercase mb-2">
              CLIENT CONCIERGE PORTAL
            </p>
            <h1 className="font-display text-3xl sm:text-5xl mb-2 text-foreground font-light">
              Account Dashboard
            </h1>
            <p className="font-body text-secondary text-xs sm:text-base leading-relaxed">
              Manage your private garage, bespoke specifications, test drive itineraries, and acquisition allocations.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-16">
            {sections.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="card card-hover p-6 sm:p-8 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl text-accent">{item.icon}</span>
                    <span className="font-eyebrow text-xs bg-[#161616] border border-border/40 px-2.5 py-1 rounded text-accent font-semibold">
                      {item.count} {item.count === 1 ? 'RECORD' : 'RECORDS'}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-2 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-body text-secondary text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-border/20 flex items-center justify-between text-xs text-tertiary group-hover:text-foreground">
                  <span className="font-eyebrow tracking-wider text-[11px] uppercase">ACCESS RECORD</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Actions Bar */}
          <div className="card p-6 sm:p-8">
            <h2 className="font-headline text-base sm:text-lg mb-4 text-foreground">
              Direct Acquisition Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/cars"
                className="btn btn-primary min-h-[48px] px-6 text-xs tracking-wider"
              >
                BROWSE COLLECTION →
              </Link>
              <Link
                href="/compare"
                className="btn btn-secondary min-h-[48px] px-6 text-xs tracking-wider"
              >
                BENCHMARK COMPARISON
              </Link>
              <Link
                href="/test-drive"
                className="btn btn-secondary min-h-[48px] px-6 text-xs tracking-wider"
              >
                BOOK TEST DRIVE
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
