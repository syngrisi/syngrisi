import * as React from 'react';
import { ActionIcon, Chip, Group, Popover, Stack, Text, TextInput, useMantineTheme } from '@mantine/core';
import { IconChevronDown, IconX } from '@tabler/icons';

interface Props {

}

const chipStyles: any = {
    label: {
        maxWidth: '9em',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
};

export function QuickFilter(props: Props) {
    const theme = useMantineTheme();
    return (
        <>

            <Text size={14}>Quick Filter: </Text>
            <TextInput
                size="xs"
                radius="xs"
                placeholder="Enter test name"
                rightSection={
                    (
                        <ActionIcon title="reset filter">
                            <IconX stroke={1} color={theme.colors.gray[5]} />
                        </ActionIcon>
                    )
                }
                styles={{
                    input: { width: '300px' },
                }}
            />
            <Popover
                width={330}
                position="bottom"
                withArrow
                shadow="md"
                // opened={openedZoomPopover}
            >
                <Popover.Target>
                    <Group
                        spacing={0}
                        position="center"
                        // onClick={zoomPopoverHandler.toggle}
                    >
                        <ActionIcon ml={-14}>
                            <IconChevronDown size={16} />
                        </ActionIcon>
                    </Group>
                </Popover.Target>
                <Popover.Dropdown>
                    <Stack spacing={8} justify="flex-start">
                        <Text size={10} color="gray.6" weight={600} transform="uppercase">Browsers:</Text>
                        <Chip.Group spacing={4} multiple>
                            <Chip
                                value="1"
                                title="chrome [HEADLESS]!!!!!!"
                                styles={chipStyles}
                            >
                                chrome [HEADLESS]
                            </Chip>

                            <Chip
                                value="2"
                                styles={chipStyles}
                            >
                                Chrome
                            </Chip>

                            <Chip
                                value="3"
                                styles={chipStyles}
                            >
                                Safari
                            </Chip>
                            <Chip
                                value="4"
                                styles={chipStyles}
                            >
                                Firefox
                            </Chip>
                        </Chip.Group>
                    </Stack>
                </Popover.Dropdown>
            </Popover>

        </>
    );
}
