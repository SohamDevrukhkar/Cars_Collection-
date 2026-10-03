'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { getCarBySlug } from '@/data';
import { formatCurrency } from '@/lib/utils';
import { useCollectionStore } from '@/lib/store';

export default function SavedPage() {
  const { wishlist, removeFromWishlist } = useCollectionStore();
  const savedCars = wishlist.map((slug) => getCarBySlug(slug)).filter(Boolean);

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
              CONFIDENTIAL GARAGE
            </p>
            <h1 className="font-display text-3xl sm:text-5xl mb-2 text-foreground font-light">
              Saved Vehicles
            </h1>
            <p className="font-body text-secondary text-xs sm:text-base leading-relaxed">
              Vehicles bookmarked for acquisition tracking and side-by-side evaluation.
            </p>
          </div>

          {/* Empty State */}
          {savedCars.length === 0 ? (
            <div className="card p-8 sm:p-14 text-center max-w-lg mx-auto">
              <span className="text-4xl mb-4 block">♡</span>
              <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-2">
                Your Garage is Empty
              </h3>
              <p className="font-body text-secondary text-xs sm:text-sm mb-6 leading-relaxed">
                Explore our curated hypercar registry and save marques to follow their availability and allocation statuses.
              </p>
              <Link
                href="/cars"
                className="btn btn-primary min-h-[52px] sm:min-h-[48px] px-8 text-xs tracking-wider"
              >
                EXPLORE COLLECTION →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedCars.map((car) => {
                if (!car) return null;
                return (
                  <div
                    key={car.slug}
                    className="card p-5 sm:p-6 flex flex-col justify-between relative group"
                  >
                    <button
                      onClick={() => removeFromWishlist(car.slug)}
                      className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#111111] border border-border/50 text-tertiary hover:text-accent flex items-center justify-center text-xs z-10 transition-colors"
                      aria-label="Remove vehicle"
                    >
                      ✕
                    </button>

                    <div>
                      <div className="relative aspect-[16/10] rounded overflow-hidden mb-4 bg-[#111111]">
                        <img
                          src={car.heroImage}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-car.jpg';
                          }}
                        />
                      </div>

                      <p className="font-eyebrow text-accent text-[10px] tracking-widest uppercase mb-1">
                        {car.brand}
                      </p>
                      <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-1">
                        {car.model}
                      </h3>
                      <p className="font-body text-secondary text-xs line-clamp-2 mb-3">
                        {car.tagline}
                      </p>

                      <div className="flex items-center justify-between text-xs pt-3 border-t border-border/20 mb-4">
                        <span className="font-eyebrow text-tertiary text-[10px]">
                          {car.specs.power} • {car.specs.acceleration}
                        </span>
                        <span className="font-body text-accent font-semibold">
                          {formatCurrency(car.price)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <Link
                        href={`/configure/${car.slug}`}
                        className="btn btn-secondary flex-1 text-xs min-h-[44px] tracking-wider text-center flex items-center justify-center"
                      >
                        CONFIGURE
                      </Link>
                      <Link
                        href={`/reserve/${car.slug}`}
                        className="btn btn-primary flex-1 text-xs min-h-[44px] tracking-wider text-center flex items-center justify-center font-semibold"
                      >
                        RESERVE →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
