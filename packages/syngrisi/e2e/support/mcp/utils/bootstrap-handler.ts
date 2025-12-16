import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  CallToolResultSchema,
  ListToolsRequestSchema,
  ListToolsResultSchema,
  type Notification,
} from '@modelcontextprotocol/sdk/types.js';

import { bootstrapToolDefinitions } from '../server';
import { isShutdownNotification } from './common';

type SessionStartHandler = (toolArgs?: Record<string, unknown>) => Promise<ReturnType<typeof CallToolResultSchema.parse>>;
type AttachExistingSessionHandler = () => Promise<ReturnType<typeof CallToolResultSchema.parse>>;

type BootstrapHandlerOptions = {
  server: Server;
  handleSessionStart: SessionStartHandler;
  handleAttachExistingSession: AttachExistingSessionHandler;
  onShutdown: () => void;
};

export class BootstrapHandler {
  private readonly server: Server;
  private readonly handleSessionStart: SessionStartHandler;
  private readonly handleAttachExistingSession: AttachExistingSessionHandler;
  private readonly onShutdown: () => void;

  constructor(options: BootstrapHandlerOptions) {
    this.server = options.server;
    this.handleSessionStart = options.handleSessionStart;
    this.handleAttachExistingSession = options.handleAttachExistingSession;
    this.onShutdown = options.onShutdown;
  }

  activate(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return ListToolsResultSchema.parse({ tools: bootstrapToolDefinitions });
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (args) => {
      const { name, arguments: toolArgs } = args.params as { name: string; arguments?: Record<string, unknown> };
      if (name !== 'session_start_new') {
        if (name === 'attach_existing_session') {
          return this.handleAttachExistingSession();
        }
        return CallToolResultSchema.parse({
          content: [{ type: 'text', text: 'Status: Failed\nError: Session not started. Please call session_start_new first.' }],
          isError: true,
        });
      }

      return this.handleSessionStart(toolArgs);
    });

    this.server.fallbackNotificationHandler = async (notification: Notification) => {
      if (isShutdownNotification(notification)) {
        this.onShutdown();
      }
    };
  }
}
