#!/usr/bin/env node
import React, { useState, useEffect, useCallback } from 'react';
import { render, Box, Text, useInput, useApp } from 'ink';
import { exec, spawnSync } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const STAGING_PORT = 5252;
const STAGING_WORKTREE = '/Users/a1/Projects/SYNGRISI_STAGE';
const STAGING_DB = 'VRSdb_stage';
const MONGODB_URI = 'mongodb://localhost:27017';
const CONTROL_SCRIPT = path.join(__dirname, 'staging-control.sh');

// Types
interface Status {
  worktreeExists: boolean;
  serverRunning: boolean;
  serverPid: string | null;
  databaseConnected: boolean;
  checksCount: number;
  baselinesCount: number;
  testsCount: number;
}

// Async utility functions
async function checkWorktreeExists(): Promise<boolean> {
  return existsSync(STAGING_WORKTREE);
}

async function getServerPid(): Promise<string | null> {
  try {
    const { stdout } = await execAsync(`lsof -ti :${STAGING_PORT}`, { timeout: 1000 });
    return stdout.trim() || null;
  } catch {
    return null;
  }
}

async function checkDatabaseConnected(): Promise<boolean> {
  try {
    await execAsync(`mongosh "${MONGODB_URI}/${STAGING_DB}" --eval "db.version()" --quiet`, {
      timeout: 2000,
    });
    return true;
  } catch {
    return false;
  }
}

async function getDatabaseStats(): Promise<{ checks: number; baselines: number; tests: number }> {
  try {
    const { stdout } = await execAsync(
      `mongosh "${MONGODB_URI}/${STAGING_DB}" --quiet --eval "print(db.checks.countDocuments() + '|' + db.baselines.countDocuments() + '|' + db.tests.countDocuments())"`,
      { timeout: 3000 }
    );
    const [checks, baselines, tests] = stdout.trim().split('|').map(Number);
    return { checks, baselines, tests };
  } catch {
    return { checks: 0, baselines: 0, tests: 0 };
  }
}

async function getStatus(): Promise<Status> {
  const [worktreeExists, serverPid, databaseConnected] = await Promise.all([
    checkWorktreeExists(),
    getServerPid(),
    checkDatabaseConnected(),
  ]);

  const serverRunning = serverPid !== null;
  const stats = databaseConnected
    ? await getDatabaseStats()
    : { checks: 0, baselines: 0, tests: 0 };

  return {
    worktreeExists,
    serverRunning,
    serverPid,
    databaseConnected,
    checksCount: stats.checks,
    baselinesCount: stats.baselines,
    testsCount: stats.tests,
  };
}

