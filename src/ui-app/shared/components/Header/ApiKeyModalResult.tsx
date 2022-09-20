import { useState } from 'react';
import { IconCheck, IconCopy, IconKey } from '@tabler/icons';
import { ActionIcon, Button, Group, Loader, Modal, Text, TextInput } from '@mantine/core';
import * as React from 'react';
import { log } from '../../utils';

export function ApiKeyModalResult({ opened, setOpened, apiKey }: { opened: boolean, setOpened: any, apiKey: any }) {
    const [successCopy, setSuccessCopy] = useState(false);

    if (apiKey.isError) {
        log.error(apiKey.error);
    }
    const copyHandler = () => {
        const input: any = document.getElementById('api-key');
        input.focus();
        input.select();
        // noinspection JSDeprecatedSymbols
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        log.debug(`copy result: ${msg}`);
        if (msg === 'successful') {
            setSuccessCopy(true);
        }
        // @ts-ignore
        window.getSelection().removeAllRanges();
    };

    const CopyIcon = successCopy ? IconCheck : IconCopy;

    return (
        <Modal
            opened={opened}
            onClose={() => {
                setSuccessCopy(false);
                setOpened(false);
            }}
            title="New API key"
        >
            {
                (!apiKey.isLoading && apiKey.data)
                    ? (
                        <>
                            <Group ml={20} mb={20}>
                                <Text size="sm">Copy the New API key to Clipboard</Text>
                            </Group>
                            <Group position="center">
                                <TextInput
                                    data-test="api-key"
                                    id="api-key"
                                    value={apiKey.data.apikey}
                                    sx={{ width: '340px', display: 'inline' }}
                                    icon={<IconKey />}
                                    style={{ display: 'inline' }}
                                />
                                <ActionIcon ml={-10}>
                                    <CopyIcon size={18} onClick={copyHandler} color={successCopy ? 'green' : 'gray'} />
                                </ActionIcon>
                            </Group>
                        </>
                    )
                    : (
                        // eslint-disable-next-line react/jsx-no-useless-fragment
                        <>
                            {apiKey.isError && <Text color="red" size="sm"> Error loading API key</Text>}
                        </>
                    )
            }
            <Group position="center">
                {((apiKey.isFetching || apiKey.isRefetching)) && <Loader />}
            </Group>
            <Group position="center" pt={30}>
                <Button
                    onClick={() => {
                        setOpened(false);
                        setTimeout(() => {
                            setSuccessCopy(false);
                        }, 300);
                    }}
                >
                    Close
                </Button>
            </Group>
        </Modal>
    );
}
