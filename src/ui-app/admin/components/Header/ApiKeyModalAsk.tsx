import { Button, Group, Modal, Text } from '@mantine/core';
import * as React from 'react';

export default function ApiKeyModalAsk({ opened, setOpened, apiKey, setResultOpened }
                                           : { opened: boolean, setOpened: any, apiKey: any, setResultOpened: any }) {
    return (
        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title="Generate a new API key?"
        >
            <Text size="sm">
                Are you sure you want to generate a new API key?
                After generation, you must add corresponding changes in your test solution.
            </Text>
            <Group position="right">
                <Button onClick={
                    () => {
                        apiKey.refetch();
                        setResultOpened(true);
                        setOpened(false);
                    }
                }
                >
                    Generate
                </Button>
                <Button variant="outline" onClick={() => setOpened(false)}>Cancel</Button>
            </Group>
        </Modal>
    );
}
