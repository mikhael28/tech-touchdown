import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Home, Headphones, Trophy, User, Settings, Moon, Sun, Zap, Rocket } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Category } from '@/types/article';

interface SideNavigationProps {
  // For screen navigation (matching bottom nav)
  selectedScreen?: string;
  onScreenChange?: (screen: string) => void;
  // For category filtering (existing functionality)
  selectedCategory?: Category;
  onCategoryChange?: (category: Category) => void;
  // Mode determines which navigation to show
  mode?: 'screens' | 'categories';
}

const screenNavigationItems = [
  { id: 'index', label: 'Home', icon: Home, route: '/' },
  { id: 'podcast', label: 'Podcast', icon: Headphones, route: '/podcast' },
  { id: 'tech', label: 'Games', icon: Trophy, route: '/tech' },
  { id: 'profile', label: 'Profile', icon: User, route: '/profile' },
];

const categoryNavigationItems = [
  { id: 'all' as Category, label: 'All', icon: Home },
  { id: 'nfl' as Category, label: 'NFL', icon: Trophy },
  { id: 'tech' as Category, label: 'Technology', icon: Zap },
  { id: 'startups' as Category, label: 'Startups', icon: Rocket },
];

export const SideNavigation: React.FC<SideNavigationProps> = React.memo(({
  selectedScreen,
  onScreenChange,
  selectedCategory,
  onCategoryChange,
  mode = 'screens',
}) => {
  const { colors, spacing, borderRadius, fontSize, isDark, setThemeMode } = useTheme();
  const router = useRouter();

  const toggleTheme = () => {
    setThemeMode(isDark ? 'light' : 'dark');
  };

  const handleScreenNavigation = (item: typeof screenNavigationItems[0]) => {
    if (onScreenChange) {
      onScreenChange(item.id);
    }
    router.push(item.route);
  };

  const handleCategoryNavigation = (item: typeof categoryNavigationItems[0]) => {
    if (onCategoryChange) {
      onCategoryChange(item.id);
    }
  };

  const navigationItems = mode === 'screens' ? screenNavigationItems : categoryNavigationItems;

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderRightColor: colors.border }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { padding: spacing.lg }]}>
          <Text style={[styles.logo, { fontSize: fontSize.xxl }]}>⚡</Text>
          <Text style={[styles.title, { color: colors.text, fontSize: fontSize.lg }]}>
            Tech{'\n'}Touchdown
          </Text>
        </View>

        <View style={[styles.navItems, { paddingHorizontal: spacing.md }]}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isSelected = mode === 'screens' 
              ? selectedScreen === item.id 
              : selectedCategory === item.id;
            
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.navItem,
                  {
                    backgroundColor: isSelected ? colors.accent + '20' : 'transparent',
                    borderRadius: borderRadius.md,
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.md,
                    marginBottom: spacing.xs,
                  },
                ]}
                onPress={() => mode === 'screens' 
                  ? handleScreenNavigation(item as typeof screenNavigationItems[0])
                  : handleCategoryNavigation(item as typeof categoryNavigationItems[0])
                }
                activeOpacity={0.7}
                testID={`side-nav-${item.id}`}
              >
                <Icon
                  size={20}
                  color={isSelected ? colors.accent : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.navLabel,
                    {
                      color: isSelected ? colors.accent : colors.text,
                      fontSize: fontSize.sm,
                      fontWeight: isSelected ? '600' : '500' as const,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border, marginVertical: spacing.lg }]} />

        <View style={[styles.bottomSection, { paddingHorizontal: spacing.md }]}>
          <TouchableOpacity
            style={[
              styles.navItem,
              {
                borderRadius: borderRadius.md,
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                marginBottom: spacing.xs,
              },
            ]}
            onPress={toggleTheme}
            activeOpacity={0.7}
            testID="theme-toggle"
          >
            {isDark ? (
              <Sun size={20} color={colors.textSecondary} />
            ) : (
              <Moon size={20} color={colors.textSecondary} />
            )}
            <Text
              style={[
                styles.navLabel,
                {
                  color: colors.text,
                  fontSize: fontSize.sm,
                },
              ]}
            >
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navItem,
              {
                borderRadius: borderRadius.md,
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
              },
            ]}
            activeOpacity={0.7}
            testID="settings"
          >
            <Settings size={20} color={colors.textSecondary} />
            <Text
              style={[
                styles.navLabel,
                {
                  color: colors.text,
                  fontSize: fontSize.sm,
                },
              ]}
            >
              Settings
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 240,
    height: '100%',
    borderRightWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {},
  title: {
    fontWeight: '800' as const,
    marginLeft: 12,
    lineHeight: 24,
  },
  navItems: {
    marginTop: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navLabel: {
    fontWeight: '500' as const,
  },
  divider: {
    height: 1,
    marginHorizontal: 24,
  },
  bottomSection: {},
});