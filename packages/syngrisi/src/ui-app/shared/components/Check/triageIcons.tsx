import * as React from 'react';
import {
    IconWaveSine, IconCircleCheck, IconQuestionMark, IconBug, IconAlertTriangle, IconEye,
    IconFlag, IconSparkles, IconX, IconPhoto, IconBolt, IconPalette, IconRuler, IconClock,
    IconBan, IconHelpCircle, IconPointFilled,
} from '@tabler/icons-react';

// Curated icon set selectable per verdict (name -> component). Keep names stable: they are stored.
const ICONS: Record<string, React.ComponentType<any>> = {
    wave: IconWaveSine,
    check: IconCircleCheck,
    question: IconQuestionMark,
    bug: IconBug,
    alert: IconAlertTriangle,
    eye: IconEye,
    flag: IconFlag,
    sparkles: IconSparkles,
    x: IconX,
    photo: IconPhoto,
    bolt: IconBolt,
    palette: IconPalette,
    ruler: IconRuler,
    clock: IconClock,
    ban: IconBan,
    help: IconHelpCircle,
};

export const TRIAGE_ICON_NAMES = Object.keys(ICONS);

// Render a verdict icon by name; falls back to a neutral dot for unknown/empty names.
export function TriageIcon({ name, size = 14, stroke = 1.8 }: { name?: string; size?: number; stroke?: number }) {
    const Cmp = (name && ICONS[name]) || IconPointFilled;
    return <Cmp size={size} stroke={stroke} />;
}
