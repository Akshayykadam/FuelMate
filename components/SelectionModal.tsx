import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import Colors from '@/constants/colors';
import { Check, X } from 'lucide-react-native';

interface SelectionOption {
    label: string;
    value: string;
}

interface SelectionModalProps {
    visible: boolean;
    title: string;
    options: SelectionOption[];
    selectedValue: string;
    onSelect: (value: string) => void;
    onClose: () => void;
}

export default function SelectionModal({
    visible,
    title,
    options,
    selectedValue,
    onSelect,
    onClose,
}: SelectionModalProps) {
    const handleSelect = (value: string) => {
        onSelect(value);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={20} color={Colors.dark.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
                        {options.map((option, index) => {
                            const isSelected = option.value === selectedValue;
                            const isLast = index === options.length - 1;

                            return (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.option,
                                        isSelected && styles.optionSelected,
                                        !isLast && styles.optionBorder,
                                    ]}
                                    onPress={() => handleSelect(option.value)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        isSelected && styles.optionTextSelected,
                                    ]}>
                                        {option.label}
                                    </Text>
                                    {isSelected && (
                                        <Check size={20} color={Colors.dark.text} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    container: {
        backgroundColor: Colors.dark.card,
        borderRadius: 16,
        width: '100%',
        maxWidth: 340,
        maxHeight: '70%',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.dark.text,
    },
    closeButton: {
        padding: 4,
    },
    optionsList: {
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginVertical: 2,
    },
    optionSelected: {
        backgroundColor: 'rgba(250, 250, 250, 0.08)',
    },
    optionBorder: {
        // No border needed with the new design
    },
    optionText: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
    },
    optionTextSelected: {
        color: Colors.dark.text,
        fontWeight: '500',
    },
});
