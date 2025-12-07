import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Modal, Animated } from 'react-native';
import { CheckCircle, Car, Droplet } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from './Button';

interface SuccessModalProps {
    visible: boolean;
    title: string;
    message: string;
    type?: 'vehicle' | 'fuel' | 'default';
    onClose: () => void;
}

export default function SuccessModal({
    visible,
    title,
    message,
    type = 'default',
    onClose
}: SuccessModalProps) {
    const scaleAnim = React.useRef(new Animated.Value(0)).current;
    const opacityAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            scaleAnim.setValue(0);
            opacityAnim.setValue(0);
        }
    }, [visible]);

    const getIcon = () => {
        switch (type) {
            case 'vehicle':
                return <Car size={48} color={Colors.dark.background} />;
            case 'fuel':
                return <Droplet size={48} color={Colors.dark.background} />;
            default:
                return <CheckCircle size={48} color={Colors.dark.background} />;
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.container,
                        {
                            opacity: opacityAnim,
                            transform: [{ scale: scaleAnim }],
                        }
                    ]}
                >
                    <View style={styles.iconContainer}>
                        <View style={styles.iconCircle}>
                            {getIcon()}
                        </View>
                        <View style={styles.checkBadge}>
                            <CheckCircle size={24} color="#FFFFFF" fill={Colors.dark.success} />
                        </View>
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.confettiContainer}>
                        <View style={[styles.confetti, styles.confetti1]} />
                        <View style={[styles.confetti, styles.confetti2]} />
                        <View style={[styles.confetti, styles.confetti3]} />
                        <View style={[styles.confetti, styles.confetti4]} />
                    </View>

                    <Button
                        title="Continue"
                        onPress={onClose}
                        variant="primary"
                        fullWidth
                        style={styles.button}
                    />
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    container: {
        backgroundColor: Colors.dark.card,
        borderRadius: 24,
        padding: 32,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.border,
        overflow: 'hidden',
    },
    iconContainer: {
        position: 'relative',
        marginBottom: 24,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.dark.success,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.dark.success,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    checkBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.dark.card,
        borderRadius: 15,
        padding: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.dark.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
    },
    button: {
        minWidth: 200,
    },
    confettiContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
    },
    confetti: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    confetti1: {
        backgroundColor: Colors.dark.tint,
        top: 20,
        left: 30,
        transform: [{ rotate: '45deg' }],
    },
    confetti2: {
        backgroundColor: Colors.dark.hotPink,
        top: 40,
        right: 40,
        width: 6,
        height: 6,
    },
    confetti3: {
        backgroundColor: Colors.dark.aqua,
        bottom: 80,
        left: 50,
        width: 10,
        height: 10,
    },
    confetti4: {
        backgroundColor: Colors.dark.neonGreen,
        bottom: 100,
        right: 30,
        transform: [{ rotate: '30deg' }],
    },
});
