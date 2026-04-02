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
    IconInfoCircle,
} from '@tabler/icons-react';
import { useState } from 'react';
// import { isDark } from '../../utils';
import { UserHooks } from '@shared/hooks';
import ApiKeyModalAsk from '@shared/components/Header/ApiKeyModalAsk';
import { ApiKeyModalResult } from '@shared/components/Header/ApiKeyModalResult';
import { UserInfoModal } from '@shared/components/Header/UserInfoModal';
import { AboutModal } from '@shared/components/Header/AboutModal';
import ToggleThemeButton from '@shared/components/ToggleThemeButton';
import { useMantineColorScheme } from '@mantine/core';

function UserMenu() {
    const theme = useMantineTheme();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const apiKey = UserHooks.useApiKey();
    const [apiKeyModalAskOpened, setApiKeyModalAskOpened] = useState(false);
    const [apiKeyModalResultOpened, setApiKeyModalResultOpened] = useState(false);
    const [userInfoModalOpened, setUserInfoModalOpened] = useState(false);
    const [aboutModalOpened, setAboutModalOpened] = useState(false);
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
                        color={colorScheme === 'dark' ? 'dark' : '#ffffff'}
                        style={{
                            color: colorScheme === 'dark' ? '#ffffff' : '#1a1b1e',
                            backgroundColor: colorScheme === 'dark' ? '#1a1b1e' : theme.colors.gray[0],
                            fontWeight: 600,
                            fontSize: '1rem',
                            display: 'flex',
                            width: '2.6rem',
                            justifyContent: 'center',
                            '&:hover': {
                                backgroundColor: colorScheme === 'dark' ? '#000000' : '#ffffff',
                            },
                        }}
                    >
                        <span data-test="user-initials">{userInitials}</span>
                    </Button>

                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Label
                        data-test="user-short-details"
                        style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            color: theme.colors.blue[5],
                        }}
                    >
                        <Group justify="space-between" style={{ width: '100%' }}>
                            <Group gap={0}>
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
                        leftSection={<IconId size={14} />}
                        onClick={() => {
                            setUserInfoModalOpened(true);
                        }}
                    >
                        User Details
                    </Menu.Item>
                    <Menu.Item
                        disabled={!isAdmin}
                        leftSection={<IconSettings size={14} />}
                        onClick={() => window.location.assign('/admin/')}
                    >
                        Admin Panel
                    </Menu.Item>
                    <Menu.Item
                        leftSection={<IconKey size={14} />}
                        component="a"
                        href="/auth/change"
                    >
                        Change Password
                    </Menu.Item>
                    <Menu.Item
                        id="generate-api"
                        aria-label="Generate API key"
                        leftSection={<IconTool size={14} />}
                        onClick={() => {
                            setApiKeyModalAskOpened(true);
                        }}
                    >
                        Generate API key
                    </Menu.Item>
                    <Menu.Item
                        data-test="about"
                        aria-label="About Syngrisi"
                        leftSection={<IconInfoCircle size={14} />}
                        onClick={() => {
                            setAboutModalOpened(true);
                        }}
                    >
                        About
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        leftSection={<IconLogout size={14} />}
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
            <AboutModal
                opened={aboutModalOpened}
                setOpened={setAboutModalOpened}
            />
        </>
    );
}

export default UserMenu;
