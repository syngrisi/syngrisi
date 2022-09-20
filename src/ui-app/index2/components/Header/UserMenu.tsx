import * as React from 'react';
import {
    Menu,
    Button,
    useMantineTheme,
} from '@mantine/core';

import {
    IconUser,
    IconTool,
    IconKey,
    IconSettings,
    IconId,
    IconLogout,
} from '@tabler/icons';
import { useState } from 'react';
import { isDark } from '../../../shared/utils';
import { UserHooks } from '../../../shared/hooks';
import ApiKeyModalAsk from './ApiKeyModalAsk';
import { ApiKeyModalResult } from './ApiKeyModalResult';
import { UserInfoModal } from './UserInfoModal';

function UserMenu() {
    const theme = useMantineTheme();
    const apiKey = UserHooks.useApiKey();
    const [apiKeyModalAskOpened, setApiKeyModalAskOpened] = useState(false);
    const [apiKeyModalResultOpened, setApiKeyModalResultOpened] = useState(false);
    const [userInfoModalOpened, setUserInfoModalOpened] = useState(false);
    const currentUser: any = UserHooks.useCurrentUser();

    const userInitials = (currentUser.isSuccess && currentUser.data.firstName)
        ? `${currentUser?.data?.firstName[0]}${currentUser?.data?.lastName[0]}`
        : '';

    return (
        <>
            <Menu shadow="md" width="20%">
                <Menu.Target>
                    <Button
                        data-test="user-icon"
                        p={0}
                        radius="xl"
                        size="md"
                        color={isDark() ? 'dark' : '#ffffff'}
                        sx={{
                            color: isDark() ? '#ffffff' : '#1a1b1e',
                            backgroundColor: isDark() ? '#1a1b1e' : theme.colors.gray[0],
                            fontWeight: 600,
                            fontSize: '1rem',
                            display: 'flex',
                            width: '2.6rem',
                            justifyContent: 'center',
                            '&:hover': {
                                backgroundColor: isDark() ? '#000000' : '#ffffff',
                            },
                        }}
                    >
                        {userInitials}
                    </Button>

                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Label
                        data-test="user-short-details"
                        sx={{
                            fontSize: '14px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            color: theme.colors.blue[5],
                        }}
                    >
                        <IconUser size="14px" stroke={3} style={{ marginRight: '10px' }} />
                        {currentUser?.data?.firstName}
                        {' '}
                        {currentUser?.data?.lastName}
                    </Menu.Label>
                    <Menu.Divider />
                    <Menu.Item
                        data-test="userinfo"
                        icon={<IconId size={14} />}
                        onClick={() => {
                            setUserInfoModalOpened(true);
                        }}
                    >
                        User Details
                    </Menu.Item>
                    <Menu.Item
                        icon={<IconSettings size={14} />}
                        component="a"
                        href="/admin/"
                    >
                        Admin Panel
                    </Menu.Item>
                    <Menu.Item
                        icon={<IconKey size={14} />}
                        component="a"
                        href="/auth/change"
                    >
                        Change Password
                    </Menu.Item>
                    <Menu.Item
                        id="generate-api"
                        icon={<IconTool size={14} />}
                        onClick={() => {
                            setApiKeyModalAskOpened(true);
                        }}
                    >
                        Generate API key
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        icon={<IconLogout size={14} />}
                        component="a"
                        href="/auth/logout"
                    >
                        Sign out
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
            <ApiKeyModalAsk
                opened={apiKeyModalAskOpened}
                setOpened={setApiKeyModalAskOpened}
                apiKey={apiKey}
                setResultOpened={setApiKeyModalResultOpened}
            />
            <ApiKeyModalResult
                opened={apiKeyModalResultOpened}
                setOpened={setApiKeyModalResultOpened}
                apiKey={apiKey}
            />
            <UserInfoModal
                opened={userInfoModalOpened}
                setOpened={setUserInfoModalOpened}
            />
        </>
    );
}

export default UserMenu;
