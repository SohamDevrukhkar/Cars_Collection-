import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Car, VehicleConfiguration, TestDriveRequest, PurchaseRequest } from '@/types';

interface CollectionStore {
  // Wishlist / Garage
  wishlist: string[];
  addToWishlist: (slug: string) => void;
  removeFromWishlist: (slug: string) => void;
  isInWishlist: (slug: string) => boolean;

  // Compare list
  compareList: string[];
  addToCompare: (slug: string) => void;
  removeFromCompare: (slug: string) => void;
  clearCompare: () => void;
  isInCompare: (slug: string) => boolean;

  // Saved configurations
  savedConfigurations: VehicleConfiguration[];
  saveConfiguration: (config: VehicleConfiguration) => void;
  deleteConfiguration: (id: string) => void;
  getConfiguration: (id: string) => VehicleConfiguration | undefined;

  // Test drive bookings
  testDriveBookings: TestDriveRequest[];
  addTestDriveBooking: (booking: TestDriveRequest) => void;
  cancelTestDriveBooking: (id: string) => void;

  // Purchase requests
  purchaseRequests: PurchaseRequest[];
  addPurchaseRequest: (request: PurchaseRequest) => void;
  updatePurchaseRequest: (id: string, updates: Partial<PurchaseRequest>) => void;

  // Recently viewed
  recentlyViewed: string[];
  addRecentlyViewed: (slug: string) => void;

  // Active user
  activeUserId: string | null;
  setActiveUserId: (id: string | null) => void;
}

export const useCollectionStore = create<CollectionStore>()(
  persist(
    (set, get) => ({
      // Wishlist
      wishlist: [],
      addToWishlist: (slug: string) =>
        set((state) => ({
          wishlist: [...new Set([...state.wishlist, slug])],
        })),
      removeFromWishlist: (slug: string) =>
        set((state) => ({
          wishlist: state.wishlist.filter((s) => s !== slug),
        })),
      isInWishlist: (slug: string) => get().wishlist.includes(slug),

      // Compare list
      compareList: [],
      addToCompare: (slug: string) =>
        set((state) => {
          if (state.compareList.length >= 3) return state;
          return {
            compareList: [...new Set([...state.compareList, slug])],
          };
        }),
      removeFromCompare: (slug: string) =>
        set((state) => ({
          compareList: state.compareList.filter((s) => s !== slug),
        })),
      clearCompare: () => set({ compareList: [] }),
      isInCompare: (slug: string) => get().compareList.includes(slug),

      // Saved configurations
      savedConfigurations: [],
      saveConfiguration: (config: VehicleConfiguration) =>
        set((state) => ({
          savedConfigurations: [
            ...state.savedConfigurations.filter((c) => c.id !== config.id),
            config,
          ],
        })),
      deleteConfiguration: (id: string) =>
        set((state) => ({
          savedConfigurations: state.savedConfigurations.filter((c) => c.id !== id),
        })),
      getConfiguration: (id: string) =>
        get().savedConfigurations.find((c) => c.id === id),

      // Test drive bookings
      testDriveBookings: [],
      addTestDriveBooking: (booking: TestDriveRequest) =>
        set((state) => ({
          testDriveBookings: [
            ...state.testDriveBookings.filter((b) => b.id !== booking.id),
            booking,
          ],
        })),
      cancelTestDriveBooking: (id: string) =>
        set((state) => ({
          testDriveBookings: state.testDriveBookings.filter((b) => b.id !== id),
        })),

      // Purchase requests
      purchaseRequests: [],
      addPurchaseRequest: (request: PurchaseRequest) =>
        set((state) => ({
          purchaseRequests: [...state.purchaseRequests, request],
        })),
      updatePurchaseRequest: (id: string, updates: Partial<PurchaseRequest>) =>
        set((state) => ({
          purchaseRequests: state.purchaseRequests.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      // Recently viewed
      recentlyViewed: [],
      addRecentlyViewed: (slug: string) =>
        set((state) => {
          const filtered = state.recentlyViewed.filter((s) => s !== slug);
          return {
            recentlyViewed: [slug, ...filtered].slice(0, 20),
          };
        }),

      // Active user
      activeUserId: null,
      setActiveUserId: (id: string | null) => set({ activeUserId: id }),
    }),
    {
      name: 'collection-store',
      version: 1,
    }
  )
);
