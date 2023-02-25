/* eslint-disable prefer-arrow-callback,react-hooks/exhaustive-deps */
import * as React from 'react';
import { Divider, Group } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ScreenshotDetails } from './ScreenshotDetails';
import { ZoomToolbar } from './ZoomToolbar';
import { MainView } from '../Canvas/mainView';
import { ViewSegmentedControl } from './ViewSegmentedControl';
import { HighlightButton } from './HighlightButton';
import { RegionsToolbar } from './RegionsToolbar';
import { AcceptButton } from '../../AcceptButton';
import { RemoveButton } from '../../RemoveButton';
import { useParams } from '../../../../../../hooks/useParams';

interface Props {
    mainView: any
    classes: any
    curCheck: any
    baselineId: string
    initCheckData: any
    checkQuery: any
}

export function Toolbar(
    {
        mainView,
        classes,
        curCheck,
        baselineId,
        initCheckData,
        checkQuery,
    }: Props,
) {
    const { query } = useParams();
    const [view, setView] = useState('actual');

    useEffect(function initView() {
        if (mainView?.diffImage) {
            setView(() => 'diff');
            return;
        }
        setView(() => 'actual');
    }, [mainView?.diffImage, query.checkId]);

    useEffect(function switchView() {
        if (mainView) {
            mainView.switchView(view);
        }
    }, [view]);

    return (
        <Group position="apart" noWrap data-check="toolbar">
            <ScreenshotDetails mainView={mainView} check={curCheck} view={view} />
            <Group spacing="sm" noWrap>
                <Group
                    spacing={4}
                    className={classes.zoomButtonsWrapper}
                    position="center"
                    align="center"
                    noWrap
                >
                    <ZoomToolbar mainView={mainView as MainView} view={view} />
                </Group>

                <Divider orientation="vertical" />

                <ViewSegmentedControl view={view} setView={setView} currentCheck={curCheck} />

                <Divider orientation="vertical" />

                <HighlightButton
                    mainView={mainView as MainView}
                    disabled={!(view === 'diff' && parseFloat(curCheck?.parsedResult?.rawMisMatchPercentage) < 5)}
                />
                <Divider orientation="vertical" />

                <RegionsToolbar mainView={mainView} baselineId={baselineId} view={view} />

                <Divider orientation="vertical" />
                <AcceptButton
                    check={curCheck}
                    initCheck={initCheckData}
                    checksQuery={checkQuery}
                    size={24}
                    testUpdateQuery={checkQuery}
                />

                <RemoveButton
                    check={curCheck}
                    initCheck={initCheckData}
                    checksQuery={checkQuery}
                    testUpdateQuery={checkQuery}
                    size={30}
                />
            </Group>
        </Group>

    );
}
