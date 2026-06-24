import * as React from 'react';
import { Badge, Tooltip, Loader } from '@mantine/core';
import { TriageIcon } from '@shared/components/Check/triageIcons';

const verdictColor = (verdict: string) => {
    const map = {
        intended_change: 'green',
        likely_bug: 'red',
        noise: 'gray',
        uncertain: 'yellow',
        unknown: 'gray',
        cancelled: 'gray',
    } as { [key: string]: string };
    return map[verdict] || 'gray';
};

const verdictLabel = (verdict: string) => {
    const map = {
        intended_change: 'intended',
        likely_bug: 'bug?',
        noise: 'noise',
        uncertain: 'uncertain',
        unknown: 'unknown',
        cancelled: 'cancelled',
    } as { [key: string]: string };
    return map[verdict] || verdict;
};

// Built-in icon fallback for the default verdicts (when triage.icon is absent, e.g. old data).
const verdictIcon = (verdict: string) => ({
    intended_change: 'check',
    likely_bug: 'bug',
    noise: 'wave',
    uncertain: 'question',
    unknown: 'help',
    cancelled: 'ban',
} as { [key: string]: string })[verdict];

interface Props {
    check: any;
    size?: number | string;
    variant?: string;
    onClick?: (verdict: string) => void;
    compact?: boolean; // icon-only (grid badges); full = icon + text
}

// AI Triage verdict chip. Renders nothing when the check has no triage info.
export function TriageVerdict({ check, size = 'sm', variant = 'light', onClick, compact = false }: Props) {
    const verdict: string | undefined = check?.triage?.verdict;
    const pending = check?.triage?.pending === true;

    // Awaiting analysis (triage enabled, not yet classified) → in-progress indicator.
    if (!verdict && pending) {
        return (
            <Tooltip label="AI Triage in progress…" withinPortal>
                <Badge
                    color="blue"
                    variant={variant}
                    size={size}
                    leftSection={<Loader size={12} color="blue" />}
                    data-test="triage-verdict"
                    data-triage-pending="true"
                    styles={compact ? { section: { marginRight: 0 } } : undefined}
                >
                    {compact ? '' : 'analyzing…'}
                </Badge>
            </Tooltip>
        );
    }
    if (!verdict) return null;
    const confidence = check?.triage?.confidence;
    const reason = check?.triage?.reason;
    const autoAccepted = check?.triage?.autoAccepted === true;
    // Prefer the denormalized per-project label/color/icon; fall back to the built-in maps.
    const color = check?.triage?.color || verdictColor(verdict);
    const label = check?.triage?.label || verdictLabel(verdict);
    const iconName = check?.triage?.icon || verdictIcon(verdict);
    const base = autoAccepted
        ? `Accepted by AI: ${label}${typeof confidence === 'number' ? ` (conf ${confidence})` : ''}${reason ? ` — ${reason}` : ''}`
        : `AI: ${label}${typeof confidence === 'number' ? ` (conf ${confidence})` : ''}${reason ? ` — ${reason}` : ''}`;
    // clickable preview badge → clicking filters the current run by this verdict
    const tip = onClick ? `${base}\nClick to filter this run by this verdict` : base;

    const fullText = autoAccepted
        ? `${label} • Accepted by AI${typeof confidence === 'number' ? ` ${confidence}` : ''}`
        : `${label}${typeof confidence === 'number' ? ` ${confidence}` : ''}`;

    return (
        <Tooltip label={tip} multiline withinPortal style={{ whiteSpace: 'pre-line' }}>
            <Badge
                color={color}
                variant={variant}
                size={size}
                leftSection={<TriageIcon name={iconName} size={14} />}
                data-test="triage-verdict"
                data-triage-verdict={verdict}
                data-triage-confidence={typeof confidence === 'number' ? String(confidence) : ''}
                data-triage-auto-accepted={autoAccepted ? 'true' : undefined}
                // icon-only: keep the badge compact (the leftSection icon remains visible)
                styles={compact ? { section: { marginRight: 0 } } : undefined}
                style={onClick ? { cursor: 'pointer' } : undefined}
                onClick={onClick ? () => onClick(verdict) : undefined}
            >
                {compact ? '' : fullText}
            </Badge>
        </Tooltip>
    );
}
