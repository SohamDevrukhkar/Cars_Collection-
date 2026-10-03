'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SHOWROOMS } from '@/data/showrooms';
import { ALL_CARS } from '@/data';

export default function ShowroomsPage() {
  const [selectedShowroom, setSelectedShowroom] = useState<string | null>(null);

  return (
    <div className="bg-[#060606] text-foreground w-full max-w-[100vw] overflow-x-hidden">
      {/* Opening Hero Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 md:px-8 relative overflow-hidden text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          <p className="font-eyebrow text-accent tracking-widest text-[10px] sm:text-xs mb-3 uppercase">
            GLOBAL VIEWING SUITES
          </p>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 text-balance">
            PRIVATE SHOWROOMS
          </h1>
          <p className="font-body text-secondary text-xs sm:text-base leading-relaxed max-w-xl mx-auto text-balance">
            Experience the collection in person at our discreet viewing suites across the world's most distinguished addresses.
          </p>
        </motion.div>
      </section>

      {/* Showrooms Grid */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-8 border-t border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {SHOWROOMS.map((showroom, idx) => {
              const isSelected = selectedShowroom === showroom.id;
              const featuredCars = ALL_CARS.filter((car) =>
                showroom.featuredCarSlugs.includes(car.slug)
              );

              return (
                <motion.div
                  key={showroom.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (idx % 3) * 0.06 }}
                  viewport={{ once: true, margin: '-40px' }}
                  onClick={() => setSelectedShowroom(isSelected ? null : showroom.id)}
                  className="cursor-pointer"
                >
                  <div className="card card-hover p-5 sm:p-6 h-full flex flex-col">
                    {/* Header */}
                    <div className="mb-4">
                      <p className="font-eyebrow text-accent text-[10px] tracking-widest mb-1.5 uppercase">
                        {showroom.country}
                      </p>
                      <h3 className="font-serif text-2xl sm:text-3xl text-foreground font-light mb-1">
                        {showroom.city}
                      </h3>
                      <p className="font-body text-secondary text-xs sm:text-sm">{showroom.name}</p>
                    </div>

                    {/* Expandable Suite Details */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: isSelected ? 1 : 0,
                        height: isSelected ? 'auto' : 0,
                      }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden mb-4 border-t border-border/30 pt-4"
                    >
                      <div className="space-y-4">
                        {/* Address */}
                        <div>
                          <p className="font-eyebrow text-tertiary text-[10px] uppercase tracking-wider mb-0.5">
                            SUITE ADDRESS
                          </p>
                          <p className="font-body text-xs sm:text-sm text-secondary leading-relaxed">
                            {showroom.address}
                          </p>
                        </div>

                        {/* Hours */}
                        <div>
                          <p className="font-eyebrow text-tertiary text-[10px] uppercase tracking-wider mb-0.5">
                            PRIVATE HOURS
                          </p>
                          <p className="font-body text-xs sm:text-sm text-secondary leading-relaxed">
                            {showroom.hours}
                          </p>
                        </div>

                        {/* Contact */}
                        <div>
                          <p className="font-eyebrow text-tertiary text-[10px] uppercase tracking-wider mb-0.5">
                            DIRECT LIAISON
                          </p>
                          <p className="font-body text-xs text-secondary">{showroom.phone}</p>
                          <p className="font-body text-xs text-accent mt-0.5">{showroom.email}</p>
                        </div>

                        {/* Featured Vehicles in Suite */}
                        {featuredCars.length > 0 && (
                          <div>
                            <p className="font-eyebrow text-tertiary text-[10px] uppercase tracking-wider mb-1.5">
                              ON-SITE ALLOCATIONS
                            </p>
                            <div className="space-y-1">
                              {featuredCars.map((car) => (
                                <p key={car.slug} className="font-body text-xs text-secondary flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                  {car.brand} {car.model}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Suite Action CTAs */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                          <Link
                            href="/test-drive"
                            className="btn btn-primary text-xs min-h-[44px] flex-1 tracking-wider"
                            onClick={(e) => e.stopPropagation()}
                          >
                            BOOK PRIVATE DRIVE
                          </Link>
                        </div>
                      </div>
                    </motion.div>

                    {/* Toggle Indicator Bar */}
                    <div className="mt-auto border-t border-border/30 pt-3 flex items-center justify-between text-xs">
                      <span className="font-eyebrow text-tertiary text-[10px] tracking-wider">
                        {isSelected ? 'COLLAPSE SUITE' : 'VIEW SUITE DETAILS'}
                      </span>
                      <span className="text-accent text-base font-mono">
                        {isSelected ? '−' : '+'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global Concierge CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 border-t border-border/40 bg-[#060606]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: '-40px' }}
          >
            <p className="font-eyebrow text-accent text-[10px] sm:text-xs tracking-widest mb-2 uppercase">
              CONFIDENTIAL APPOINTMENT
            </p>
            <h2 className="font-serif text-2xl sm:text-4xl mb-4 text-balance">Arrange a Private Appointment</h2>
            <p className="font-body text-secondary text-xs sm:text-sm mb-8 max-w-lg mx-auto text-balance leading-relaxed">
              Our client directors arrange after-hours access and private vehicle presentations at any of our global suites.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-[340px] sm:max-w-none sm:w-auto mx-auto justify-center">
              <Link href="/test-drive" className="btn btn-primary min-h-[52px] sm:min-h-[48px] px-8 text-xs tracking-wider">
                REQUEST APPOINTMENT →
              </Link>
              <Link href="/cars" className="btn btn-secondary min-h-[52px] sm:min-h-[48px] px-8 text-xs tracking-wider">
                BROWSE COLLECTION
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
