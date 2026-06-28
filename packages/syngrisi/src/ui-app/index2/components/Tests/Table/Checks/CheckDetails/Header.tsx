import * as React from 'react';
import { ActionIcon, Group, Loader, Text, Tooltip, useMantineTheme, useComputedColorScheme } from '@mantine/core';
import { useLocalStorage, useClipboard } from '@mantine/hooks';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { useMemo } from 'react';
import { Status } from '@shared/components/Check/Status';
import { TriageVerdict } from '@shared/components/Check/TriageVerdict';
import { ViewPortLabel } from '@index/components/Tests/Table/Checks/ViewPortLabel';
import { sizes } from '@index/components/Tests/Table/Checks/checkSizes';
import { OsIcon } from '@shared/components/Check/OsIcon';
import { BrowserIcon } from '@shared/components/Check/BrowserIcon';
import { formatToleranceThreshold, getStatusMessage } from '@shared/utils/utils';

interface Props {
    classes: any
    currentCheck: any
    toleranceThreshold?: number
    toleranceSource?: 'api' | 'baseline'
}

// Build a Markdown summary of the check for the clipboard (title + all key fields).
function buildCheckMarkdown(check: any): string {
    const status = Array.isArray(check?.status) ? check.status[0] : check?.status;
    const verdict = check?.triage?.verdict;
    let diff = '';
    try {
        const r = check?.result ? JSON.parse(check.result) : null;
        const m = r?.misMatchPercentage ?? r?.rawMisMatchPercentage;
        if (m !== undefined && m !== null && `${m}`.length > 0) diff = `${m}%`;
    } catch { /* result not JSON — skip diff */ }
    const browser = [check?.browserName, check?.browserVersion].filter(Boolean).join(' ');
    const date = check?.createdDate ? new Date(check.createdDate).toLocaleString() : '';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = check?._id ? `${origin}/?checkId=${check._id}&modalIsOpen=true` : '';

    const rows: Array<[string, any]> = [
        ['Project', check?.app?.name],
        ['Suite', check?.suite?.name],
        ['Test', check?.test?.name],
        ['Run', check?.run?.name],
        ['Resolution', check?.viewport],
        ['Browser', browser],
        ['OS', check?.os],
        ['Branch', check?.branch],
        ['Diff', diff],
        ['Date', date],
        ['ID', check?._id ? `\`${check._id}\`` : ''],
        ['Link', url],
    ];
    const head = `**${check?.name ?? 'Check'}** — ${String(status ?? '').toUpperCase()}${verdict ? ` · Triage: ${verdict}` : ''}`;
    const body = rows.filter(([, v]) => v).map(([k, v]) => `- **${k}:** ${v}`).join('\n');
    return `${head}\n\n${body}`;
}

