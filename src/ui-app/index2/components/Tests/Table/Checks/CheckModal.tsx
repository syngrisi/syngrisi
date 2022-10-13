/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import { Modal } from '@mantine/core';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import { useParams } from '../../../../hooks/useParams';
import { useEffect } from 'react';


export function CheckModal() {
    const { query, setQuery } = useParams();
    const { height: vHeight, width: vWidth } = useViewportSize();
    const [checkModalOpened, checkModalHandlers] = useDisclosure(false);
    const closeHandler = () => {
        checkModalHandlers.close();
        setQuery({ checkId: null });
    };

    useEffect(function onCheckIdChange() {
        if (query.checkId) {
            checkModalHandlers.open();
        }
    }, [query.checkId]);
    const iframeSrc = query.checkId ? `/checkview?id=${query.checkId}` : '';
    return (
        <Modal
            opened={checkModalOpened}
            centered
            size="auto"
            onClose={closeHandler}
            sx={{ marginTop: -25 }}
        >
            <iframe
                title="check view"
                width={`${vWidth - 100}px`}
                height={`${vHeight - 150}px`}
                src={iframeSrc}
                frameBorder="0"
            />
        </Modal>
    );
};
