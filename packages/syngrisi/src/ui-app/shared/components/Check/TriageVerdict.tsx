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
    const tip = `AI: ${verdict}${typeof confidence === 'number' ? ` (conf ${confidence})` : ''}${reason ? ` — ${reason}` : ''}`;

    return (
        <Tooltip label={tip} multiline withinPortal>
            <Badge
                color={verdictColor(verdict)}
                variant={variant}
                size={size}
                data-test="triage-verdict"
                data-triage-verdict={verdict}
                data-triage-confidence={typeof confidence === 'number' ? String(confidence) : ''}
                style={onClick ? { cursor: 'pointer' } : undefined}
                onClick={onClick ? () => onClick(verdict) : undefined}
            >
                {`AI: ${verdictLabel(verdict)}${typeof confidence === 'number' ? ` ${confidence}` : ''}`}
            </Badge>
        </Tooltip>
    );
}