// Components
const StatusPanel: React.FC<{ status: Status; loading: boolean }> = ({ status, loading }) => {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={1}>
      <Box>
        <Text bold color="cyan">
          STATUS
        </Text>
        {loading && (
          <Text color="yellow" dimColor>
            {' '}
            (updating...)
          </Text>
        )}
      </Box>

      <Box marginTop={1}>
        <Text bold>Worktree:    </Text>
        <Text color={status.worktreeExists ? 'green' : 'red'}>
          {status.worktreeExists ? '✓ EXISTS' : '✗ NOT FOUND'}
        </Text>
      </Box>

      <Box>
        <Text bold>Server:      </Text>
        <Text color={status.serverRunning ? 'green' : 'yellow'}>
          {status.serverRunning ? `✓ RUNNING (PID: ${status.serverPid})` : '○ STOPPED'}
        </Text>
      </Box>

      {status.serverRunning && (
        <Box>
          <Text bold>URL:         </Text>
          <Text color="cyan">http://localhost:{STAGING_PORT}</Text>
        </Box>
      )}

      <Box>
        <Text bold>Database:    </Text>
        <Text color={status.databaseConnected ? 'green' : 'red'}>
          {status.databaseConnected ? '✓ CONNECTED' : '✗ DISCONNECTED'}
        </Text>
      </Box>

      {status.databaseConnected && (
        <Box flexDirection="column" marginLeft={2}>
          <Box>
            <Text dimColor>Checks:    </Text>
            <Text>{status.checksCount.toLocaleString()}</Text>
          </Box>
          <Box>
            <Text dimColor>Baselines: </Text>
            <Text>{status.baselinesCount.toLocaleString()}</Text>
          </Box>
          <Box>
            <Text dimColor>Tests:     </Text>
            <Text>{status.testsCount.toLocaleString()}</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const MenuItem: React.FC<{
  keyLabel: string;
  label: string;
  description: string;
  selected: boolean;
}> = ({ keyLabel, label, description, selected }) => {
  return (
    <Box>
      {selected ? (
        <Text bold backgroundColor="blue" color="white">
          {' '}
          [{keyLabel}] {label.padEnd(15)}{' '}
        </Text>
      ) : (
        <Text>
          {' '}
          [{keyLabel}] {label.padEnd(15)}{' '}
        </Text>
      )}
      <Text dimColor>{description}</Text>
    </Box>
  );
};

const App: React.FC = () => {
  const [status, setStatus] = useState<Status>({
    worktreeExists: false,
    serverRunning: false,
    serverPid: null,
    databaseConnected: false,
    checksCount: 0,
    baselinesCount: 0,
    testsCount: 0,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [output, setOutput] = useState<string>('');
  const { exit } = useApp();

  // Load status on mount and periodically
  const loadStatus = useCallback(async () => {
    setLoading(true);
    try {
      const newStatus = await getStatus();
      setStatus(newStatus);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 3000);
    return () => clearInterval(interval);
  }, [loadStatus]);

  // Menu items
  const menuItems = [
    {
      key: '1',
      label: 'Setup',
      description: 'Initial environment setup',
      action: async () => {
        setExecuting(true);
        setOutput('Running setup... This may take several minutes.\n\n');
        try {
          const { stdout, stderr } = await execAsync(`${CONTROL_SCRIPT} setup`, {
            timeout: 600000,
          });
          setOutput(`${stdout}\n${stderr}\n\nPress any key to continue...`);
        } catch (error: any) {
          setOutput(`Error: ${error.message}\n\nPress any key to continue...`);
        }
      },
    },
    {
      key: '2',
      label: 'Start',
      description: 'Start staging server',
      action: async () => {
        setExecuting(true);
        setOutput('Starting server in background...\n\n');
        try {
          exec(`${CONTROL_SCRIPT} start > /dev/null 2>&1 &`);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          await loadStatus();
          setOutput('Server started!\n\nPress any key to continue...');
        } catch (error: any) {
          setOutput(`Error: ${error.message}\n\nPress any key to continue...`);
        }
      },
    },
    {
      key: '3',
      label: 'Stop',
      description: 'Stop staging server',
      action: async () => {
        setExecuting(true);
        setOutput('Stopping server...\n\n');
        try {
          const { stdout, stderr } = await execAsync(`${CONTROL_SCRIPT} stop`, { timeout: 30000 });
          await loadStatus();
          setOutput(`${stdout}\n${stderr}\n\nPress any key to continue...`);
        } catch (error: any) {
          setOutput(`Error: ${error.message}\n\nPress any key to continue...`);
        }
      },
    },
    {
      key: '4',
      label: 'Restart',
      description: 'Restart staging server',
      action: async () => {
        setExecuting(true);
        setOutput('Restarting server...\n\n');
        try {
          const { stdout, stderr } = await execAsync(`${CONTROL_SCRIPT} restart`, {
            timeout: 60000,
          });
          await loadStatus();
          setOutput(`${stdout}\n${stderr}\n\nPress any key to continue...`);
        } catch (error: any) {
          setOutput(`Error: ${error.message}\n\nPress any key to continue...`);
        }
      },
    },
    {
      key: '5',
      label: 'Reset',
      description: 'Reset to production state',
      action: async () => {
        setExecuting(true);
        setOutput('Resetting staging environment...\n\n');
        try {
          const { stdout, stderr } = await execAsync(`${CONTROL_SCRIPT} reset`, {
            timeout: 300000,
          });
          await loadStatus();
          setOutput(`${stdout}\n${stderr}\n\nPress any key to continue...`);
        } catch (error: any) {
          setOutput(`Error: ${error.message}\n\nPress any key to continue...`);
        }
      },
    },
    {
      key: '6',
      label: 'Status',
      description: 'Show detailed status',
      action: async () => {
        setExecuting(true);
        setOutput('Loading detailed status...\n\n');
        try {
          const { stdout } = await execAsync(`${CONTROL_SCRIPT} status`, { timeout: 10000 });
          setOutput(`${stdout}\n\nPress any key to continue...`);
        } catch (error: any) {
          setOutput(`Error: ${error.message}\n\nPress any key to continue...`);
        }
      },
    },
    {
      key: '7',
      label: 'Logs',
      description: 'View server logs (Ctrl+C to stop)',
      action: async () => {
        setExecuting(true);
        setOutput('To view logs, exit TUI and run:\n./scripts/staging-control.sh logs\n\nPress any key to continue...');
      },
    },
    {
      key: '8',
      label: 'Browser',
      description: 'Open in browser',
      action: async () => {
        if (status.serverRunning) {
          setExecuting(true);
          setOutput('Opening browser...\n\n');
          try {
            await execAsync(`open "http://localhost:${STAGING_PORT}"`, { timeout: 3000 });
            setOutput('Browser opened!\n\nPress any key to continue...');
          } catch {
            setOutput(
              `Could not open browser.\nPlease open manually: http://localhost:${STAGING_PORT}\n\nPress any key to continue...`
            );
          }
        } else {
          setExecuting(true);
          setOutput('Server is not running.\nPlease start it first (option 2).\n\nPress any key to continue...');
        }
      },
    },
    {
      key: '9',
      label: 'Claude + MCP',
      description: 'Launch Claude with staging MCP',
      action: () => {
        if (status.serverRunning) {
          // Exit TUI first, then launch Claude synchronously with inherited stdio
          exit();
          const claudeScript = path.join(__dirname, 'staging/start-claude-with-staging-mcp.sh');
          // Use spawnSync with inherited stdio so Claude gets terminal control
          spawnSync(claudeScript, [], { stdio: 'inherit', shell: true });
        } else {
          setExecuting(true);
          setOutput('Server is not running.\nPlease start it first (option 2).\n\nPress any key to continue...');
        }
      },
    },
    {
      key: 'q',
      label: 'Quit',
      description: 'Exit TUI',
      action: () => exit(),
    },
  ];

  useInput((input, key) => {
    if (executing) {
      setExecuting(false);
      setOutput('');
      loadStatus();
      return;
    }

    if (input === 'q' || input === 'Q') {
      exit();
    } else if (key.upArrow) {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : menuItems.length - 1));
    } else if (key.downArrow) {
      setSelectedIndex((prev) => (prev < menuItems.length - 1 ? prev + 1 : 0));
    } else if (key.return) {
      menuItems[selectedIndex].action();
    } else {
      const index = menuItems.findIndex((item) => item.key === input);
      if (index !== -1) {
        setSelectedIndex(index);
        menuItems[index].action();
      }
    }
  });

  if (executing) {
    return (
      <Box flexDirection="column" padding={1}>
        <Box borderStyle="round" borderColor="yellow" paddingX={1}>
          <Box flexDirection="column">
            <Text>{output}</Text>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1} justifyContent="center">
        <Text bold color="green">
          STAGING ENVIRONMENT MANAGER
        </Text>
      </Box>

      <StatusPanel status={status} loading={loading} />

      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="cyan"
        paddingX={1}
        marginTop={1}
      >
        <Box>
          <Text bold color="cyan">
            MENU
          </Text>
        </Box>
        {menuItems.map((item, index) => (
          <MenuItem
            key={item.key}
            keyLabel={item.key}
            label={item.label}
            description={item.description}
            selected={index === selectedIndex}
          />
        ))}
      </Box>

      <Box marginTop={1}>
        <Text dimColor>↑↓ arrows or numbers (1-9) to navigate • Enter to select • Q to quit</Text>
      </Box>
    </Box>
  );
};

// Entry point
render(<App />);
