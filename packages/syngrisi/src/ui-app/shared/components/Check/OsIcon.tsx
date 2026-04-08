/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import {
    IconBrandAndroid,
    IconBrandApple,
    IconBrandWindows,
    IconQuestionMark,
    IconDeviceMobile,
    IconTerminal2,
} from '@tabler/icons-react';
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
        ios: IconDeviceMobile,
        android: IconBrandAndroid,
        windows: IconBrandWindows,
        win32: IconBrandWindows,
        macintel: IconBrandApple,
        macos: IconBrandApple,
        'linux x86_64': IconTerminal2,
        linux: IconTerminal2,
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
