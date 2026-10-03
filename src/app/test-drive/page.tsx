'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ALL_CARS } from '@/data';
import { useCollectionStore } from '@/lib/store';

export default function TestDrivePage() {
  const { addTestDriveBooking } = useCollectionStore();

  const [formData, setFormData] = useState({
    carSlug: ALL_CARS[0]?.slug || '',
    fullName: '',
    email: '',
    phone: '',
    showroomLocation: 'Mumbai Viewing Suite',
    preferredDate: '',
    preferredTime: '11:00 AM - 01:00 PM',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const selectedCar = ALL_CARS.find((c) => c.slug === formData.carSlug) || ALL_CARS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCar) return;

    addTestDriveBooking({
      id: `td-${Date.now()}`,
      carId: selectedCar.id,
      carSlug: selectedCar.slug,
      carName: `${selectedCar.brand} ${selectedCar.model}`,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      preferredDate: formData.preferredDate || new Date().toISOString().split('T')[0],
      preferredTime: formData.preferredTime,
      showroomLocation: formData.showroomLocation,
      notes: formData.notes,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-[#060606] text-foreground min-h-screen px-4 sm:px-6 md:px-8 py-16 sm:py-24 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl mx-auto card p-6 sm:p-12 text-center"
        >
          <p className="font-eyebrow text-accent mb-3 text-[10px] sm:text-xs tracking-widest uppercase">
            EXPERIENCE CONFIRMED
          </p>
          <h1 className="font-display text-2xl sm:text-4xl mb-2">Test Drive Scheduled</h1>
          <p className="font-serif text-xl sm:text-2xl text-accent mb-4">
            {selectedCar?.brand} {selectedCar?.model}
          </p>
          <p className="font-body text-secondary text-xs sm:text-sm mb-8 leading-relaxed">
            Your private circuit and road driving session at {formData.showroomLocation} on {formData.preferredDate} ({formData.preferredTime}) has been registered. Your concierge chauffeur and performance instructor will prepare the cockpit.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/account/test-drives"
              className="btn btn-primary min-h-[52px] sm:min-h-[48px] px-8 text-xs tracking-wider"
            >
              VIEW IN ACCOUNT →
            </Link>
            <Link
              href="/cars"
              className="btn btn-secondary min-h-[52px] sm:min-h-[48px] px-8 text-xs tracking-wider"
            >
              RETURN TO COLLECTION
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#060606] text-foreground min-h-screen w-full max-w-[100vw] overflow-x-hidden px-4 sm:px-6 md:px-8 py-10 sm:py-20">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Header */}
          <div className="mb-8 sm:mb-12 text-center sm:text-left">
            <p className="font-eyebrow text-accent text-[10px] sm:text-xs tracking-widest uppercase mb-2">
              PRIVATE CIRCUIT & ROAD EXPERIENCE
            </p>
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl mb-3 text-foreground font-light">
              Book a Test Drive
            </h1>
            <p className="font-body text-secondary text-xs sm:text-base leading-relaxed max-w-xl">
              Experience the pinnacle of hypercar dynamics with an exclusive private driving session guided by our factory-trained test drivers.
            </p>
          </div>

          {/* Booking Form Card */}
          <form onSubmit={handleSubmit} className="card p-5 sm:p-8 space-y-6">
            <div>
              <h2 className="font-headline text-base sm:text-lg border-b border-border/30 pb-3 text-foreground">
                Session Credentials
              </h2>
            </div>

            {/* Vehicle Selection */}
            <div>
              <label className="block font-eyebrow text-[11px] text-tertiary mb-2 uppercase tracking-wider">
                SELECT MARQUE & MODEL *
              </label>
              <select
                value={formData.carSlug}
                onChange={(e) => setFormData({ ...formData, carSlug: e.target.value })}
                className="w-full bg-[#111111] border border-border/40 rounded px-4 py-3 text-[16px] sm:text-sm text-foreground focus:border-accent outline-none min-h-[48px] transition-colors"
                required
              >
                {ALL_CARS.map((car) => (
                  <option key={car.slug} value={car.slug}>
                    {car.brand} {car.model} — {car.specs.power} ({car.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div>
                <label className="block font-eyebrow text-[11px] text-tertiary mb-2 uppercase tracking-wider">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#111111] border border-border/40 rounded px-4 py-3 text-[16px] sm:text-sm text-foreground placeholder-tertiary focus:border-accent outline-none min-h-[48px] transition-colors"
                  placeholder="e.g. Alexander Vance"
                />
              </div>

              <div>
                <label className="block font-eyebrow text-[11px] text-tertiary mb-2 uppercase tracking-wider">
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#111111] border border-border/40 rounded px-4 py-3 text-[16px] sm:text-sm text-foreground placeholder-tertiary focus:border-accent outline-none min-h-[48px] transition-colors"
                  placeholder="vance@private.com"
                />
              </div>
            </div>

            {/* Phone & Showroom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div>
                <label className="block font-eyebrow text-[11px] text-tertiary mb-2 uppercase tracking-wider">
                  DIRECT PHONE NUMBER *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#111111] border border-border/40 rounded px-4 py-3 text-[16px] sm:text-sm text-foreground placeholder-tertiary focus:border-accent outline-none min-h-[48px] transition-colors"
                  placeholder="+44 20 7946 0912"
                />
              </div>

              <div>
                <label className="block font-eyebrow text-[11px] text-tertiary mb-2 uppercase tracking-wider">
                  PREFERRED DRIVING SUITE *
                </label>
                <select
                  value={formData.showroomLocation}
                  onChange={(e) => setFormData({ ...formData, showroomLocation: e.target.value })}
                  className="w-full bg-[#111111] border border-border/40 rounded px-4 py-3 text-[16px] sm:text-sm text-foreground focus:border-accent outline-none min-h-[48px] transition-colors"
                >
                  <option value="Mumbai Viewing Suite">Mumbai Viewing Suite & Track</option>
                  <option value="Delhi Private Salon">Delhi Private Salon & Circuit</option>
                  <option value="Bangalore Atelier">Bangalore Atelier</option>
                  <option value="Dubai International Financial Centre">Dubai Autodrome / DIFC</option>
                  <option value="London Mayfair Suite">London Mayfair Suite & Silverstone</option>
                  <option value="Singapore Marina Bay Suite">Singapore Marina Bay Suite</option>
                </select>
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div>
                <label className="block font-eyebrow text-[11px] text-tertiary mb-2 uppercase tracking-wider">
                  PREFERRED DATE *
                </label>
                <input
                  type="date"
                  required
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full bg-[#111111] border border-border/40 rounded px-4 py-3 text-[16px] sm:text-sm text-foreground focus:border-accent outline-none min-h-[48px] transition-colors [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="block font-eyebrow text-[11px] text-tertiary mb-2 uppercase tracking-wider">
                  PREFERRED TIME WINDOW
                </label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="w-full bg-[#111111] border border-border/40 rounded px-4 py-3 text-[16px] sm:text-sm text-foreground focus:border-accent outline-none min-h-[48px] transition-colors"
                >
                  <option value="09:00 AM - 11:00 AM">Morning Session (09:00 AM – 11:00 AM)</option>
                  <option value="11:00 AM - 01:00 PM">Midday Session (11:00 AM – 01:00 PM)</option>
                  <option value="02:00 PM - 04:00 PM">Afternoon Track (02:00 PM – 04:00 PM)</option>
                  <option value="05:00 PM - 07:00 PM">Sunset VIP Run (05:00 PM – 07:00 PM)</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-eyebrow text-[11px] text-tertiary mb-2 uppercase tracking-wider">
                SPECIAL REQUIREMENTS OR INSTRUCTOR PREFERENCES (OPTIONAL)
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-[#111111] border border-border/40 rounded px-4 py-3 text-[16px] sm:text-sm text-foreground placeholder-tertiary focus:border-accent outline-none transition-colors"
                placeholder="High-speed telemetry request, dual driver companion..."
              />
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-border/30">
              <button
                type="submit"
                className="btn btn-primary w-full min-h-[52px] sm:min-h-[48px] text-xs font-semibold tracking-widest uppercase"
              >
                CONFIRM DRIVING SESSION →
              </button>
            </div>
          </form>

          <p className="text-center text-tertiary text-xs mt-6">
            Already have reservations?{' '}
            <Link href="/account/test-drives" className="text-accent hover:underline">
              View your itinerary
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
