import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
  Platform,
} from 'react-native';
import Colors from '@/constants/colors';
import { Eye, EyeOff, X } from 'lucide-react-native';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  clearable?: boolean;
  onClear?: () => void;
  autoFocus?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  style,
  inputStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  clearable = false,
  onClear,
  autoFocus = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleClear = () => {
    onChangeText('');
    if (onClear) onClear();
  };

  const getContainerStyle = () => {
    return [
      styles.container,
      isFocused && styles.containerFocused,
      error && styles.containerError,
      disabled && styles.containerDisabled,
      style,
    ];
  };

  const getInputStyle = () => {
    return [
      styles.input,
      leftIcon && styles.inputWithLeftIcon,
      (rightIcon || secureTextEntry || (clearable && value)) && styles.inputWithRightIcon,
      multiline && styles.inputMultiline,
      disabled && styles.inputDisabled,
      inputStyle,
    ];
  };

  const renderPasswordToggle = () => {
    if (!secureTextEntry) return null;

    return (
      <TouchableOpacity
        style={styles.rightIconContainer}
        onPress={togglePasswordVisibility}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        {isPasswordVisible ? (
          <EyeOff size={20} color={Colors.dark.textSecondary} />
        ) : (
          <Eye size={20} color={Colors.dark.textSecondary} />
        )}
      </TouchableOpacity>
    );
  };

  const renderClearButton = () => {
    if (!clearable || !value) return null;

    return (
      <TouchableOpacity
        style={styles.rightIconContainer}
        onPress={handleClear}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <X size={18} color={Colors.dark.textSecondary} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={getContainerStyle()}>
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

        <TextInput
          style={getInputStyle()}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.dark.textSecondary}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : undefined}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoFocus={autoFocus}
          selectionColor={Colors.dark.tint}
        />

        {renderPasswordToggle()}
        {renderClearButton()}

        {rightIcon && !secureTextEntry && !(clearable && value) && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 12,
    backgroundColor: Colors.dark.cardAlt,
    overflow: 'hidden',
  },
  containerFocused: {
    borderColor: Colors.dark.tint,
  },
  containerError: {
    borderColor: Colors.dark.danger,
  },
  containerDisabled: {
    opacity: 0.6,
  },
  input: {
    flex: 1,
    color: Colors.dark.text,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputDisabled: {
    color: Colors.dark.textSecondary,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: Colors.dark.danger,
    marginTop: 4,
  },
  leftIconContainer: {
    paddingLeft: 16,
  },
  rightIconContainer: {
    paddingRight: 16,
  },
});

export default Input;