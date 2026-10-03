'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ALL_CARS } from '@/data';
import { formatCurrency } from '@/lib/utils';

type Category = 'All' | 'Hypercar' | 'Supercar' | 'Luxury Sedan' | 'Luxury SUV' | 'Performance SUV' | 'Electric Luxury' | 'Electric Performance';

const CATEGORIES: Category[] = ['All', 'Hypercar', 'Supercar', 'Luxury Sedan', 'Luxury SUV', 'Performance SUV', 'Electric Luxury', 'Electric Performance'];

export default function CarsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCars = ALL_CARS.filter((car) => {
    const matchesCategory = selectedCategory === 'All' || car.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#060606] text-foreground w-full max-w-[100vw] overflow-x-hidden">
      {/* Opening Hero Header */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 md:px-8 relative overflow-hidden text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          <p className="font-eyebrow text-accent tracking-widest text-[10px] sm:text-xs mb-3 uppercase">
            SANCTUARY OF AUTOMOTIVE EXCELLENCE
          </p>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 text-balance">
            THE COLLECTION
          </h1>
          <p className="font-body text-secondary text-xs sm:text-base leading-relaxed max-w-xl mx-auto text-balance">
            Explore our curated registry of the world's most exceptional automobiles, each available for private acquisition.
          </p>
        </motion.div>
      </section>

      {/* Sticky Search & Filter Bar */}
      <section className="sticky top-16 z-30 bg-[#060606]/90 backdrop-blur-md border-y border-border/40 py-4 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Search Input */}
          <div className="relative max-w-md mx-auto sm:mx-0">
            <input
              type="text"
              placeholder="Search marque or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111111] border border-border/40 rounded px-4 py-2.5 text-[16px] sm:text-xs text-foreground placeholder-tertiary focus:outline-none focus:border-accent transition-colors min-h-[48px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-foreground text-xs p-1"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Horizontally Scrollable Category Pills on Mobile */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 font-eyebrow text-[10px] sm:text-xs uppercase tracking-wider px-3.5 py-2 rounded transition-all min-h-[36px] flex items-center ${
                    isSelected
                      ? 'bg-accent text-background font-semibold shadow-sm'
                      : 'bg-[#111111] text-secondary hover:text-foreground border border-border/30'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vehicle Grid - 1-Col on Mobile, 2-Col on Tablet, 3-Col on Desktop */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Active Results Count */}
          <div className="flex justify-between items-center mb-6 text-xs text-secondary">
            <span className="font-eyebrow text-[10px] tracking-widest text-tertiary">
              SHOWING {filteredCars.length} {filteredCars.length === 1 ? 'VEHICLE' : 'VEHICLES'}
            </span>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="text-accent hover:underline text-[11px]"
              >
                Reset Filter
              </button>
            )}
          </div>

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
                  href={`/cars/${car.slug}`}
                  className="card card-hover group block h-full flex flex-col p-4 sm:p-6"
                >
                  {/* Hero Thumbnail */}
                  <div className="relative overflow-hidden rounded mb-4 aspect-[16/10] bg-[#111111]">
                    <img
                      src={car.heroImage}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-car.jpg';
                      }}
                    />
                    {car.chapterIndex && (
                      <div className="absolute top-2.5 left-2.5 bg-[#060606]/80 backdrop-blur-sm px-2 py-1 rounded text-[9px] font-mono text-accent border border-border/40">
                        CH {car.chapterIndex}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
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

                    {/* Specs / Pricing Footer */}
                    <div className="mt-auto pt-3 border-t border-border/30 flex items-center justify-between text-xs">
                      <span className="font-eyebrow text-secondary text-[10px]">{car.specs.power}</span>
                      <span className="font-body text-accent font-medium">{formatCurrency(car.price)}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCars.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-card rounded p-8 border border-border/30"
            >
              <p className="font-headline text-base sm:text-lg mb-2 text-foreground">NO MATCHING ALLOCATIONS</p>
              <p className="font-body text-secondary text-xs sm:text-sm mb-6 max-w-md mx-auto">
                No vehicles matched your filter parameters. Modify your search query or reset category selection.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="btn btn-secondary min-h-[48px] px-6 text-xs"
              >
                RESET ALL FILTERS
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Concierge Inquiry CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 border-t border-border/40 bg-[#060606]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: '-40px' }}
          >
            <p className="font-eyebrow text-accent text-[10px] sm:text-xs tracking-widest mb-2 uppercase">
              BESPOKE SOURCING
            </p>
            <h2 className="font-serif text-2xl sm:text-4xl mb-4 text-balance">Seeking an Unlisted Marque?</h2>
            <p className="font-body text-secondary text-xs sm:text-sm mb-8 max-w-lg mx-auto text-balance leading-relaxed">
              Our private concierge team acquires off-market hypercars, limited allocations, and historic coachbuilt masterpieces.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-[340px] sm:max-w-none sm:w-auto mx-auto justify-center">
              <Link href="/showrooms" className="btn btn-primary min-h-[52px] sm:min-h-[48px] px-8 text-xs tracking-wider">
                VIEW SHOWROOMS →
              </Link>
              <Link href="/test-drive" className="btn btn-secondary min-h-[52px] sm:min-h-[48px] px-8 text-xs tracking-wider">
                REQUEST CONCIERGE
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
