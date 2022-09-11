/* eslint-disable dot-notation,prefer-arrow-callback */
import { ActionIcon, Box, Button, Chip, Group, Paper, useMantineTheme } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { IconPlus, IconX } from '@tabler/icons';
import { FilterWrapper } from './FilterWrapper';
import { uuid } from '../../utils';

interface Props {
    fields: any
    id: string
    updateGroupsData: any
    removeGroupsData: any
    updateMainGroupData?: any
    children?: any
}

const initGroupObject: { [key: string]: any } = {
    rules: {
        initialFilterKey1: {},
        initialFilterKey2: {},
    },
};

function LogicalGroup({ fields, id, updateGroupsData, removeGroupsData, updateMainGroupData, children = '' }: Props) {
    const [groupData, setGroupData] = useState(initGroupObject);
    const [groupOperator, setGroupOperator] = useState('$and');

    const updateGroupRules = (key: string, value: any) => {
        setGroupData((prev) => {
            const newObject = { ...prev };
            newObject['rules'] = { ...newObject['rules'] };
            newObject['rules'][key] = value;
            return newObject;
        });
    };

    const updateObjectGroupOperator = () => {
        setGroupData((prev) => {
            const newObj = { ...prev };
            newObj['operator'] = groupOperator;
            return newObj;
        });
    };

    const removeGroupRule = (key: string) => {
        setGroupData((prev) => {
            const newObject = { ...prev };
            delete newObject['rules'][key];
            return newObject;
        });
    };

    const addNewFilter = () => updateGroupRules(uuid(), {});

    useEffect(function groupRulesChange() {
        if (id === 'mainGroup') {
            updateMainGroupData(id, groupData);
            return;
        }
        updateGroupsData(id, groupData);
    }, [JSON.stringify(groupData)]);

    useEffect(function updateGroupOperator() {
        updateObjectGroupOperator();
    }, [groupOperator]);

    const filters = Object.keys(groupData['rules']).map(
        (key: string) => (
            <FilterWrapper
                fields={fields}
                groupRules={groupData['rules']}
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
                <Chip.Group multiple={false} value={groupOperator} onChange={setGroupOperator} spacing={6}>
                    <Chip size="sm" checked={groupOperator === 'and'} value="$and">And</Chip>
                    <Chip size="sm" ml={0} checked={groupOperator === 'or'} value="$or">Or</Chip>
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

            <Group position="right" spacing={2} mt={2} sx={{ width: '100%' }}>
                <Button
                    title="Add filter rule"
                    compact
                    onClick={addNewFilter}
                    variant="subtle"
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
                            onClick={() => updateGroupsData(uuid(), {})}
                            title="Add another group"
                            variant="subtle"
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
            {filters}
            <Group mt={24}>
                {children}
            </Group>
        </Paper>
    );
}

export default LogicalGroup;
