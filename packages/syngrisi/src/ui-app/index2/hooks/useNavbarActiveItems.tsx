/* eslint-disable prefer-arrow-callback */
import { useEffect, useState } from 'react';
import { useParams } from '@hooks/useParams';

interface Props {
    groupByValue: string
    classes: any,
}

export function useNavbarActiveItems({ groupByValue, classes }: Props) {
    const { query, setQuery } = useParams();
    const [activeItems, setActiveItems] = useState<string[]>([]);

    const activeItemsHandler = {
        get: () => activeItems,
        addOrRemove: (item: string) => {
            setActiveItems(
                (prevItems: any[]) => {
                    const newItems = [...prevItems];
                    if (newItems.includes(item)) {
                        return newItems.filter((x) => x !== item);
                    }
                    return newItems.concat(item);
                },
            );
        },
        clear: () => {
            setActiveItems(() => []);
        },
        set: (items: any) => {
            setActiveItems(() => items);
        },
        navbarItemClass: () => classes.navbarItem,
        activeNavbarItemClass: () => classes.activeNavbarItem,
    };

    const baseFilterMap = (
        {
            suites: 'suite',
            runs: 'run',
            'test-distinct/browserName': 'browserName',
            'test-distinct/os': 'os',
            'test-distinct/status': 'status',
            'test-distinct/markedAs': 'markedAs',
        }[groupByValue] || groupByValue
    );

    useEffect(function setActiveItemsFromQueryFirstTime() {
        if (
            (query?.base_filter && query?.base_filter[baseFilterMap]?.$in?.length > 0)
            && (activeItemsHandler.get().length < 1)
        ) {
            activeItemsHandler.set(query?.base_filter[baseFilterMap]?.$in);
        }
    }, []);

    useEffect(function onActiveItemsChange() {
        if (activeItemsHandler.get().length > 0) {
            setQuery({ base_filter: { [baseFilterMap]: { $in: activeItemsHandler.get() } } });
        } else {
            setQuery({ base_filter: null });
        }
    }, [JSON.stringify(activeItemsHandler.get())]);

    return activeItemsHandler;
}
