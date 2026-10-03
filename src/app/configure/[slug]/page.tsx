'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getCarBySlug } from '@/data';
import { formatCurrency } from '@/lib/utils';
import { useCollectionStore } from '@/lib/store';
import type { ColorOption, InteriorOption, WheelOption, VehicleOptionGroup } from '@/types';

export default function ConfigureSlugPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const car = getCarBySlug(slug);
  const { saveConfiguration } = useCollectionStore();

  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(
    car?.colorOptions[0] || null
  );
  const [selectedInterior, setSelectedInterior] = useState<InteriorOption | null>(
    car?.interiorOptions[0] || null
  );
  const [selectedWheel, setSelectedWheel] = useState<WheelOption | null>(
    car?.wheelOptions[0] || null
  );
  const [selectedAero, setSelectedAero] = useState<VehicleOptionGroup[]>([]);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!car) {
    return (
      <div className="min-h-screen bg-[#060606] text-foreground flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="font-eyebrow text-tertiary mb-3 text-xs tracking-widest uppercase">
            REGISTRY NOT FOUND
          </p>
          <h1 className="font-display text-4xl mb-4">404</h1>
          <p className="font-body text-secondary text-sm mb-8 leading-relaxed">
            The vehicle you are attempting to configure does not exist in our registry.
          </p>
          <Link href="/cars" className="btn btn-primary min-h-[48px] px-8 text-xs">
            EXPLORE THE COLLECTION →
          </Link>
        </div>
      </div>
    );
  }

  // Calculate total configuration price
  const basePrice = car.price;
  const colorDelta = selectedColor?.priceDelta || 0;
  const interiorDelta = selectedInterior?.priceDelta || 0;
  const wheelDelta = selectedWheel?.priceDelta || 0;
  const aeroDelta = selectedAero.reduce((sum, item) => sum + item.priceDelta, 0);
  const totalPrice = basePrice + colorDelta + interiorDelta + wheelDelta + aeroDelta;

  const toggleAeroOption = (option: VehicleOptionGroup) => {
    if (selectedAero.some((item) => item.id === option.id)) {
      setSelectedAero(selectedAero.filter((item) => item.id !== option.id));
    } else {
      setSelectedAero([...selectedAero, option]);
    }
  };

  const handleSaveConfiguration = () => {
    if (!selectedColor || !selectedInterior || !selectedWheel) return;

    const configId = `cfg-${Date.now()}`;
    saveConfiguration({
      id: configId,
      carId: car.id,
      carSlug: car.slug,
      carModel: car.model,
      carBrand: car.brand,
      color: selectedColor,
      interior: selectedInterior,
      wheel: selectedWheel,
      caliper: car.caliperOptions[0] || { id: 'std', name: 'Standard Calipers', hex: '#000000', priceDelta: 0 },
      aero: selectedAero,
      totalPrice,
      createdAt: new Date().toISOString(),
    });

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3500);
  };

  return (
    <div className="bg-[#060606] text-foreground min-h-screen w-full max-w-[100vw] overflow-x-hidden pb-28 sm:pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Back Link */}
          <Link
            href={`/cars/${car.slug}`}
            className="inline-flex items-center gap-2 font-eyebrow text-tertiary hover:text-foreground text-[11px] tracking-wider mb-6 min-h-[44px]"
          >
            ← BACK TO {car.model.toUpperCase()}
          </Link>

          {/* Header Title Stack */}
          <div className="mb-8 sm:mb-12">
            <p className="font-eyebrow text-accent text-[10px] sm:text-xs tracking-widest uppercase mb-2">
              BESPOKE ATELIER SPECIFICATION
            </p>
            <h1 className="font-display text-3xl sm:text-5xl mb-2 text-foreground font-light">
              {car.brand}
            </h1>
            <p className="font-serif text-2xl sm:text-3xl text-accent mb-4">{car.model}</p>
            <p className="font-body text-secondary text-sm sm:text-base leading-relaxed max-w-xl">
              Customize your one-of-one allocation. Selected options will be compiled for your private client liaison.
            </p>
          </div>

          {/* Car Preview Image */}
          <div className="card p-4 sm:p-6 mb-10 overflow-hidden">
            <div className="relative aspect-[16/9] rounded overflow-hidden bg-[#111111] mb-4">
              <img
                src={car.heroImage}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-car.jpg';
                }}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-eyebrow text-tertiary text-[10px]">
                BASE: {formatCurrency(car.price)}
              </span>
              <span className="font-body text-accent font-semibold text-sm">
                SPEC TOTAL: {formatCurrency(totalPrice)}
              </span>
            </div>
          </div>

          {/* Configuration Steps */}
          <div className="space-y-8 sm:space-y-12">
            {/* 1. Exterior Paint Finishes */}
            <div className="card p-5 sm:p-8">
              <div className="flex justify-between items-baseline mb-6 border-b border-border/30 pb-3">
                <div>
                  <p className="font-eyebrow text-accent text-[10px] tracking-widest uppercase">
                    PHASE 01
                  </p>
                  <h2 className="font-serif text-xl sm:text-2xl text-foreground">
                    Exterior Paintwork
                  </h2>
                </div>
                {selectedColor && (
                  <span className="font-eyebrow text-secondary text-[11px]">
                    {selectedColor.name}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {car.colorOptions.map((color) => {
                  const isSelected = selectedColor?.id === color.id;
                  return (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`p-3 sm:p-4 rounded text-left transition-all min-h-[90px] flex flex-col justify-between ${
                        isSelected
                          ? 'border-2 border-accent bg-[#161616] shadow-md'
                          : 'border border-border/40 hover:border-border/80 bg-[#111111]'
                      }`}
                    >
                      <div
                        className="w-full h-10 rounded mb-2.5 border border-border/40 shadow-inner"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div>
                        <p className="font-body text-xs font-medium text-foreground truncate">
                          {color.name}
                        </p>
                        <p className="font-eyebrow text-tertiary text-[9px] uppercase tracking-wider">
                          {color.category}
                        </p>
                        {color.priceDelta > 0 ? (
                          <p className="font-body text-accent text-[10px] mt-0.5">
                            +{formatCurrency(color.priceDelta)}
                          </p>
                        ) : (
                          <p className="font-body text-secondary text-[10px] mt-0.5">Included</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Interior Environment */}
            <div className="card p-5 sm:p-8">
              <div className="flex justify-between items-baseline mb-6 border-b border-border/30 pb-3">
                <div>
                  <p className="font-eyebrow text-accent text-[10px] tracking-widest uppercase">
                    PHASE 02
                  </p>
                  <h2 className="font-serif text-xl sm:text-2xl text-foreground">
                    Interior Environment
                  </h2>
                </div>
                {selectedInterior && (
                  <span className="font-eyebrow text-secondary text-[11px]">
                    {selectedInterior.name}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {car.interiorOptions.map((interior) => {
                  const isSelected = selectedInterior?.id === interior.id;
                  return (
                    <button
                      key={interior.id}
                      onClick={() => setSelectedInterior(interior)}
                      className={`p-4 rounded text-left transition-all min-h-[80px] ${
                        isSelected
                          ? 'border-2 border-accent bg-[#161616] shadow-md'
                          : 'border border-border/40 hover:border-border/80 bg-[#111111]'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-headline text-xs sm:text-sm text-foreground">
                          {interior.name}
                        </h4>
                        {isSelected && <span className="text-accent text-xs">● SELECTED</span>}
                      </div>
                      <p className="font-body text-secondary text-xs mb-1.5">{interior.material}</p>
                      <div className="flex justify-between items-center text-[10px] pt-2 border-t border-border/20">
                        <span className="font-eyebrow text-tertiary uppercase">
                          Trim: {interior.trim}
                        </span>
                        <span className="font-body text-accent">
                          {interior.priceDelta > 0 ? `+${formatCurrency(interior.priceDelta)}` : 'Included'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Wheel Specifications */}
            <div className="card p-5 sm:p-8">
              <div className="flex justify-between items-baseline mb-6 border-b border-border/30 pb-3">
                <div>
                  <p className="font-eyebrow text-accent text-[10px] tracking-widest uppercase">
                    PHASE 03
                  </p>
                  <h2 className="font-serif text-xl sm:text-2xl text-foreground">
                    Wheel Specification
                  </h2>
                </div>
                {selectedWheel && (
                  <span className="font-eyebrow text-secondary text-[11px]">
                    {selectedWheel.name}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {car.wheelOptions.map((wheel) => {
                  const isSelected = selectedWheel?.id === wheel.id;
                  return (
                    <button
                      key={wheel.id}
                      onClick={() => setSelectedWheel(wheel)}
                      className={`p-4 rounded text-left transition-all min-h-[80px] ${
                        isSelected
                          ? 'border-2 border-accent bg-[#161616] shadow-md'
                          : 'border border-border/40 hover:border-border/80 bg-[#111111]'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-headline text-xs sm:text-sm text-foreground">
                          {wheel.name}
                        </h4>
                        {isSelected && <span className="text-accent text-xs">● SELECTED</span>}
                      </div>
                      <p className="font-eyebrow text-tertiary text-[10px] uppercase mb-2">
                        Finish: {wheel.finish}
                      </p>
                      <div className="flex justify-between items-center text-[10px] pt-2 border-t border-border/20">
                        <span className="font-eyebrow text-tertiary uppercase">Size: {wheel.size}</span>
                        <span className="font-body text-accent">
                          {wheel.priceDelta > 0 ? `+${formatCurrency(wheel.priceDelta)}` : 'Included'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Bespoke Aerodynamics & Packages */}
            {car.aeroOptions.length > 0 && (
              <div className="card p-5 sm:p-8">
                <div className="mb-6 border-b border-border/30 pb-3">
                  <p className="font-eyebrow text-accent text-[10px] tracking-widest uppercase">
                    PHASE 04
                  </p>
                  <h2 className="font-serif text-xl sm:text-2xl text-foreground">
                    Aerodynamic & Bespoke Packages
                  </h2>
                </div>

                <div className="space-y-3">
                  {car.aeroOptions.map((aero) => {
                    const isSelected = selectedAero.some((item) => item.id === aero.id);
                    return (
                      <div
                        key={aero.id}
                        onClick={() => toggleAeroOption(aero)}
                        className={`p-4 rounded cursor-pointer transition-all flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'border border-accent bg-[#161616]'
                            : 'border border-border/40 hover:border-border/80 bg-[#111111]'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-headline text-xs sm:text-sm text-foreground mb-0.5">
                            {aero.name}
                          </h4>
                          <p className="font-body text-secondary text-xs leading-relaxed">
                            {aero.description}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-body text-accent text-xs font-semibold">
                            +{formatCurrency(aero.priceDelta)}
                          </p>
                          <span className={`text-[10px] font-eyebrow uppercase ${isSelected ? 'text-accent' : 'text-tertiary'}`}>
                            {isSelected ? 'ADDED ✓' : '+ ADD'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Floating / Sticky Mobile Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#060606]/95 backdrop-blur-lg border-t border-border/50 py-3 sm:py-4 px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          <div className="min-w-0">
            <p className="font-eyebrow text-tertiary text-[9px] sm:text-[10px] tracking-wider uppercase truncate">
              {car.brand} {car.model}
            </p>
            <p className="font-serif text-base sm:text-xl text-accent font-medium truncate">
              {formatCurrency(totalPrice)}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={handleSaveConfiguration}
              className="btn btn-secondary min-h-[48px] px-4 text-xs tracking-wider"
            >
              {savedNotice ? 'SAVED ✓' : 'SAVE SPEC'}
            </button>
            <Link
              href={`/reserve/${car.slug}`}
              className="btn btn-primary min-h-[48px] px-5 sm:px-8 text-xs tracking-wider font-semibold"
            >
              REQUEST ALLOCATION →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
