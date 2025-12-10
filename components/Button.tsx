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
          color={variant === 'primary' ? Colors.dark.background : Colors.dark.text}
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
      icon={<Plus size={18} color={Colors.dark.background} />}
      title="Add"
      variant="primary"
    />
  );
};

export const FuelButton: React.FC<Omit<ButtonProps, 'icon' | 'title'>> = (props) => {
  return (
    <Button
      {...props}
      icon={<Droplet size={18} color={Colors.dark.background} />}
      title="Add Fuel"
      variant="primary"
    />
  );
};

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
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

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: Colors.dark.text, // White background for primary CTA
  },
  secondary: {
    backgroundColor: Colors.dark.cardAlt,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.dark.textSecondary,
  },
  danger: {
    backgroundColor: Colors.dark.danger,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
};

const variantTextStyles: Record<ButtonVariant, TextStyle> = {
  primary: {
    color: Colors.dark.background, // Dark text on white button
    fontWeight: '600',
  },
  secondary: {
    color: Colors.dark.text,
    fontWeight: '600',
  },
  outline: {
    color: Colors.dark.text,
    fontWeight: '600',
  },
  danger: {
    color: '#FFFFFF',
    fontWeight: '600',
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