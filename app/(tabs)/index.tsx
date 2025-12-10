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

  // Derive latest and previous entry directly from the reactive entries array
  const vehicleEntries = selectedVehicle
    ? entries.filter(e => e.vehicleId === selectedVehicle.id).sort((a, b) => b.date - a.date)
    : [];

  const latestEntry = vehicleEntries.length > 0 ? vehicleEntries[0] : null;
  const previousEntry = vehicleEntries.length > 1 ? vehicleEntries[1] : null;

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
    router.push('/map' as any);
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
    <SafeAreaView style={styles.container} edges={['top']}>
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
            {/* Vehicle Tabs Row */}
            <View style={styles.vehicleTabsRow}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.vehicleTabs}
                contentContainerStyle={styles.vehicleTabsContent}
              >
                {vehicles.map((vehicle) => (
                  <TouchableOpacity
                    key={vehicle.id}
                    style={[
                      styles.vehicleTab,
                      vehicle.id === selectedVehicleId && styles.vehicleTabActive,
                    ]}
                    onPress={() => selectVehicle(vehicle.id)}
                  >
                    <Text
                      style={[
                        styles.vehicleTabText,
                        vehicle.id === selectedVehicleId && styles.vehicleTabTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {vehicle.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.addVehicleIconButton}
                onPress={handleAddVehicle}
              >
                <Plus size={20} color={Colors.dark.text} />
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
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Fuel Statistics</Text>
              <TouchableOpacity
                style={styles.viewReportButton}
                onPress={() => router.push('/monthly-stats' as any)}
              >
                <Text style={styles.viewReportText}>View Report</Text>
                <TrendingUp size={14} color={Colors.dark.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.statsCard}>
              <View style={styles.statsCardRow}>
                <View style={styles.statItem}>
                  <View style={styles.statHeader}>
                    <TrendingUp size={16} color={Colors.dark.success} />
                    <Text style={styles.statItemLabel}>Efficiency</Text>
                  </View>
                  <Text style={styles.statItemValue}>
                    {efficiency ? `${efficiency}` : 'N/A'}
                    <Text style={styles.statItemUnit}>
                      {efficiency ? ` ${settings.distanceUnit}/${settings.volumeUnit}` : ''}
                    </Text>
                  </Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <View style={styles.statHeader}>
                    <Wallet size={16} color={Colors.dark.warning} />
                    <Text style={styles.statItemLabel}>Last Price</Text>
                  </View>
                  <Text style={styles.statItemValue}>
                    {formatCurrency(latestEntry.price, settings.currency)}
                  </Text>
                </View>
              </View>

              <View style={styles.statsCardDividerHorizontal} />

              <View style={styles.statsCardRow}>
                <View style={styles.statItem}>
                  <View style={styles.statHeader}>
                    <Droplet size={16} color={Colors.dark.info} />
                    <Text style={styles.statItemLabel}>Last Amount</Text>
                  </View>
                  <Text style={styles.statItemValue}>
                    {formatVolume(latestEntry.amount, settings.volumeUnit)}
                  </Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <View style={styles.statHeader}>
                    <Car size={16} color={Colors.dark.textSecondary} />
                    <Text style={styles.statItemLabel}>Odometer</Text>
                  </View>
                  <Text style={styles.statItemValue}>
                    {formatDistance(latestEntry.odometer, settings.distanceUnit)}
                  </Text>
                </View>
              </View>
            </View>
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
    paddingTop: 16,
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
    width: 46,
    height: 46,
    borderRadius: 23,
    overflow: 'hidden',
    borderWidth: 2,
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
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(250, 250, 250, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: 'rgba(250, 250, 250, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
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
    borderRadius: 16,
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statTile: {
    width: '48%',
    backgroundColor: Colors.dark.cardAlt,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
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
  // New stats card styles
  viewReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewReportText: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
  },
  statsCardRow: {
    flexDirection: 'row',
  },
  statsCardDividerHorizontal: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginVertical: 14,
  },
  statItem: {
    flex: 1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  statItemLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    fontWeight: '500',
  },
  statItemValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  statItemUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.dark.border,
    marginHorizontal: 16,
  },
  vehicleTabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleTabs: {
    flex: 1,
    marginHorizontal: -4,
  },
  vehicleTabsContent: {
    paddingHorizontal: 4,
  },
  addVehicleIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.dark.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  vehicleTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.dark.cardAlt,
    marginRight: 8,
  },
  vehicleTabActive: {
    backgroundColor: Colors.dark.text,
  },
  vehicleTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
  },
  vehicleTabTextActive: {
    color: Colors.dark.background,
    fontWeight: '600',
  },
});