import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { X, Share2, ExternalLink } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Article } from '@/types/article';

interface ArticleWebViewProps {
  article: Article | null;
  visible: boolean;
  onClose: () => void;
}

export const ArticleWebView: React.FC<ArticleWebViewProps> = React.memo(({
  article,
  visible,
  onClose,
}) => {
  const { colors, spacing, fontSize, borderRadius } = useTheme();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = React.useState(true);

  if (!article) return null;

  const handleShare = async () => {
    if (Platform.OS === 'web') {
      if (navigator.share) {
        try {
          await navigator.share({
            title: article.title,
            text: article.description,
            url: article.url,
          });
        } catch (error) {
          console.log('Error sharing:', error);
        }
      }
    } else {
      // On mobile, you would use React Native's Share API
      console.log('Share article:', article.title);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top + spacing.sm,
              paddingHorizontal: spacing.md,
              paddingBottom: spacing.sm,
              backgroundColor: colors.card,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            testID="close-webview"
          >
            <X size={24} color={colors.text} />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              { color: colors.text, fontSize: fontSize.md },
            ]}
            numberOfLines={1}
          >
            {article.source}
          </Text>

          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <Share2 size={20} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <ExternalLink size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {loading && (
          <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={[styles.loadingText, { color: colors.textSecondary, fontSize: fontSize.sm }]}>
              Loading article...
            </Text>
          </View>
        )}

        {Platform.OS === 'web' ? (
          <iframe
            src={article.url}
            style={{ flex: 1, border: 'none', width: '100%', height: '100%' }}
            onLoad={() => setLoading(false)}
          />
        ) : (
          <WebView
            source={{ uri: article.url }}
            style={styles.webview}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.accent} />
              </View>
            )}
          />
        )}
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontWeight: '600' as const,
    marginHorizontal: 16,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
});