export const Header = React.memo(function Header(
    {
        classes,
        currentCheck,
        toleranceThreshold = 0,
        toleranceSource,
    }: Props,
) {
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme();
    const clipboard = useClipboard({ timeout: 1500 });
    const [checksViewSize] = useLocalStorage({ key: 'check-view-size', defaultValue: 'medium' });
    const textLoader = <Loader size="xs" color="blue" variant="dots" />;
    const statusMsg = currentCheck.status ? getStatusMessage(currentCheck) : textLoader;

    const iconsColor = useMemo(
        () => (colorScheme === 'dark'
            ? theme.colors.gray[3]
            : theme.colors.dark[9]), [colorScheme],
    );
    const formattedToleranceThreshold = formatToleranceThreshold(Number(toleranceThreshold));

    return (
        <Group
            justify="space-between"
            style={{ width: 'calc(100% - 56px)', minWidth: 0 }}
            data-check-header-name={currentCheck.name}
            data-check-header-ready={currentCheck.name && currentCheck.status ? 'true' : 'false'}
            wrap="nowrap"
        >
            <Group
                justify="flex-start"
                align="center"
                gap="xs"
                style={{ position: 'relative', flex: 1, minWidth: 0 }}
                wrap="nowrap"
                data-test="full-check-path"
            >
                <Tooltip
                    label={
                        (
                            <Group gap={4}>
                                {
                                    currentCheck.status
                                        ? (<Status size="lg" check={currentCheck} variant="filled" />)
                                        : textLoader
                                }
                                {statusMsg}
                            </Group>
                        )
                    }
                    withinPortal
                >
                    <Group align="center" data-check="status" gap="xs">
                        <Status size="lg" check={currentCheck} variant="filled" />
                        <TriageVerdict check={currentCheck} size="lg" />
                    </Group>
                </Tooltip>

                <Group
                    wrap="nowrap"
                    gap={0}
                    style={{ minWidth: 0, flex: 1 }}
                >
                    <Tooltip
                        withinPortal
                        label={`Project: ${currentCheck?.app?.name}`}
                    >
                        <Text
                            data-check="app-name"
                            size="sm"
                            style={{ flexShrink: 1, minWidth: 0, ...classes.checkPathFragment }}
                        >
                            {currentCheck?.app?.name}
                        </Text>
                    </Tooltip>
                    <Tooltip
                        withinPortal
                        label={`Suite: ${currentCheck?.suite?.name}`}
                    >
                        <Text
                            data-check="suite-name"
                            size="sm"
                            style={{ flexShrink: 500, minWidth: 0, ...classes.checkPathFragment }}
                        >
                            &nbsp;/&nbsp;
                            {currentCheck?.suite?.name}
                        </Text>
                    </Tooltip>
                    <Tooltip
                        withinPortal
                        label={`Test: ${currentCheck?.test?.name}`}
                    >
                        <Text
                            data-check="test-name"
                            size="sm"
                            style={{ flexShrink: 5, minWidth: 0, ...classes.checkPathFragment }}
                        >
                            &nbsp;/&nbsp;
                            {currentCheck?.test?.name}
                        </Text>
                    </Tooltip>
                    <Tooltip
                        withinPortal
                        label={`Check: ${currentCheck.name}`}

                    >
                        <Text
                            data-check="check-name"
                            fz={14}
                            style={{ flexShrink: 1, minWidth: 0, ...classes.checkPathFragment }}
                            lineClamp={1}
                        >
                            &nbsp;/&nbsp;
                            {currentCheck.name || textLoader}
                        </Text>
                    </Tooltip>
                </Group>
            </Group>

            <Group
                wrap="nowrap"
                gap="xs"
                style={{ flexShrink: 0 }}
            >
                <Tooltip label={clipboard.copied ? 'Copied!' : 'Copy check info (Markdown)'} withinPortal>
                    <ActionIcon
                        variant="subtle"
                        color={clipboard.copied ? 'green' : 'gray'}
                        size={32}
                        onClick={() => clipboard.copy(buildCheckMarkdown(currentCheck))}
                        data-test="copy-check-info"
                        aria-label="Copy check info"
                    >
                        {clipboard.copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                    </ActionIcon>
                </Tooltip>
                {
                    toleranceThreshold > 0 && (
                        <Tooltip
                            label={
                                toleranceSource === 'api'
                                    ? `Tolerance: ${formattedToleranceThreshold}% — set via API for this check`
                                    : `Tolerance: ${formattedToleranceThreshold}% — from baseline settings`
                            }
                            withinPortal
                        >
                            <Group
                                gap={6}
                                wrap="nowrap"
                                data-check="tolerance-indicator"
                                data-tolerance-source={toleranceSource || 'baseline'}
                            >
                                <ActionIcon size={24} variant="filled" color={toleranceSource === 'api' ? 'violet' : 'orange'}>
                                    <Text fz={11} fw={700}>%</Text>
                                </ActionIcon>
                                <Text fz={12} c={toleranceSource === 'api' ? 'violet' : 'orange'}>
                                    Tol {formattedToleranceThreshold}%
                                </Text>
                            </Group>
                        </Tooltip>
                    )
                }

                <Tooltip
                    label={
                        currentCheck?.viewport
                    }
                    withinPortal
                >
                    <Text lineClamp={1} style={{ overflow: 'visible' }} data-check="viewport">
                        {
                            currentCheck?.viewport
                                ? (
                                    <ViewPortLabel
                                        check={currentCheck}
                                        color="blue"
                                        sizes={sizes}
                                        size="lg"
                                        checksViewSize={checksViewSize}
                                        fontSize="12px"
                                    />
                                )
                                : textLoader
                        }

                    </Text>
                </Tooltip>

                <Tooltip
                    data-check="os-label"
                    label={
                        currentCheck?.os
                    }
                    withinPortal
                >
                    <Group gap={8} wrap="nowrap">
                        <ActionIcon variant="light" size={32} p={4} ml={4}>
                            {
                                currentCheck?.os
                                    ? (
                                        <OsIcon
                                            data-check="os-icon"
                                            size={20}
                                            color={iconsColor}
                                            os={currentCheck?.os}
                                        />
                                    )
                                    : textLoader
                            }
                        </ActionIcon>
                        <Text data-check="os" fz={12} lineClamp={1}>{currentCheck?.os}</Text>
                    </Group>
                </Tooltip>

                <Tooltip
                    label={
                        currentCheck?.browserFullVersion
                            ? `${currentCheck?.browserFullVersion}`
                            : `${currentCheck?.browserVersion}`
                    }
                    withinPortal
                >
                    <Group gap={8} wrap="nowrap">
                        <ActionIcon variant="light" size={32} p={4}>
                            {
                                currentCheck?.browserName
                                    ? (
                                        <BrowserIcon
                                            data-check="browser-icon"
                                            size={20}
                                            color={iconsColor}
                                            browser={currentCheck?.browserName}
                                        />
                                    )
                                    : textLoader
                            }
                        </ActionIcon>
                        <Text
                            data-check="browser"
                            lineClamp={1}
                            fz={12}
                        >

                            {currentCheck?.browserName}
                            {
                                currentCheck?.browserVersion
                                    ? ` - ${currentCheck?.browserVersion}`
                                    : ''
                            }
                        </Text>
                    </Group>
                </Tooltip>
            </Group>
        </Group>

    );
});
