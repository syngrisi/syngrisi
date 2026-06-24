#!/usr/bin/env python3
"""Assemble the marketing reel: place each voice-over clip at the moment its caption
appeared (from the reel timeline) and mux onto the recorded Playwright video → mp4.

    python3 build.py [--video path/to/video.webm] [--out assets/marketing.mp4]

Inputs:
    captions.built.json  — text → audio clip (from tts.py)
    timeline.json        — text → offsetMs (written during the recording run; MARKETING_TIMELINE)
Requires ffmpeg on PATH.
"""
import argparse
import glob
import json
import os
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
E2E = os.path.normpath(os.path.join(HERE, '..', '..'))
REPO = os.path.normpath(os.path.join(E2E, '..', '..', '..'))


def newest_webm() -> str:
    candidates = glob.glob(os.path.join(E2E, '**', '*.webm'), recursive=True)
    candidates = [c for c in candidates if 'node_modules' not in c]
    if not candidates:
        raise SystemExit('no recorded .webm found — run the marketing recording first')
    return max(candidates, key=os.path.getmtime)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--video', default=None)
    ap.add_argument('--out', default=os.path.join(REPO, 'assets', 'marketing.mp4'))
    ap.add_argument('--timeline', default=os.environ.get('MARKETING_TIMELINE', os.path.join(HERE, 'timeline.json')))
    ap.add_argument('--sync-ms', type=int, default=int(os.environ.get('MARKETING_SYNC_MS', '0')),
                    help='global audio shift in ms (+ = delay audio); tune if voice leads/lags captions')
    args = ap.parse_args()

    video = args.video or newest_webm()
    captions = {c['text']: c for c in json.load(open(os.path.join(HERE, 'captions.built.json')))['captions']}
    timeline = json.load(open(args.timeline))['captions']

    clips = []
    for entry in timeline:
        cap = captions.get(entry['text'])
        if not cap:
            print(f'WARN: no audio for caption {entry["text"]!r}, skipping')
            continue
        clips.append((cap['audio'], int(entry['offsetMs']), int(cap['durationMs'])))

    if not clips:
        raise SystemExit('no clips to place — check captions.built.json / timeline.json')

    # Each caption's audio is placed at the moment the caption appeared (timeline offset, ms),
    # nudged by --sync-ms if needed. Clip offsets stay absolute on the video timeline.
    lead_ms = 1200
    tail_ms = 1000
    clips = [(audio, off + args.sync_ms, dur) for audio, off, dur in clips]
    trim_ms = max(0, min(off for _, off, _ in clips) - lead_ms)   # dead pre-roll to cut
    end_ms = max(off + dur for _, off, dur in clips) + tail_ms     # trailing dead air to cut

    inputs = ['-i', video]
    for audio, _, _ in clips:
        inputs += ['-i', audio]
    parts = []
    for idx, (_, off, _) in enumerate(clips, start=1):
        parts.append(f'[{idx}:a]adelay={off}:all=1[a{idx}]')
    mix_in = ''.join(f'[a{idx}]' for idx in range(1, len(clips) + 1))
    parts.append(f'{mix_in}amix=inputs={len(clips)}:normalize=0[aout]')
    filter_complex = ';'.join(parts)

    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    # Output-side -ss/-t = frame-accurate: video and the mixed audio are trimmed together, so
    # they stay in sync (input-side -ss jumps to a keyframe and desyncs webm).
    cmd = [
        'ffmpeg', '-y', *inputs,
        '-filter_complex', filter_complex,
        '-map', '0:v', '-map', '[aout]',
        '-ss', f'{trim_ms / 1000:.3f}', '-t', f'{(end_ms - trim_ms) / 1000:.3f}',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'medium',
        '-c:a', 'aac', '-b:a', '160k',
        args.out,
    ]
    print('video:', video, '| sync_ms:', args.sync_ms, '| trim_ms:', trim_ms)
    print('clips:', [(os.path.basename(a), o) for a, o, _ in clips])
    subprocess.run(cmd, check=True)
    print(f'\nwrote {args.out}')


if __name__ == '__main__':
    main()
