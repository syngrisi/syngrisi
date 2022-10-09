import * as React from 'react';
import { Checkbox, Group, List, Stack, Text, Tooltip } from '@mantine/core';
import { createStyles } from '@mantine/styles';

const useStyles = createStyles((theme) => ({
    navbarItem: {
        borderBottom: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
        }`,
    },
}));

interface Props {
    item: { [key: string]: string }
    selected: boolean
    toggleRowSelection: (id: string) => void
    index: number
}

export function Simple({ item, selected, toggleRowSelection, index }: Props) {
    const { classes } = useStyles();

    return (
        <List.Item
            data-test={`navbar_item_${index}`}
            className={classes.navbarItem}
            style={{ cursor: 'pointer' }}
        >
            <Group noWrap p={4} position="apart" spacing={0}>
                <Group noWrap style={{ width: '100%' }}>
                    <Checkbox
                        test-data="navbar-item-checkbox"
                        checked={selected}
                        onChange={(event) => {
                            event.stopPropagation();
                            toggleRowSelection(item.id!);
                        }}
                        onClick={
                            (event) => {
                                event.stopPropagation();
                            }
                        }
                    />
                    <Stack spacing={0} style={{ width: '100%' }}>
                        <Tooltip label={item.name} multiline>
                            <Text
                                data-test="navbar-item-name"
                                size={16}
                                lineClamp={1}
                                sx={{ wordBreak: 'break-all' }}
                            >
                                {item.name}
                            </Text>
                        </Tooltip>
                    </Stack>
                </Group>
            </Group>
        </List.Item>
    );
}
