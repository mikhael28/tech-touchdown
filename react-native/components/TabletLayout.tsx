import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SideNavigation } from './SideNavigation';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface TabletLayoutProps {
  children: React.ReactNode;
  selectedScreen?: string;
  onScreenChange?: (screen: string) => void;
}

export const TabletLayout: React.FC<TabletLayoutProps> = ({
  children,
  selectedScreen,
  onScreenChange,
}) => {
  const { colors } = useTheme();

  if (!isTablet) {
    return <>{children}</>;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SideNavigation
        mode="screens"
        selectedScreen={selectedScreen}
        onScreenChange={onScreenChange}
      />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
});
