/* eslint-disable dot-notation,prefer-arrow-callback */
import { ActionIcon, Box, Button, Chip, Group, Paper, useMantineTheme, useComputedColorScheme } from '@mantine/core';
import React from 'react';
import { IconPlus, IconX } from '@tabler/icons-react';
import { FilterWrapper } from '@shared/components/filter/FilterWrapper';
import { uuid } from '@shared/utils';

interface Props {
    fields: any
    id: string
    setGroupsData: any
    groupsData: any
    removeGroupsData: any
    children?: any
    testAttr: string,
}

const initGroupObject: { [key: string]: any } = {
    operator: '$and',
    rules: {
        initialFilterKey1: {},
    },
};

function LogicalGroup({ fields, id, setGroupsData, groupsData, removeGroupsData, testAttr, children = '' }: Props) {
    const updateGroupRules = (key: string, value: any) => {
        setGroupsData((prev: any) => {
            const newGroupsObject = { ...prev };
            const groupObject = newGroupsObject[id];
            groupObject['rules'] = { ...groupObject['rules'] };
            groupObject['rules'][key] = value;
            newGroupsObject[id] = groupObject;
            return newGroupsObject;
        });
    };

    const updateGroupOperator = (operator: string) => {
        setGroupsData((prev: any) => {
            const newGroupsObject = { ...prev };
            const groupObject = newGroupsObject[id];
            groupObject['operator'] = operator;
            newGroupsObject[id] = groupObject;
            return newGroupsObject;
        });
    };

    const removeGroupRule = (key: string) => {
        setGroupsData((prev: any) => {
            const newGroupsObject = { ...prev };
            const groupObject = newGroupsObject[id];
            groupObject['rules'] = { ...groupObject['rules'] };
            delete groupObject['rules'][key];
            newGroupsObject[id] = groupObject;
            return newGroupsObject;
        });
    };

    const updateGroupsData = (key: string, value: any) => {
        setGroupsData((prev: any) => ({ ...prev, [key]: value }));
    };

    const rules = Object.keys(groupsData[id]['rules']).map(
        (key: string, index: number) => (
            <FilterWrapper
                testAttr={`filter-rule-${index}`}
                fields={fields}
                groupRules={groupsData[id]['rules']}
                updateGroupRules={updateGroupRules}
                removeGroupRule={removeGroupRule}
                id={key}
                key={key}
            />
        ),
    );
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme();
    const operatorChipStyles = {
        label: {},
    };

    const operatorChipsCss = `
        [data-test="filter-group-operator-and"] + .mantine-Chip-label,
        [data-test="filter-group-operator-or"] + .mantine-Chip-label {
            border: 1px solid ${colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[3]} !important;
            background-color: ${colorScheme === 'dark' ? theme.colors.dark[6] : theme.white} !important;
            color: ${colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.dark[6]} !important;
        }

        [data-test="filter-group-operator-and"]:checked + .mantine-Chip-label,
        [data-test="filter-group-operator-or"]:checked + .mantine-Chip-label,
        [data-test="filter-group-operator-and"] + .mantine-Chip-label[data-checked="true"],
        [data-test="filter-group-operator-or"] + .mantine-Chip-label[data-checked="true"] {
            border-color: ${theme.colors.green[5]} !important;
            background-color: ${colorScheme === 'dark' ? 'rgba(64, 192, 87, 0.14)' : '#ebfbee'} !important;
            color: ${colorScheme === 'dark' ? theme.white : theme.colors.green[8]} !important;
        }
    `;
    return (
        <Paper
            data-test={testAttr}
            withBorder
            mt={24}
            p={16}
            radius={0}
            style={{
                position: 'relative',
                fontSize: 14,
                lineHeight: '21.7px',
            }}
        >
            <style>{operatorChipsCss}</style>
            <Box
                pl={4}
                pr={4}
                style={{
                    backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : 'white',
                    display: 'inline-block',
                    fontSize: '2rem',
                    position: 'absolute',
                    top: '-22px',
                    left: '5%',
                }}
            >
                <Chip.Group
                    multiple={false}
                    value={groupsData[id]['operator']}
                    onChange={updateGroupOperator}
                >
                    <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        <Chip
                            data-test="filter-group-operator-and"
                            size="sm"
                            checked={groupsData[id]['operator'] === 'and'}
                            value="$and"
                            styles={operatorChipStyles}
                        >
                            And
                        </Chip>
                        <Chip
                            data-test="filter-group-operator-or"
                            size="sm"
                            ml={0}
                            checked={groupsData[id]['operator'] === 'or'}
                            value="$or"
                            styles={operatorChipStyles}
                        >
                            Or
                        </Chip>
                    </Box>
                </Chip.Group>
            </Box>

            {
                id !== 'mainGroup'
                && (
                    <Group style={{ width: '100%' }} justify="flex-end" mb={16}>
                        <ActionIcon
                            size={16}
                            onClick={() => removeGroupsData(id)}
                            title="Remove this group"
                        >
                            <IconX stroke={1} />
                        </ActionIcon>
                    </Group>
                )
            }

            <Group justify="flex-end" gap={8} mt={2} style={{ width: '100%' }}>
                <Button
                    data-test="table-filter-add-rule-button"
                    title="Add filter rule"
                    compact
                    onClick={() => updateGroupRules(uuid(), {})}
                    variant="light"
                    color="green"
                    leftIcon={<IconPlus size={16} />}
                    styles={
                        { leftIcon: { marginRight: 4 } }
                    }
                >
                    Rule
                </Button>
                {
                    id === 'mainGroup'
                    && (
                        <Button
                            size="sm"
                            data-test="table-filter-add-group-button"
                            compact
                            onClick={() => updateGroupsData(uuid(), initGroupObject)}
                            title="Add another group"
                            variant="light"
                            color="green"
                            leftIcon={<IconPlus size={16} />}
                            styles={
                                { leftIcon: { marginRight: 4 } }
                            }
                        >
                            Group
                        </Button>
                    )
                }
            </Group>
            {rules}
            <Group mt={24}>
                {children}
            </Group>
        </Paper>
    );
}

export default LogicalGroup;
