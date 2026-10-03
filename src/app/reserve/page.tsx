'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ALL_CARS } from '@/data';
import { formatCurrency } from '@/lib/utils';

export default function ReservePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCars = ALL_CARS.filter(
    (car) =>
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#060606] text-foreground min-h-screen w-full max-w-[100vw] overflow-x-hidden">
      {/* Header */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 md:px-8 relative overflow-hidden text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          <p className="font-eyebrow text-accent tracking-widest text-[10px] sm:text-xs mb-3 uppercase">
            PRIVATE ACQUISITION
          </p>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 text-balance">
            RESERVE ALLOCATION
          </h1>
          <p className="font-body text-secondary text-xs sm:text-base leading-relaxed max-w-xl mx-auto text-balance">
            Select a vehicle to submit a confidential reservation request. Our global client directors provide bespoke acquisition guidance.
          </p>
        </motion.div>
      </section>

      {/* Search Bar */}
      <section className="px-4 sm:px-6 md:px-8 pb-8 max-w-7xl mx-auto">
        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            placeholder="Search marque to reserve..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111111] border border-border/40 rounded px-4 py-3 text-[16px] sm:text-xs text-foreground placeholder-tertiary focus:outline-none focus:border-accent transition-colors min-h-[48px]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-foreground text-xs p-2 min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </section>

      {/* Vehicles Grid */}
      <section className="pb-16 sm:pb-24 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCars.map((car, idx) => (
              <motion.div
                key={car.slug}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.06 }}
                viewport={{ once: true, margin: '-40px' }}
              >
                <Link
                  href={`/reserve/${car.slug}`}
                  className="card card-hover group block h-full flex flex-col p-4 sm:p-6"
                >
                  <div className="relative overflow-hidden rounded mb-4 aspect-[16/10] bg-[#111111]">
                    <img
                      src={car.heroImage}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-car.jpg';
                      }}
                    />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <p className="font-eyebrow text-accent text-[10px] tracking-widest mb-1 uppercase">
                      {car.brand}
                    </p>
                    <h3 className="font-serif text-xl sm:text-2xl text-foreground font-light mb-1 group-hover:text-accent transition-colors">
                      {car.model}
                    </h3>
                    <p className="font-body text-secondary text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed">
                      {car.tagline}
                    </p>

                    <div className="mt-auto pt-3 border-t border-border/30 flex items-center justify-between text-xs">
                      <span className="font-eyebrow text-secondary text-[10px]">{car.specs.power}</span>
                      <span className="font-body text-accent font-medium">{formatCurrency(car.price)}</span>
                    </div>

                    <div className="mt-4 pt-2">
                      <span className="btn btn-primary w-full text-xs min-h-[44px] tracking-wider flex items-center justify-center">
                        REQUEST ALLOCATION →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
