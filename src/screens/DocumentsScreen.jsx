import React from 'react';
import {
    View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../theme';

const STATUS_ICON = { uploading: '⏫', processing: '⚙️', ready: '✅', failed: '❌' };
const STATUS_LABEL = { uploading: 'Uploading…', processing: 'Processing…', ready: 'Ready', failed: 'Failed' };
const STATUS_COLOR = {
    ready: { bg: 'rgba(76,175,135,0.15)', text: colors.success },
    processing: { bg: 'rgba(245,166,35,0.15)', text: colors.warning },
    uploading: { bg: 'rgba(245,166,35,0.15)', text: colors.warning },
    failed: { bg: 'rgba(240,108,126,0.15)', text: colors.danger },
};

export default function DocumentsScreen({ uploads, onPickAndUpload, sandboxActive }) {
    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Documents</Text>
                    <Text style={styles.subtitle}>Upload PDF documents to power your AI assistant</Text>
                </View>

                {/* Upload button */}
                <TouchableOpacity
                    style={[styles.uploadBtn, !sandboxActive && styles.uploadBtnDisabled]}
                    onPress={onPickAndUpload}
                    disabled={!sandboxActive}
                    activeOpacity={0.7}
                >
                    <Text style={styles.uploadIcon}>📎</Text>
                    <View>
                        <Text style={styles.uploadLabel}>
                            {sandboxActive ? 'Tap to select a PDF' : 'Session expired — cannot upload'}
                        </Text>
                        <Text style={styles.uploadHint}>PDF only · Max 5 MB</Text>
                    </View>
                </TouchableOpacity>

                {/* Upload list */}
                {uploads.length > 0 && (
                    <View style={styles.listSection}>
                        <Text style={styles.listTitle}>Uploaded Files</Text>
                        {uploads.map(u => (
                            <View key={u.id} style={[styles.uploadItem, u.status === 'ready' && styles.itemReady, u.status === 'failed' && styles.itemFailed]}>
                                <View style={styles.itemLeft}>
                                    <Text style={styles.statusIcon}>{STATUS_ICON[u.status]}</Text>
                                    <View style={styles.itemInfo}>
                                        <Text style={styles.fileName} numberOfLines={1}>{u.name}</Text>
                                        {u.error && <Text style={styles.errorText}>{u.error}</Text>}
                                    </View>
                                </View>
                                <View style={[styles.badge, { backgroundColor: STATUS_COLOR[u.status]?.bg }]}>
                                    {(u.status === 'uploading' || u.status === 'processing') && (
                                        <ActivityIndicator size="small" color={STATUS_COLOR[u.status]?.text} style={{ marginRight: 4 }} />
                                    )}
                                    <Text style={[styles.badgeText, { color: STATUS_COLOR[u.status]?.text }]}>
                                        {STATUS_LABEL[u.status]}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Limits card */}
                <View style={styles.limitsCard}>
                    <Text style={styles.limitsTitle}>Demo Limits</Text>
                    {[
                        '📤  2 uploads / 10 min per IP',
                        '💬  20 queries / 10 min per IP',
                        '📁  Max file size: 5 MB',
                        '⏱  Documents auto-deleted after 4 hours',
                        '🔒  Do NOT upload sensitive data',
                    ].map((line, i) => (
                        <Text key={i} style={styles.limitLine}>{line}</Text>
                    ))}
                </View>
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

    uploadBtn: {
        flexDirection: 'row', alignItems: 'center', gap: spacing.lg,
        borderWidth: 2, borderStyle: 'dashed', borderColor: colors.borderAccent,
        borderRadius: radius.lg, padding: spacing.xl,
        backgroundColor: colors.bgGlass,
    },
    uploadBtnDisabled: { opacity: 0.4 },
    uploadIcon: { fontSize: 36 },
    uploadLabel: { ...typography.md, ...typography.semi, color: colors.textPrimary },
    uploadHint: { ...typography.sm, color: colors.textMuted, marginTop: 2 },

    listSection: { gap: spacing.sm },
    listTitle: { ...typography.sm, ...typography.semi, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
    uploadItem: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        padding: spacing.lg, backgroundColor: colors.bgSurface,
        borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    },
    itemReady: { borderColor: 'rgba(76,175,135,0.3)' },
    itemFailed: { borderColor: 'rgba(240,108,126,0.3)' },
    itemLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
    statusIcon: { fontSize: 18 },
    itemInfo: { flex: 1 },
    fileName: { ...typography.base, ...typography.semi, color: colors.textPrimary },
    errorText: { ...typography.sm, color: colors.danger, marginTop: 2 },
    badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99 },
    badgeText: { ...typography.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },

    limitsCard: {
        backgroundColor: colors.bgGlass, borderWidth: 1, borderColor: colors.border,
        borderRadius: radius.md, padding: spacing.lg, gap: spacing.sm,
    },
    limitsTitle: { ...typography.sm, ...typography.semi, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
    limitLine: { ...typography.sm, color: colors.textSecondary, lineHeight: 20 },
});
