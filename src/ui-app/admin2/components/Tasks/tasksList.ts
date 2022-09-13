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
        description: '⚠️We strongly recommended doing the remove inconsistent items procedure Before and After removing checks via this task.',
        inputs: [
            { name: 'days', label: 'Check older that (days)', type: 'TextInput', default: 180 },
            { name: 'remove', label: 'Remove', type: 'Checkbox', default: false },
        ],
    },
    {
        label: 'Test',
        name: 'test',
        description: '⚠️Test description',
        inputs: [
            { name: 'days', label: 'Check older that (days)', type: 'TextInput', default: 180 },
            { name: 'remove', label: 'Remove', type: 'Checkbox', default: false },
        ],
    },
    {
        label: 'Handle Database Consistency',
        name: 'handle_database_consistency',
        description: 'Checks and removes non-consistent items',
        inputs: [
            { name: 'clean', label: 'Remove', type: 'Checkbox', default: false },
        ],
    },
    {
        label: 'Remove old logs',
        name: 'remove_old_logs',
        description: 'Remove logs that older particular threshold',
        inputs: [
            { name: 'days', label: 'Remove older that (days)', type: 'TextInput', default: 30 },
            { name: 'statistics', label: 'Only statistics', type: 'Checkbox', default: false },
        ],
    },
];

export const taskLinks = tasksList.map(
    (task) => ({
        label: task.label,
        link: `/admin2/tasks/${task.name}`,
    }),
);
