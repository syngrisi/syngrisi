import * as React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { tasksList } from '@admin/components/Tasks/tasksList';
import Task from '@admin/components/Tasks/Task';
import { Text, Paper } from '@mantine/core';

export default function TaskWrapper() {
    const params = useParams();
    const task = tasksList.find((x) => x.name === params.task);

    if (!task) {
        return (
            <Paper p={10}>
                <Text color="red">Task not found: {params.task}</Text>
            </Paper>
        );
    }

    return <Task item={task} />;
}
