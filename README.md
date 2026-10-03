# THE COLLECTION — Luxury Automotive Marketplace

A premium, mobile-first digital platform for curating and acquiring the world's most exceptional vehicles. THE COLLECTION delivers a cinematic, responsive experience across all devices, from iPhone SE to desktop displays, with seamless state management and bespoke customization flows.

## 🎬 Overview

THE COLLECTION is a Next.js 14.2 luxury automotive marketplace featuring:

- **Responsive Design**: Fully optimized for iPhone SE (375×667) through iPhone 16 Pro Max (440×956) and desktop (1440×900+)
- **Cinematic Experience**: Full-screen intro sequence with canvas-based car frame animations
- **Bespoke Customization**: Atelier system for tailoring exterior finishes, interior appointments, and wheel selections
- **Account Portal**: Client dashboard for managing saved vehicles, configurations, test drives, and allocation requests
- **Advanced Catalog**: Vehicle filtering, search, and side-by-side comparison (up to 3 cars)
- **Global Showrooms**: Private viewing suites and test drive facilities worldwide
- **Zero Horizontal Overflow**: Strict mobile constraints with zero layout breaking on any viewport

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14.2 (App Router) |
| **React** | v18 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3.4 with custom design tokens |
| **Animations** | Framer Motion 11 |
| **State** | Zustand 5 with persist middleware |
| **Database** | Supabase (PostgreSQL) |
| **Build** | Vercel deployment-ready |

---

## 📁 Project Structure

```
src/
├── app/                           # Next.js App Router pages
│   ├── page.tsx                  # Homepage with hero & chapters
│   ├── cars/
│   │   ├── page.tsx              # Vehicle catalog with filtering
│   │   └── [slug]/page.tsx       # Individual car detail pages
│   ├── account/
│   │   ├── page.tsx              # Client dashboard
│   │   ├── saved/page.tsx        # Saved vehicles (wishlist)
│   │   ├── configurations/page.tsx # Bespoke specs archive
│   │   ├── test-drives/page.tsx  # Test drive bookings
│   │   └── purchases/page.tsx    # Allocation requests
│   ├── configure/
│   │   ├── page.tsx              # Atelier entry
│   │   └── [slug]/page.tsx       # Custom config builder
│   ├── reserve/[slug]/page.tsx   # Allocation request form
│   ├── test-drive/page.tsx       # Test drive booking
│   ├── compare/page.tsx          # Side-by-side vehicle comparison
│   ├── showrooms/page.tsx        # Global showroom directory
│   ├── login/page.tsx            # Client authentication
│   ├── register/page.tsx         # Account creation
│   ├── forgot-password/page.tsx  # Password recovery
│   ├── globals.css               # Global styles & responsive overrides
│   └── layout.tsx                # Root layout with Navigation
│
├── components/
│   ├── Navigation.tsx            # Mobile nav overlay & header
│   ├── CarSequence.tsx           # Canvas-based frame renderer
│   ├── CinematicIntro.tsx        # Full-screen intro animation
│   └── [other components]
│
├── hooks/
│   ├── usePinnedFrameSequence.ts # Scroll-pinned animation hook
│   └── useResponsiveViewport.ts  # Viewport detection utility
│
├── lib/
│   ├── store.ts                  # Zustand state management
│   ├── utils.ts                  # Formatting & helpers
│   ├── sound.ts                  # Audio utilities
│   └── supabase/
│       ├── client.ts             # Supabase client config
│       └── schema.sql            # Database schema
│
├── data/
│   ├── cars.ts                   # Vehicle registry (part 1)
│   ├── cars-part2.ts             # Vehicle registry (part 2)
│   ├── cars-part3.ts             # Vehicle registry (part 3)
│   ├── showrooms.ts              # Global showroom data
│   └── index.ts                  # Data exports
│
└── types/
    └── index.ts                  # TypeScript type definitions

public/
├── cars/                         # Vehicle image assets
│   ├── [brand-model]/
│   │   ├── hero.jpg              # Hero thumbnail
│   │   ├── interior.jpg          # Interior shot
│   │   ├── chassis.jpg           # Chassis detail
│   │   ├── deconstructed.jpg     # Exploded view
│   │   ├── gallery-01.jpg        # Gallery image 1
│   │   ├── gallery-02.jpg        # Gallery image 2
│   │   └── frames/               # Frame sequence images
│   └── [other vehicles]
└── [svg icons & logos]
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18.17 or later
- **npm** or **yarn**
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/SohamDevrukhkar/Cars_Collection-.git
cd Cars_Collection-

# Install dependencies
npm install

# Set up environment variables (if using Supabase)
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

### Development

```bash
# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
```

The application will auto-reload as you edit files.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start

# Or deploy directly to Vercel
vercel
```

