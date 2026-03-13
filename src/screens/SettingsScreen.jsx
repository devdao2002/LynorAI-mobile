import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { colors, radius, spacing, typography } from '../theme';

function Card({ title, children }) {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{title}</Text>
            {children}
        </View>
    );
}

function Row({ label, value, mono }) {
    return (
        <View style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={[styles.rowValue, mono && styles.mono]}>{value || '—'}</Text>
        </View>
    );
}

function formatTime(s) {
    if (!s) return '—';
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
}

export default function SettingsScreen({ sandbox, version, limits }) {
    const active = sandbox?.active;

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <Text style={styles.title}>Settings & Info</Text>
                    <Text style={styles.subtitle}>Sandbox details, rate limits, and version information</Text>
                </View>

                {/* Sandbox */}
                <Card title="🔑 Sandbox Session">
                    <Row label="Token" value={sandbox?.token ? sandbox.token.slice(0, 20) + '…' : '—'} mono />
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Status</Text>
                        <View style={[styles.chip, active ? styles.chipActive : styles.chipExpired]}>
                            <Text style={[styles.chipText, { color: active ? colors.success : colors.danger }]}>
                                {active ? 'Active' : 'Expired'}
                            </Text>
                        </View>
                    </View>
                    <Row label="Expires in" value={formatTime(sandbox?.remainingSeconds)} />
                </Card>

                {/* Rate limits */}
                <Card title="⚡ Rate Limits">
                    <Row label="Uploads / 10 min" value="2" />
                    <Row label="Queries / 10 min" value="20" />
                    <Row label="Max file size" value="5 MB" />
                </Card>

                {/* Auto-cleanup */}
                <Card title="🧹 Auto-Cleanup">
                    <Text style={styles.bodyText}>
                        Documents and sandbox sessions are automatically deleted after{' '}
                        <Text style={styles.bold}>4 hours</Text>. Do not upload sensitive or confidential data.
                    </Text>
                </Card>

                {/* Version */}
                <Card title="📦 Version">
                    <Row label="App Version" value={version?.version} />
                    {version?.commitUrl ? (
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Commit</Text>
                            <TouchableOpacity onPress={() => Linking.openURL(version.commitUrl)}>
                                <Text style={[styles.rowValue, styles.link]}>{version.commitShort || '—'}</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <Row label="Commit" value={version?.commitShort} />
                    )}
                </Card>

                {/* Tech stack */}
                <Card title="🛠 Tech Stack">
                    <View style={styles.chips}>
                        {['Spring Boot', 'Spring AI', 'OpenAI GPT', 'pgvector', 'React Native', 'Expo'].map(t => (
                            <View key={t} style={styles.techChip}>
                                <Text style={styles.techChipText}>{t}</Text>
                            </View>
                        ))}
                    </View>
                </Card>

                {/* About */}
                <Card title="👤 About">
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Developer</Text>
                        <Text style={styles.rowValue}>Duc Do (Luyen T)</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>GitHub</Text>
                        <TouchableOpacity onPress={() => Linking.openURL('https://github.com/devdao2002/LynorAI-backend')}>
                            <Text style={[styles.rowValue, styles.link]}>devdao2002</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>LinkedIn</Text>
                        <TouchableOpacity onPress={() => Linking.openURL('https://linkedin.com/in/duc-do-00b7aa361')}>
                            <Text style={[styles.rowValue, styles.link]}>duc-do-00b7aa361</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bgBase },
    scroll: { padding: spacing.xl, gap: spacing.lg },
    header: { marginBottom: spacing.sm },
    title: { ...typography.xl, ...typography.bold, color: colors.textPrimary },
    subtitle: { ...typography.sm, color: colors.textMuted, marginTop: 2 },

    card: {
        backgroundColor: colors.bgSurface, borderRadius: radius.md,
        borderWidth: 1, borderColor: colors.border, padding: spacing.lg,
    },
    cardTitle: { ...typography.base, ...typography.semi, color: colors.textPrimary, marginBottom: spacing.md },

    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
    rowLabel: { ...typography.sm, color: colors.textMuted, fontWeight: '500' },
    rowValue: { ...typography.sm, color: colors.textPrimary, fontWeight: '500', maxWidth: '55%', textAlign: 'right' },
    mono: { fontFamily: 'monospace', fontSize: 11, color: colors.accent2 },
    link: { color: colors.accent2, textDecorationLine: 'underline' },

    chip: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99 },
    chipActive: { backgroundColor: 'rgba(76,175,135,0.15)' },
    chipExpired: { backgroundColor: 'rgba(240,108,126,0.15)' },
    chipText: { ...typography.xs, fontWeight: '700' },

    bodyText: { ...typography.sm, color: colors.textSecondary, lineHeight: 20 },
    bold: { fontWeight: '700', color: colors.textPrimary },

    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    techChip: {
        backgroundColor: colors.bgGlass, borderWidth: 1, borderColor: colors.borderAccent,
        paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99,
    },
    techChipText: { ...typography.xs, ...typography.semi, color: colors.accent2 },
});
