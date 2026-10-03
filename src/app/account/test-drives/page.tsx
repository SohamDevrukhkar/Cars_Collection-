'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCollectionStore } from '@/lib/store';

export default function TestDrivesPage() {
  const { testDriveBookings, cancelTestDriveBooking } = useCollectionStore();

  return (
    <div className="bg-[#060606] text-foreground min-h-screen w-full max-w-[100vw] overflow-x-hidden px-4 sm:px-6 md:px-8 py-10 sm:py-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Back Nav */}
          <Link
            href="/account"
            className="inline-flex items-center gap-2 font-eyebrow text-tertiary hover:text-foreground text-[11px] tracking-wider mb-6 min-h-[44px]"
          >
            ← BACK TO DASHBOARD
          </Link>

          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <p className="font-eyebrow text-accent text-[10px] sm:text-xs tracking-widest uppercase mb-2">
              CIRCUIT & ROAD ITINERARY
            </p>
            <h1 className="font-display text-3xl sm:text-5xl mb-2 text-foreground font-light">
              Test Drive Bookings
            </h1>
            <p className="font-body text-secondary text-xs sm:text-base leading-relaxed">
              Your confirmed private driving appointments with factory test engineers and track liaisons.
            </p>
          </div>

          {/* Empty State */}
          {testDriveBookings.length === 0 ? (
            <div className="card p-8 sm:p-14 text-center max-w-lg mx-auto">
              <span className="text-4xl mb-4 block">🏁</span>
              <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-2">
                No Active Test Drives
              </h3>
              <p className="font-body text-secondary text-xs sm:text-sm mb-6 leading-relaxed">
                Reserve an exclusive driving session at our global private circuits and viewing suites.
              </p>
              <Link
                href="/test-drive"
                className="btn btn-primary min-h-[52px] sm:min-h-[48px] px-8 text-xs tracking-wider"
              >
                SCHEDULE TEST DRIVE →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {testDriveBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="card p-5 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-eyebrow text-xs bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 px-2.5 py-0.5 rounded font-semibold tracking-wider uppercase">
                        {booking.status}
                      </span>
                      <span className="font-eyebrow text-tertiary text-[10px]">
                        ID: {booking.id}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl text-foreground mb-2">
                      {booking.carName}
                    </h3>

                    <div className="space-y-1.5 text-xs text-secondary mb-4">
                      <p>
                        <span className="text-tertiary">Date & Window:</span> {booking.preferredDate} • {booking.preferredTime}
                      </p>
                      <p>
                        <span className="text-tertiary">Facility:</span> {booking.showroomLocation}
                      </p>
                      <p>
                        <span className="text-tertiary">Driver:</span> {booking.fullName} ({booking.phone})
                      </p>
                      {booking.notes && (
                        <p className="line-clamp-2">
                          <span className="text-tertiary">Notes:</span> {booking.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0">
                    <Link
                      href={`/cars/${booking.carSlug}`}
                      className="btn btn-secondary min-h-[48px] px-6 text-xs tracking-wider text-center flex items-center justify-center"
                    >
                      VIEW VEHICLE
                    </Link>
                    <button
                      onClick={() => cancelTestDriveBooking(booking.id)}
                      className="text-xs text-tertiary hover:text-accent p-2 min-h-[44px] flex items-center justify-center transition-colors"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
