import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TopBar from './src/components/TopBar';
import TabNavigator from './src/navigation/TabNavigator';
import { useBootstrap } from './src/hooks/useBootstrap';
import { useChat } from './src/hooks/useChat';
import { useDocuments } from './src/hooks/useDocuments';
import { colors } from './src/theme';

export default function App() {
  const bootstrap = useBootstrap();
  const chat = useChat();
  const docs = useDocuments(() => bootstrap.setDocumentReady(true));

  if (bootstrap.loading) {
    return (
      <SafeAreaProvider>
        <View style={styles.splash}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.splashText}>Connecting to LynorAI…</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  if (bootstrap.error) {
    return (
      <SafeAreaProvider>
        <View style={styles.splash}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{bootstrap.error}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => bootstrap.retry?.()}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: colors.accent,
            background: colors.bgBase,
            card: colors.bgSurface,
            text: colors.textPrimary,
            border: colors.border,
            notification: colors.accent,
          },
        }}
      >
        <View style={styles.shell}>
          <TopBar sandbox={bootstrap.sandbox} version={bootstrap.version} />
          <TabNavigator bootstrap={bootstrap} chat={chat} docs={docs} />
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: colors.bgBase },
  splash: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.bgBase, gap: 16,
  },
  splashText: { fontSize: 14, color: colors.textSecondary },
  errorIcon: { fontSize: 48 },
  errorText: { fontSize: 14, color: colors.danger, textAlign: 'center', paddingHorizontal: 32 },
  retryBtn: {
    backgroundColor: colors.accent, paddingHorizontal: 24, paddingVertical: 10,
    borderRadius: 8, marginTop: 8,
  },
  retryText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
