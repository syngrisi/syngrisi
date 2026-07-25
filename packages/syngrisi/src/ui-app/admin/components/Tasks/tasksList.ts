/* eslint-disable max-len */
export interface IInput {
    name: string,
    label: string,
    type: string,
    default: string | number | boolean,
}

export interface ITask {
    label: string,
    name: string,
    description: string,
    inputs: IInput[]
}

export const tasksList: ITask[] = [
    {
        label: 'Handle old Checks',
        name: 'handle_old_checks',
        description: '⚠️We strongly recommend running the "Handle Database Consistency" task before and after removing checks. By default runs in DRY RUN mode (shows statistics including data volume in GB). Uncheck "Dry run" to actually delete old checks.',
        inputs: [
            { name: 'days', label: 'Check older that (days)', type: 'TextInput', default: 180 },
            { name: 'dryRun', label: 'Dry run', type: 'Checkbox', default: true },
        ],
    },
    {
        label: 'Handle old Baselines',
        name: 'handle_old_baselines',
        description: 'Deletes accepted baselines that are older than N days AND outside the last K kept per check identity. The newest baseline per identity is never deleted. By default runs in DRY RUN mode. Uncheck "Dry run" to actually delete.',
        inputs: [
            { name: 'days', label: 'Baseline older than (days)', type: 'TextInput', default: 120 },
            { name: 'keepLast', label: 'Keep last (per identity)', type: 'TextInput', default: 5 },
            { name: 'dryRun', label: 'Dry run', type: 'Checkbox', default: true },
        ],
    },
    // {
    //     label: 'Test',
    //     name: 'test',
    //     description: '⚠️Test description',
    //     inputs: [
    //         { name: 'days', label: 'Check older that (days)', type: 'TextInput', default: 180 },
    //         { name: 'remove', label: 'Remove', type: 'Checkbox', default: false },
    //     ],
    // },
    {
        label: 'Handle Database Consistency',
        name: 'handle_database_consistency',
        description: 'Checking and removing inconsistent elements. By default runs in DRY RUN mode (only shows statistics). Uncheck "Dry run" to actually remove the inconsistent elements.',
        inputs: [
            { name: 'dryRun', label: 'Dry run', type: 'Checkbox', default: true },
        ],
    },
    {
        label: 'Remove old logs',
        name: 'remove_old_logs',
        description: 'Removing logs that older particular threshold. By default runs in DRY RUN mode (shows statistics without deleting). Uncheck "Dry run" to actually remove logs.',
        inputs: [
            { name: 'days', label: 'Remove older that (days)', type: 'TextInput', default: 30 },
            { name: 'dryRun', label: 'Dry run', type: 'Checkbox', default: true },
        ],
    },
    {
        label: 'Handle Orphan Files',
        name: 'handle_orphan_files',
        description: 'Finds and removes image files that are not referenced by any Snapshot in the database. By default runs in dry-run mode (only shows statistics). Uncheck "Dry run" to actually remove files.',
        inputs: [
            { name: 'dryRun', label: 'Dry run', type: 'Checkbox', default: true },
        ],
    },
    {
        label: 'Handle Orphan Snapshots',
        name: 'handle_orphan_snapshots',
        description: 'Finds and removes Snapshot documents (and their PNG files) that are not referenced by any Baseline or Check. Use after baseline retention if snapshot cleanup did not finish. By default runs in dry-run mode. Uncheck "Dry run" to actually remove.',
        inputs: [
            { name: 'dryRun', label: 'Dry run', type: 'Checkbox', default: true },
        ],
    },
    {
        label: 'Handle Orphan Baselines',
        name: 'handle_orphan_baselines',
        description: 'Finds and removes baselines whose snapshots are not referenced by any checks. By default runs in dry-run mode (only shows statistics). Uncheck "Dry run" to actually remove baselines.',
        inputs: [
            { name: 'dryRun', label: 'Dry run', type: 'Checkbox', default: true },
        ],
    },
];

export const taskLinks = tasksList.map(
    (task) => ({
        label: task.label,
        link: `/admin/tasks/${task.name}`,
    }),
);
