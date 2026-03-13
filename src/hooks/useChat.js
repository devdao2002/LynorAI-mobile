import { useState, useRef } from 'react';
import { streamQuestion } from '../api/client';

export function useChat() {
    const [messages, setMessages] = useState([]);
    const [streaming, setStreaming] = useState(false);
    const cancelRef = useRef(null);

    function sendMessage(question) {
        if (!question.trim() || streaming) return;

        const userMsg = { id: Date.now(), role: 'user', text: question };
        const botId = Date.now() + 1;
        const botMsg = { id: botId, role: 'bot', text: '', sources: [], done: false };

        setMessages(prev => [...prev, userMsg, botMsg]);
        setStreaming(true);

        cancelRef.current = streamQuestion(
            question,
            token => setMessages(prev =>
                prev.map(m => m.id === botId ? { ...m, text: m.text + token } : m)
            ),
            src => setMessages(prev =>
                prev.map(m => m.id === botId ? { ...m, sources: [...m.sources, src] } : m)
            ),
            () => {
                setMessages(prev => prev.map(m => m.id === botId ? { ...m, done: true } : m));
                setStreaming(false);
            },
            err => {
                setMessages(prev => prev.map(m =>
                    m.id === botId ? { ...m, text: `Error: ${err}`, done: true } : m
                ));
                setStreaming(false);
            },
        );
    }

    function clearMessages() {
        cancelRef.current?.();
        setMessages([]);
        setStreaming(false);
    }

    return { messages, streaming, sendMessage, clearMessages };
}
