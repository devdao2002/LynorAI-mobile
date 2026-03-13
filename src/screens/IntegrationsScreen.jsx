import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { colors, radius, spacing, typography } from '../theme';

const INTEGRATIONS = [
    {
        id: 'teams',
        name: 'Microsoft Teams',
        icon: '🟦',
        badge: 'Bot Framework',
        description: 'Deploy your Copilot as a Teams bot. Users can chat with it directly inside Teams channels or 1:1.',
        steps: [
            'Register your app in the Azure Portal as an Azure Bot resource.',
            'Add the Microsoft Teams channel in the Bot configuration.',
            'Upload the Teams app manifest via Teams Developer Portal.',
            'Users install the app from the Teams App Store or sideload it.',
        ],
        code: `// teams-manifest.json (excerpt)
{
  "bots": [{
    "botId": "<YOUR_BOT_ID>",
    "scopes": ["personal","team","groupChat"]
  }]
}`,
    },
    {
        id: 'powerapps',
        name: 'Power Apps',
        icon: '🟪',
        badge: 'PCF Component',
        description: 'Embed this assistant inside a Power Apps canvas app using the Power Apps component framework.',
        steps: [
            'Build a PCF (Power Apps Component Framework) control.',
            'Wrap the web chat iframe in a code component.',
            'Import the solution into your Power Platform environment.',
            'Add the component to any canvas or model-driven app.',
        ],
        code: `<!-- Power Apps iframe -->
<iframe
  src="https://lynorai.space"
  width="100%" height="600"
  frameborder="0"
  title="LynorAI Copilot">
</iframe>`,
    },
    {
        id: 'webchat',
        name: 'Web Chat',
        icon: '🌐',
        badge: 'Embed Code',
        description: 'Embed the chatbot on any website or internal portal using a simple iframe snippet.',
        steps: [
            'Copy the embed snippet below.',
            'Paste it into your website HTML.',
            'Optionally pass an auth token via URL param.',
            'Style the iframe to match your site.',
        ],
        code: `<!-- Web Chat Embed -->
<iframe
  id="lynor-copilot"
  src="https://lynorai.space"
  style="position:fixed;bottom:24px;right:24px;
    width:380px;height:560px;border:none;
    border-radius:16px;"
  title="LynorAI Copilot">
</iframe>`,
    },
];

function IntegrationCard({ item }) {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    async function copy() {
        await Clipboard.setStringAsync(item.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <View style={styles.card}>
            <TouchableOpacity style={styles.cardHeader} onPress={() => setOpen(o => !o)} activeOpacity={0.7}>
                <View style={styles.titleRow}>
                    <Text style={styles.cardIcon}>{item.icon}</Text>
                    <View>
                        <Text style={styles.cardName}>{item.name}</Text>
                        <View style={styles.badge}><Text style={styles.badgeText}>{item.badge}</Text></View>
                    </View>
                </View>
                <Text style={styles.chevron}>{open ? '▴' : '▾'}</Text>
            </TouchableOpacity>

            <Text style={styles.cardDesc}>{item.description}</Text>

            {open && (
                <View style={styles.cardBody}>
                    <Text style={styles.stepsTitle}>Setup Steps</Text>
                    {item.steps.map((s, i) => (
                        <Text key={i} style={styles.step}>{i + 1}. {s}</Text>
                    ))}
                    <View style={styles.codeWrap}>
                        <View style={styles.codeHeader}>
                            <Text style={styles.codeLabel}>Snippet</Text>
                            <TouchableOpacity onPress={copy} style={styles.copyBtn}>
                                <Text style={styles.copyText}>{copied ? '✅ Copied' : '📋 Copy'}</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal style={styles.codeScroll}>
                            <Text style={styles.codeText}>{item.code}</Text>
                        </ScrollView>
                    </View>
                </View>
            )}
        </View>
    );
}

export default function IntegrationsScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <Text style={styles.title}>Integrations</Text>
                    <Text style={styles.subtitle}>Connect your Copilot to Teams, Power Apps, and the web</Text>
                </View>
                {INTEGRATIONS.map(item => <IntegrationCard key={item.id} item={item} />)}
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
        borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        padding: spacing.lg,
    },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    cardIcon: { fontSize: 24 },
    cardName: { ...typography.md, ...typography.semi, color: colors.textPrimary },
    badge: { backgroundColor: 'rgba(98,100,167,0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99, marginTop: 3, alignSelf: 'flex-start' },
    badgeText: { ...typography.xs, ...typography.semi, color: colors.accent2 },
    chevron: { fontSize: 18, color: colors.textMuted },

    cardDesc: { ...typography.sm, color: colors.textSecondary, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, lineHeight: 20 },

    cardBody: {
        borderTopWidth: 1, borderTopColor: colors.border,
        padding: spacing.lg, gap: spacing.md,
    },
    stepsTitle: { ...typography.xs, ...typography.semi, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
    step: { ...typography.sm, color: colors.textSecondary, lineHeight: 20 },

    codeWrap: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, overflow: 'hidden' },
    codeHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: spacing.md, backgroundColor: colors.bgElevated,
    },
    codeLabel: { ...typography.xs, color: colors.textMuted },
    copyBtn: { backgroundColor: colors.bgGlass, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.sm },
    copyText: { ...typography.xs, color: colors.textSecondary },
    codeScroll: { backgroundColor: '#0d1117' },
    codeText: { padding: spacing.md, ...typography.xs, ...typography.mono, color: '#c9d1d9', lineHeight: 20 },
});
