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
 * Property diff row component
 */
function PropertyDiffRow({ prop }: { prop: PropertyChange }) {
    return (
        <Box
            style={{
                padding: '4px 8px',
                backgroundColor: 'var(--mantine-color-dark-6)',
                borderRadius: '4px',
                marginBottom: '4px',
            }}
        >
            <Text size="xs" fw={500} c="dimmed">
                {prop.property}
            </Text>
            <Group gap="xs" mt={2}>
                <Text
                    size="xs"
                    c="red"
                    style={{ textDecoration: 'line-through' }}
                >
                    {prop.baselineValue}
                </Text>
                <Text size="xs" c="dimmed">→</Text>
                <Text size="xs" c="green">
                    {prop.actualValue}
                </Text>
            </Group>
        </Box>
    );
}

/**
 * Change item component
 */
function ChangeItem({
    change,
    isSelected,
    onSelect,
}: {
    change: DOMChange;
    isSelected: boolean;
    onSelect: () => void;
}) {
    const color = getChangeColor(change.type);
    const icon = getChangeIcon(change.type);

    return (
        <Paper
            p="xs"
            radius="sm"
            data-test="rca-change-item"
            data-test-change-type={change.type}
            data-test-selected={isSelected ? 'true' : 'false'}
            style={{
                cursor: 'pointer',
                backgroundColor: isSelected
                    ? 'var(--mantine-color-blue-9)'
                    : 'var(--mantine-color-dark-6)',
                border: isSelected
                    ? '1px solid var(--mantine-color-blue-5)'
                    : '1px solid transparent',
            }}
            onClick={onSelect}
        >
            <Group gap="xs" mb={4}>
                <ThemeIcon size="sm" variant="light" color={color}>
                    {icon}
                </ThemeIcon>
                <Text size="xs" fw={500} style={{ flex: 1 }}>
                    {change.xpath.split('/').pop() || change.type}
                </Text>
                <Badge size="xs" color={color}>
                    {change.type.replace('_', ' ')}
                </Badge>
            </Group>

            {change.changedProperties && change.changedProperties.length > 0 && (
                <Stack gap={2} mt="xs">
                    {change.changedProperties.slice(0, 3).map((prop, idx) => (
                        <PropertyDiffRow key={idx} prop={prop} />
                    ))}
                    {change.changedProperties.length > 3 && (
                        <Text size="xs" c="dimmed">
                            +{change.changedProperties.length - 3} more properties
                        </Text>
                    )}
                </Stack>
            )}
        </Paper>
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
                <Stack gap="xs">
                    {issue.affectedChanges.map((change) => (
                        <Paper
                            key={change.id}
                            p="xs"
                            radius="sm"
                            style={{
                                cursor: 'pointer',
                                backgroundColor: 'var(--mantine-color-dark-7)',
                            }}
                            onClick={() => onSelectChange(change)}
                        >
                            <Group gap="xs">
                                <ThemeIcon
                                    size="xs"
                                    variant="light"
                                    color={getChangeColor(change.type)}
                                >
                                    {getChangeIcon(change.type)}
                                </ThemeIcon>
                                <Text size="xs">
                                    {change.xpath.split('/').pop()}
                                </Text>
                            </Group>
                        </Paper>
                    ))}
                </Stack>
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
                        <Stack gap="xs">
                            {diffResult.changes.map((change) => (
                                <ChangeItem
                                    key={change.id}
                                    change={change}
                                    isSelected={selectedChange?.id === change.id}
                                    onSelect={() => onSelectChange(change)}
                                />
                            ))}
                        </Stack>
                    </ScrollArea>
                </Tabs.Panel>
            </Tabs>
        </Paper>
    );
}

export default RCAPanel;
