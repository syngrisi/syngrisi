import type { Page } from '@playwright/test';

export const speak = async (page: Page, text: string, waitForEnd: boolean = true): Promise<void> => {
    const voiceLang = process.env.E2E_SAY_LANG || 'en-US';
    const voiceName = process.env.E2E_SAY_VOICE || (process.env.E2E_SAY_LANG ? '' : 'Google US English');

    await page.evaluate(
        ({ text, voiceName, voiceLang, waitForEnd }) =>
            new Promise<void>((resolve) => {
                const timeout = setTimeout(() => resolve(), 10000);
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
                synth.cancel();

                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 1.0;
                utterance.pitch = 1.0;
                utterance.lang = voiceLang;

                const pickVoice = () => {
                    const voices = synth.getVoices();
                    let matched = voiceName ? voices.find((voice) => voice.name === voiceName) : undefined;

                    if (!matched) {
                        matched = voices.find(
                            (voice) => voice.lang === voiceLang || voice.lang.startsWith(`${voiceLang}-`),
                        );
                    }

                    if (!matched) {
                        const baseLang = voiceLang.split('-')[0];
                        matched = voices.find(
                            (voice) => voice.lang === baseLang || voice.lang.startsWith(`${baseLang}-`),
                        );
                    }

                    if (matched) {
                        utterance.voice = matched;
                        utterance.lang = matched.lang;
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
        { text, voiceName, voiceLang, waitForEnd },
    );
};
