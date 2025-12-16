import React from 'react';
import LogoutForm from '@auth/components/LogoutForm';
import ChangePasswordForm from '@auth/components/ChangePasswordForm';
import LoginForm from '@auth/components/LoginForm';
import ChangePasswordSuccessForm from '@auth/components/ChangePasswordSuccessForm';

const routesItems = [
    {
        path: '/auth/logout',
        element: <LogoutForm />,
    },
    {
        path: '/auth/change',
        element: <ChangePasswordForm />,
    },
    {
        path: '/auth/changeSuccess',
        element: <ChangePasswordSuccessForm />,
    },
    {
        path: '/auth/',
        element: <LoginForm />,
    },
];

export default routesItems;
