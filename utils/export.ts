import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { FuelEntry, Vehicle, Settings } from '@/types';
import { formatDate } from './helpers';

interface ExportData {
    vehicles: Vehicle[];
    entries: FuelEntry[];
    settings: Settings;
}

/**
 * Convert fuel entries to CSV format
 */
export const entriesToCSV = (entries: FuelEntry[], vehicles: Vehicle[]): string => {
    const headers = [
        'Date',
        'Vehicle',
        'Fuel Type',
        'Amount (L/gal)',
        'Price per Unit',
        'Total Cost',
        'Odometer',
        'Full Tank',
        'Notes',
    ];

    const rows = entries.map(entry => {
        const vehicle = vehicles.find(v => v.id === entry.vehicleId);
        return [
            formatDate(entry.date),
            vehicle?.name || 'Unknown',
            entry.fuelType || 'regular',
            entry.amount.toFixed(2),
            entry.price.toFixed(2),
            entry.totalCost.toFixed(2),
            entry.odometer.toString(),
            entry.isFull ? 'Yes' : 'No',
            entry.notes || '',
        ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
};

/**
 * Convert vehicles to CSV format
 */
export const vehiclesToCSV = (vehicles: Vehicle[]): string => {
    const headers = [
        'Name',
        'Make',
        'Model',
        'Year',
        'Type',
        'Vehicle Class',
        'Initial Odometer',
        'Tank Capacity',
    ];

    const rows = vehicles.map(vehicle => [
        vehicle.name,
        vehicle.make,
        vehicle.model,
        vehicle.year.toString(),
        vehicle.type,
        vehicle.vehicleClass || '',
        vehicle.initialOdometer.toString(),
        vehicle.tankCapacity?.toString() || '',
    ].join(','));

    return [headers.join(','), ...rows].join('\n');
};

/**
 * Export data as CSV file and share
 */
export const exportAsCSV = async (
    entries: FuelEntry[],
    vehicles: Vehicle[],
    type: 'entries' | 'vehicles' | 'all'
): Promise<boolean> => {
    try {
        let csvContent = '';
        let fileName = '';
        const timestamp = new Date().toISOString().split('T')[0];

        if (type === 'entries') {
            csvContent = entriesToCSV(entries, vehicles);
            fileName = `fuelmate_entries_${timestamp}.csv`;
        } else if (type === 'vehicles') {
            csvContent = vehiclesToCSV(vehicles);
            fileName = `fuelmate_vehicles_${timestamp}.csv`;
        } else {
            // Export all data
            const entriesCSV = entriesToCSV(entries, vehicles);
            const vehiclesCSV = vehiclesToCSV(vehicles);
            csvContent = `=== FUEL ENTRIES ===\n${entriesCSV}\n\n=== VEHICLES ===\n${vehiclesCSV}`;
            fileName = `fuelmate_export_${timestamp}.csv`;
        }

        const filePath = `${FileSystem.cacheDirectory}${fileName}`;

        await FileSystem.writeAsStringAsync(filePath, csvContent);

        // Check if sharing is available
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
            await Sharing.shareAsync(filePath, {
                mimeType: 'text/csv',
                dialogTitle: 'Export FuelMate Data',
                UTI: 'public.comma-separated-values-text',
            });
            return true;
        } else {
            console.log('Sharing is not available on this device');
            return false;
        }
    } catch (error) {
        console.error('Error exporting data:', error);
        return false;
    }
};

/**
 * Export data as JSON file and share
 */
export const exportAsJSON = async (
    entries: FuelEntry[],
    vehicles: Vehicle[],
    settings: Settings
): Promise<boolean> => {
    try {
        const timestamp = new Date().toISOString().split('T')[0];
        const fileName = `fuelmate_backup_${timestamp}.json`;

        const exportData: ExportData = {
            vehicles,
            entries,
            settings,
        };

        const jsonContent = JSON.stringify(exportData, null, 2);
        const filePath = `${FileSystem.cacheDirectory}${fileName}`;

        await FileSystem.writeAsStringAsync(filePath, jsonContent);

        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
            await Sharing.shareAsync(filePath, {
                mimeType: 'application/json',
                dialogTitle: 'Export FuelMate Backup',
                UTI: 'public.json',
            });
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error exporting data:', error);
        return false;
    }
};
