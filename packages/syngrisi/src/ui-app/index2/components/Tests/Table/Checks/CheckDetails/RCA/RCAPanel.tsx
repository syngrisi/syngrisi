/**
 * RCA (Root Cause Analysis) Panel Component
 *
 * Displays DOM diff analysis results and allows users to explore
 * changes between baseline and actual screenshots.
 */

import React, { useState } from 'react';
import {
    Paper,
    Text,
    Tabs,
    Stack,
    Group,
    Badge,
    ScrollArea,
    Accordion,
    Box,
    ThemeIcon,
    Loader,
    Center,
} from '@mantine/core';
import {
    IconAlertTriangle,
    IconPlus,
    IconMinus,
    IconPencil,
    IconArrowsMove,
    IconTextCaption,
    IconListDetails,
    IconCode,
} from '@tabler/icons-react';

import {
    DOMNode,
    DOMChange,
    DOMDiffResult,
    LogicalIssue,
    PropertyChange,
    DOMChangeType,
    DOMRect,
} from '@shared/interfaces/IRCA';

interface RCAPanelProps {
    isLoading: boolean;
    error: string | null;
    diffResult: DOMDiffResult | null;
    selectedChange: DOMChange | null;
    selectedElement: DOMNode | null;
    onSelectChange: (change: DOMChange | null) => void;
    onClose: () => void;
}

/**
 * Get icon for change type
 */
function getChangeIcon(type: DOMChangeType) {
    switch (type) {
        case 'added':
            return <IconPlus size={14} />;
        case 'removed':
            return <IconMinus size={14} />;
        case 'style_changed':
            return <IconPencil size={14} />;
        case 'geometry_changed':
            return <IconArrowsMove size={14} />;
        case 'content_changed':
            return <IconTextCaption size={14} />;
        default:
            return <IconCode size={14} />;
    }
}

/**
 * Get color for change type
 */
function getChangeColor(type: DOMChangeType): string {
    switch (type) {
        case 'added':
            return 'green';
        case 'removed':
            return 'red';
        case 'style_changed':
            return 'orange';
        case 'geometry_changed':
            return 'blue';
        case 'content_changed':
            return 'grape';
        default:
            return 'gray';
    }
}

/**
 * Get severity color
 */
function getSeverityColor(severity: string): string {
    switch (severity) {
        case 'high':
            return 'red';
        case 'medium':
            return 'orange';
        case 'low':
            return 'blue';
        default:
            return 'gray';
    }
}

/**
 * Format XPath for display
 */
function formatXPath(xpath: string) {
    const parts = xpath.split('/');
    const relevantParts = parts.slice(-3);
    return (
        <Group gap={4} style={{ flexWrap: 'wrap', rowGap: 0 }}>
            <Text size="xs" c="dimmed">... &gt;</Text>
            {relevantParts.map((part, i) => (
                <React.Fragment key={i}>
                    {i > 0 && <Text size="xs" c="dimmed">&gt;</Text>}
                    <Text size="xs" c="blue" style={{ wordBreak: 'break-all' }}>{part}</Text>
                </React.Fragment>
            ))}
        </Group>
    );
}

/**
 * Attributes Diff Component
 */
