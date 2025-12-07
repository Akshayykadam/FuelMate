import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FuelEntry } from '@/types';
import { generateId } from '@/utils/helpers';

interface FuelEntryState {
  entries: FuelEntry[];
  addEntry: (entry: Omit<FuelEntry, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateEntry: (id: string, updates: Partial<Omit<FuelEntry, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteEntry: (id: string) => void;
  getEntriesByVehicleId: (vehicleId: string) => FuelEntry[];
  getEntryById: (id: string) => FuelEntry | undefined;
  getLatestEntryByVehicleId: (vehicleId: string) => FuelEntry | undefined;
  getPreviousEntryByVehicleId: (vehicleId: string, currentEntryId: string) => FuelEntry | undefined;
}

export const useFuelEntryStore = create<FuelEntryState>()(
  persist(
    (set, get) => ({
      entries: [],
      
      addEntry: (entryData) => {
        const id = generateId();
        const timestamp = Date.now();
        
        const newEntry: FuelEntry = {
          id,
          ...entryData,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        
        set((state) => ({
          entries: [...state.entries, newEntry],
        }));
        
        return id;
      },
      
      updateEntry: (id, updates) => {
        set((state) => ({
          entries: state.entries.map((entry) => 
            entry.id === id
              ? { ...entry, ...updates, updatedAt: Date.now() }
              : entry
          ),
        }));
      },
      
      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
      },
      
      getEntriesByVehicleId: (vehicleId) => {
        return get().entries.filter((entry) => entry.vehicleId === vehicleId);
      },
      
      getEntryById: (id) => {
        return get().entries.find((entry) => entry.id === id);
      },
      
      getLatestEntryByVehicleId: (vehicleId) => {
        const vehicleEntries = get().entries.filter((entry) => entry.vehicleId === vehicleId);
        if (vehicleEntries.length === 0) return undefined;
        
        return vehicleEntries.sort((a, b) => b.date - a.date)[0];
      },
      
      getPreviousEntryByVehicleId: (vehicleId, currentEntryId) => {
        const vehicleEntries = get().entries.filter((entry) => entry.vehicleId === vehicleId);
        if (vehicleEntries.length <= 1) return undefined;
        
        // Sort entries by date
        const sortedEntries = vehicleEntries.sort((a, b) => b.date - a.date);
        
        // Find the index of the current entry
        const currentIndex = sortedEntries.findIndex((entry) => entry.id === currentEntryId);
        if (currentIndex === -1 || currentIndex === sortedEntries.length - 1) return undefined;
        
        return sortedEntries[currentIndex + 1];
      },
    }),
    {
      name: 'fuelmate-entries',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);