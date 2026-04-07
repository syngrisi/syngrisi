import * as React from 'react';
import { Group } from '@mantine/core';
import { useRelatedChecks } from '@index/components/Tests/Table/Checks/CheckDetails/hooks/useRelatedChecks';
import { RelatedChecks } from '@index/components/Tests/Table/Checks/CheckDetails/RelatedChecks/RelatedChecks';

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
        <Group
            align="start"
            wrap="nowrap"
            style={{ width: opened ? '163px' : '40px', flexShrink: 0 }}
        >
            <RelatedChecks
                currentCheck={currentCheck}
                related={related}
            />
        </Group>
    );
}
