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

interface Props {
    os: string
    size: number
}

const osIconMap = (key: string) => {
    const map = {
        'Linux x86_64': SiLinux,
        ios: SiIos,
        android: SiAndroid,
        Win32: SiWindows,
        WINDOWS: SiWindows,
        MacIntel: SiApple,
        macOS: SiApple,
    } as { [key: string]: any };
    return map[key] || TbQuestionMark;
};

export function OsIcon({ os, size = 24, ...rest }: Props) {
    const BIcon = osIconMap(os);

    return (
        <BIcon
            title={os}
            size={size}
            {...rest}
        />
    );
}
