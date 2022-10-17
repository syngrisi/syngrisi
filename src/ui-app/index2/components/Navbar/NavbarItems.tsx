/* eslint-disable */
import * as React from 'react';
import { useEffect, useState } from 'react';
import { createStyles } from '@mantine/styles';
import { IPage } from '../../../shared/interfaces/logQueries';
import ILog from '../../../shared/interfaces/ILog';
import * as ListItems from './Items';

const useStyles = createStyles((theme) => ({
    navbarItem: {
        display: 'block',
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.red[0] : theme.black,
        borderBottom: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
        }`,
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
    },
    activeNavbarItem: {
        backgroundColor: theme.colorScheme === 'dark' ? 'rgba(47, 158, 68, 0.2)' : 'rgba(235, 251, 238, 1)',
        color: theme.colorScheme === 'dark' ? theme.colors.green[2] : theme.colors.green[6],
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? 'rgba(47, 158, 68, 0.2)' : 'rgba(235, 251, 238, 1)',
            color: theme.colorScheme === 'dark' ? theme.colors.green[2] : theme.colors.green[6],
        },
    },

}));

type Props = {
    infinityQuery: any,
    groupByValue: string,
    activeItemsHandler: any
};

export function NavbarItems({ infinityQuery, groupByValue, activeItemsHandler }: Props) {
    const { classes } = useStyles();
    const [selection, setSelection]: [string[], any] = useState([]);
    const toggleRowSelection = (id: string) => setSelection(
        (current: any) => (current.includes(id) ? current.filter((item: string) => item !== id) : [...current, id]),
    );

    useEffect(function onSelectionChange() {

    }, [selection.length]);

    const transformResourceToFCName = (value: string) => {
        const transformMap = {
            runs: ListItems.Run,
            suites: ListItems.Suite,
        } as { [key: string]: any };
        return transformMap[value] ? transformMap[value] : ListItems.Simple;
    };

    return infinityQuery.data
        ? (infinityQuery.data.pages.map((page: IPage<ILog>) => (
                    page.results.map(
                        (item: any, index: number) => {
                            const selected = selection.includes(item._id!);
                            const Item = transformResourceToFCName(groupByValue);
                            return (
                                <React.Fragment key={item._id}>
                                    <Item
                                        id={item._id}
                                        activeItemsHandler={activeItemsHandler}
                                        infinityQuery={infinityQuery}
                                        index={index}
                                        item={item}
                                        classes={classes}
                                    />
                                </React.Fragment>
                            );
                        },
                    )
                )
            )
        )
        : [];
}
