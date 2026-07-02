import * as React from 'react';
import { useState } from 'react';
import { ActionIcon, Popover, Stack, Text, Anchor } from '@mantine/core';
import { IconHelpCircle } from '@tabler/icons-react';

interface Props {
    title: string;
    lines: string[];          // documentation paragraphs
    docHref?: string;         // optional link to fuller docs
    dataTest?: string;        // override data-test when several help icons share a container
}

// A question-mark icon that reveals inline documentation on click. Reusable across admin settings.
export function HelpDoc({ title, lines, docHref, dataTest = 'help-doc' }: Props) {
    const [opened, setOpened] = useState(false);
    return (
        <Popover opened={opened} onChange={setOpened} position="right-start" withArrow shadow="md" width={340}>
            <Popover.Target>
                <ActionIcon
                    variant="subtle"
                    color="gray"
                    size="sm"
                    aria-label={`Help: ${title}`}
                    title="Documentation"
                    data-test={dataTest}
                    onClick={() => setOpened((o) => !o)}
                >
                    <IconHelpCircle size={18} />
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
                <Stack gap={6} data-test="help-doc-popover">
                    <Text size="sm" fw={600}>{title}</Text>
                    {lines.map((l) => <Text key={l} size="xs" c="dimmed">{l}</Text>)}
                    {docHref && <Anchor href={docHref} target="_blank" rel="noopener noreferrer" size="xs">Open full documentation →</Anchor>}
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
}
