# Marketing reel pipeline

Records `features/DEMO/marketing.feature` into a short, subtitled, voiced-over MP4 for the README.
Subtitles are compact + outlined (no background); the voice-over is generated with StyleTTS2
(voice **Olivia**) and muxed in post, so there is **no spoken audio during recording**.

## Steps

```bash
cd packages/syngrisi/e2e

# 1. Voice-over: synthesize each subtitle line (StyleTTS2 / Olivia) → captions.built.json
python3 scripts/marketing/tts.py

# 2. Record the reel — captions dwell exactly as long as their voice-over clip
export MARKETING_CAPTIONS="$PWD/scripts/marketing/captions.built.json"
export MARKETING_TIMELINE="$PWD/scripts/marketing/timeline.json"
yarn bddgen
npx playwright test --project=marketing --grep "Marketing reel" --workers=1

# 3. Assemble: place each clip at its caption's moment + mux onto the video → assets/marketing.mp4
#    --sync-ms / MARKETING_SYNC_MS nudges audio vs captions (the recording's video starts a few
#    seconds before the reel timeline; ~3400ms compensates that lead on this setup).
MARKETING_SYNC_MS=3400 python3 scripts/marketing/build.py
```

To re-check sync, extract a frame at a caption's audio mid-point and confirm the matching
subtitle is on screen: `ffmpeg -ss 24 -i assets/marketing.mp4 -frames:v 1 /tmp/f.png`.

Notes:
- Source of truth for the script is the `I subtitle "..."` lines in `marketing.feature`.
- `STYLETTS2_DIR` (default `/Users/a1/Project/styletts2`) and `MARKETING_VOICE` (default `olivia`) override TTS.
- Verdicts are deterministic (fake provider) so the reel always shows clean intended / noise / bug.
