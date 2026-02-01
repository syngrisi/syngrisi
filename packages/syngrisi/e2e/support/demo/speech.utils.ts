import type { Page } from '@playwright/test';
import { env } from '@config';

export const speak = async (page: Page, text: string, waitForEnd: boolean = true): Promise<void> => {
    const voiceName = process.env.E2E_SAY_VOICE || 'Google US English';

    await page.evaluate(
        ({ text, voiceName, waitForEnd }) =>
            new Promise<void>((resolve) => {
                const timeout = setTimeout(() => resolve(), 10000); // 10s max timeout
                const done = () => {
                    clearTimeout(timeout);
                    resolve();
                };

                if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
                    console.warn('Speech synthesis not supported');
                    done();
                    return;
                }

                const synth = window.speechSynthesis;
                // Cancel any pending speech
                synth.cancel();

                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 1.0;
                utterance.pitch = 1.0;

                const pickVoice = () => {
                    const voices = synth.getVoices();
                    // Try to find exact match
                    let matched = voices.find((voice) => voice.name === voiceName);
                    // Fallback to any English voice
                    if (!matched) {
                        matched = voices.find((voice) => voice.lang.includes('en'));
                    }
                    if (matched) {
                        utterance.voice = matched;
                    }
                };

                const speakNow = () => {
                    pickVoice();
                    synth.speak(utterance);
                    if (!waitForEnd) {
                        done();
                    }
                };

                if (waitForEnd) {
                    utterance.onend = done;
                    utterance.onerror = (e) => {
                        console.error('Speech synthesis error:', e);
                        done();
                    };
                }

                if (synth.getVoices().length === 0) {
                    synth.onvoiceschanged = () => {
                        synth.onvoiceschanged = null;
                        speakNow();
                    };
                } else {
                    speakNow();
                }
            }),
        { text, voiceName, waitForEnd },
    );
};
