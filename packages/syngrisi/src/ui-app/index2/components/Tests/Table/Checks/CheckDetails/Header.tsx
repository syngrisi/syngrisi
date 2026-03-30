import * as React from 'react';
import { ActionIcon, Group, Loader, Text, Tooltip, useMantineTheme } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useMemo } from 'react';
import { Status } from '@shared/components/Check/Status';
import { ViewPortLabel } from '@index/components/Tests/Table/Checks/ViewPortLabel';
import { sizes } from '@index/components/Tests/Table/Checks/checkSizes';
import { OsIcon } from '@shared/components/Check/OsIcon';
import { BrowserIcon } from '@shared/components/Check/BrowserIcon';
import { getStatusMessage } from '@shared/utils/utils';

interface Props {
    classes: any
    currentCheck: any
    toleranceThreshold?: number
    toleranceSource?: 'api' | 'baseline'
}

export function Header(
    {
        classes,
        currentCheck,
        toleranceThreshold = 0,
        toleranceSource,
    }: Props,
) {
    const theme = useMantineTheme();
    const [checksViewSize] = useLocalStorage({ key: 'check-view-size', defaultValue: 'medium' });
    const textLoader = <Loader size="xs" color="blue" variant="dots" />;
    const statusMsg = currentCheck.status ? getStatusMessage(currentCheck) : textLoader;

    const iconsColor = useMemo(
        () => (theme.colorScheme === 'dark'
            ? theme.colors.gray[3]
            : theme.colors.dark[9]), [theme.colorScheme],
    );

    return (
        <Group
            position="apart"
            sx={{ width: 'calc(100% - 56px)', minWidth: 0 }}
            data-check-header-name={currentCheck.name}
            data-check-header-ready={currentCheck.name && currentCheck.status ? 'true' : 'false'}
            noWrap
        >
            <Group
                position="left"
                align="center"
                spacing="xs"
                sx={{ position: 'relative', flex: 1, minWidth: 0 }}
                noWrap
                data-test="full-check-path"
            >
                <Tooltip
                    label={
                        (
                            <Group spacing={4}>
                                {
                                    currentCheck.status
                                        ? (<Status size="lg" check={currentCheck} variant="filled" />)
                                        : textLoader
                                }
                                {statusMsg}
                            </Group>
                        )
                    }
                    withinPortal
                >
                    <Group align="center" data-check="status">
                        <Status size="lg" check={currentCheck} variant="filled" />
                    </Group>
                </Tooltip>

                <Group
                    noWrap
                    spacing={0}
                    sx={{ minWidth: 0, flex: 1 }}
                >
                    <Tooltip
                        withinPortal
                        label={`Project: ${currentCheck?.app?.name}`}
                    >
                        <Text
                            data-check="app-name"
                            size="sm"
                            sx={{ flexShrink: 1, minWidth: 0 }}
                            className={classes.checkPathFragment}
                        >
                            {currentCheck?.app?.name}
                        </Text>
                    </Tooltip>
                    <Tooltip
                        withinPortal
                        label={`Suite: ${currentCheck?.suite?.name}`}
                    >
                        <Text
                            data-check="suite-name"
                            size="sm"
                            sx={{ flexShrink: 500, minWidth: 0 }}
                            className={classes.checkPathFragment}
                        >
                            &nbsp;/&nbsp;
                            {currentCheck?.suite?.name}
                        </Text>
                    </Tooltip>
                    <Tooltip
                        withinPortal
                        label={`Test: ${currentCheck?.test?.name}`}
                    >
                        <Text
                            data-check="test-name"
                            size="sm"
                            sx={{ flexShrink: 5, minWidth: 0 }}
                            className={classes.checkPathFragment}
                        >
                            &nbsp;/&nbsp;
                            {currentCheck?.test?.name}
                        </Text>
                    </Tooltip>
                    <Tooltip
                        withinPortal
                        label={`Check: ${currentCheck.name}`}

                    >
                        <Text
                            data-check="check-name"
                            size={14}
                            sx={{ flexShrink: 1, minWidth: 0 }}
                            lineClamp={1}
                            className={classes.checkPathFragment}
                        >
                            &nbsp;/&nbsp;
                            {currentCheck.name || textLoader}
                        </Text>
                    </Tooltip>
                </Group>
            </Group>

            <Group
                noWrap
                spacing="xs"
                sx={{ flexShrink: 0 }}
            >
                {
                    toleranceThreshold > 0 && (
                        <Tooltip
                            label={
                                toleranceSource === 'api'
                                    ? `Tolerance: ${Number(toleranceThreshold).toFixed(2)}% — set via API for this check`
                                    : `Tolerance: ${Number(toleranceThreshold).toFixed(2)}% — from baseline settings`
                            }
                            withinPortal
                        >
                            <Group
                                spacing={6}
                                noWrap
                                data-check="tolerance-indicator"
                                data-tolerance-source={toleranceSource || 'baseline'}
                            >
                                <ActionIcon size={24} variant="filled" color={toleranceSource === 'api' ? 'violet' : 'orange'}>
                                    <Text size={11} weight={700}>%</Text>
                                </ActionIcon>
                                <Text size={12} color={toleranceSource === 'api' ? 'violet' : 'orange'}>
                                    Tol {Number(toleranceThreshold).toFixed(2)}%
                                </Text>
                            </Group>
                        </Tooltip>
                    )
                }

                <Tooltip
                    label={
                        currentCheck?.viewport
                    }
                    withinPortal
                >
                    <Text lineClamp={1} sx={{ overflow: 'visible' }} data-check="viewport">
                        {
                            currentCheck?.viewport
                                ? (
                                    <ViewPortLabel
                                        check={currentCheck}
                                        color="blue"
                                        sizes={sizes}
                                        size="lg"
                                        checksViewSize={checksViewSize}
                                        fontSize="12px"
                                    />
                                )
                                : textLoader
                        }

                    </Text>
                </Tooltip>

                <Tooltip
                    data-check="os-label"
                    label={
                        currentCheck?.os
                    }
                    withinPortal
                >
                    <Group spacing={8} noWrap>
                        <ActionIcon variant="light" size={32} p={4} ml={4}>
                            {
                                currentCheck?.os
                                    ? (
                                        <OsIcon
                                            data-check="os-icon"
                                            size={20}
                                            color={iconsColor}
                                            os={currentCheck?.os}
                                        />
                                    )
                                    : textLoader
                            }
                        </ActionIcon>
                        <Text data-check="os" size={12} lineClamp={1}>{currentCheck?.os}</Text>
                    </Group>
                </Tooltip>

                <Tooltip
                    label={
                        currentCheck?.browserFullVersion
                            ? `${currentCheck?.browserFullVersion}`
                            : `${currentCheck?.browserVersion}`
                    }
                    withinPortal
                >
                    <Group spacing={8} noWrap>
                        <ActionIcon variant="light" size={32} p={4}>
                            {
                                currentCheck?.browserName
                                    ? (
                                        <BrowserIcon
                                            data-check="browser-icon"
                                            size={20}
                                            color={iconsColor}
                                            browser={currentCheck?.browserName}
                                        />
                                    )
                                    : textLoader
                            }
                        </ActionIcon>
                        <Text
                            data-check="browser"
                            lineClamp={1}
                            size={12}
                        >

                            {currentCheck?.browserName}
                            {
                                currentCheck?.browserVersion
                                    ? ` - ${currentCheck?.browserVersion}`
                                    : ''
                            }
                        </Text>
                    </Group>
                </Tooltip>
            </Group>
        </Group>

    );
}
