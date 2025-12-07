import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { useVehicleStore } from '@/store/vehicleStore';
import VehicleCard from '@/components/VehicleCard';
import Button, { AddButton } from '@/components/Button';
import EmptyState from '@/components/EmptyState';
import { Car, Plus } from 'lucide-react-native';

export default function VehiclesScreen() {
  const { vehicles, selectedVehicleId, selectVehicle } = useVehicleStore();

  const handleAddVehicle = () => {
    router.push('/add-vehicle' as any);
  };

  const handleVehiclePress = (id: string) => {
    selectVehicle(id);
    router.push(`/vehicle-details/${id}` as any);
  };

  if (vehicles.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <EmptyState
          icon={<Car size={64} color={Colors.dark.tint} />}
          title="No Vehicles Yet"
          message="Add your first vehicle to start tracking fuel consumption and expenses."
          actionLabel="Add Vehicle"
          onAction={handleAddVehicle}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Vehicles</Text>
        <AddButton onPress={handleAddVehicle} />
      </View>

      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VehicleCard
            vehicle={item}
            onPress={() => handleVehiclePress(item.id)}
            selected={item.id === selectedVehicleId}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});