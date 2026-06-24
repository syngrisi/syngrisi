import * as React from 'react';
import { Badge, Tooltip, Loader } from '@mantine/core';
import { TriageIcon } from '@shared/components/Check/triageIcons';

// Built-in display fallback for the default verdicts (used when the denormalized
// triage.color/label/icon are absent, e.g. old data). One cohesive map.
const VERDICT_FALLBACK: Record<string, { color: string; label: string; icon: string }> = {
    intended_change: { color: 'green', label: 'intended', icon: 'check' },
    likely_bug: { color: 'red', label: 'bug?', icon: 'bug' },
    noise: { color: 'gray', label: 'noise', icon: 'wave' },
    uncertain: { color: 'yellow', label: 'uncertain', icon: 'question' },
    unknown: { color: 'gray', label: 'unknown', icon: 'help' },
    cancelled: { color: 'gray', label: 'cancelled', icon: 'ban' },
};

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
    // Prefer the denormalized per-project label/color/icon; fall back to the built-in map.
    const fb = VERDICT_FALLBACK[verdict] || { color: 'gray', label: verdict, icon: '' };
    const color = check?.triage?.color || fb.color;
    const label = check?.triage?.label || fb.label;
    const iconName = check?.triage?.icon || fb.icon;
    const confSuffix = typeof confidence === 'number' ? ` (conf ${confidence})` : '';
    const reasonSuffix = reason ? ` — ${reason}` : '';
    const confShort = typeof confidence === 'number' ? ` ${confidence}` : '';
    const base = `${autoAccepted ? 'Accepted by AI' : 'AI'}: ${label}${confSuffix}${reasonSuffix}`;
    // clickable preview badge → clicking filters the current run by this verdict
    const tip = onClick ? `${base}\nClick to filter this run by this verdict` : base;
    const fullText = autoAccepted ? `${label} • Accepted by AI${confShort}` : `${label}${confShort}`;

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
