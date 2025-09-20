import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Bell, Search, Menu } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  onMenuPress?: () => void;
  showMenu?: boolean;
}

export const Header: React.FC<HeaderProps> = React.memo(({ onMenuPress, showMenu = false }) => {
  const { colors, spacing, fontSize } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + spacing.sm,
          paddingHorizontal: spacing.md,
          paddingBottom: spacing.sm,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.content}>
        {showMenu && (
          <TouchableOpacity
            onPress={onMenuPress}
            style={[styles.iconButton, { marginRight: spacing.sm }]}
            testID="menu-button"
          >
            <Menu size={24} color={colors.text} />
          </TouchableOpacity>
        )}
        
        <View style={styles.titleSection}>
          <Text style={[styles.logo, { fontSize: fontSize.xl }]}>⚡</Text>
          <Text style={[styles.title, { color: colors.text, fontSize: fontSize.xl }]}>
            Tech Touchdown
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconButton} testID="search-button">
            <Search size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} testID="notifications-button">
            <Bell size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {},
  title: {
    fontWeight: '800' as const,
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
});