/* eslint-disable no-underscore-dangle,prefer-arrow-callback,react/jsx-one-expression-per-line */
import React from 'react';
import { RunItem, SuiteItem, BrowserItem, PlatformItem, StatusItem, AcceptStatusItem } from '.';

const itemTypesMap = {
    runs: 'Run',
    suites: 'Suite',
} as any;

interface Props {
    item: { [key: string]: string }
    index: number
    id: string
    activeItemsHandler: any
    infinityQuery: any
    itemType: string
}

export function BaseItemWrapper(
    {
        item,
        itemType,
        index,
        id,
        activeItemsHandler,
        infinityQuery,
    }: Props,
) {
    const type = itemTypesMap[itemType];

    const handlerItemClick = (e: any) => {
        if (!(e.metaKey || e.ctrlKey)) activeItemsHandler.clear();
        activeItemsHandler.addOrRemove(id);
    };

    const className = `${activeItemsHandler.navbarItemClass()}`
        + ` ${(activeItemsHandler.get().includes(id)) && activeItemsHandler.activeNavbarItemClass()}`;

    const itemsComponentsMap: { [key: string]: any } = {
        runs: (
            <RunItem
                item={item}
                type={type}
                index={index}
                className={className}
                infinityQuery={infinityQuery}
                handlerItemClick={handlerItemClick}
            />
        ),
        suites: (
            <SuiteItem
                item={item}
                type={type}
                index={index}
                className={className}
                infinityQuery={infinityQuery}
                handlerItemClick={handlerItemClick}
            />
        ),
        'test-distinct/browserName': (
            <BrowserItem
                item={item}
                index={index}
                className={className}
                handlerItemClick={handlerItemClick}
            />
        ),
        'test-distinct/os': (
            <PlatformItem
                item={item}
                index={index}
                className={className}
                handlerItemClick={handlerItemClick}
            />
        ),
        'test-distinct/status': (
            <StatusItem
                item={item}
                index={index}
                className={className}
                handlerItemClick={handlerItemClick}
            />
        ),
        'test-distinct/markedAs': (
            <AcceptStatusItem
                item={item}
                index={index}
                className={className}
                handlerItemClick={handlerItemClick}
            />
        ),
    };
    return (itemsComponentsMap[itemType]);
}
