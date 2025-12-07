import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  Platform
} from 'react-native';
import Colors from '@/constants/colors';
import { Droplet, Plus } from 'lucide-react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
  iconPosition = 'left',
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...sizeStyles[size],
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    const variantStyle = variantStyles[variant];

    if (disabled) {
      return {
        ...baseStyle,
        ...variantStyle,
        opacity: 0.5,
      };
    }

    return {
      ...baseStyle,
      ...variantStyle,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      ...styles.text,
      ...textSizeStyles[size],
    };

    const variantTextStyle = variantTextStyles[variant];

    return {
      ...baseTextStyle,
      ...variantTextStyle,
      ...(textStyle || {}),
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : Colors.dark.tint}
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          {title && <Text style={getTextStyle()}>{title}</Text>}
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

export const AddButton: React.FC<Omit<ButtonProps, 'icon' | 'title'>> = (props) => {
  return (
    <Button
      {...props}
      icon={<Plus size={18} color="#FFFFFF" />}
      title="Add"
      variant="primary"
    />
  );
};

export const FuelButton: React.FC<Omit<ButtonProps, 'icon' | 'title'>> = (props) => {
  return (
    <Button
      {...props}
      icon={<Droplet size={18} color="#FFFFFF" />}
      title="Add Fuel"
      variant="primary"
    />
  );
};

const sizeStyles = {
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
  },
};

const textSizeStyles = {
  small: {
    fontSize: 14,
  },
  medium: {
    fontSize: 16,
  },
  large: {
    fontSize: 18,
  },
};

const variantStyles = {
  primary: {
    backgroundColor: Colors.dark.tint,
    borderWidth: 2,
    borderColor: '#1a9e94', // Slightly darker teal for border
  },
  secondary: {
    backgroundColor: Colors.dark.cardAlt,
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.dark.tint,
  },
  danger: {
    backgroundColor: Colors.dark.danger,
    borderWidth: 2,
    borderColor: '#d6248a', // Slightly darker hot pink for border
  },
  ghost: {
    backgroundColor: 'transparent',
  },
};

const variantTextStyles = {
  primary: {
    color: '#FFFFFF', // White text on teal background
    fontWeight: '700',
  },
  secondary: {
    color: Colors.dark.text,
    fontWeight: '600',
  },
  outline: {
    color: Colors.dark.tint,
    fontWeight: '600',
  },
  danger: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  ghost: {
    color: Colors.dark.text,
    fontWeight: '600',
  },
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;