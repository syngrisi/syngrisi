import React from 'react';
import LogoutForm from './components/LogoutForm';
import ResetPasswordForm from './components/ResetPasswordForm';
import LoginForm from './components/LoginForm';

const routesItems = [
    {
        path: '/auth/logout',
        element: <LogoutForm />,
    },
    {
        path: '/auth/reset',
        element: <ResetPasswordForm />,
    },
    {
        path: '/auth/',
        element: <LoginForm />,
    },
];

export default routesItems;
