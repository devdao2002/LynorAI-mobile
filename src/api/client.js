import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://api.lynorai.space';
const TOKEN_KEY = 'sandbox_token';

// ── Token management ──────────────────────────────────────────────────────────
let _token = null;

export async function loadToken() {
    _token = await SecureStore.getItemAsync(TOKEN_KEY);
    return _token;
}

export function getToken() { return _token; }

export async function setToken(t) {
    _token = t;
    await SecureStore.setItemAsync(TOKEN_KEY, t);
}

function authHeaders(extra = {}) {
    return _token ? { 'X-Sandbox-Token': _token, ...extra } : extra;
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────
export async function bootstrapApp() {
    await loadToken();
    const res = await fetch(`${BASE_URL}/api/bootstrap`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Bootstrap failed');
    return res.json();
}

// ── Document upload ───────────────────────────────────────────────────────────
export async function uploadDocument(file) {
    // file = { uri, name, mimeType } from expo-document-picker
    const form = new FormData();
    form.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/pdf',
    });

    const res = await fetch(`${BASE_URL}/api/documents/upload`, {
        method: 'POST',
        body: form,
        headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    return data;
}

// ── Document status poll ──────────────────────────────────────────────────────
export async function pollDocumentStatus(documentId) {
    const res = await fetch(`${BASE_URL}/api/documents/status/${documentId}`, {
        headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Status check failed');
    return res.json();
}

// ── Chat streaming via SSE (React Native compatible) ──────────────────────────
// NOTE: React Native's fetch() does NOT expose res.body as a ReadableStream.
// Use XMLHttpRequest instead — its onprogress fires incrementally as SSE chunks arrive.
export function streamQuestion(question, onToken, onSources, onDone, onError) {
    const url = `${BASE_URL}/api/ask/stream?question=${encodeURIComponent(question)}`;
    const xhr = new XMLHttpRequest();
    let processed = 0;    // how many chars of xhr.responseText we've already parsed
    let lineBuffer = '';  // holds an incomplete SSE line between onprogress calls
    let finished = false; // guard against calling onDone/onError twice

    function parseNewChunk() {
        if (finished) return;
        // Grab only the newly arrived text since last call
        const newText = xhr.responseText.slice(processed);
        processed = xhr.responseText.length;

        // lineBuffer holds any partial line left over from the previous chunk
        lineBuffer += newText;

        // Split on newlines — last element may be an incomplete line
        const lines = lineBuffer.split('\n');
        lineBuffer = lines.pop(); // stash the trailing incomplete fragment

        for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const raw = line.slice(5).trim();
            if (!raw) continue;
            try {
                const obj = JSON.parse(raw);
                if (obj.type === 'token') onToken(obj.content);
                else if (obj.type === 'sources') onSources(obj.content);
                else if (obj.type === 'done') {
                    finished = true;
                    onDone();
                    xhr.abort();
                    return;
                }
            } catch (e) {
                console.warn('SSE parse error', e);
            }
        }
    }

    xhr.open('GET', url, true);
    const headers = authHeaders({ Accept: 'text/event-stream', 'Cache-Control': 'no-cache' });
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));

    xhr.onprogress = parseNewChunk;

    xhr.onload = () => {
        parseNewChunk(); // flush any final bytes
        if (!finished) {
            finished = true;
            onDone();
        }
    };

    xhr.onerror = () => {
        if (!finished) {
            finished = true;
            onError('Network error');
        }
    };

    xhr.ontimeout = () => {
        if (!finished) {
            finished = true;
            onError('Request timed out');
        }
    };

    xhr.send();

    return () => { // cancel function returned to caller
        finished = true;
        xhr.abort();
    };
}
