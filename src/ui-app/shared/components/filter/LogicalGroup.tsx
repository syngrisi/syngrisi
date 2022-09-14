/* eslint-disable dot-notation,prefer-arrow-callback */
import { ActionIcon, Box, Button, Chip, Group, Paper, useMantineTheme } from '@mantine/core';
import React from 'react';
import { IconPlus, IconX } from '@tabler/icons';
import { FilterWrapper } from './FilterWrapper';
import { uuid } from '../../utils';

interface Props {
    fields: any
    id: string
    setGroupsData: any
    groupsData: any
    removeGroupsData: any
    children?: any
}

const initGroupObject: { [key: string]: any } = {
    operator: '$and',
    rules: {
        initialFilterKey1: {},
    },
};

function LogicalGroup({ fields, id, setGroupsData, groupsData, removeGroupsData, children = '' }: Props) {
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
        (key: string) => (
            <FilterWrapper
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
    return (
        <Paper withBorder mt={24} p={16} sx={{ position: 'relative' }}>
            <Box
                pl={4}
                pr={4}
                sx={{
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : 'white',
                    display: 'inline-block',
                    fontSize: '2rem',
                    position: 'absolute',
                    top: '-30px',
                    left: '5%',
                }}
            >
                <Chip.Group
                    multiple={false}
                    value={groupsData[id]['operator']}
                    onChange={updateGroupOperator}
                    spacing={6}
                >
                    <Chip size="sm" checked={groupsData[id]['operator'] === 'and'} value="$and">And</Chip>
                    <Chip size="sm" ml={0} checked={groupsData[id]['operator'] === 'or'} value="$or">Or</Chip>
                </Chip.Group>
            </Box>

            {
                id !== 'mainGroup'
                && (
                    <Group sx={{ width: '100%' }} position="right" mb={16}>
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

            <Group position="right" spacing={8} mt={2} sx={{ width: '100%' }}>
                <Button
                    title="Add filter rule"
                    compact
                    onClick={() => updateGroupRules(uuid(), {})}
                    variant="light"
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
                            compact
                            onClick={() => updateGroupsData(uuid(), initGroupObject)}
                            title="Add another group"
                            variant="light"
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
