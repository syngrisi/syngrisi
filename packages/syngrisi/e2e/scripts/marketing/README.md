# Marketing reel pipeline

Turns `features/DEMO/marketing.feature` into a short, subtitled, voiced-over MP4 for the README.
The scenario is recorded **silently** (compact outlined captions, no spoken audio); the voice-over
is generated with StyleTTS2 (voice **Olivia**) and muxed in afterwards. Verdicts use the deterministic
fake provider, so the reel always shows clean intended / noise / bug results.

Output: `assets/marketing.mp4` (1440×810). The mp4 is **not** committed — upload it as a GitHub
release asset and link it from the README.

## Files

| File | Role |
|------|------|
| `features/DEMO/marketing.feature` | **Source of truth** — the scenario: scenes, captions, clicks, highlights. |
| `features/DEMO/screenshots.feature` | Captures still AI screenshots (no subtitles) → `reports/marketing-shots/`. |
| `scripts/marketing/tts.py` | Reads caption lines from the feature, synthesizes each with StyleTTS2 → `captions.built.json`. |
| `scripts/marketing/build.py` | Places each voice-over clip at its caption moment + muxes onto the recording → `assets/marketing.mp4`. |
| `steps/common/demo.steps.ts` | Marketing/demo step definitions (captions, reveal, ripple, highlight, scroll, screenshots). |
| `support/demo/subtitle.utils.ts` | Compact outlined captions (no background). |
| `support/demo/annotate.utils.ts` | Red verdict arrows + labels (additive, verdict-filtered). |
| `support/demo/ripple.utils.ts` | Click-highlight ripple, installed for the whole reel. |
| `support/demo/highlight.utils.ts` | "Liquid glass" element highlight. |
| `captions.built.json`, `timeline.json` | Generated artifacts (gitignored). |

## Scenario (current)

The reel is one scenario in `marketing.feature`, in 6 beats — edit there, the rest follows:

1. **Intro** — grid full of checks across browsers/platforms/devices.
2. **Big intended change** — open the check, flip diff / actual / expected / slider, accept as new baseline.
3. **Subtle change** — highlighter pinpoints the diff, automatic ignore-regions mask noise.
4. **Admin AI** — provider form, per-project verdicts + auto-accept threshold, and the editable
   system prompt with `{{placeholders}}`.
5. **Triage** — verdict arrows reveal one at a time (synced to the voice-over), then group by verdict.
6. **Closing** — sign-off line.

## How to (re)build

```bash
cd packages/syngrisi/e2e

# 1. Voice-over: synthesize every caption (StyleTTS2 / Olivia) → captions.built.json
MARKETING_VOICE=Olivia python3 scripts/marketing/tts.py        # re-run whenever caption TEXT changes

# 2. Record the reel — captions dwell exactly as long as their voice-over clip
export MARKETING_CAPTIONS="$PWD/scripts/marketing/captions.built.json"
export MARKETING_TIMELINE="$PWD/scripts/marketing/timeline.json"
yarn bddgen                                                    # ALWAYS regenerate before recording
npx playwright test --project=marketing --grep "Marketing reel" --workers=1

# 3. Assemble + mux → assets/marketing.mp4
MARKETING_SYNC_MS=3400 python3 scripts/marketing/build.py
```

Still AI screenshots for the README:

```bash
yarn bddgen && npx playwright test --project=marketing --grep "Capture AI screenshots" --workers=1
# → reports/marketing-shots/*.png
```

## Captions & marketing steps

Captions are the quoted strings in two step forms (both picked up by `tts.py`):

- `When I subtitle "<text>"` — show the caption for the length of its voice-over clip.
- `When I reveal verdicts with caption "<text>"` — same, plus reveal the verdict arrows one group at
  a time, timed to when each verdict is named.

Other reel steps: `I start the reel timeline` (t=0; also installs the click ripple),
`I highlight element "<sel>"` / `I clear highlight`, `I scroll to element "<sel>"`,
`I save a screenshot to "<path>"`.

## Tuning knobs

- **Audio vs video sync** — `MARKETING_SYNC_MS` (default 0; we use **3400**). The recording's video
  starts a few seconds before the reel timeline; this shifts the audio to compensate. Re-measure if
  the Background timing changes (see "Verify" below).
- **Arrow reveal timing** — the `reveals` fractions in the `I reveal verdicts with caption` step
  (`steps/common/demo.steps.ts`): `[fraction-of-clip, [verdicts]]`, ordered to match the sentence.
  Lower = arrow appears earlier. Tune against the built audio (use `silencedetect` on
  `scripts/marketing/audio/scene_NN.wav` to find where each verdict word lands).
- **Caption look** — `support/demo/subtitle.utils.ts`.
- **Viewport/resolution** — `playwright.config.ts`, `marketing` project (`viewport` + `video.size`).
- **Voice** — `MARKETING_VOICE` (default `Olivia`), `STYLETTS2_DIR` (default `/Users/a1/Project/styletts2`).

## Verify

Extract a frame at a caption's audio mid-point and confirm the matching subtitle/visual is on screen:

```bash
ffmpeg -ss 53 -i assets/marketing.mp4 -frames:v 1 /tmp/f.png   # then open /tmp/f.png
```

`build.py` prints each clip's placed offset (ms) — a caption's mp4 time is roughly `offset/1000`.
For arrow sync, sample a few frames across the verdict scene and check arrows appear in order with
the spoken verdicts.

## Gotchas

- **Visual timing lives in the recording.** Changing arrow fractions, click order, dwell, or the
  ripple requires a **re-record** (step 2), not just a rebuild.
- **Re-run `tts.py` only when caption text changes.** Mapping is by text, so clip order doesn't matter.
- **Voice must be `Olivia` (capitalized).** Lowercase `olivia` is rejected by StyleTTS2's `say.py`.
- **StyleTTS2 writes float32 WAV** (fmt tag 3) — Python's `wave` can't read it, so `tts.py` uses
  `ffprobe` for durations.
- **No duplicate step names.** A step text defined in both `demo.steps.ts` and another file makes
  `bddgen` fail with "Multiple definitions matched", and the stale generated spec is used silently.
- **`yarn bddgen` before every record**, or new/edited steps won't be in the generated spec.
