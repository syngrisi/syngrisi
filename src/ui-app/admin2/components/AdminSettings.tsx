import * as React from 'react';
import { Title } from '@mantine/core';
import { useSubpageEffect } from '../../shared/hooks/useSubpageEffect';

export default function AdminSettings() {
    useSubpageEffect('Setting');
    return (
        <Title>Admin Settings</Title>
    );
}
