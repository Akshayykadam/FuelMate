import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp, Text, TouchableOpacity, Platform } from 'react-native';
import Colors from '@/constants/colors';
import { ChevronRight } from 'lucide-react-native';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  showArrow?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  title,
  subtitle,
  footer,
  showArrow = false,
}) => {
  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {(title || subtitle) && (
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {showArrow && (
            <ChevronRight size={20} color={Colors.dark.textSecondary} />
          )}
        </View>
      )}

      <View style={styles.content}>
        {children}
      </View>

      {footer && (
        <View style={styles.footer}>
          {footer}
        </View>
      )}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  content: {
    flex: 1,
  },
  footer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.5)',
  },
});

export default Card;