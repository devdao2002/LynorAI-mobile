import { useState, useEffect, useRef } from 'react';
import { bootstrapApp, setToken } from '../api/client';

export function useBootstrap() {
    const [state, setState] = useState({
        loading: true,
        error: null,
        version: {},
        sandbox: { active: false, token: null, remainingSeconds: 0 },
        documentReady: false,
        limits: {},
    });
    const timerRef = useRef(null);

    useEffect(() => {
        bootstrapApp()
            .then(data => {
                if (data.sandbox?.token) setToken(data.sandbox.token);
                setState(s => ({
                    ...s,
                    loading: false,
                    version: data.version || {},
                    sandbox: data.sandbox || {},
                    documentReady: data.documentReady || false,
                    limits: data.limits || {},
                }));
                startCountdown(data.sandbox?.remainingSeconds || 0);
            })
            .catch(err => setState(s => ({ ...s, loading: false, error: err.message })));

        return () => clearInterval(timerRef.current);
    }, []);

    function startCountdown(initial) {
        let secs = initial;
        timerRef.current = setInterval(() => {
            secs = Math.max(0, secs - 1);
            setState(s => ({
                ...s,
                sandbox: { ...s.sandbox, active: secs > 0, remainingSeconds: secs },
            }));
            if (secs <= 0) clearInterval(timerRef.current);
        }, 1000);
    }

    function setDocumentReady(val) {
        setState(s => ({ ...s, documentReady: val }));
    }

    return { ...state, setDocumentReady };
}
