/* eslint-disable prefer-arrow-callback,react-hooks/exhaustive-deps */
import * as React from 'react';
import { Divider, Group } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ScreenshotDetails } from '@index/components/Tests/Table/Checks/CheckDetails/Toolbar/ScreenshotDetails';
import { ZoomToolbar } from '@index/components/Tests/Table/Checks/CheckDetails/Toolbar/ZoomToolbar';
import { MainView } from '@index/components/Tests/Table/Checks/CheckDetails/Canvas/mainView';
import { ViewSegmentedControl } from '@index/components/Tests/Table/Checks/CheckDetails/Toolbar/ViewSegmentedControl';
import { HighlightButton } from '@index/components/Tests/Table/Checks/CheckDetails/Toolbar/HighlightButton';
import { RegionsToolbar } from '@index/components/Tests/Table/Checks/CheckDetails/Toolbar/RegionsToolbar';
import { AcceptButton } from '@index/components/Tests/Table/Checks/AcceptButton';
import { RemoveButton } from '@index/components/Tests/Table/Checks/RemoveButton';
import { useParams } from '@hooks/useParams';

interface Props {
    mainView: any
    classes: any
    curCheck: any
    baselineId: string
    initCheckData: any
    checkQuery: any
    closeHandler: any
}

export function Toolbar(
    {
        mainView,
        classes,
        curCheck,
        baselineId,
        initCheckData,
        checkQuery,
        closeHandler,
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
        if (!mainView) return;
        mainView.switchView(view);
    }, [view, mainView]);

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
                    testUpdateQuery={checkQuery}
                    size={30}
                    closeHandler={closeHandler}
                />
            </Group>
        </Group>

    );
}