---

## 📱 Responsive Design Strategy

### Mobile-First Constraints
- **Zero horizontal overflow** on all viewports
- **Safe area insets** applied on notched devices (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`)
- **Hero & viewport-locked layouts** use `100svh` / `100dvh` to prevent address bar shifting

### Touch & Interaction
- **All form inputs**: `text-[16px]` + `min-h-[48px]` (iOS Safari auto-zoom prevention)
- **Primary buttons**: `min-h-[52px]` on mobile, `min-h-[48px]` on tablet+
- **Touch targets**: minimum 44–48px to exceed WCAG AA standards

### Typography Scaling
Fluid clamped typography using CSS `clamp()`:

```css
.font-display { font-size: clamp(1.875rem, 5vw, 3.75rem); }
.font-headline { font-size: clamp(1.25rem, 3vw, 1.875rem); }
.font-subheading { font-size: clamp(1rem, 2.5vw, 1.25rem); }
.font-body { font-size: clamp(0.875rem, 2vw, 1rem); }
.font-eyebrow { font-size: clamp(0.625rem, 1.5vw, 0.75rem); }
```

Letter-spacing is reduced on screens ≤768px to prevent horizontal text blowout.

### Viewport Breakpoints
- **Mobile**: 375px–440px (iPhone SE to iPhone 16 Pro Max)
- **Tablet**: 768px–1024px
- **Desktop**: 1280px–1440px+

---

## 🎨 Design System

### Color Tokens
Defined in `tailwind.config.js`:

```javascript
foreground: '#f5f5f5',      // Text & primary elements
background: '#000000',      // Page background
card: '#0f0f0f',           // Card backgrounds
border: '#222222',         // Divider & border colors
accent: '#e4b366',         // Brand highlight (gold)
secondary: '#a0a0a0',      // Secondary text
tertiary: '#707070',       // Tertiary text
```

### Component Library
- **Cards**: `.card` with hover scales and transitions
- **Buttons**: `.btn.btn-primary`, `.btn.btn-secondary`
- **Inputs**: 16px font, 48px min-height, border focus states
- **Spacing**: Consistent padding/margin scales

---

## 💾 State Management

### Zustand Store (`src/lib/store.ts`)

The global store persists across sessions and manages:

```typescript
{
  wishlist: string[]                    // Saved car slugs
  compareList: string[]                 // Up to 3 cars for comparison
  savedConfigurations: Configuration[]  // Bespoke specs
  testDriveBookings: Booking[]         // Scheduled test drives
  purchaseRequests: PurchaseRequest[]  // Allocation requests
}
```

**Persistence**: Zustand's `persist` middleware saves state to `localStorage` automatically.

### Usage Example

```typescript
import { useCollectionStore } from '@/lib/store';

export default function MyComponent() {
  const { wishlist, addToWishlist } = useCollectionStore();
  
  return (
    <button onClick={() => addToWishlist('bugatti-tourbillon')}>
      Save Vehicle
    </button>
  );
}
```

---

## 🎬 Canvas Rendering & Performance

### High-DPI Optimization
- **DPR Capping**: Device pixel ratio limited to `Math.min(window.devicePixelRatio, 2)` to prevent GPU memory overhead on mobile
- **Aspect Ratio Fit**: Calculated as `Math.min(availableWidth / sourceWidth, availableHeight / sourceHeight)` for perfect contain fit
- **Feathering**: 4-edge linear gradient fade into `#060606` background

### Frame Sequence Animation
The `CarSequence` component renders sequential car images as pinned animations scroll on desktop and as introspective sequences on mobile.

---

## 🔐 Security & Best Practices

- **Environment Variables**: All sensitive keys (.env.local) excluded from git
- **Type Safety**: 100% TypeScript with strict mode enabled
- **Input Validation**: Form fields validated before submission
- **CORS Headers**: Properly configured for API interactions
- **No Secrets in Code**: Database credentials loaded from environment only

---

## 📊 Performance Metrics

| Metric | Target | Status |
|--------|--------|--------|
| First Load JS | <160 kB | ✓ 157 kB |
| Routes | 19 total | ✓ All compiled |
| Static Pages | 18/19 | ✓ Pre-rendered |
| Dynamic Pages | 1/19 | ✓ car detail |
| TypeScript Errors | 0 | ✓ Clean build |

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Deploy via Vercel dashboard
# or use CLI:
vercel
```

### Environment Variables for Production

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

---

## 📚 Key Features

### 1. **Cinematic Intro**
Full-screen canvas-based car frame sequence with scroll-pinned animation on desktop.

### 2. **Vehicle Catalog**
- Filter by category (Hypercar, Supercar, Luxury Sedan, etc.)
- Search by brand or model
- Responsive grid (1 col mobile → 3 col desktop)
- Hero image with hover scale effect

### 3. **Bespoke Atelier**
- Customize exterior paint finishes
- Select interior appointments
- Choose wheel designs
- Save configurations to account
- Real-time pricing updates

### 4. **Account Portal**
- **Saved Vehicles**: Private wishlist with quick access to configure/reserve
- **Configurations**: Archive of custom specs with ability to modify or acquire
- **Test Drives**: Scheduled appointments with cancellation
- **Allocations**: Confidential reservation records with director contact

### 5. **Test Drive Booking**
- Select vehicle from catalog
- Choose preferred facility (global showrooms)
- Pick date & time window
- Optional special requests
- Confirmation with booking ID

### 6. **Vehicle Comparison**
- Add up to 3 vehicles to compare
- Side-by-side specification table
- Performance metrics
- Quick action buttons to reserve/configure

### 7. **Global Showrooms**
Directory of private viewing suites with:
- Location details
- Contact information
- Available services
- Appointment booking links

---

## 🧪 Testing & Quality

```bash
# Run type checking
npm run type-check

# Build production version (validates everything)
npm run build

# Lint code
npm run lint
```

---

## 📖 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Supabase Docs](https://supabase.com/docs)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Use TypeScript for all new code
- Follow existing naming conventions
- Ensure zero console errors/warnings
- Test responsive behavior on mobile devices
- Add descriptive commit messages

---

## 📝 License

This project is proprietary. All rights reserved.

---

## 👨‍💻 Author

**Soham Devrukhkar**

- GitHub: [@SohamDevrukhkar](https://github.com/SohamDevrukhkar)
- Email: sohamdevrukhkar@gmail.com

---

## 📞 Support & Contact

For inquiries about THE COLLECTION platform:

- **Showroom Booking**: Contact via showrooms page
- **Technical Issues**: Open an issue on GitHub
- **Bespoke Concierge**: Contact team through contact page

---

## 🎯 Roadmap

- [ ] Advanced filtering with price range slider
- [ ] Real-time inventory synchronization
- [ ] Payment gateway integration
- [ ] VR showroom tours
- [ ] Mobile app (React Native)
- [ ] AI-powered vehicle recommendations
- [ ] Social features (sharing, collaboration)
- [ ] Multi-language support

---

**Built with ❤️ for automotive enthusiasts worldwide.**
