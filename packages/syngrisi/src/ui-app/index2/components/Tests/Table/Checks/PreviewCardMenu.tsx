import * as React from 'react';
import { useState } from 'react';
import { Menu, ActionIcon } from '@mantine/core';
import { IconDotsVertical, IconBinoculars, IconTrash } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GenericService } from '@shared/services';
import { useParams } from '@hooks/useParams';
import { errorMsg, successMsg } from '@shared/utils/utils';
import { DeleteBaselineModal } from '@index/components/Tests/Table/Checks/CheckDetails/Modals/DeleteBaselineModal';

// Kebab menu shown on a check preview card: AI Match (find similar checks) and Delete baseline.
export function PreviewCardMenu({ check }: { check: any }) {
    const { setQuery } = useParams();
    const queryClient = useQueryClient();
    const [deleteOpened, setDeleteOpened] = useState(false);
    const baselineId: string | undefined = check?.baselineId?._id;

    const stop = (e: React.MouseEvent) => e.stopPropagation();

    const deleteBaseline = useMutation({
        mutationFn: (id: string) => GenericService.delete('baselines', id),
        onSuccess: async () => {
            successMsg({ message: 'Baseline has been successfully removed' });
            setDeleteOpened(false);
            await queryClient.invalidateQueries();
        },
        onError: (e: any) => {
            errorMsg({ error: 'Cannot remove the baseline' });
            console.error(e);
        },
    });

    return (
        <>
            <Menu shadow="md" width={180} position="bottom-end" withinPortal>
                <Menu.Target>
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="sm"
                        aria-label="More actions"
                        data-test="preview-card-menu"
                        data-check-preview-menu={check.name}
                        onClick={stop}
                    >
                        <IconDotsVertical size={16} />
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown onClick={stop}>
                    <Menu.Item
                        leftSection={<IconBinoculars size={14} />}
                        data-test="preview-menu-ai-match"
                        onClick={(e) => {
                            stop(e);
                            setQuery({ similarTo: String(check._id), checkId: undefined, modalIsOpen: undefined });
                        }}
                    >
                        AI Match
                    </Menu.Item>
                    <Menu.Item
                        color="red"
                        leftSection={<IconTrash size={14} />}
                        data-test="preview-menu-delete-baseline"
                        disabled={!baselineId}
                        onClick={(e) => {
                            stop(e);
                            setDeleteOpened(true);
                        }}
                    >
                        Delete baseline
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
            <DeleteBaselineModal
                opened={deleteOpened}
                onClose={() => setDeleteOpened(false)}
                onConfirm={() => baselineId && deleteBaseline.mutate(baselineId)}
                usageCount={0}
                snapshotId={baselineId || ''}
            />
        </>
    );
}
