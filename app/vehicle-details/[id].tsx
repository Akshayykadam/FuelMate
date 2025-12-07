import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import Colors from '@/constants/colors';
import { useVehicleStore } from '@/store/vehicleStore';
import { useFuelEntryStore } from '@/store/fuelEntryStore';
import { useSettingsStore } from '@/store/settingsStore';
import Card from '@/components/Card';
import Button, { FuelButton } from '@/components/Button';
import FuelEntryCard from '@/components/FuelEntryCard';
import EmptyState from '@/components/EmptyState';
import { calculateFuelEfficiency, formatCurrency, formatDistance, formatVolume, getAverageFuelEfficiency } from '@/utils/calculations';
import { formatDate, sortByDate } from '@/utils/helpers';
import { 
  Car, 
  Droplet, 
  Edit2, 
  Info, 
  MoreVertical, 
  Trash2, 
  TrendingUp, 
  Wallet,
  Zap,
  BatteryCharging,
  Wind,
  Bike
} from 'lucide-react-native';

export default function VehicleDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { vehicles, getVehicleById, deleteVehicle } = useVehicleStore();
  const { entries, getEntriesByVehicleId, deleteEntry } = useFuelEntryStore();
  const { settings } = useSettingsStore();
  
  const [vehicle, setVehicle] = useState(getVehicleById(id));
  const [vehicleEntries, setVehicleEntries] = useState(getEntriesByVehicleId(id));
  
  useEffect(() => {
    setVehicle(getVehicleById(id));
    setVehicleEntries(sortByDate(getEntriesByVehicleId(id)));
  }, [id, vehicles, entries]);
  
  if (!vehicle) {
    router.replace('/vehicles' as any);
    return null;
  }
  
  const handleAddFuel = () => {
    router.push('/add-fuel' as any);
  };
  
  const handleViewFuelDetails = (entryId: string) => {
    router.push(`/fuel-details/${entryId}` as any);
  };
  
  const handleDeleteVehicle = () => {
    Alert.alert(
      'Delete Vehicle',
      `Are you sure you want to delete ${vehicle.name}? This will also delete all fuel entries for this vehicle.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            try {
              // Delete all fuel entries for this vehicle first
              vehicleEntries.forEach(entry => {
                deleteEntry(entry.id);
              });
              
              // Then delete the vehicle
              deleteVehicle(vehicle.id);
              
              // Navigate back to home screen
              router.replace('/');
            } catch (error) {
              console.error('Error deleting vehicle:', error);
              Alert.alert('Error', 'Failed to delete vehicle. Please try again.');
            }
          }
        },
      ]
    );
  };
  
  const averageEfficiency = getAverageFuelEfficiency(
    vehicleEntries,
    vehicle.id,
    settings.distanceUnit,
    settings.volumeUnit
  );
  
  const totalSpent = vehicleEntries.reduce((sum, entry) => sum + entry.totalCost, 0);
  const totalVolume = vehicleEntries.reduce((sum, entry) => sum + entry.amount, 0);
  
  const getVehicleTypeLabel = () => {
    switch (vehicle.type) {
      case 'petrol': return 'Petrol';
      case 'diesel': return 'Diesel';
      case 'electric': return 'Electric';
      case 'hybrid': return 'Hybrid';
      case 'cng': return 'CNG';
      case 'bike': return 'Bike';
      default: return 'Unknown';
    }
  };

  const getVehicleTypeIcon = () => {
    switch (vehicle.type) {
      case 'electric': 
        return <Zap size={20} color={Colors.dark.aqua} />;
      case 'hybrid':
        return <BatteryCharging size={20} color={Colors.dark.neonGreen} />;
      case 'cng':
        return <Wind size={20} color={Colors.dark.tint} />;
      case 'bike':
        return <Bike size={20} color={Colors.dark.hotPink} />;
      case 'diesel':
      case 'petrol':
      default:
        return <Droplet size={20} color={Colors.dark.tint} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: vehicle.name,
          headerRight: () => (
            <TouchableOpacity onPress={handleDeleteVehicle} style={styles.headerButton}>
              <Trash2 size={20} color={Colors.dark.danger} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.vehicleHeader}>
          {vehicle.image ? (
            <Image source={{ uri: vehicle.image }} style={styles.vehicleImage} />
          ) : (
            <View style={styles.vehicleImagePlaceholder}>
              {vehicle.type === 'bike' ? <Bike size={48} color={Colors.dark.text} /> : <Car size={48} color={Colors.dark.text} />}
            </View>
          )}
          
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleName}>{vehicle.name}</Text>
            <Text style={styles.vehicleDetails}>
              {vehicle.make} {vehicle.model} {vehicle.year}
            </Text>
            <View style={styles.vehicleTypeContainer}>
              {getVehicleTypeIcon()}
              <Text style={styles.vehicleType}>{getVehicleTypeLabel()}</Text>
            </View>
          </View>
        </View>
        
        <Card style={styles.detailsCard}>
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Initial Odometer</Text>
              <Text style={styles.detailValue}>
                {formatDistance(vehicle.initialOdometer, settings.distanceUnit)}
              </Text>
            </View>
            
            {vehicle.tankCapacity && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Tank Capacity</Text>
                <Text style={styles.detailValue}>
                  {formatVolume(vehicle.tankCapacity, settings.volumeUnit)}
                </Text>
              </View>
            )}
            
            {vehicle.batteryCapacity && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Battery Capacity</Text>
                <Text style={styles.detailValue}>
                  {vehicle.batteryCapacity} kWh
                </Text>
              </View>
            )}
          </View>
        </Card>
        
        <View style={styles.actionButtons}>
          <FuelButton 
            onPress={handleAddFuel}
            style={styles.actionButton}
          />
        </View>
        
        {vehicleEntries.length > 0 ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Statistics</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <View style={[styles.statIconContainer, { backgroundColor: 'rgba(38, 223, 208, 0.15)' }]}>
                    <TrendingUp size={24} color={Colors.dark.tint} />
                  </View>
                  <Text style={styles.statValue}>
                    {averageEfficiency ? `${averageEfficiency}` : 'N/A'}
                  </Text>
                  <Text style={styles.statLabel}>
                    Avg. {settings.distanceUnit}/{settings.volumeUnit}
                  </Text>
                </View>
                
                <View style={styles.statItem}>
                  <View style={[styles.statIconContainer, { backgroundColor: 'rgba(246, 42, 160, 0.15)' }]}>
                    <Wallet size={24} color={Colors.dark.hotPink} />
                  </View>
                  <Text style={styles.statValue}>
                    {formatCurrency(totalSpent, settings.currency)}
                  </Text>
                  <Text style={styles.statLabel}>Total Spent</Text>
                </View>
                
                <View style={styles.statItem}>
                  <View style={[styles.statIconContainer, { backgroundColor: 'rgba(38, 223, 208, 0.15)' }]}>
                    <Droplet size={24} color={Colors.dark.aqua} />
                  </View>
                  <Text style={styles.statValue}>
                    {formatVolume(totalVolume, settings.volumeUnit)}
                  </Text>
                  <Text style={styles.statLabel}>Total Volume</Text>
                </View>
                
                <View style={styles.statItem}>
                  <View style={[styles.statIconContainer, { backgroundColor: 'rgba(184, 238, 48, 0.15)' }]}>
                    <Info size={24} color={Colors.dark.neonGreen} />
                  </View>
                  <Text style={styles.statValue}>
                    {vehicleEntries.length}
                  </Text>
                  <Text style={styles.statLabel}>Entries</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fuel History</Text>
              {vehicleEntries.map(entry => (
                <FuelEntryCard
                  key={entry.id}
                  entry={entry}
                  onPress={() => handleViewFuelDetails(entry.id)}
                />
              ))}
            </View>
          </>
        ) : (
          <EmptyState
            icon={<Droplet size={48} color={Colors.dark.tint} />}
            title="No Fuel Entries Yet"
            message="Add your first fuel entry to start tracking consumption and expenses."
            actionLabel="Add Fuel Entry"
            onAction={handleAddFuel}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  headerButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
  },
  vehicleHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  vehicleImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 16,
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  vehicleImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: Colors.dark.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  vehicleInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  vehicleName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    marginBottom: 8,
  },
  vehicleTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleType: {
    fontSize: 14,
    color: Colors.dark.tint,
    fontWeight: '600',
    marginLeft: 4,
  },
  detailsCard: {
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    width: '50%',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statItem: {
    width: '48%',
    backgroundColor: Colors.dark.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(38, 223, 208, 0.3)', // Gold border with transparency
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
});