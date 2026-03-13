import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../theme';

function formatTime(s) {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
}

export default function TopBar({ sandbox, version }) {
    const insets = useSafeAreaInsets();
    const active = sandbox?.active;
    const remaining = sandbox?.remainingSeconds ?? 0;

    return (
        <View style={[styles.topbar, { paddingTop: insets.top + 8 }]}>
            <StatusBar barStyle="light-content" backgroundColor={colors.bgSurface} />

            {/* Logo + Title */}
            <View style={styles.left}>
                <View style={styles.logoBox}>
                    <Text style={styles.logoText}>▲</Text>
                </View>
                <View>
                    <Text style={styles.title}>LynorAI</Text>
                    <Text style={styles.subtitle}>Internal RAG Assistant</Text>
                </View>
            </View>

            {/* Right section */}
            <View style={styles.right}>
                {version?.version ? (
                    <View style={styles.versionBadge}>
                        <Text style={styles.versionText}>v{version.version}</Text>
                    </View>
                ) : null}

                <View style={[styles.sandboxBadge, active ? styles.badgeActive : styles.badgeExpired]}>
                    <View style={[styles.dot, { backgroundColor: active ? colors.success : colors.danger }]} />
                    <Text style={[styles.sandboxText, { color: active ? colors.success : colors.danger }]}>
                        {active ? formatTime(remaining) : 'Expired'}
                    </Text>
                </View>

                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>AI</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    topbar: {
        backgroundColor: colors.bgSurface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
    },
    left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    logoBox: {
        width: 32, height: 32, borderRadius: 8,
        backgroundColor: colors.accent,
        alignItems: 'center', justifyContent: 'center',
    },
    logoText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    title: { ...typography.md, ...typography.bold, color: colors.textPrimary, letterSpacing: -0.3 },
    subtitle: { ...typography.xs, color: colors.textMuted, fontWeight: '500', letterSpacing: 0.5 },
    right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    versionBadge: {
        backgroundColor: colors.bgGlass, borderWidth: 1, borderColor: colors.border,
        paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99,
    },
    versionText: { ...typography.xs, color: colors.textMuted },
    sandboxBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99, borderWidth: 1,
    },
    badgeActive: { backgroundColor: 'rgba(76,175,135,0.12)', borderColor: 'rgba(76,175,135,0.4)' },
    badgeExpired: { backgroundColor: 'rgba(240,108,126,0.12)', borderColor: 'rgba(240,108,126,0.4)' },
    dot: { width: 7, height: 7, borderRadius: 4 },
    sandboxText: { ...typography.sm, fontWeight: '500' },
    avatar: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: colors.accent,
        alignItems: 'center', justifyContent: 'center',
    },
    avatarText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
