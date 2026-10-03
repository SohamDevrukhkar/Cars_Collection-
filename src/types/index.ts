export type VehicleCategory =
  | 'Supercar'
  | 'Hypercar'
  | 'Electric Luxury'
  | 'Electric Performance'
  | 'Luxury Sedan'
  | 'Luxury SUV'
  | 'Performance SUV'
  | 'Grand Tourer'
  | 'Convertible';

export type PowertrainType = 'ICE' | 'Hybrid' | 'PHEV' | 'Electric';

export type DrivetrainType = 'RWD' | 'AWD' | '4WD';

export interface PerformanceSpecs {
  power: string; // e.g. "830 CV" or "1,800 HP"
  powerHp: number;
  torque: string; // e.g. "740 Nm" or "1,000 Nm"
  acceleration: string; // e.g. "2.9 s" (0-100 km/h)
  accelerationSec: number;
  topSpeed: string; // e.g. "330 km/h" or "445 km/h"
  topSpeedKmh: number;
  engine?: string; // e.g. "3.0L Twin-Turbo 120° V6"
  electricMotor?: string; // e.g. "167 CV MGU-K Axial Flux"
  batteryCapacity?: string; // e.g. "7.45 kWh" or "118 kWh"
  electricRange?: string; // e.g. "25 km" or "687 km"
  transmission: string; // e.g. "8-speed Dual-Clutch F1"
  drivetrain: DrivetrainType;
  curbWeight: string; // e.g. "1,470 kg"
  weightDistribution?: string; // e.g. "40.5% / 59.5%"
  dragCoefficient?: string; // e.g. "0.33 Cd"
  cargoCapacity?: string; // e.g. "858 L" (for SUVs)
}

export interface EngineeringBreakdown {
  type: 'combustion' | 'hybrid' | 'electric' | 'suv' | 'luxury' | 'performance';
  title: string;
  subtitle: string;
  description: string;
  components: {
    name: string;
    description: string;
    highlight: string;
  }[];
}

export interface DesignHighlight {
  title: string;
  subtitle: string;
  description: string;
  tag: string;
}

export interface ColorOption {
  id: string;
  name: string;
  category: 'Standard' | 'Metallic' | 'Atelier Matte' | 'Heritage';
  hex: string;
  secondaryHex?: string;
  priceDelta: number;
}

export interface InteriorOption {
  id: string;
  name: string;
  material: 'Full-Grain Leather' | 'Alcantara & Leather' | 'Bespoke Cashmere Blend' | 'Aniline Semi-Aniline';
  color: string;
  hex: string;
  stitching: string;
  trim: string;
  priceDelta: number;
}

export interface WheelOption {
  id: string;
  name: string;
  size: string;
  finish: string;
  priceDelta: number;
}

export interface VehicleOptionGroup {
  id: string;
  name: string;
  description: string;
  priceDelta: number;
}

export interface CarFraming {
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  backgroundColor?: string;
  feather?: number;
  frameFit?: 'contain' | 'cover';
  frameWidth?: number;
  frameHeight?: number;
  // Responsive overrides per viewport category
  responsive?: {
    desktop?: Omit<CarFraming, 'responsive'>; // 1440px+
    laptop?: Omit<CarFraming, 'responsive'>; // 1024–1439px
    tablet?: Omit<CarFraming, 'responsive'>; // 768–1023px
    mobile?: Omit<CarFraming, 'responsive'>; // 320–767px
  };
}

export interface NarrativeOverlay {
  range: [number, number]; // [startPct, endPct] e.g. [0, 0.15]
  eyebrow?: string;
  headline: string;
  statement: string;
  subtext?: string;
  position?: 'left' | 'right' | 'center';
}

export interface Car {
  id: string;
  slug: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  category: VehicleCategory;
  powertrainType: PowertrainType;
  price: number;
  currency: string;
  tagline: string;
  manifesto: string;
  heroStatement: string;
  narratives: NarrativeOverlay[];
  framing?: CarFraming;
  specs: PerformanceSpecs;
  engineering: EngineeringBreakdown;
  design: DesignHighlight[];
  drivingExperience: {
    headline: string;
    environment: string;
    narrative: string;
  };
  craftsmanship: {
    headline: string;
    narrative: string;
    materials: string[];
  };
  framePath: string;
  frameCount: number;
  heroImage: string;
  galleryImages: string[];
  interiorImage: string;
  deconstructedImage: string;
  chassisImage: string;
  colorOptions: ColorOption[];
  interiorOptions: InteriorOption[];
  wheelOptions: WheelOption[];
  caliperOptions: { id: string; name: string; hex: string; priceDelta: number }[];
  aeroOptions: VehicleOptionGroup[];
  featured: boolean;
  chapterIndex?: number;
  audioSignature?: {
    pitchBase: number;
    harmonicType: 'v12' | 'v8' | 'v6-hybrid' | 'v6-turbo' | 'electric-whine' | 'w16' | 'v8-twin-turbo';
  };
}

export interface VehicleConfiguration {
  id: string;
  carId: string;
  carSlug: string;
  carModel: string;
  carBrand: string;
  color: ColorOption;
  interior: InteriorOption;
  wheel: WheelOption;
  caliper: { id: string; name: string; hex: string; priceDelta: number };
  aero: VehicleOptionGroup[];
  totalPrice: number;
  createdAt: string;
}

export interface TestDriveRequest {
  id: string;
  carId: string;
  carSlug: string;
  carName: string;
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  showroomLocation: string;
  notes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface PurchaseRequest {
  id: string;
  carId: string;
  carSlug: string;
  carName: string;
  configuration?: VehicleConfiguration;
  customerDetails: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
  };
  delivery: {
    type: 'DIRECT_DELIVERY' | 'SHOWROOM_COLLECTION' | 'WHITE_GLOVE_AIR';
    showroomLocation?: string;
    instructions?: string;
  };
  financing: {
    type: 'PAY_IN_FULL' | 'FINANCE';
    downPayment?: number;
    loanTermMonths?: number;
    monthlyPayment?: number;
    interestRate?: number;
  };
  estimatedTotal: number;
  status: 'REQUESTED' | 'UNDER_REVIEW' | 'CONFIGURATION_CONFIRMED' | 'FINANCING' | 'RESERVED' | 'PURCHASE_COMPLETE';
  createdAt: string;
}

export interface Showroom {
  id: string;
  city: string;
  country: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  email: string;
  featuredCarSlugs: string[];
  image: string;
}
