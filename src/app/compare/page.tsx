'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ALL_CARS, getCarBySlug } from '@/data';
import { formatCurrency } from '@/lib/utils';
import { useCollectionStore } from '@/lib/store';

export default function ComparePage() {
  const { compareList, addToCompare, removeFromCompare, clearCompare } = useCollectionStore();
  const [selectorOpenSlot, setSelectorOpenSlot] = useState<number | null>(null);

  // Fill up to 3 comparison slots with selected cars
  const selectedCars = compareList.map((slug) => getCarBySlug(slug)).filter((car): car is NonNullable<typeof car> => Boolean(car));

  const handleSelectCar = (slug: string) => {
    if (!compareList.includes(slug)) {
      addToCompare(slug);
    }
    setSelectorOpenSlot(null);
  };

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
            SIDE-BY-SIDE BENCHMARK
          </p>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 text-balance">
            COMPARE VEHICLES
          </h1>
          <p className="font-body text-secondary text-xs sm:text-base leading-relaxed max-w-xl mx-auto text-balance">
            Analyze specifications, performance metrics, and architectural attributes across up to three marques from the collection.
          </p>
        </motion.div>
      </section>

      {/* Main Content Area */}
      <section className="pb-16 sm:pb-24 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Action Bar */}
          {selectedCars.length > 0 && (
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-border/40">
              <p className="font-eyebrow text-tertiary text-[10px] tracking-widest uppercase">
                COMPARING {selectedCars.length} OF 3 ALLOCATIONS
              </p>
              <button
                onClick={clearCompare}
                className="text-xs text-accent hover:underline min-h-[36px] flex items-center"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Vehicle Selector Slots (3 columns on desktop, responsive on mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-16">
            {[0, 1, 2].map((slotIndex) => {
              const car = selectedCars[slotIndex];

              if (car) {
                return (
                  <motion.div
                    key={car.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-4 sm:p-6 flex flex-col justify-between relative group"
                  >
                    <button
                      onClick={() => removeFromCompare(car.slug)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#111111] border border-border/50 text-tertiary hover:text-foreground flex items-center justify-center text-xs z-10 transition-colors"
                      aria-label="Remove vehicle"
                    >
                      ✕
                    </button>

                    <div>
                      <div className="relative aspect-[16/10] rounded overflow-hidden mb-4 bg-[#111111]">
                        <img
                          src={car.heroImage}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover"
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
                      <p className="font-body text-secondary text-xs line-clamp-1 mb-3">
                        {car.tagline}
                      </p>
                      <p className="font-body text-accent font-medium text-sm mb-4">
                        {formatCurrency(car.price)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 pt-3 border-t border-border/30">
                      <Link
                        href={`/cars/${car.slug}`}
                        className="btn btn-secondary text-xs min-h-[44px] tracking-wider"
                      >
                        VIEW VEHICLE
                      </Link>
                      <Link
                        href={`/configure/${car.slug}`}
                        className="btn btn-primary text-xs min-h-[44px] tracking-wider"
                      >
                        CONFIGURE
                      </Link>
                    </div>
                  </motion.div>
                );
              }

              return (
                <div
                  key={`empty-${slotIndex}`}
                  className="card border-dashed border-border/60 p-6 flex flex-col items-center justify-center text-center min-h-[260px] sm:min-h-[320px] bg-[#0c0c0c]/40"
                >
                  <p className="font-eyebrow text-tertiary text-[10px] tracking-widest uppercase mb-2">
                    SLOT 0{slotIndex + 1}
                  </p>
                  <h4 className="font-headline text-sm sm:text-base text-foreground mb-4">
                    Add Vehicle to Compare
                  </h4>
                  <button
                    onClick={() => setSelectorOpenSlot(slotIndex)}
                    className="btn btn-secondary text-xs min-h-[48px] px-6 tracking-wider"
                  >
                    + SELECT VEHICLE
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Add Suggestions if empty */}
          {selectedCars.length === 0 && (
            <div className="card p-8 sm:p-12 text-center max-w-2xl mx-auto mb-16">
              <p className="font-eyebrow text-accent text-[10px] tracking-widest uppercase mb-2">
                QUICK BENCHMARK
              </p>
              <h3 className="font-serif text-xl sm:text-2xl mb-4">Suggested Comparisons</h3>
              <p className="font-body text-secondary text-xs sm:text-sm mb-6 leading-relaxed">
                Choose one of our curated hypercar match-ups to see comparative engineering specifications immediately.
              </p>
              <div className="flex flex-wrap gap-2.5 justify-center">
                {ALL_CARS.slice(0, 4).map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => addToCompare(c.slug)}
                    className="btn btn-secondary text-xs min-h-[44px] px-4"
                  >
                    + {c.brand} {c.model}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Comparative Technical Specification Matrix (Responsive Table & Stacked Cards) */}
          {selectedCars.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="text-center sm:text-left">
                <p className="font-eyebrow text-accent text-[10px] tracking-widest uppercase mb-1">
                  DETAILED METRICS
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl text-foreground">
                  Technical Specifications
                </h2>
              </div>

              {/* Responsive Spec Comparison Cards for Mobile / Table for Desktop */}
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[540px]">
                    <thead>
                      <tr className="border-b border-border/40 bg-[#111111]/60">
                        <th className="p-4 sm:p-5 font-eyebrow text-[10px] text-tertiary tracking-widest uppercase w-1/4">
                          METRIC
                        </th>
                        {selectedCars.map((car) => (
                          <th
                            key={car.slug}
                            className="p-4 sm:p-5 font-serif text-sm sm:text-base text-foreground font-normal"
                          >
                            <span className="text-accent block text-[10px] font-mono font-normal">
                              {car.brand}
                            </span>
                            {car.model}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 text-xs sm:text-sm">
                      <tr>
                        <td className="p-4 sm:p-5 font-eyebrow text-[10px] text-tertiary tracking-wider uppercase bg-[#0c0c0c]/30">
                          CATEGORY
                        </td>
                        {selectedCars.map((car) => (
                          <td key={car.slug} className="p-4 sm:p-5 font-body text-secondary">
                            {car.category}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 sm:p-5 font-eyebrow text-[10px] text-tertiary tracking-wider uppercase bg-[#0c0c0c]/30">
                          0–100 KM/H
                        </td>
                        {selectedCars.map((car) => (
                          <td key={car.slug} className="p-4 sm:p-5 font-serif text-base text-accent font-medium">
                            {car.specs.acceleration}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 sm:p-5 font-eyebrow text-[10px] text-tertiary tracking-wider uppercase bg-[#0c0c0c]/30">
                          MAX POWER
                        </td>
                        {selectedCars.map((car) => (
                          <td key={car.slug} className="p-4 sm:p-5 font-serif text-base text-foreground font-medium">
                            {car.specs.power}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 sm:p-5 font-eyebrow text-[10px] text-tertiary tracking-wider uppercase bg-[#0c0c0c]/30">
                          TOP SPEED
                        </td>
                        {selectedCars.map((car) => (
                          <td key={car.slug} className="p-4 sm:p-5 font-body text-secondary">
                            {car.specs.topSpeed}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 sm:p-5 font-eyebrow text-[10px] text-tertiary tracking-wider uppercase bg-[#0c0c0c]/30">
                          PEAK TORQUE
                        </td>
                        {selectedCars.map((car) => (
                          <td key={car.slug} className="p-4 sm:p-5 font-body text-secondary">
                            {car.specs.torque}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 sm:p-5 font-eyebrow text-[10px] text-tertiary tracking-wider uppercase bg-[#0c0c0c]/30">
                          POWERTRAIN
                        </td>
                        {selectedCars.map((car) => (
                          <td key={car.slug} className="p-4 sm:p-5 font-body text-secondary">
                            {car.powertrainType} {car.specs.engine ? `(${car.specs.engine})` : ''}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 sm:p-5 font-eyebrow text-[10px] text-tertiary tracking-wider uppercase bg-[#0c0c0c]/30">
                          TRANSMISSION
                        </td>
                        {selectedCars.map((car) => (
                          <td key={car.slug} className="p-4 sm:p-5 font-body text-secondary">
                            {car.specs.transmission}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 sm:p-5 font-eyebrow text-[10px] text-tertiary tracking-wider uppercase bg-[#0c0c0c]/30">
                          CURB WEIGHT
                        </td>
                        {selectedCars.map((car) => (
                          <td key={car.slug} className="p-4 sm:p-5 font-body text-secondary">
                            {car.specs.curbWeight}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 sm:p-5 font-eyebrow text-[10px] text-tertiary tracking-wider uppercase bg-[#0c0c0c]/30">
                          PRICE
                        </td>
                        {selectedCars.map((car) => (
                          <td key={car.slug} className="p-4 sm:p-5 font-serif text-base text-accent font-medium">
                            {formatCurrency(car.price)}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Vehicle Selection Modal Overlay (Optimized for Mobile Bottom-Sheet / Full-Screen) */}
      <AnimatePresence>
        {selectorOpenSlot !== null && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-[#0e0e0e] border border-border/60 rounded-t-2xl sm:rounded-xl w-full max-w-2xl max-h-[85svh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-border/40 flex items-center justify-between">
                <div>
                  <p className="font-eyebrow text-accent text-[10px] tracking-widest uppercase">
                    REGISTRY SELECTION
                  </p>
                  <h3 className="font-serif text-lg sm:text-xl text-foreground">
                    Select Vehicle to Compare
                  </h3>
                </div>
                <button
                  onClick={() => setSelectorOpenSlot(null)}
                  className="w-10 h-10 rounded-full bg-[#161616] text-tertiary hover:text-foreground flex items-center justify-center min-w-[44px] min-h-[44px]"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* Vehicle List */}
              <div className="overflow-y-auto p-4 sm:p-6 space-y-3 divide-y divide-border/20">
                {ALL_CARS.filter((c) => !compareList.includes(c.slug)).map((car) => (
                  <div
                    key={car.slug}
                    onClick={() => handleSelectCar(car.slug)}
                    className="pt-3 first:pt-0 flex items-center gap-4 cursor-pointer hover:bg-[#161616] p-2.5 rounded transition-colors"
                  >
                    <img
                      src={car.heroImage}
                      alt={`${car.brand} ${car.model}`}
                      className="w-16 h-12 object-cover rounded bg-[#111111] flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-car.jpg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-eyebrow text-accent text-[9px] tracking-wider uppercase truncate">
                        {car.brand}
                      </p>
                      <h4 className="font-serif text-sm sm:text-base text-foreground truncate">
                        {car.model}
                      </h4>
                      <p className="font-body text-secondary text-xs truncate">
                        {car.specs.power} • {formatCurrency(car.price)}
                      </p>
                    </div>
                    <button className="btn btn-secondary text-xs min-h-[40px] px-3.5 flex-shrink-0">
                      Select
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
