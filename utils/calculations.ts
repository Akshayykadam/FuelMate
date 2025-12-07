import { DistanceUnit, FuelEntry, Vehicle, VolumeUnit, MonthlyStats } from "@/types";

export const calculateFuelEfficiency = (
  currentEntry: FuelEntry,
  previousEntry: FuelEntry | null,
  distanceUnit: DistanceUnit,
  volumeUnit: VolumeUnit
): number | null => {
  if (!previousEntry || !currentEntry.isFull || !previousEntry.isFull) {
    return null;
  }

  const distance = currentEntry.odometer - previousEntry.odometer;
  const volume = currentEntry.amount;

  if (distance <= 0 || volume <= 0) {
    return null;
  }

  // Calculate efficiency in km/l or mi/gal
  let efficiency = distance / volume;

  // Convert if needed
  if (distanceUnit === 'km' && volumeUnit === 'gal') {
    // Convert km/gal to km/l
    efficiency = efficiency * 3.78541;
  } else if (distanceUnit === 'mi' && volumeUnit === 'l') {
    // Convert mi/l to mi/gal
    efficiency = efficiency / 3.78541;
  }

  return parseFloat(efficiency.toFixed(2));
};

export const calculateCostPerDistance = (
  currentEntry: FuelEntry,
  previousEntry: FuelEntry | null,
  distanceUnit: DistanceUnit
): number | null => {
  if (!previousEntry || !currentEntry.isFull || !previousEntry.isFull) {
    return null;
  }

  const distance = currentEntry.odometer - previousEntry.odometer;
  const cost = currentEntry.totalCost;

  if (distance <= 0) {
    return null;
  }

  // Calculate cost per distance unit (km or mi)
  const costPerDistance = cost / distance;

  return parseFloat(costPerDistance.toFixed(2));
};

