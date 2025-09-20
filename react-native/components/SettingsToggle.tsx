import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface SettingsToggleProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  testID?: string;
}

const SettingsToggleComponent: React.FC<SettingsToggleProps> = ({
  label,
  description,
  value,
  onValueChange,
  testID,
}) => {
  const { colors, spacing, fontSize } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const toggleSwitch = () => {
    onValueChange(!value);
  };

  const switchTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  const switchBackgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.textSecondary + '40', colors.accent],
  });

  return (
    <View style={[styles.container, { paddingVertical: spacing.md }]}>
      <View style={styles.textContainer}>
        <Text style={[styles.label, { color: colors.text, fontSize: fontSize.md }]}>
          {label}
        </Text>
        {description && (
          <Text style={[styles.description, { color: colors.textSecondary, fontSize: fontSize.sm }]}>
            {description}
          </Text>
        )}
      </View>
      
      <TouchableOpacity
        style={[styles.switchContainer, { borderRadius: 12 }]}
        onPress={toggleSwitch}
        activeOpacity={0.8}
        testID={testID}
      >
        <Animated.View
          style={[
            styles.switchTrack,
            {
              backgroundColor: switchBackgroundColor,
              borderRadius: 12,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.switchThumb,
              {
                backgroundColor: colors.background,
                borderRadius: 12,
                transform: [{ translateX: switchTranslateX }],
              },
            ]}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

SettingsToggleComponent.displayName = 'SettingsToggle';

export const SettingsToggle = React.memo(SettingsToggleComponent);

// Theme Selector Component
interface ThemeOption {
  value: 'light' | 'dark' | 'system';
  label: string;
  description: string;
}

interface ThemeSelectorProps {
  value: 'light' | 'dark' | 'system';
  onValueChange: (value: 'light' | 'dark' | 'system') => void;
  testID?: string;
}

const ThemeSelectorComponent: React.FC<ThemeSelectorProps> = ({
  value,
  onValueChange,
  testID,
}) => {
  const { colors, spacing, fontSize, borderRadius } = useTheme();

  const themeOptions: ThemeOption[] = [
    { value: 'light', label: 'Light', description: 'Always use light theme' },
    { value: 'dark', label: 'Dark', description: 'Always use dark theme' },
    { value: 'system', label: 'System', description: 'Follow system preference' },
  ];

  return (
    <View style={[styles.container, { paddingVertical: spacing.md }]}>
      <View style={styles.textContainer}>
        <Text style={[styles.label, { color: colors.text, fontSize: fontSize.md }]}>
          Theme
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary, fontSize: fontSize.sm }]}>
          Choose your preferred theme
        </Text>
      </View>
      
      <View style={styles.themeOptionsContainer}>
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.themeOption,
              {
                backgroundColor: value === option.value ? colors.accent : colors.card,
                borderColor: value === option.value ? colors.accent : colors.border,
                borderRadius: borderRadius.sm,
                borderWidth: 1,
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xs,
              },
            ]}
            onPress={() => onValueChange(option.value)}
            activeOpacity={0.8}
            testID={`${testID}-${option.value}`}
          >
            <Text
              style={[
                styles.themeOptionText,
                {
                  color: value === option.value ? colors.background : colors.text,
                  fontSize: fontSize.sm,
                  fontWeight: value === option.value ? '600' : '500',
                },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

ThemeSelectorComponent.displayName = 'ThemeSelector';

export const ThemeSelector = React.memo(ThemeSelectorComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  label: {
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  description: {
    lineHeight: 18,
  },
  switchContainer: {
    padding: 2,
  },
  switchTrack: {
    width: 44,
    height: 24,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 20,
    height: 20,
    position: 'absolute',
  },
  themeOptionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeOption: {
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeOptionText: {
    textAlign: 'center',
    fontWeight: '500' as const,
  },
});