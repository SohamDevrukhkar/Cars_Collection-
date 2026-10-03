import type { Showroom, Showroom as ShowroomType } from '@/types';

export const SHOWROOMS: ShowroomType[] = [
  {
    id: 'mumbai',
    city: 'Mumbai',
    country: 'India',
    name: 'The Collection Mumbai',
    address: 'Bandra Kurla Complex, Mumbai, India',
    hours: 'Mon–Fri 10am–7pm, Sat 11am–6pm, Sun Closed',
    phone: '+91 22 6789 0123',
    email: 'mumbai@thecollection.co',
    featuredCarSlugs: ['rolls-royce-spectre', 'bugatti-tourbillon', 'ferrari-296-gtb'],
    image: '/showrooms/mumbai.jpg',
  },
  {
    id: 'delhi',
    city: 'Delhi',
    country: 'India',
    name: 'The Collection Delhi',
    address: 'Mehrauli, Delhi, India',
    hours: 'Mon–Fri 10am–7pm, Sat 11am–6pm, Sun Closed',
    phone: '+91 11 4567 8901',
    email: 'delhi@thecollection.co',
    featuredCarSlugs: ['lucid-air-sapphire', 'lamborghini-revuelto', 'range-rover'],
    image: '/showrooms/delhi.jpg',
  },
  {
    id: 'bangalore',
    city: 'Bangalore',
    country: 'India',
    name: 'The Collection Bangalore',
    address: 'Indiranagar, Bangalore, India',
    hours: 'Mon–Fri 10am–7pm, Sat 11am–6pm, Sun Closed',
    phone: '+91 80 1234 5678',
    email: 'bangalore@thecollection.co',
    featuredCarSlugs: ['koenigsegg-jesko', 'aston-martin-dbx', 'lamborghini-urus'],
    image: '/showrooms/bangalore.jpg',
  },
  {
    id: 'dubai',
    city: 'Dubai',
    country: 'UAE',
    name: 'The Collection Dubai',
    address: 'Downtown Dubai, United Arab Emirates',
    hours: 'Sat–Wed 10am–8pm, Thu–Fri 10am–10pm',
    phone: '+971 4 123 4567',
    email: 'dubai@thecollection.co',
    featuredCarSlugs: ['mclaren-w1', 'rolls-royce-ghost', 'bentley-flying-spur'],
    image: '/showrooms/dubai.jpg',
  },
  {
    id: 'london',
    city: 'London',
    country: 'United Kingdom',
    name: 'The Collection London',
    address: 'Mayfair, London, United Kingdom',
    hours: 'Mon–Fri 10am–7pm, Sat 11am–6pm, Sun Closed',
    phone: '+44 20 7123 4567',
    email: 'london@thecollection.co',
    featuredCarSlugs: ['mclaren-w1', 'aston-martin-dbx', 'range-rover'],
    image: '/showrooms/london.jpg',
  },
  {
    id: 'singapore',
    city: 'Singapore',
    country: 'Singapore',
    name: 'The Collection Singapore',
    address: 'Marina Bay, Singapore',
    hours: 'Mon–Fri 10am–7pm, Sat 11am–6pm, Sun Closed',
    phone: '+65 6789 0123',
    email: 'singapore@thecollection.co',
    featuredCarSlugs: ['rolls-royce-spectre', 'lucid-air-sapphire', 'lamborghini-revuelto'],
    image: '/showrooms/singapore.jpg',
  },
];

export function getShowroomByCity(city: string): ShowroomType | undefined {
  return SHOWROOMS.find((s) => s.city.toLowerCase() === city.toLowerCase());
}

export function getShowroomByCountry(country: string): ShowroomType[] {
  return SHOWROOMS.filter((s) => s.country.toLowerCase() === country.toLowerCase());
}
