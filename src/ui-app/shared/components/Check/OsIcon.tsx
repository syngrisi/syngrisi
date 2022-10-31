/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import {
    SiAndroid,
    SiApple,
    SiIos,
    SiLinux,
    SiWindows,
} from 'react-icons/si';
import { TbQuestionMark } from 'react-icons/tb';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import config from '../../../config';
import { log } from '../../utils/Logger';

interface Props {
    os: string
    size: number
    color?: string
}

const osIconMap = (key: string) => {
    const map = {
        ios: SiIos,
        android: SiAndroid,
        windows: SiWindows,
        win32: SiWindows,
        macintel: SiApple,
        macos: SiApple,
        'linux x86_64': SiLinux,
        linux: SiLinux,

        // 'Linux x86_64': SiLinux,
        // Win32: SiWindows,
        // WINDOWS: SiWindows,
        // MacIntel: SiApple,
        // macOS: SiApple,
    } as { [key: string]: any };
    return map[key.toLowerCase()];
};

export function OsIcon({ os, size = 24, ...rest }: Props) {
    const customDevicesQuery = useQuery(
        ['custom_devices'],
        () => config.customDevicesProm,
        {
            cacheTime: 60 * 60 * 10,
            staleTime: 60 * 60 * 10,
            enabled: true,
            refetchOnWindowFocus: false,
            onError: (err: any) => {
                // errorMsg({ error: err });
                log.error(err);
            },
        },
    );

    const customDevices = useMemo(() => customDevicesQuery.data || [], [customDevicesQuery?.data?.length]);

    const allDevices = [...config.devices, ...customDevices];

    const Icon = osIconMap(os)
        || osIconMap(allDevices.find((x: any) => x.device === os)?.os || '')
        || TbQuestionMark;

    return (
        <Icon
            title={os}
            size={size}
            {...rest}
        />
    );
}
