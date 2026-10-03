'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getCarBySlug } from '@/data';
import { formatCurrency } from '@/lib/utils';
import { useCollectionStore } from '@/lib/store';

export default function ReserveSlugPage() {
  const params = useParams();
  const slug = params.slug as string;
  const car = getCarBySlug(slug);
  const { addPurchaseRequest } = useCollectionStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    showroom: 'Mumbai Viewing Suite',
    preferredDeliveryMonth: 'Q1 2025',
    bespokeRequests: '',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!car) {
    return (
      <div className="min-h-screen bg-[#060606] text-foreground flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="font-eyebrow text-tertiary mb-3 text-xs tracking-widest uppercase">
            REGISTRY NOT FOUND
          </p>
          <h1 className="font-display text-4xl mb-4">404</h1>
          <p className="font-body text-secondary text-sm mb-8 leading-relaxed">
            The vehicle you are attempting to reserve does not exist in our registry.
          </p>
          <Link href="/cars" className="btn btn-primary min-h-[48px] px-8 text-xs">
            EXPLORE THE COLLECTION →
          </Link>
        </div>
      </div>
    );
  }

  const getCountryByShowroom = (showroom: string) => {
    if (showroom.includes('Dubai')) return 'UAE';
    if (showroom.includes('London')) return 'United Kingdom';
    if (showroom.includes('Singapore')) return 'Singapore';
    return 'India';
  };

  const getCityByShowroom = (showroom: string) => {
    if (showroom.includes('Dubai')) return 'Dubai';
    if (showroom.includes('London')) return 'London';
    if (showroom.includes('Singapore')) return 'Singapore';
    if (showroom.includes('Delhi')) return 'Delhi';
    if (showroom.includes('Bangalore')) return 'Bangalore';
    return 'Mumbai';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const city = getCityByShowroom(formData.showroom);
    const country = getCountryByShowroom(formData.showroom);

    addPurchaseRequest({
      id: `res-${Date.now()}`,
      carId: car.id,
      carSlug: car.slug,
      carName: `${car.brand} ${car.model}`,
      customerDetails: {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.showroom,
        city,
        country,
        postalCode: '',
      },
      delivery: {
        type: 'SHOWROOM_COLLECTION',
        showroomLocation: formData.showroom,
        instructions: formData.bespokeRequests || `Preferred delivery timeline: ${formData.preferredDeliveryMonth}`,
      },
      financing: {
        type: 'PAY_IN_FULL',
      },
      estimatedTotal: car.price,
      status: 'REQUESTED',
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
            CONFIDENTIAL ACQUISITION RECORD
          </p>
          <h1 className="font-display text-2xl sm:text-4xl mb-2">Allocation Requested</h1>
          <p className="font-serif text-xl sm:text-2xl text-accent mb-4">
            {car.brand} {car.model}
          </p>
          <p className="font-body text-secondary text-xs sm:text-sm mb-8 leading-relaxed">
            Your private allocation request has been registered at the {formData.showroom}. A senior client liaison will reach out discreetly within 4 hours to verify credentials and arrange private viewing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/account/purchases"
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
          {/* Back Navigation */}
          <Link
            href={`/cars/${car.slug}`}
            className="inline-flex items-center gap-2 font-eyebrow text-tertiary hover:text-foreground text-[11px] tracking-wider mb-6 min-h-[44px]"
          >
            ← BACK TO {car.model.toUpperCase()}
          </Link>

          {/* Allocation Header */}
          <div className="mb-8 sm:mb-12">
            <p className="font-eyebrow text-accent text-[10px] sm:text-xs tracking-widest uppercase mb-2">
              CONFIDENTIAL RESERVATION
            </p>
            <h1 className="font-display text-3xl sm:text-5xl mb-2 text-foreground font-light">
              {car.brand}
            </h1>
            <p className="font-serif text-2xl sm:text-3xl text-accent mb-3">{car.model}</p>
            <p className="font-body text-secondary text-sm sm:text-base leading-relaxed">
              Base Allocation: <span className="text-foreground font-semibold">{formatCurrency(car.price)}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="card p-5 sm:p-8 space-y-6">
            <div>
              <h2 className="font-headline text-base sm:text-lg border-b border-border/30 pb-3 text-foreground">
                Client Credentials & Delivery Suite
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div>
                <label className="block font-eyebrow text-[11px] text-tertiary mb-2 uppercase tracking-wider">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#111111] border border-border/40 rounded px-4 py-3 text-[16px] sm:text-sm text-foreground placeholder-tertiary focus:border-accent outline-none min-h-[48px] transition-colors"
                  placeholder="e.g. Lord / Lady / Mr / Ms..."
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
                  placeholder="client@domain.com"
                />
              </div>
            </div>

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
                  PREFERRED VIEWING SUITE
                </label>
                <select
                  value={formData.showroom}
                  onChange={(e) => setFormData({ ...formData, showroom: e.target.value })}
                  className="w-full bg-[#111111] border border-border/40 rounded px-4 py-3 text-[16px] sm:text-sm text-foreground focus:border-accent outline-none min-h-[48px] transition-colors"
                >
                  <option value="Mumbai Viewing Suite">Mumbai Viewing Suite</option>
                  <option value="Delhi Private Salon">Delhi Private Salon</option>
                  <option value="Bangalore Atelier">Bangalore Atelier</option>
                  <option value="Dubai International Financial Centre">Dubai DIFC Salon</option>
                  <option value="London Mayfair Suite">London Mayfair Suite</option>
                  <option value="Singapore Marina Bay Suite">Singapore Marina Bay Suite</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-eyebrow text-[11px] text-tertiary mb-2 uppercase tracking-wider">
                PREFERRED ALLOCATION TIMELINE
              </label>
              <select
                value={formData.preferredDeliveryMonth}
                onChange={(e) => setFormData({ ...formData, preferredDeliveryMonth: e.target.value })}
                className="w-full bg-[#111111] border border-border/40 rounded px-4 py-3 text-[16px] sm:text-sm text-foreground focus:border-accent outline-none min-h-[48px] transition-colors"
              >
                <option value="Immediate Allocation">Immediate Allocation (If Available)</option>
                <option value="Q1 2025">Q1 2025</option>
                <option value="Q2 2025">Q2 2025</option>
                <option value="Q3 2025">Q3 2025</option>
                <option value="Q4 2025">Q4 2025</option>
              </select>
            </div>

            <div>
              <label className="block font-eyebrow text-[11px] text-tertiary mb-2 uppercase tracking-wider">
                BESPOKE COMMISSIONS & NOTES (OPTIONAL)
              </label>
              <textarea
                rows={3}
                value={formData.bespokeRequests}
                onChange={(e) => setFormData({ ...formData, bespokeRequests: e.target.value })}
                className="w-full bg-[#111111] border border-border/40 rounded px-4 py-3 text-[16px] sm:text-sm text-foreground placeholder-tertiary focus:border-accent outline-none transition-colors"
                placeholder="Paint-to-sample requests, custom embossing, security transport requirements..."
              />
            </div>

            <div className="pt-4 border-t border-border/30">
              <button
                type="submit"
                className="btn btn-primary w-full min-h-[52px] sm:min-h-[48px] text-xs font-semibold tracking-widest uppercase"
              >
                SUBMIT ALLOCATION REQUEST →
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
