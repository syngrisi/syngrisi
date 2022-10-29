/* eslint-disable indent,react/jsx-indent */
import { resetNavigationProgress, stopNavigationProgress } from '@mantine/nprogress';
import { useContext, useEffect } from 'react';
import { Anchor } from '@mantine/core';
import * as React from 'react';
import { AppContext } from '../AppContext';
import { getNavigationItem } from '../../shared/navigation/navigationData';

export function useIndexSubpageEffect(title: string) {
    const { clearToolbar, setBreadCrumbs, setAppTitle }: any = useContext(AppContext);

    useEffect(() => {
        const pageData = getNavigationItem(title);
        setAppTitle(pageData!.title);
        setBreadCrumbs(pageData!.crumbs.map((item: any) => (
            <Anchor href={item.href} key={`${item.title}`} size="sm" color="green">
                {item.title}
            </Anchor>
        )));

        return () => {
            clearToolbar();
            stopNavigationProgress();
            resetNavigationProgress();
        };
    }, [title]);
}
