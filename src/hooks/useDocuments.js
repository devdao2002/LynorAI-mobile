import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { uploadDocument, pollDocumentStatus } from '../api/client';

export function useDocuments(onReady) {
    const [uploads, setUploads] = useState([]);

    async function pickAndUpload() {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/pdf',
            copyToCacheDirectory: true,
        });

        if (result.canceled || !result.assets?.length) return;

        const file = result.assets[0]; // { uri, name, mimeType, size }
        const entry = {
            id: Math.random().toString(36).slice(2),
            name: file.name,
            status: 'uploading',
            error: null,
        };

        setUploads(prev => [entry, ...prev]);

        try {
            const data = await uploadDocument(file);
            setUploads(prev =>
                prev.map(u => u.id === entry.id ? { ...u, status: 'processing', docId: data.documentId } : u)
            );
            pollStatus(entry.id, data.documentId);
        } catch (e) {
            setUploads(prev =>
                prev.map(u => u.id === entry.id ? { ...u, status: 'failed', error: e.message } : u)
            );
        }
    }

    function pollStatus(localId, documentId) {
        const interval = setInterval(async () => {
            try {
                const data = await pollDocumentStatus(documentId);
                if (data.status === 'READY') {
                    setUploads(prev => prev.map(u => u.id === localId ? { ...u, status: 'ready' } : u));
                    onReady?.();
                    clearInterval(interval);
                } else if (data.status === 'FAILED') {
                    setUploads(prev =>
                        prev.map(u => u.id === localId ? { ...u, status: 'failed', error: 'Processing failed' } : u)
                    );
                    clearInterval(interval);
                }
            } catch {
                clearInterval(interval);
            }
        }, 3000);
    }

    return { uploads, pickAndUpload };
}
