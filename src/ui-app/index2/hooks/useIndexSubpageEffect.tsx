/* eslint-disable indent,react/jsx-indent */
import { resetNavigationProgress, stopNavigationProgress } from '@mantine/nprogress';
import { useContext, useEffect } from 'react';
import { Anchor } from '@mantine/core';
import * as React from 'react';
import { AppContext } from '../AppContext';
import { getNavigationItem } from '../../shared/navigation/navigationData';

export function useIndexSubpageEffect(title: string) {
    useEffect(() => {
        return () => {
            // clearToolbar();
            stopNavigationProgress();
            resetNavigationProgress();
        };
    }, [title]);
}
