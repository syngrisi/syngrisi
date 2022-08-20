import React from 'react';
import LogoutForm from './components/LogoutForm';
import ChangePasswordForm from './components/ChangePasswordForm';
import LoginForm from './components/LoginForm';
import ChangePasswordSuccessForm from './components/ChangePasswordSuccessForm';

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
