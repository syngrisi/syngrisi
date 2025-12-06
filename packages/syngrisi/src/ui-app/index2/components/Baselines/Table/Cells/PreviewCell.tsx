import * as React from 'react';
import { HoverCard, Image, Group } from '@mantine/core';
import config from '@config';

interface Props {
    baseline: any
}

export function PreviewCell({ baseline }: Props) {
    const filename = baseline.snapshootId?.filename;
    const src = filename ? `${config.baseUri}/snapshoots/${filename}` : '';

    if (!filename) {
        return (
            <td style={{ width: '100px' }}>
                <Image withPlaceholder width={80} height={60} fit="contain" />
            </td>
        );
    }

    return (
        <td style={{ width: '100px' }}>
            <HoverCard width={400} shadow="md" withinPortal zIndex={1000}>
                <HoverCard.Target>
                    <Group position="center">
                        <Image src={src} width={80} height={60} fit="contain" />
                    </Group>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <Image src={src} />
                </HoverCard.Dropdown>
            </HoverCard>
        </td>
    );
}
