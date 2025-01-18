import * as React from 'react';
import { Group } from '@mantine/core';
import { useRelatedChecks } from '../hooks/useRelatedChecks';
import { RelatedChecks } from './RelatedChecks';

interface Props {
    currentCheck: any;
    opened: boolean;
    handler: {
        open: () => void;
        close: () => void;
        toggle: () => void;
    };
    activeCheckId: string;
    setActiveCheckId: (id: string) => void;
}

export function RelatedChecksContainer({
    currentCheck,
    opened,
    handler,
    activeCheckId,
    setActiveCheckId,
}: Props) {
    const related = useRelatedChecks(currentCheck);
    Object.assign(related, {
        opened,
        handler,
        relatedActiveCheckId: activeCheckId,
        setRelatedActiveCheckId: setActiveCheckId,
    });

    return (
        <Group align="start" noWrap>
            <RelatedChecks
                currentCheck={currentCheck}
                related={related}
            />
        </Group>
    );
}
