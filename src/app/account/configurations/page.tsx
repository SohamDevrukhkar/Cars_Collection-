'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { useCollectionStore } from '@/lib/store';

export default function ConfigurationsPage() {
  const { savedConfigurations, deleteConfiguration } = useCollectionStore();

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
              BESPOKE ARCHIVE
            </p>
            <h1 className="font-display text-3xl sm:text-5xl mb-2 text-foreground font-light">
              Saved Configurations
            </h1>
            <p className="font-body text-secondary text-xs sm:text-base leading-relaxed">
              Custom atelier specifications tailored with bespoke paintwork, interior environments, and aerodynamics.
            </p>
          </div>

          {/* Empty State */}
          {savedConfigurations.length === 0 ? (
            <div className="card p-8 sm:p-14 text-center max-w-lg mx-auto">
              <span className="text-4xl mb-4 block">⚙</span>
              <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-2">
                No Saved Configurations
              </h3>
              <p className="font-body text-secondary text-xs sm:text-sm mb-6 leading-relaxed">
                Enter The Atelier to customize exterior finishes, interior appointments, wheels, and bespoke packages.
              </p>
              <Link
                href="/configure"
                className="btn btn-primary min-h-[52px] sm:min-h-[48px] px-8 text-xs tracking-wider"
              >
                ENTER THE ATELIER →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {savedConfigurations.map((config) => (
                <div
                  key={config.id}
                  className="card p-5 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative"
                >
                  <button
                    onClick={() => deleteConfiguration(config.id)}
                    className="absolute top-4 right-4 text-tertiary hover:text-accent text-xs p-2 min-w-[36px] min-h-[36px] flex items-center justify-center"
                    aria-label="Delete specification"
                  >
                    ✕
                  </button>

                  <div className="flex-1 min-w-0 pr-8 md:pr-0">
                    <p className="font-eyebrow text-accent text-[10px] tracking-widest uppercase mb-1">
                      {config.carBrand}
                    </p>
                    <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-3">
                      {config.carModel}
                    </h3>

                    {/* Spec Summary Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-secondary mb-4">
                      <div className="bg-[#111111] p-2 rounded border border-border/30 flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full flex-shrink-0 border border-border/60"
                          style={{ backgroundColor: config.color.hex }}
                        />
                        <span className="truncate">{config.color.name}</span>
                      </div>
                      <div className="bg-[#111111] p-2 rounded border border-border/30 truncate">
                        <span className="text-tertiary block text-[9px] uppercase font-eyebrow">Interior</span>
                        <span className="truncate">{config.interior.name}</span>
                      </div>
                      <div className="bg-[#111111] p-2 rounded border border-border/30 truncate">
                        <span className="text-tertiary block text-[9px] uppercase font-eyebrow">Wheels</span>
                        <span className="truncate">{config.wheel.name}</span>
                      </div>
                    </div>

                    <p className="font-serif text-lg sm:text-xl text-accent font-medium">
                      Spec Total: {formatCurrency(config.totalPrice)}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0">
                    <Link
                      href={`/reserve/${config.carSlug}`}
                      className="btn btn-primary min-h-[48px] px-6 text-xs tracking-wider text-center flex items-center justify-center font-semibold"
                    >
                      ACQUIRE THIS SPEC →
                    </Link>
                    <Link
                      href={`/configure/${config.carSlug}`}
                      className="btn btn-secondary min-h-[48px] px-6 text-xs tracking-wider text-center flex items-center justify-center"
                    >
                      MODIFY ATELIER
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
