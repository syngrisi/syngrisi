import * as React from 'react';
import { Badge, Tooltip } from '@mantine/core';

const verdictColor = (verdict: string) => {
    const map = {
        intended_change: 'green',
        likely_bug: 'red',
        noise: 'gray',
        uncertain: 'yellow',
    } as { [key: string]: string };
    return map[verdict] || 'gray';
};

const verdictLabel = (verdict: string) => {
    const map = {
        intended_change: 'intended',
        likely_bug: 'bug?',
        noise: 'noise',
        uncertain: 'uncertain',
    } as { [key: string]: string };
    return map[verdict] || verdict;
};

interface Props {
    check: any;
    size?: number | string;
    variant?: string;
    onClick?: (verdict: string) => void;
}

// AI Triage verdict chip. Renders nothing when the check has no triage verdict.
export function TriageVerdict({ check, size = 'sm', variant = 'light', onClick }: Props) {
    const verdict: string | undefined = check?.triage?.verdict;
    if (!verdict) return null;
    const confidence = check?.triage?.confidence;
    const reason = check?.triage?.reason;
    const autoAccepted = check?.triage?.autoAccepted === true;
    // Prefer the denormalized per-project label/color; fall back to the built-in map.
    const color = check?.triage?.color || verdictColor(verdict);
    const label = check?.triage?.label || verdictLabel(verdict);
    const tip = autoAccepted
        ? `Accepted by AI${typeof confidence === 'number' ? ` (conf ${confidence})` : ''}${reason ? ` — ${reason}` : ''}`
        : `AI: ${label}${typeof confidence === 'number' ? ` (conf ${confidence})` : ''}${reason ? ` — ${reason}` : ''}`;

    return (
        <Tooltip label={tip} multiline withinPortal>
            <Badge
                color={color}
                variant={variant}
                size={size}
                data-test="triage-verdict"
                data-triage-verdict={verdict}
                data-triage-confidence={typeof confidence === 'number' ? String(confidence) : ''}
                data-triage-auto-accepted={autoAccepted ? 'true' : undefined}
                style={onClick ? { cursor: 'pointer' } : undefined}
                onClick={onClick ? () => onClick(verdict) : undefined}
            >
                {autoAccepted
                    ? `✓ Accepted by AI${typeof confidence === 'number' ? ` ${confidence}` : ''}`
                    : `AI: ${label}${typeof confidence === 'number' ? ` ${confidence}` : ''}`}
            </Badge>
        </Tooltip>
    );
}
