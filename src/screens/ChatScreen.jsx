import React, { useRef, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, FlatList,
    StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../theme';

function TypingDots() {
    return (
        <View style={styles.typingWrap}>
            {[0, 1, 2].map(i => (
                <View key={i} style={[styles.dot, { opacity: 0.5 + i * 0.2 }]} />
            ))}
        </View>
    );
}

function MessageBubble({ msg }) {
    const isBot = msg.role === 'bot';
    return (
        <View style={[styles.row, isBot ? styles.rowBot : styles.rowUser]}>
            {isBot && (
                <View style={[styles.avatar, styles.botAvatar]}>
                    <Text style={styles.avatarText}>AI</Text>
                </View>
            )}
            <View style={[styles.bubble, isBot ? styles.botBubble : styles.userBubble]}>
                {msg.text ? (
                    <Text style={[styles.msgText, isBot ? styles.msgTextBot : styles.msgTextUser]}>
                        {msg.text}
                    </Text>
                ) : (
                    <TypingDots />
                )}
                {msg.sources?.length > 0 && (
                    <View style={styles.pills}>
                        {msg.sources.map((s, i) => (
                            <View key={i} style={styles.pill}>
                                <Text style={styles.pillText}>📄 {s}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
            {!isBot && (
                <View style={[styles.avatar, styles.userAvatar]}>
                    <Text style={styles.avatarText}>You</Text>
                </View>
            )}
        </View>
    );
}

export default function ChatScreen({ messages, streaming, onSend, sandboxActive, documentReady }) {
    const [input, setInput] = React.useState('');
    const flatRef = useRef(null);
    const canSend = sandboxActive && documentReady && !streaming;

    useEffect(() => {
        if (messages.length > 0) {
            flatRef.current?.scrollToEnd({ animated: true });
        }
    }, [messages]);

    function handleSend() {
        if (!input.trim() || !canSend) return;
        onSend(input.trim());
        setInput('');
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={90}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Chat</Text>
                    <Text style={styles.subtitle}>Ask questions about your uploaded documents</Text>
                </View>

                {/* Message list */}
                {messages.length === 0 ? (
                    <View style={styles.empty}>
                        <Text style={styles.emptyIcon}>💬</Text>
                        <Text style={styles.emptyText}>Upload a document, then ask me anything about it.</Text>
                    </View>
                ) : (
                    <FlatList
                        ref={flatRef}
                        data={messages}
                        keyExtractor={m => String(m.id)}
                        renderItem={({ item }) => <MessageBubble msg={item} />}
                        contentContainerStyle={styles.listContent}
                        onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
                    />
                )}

                {/* Notice */}
                {!documentReady && sandboxActive && (
                    <View style={styles.notice}>
                        <Text style={styles.noticeText}>📄 Upload a document in the Documents tab to start chatting.</Text>
                    </View>
                )}

                {/* Input */}
                <View style={styles.inputRow}>
                    <TextInput
                        style={[styles.input, !canSend && styles.inputDisabled]}
                        placeholder={canSend ? 'Ask a question…' : 'Upload a document to start…'}
                        placeholderTextColor={colors.textMuted}
                        value={input}
                        onChangeText={setInput}
                        multiline
                        editable={canSend}
                        onSubmitEditing={handleSend}
                        returnKeyType="send"
                        blurOnSubmit
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, (!canSend || !input.trim()) && styles.sendBtnDisabled]}
                        onPress={handleSend}
                        disabled={!canSend || !input.trim()}
                    >
                        {streaming ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.sendIcon}>➤</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bgBase },
    flex: { flex: 1 },
    header: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
    title: { ...typography.xl, ...typography.bold, color: colors.textPrimary },
    subtitle: { ...typography.sm, color: colors.textMuted, marginTop: 2 },
    listContent: { padding: spacing.lg, gap: spacing.lg },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
    emptyIcon: { fontSize: 48, marginBottom: spacing.md, opacity: 0.5 },
    emptyText: { ...typography.base, color: colors.textMuted, textAlign: 'center' },

    row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: spacing.md },
    rowBot: { flexDirection: 'row' },
    rowUser: { flexDirection: 'row-reverse' },
    avatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    botAvatar: { backgroundColor: colors.accent },
    userAvatar: { backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.borderAccent },
    avatarText: { color: '#fff', fontSize: 9, fontWeight: '700' },

    bubble: { maxWidth: '75%', borderRadius: radius.lg, padding: spacing.md },
    botBubble: { backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: radius.sm },
    userBubble: { backgroundColor: colors.accent, borderBottomRightRadius: radius.sm },
    msgText: { ...typography.base, lineHeight: 21 },
    msgTextBot: { color: colors.textPrimary },
    msgTextUser: { color: '#fff' },

    typingWrap: { flexDirection: 'row', gap: 5, paddingVertical: 4 },
    dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent2 },

    pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
    pill: { backgroundColor: 'rgba(98,100,167,0.18)', borderWidth: 1, borderColor: colors.borderAccent, paddingHorizontal: 10, paddingVertical: 2, borderRadius: 99 },
    pillText: { ...typography.xs, color: colors.accent2 },

    notice: { margin: spacing.lg, backgroundColor: 'rgba(245,166,35,0.1)', borderWidth: 1, borderColor: 'rgba(245,166,35,0.3)', borderRadius: radius.sm, padding: spacing.md },
    noticeText: { ...typography.sm, color: colors.warning },

    inputRow: { flexDirection: 'row', gap: spacing.sm, padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
    input: {
        flex: 1, backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.border,
        borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
        color: colors.textPrimary, ...typography.base, maxHeight: 120,
    },
    inputDisabled: { opacity: 0.4 },
    sendBtn: {
        width: 44, height: 44, borderRadius: radius.md,
        backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center',
    },
    sendBtnDisabled: { opacity: 0.3 },
    sendIcon: { color: '#fff', fontSize: 16 },
});
