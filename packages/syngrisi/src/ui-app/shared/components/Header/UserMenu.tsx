import * as React from 'react';
import {
    Menu,
    Button,
    useMantineTheme,
    Group,
} from '@mantine/core';

import {
    IconUser,
    IconTool,
    IconKey,
    IconSettings,
    IconId,
    IconLogout,
} from '@tabler/icons-react';
import { useState } from 'react';
// import { isDark } from '../../utils';
import { UserHooks } from '../../hooks';
import ApiKeyModalAsk from './ApiKeyModalAsk';
import { ApiKeyModalResult } from './ApiKeyModalResult';
import { UserInfoModal } from './UserInfoModal';
import ToggleThemeButton from '../ToggleThemeButton';
import useColorScheme from '../../hooks/useColorSheme';

function UserMenu() {
    const theme = useMantineTheme();
    const [colorScheme, toggleColorScheme] = useColorScheme();
    const apiKey = UserHooks.useApiKey();
    const [apiKeyModalAskOpened, setApiKeyModalAskOpened] = useState(false);
    const [apiKeyModalResultOpened, setApiKeyModalResultOpened] = useState(false);
    const [userInfoModalOpened, setUserInfoModalOpened] = useState(false);
    const currentUser: any = UserHooks.useCurrentUser();

    const userInitials = (currentUser.isSuccess && currentUser.data.firstName)
        ? `${currentUser?.data?.firstName[0]}${currentUser?.data?.lastName[0]}`
        : '';
    const isAdmin = currentUser?.data?.role === 'admin';
    return (
        <>
            <Menu shadow="md" width="20%">
                <Menu.Target>
                    <Button
                        data-test="user-icon"
                        aria-label={`User menu for ${currentUser?.data?.firstName || ''} ${currentUser?.data?.lastName || ''}`}
                        p={0}
                        radius="xl"
                        size="md"
                        color={theme.colorScheme === 'dark' ? 'dark' : '#ffffff'}
                        sx={{
                            color: theme.colorScheme === 'dark' ? '#ffffff' : '#1a1b1e',
                            backgroundColor: theme.colorScheme === 'dark' ? '#1a1b1e' : theme.colors.gray[0],
                            fontWeight: 600,
                            fontSize: '1rem',
                            display: 'flex',
                            width: '2.6rem',
                            justifyContent: 'center',
                            '&:hover': {
                                backgroundColor: theme.colorScheme === 'dark' ? '#000000' : '#ffffff',
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
                        <Group position="apart" sx={{ width: '100%' }}>
                            <Group spacing={0}>
                                <IconUser size="14px" stroke={3} style={{ marginRight: '10px' }} />
                                {currentUser?.data?.firstName}
                                {' '}
                                {currentUser?.data?.lastName}
                            </Group>
                            <ToggleThemeButton colorScheme={colorScheme} toggleColorScheme={toggleColorScheme} />
                        </Group>

                    </Menu.Label>
                    <Menu.Divider />
                    <Menu.Item
                        data-test="userinfo"
                        aria-label="User Details"
                        icon={<IconId size={14} />}
                        onClick={() => {
                            setUserInfoModalOpened(true);
                        }}
                    >
                        User Details
                    </Menu.Item>
                    <Menu.Item
                        disabled={!isAdmin}
                        icon={<IconSettings size={14} />}
                        onClick={() => window.location.assign('/admin/')}
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
                        aria-label="Generate API key"
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