function AttributesDiff({ properties }: { properties: PropertyChange[] }) {
    if (!properties || properties.length === 0) return null;
    return (
        <Paper p="xs" withBorder bg="var(--mantine-color-dark-8)">
            <Text size="xs" fw={500} mb="xs" c="dimmed">Attributes</Text>
            <Stack gap={4}>
                {properties.map((prop, idx) => (
                    <Box key={idx}>
                        {prop.baselineValue && (
                            <Group gap="xs" style={{ backgroundColor: 'rgba(224, 49, 49, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                                <Text size="xs" c="red" style={{ fontFamily: 'monospace' }}>- {prop.property}: {prop.baselineValue}</Text>
                            </Group>
                        )}
                        {prop.actualValue && (
                            <Group gap="xs" style={{ backgroundColor: 'rgba(47, 158, 68, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                                <Text size="xs" c="green" style={{ fontFamily: 'monospace' }}>+ {prop.property}: {prop.actualValue}</Text>
                            </Group>
                        )}
                    </Box>
                ))}
            </Stack>
        </Paper>
    );
}

/**
 * Bounding Box Visualizer Component
 */
function BoundingBoxVisualizer({ baseline, actual }: { baseline?: DOMNode, actual?: DOMNode }) {
    if (!baseline?.rect && !actual?.rect) return null;

    const bRect = baseline?.rect;
    const aRect = actual?.rect;

    return (
        <Paper p="xs" withBorder bg="var(--mantine-color-dark-8)">
            <Text size="xs" fw={500} mb="xs" c="dimmed">Bounding box</Text>
            <Group justify="center" gap="xl" align="center">
                {/* Position */}
                <Stack gap={4} align="flex-end">
                    <Text size="xs" c="dimmed" fz={10}>POSITION</Text>
                    <Group gap={8}>
                        <Stack gap={0} align="flex-end">
                            {bRect && <Text size="xs" c="red" td="line-through" style={{ fontFamily: 'monospace' }}>{bRect.x.toFixed(1)}</Text>}
                            {aRect && <Text size="xs" c="green" style={{ fontFamily: 'monospace' }}>{aRect.x.toFixed(1)}</Text>}
                        </Stack>
                        <Stack gap={0} align="flex-end">
                            {bRect && <Text size="xs" c="red" td="line-through" style={{ fontFamily: 'monospace' }}>{bRect.y.toFixed(1)}</Text>}
                            {aRect && <Text size="xs" c="green" style={{ fontFamily: 'monospace' }}>{aRect.y.toFixed(1)}</Text>}
                        </Stack>
                    </Group>
                </Stack>

                {/* Box Visualization */}
                <Box
                    style={{
                        position: 'relative',
                        width: 120,
                        height: 70,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--mantine-color-dark-4)',
                        backgroundColor: 'var(--mantine-color-dark-7)',
                        borderRadius: '4px'
                    }}
                >
                     <Stack gap={0} align="center">
                        {bRect && (
                            <Text size="xs" c="red" td="line-through" style={{ fontFamily: 'monospace' }}>
                                {bRect.width} x {bRect.height}
                            </Text>
                        )}
                        {aRect && (
                            <Text size="xs" c="green" style={{ fontFamily: 'monospace' }}>
                                {aRect.width} x {aRect.height}
                            </Text>
                        )}
                    </Stack>
                </Box>
            </Group>
        </Paper>
    );
}

/**
 * Change item component
 */
function ChangeItem({
    change,
    onSelect,
}: {
    change: DOMChange;
    onSelect: () => void;
}) {
    const color = getChangeColor(change.type);
    const icon = getChangeIcon(change.type);

    return (
        <Accordion.Item value={change.id} style={{ borderColor: 'var(--mantine-color-dark-4)', backgroundColor: 'var(--mantine-color-dark-6)', marginBottom: 4, borderRadius: 4 }}>
            <Accordion.Control onClick={onSelect}>
                <Group gap="xs" wrap="nowrap">
                    <ThemeIcon size="sm" variant="light" color={color} style={{ flexShrink: 0 }}>
                        {icon}
                    </ThemeIcon>
                    <Box style={{ flex: 1, overflow: 'hidden' }}>
                        {formatXPath(change.xpath)}
                    </Box>
                    <Badge size="xs" color={color} variant="light">
                        {change.type.replace('_', ' ')}
                    </Badge>
                </Group>
            </Accordion.Control>
            <Accordion.Panel>
                <Stack gap="xs">
                    <AttributesDiff properties={change.changedProperties || []} />
                    <BoundingBoxVisualizer baseline={change.baselineNode} actual={change.actualNode} />
                </Stack>
            </Accordion.Panel>
        </Accordion.Item>
    );
}

/**
 * Issue item component
 */
function IssueItem({
    issue,
    onSelectChange,
}: {
    issue: LogicalIssue;
    onSelectChange: (change: DOMChange) => void;
}) {
    return (
        <Accordion.Item value={issue.id}>
            <Accordion.Control>
                <Group gap="xs">
                    <ThemeIcon
                        size="sm"
                        variant="light"
                        color={getSeverityColor(issue.severity)}
                    >
                        <IconAlertTriangle size={14} />
                    </ThemeIcon>
                    <Text size="sm" fw={500} style={{ flex: 1 }}>
                        {issue.rootCause}
                    </Text>
                    <Badge size="xs" color={getSeverityColor(issue.severity)}>
                        {issue.severity}
                    </Badge>
                </Group>
            </Accordion.Control>
            <Accordion.Panel>
                <Text size="xs" c="dimmed" mb="sm">
                    {issue.description}
                </Text>
                <Text size="xs" fw={500} mb="xs">
                    Affected elements ({issue.affectedChanges.length}):
                </Text>
                <Accordion variant="separated" chevronPosition="left">
                    {issue.affectedChanges.map((change) => (
                        <ChangeItem
                            key={change.id}
                            change={change}
                            onSelect={() => onSelectChange(change)}
                        />
                    ))}
                </Accordion>
            </Accordion.Panel>
        </Accordion.Item>
    );
}

/**
 * Stats summary component
 */
function StatsSummary({ stats }: { stats: DOMDiffResult['stats'] }) {
    return (
        <Group gap="xs" data-test="rca-stats">
            <Badge size="sm" color="gray" variant="light" data-test="rca-stats-total">
                {stats.totalChanges} changes
            </Badge>
            {stats.addedNodes > 0 && (
                <Badge size="sm" color="green" variant="light" data-test="rca-stats-added">
                    +{stats.addedNodes} added
                </Badge>
            )}
            {stats.removedNodes > 0 && (
                <Badge size="sm" color="red" variant="light" data-test="rca-stats-removed">
                    -{stats.removedNodes} removed
                </Badge>
            )}
            {stats.styleChanges > 0 && (
                <Badge size="sm" color="orange" variant="light" data-test="rca-stats-style">
                    {stats.styleChanges} style
                </Badge>
            )}
        </Group>
    );
}

/**
 * Main RCA Panel component
 */
export function RCAPanel({
    isLoading,
    error,
    diffResult,
    selectedChange,
    onSelectChange,
    onClose,
}: RCAPanelProps) {
    const [activeTab, setActiveTab] = useState<string | null>('issues');

    if (isLoading) {
        return (
            <Paper
                p="md"
                radius={0}
                data-test="rca-panel"
                data-test-state="loading"
                style={{
                    height: '100%',
                    backgroundColor: 'transparent',
                }}
            >
                <Center style={{ height: '200px' }}>
                    <Stack align="center" gap="sm">
                        <Loader size="sm" data-test="rca-loader" />
                        <Text size="sm" c="dimmed">
                            Analyzing DOM changes...
                        </Text>
                    </Stack>
                </Center>
            </Paper>
        );
    }

    if (error) {
        return (
            <Paper
                p="md"
                radius={0}
                data-test="rca-panel"
                data-test-state="error"
                style={{
                    height: '100%',
                    backgroundColor: 'transparent',
                }}
            >
                <Stack align="center" gap="sm">
                    <ThemeIcon size="lg" variant="light" color="red">
                        <IconAlertTriangle size={20} />
                    </ThemeIcon>
                    <Text size="sm" c="red" ta="center" data-test="rca-error-message">
                        {error}
                    </Text>
                </Stack>
            </Paper>
        );
    }

    if (!diffResult || diffResult.changes.length === 0) {
        return (
            <Paper
                p="md"
                radius={0}
                data-test="rca-panel"
                data-test-state="no-changes"
                style={{
                    height: '100%',
                    backgroundColor: 'transparent',
                }}
            >
                <Stack align="center" gap="sm">
                    <Text size="sm" c="dimmed" ta="center" data-test="rca-no-changes-message">
                        No DOM changes detected.
                    </Text>
                    <Text size="xs" c="dimmed" ta="center">
                        The DOM structure is identical between baseline and actual.
                    </Text>
                </Stack>
            </Paper>
        );
    }

    return (
        <Paper
            radius={0}
            data-test="rca-panel"
            data-test-state="ready"
            data-test-changes-count={diffResult.changes.length}
            data-test-issues-count={diffResult.issues.length}
            style={{
                height: '100%',
                backgroundColor: 'transparent',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box p="sm" style={{ borderBottom: '1px solid var(--mantine-color-dark-5)' }}>
                <Group justify="space-between" align="center">
                    <Text size="sm" fw={600} data-test="rca-panel-title">
                        Root Cause Analysis
                    </Text>
                </Group>
            </Box>

            <Tabs
                value={activeTab}
                onChange={setActiveTab}
                variant="pills"
                style={{
                    flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0,
                }}
                data-test="rca-tabs"
            >
                <Tabs.List p="xs">
                    <Tabs.Tab
                        value="issues"
                        leftSection={<IconAlertTriangle size={14} />}
                        size="xs"
                        data-test="rca-tab-issues"
                    >
                        Issues ({diffResult.issues.length})
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="changes"
                        leftSection={<IconListDetails size={14} />}
                        size="xs"
                        data-test="rca-tab-changes"
                    >
                        All Changes
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="issues" style={{ flex: 1, minHeight: 0 }}>
                    <ScrollArea h="100%" p="xs" style={{ overscrollBehavior: 'contain' }}>
                        {diffResult.issues.length === 0 ? (
                            <Text size="xs" c="dimmed" ta="center" p="md">
                                No grouped issues found.
                            </Text>
                        ) : (
                            <Accordion variant="separated">
                                {diffResult.issues.map((issue) => (
                                    <IssueItem
                                        key={issue.id}
                                        issue={issue}
                                        onSelectChange={onSelectChange}
                                    />
                                ))}
                            </Accordion>
                        )}
                    </ScrollArea>
                </Tabs.Panel>

                <Tabs.Panel value="changes" style={{ flex: 1, minHeight: 0 }}>
                    <ScrollArea h="100%" p="xs" style={{ overscrollBehavior: 'contain' }}>
                        <Accordion variant="separated" chevronPosition="left">
                            {diffResult.changes.map((change) => (
                                <ChangeItem
                                    key={change.id}
                                    change={change}
                                    onSelect={() => onSelectChange(change)}
                                />
                            ))}
                        </Accordion>
                    </ScrollArea>
                </Tabs.Panel>
            </Tabs>
        </Paper>
    );
}

export default RCAPanel;
