import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Modal, Animated } from 'react-native';
import { AlertTriangle, AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from './Button';

interface ConfirmationModalProps {
    visible: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'default';
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmationModal({
    visible,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'default',
    onConfirm,
    onCancel
}: ConfirmationModalProps) {
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
        if (variant === 'danger') {
            return <AlertCircle size={48} color={Colors.dark.background} />;
        }
        return <AlertTriangle size={48} color={Colors.dark.background} />;
    };

    const getIconBackgroundColor = () => {
        if (variant === 'danger') {
            return Colors.dark.danger;
        }
        return Colors.dark.warning;
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onCancel}
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
                        <View style={[styles.iconCircle, { backgroundColor: getIconBackgroundColor(), shadowColor: getIconBackgroundColor() }]}>
                            {getIcon()}
                        </View>
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        <Button
                            title={cancelLabel}
                            onPress={onCancel}
                            variant="outline"
                            style={styles.button}
                        />
                        <Button
                            title={confirmLabel}
                            onPress={onConfirm}
                            variant={variant === 'danger' ? 'danger' : 'primary'}
                            style={styles.button}
                        />
                    </View>
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
        borderRadius: 16,
        padding: 28,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
        overflow: 'hidden',
    },
    iconContainer: {
        marginBottom: 24,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
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
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    button: {
        flex: 1,
    }
});
