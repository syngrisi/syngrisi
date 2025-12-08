/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import {
    Modal, Text, Button, Group, Stack, TextInput, ActionIcon, Loader,
} from '@mantine/core';
import {
    IconShare, IconCopy, IconCheck, IconTrash, IconLink,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ShareService, ShareToken } from '@shared/services/share.service';
import { errorMsg, successMsg } from '@shared/utils/utils';

interface ShareModalProps {
    opened: boolean;
    onClose: () => void;
    checkId: string;
}

export function ShareModal({ opened, onClose, checkId }: ShareModalProps) {
    const [shareUrl, setShareUrl] = useState<string>('');
    const [copied, setCopied] = useState(false);
    const queryClient = useQueryClient();

    // Query existing share tokens
    const tokensQuery = useQuery(
        ['shareTokens', checkId],
        async () => ShareService.getShareTokens(checkId),
        {
            enabled: opened && !!checkId,
        },
    );

    // Create share mutation
    const createShareMutation = useMutation(
        async () => ShareService.createShareToken(checkId),
        {
            onSuccess: (data) => {
                const fullUrl = `${window.location.origin}${data.shareUrl}`;
                setShareUrl(fullUrl);
                queryClient.invalidateQueries(['shareTokens', checkId]);
                successMsg({ message: 'Share link created' });
            },
            onError: () => {
                errorMsg({ error: 'Failed to create share link' });
            },
        },
    );

    // Revoke mutation
    const revokeMutation = useMutation(
        async (tokenId: string) => ShareService.revokeShareToken(tokenId),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['shareTokens', checkId]);
                successMsg({ message: 'Share link revoked' });
            },
            onError: () => {
                errorMsg({ error: 'Failed to revoke share link' });
            },
        },
    );

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCreateShare = () => {
        createShareMutation.mutate();
    };

    const handleClose = () => {
        setShareUrl('');
        setCopied(false);
        onClose();
    };

    return (
        <Modal opened={opened} onClose={handleClose} title="Share Check" centered size="lg">
            <Stack spacing="md">
                <Text size="sm" color="dimmed">
                    Create a shareable link to allow anyone to view this check without logging in.
                    Shared links are read-only.
                </Text>

                {shareUrl ? (
                    <TextInput
                        value={shareUrl}
                        readOnly
                        icon={<IconLink size={16} />}
                        rightSection={(
                            <ActionIcon
                                onClick={handleCopy}
                                color={copied ? 'teal' : 'gray'}
                                variant="transparent"
                                data-test="copy-share-url"
                            >
                                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                            </ActionIcon>
                        )}
                        data-test="share-url-input"
                    />
                ) : (
                    <Button
                        leftIcon={<IconShare size={16} />}
                        onClick={handleCreateShare}
                        loading={createShareMutation.isLoading}
                        data-test="create-share-button"
                        color="green"
                        fullWidth
                    >
                        Create Share Link
                    </Button>
                )}

                {/* Existing tokens */}
                {tokensQuery.isLoading && <Loader size="sm" />}
                {tokensQuery.data?.results && tokensQuery.data.results.length > 0 && (
                    <Stack spacing="xs" mt="sm">
                        <Text size="sm" weight={500}>Active Share Links</Text>
                        {tokensQuery.data.results.map((token: ShareToken) => (
                            <Group key={token._id} position="apart" noWrap>
                                <Text size="sm" color="dimmed">
                                    Created by
                                    {' '}
                                    <Text span weight={500} color="dark">{token.createdByUsername}</Text>
                                    {' '}
                                    on
                                    {' '}
                                    {new Date(token.createdDate).toLocaleDateString()}
                                </Text>
                                <ActionIcon
                                    color="red"
                                    variant="subtle"
                                    onClick={() => revokeMutation.mutate(token._id)}
                                    loading={revokeMutation.isLoading}
                                    data-test={`revoke-token-${token._id}`}
                                >
                                    <IconTrash size={16} />
                                </ActionIcon>
                            </Group>
                        ))}
                    </Stack>
                )}

                <Group position="right" mt="md">
                    <Button variant="default" onClick={handleClose}>Close</Button>
                </Group>
            </Stack>
        </Modal>
    );
}
