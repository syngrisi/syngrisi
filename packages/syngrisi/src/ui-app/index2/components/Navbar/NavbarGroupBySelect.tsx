/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDocumentTitle } from '@mantine/hooks';
import { Anchor } from '@mantine/core';
import SafeSelect from '../../../shared/components/SafeSelect';
import { useParams } from '../../hooks/useParams';
import { getNavigationItem } from '../../../shared/navigation/navigationData';

interface Props {
    clearActiveItems: any;
    groupByValue: string,
    setGroupByValue: any,
    setBreadCrumbs: any,
}

export function NavbarGroupBySelect({ clearActiveItems, groupByValue, setGroupByValue, setBreadCrumbs }: Props) {
    const { query, setQuery } = useParams();

    const subpageMap: { [key: string]: string } = {
        runs: 'By Runs',
        suites: 'By Suites',
        'test-distinct/browserName': 'By Browser',
        'test-distinct/os': 'By Platform',
        'test-distinct/status': 'By Test Status',
        'test-distinct/markedAs': 'By Accept Status',
    };

    const [title, setTitle] = useState(subpageMap[String('runs')]);

    useEffect(function updateTitle() {
        if (query?.checkId) {
            setTitle(() => ''); // this necessary to trigger  useDocumentTitle after modal close
            return;
        }
        setTitle(() => subpageMap[String(query?.groupBy || 'runs')]);
    }, [query?.groupBy, query?.checkId]);

    const updateBreadcrumbs = (pageTitle: string) => {
        const pageData = getNavigationItem(pageTitle) || {
            title: null,
            crumbs: [],
        };
        setBreadCrumbs(() => pageData!.crumbs.map((item: any) => (
            <Anchor href={item.href} key={`${item.title}`} size="sm" color="green">
                {item.title}
            </Anchor>
        )));
    };

    useDocumentTitle(title);
    useEffect(function changeBreadcrumbs() {
        updateBreadcrumbs(title);
    }, [title]);

    useEffect(function onQueryGroupByUpdated() {
        if (!query.groupBy) return;
        setGroupByValue(query.groupBy);
    }, [query.groupBy]);

    const handleGroupBySelect = (value: string) => {
        clearActiveItems();
        setQuery({ groupBy: value });
    };

    return (
        <SafeSelect
            label="Group by"
            data-test="navbar-group-by"
            value={groupByValue}
            onChange={handleGroupBySelect}
            optionsData={[
                { value: 'runs', label: 'Runs' },
                { value: 'suites', label: 'Suites' },
                { value: 'test-distinct/browserName', label: 'Browsers' },
                { value: 'test-distinct/os', label: 'Platform' },
                // { value: 'test-distinct/viewport', label: 'Viewport' },
                { value: 'test-distinct/status', label: 'Test Status' },
                { value: 'test-distinct/markedAs', label: 'Accept Status' },
            ]}
        />
    );
}
