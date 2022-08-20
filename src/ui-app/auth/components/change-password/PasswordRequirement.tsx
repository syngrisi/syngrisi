import * as React from 'react';
import { Box, Text, Center } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons';

export default function PasswordRequirement({ meets, label, id }: { meets: boolean; label: string, id: string }) {
    return (
        <Text color={meets ? 'teal' : 'red'} mt={5} size="sm" id={id}>
            <Center inline>
                {meets ? <IconCheck size={14} stroke={1.5} /> : <IconX size={14} stroke={1.5} />}
                <Box ml={7}>{label}</Box>
            </Center>
        </Text>
    );
}
