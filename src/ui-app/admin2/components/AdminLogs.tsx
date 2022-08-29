import * as React from 'react';
import { Title } from '@mantine/core';

import { useSubpageEffect } from '../../shared/hooks/useSubpageEffect';

export default function AdminLogs() {
    useSubpageEffect('Logs');

    return (
        <Title>Admin Logs</Title>
    );
}
