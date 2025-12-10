import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Linking,
    Platform,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import * as Location from 'expo-location';
import { MapPin, Navigation, Fuel, RefreshCw, Route, Compass } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from '@/components/Button';

interface LocationType {
    latitude: number;
    longitude: number;
}

export default function MapScreen() {
    const [location, setLocation] = useState<LocationType | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const getCurrentLocation = async () => {
        setLoading(true);
        setErrorMsg(null);

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setErrorMsg('Location permission denied');
                // Use default location
                setLocation({ latitude: 20.5937, longitude: 78.9629 });
                setLoading(false);
                return;
            }

            const isEnabled = await Location.hasServicesEnabledAsync();
            if (!isEnabled) {
                setLocation({ latitude: 20.5937, longitude: 78.9629 });
                setLoading(false);
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            setLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            });
        } catch (error: any) {
            console.error('Location error:', error);
            // Fallback location
            setLocation({ latitude: 20.5937, longitude: 78.9629 });
        } finally {
            setLoading(false);
        }
    };

    const openExternalMaps = () => {
        const query = encodeURIComponent('petrol pump near me');

        let url: string;
        if (Platform.OS === 'ios') {
            url = `maps://?q=${query}`;
        } else {
            url = `https://www.google.com/maps/search/${query}`;
        }

        Linking.openURL(url).catch(() => {
            Linking.openURL(`https://www.google.com/maps/search/petrol+pump+near+me`);
        });
    };

    const navigateToPetrolPump = () => {
        let url: string;
        if (Platform.OS === 'ios') {
            url = `maps://?daddr=petrol+pump&dirflg=d`;
        } else {
            url = `google.navigation:q=petrol+pump+near+me&mode=d`;
        }

        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    const webUrl = location
                        ? `https://www.google.com/maps/dir/${location.latitude},${location.longitude}/petrol+pump`
                        : `https://www.google.com/maps/search/petrol+pump+near+me`;
                    Linking.openURL(webUrl);
                }
            })
            .catch(() => {
                Linking.openURL(`https://www.google.com/maps/search/petrol+pump+near+me`);
            });
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container} edges={['bottom']}>
                <Stack.Screen
                    options={{
                        title: 'Nearby Pumps',
                        headerStyle: { backgroundColor: Colors.dark.background },
                        headerTintColor: Colors.dark.text,
                    }}
                />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.dark.tint} />
                    <Text style={styles.loadingText}>Getting your location...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen
                options={{
                    title: 'Nearby Pumps',
                    headerStyle: { backgroundColor: Colors.dark.background },
                    headerTintColor: Colors.dark.text,
                }}
            />

            <View style={styles.content}>
                {/* Location Status */}
                <View style={styles.locationCard}>
                    <View style={styles.locationHeader}>
                        <View style={styles.locationIconContainer}>
                            <Compass size={28} color={Colors.dark.success} />
                        </View>
                        <View style={styles.locationInfo}>
                            <Text style={styles.locationTitle}>Your Location</Text>
                            <Text style={styles.locationSubtitle}>
                                {location ? 'Location detected' : 'Using default location'}
                            </Text>
                            {errorMsg && (
                                <Text style={styles.errorText}>{errorMsg}</Text>
                            )}
                        </View>
                        <TouchableOpacity onPress={getCurrentLocation} style={styles.refreshButton}>
                            <RefreshCw size={20} color={Colors.dark.textSecondary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Main Action Card */}
                <View style={styles.actionCard}>
                    <View style={styles.actionIconContainer}>
                        <Fuel size={48} color={Colors.dark.warning} />
                    </View>
                    <Text style={styles.actionTitle}>Find Petrol Pumps</Text>
                    <Text style={styles.actionSubtitle}>
                        Search or navigate to nearby fuel stations using Google Maps
                    </Text>
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <Button
                        title="Search Nearby"
                        onPress={openExternalMaps}
                        variant="outline"
                        icon={<MapPin size={20} color={Colors.dark.text} />}
                        style={styles.button}
                    />
                    <Button
                        title="Navigate Now"
                        onPress={navigateToPetrolPump}
                        icon={<Route size={20} color={Colors.dark.background} />}
                        style={styles.button}
                    />
                </View>

                {/* Info Text */}
                <Text style={styles.infoText}>
                    Opens in Google Maps / Apple Maps
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    locationCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    locationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(74, 222, 128, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    locationInfo: {
        flex: 1,
        marginLeft: 12,
    },
    locationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.dark.text,
    },
    locationSubtitle: {
        fontSize: 13,
        color: Colors.dark.textSecondary,
        marginTop: 2,
    },
    errorText: {
        fontSize: 12,
        color: Colors.dark.warning,
        marginTop: 4,
    },
    refreshButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.dark.cardAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        marginBottom: 24,
    },
    actionIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: 'rgba(251, 191, 36, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    actionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.dark.text,
        marginBottom: 8,
    },
    actionSubtitle: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    buttonContainer: {
        gap: 12,
    },
    button: {
        width: '100%',
    },
    infoText: {
        fontSize: 12,
        color: Colors.dark.textMuted,
        textAlign: 'center',
        marginTop: 16,
    },
});
