#!/usr/bin/env python3
"""Generate StyleTTS2 (Olivia) voice-over for the marketing reel.

Reads the subtitle lines from marketing.feature (the single source of truth),
synthesizes each with StyleTTS2 voice "Olivia", and writes captions.built.json
with per-clip durations. Run with the SYSTEM python3 (only uses stdlib + subprocess);
StyleTTS2 itself runs in its own venv.

    python3 tts.py
"""
import json
import os
import re
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
FEATURE = os.path.normpath(os.path.join(HERE, '..', '..', 'features', 'DEMO', 'marketing.feature'))
TTS_DIR = os.environ.get('STYLETTS2_DIR', '/Users/a1/Project/styletts2')
VOICE = os.environ.get('MARKETING_VOICE', 'Olivia')
OUT_DIR = os.path.join(HERE, 'audio')
MANIFEST = os.path.join(HERE, 'captions.built.json')


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    text = open(FEATURE, encoding='utf-8').read()
    captions = re.findall(r'I subtitle "([^"]*)"', text)
    if not captions:
        raise SystemExit(f'no `I subtitle "..."` lines found in {FEATURE}')

    py = os.path.join(TTS_DIR, 'env', 'bin', 'python')
    built = []
    for i, caption in enumerate(captions, 1):
        wav = os.path.join(OUT_DIR, f'scene_{i:02d}.wav')
        subprocess.run([py, 'say.py', VOICE, caption, wav], cwd=TTS_DIR, check=True)
        # StyleTTS2 writes float32 WAV (fmt tag 3), which the stdlib `wave` can't read → use ffprobe.
        probe = subprocess.run(
            ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nk=1:nw=1', wav],
            capture_output=True, text=True, check=True,
        )
        duration_ms = int(round(float(probe.stdout.strip()) * 1000))
        built.append({'text': caption, 'audio': wav, 'durationMs': duration_ms})
        print(f'{i:02d}  {duration_ms:>5}ms  {caption}')

    with open(MANIFEST, 'w', encoding='utf-8') as f:
        json.dump({'captions': built}, f, ensure_ascii=False, indent=2)
    print(f'\nwrote {MANIFEST} ({len(built)} captions, '
          f'{sum(c["durationMs"] for c in built) / 1000:.1f}s total speech)')


if __name__ == '__main__':
    main()
