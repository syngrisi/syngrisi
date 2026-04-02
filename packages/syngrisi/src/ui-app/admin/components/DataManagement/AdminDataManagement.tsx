import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Badge,
    Button,
    Checkbox,
    Code,
    FileInput,
    Group,
    Loader,
    Paper,
    Progress,
    ScrollArea,
    SimpleGrid,
    Stack,
    Table,
    Text,
    Title,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IconAlertTriangle, IconDatabaseExport, IconDownload, IconPhotoUp, IconRefresh, IconRestore, IconTrash, IconX } from '@tabler/icons-react';
import { adminDataService, AdminDataJob } from '@shared/services/adminData.service';
import { useSubpageEffect } from '@shared/hooks';

const ACTIVE_STATUSES = new Set(['pending', 'running']);

function formatBytes(bytes?: number) {
    if (!bytes || bytes <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = bytes;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }
    return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

function getJobLabel(type: AdminDataJob['type']) {
    switch (type) {
        case 'db_backup':
            return 'Database Backup';
        case 'db_restore':
            return 'Database Restore';
        case 'screenshots_backup':
            return 'Screenshots Backup';
        case 'screenshots_restore':
            return 'Screenshots Restore';
        default:
            return type;
    }
}

function getStatusColor(status: AdminDataJob['status']) {
    switch (status) {
        case 'completed':
            return 'green';
        case 'failed':
            return 'red';
        case 'cancelled':
            return 'orange';
        case 'running':
            return 'blue';
        case 'pending':
            return 'yellow';
        default:
            return 'gray';
    }
}

export default function AdminDataManagement() {
    useSubpageEffect('Data Management');

    const queryClient = useQueryClient();
    const [dbRestoreFile, setDbRestoreFile] = useState<File | null>(null);
    const [screenshotsRestoreFile, setScreenshotsRestoreFile] = useState<File | null>(null);
    const [skipExisting, setSkipExisting] = useState(true);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [jobLog, setJobLog] = useState('');

    const jobsQuery = useQuery({
        queryKey: ['admin-data-jobs'],
        queryFn: () => adminDataService.listJobs(),
        refetchInterval: (data) => {
            const jobs = data?.jobs || [];
            return jobs.some((job) => ACTIVE_STATUSES.has(job.status)) ? 2000 : 10000;
        },
    });

    const selectedJob = useMemo(
        () => jobsQuery.data?.jobs.find((job) => job.id === selectedJobId) || jobsQuery.data?.jobs[0] || null,
        [jobsQuery.data, selectedJobId],
    );

    useEffect(() => {
        if (!selectedJob) {
            setJobLog('');
            return undefined;
        }

        let mounted = true;
        const loadLog = async () => {
            try {
                const logText = await adminDataService.getJobLog(selectedJob.id);
                if (mounted) {
                    setJobLog(logText);
                }
            } catch (error) {
                if (mounted) {
                    setJobLog(`Failed to load log: ${error instanceof Error ? error.message : String(error)}`);
                }
            }
        };

        void loadLog();
        const timer = setInterval(() => {
            void loadLog();
        }, ACTIVE_STATUSES.has(selectedJob.status) ? 2000 : 10000);

        return () => {
            mounted = false;
            clearInterval(timer);
        };
    }, [selectedJob?.id, selectedJob?.status]);

    const withRefresh = async <T,>(promise: Promise<T>) => {
        const result = await promise;
        await queryClient.invalidateQueries({ queryKey: ['admin-data-jobs'] });
        return result;
    };

    const dbBackupMutation = useMutation({
        mutationFn: () => withRefresh(adminDataService.startDbBackup()),
        onSuccess: (job) => {
            setSelectedJobId(job.id);
            showNotification({ color: 'green', title: 'Job started', message: 'Database backup job has been queued.' });
        },
        onError: (error) => {
            showNotification({ color: 'red', title: 'Failed to start backup', message: error instanceof Error ? error.message : String(error) });
        },
    });

    const screenshotsBackupMutation = useMutation({
        mutationFn: () => withRefresh(adminDataService.startScreenshotsBackup()),
        onSuccess: (job) => {
            setSelectedJobId(job.id);
            showNotification({ color: 'green', title: 'Job started', message: 'Screenshots backup job has been queued.' });
        },
        onError: (error) => {
            showNotification({ color: 'red', title: 'Failed to start backup', message: error instanceof Error ? error.message : String(error) });
        },
    });

    const dbRestoreMutation = useMutation({
        mutationFn: async () => {
            if (!dbRestoreFile) throw new Error('Select a database archive first');
            return withRefresh(adminDataService.startDbRestore(dbRestoreFile));
        },
        onSuccess: (job) => {
            setSelectedJobId(job.id);
            setDbRestoreFile(null);
            showNotification({ color: 'green', title: 'Restore started', message: 'Database restore job has been queued.' });
        },
        onError: (error) => {
            showNotification({ color: 'red', title: 'Failed to start restore', message: error instanceof Error ? error.message : String(error) });
        },
    });

    const screenshotsRestoreMutation = useMutation({
        mutationFn: async () => {
            if (!screenshotsRestoreFile) throw new Error('Select a screenshots archive first');
            return withRefresh(adminDataService.startScreenshotsRestore(screenshotsRestoreFile, skipExisting));
        },
        onSuccess: (job) => {
            setSelectedJobId(job.id);
            setScreenshotsRestoreFile(null);
            showNotification({ color: 'green', title: 'Restore started', message: 'Screenshots restore job has been queued.' });
        },
        onError: (error) => {
            showNotification({ color: 'red', title: 'Failed to start restore', message: error instanceof Error ? error.message : String(error) });
        },
    });

    const cancelMutation = useMutation({
        mutationFn: (jobId: string) => withRefresh(adminDataService.cancelJob(jobId)),
        onSuccess: () => {
            showNotification({ color: 'orange', title: 'Cancellation requested', message: 'The job will stop as soon as possible.' });
        },
        onError: (error) => {
            showNotification({ color: 'red', title: 'Cancel failed', message: error instanceof Error ? error.message : String(error) });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (jobId: string) => withRefresh(adminDataService.deleteJob(jobId)),
        onSuccess: () => {
            showNotification({ color: 'green', title: 'Deleted', message: 'Job data has been removed from the server.' });
        },
        onError: (error) => {
            showNotification({ color: 'red', title: 'Delete failed', message: error instanceof Error ? error.message : String(error) });
        },
    });

    const isBusy = dbBackupMutation.isPending
        || screenshotsBackupMutation.isPending
        || dbRestoreMutation.isPending
        || screenshotsRestoreMutation.isPending;

    return (
        <ScrollArea type="auto" h="calc(100vh - 120px)">
        <Stack gap="lg">
            <Group justify="space-between">
                <div>
                    <Title order={2}>Data Management</Title>
                    <Text c="dimmed">Backup and restore database dumps and screenshots through background jobs.</Text>
                </div>
                <Button
                    variant="outline"
                    leftIcon={<IconRefresh size={16} />}
                    onClick={() => jobsQuery.refetch()}
                    loading={jobsQuery.isFetching}
                >
                    Refresh
                </Button>
            </Group>

            <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
                <Paper withBorder p="md">
                    <Stack>
                        <Group>
                            <IconDatabaseExport size={18} />
                            <Title order={4}>Database Backup</Title>
                        </Group>
                        <Text size="sm" c="dimmed">Create a MongoDB archive on the server and download it when the job completes.</Text>
                        <Button onClick={() => dbBackupMutation.mutate()} loading={dbBackupMutation.isPending} disabled={isBusy}>
                            Start Database Backup
                        </Button>
                    </Stack>
                </Paper>

                <Paper withBorder p="md">
                    <Stack>
                        <Group>
                            <IconRestore size={18} />
                            <Title order={4}>Database Restore</Title>
                        </Group>
                        <Alert color="red" icon={<IconAlertTriangle size={16} />}>
                            This operation drops the current database and replaces it with the uploaded dump.
                        </Alert>
                        <FileInput
                            label="Database archive"
                            placeholder="Select .tar.gz file"
                            value={dbRestoreFile}
                            onChange={setDbRestoreFile}
                        />
                        <Button color="red" onClick={() => dbRestoreMutation.mutate()} loading={dbRestoreMutation.isPending} disabled={isBusy || !dbRestoreFile}>
                            Upload and Restore Database
                        </Button>
                    </Stack>
                </Paper>

                <Paper withBorder p="md">
                    <Stack>
                        <Group>
                            <IconPhotoUp size={18} />
                            <Title order={4}>Screenshots Backup</Title>
                        </Group>
                        <Text size="sm" c="dimmed">Create a tar.gz archive of current screenshots and download it when ready.</Text>
                        <Button onClick={() => screenshotsBackupMutation.mutate()} loading={screenshotsBackupMutation.isPending} disabled={isBusy}>
                            Start Screenshots Backup
                        </Button>
                    </Stack>
                </Paper>

                <Paper withBorder p="md">
                    <Stack>
                        <Group>
                            <IconRestore size={18} />
                            <Title order={4}>Screenshots Restore</Title>
                        </Group>
                        <FileInput
                            label="Screenshots archive"
                            placeholder="Select .tar.gz file"
                            value={screenshotsRestoreFile}
                            onChange={setScreenshotsRestoreFile}
                        />
                        <Checkbox
                            checked={skipExisting}
                            onChange={(event) => setSkipExisting(event.currentTarget.checked)}
                            label="Do not overwrite existing files"
                        />
                        <Button onClick={() => screenshotsRestoreMutation.mutate()} loading={screenshotsRestoreMutation.isPending} disabled={isBusy || !screenshotsRestoreFile}>
                            Upload and Restore Screenshots
                        </Button>
                    </Stack>
                </Paper>
            </SimpleGrid>

            <Paper withBorder p="md">
                <Group justify="space-between" mb="md">
                    <div>
                        <Title order={4}>Job History</Title>
                        <Text size="sm" c="dimmed">Background jobs for backup and restore operations.</Text>
                    </div>
                    {jobsQuery.isLoading && <Loader size="sm" />}
                </Group>

                <div style={{ overflowX: 'auto' }}>
                <Table striped highlightOnHover withBorder>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Progress</th>
                            <th>Stats</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(jobsQuery.data?.jobs || []).map((job) => (
                            <tr key={job.id} onClick={() => setSelectedJobId(job.id)} style={{ cursor: 'pointer' }}>
                                <td>
                                    <Text fw={500}>{getJobLabel(job.type)}</Text>
                                    <Text size="xs" c="dimmed"><Code>{job.id}</Code></Text>
                                </td>
                                <td>
                                    <Badge color={getStatusColor(job.status)}>{job.status}</Badge>
                                    <Text size="xs" c="dimmed">{job.message}</Text>
                                </td>
                                <td style={{ minWidth: 180 }}>
                                    <Progress value={job.progress.percent || 0} size="lg" />
                                    <Text size="xs" c="dimmed">
                                        {job.progress.stage}
                                        {typeof job.progress.current === 'number' && typeof job.progress.total === 'number'
                                            ? ` (${job.progress.current}/${job.progress.total})`
                                            : ''}
                                    </Text>
                                </td>
                                <td>
                                    <Text size="sm">Archive: {formatBytes(job.stats.archiveSizeBytes)}</Text>
                                    {'processedFiles' in job.stats && (
                                        <Text size="xs" c="dimmed">
                                            Processed: {job.stats.processedFiles || 0}
                                            {job.stats.importedFiles !== undefined ? `, imported ${job.stats.importedFiles}` : ''}
                                            {job.stats.skippedFiles !== undefined ? `, skipped ${job.stats.skippedFiles}` : ''}
                                            {job.stats.errorFiles !== undefined ? `, errors ${job.stats.errorFiles}` : ''}
                                        </Text>
                                    )}
                                </td>
                                <td>
                                    <Group gap="xs">
                                        {job.downloadAvailable && (
                                            <Button
                                                component="a"
                                                href={adminDataService.getDownloadUrl(job.id)}
                                                variant="outline"
                                                size="xs"
                                                leftIcon={<IconDownload size={14} />}
                                            >
                                                Download
                                            </Button>
                                        )}
                                        {ACTIVE_STATUSES.has(job.status) && (
                                            <Button
                                                color="red"
                                                variant="outline"
                                                size="xs"
                                                leftIcon={<IconX size={14} />}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    cancelMutation.mutate(job.id);
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                        {!ACTIVE_STATUSES.has(job.status) && (
                                            <Button
                                                color="gray"
                                                variant="outline"
                                                size="xs"
                                                leftIcon={<IconTrash size={14} />}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    deleteMutation.mutate(job.id);
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </Group>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                </div>
            </Paper>

            <Paper withBorder p="md">
                <Group justify="space-between" mb="md">
                    <div>
                        <Title order={4}>Selected Job Details</Title>
                        {selectedJob && <Text size="sm" c="dimmed">{getJobLabel(selectedJob.type)} ({selectedJob.id})</Text>}
                    </div>
                </Group>
                {selectedJob ? (
                    <Stack gap="sm">
                        <Text>Status: <Badge c={getStatusColor(selectedJob.status)}>{selectedJob.status}</Badge></Text>
                        {selectedJob.error && (
                            <Alert c="red">{selectedJob.error}</Alert>
                        )}
                        <Text size="sm">Progress stage: <Code>{selectedJob.progress.stage}</Code></Text>
                        <textarea
                            readOnly
                            value={jobLog}
                            style={{
                                width: '100%',
                                minHeight: '320px',
                                backgroundColor: '#101113',
                                color: '#f6f7f9',
                                padding: '12px',
                                borderRadius: '8px',
                                fontFamily: 'monospace',
                            }}
                        />
                    </Stack>
                ) : (
                    <Text c="dimmed">No jobs yet.</Text>
                )}
            </Paper>
        </Stack>
        </ScrollArea>
    );
}
