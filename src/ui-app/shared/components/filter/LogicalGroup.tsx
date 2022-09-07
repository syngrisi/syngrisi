import { Box, Group, Paper, ThemeIcon, useMantineTheme } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { IconPlus } from '@tabler/icons';
import { FilterWrapper } from './FilterWrapper';

interface Props {
    operator?: '$and' | '$or',
    fields: any
}

const initGroupSet = new Set([{}, {}]);

function LogicalGroup({ operator = '$and', fields }: Props) {
    const [filtersSet, setFiltersSet] = useState(initGroupSet);

    const updateFilterSet = (value) => {
        setFiltersSet((prev) => {
            const newSet = new Set(Array.from(prev));
            newSet.add(value);
            return newSet;
        });
    };

    useEffect(function filterSetChanged() {
        console.log('filterSetChanged');
        console.log(filtersSet);
    }, [filtersSet]);

    const filters = Array.from(initGroupSet).map(
        (item) => (
            <FilterWrapper
                fields={fields}
                filtersSet={filtersSet}
                updateFilterSet={updateFilterSet}
            />
        ),
    );
    const theme = useMantineTheme();
    return (
        <Paper withBorder p={16} sx={{ position: 'relative' }}>
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
                {operator}
            </Box>
            {filters}
            <Group position="right" pt={24}>
                <ThemeIcon variant="light">
                    <IconPlus />
                </ThemeIcon>
            </Group>

        </Paper>
    );
}

export default LogicalGroup;
