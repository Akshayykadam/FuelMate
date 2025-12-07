import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { useFuelEntryStore } from '@/store/fuelEntryStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { useSettingsStore } from '@/store/settingsStore';
import FuelEntryCard from '@/components/FuelEntryCard';
import Button, { FuelButton } from '@/components/Button';
import EmptyState from '@/components/EmptyState';
import Card from '@/components/Card';
import { formatCurrency } from '@/utils/calculations';
import { formatDate, sortByDate } from '@/utils/helpers';
import { Droplet, Filter, Car } from 'lucide-react-native';

export default function ExpensesScreen() {
  const { entries } = useFuelEntryStore();
  const { vehicles, selectedVehicleId } = useVehicleStore();
  const { settings } = useSettingsStore();
  const [filterVehicleId, setFilterVehicleId] = useState<string | null>(null);
  const [showNoVehicleModal, setShowNoVehicleModal] = useState(false);

  const handleAddFuel = () => {
    if (vehicles.length === 0) {
      setShowNoVehicleModal(true);
      return;
    }
    router.push('/add-fuel' as any);
  };

  const handleAddVehicle = () => {
    setShowNoVehicleModal(false);
    router.push('/add-vehicle' as any);
  };

  const handleViewFuelDetails = (id: string) => {
    router.push(`/fuel-details/${id}` as any);
  };

  const filteredEntries = filterVehicleId
    ? entries.filter(entry => entry.vehicleId === filterVehicleId)
    : entries;

  const sortedEntries = sortByDate(filteredEntries);

  const totalSpent = filteredEntries.reduce((sum, entry) => sum + entry.totalCost, 0);

  // Modal component for no vehicle warning
  const NoVehicleModal = () => (
    <Modal
      visible={showNoVehicleModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowNoVehicleModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalIconContainer}>
            <Car size={48} color={Colors.dark.tint} />
          </View>
          <Text style={styles.modalTitle}>No Vehicle Added</Text>
          <Text style={styles.modalMessage}>
            You need to add a vehicle first before you can log fuel entries.
          </Text>
          <View style={styles.modalButtons}>
            <Button
              title="Cancel"
              onPress={() => setShowNoVehicleModal(false)}
              variant="outline"
              style={styles.modalButton}
            />
            <Button
              title="Add Vehicle"
              onPress={handleAddVehicle}
              style={styles.modalButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  if (entries.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <EmptyState
          icon={<Droplet size={64} color={Colors.dark.tint} />}
          title="No Fuel Entries Yet"
          message="Add your first fuel entry to start tracking your expenses."
          actionLabel="Add Fuel Entry"
          onAction={handleAddFuel}
        />
        <NoVehicleModal />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Fuel Expenses</Text>
        <FuelButton onPress={handleAddFuel} />
      </View>

      <Card style={styles.summaryCard}>
        <View style={styles.summaryContent}>
          <View>
            <Text style={styles.summaryLabel}>Total Spent</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(totalSpent, settings.currency)}
            </Text>
          </View>
          <View>
            <Text style={styles.summaryLabel}>Entries</Text>
            <Text style={styles.summaryValue}>{filteredEntries.length}</Text>
          </View>
        </View>
      </Card>

      {vehicles.length > 1 && (
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filter by vehicle:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterVehicleId === null && styles.filterButtonActive
              ]}
              onPress={() => setFilterVehicleId(null)}
            >
              <Text style={[
                styles.filterButtonText,
                filterVehicleId === null && styles.filterButtonTextActive
              ]}>All</Text>
            </TouchableOpacity>

            {vehicles.map(vehicle => (
              <TouchableOpacity
                key={vehicle.id}
                style={[
                  styles.filterButton,
                  filterVehicleId === vehicle.id && styles.filterButtonActive
                ]}
                onPress={() => setFilterVehicleId(vehicle.id)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filterVehicleId === vehicle.id && styles.filterButtonTextActive
                ]}>{vehicle.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <FlatList
        data={sortedEntries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FuelEntryCard
            entry={item}
            onPress={() => handleViewFuelDetails(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyFilterContainer}>
            <Text style={styles.emptyFilterText}>No entries match your filter</Text>
            <Button
              title="Clear Filter"
              onPress={() => setFilterVehicleId(null)}
              variant="outline"
              size="small"
              style={styles.clearFilterButton}
            />
          </View>
        }
      />
      <NoVehicleModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 8,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.dark.cardAlt,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: Colors.dark.tint,
  },
  filterButtonText: {
    color: Colors.dark.text,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
  },
  emptyFilterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyFilterText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    marginBottom: 16,
  },
  clearFilterButton: {
    minWidth: 120,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.dark.cardAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
  },
});