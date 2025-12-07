import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import Colors from '@/constants/colors';
import { useFuelEntryStore } from '@/store/fuelEntryStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { useSettingsStore } from '@/store/settingsStore';
import { calculateMonthlyStats, formatCurrency, formatDistance, formatVolume } from '@/utils/calculations';
import { ArrowLeft, Calendar, TrendingUp, Droplet, Wallet } from 'lucide-react-native';
import EmptyState from '@/components/EmptyState';

export default function MonthlyStatsScreen() {
    const { entries } = useFuelEntryStore();
    const { selectedVehicleId, vehicles } = useVehicleStore();
    const { settings } = useSettingsStore();

    const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

    const monthlyStats = useMemo(() => {
        if (!selectedVehicleId) return [];

        // Filter entries for selected vehicle
        const vehicleEntries = entries.filter(e => e.vehicleId === selectedVehicleId);

        return calculateMonthlyStats(
            vehicleEntries,
            settings.distanceUnit,
            settings.volumeUnit
        );
    }, [entries, selectedVehicleId, settings.distanceUnit, settings.volumeUnit]);

    if (!selectedVehicle) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color={Colors.dark.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Monthly Report</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.centerContent}>
                    <Text style={styles.emptyText}>No vehicle selected</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={Colors.dark.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Monthly Report</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleName}>{selectedVehicle.name}</Text>
                    <Text style={styles.vehicleDetail}>{selectedVehicle.make} {selectedVehicle.model}</Text>
                </View>

                {monthlyStats.length === 0 ? (
                    <EmptyState
                        icon={<Calendar size={64} color={Colors.dark.tint} />}
                        title="No Data Available"
                        message="Add fuel entries to generate monthly reports."
                        actionLabel="Add Fuel"
                        onAction={() => router.replace('/add-fuel')}
                    />
                ) : (
                    <View style={styles.statsList}>
                        {monthlyStats.map((stat, index) => (
                            <View key={`${stat.month}-${stat.year}`} style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.monthTitle}>{stat.month} {stat.year}</Text>
                                    <View style={styles.costBadge}>
                                        <Text style={styles.costText}>{formatCurrency(stat.totalCost, settings.currency)}</Text>
                                    </View>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.statsRow}>
                                    <View style={styles.statItem}>
                                        <View style={[styles.iconBox, { backgroundColor: 'rgba(38, 223, 208, 0.15)' }]}>
                                            <TrendingUp size={16} color={Colors.dark.tint} />
                                        </View>
                                        <View>
                                            <Text style={styles.statValue}>
                                                {stat.efficiency ? `${stat.efficiency}` : '-'}
                                            </Text>
                                            <Text style={styles.statLabel}>
                                                {settings.distanceUnit}/{settings.volumeUnit}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.statItem}>
                                        <View style={[styles.iconBox, { backgroundColor: 'rgba(246, 42, 160, 0.15)' }]}>
                                            <Wallet size={16} color={Colors.dark.hotPink} />
                                        </View>
                                        <View>
                                            <Text style={styles.statValue}>
                                                {stat.costPerDistance ? formatCurrency(stat.costPerDistance, settings.currency) : '-'}
                                            </Text>
                                            <Text style={styles.statLabel}>
                                                / {settings.distanceUnit}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={[styles.statsRow, { marginTop: 12 }]}>
                                    <View style={styles.statItem}>
                                        <View style={[styles.iconBox, { backgroundColor: 'rgba(38, 223, 208, 0.15)' }]}>
                                            <Droplet size={16} color={Colors.dark.neonGreen} />
                                        </View>
                                        <View>
                                            <Text style={styles.statValue}>
                                                {formatVolume(stat.totalFuel, settings.volumeUnit)}
                                            </Text>
                                            <Text style={styles.statLabel}>
                                                Total Fuel
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.statItem}>
                                        <View style={[styles.iconBox, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
                                            <Text style={{ fontSize: 10, fontWeight: 'bold', color: Colors.dark.text }}>KM</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.statValue}>
                                                {formatDistance(stat.totalDistance, settings.distanceUnit)}
                                            </Text>
                                            <Text style={styles.statLabel}>
                                                Distance
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                            </View>
                        ))}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.dark.text,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: Colors.dark.textSecondary,
        fontSize: 16,
    },
    vehicleInfo: {
        marginBottom: 20,
    },
    vehicleName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    vehicleDetail: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        marginTop: 4,
    },
    statsList: {
        gap: 16,
    },
    card: {
        backgroundColor: Colors.dark.card,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    monthTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.dark.text,
    },
    costBadge: {
        backgroundColor: 'rgba(246, 42, 160, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(246, 42, 160, 0.3)',
    },
    costText: {
        color: Colors.dark.hotPink,
        fontWeight: '700',
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.dark.border,
        marginBottom: 12,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        gap: 10,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.dark.text,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
    },
});
