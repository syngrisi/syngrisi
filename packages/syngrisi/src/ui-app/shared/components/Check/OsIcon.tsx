/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import {
    SiAndroid,
    SiApple,
    SiIos,
    SiLinux,
} from 'react-icons/si';
import { IconBrandWindows, IconQuestionMark } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import config from '@config';


interface Props {
    os: string
    size: number
    color?: string
}

const osIconMap = (key: string) => {
    const map = {
        ios: SiIos,
        android: SiAndroid,
        windows: IconBrandWindows,
        win32: IconBrandWindows,
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
    const customDevicesQuery = useQuery({
        queryKey: ['custom_devices'],
        queryFn: () => config.customDevicesProm,
        gcTime: 60 * 60 * 10,
        staleTime: 60 * 60 * 10,
        enabled: true,
        refetchOnWindowFocus: false,
    });

    const customDevices = useMemo(() => customDevicesQuery.data || [], [customDevicesQuery?.data?.length]);

    const allDevices = [...config.devices, ...customDevices];

    const Icon = osIconMap(os)
        || osIconMap(allDevices.find((x: any) => x.device === os)?.os || '')
        || IconQuestionMark;

    return (
        <Icon
            title={os}
            size={size}
            {...rest}
        />
    );
}