export const formatCurrency = (amount: number, currency: string): string => {
  const formatter = new Intl.NumberFormat(getCurrencyLocale(currency), {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
};

export const getCurrencyLocale = (currency: string): string => {
  const localeMap: Record<string, string> = {
    'INR': 'en-IN',
    'USD': 'en-US',
    'EUR': 'de-DE',
    'GBP': 'en-GB',
    'JPY': 'ja-JP',
    'CAD': 'en-CA',
    'AUD': 'en-AU',
  };

  return localeMap[currency] || 'en-US';
};

export const getCurrencySymbol = (currency: string): string => {
  const symbolMap: Record<string, string> = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CAD': 'C$',
    'AUD': 'A$',
  };

  return symbolMap[currency] || currency;
};

export const formatDistance = (distance: number, unit: DistanceUnit): string => {
  return `${distance.toLocaleString()} ${unit}`;
};

export const formatVolume = (volume: number, unit: VolumeUnit): string => {
  return `${volume.toLocaleString()} ${unit}`;
};

export const convertDistance = (value: number, fromUnit: DistanceUnit, toUnit: DistanceUnit): number => {
  if (fromUnit === toUnit) return value;

  if (fromUnit === 'km' && toUnit === 'mi') {
    return value * 0.621371;
  } else {
    return value * 1.60934;
  }
};

export const convertVolume = (value: number, fromUnit: VolumeUnit, toUnit: VolumeUnit): number => {
  if (fromUnit === toUnit) return value;

  if (fromUnit === 'l' && toUnit === 'gal') {
    return value * 0.264172;
  } else {
    return value * 3.78541;
  }
};

export const getLastFuelEntry = (entries: FuelEntry[], vehicleId: string): FuelEntry | null => {
  if (!entries.length) return null;

  const vehicleEntries = entries.filter(entry => entry.vehicleId === vehicleId);
  if (!vehicleEntries.length) return null;

  return vehicleEntries.sort((a, b) => b.date - a.date)[0];
};

export const getAverageFuelEfficiency = (
  entries: FuelEntry[],
  vehicleId: string,
  distanceUnit: DistanceUnit,
  volumeUnit: VolumeUnit
): number | null => {
  if (!entries.length) return null;

  const vehicleEntries = entries.filter(entry => entry.vehicleId === vehicleId && entry.isFull);
  if (vehicleEntries.length < 2) return null;

  // Sort entries by date
  const sortedEntries = vehicleEntries.sort((a, b) => a.date - b.date);

  let totalDistance = 0;
  let totalVolume = 0;

  for (let i = 1; i < sortedEntries.length; i++) {
    const currentEntry = sortedEntries[i];
    const previousEntry = sortedEntries[i - 1];

    const distance = currentEntry.odometer - previousEntry.odometer;
    if (distance > 0) {
      totalDistance += distance;
      totalVolume += currentEntry.amount;
    }
  }

  if (totalDistance === 0 || totalVolume === 0) return null;

  // Calculate efficiency in km/l or mi/gal
  let efficiency = totalDistance / totalVolume;

  // Convert if needed
  if (distanceUnit === 'km' && volumeUnit === 'gal') {
    // Convert km/gal to km/l
    efficiency = efficiency * 3.78541;
  } else if (distanceUnit === 'mi' && volumeUnit === 'l') {
    // Convert mi/l to mi/gal
    efficiency = efficiency / 3.78541;
  }

  return parseFloat(efficiency.toFixed(2));
};

export const calculateMonthlyStats = (
  entries: FuelEntry[],
  distanceUnit: DistanceUnit,
  volumeUnit: VolumeUnit
): MonthlyStats[] => {
  if (!entries.length) return [];

  // Sort entries by date (descending)
  const sortedEntries = [...entries].sort((a, b) => b.date - a.date);

  // Group by month
  const monthlyGroups: Record<string, FuelEntry[]> = {};

  sortedEntries.forEach(entry => {
    const date = new Date(entry.date);
    const monthKey = `${date.getMonth()}-${date.getFullYear()}`;
    if (!monthlyGroups[monthKey]) {
      monthlyGroups[monthKey] = [];
    }
    monthlyGroups[monthKey].push(entry);
  });

  const stats: MonthlyStats[] = [];

  Object.keys(monthlyGroups).forEach(key => {
    const monthEntries = monthlyGroups[key];
    const [monthIndex, year] = key.split('-').map(Number);
    const date = new Date(year, monthIndex);
    const monthName = date.toLocaleString('default', { month: 'long' });

    let totalCost = 0;
    let totalFuel = 0;
    let totalDistance = 0;

    monthEntries.forEach(entry => {
      totalCost += entry.totalCost;
      totalFuel += entry.amount;

      // Find previous entry in the full sorted list to calculate distance
      const entryIndex = sortedEntries.findIndex(e => e.id === entry.id);
      if (entryIndex < sortedEntries.length - 1) {
        const prevEntry = sortedEntries[entryIndex + 1];
        if (prevEntry.vehicleId === entry.vehicleId) { // Ensure same vehicle
          const dist = entry.odometer - prevEntry.odometer;
          if (dist > 0) {
            totalDistance += dist;
          }
        }
      }
    });

    let efficiency: number | null = null;
    if (totalDistance > 0 && totalFuel > 0) {
      efficiency = totalDistance / totalFuel;

      // Convert if needed
      if (distanceUnit === 'km' && volumeUnit === 'gal') {
        efficiency = efficiency * 3.78541;
      } else if (distanceUnit === 'mi' && volumeUnit === 'l') {
        efficiency = efficiency / 3.78541;
      }
      efficiency = parseFloat(efficiency.toFixed(2));
    }

    let costPerDistance: number | null = null;
    if (totalDistance > 0) {
      costPerDistance = totalCost / totalDistance;
      costPerDistance = parseFloat(costPerDistance.toFixed(2));
    }

    stats.push({
      month: monthName,
      year,
      totalCost,
      totalFuel,
      totalDistance,
      efficiency,
      costPerDistance,
      timestamp: date.getTime()
    });
  });

  // Sort by date descending
  return stats.sort((a, b) => b.timestamp - a.timestamp);
};