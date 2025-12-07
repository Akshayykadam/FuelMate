import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, Image, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { useVehicleStore } from '@/store/vehicleStore';
import { useFuelEntryStore } from '@/store/fuelEntryStore';
import { useSettingsStore } from '@/store/settingsStore';
import Card from '@/components/Card';
import Button, { AddButton, FuelButton } from '@/components/Button';
import EmptyState from '@/components/EmptyState';
import StatsCard from '@/components/StatsCard';
import VehicleCard from '@/components/VehicleCard';
import FuelEntryCard from '@/components/FuelEntryCard';
import { calculateFuelEfficiency, formatCurrency, formatDistance, formatVolume } from '@/utils/calculations';
import { formatDate } from '@/utils/helpers';
import { Car, Droplet, TrendingUp, Wallet, Plus, MapPin } from 'lucide-react-native';

export default function HomeScreen() {
  const { vehicles, selectedVehicleId, selectVehicle } = useVehicleStore();
  const { entries, getLatestEntryByVehicleId, getPreviousEntryByVehicleId } = useFuelEntryStore();
  const { settings } = useSettingsStore();

  // Check if we need to show onboarding
  useEffect(() => {
    if (vehicles.length === 0) {
      // router.replace('/onboarding');
    }
  }, [vehicles]);

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || null;
  const latestEntry = selectedVehicle ? getLatestEntryByVehicleId(selectedVehicle.id) : null;
  const previousEntry = latestEntry ? getPreviousEntryByVehicleId(selectedVehicle?.id || '', latestEntry.id) : null;

  const efficiency = latestEntry && previousEntry
    ? calculateFuelEfficiency(latestEntry, previousEntry, settings.distanceUnit, settings.volumeUnit)
    : null;

  const handleAddVehicle = () => {
    router.push('/add-vehicle' as any);
  };

  const handleAddFuel = () => {
    router.push('/add-fuel' as any);
  };

  const handleViewVehicleDetails = (id: string) => {
    router.push(`/vehicle-details/${id}` as any);
  };

  const handleViewFuelDetails = (id: string) => {
    router.push(`/fuel-details/${id}` as any);
  };

  const handleOpenMaps = () => {
    const searchQuery = 'petrol pump near me';
    const encodedQuery = encodeURIComponent(searchQuery);

    // Different URL schemes for iOS and Android
    const url = Platform.select({
      ios: `maps:?q=${encodedQuery}`,
      android: `geo:0,0?q=${encodedQuery}`,
      default: `https://www.google.com/maps/search/${encodedQuery}`,
    });

    Linking.canOpenURL(url!)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url!);
        } else {
          // Fallback to Google Maps web
          Linking.openURL(`https://www.google.com/maps/search/${encodedQuery}`);
        }
      })
      .catch((err) => {
        console.error('Error opening maps:', err);
        Alert.alert('Error', 'Could not open maps app');
      });
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (vehicles.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <EmptyState
          icon={<Car size={64} color={Colors.dark.tint} />}
          title="No Vehicles Yet"
          message="Add your first vehicle (car or bike) to start tracking fuel consumption and expenses."
          actionLabel="Add Vehicle"
          onAction={handleAddVehicle}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={handleOpenMaps}
                style={styles.mapButton}
              >
                <MapPin size={22} color={Colors.dark.tint} />
              </TouchableOpacity>

              {settings.userImage && (
                <TouchableOpacity
                  onPress={() => router.push('/settings' as any)}
                  style={styles.profileImageContainer}
                >
                  <Image
                    source={{ uri: settings.userImage }}
                    style={styles.profileImage}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {selectedVehicle && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Current Vehicle</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddVehicle}
              >
                <Plus size={18} color={Colors.dark.tint} />
                <Text style={styles.addButtonText}>Add New</Text>
              </TouchableOpacity>
            </View>
            <VehicleCard
              vehicle={selectedVehicle}
              onPress={() => handleViewVehicleDetails(selectedVehicle.id)}
              selected
            />

            <View style={styles.actionButtons}>
              <FuelButton
                onPress={handleAddFuel}
                style={styles.actionButton}
              />
            </View>
          </View>
        )}

        {latestEntry && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Latest Fuel Entry</Text>
            <FuelEntryCard
              entry={latestEntry}
              onPress={() => handleViewFuelDetails(latestEntry.id)}
            />
          </View>
        )}

        {selectedVehicle && latestEntry && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fuel Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statsRow}>
                <View style={styles.statTile}>
                  <View style={[styles.statIconContainer, { backgroundColor: 'rgba(38, 223, 208, 0.15)' }]}>
                    <TrendingUp size={24} color={Colors.dark.tint} />
                  </View>
                  <Text style={styles.statValue}>
                    {efficiency ? `${efficiency}` : 'N/A'}
                  </Text>
                  <Text style={styles.statLabel}>
                    {efficiency ? `${settings.distanceUnit}/${settings.volumeUnit}` : 'Efficiency'}
                  </Text>
                </View>

                <View style={styles.statTile}>
                  <View style={[styles.statIconContainer, { backgroundColor: 'rgba(246, 42, 160, 0.15)' }]}>
                    <Wallet size={24} color={Colors.dark.hotPink} />
                  </View>
                  <Text style={styles.statValue}>
                    {formatCurrency(latestEntry.price, settings.currency)}
                  </Text>
                  <Text style={styles.statLabel}>Last Price</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statTile}>
                  <View style={[styles.statIconContainer, { backgroundColor: 'rgba(38, 223, 208, 0.15)' }]}>
                    <Droplet size={24} color={Colors.dark.aqua} />
                  </View>
                  <Text style={styles.statValue}>
                    {formatVolume(latestEntry.amount, settings.volumeUnit)}
                  </Text>
                  <Text style={styles.statLabel}>Last Amount</Text>
                </View>

                <View style={styles.statTile}>
                  <View style={[styles.statIconContainer, { backgroundColor: 'rgba(184, 238, 48, 0.15)' }]}>
                    <Car size={24} color={Colors.dark.neonGreen} />
                  </View>
                  <Text style={styles.statValue}>
                    {formatDistance(latestEntry.odometer, settings.distanceUnit)}
                  </Text>
                  <Text style={styles.statLabel}>Odometer</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {vehicles.length > 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Vehicles</Text>
            {vehicles.map(vehicle => (
              vehicle.id !== selectedVehicleId && (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onPress={() => {
                    selectVehicle(vehicle.id);
                    handleViewVehicleDetails(vehicle.id);
                  }}
                />
              )
            ))}
            <Button
              title="Add New Vehicle"
              onPress={handleAddVehicle}
              variant="outline"
              icon={<Plus size={18} color={Colors.dark.tint} />}
              style={styles.addVehicleButton}
            />
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
  },
  headerContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 26,
    color: Colors.dark.text,
    fontWeight: '700',
    marginBottom: 0,
  },
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: Colors.dark.tint,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mapButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(38, 223, 208, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.tint,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(38, 223, 208, 0.15)', // Gold with transparency
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: Colors.dark.tint,
    fontWeight: '600',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    marginRight: 8,
  },
  addVehicleButton: {
    marginTop: 8,
  },
  statsGrid: {
    backgroundColor: Colors.dark.card,
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statTile: {
    width: '48%',
    backgroundColor: Colors.dark.cardAlt,
    borderRadius: 20,
    padding: 16,
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
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
});