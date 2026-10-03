'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { useCollectionStore } from '@/lib/store';

export default function PurchasesPage() {
  const { purchaseRequests } = useCollectionStore();

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
              CONFIDENTIAL ACQUISITIONS
            </p>
            <h1 className="font-display text-3xl sm:text-5xl mb-2 text-foreground font-light">
              Allocation Requests
            </h1>
            <p className="font-body text-secondary text-xs sm:text-base leading-relaxed">
              Track your reservation status, factory build milestones, and client director communications.
            </p>
          </div>

          {/* Empty State */}
          {purchaseRequests.length === 0 ? (
            <div className="card p-8 sm:p-14 text-center max-w-lg mx-auto">
              <span className="text-4xl mb-4 block">📋</span>
              <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-2">
                No Allocation Requests
              </h3>
              <p className="font-body text-secondary text-xs sm:text-sm mb-6 leading-relaxed">
                Submit a confidential reservation on any vehicle in our collection to begin the allocation and acquisition process.
              </p>
              <Link
                href="/reserve"
                className="btn btn-primary min-h-[52px] sm:min-h-[48px] px-8 text-xs tracking-wider"
              >
                REQUEST ALLOCATION →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {purchaseRequests.map((req) => (
                <div
                  key={req.id}
                  className="card p-5 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-eyebrow text-xs bg-accent/10 border border-accent/30 text-accent px-2.5 py-0.5 rounded font-semibold tracking-wider uppercase">
                        {req.status}
                      </span>
                      <span className="font-eyebrow text-tertiary text-[10px]">
                        REF: {req.id}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl text-foreground mb-1">
                      {req.carName}
                    </h3>

                    <div className="space-y-1 text-xs text-secondary mb-4">
                      <p>
                        <span className="text-tertiary">Client:</span> {req.customerDetails.fullName} ({req.customerDetails.email})
                      </p>
                      <p>
                        <span className="text-tertiary">Viewing Suite:</span> {req.delivery.showroomLocation || 'Global Concierge'}
                      </p>
                      {req.delivery.instructions && (
                        <p className="line-clamp-2">
                          <span className="text-tertiary">Instructions:</span> {req.delivery.instructions}
                        </p>
                      )}
                    </div>

                    <p className="font-serif text-lg sm:text-xl text-accent font-medium">
                      Estimated Valuation: {formatCurrency(req.estimatedTotal)}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0">
                    <Link
                      href={`/cars/${req.carSlug}`}
                      className="btn btn-secondary min-h-[48px] px-6 text-xs tracking-wider text-center flex items-center justify-center"
                    >
                      VIEW VEHICLE
                    </Link>
                    <Link
                      href="/contact"
                      className="btn btn-primary min-h-[48px] px-6 text-xs tracking-wider text-center flex items-center justify-center font-semibold"
                    >
                      CONTACT DIRECTOR →
                    </Link>
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
