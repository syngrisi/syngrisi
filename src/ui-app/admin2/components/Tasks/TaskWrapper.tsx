import * as React from 'react';
import { useParams } from 'react-router-dom';
import { tasksList } from './tasksList';
import Task from './Task';

export default function TaskWrapper() {
    const params = useParams();
    return (
        <Task item={tasksList.find((x) => x.name === params.task)!} />
    );
}
