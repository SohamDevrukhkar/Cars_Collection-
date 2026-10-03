import type { Car } from '@/types';
import { CARS } from './cars';
import { CARS_PART2 } from './cars-part2';
import { CARS_PART3 } from './cars-part3';

export const ALL_CARS: Car[] = [...CARS, ...CARS_PART2, ...CARS_PART3];

export function getCarBySlug(slug: string): Car | undefined {
  return ALL_CARS.find((car) => car.slug === slug);
}

export function getCarsByCategory(category: string): Car[] {
  return ALL_CARS.filter((car) => car.category === category);
}

export function getCarsByBrand(brand: string): Car[] {
  return ALL_CARS.filter((car) => car.brand === brand);
}

export function getFeaturedCars(): Car[] {
  return ALL_CARS.filter((car) => car.featured);
}

export function getCarsByPriceRange(min: number, max: number): Car[] {
  return ALL_CARS.filter((car) => car.price >= min && car.price <= max);
}

export function searchCars(query: string): Car[] {
  const q = query.toLowerCase();
  return ALL_CARS.filter(
    (car) =>
      car.model.toLowerCase().includes(q) ||
      car.brand.toLowerCase().includes(q) ||
      car.tagline.toLowerCase().includes(q) ||
      car.manifesto.toLowerCase().includes(q)
  );
}
