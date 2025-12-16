import type { Client } from '@modelcontextprotocol/sdk/client/index.js';
import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListToolsResultSchema,
  LoggingMessageNotificationSchema,
  type Notification,
} from '@modelcontextprotocol/sdk/types.js';

import { attachExistingSessionToolDefinition, sessionStartToolDefinition } from '../server';
import { isShutdownNotification } from './common';

type SessionStartHandler = (toolArgs?: Record<string, unknown>) => Promise<unknown>;
type AttachExistingSessionHandler = () => Promise<unknown>;

type ProxiedHandlerOptions = {
  server: Server;
  client: Client;
  handleSessionStart: SessionStartHandler;
  handleAttachExistingSession: AttachExistingSessionHandler;
  log: (message: string) => void;
  onNotificationForwardError: (error: unknown) => void;
  onRemoteShutdown: () => void;
};

export class ProxiedHandler {
  private readonly server: Server;
  private readonly client: Client;
  private readonly handleSessionStart: SessionStartHandler;
  private readonly handleAttachExistingSession: AttachExistingSessionHandler;
  private readonly log: (message: string) => void;
  private readonly onNotificationForwardError: (error: unknown) => void;
  private readonly onRemoteShutdown: () => void;

  constructor(options: ProxiedHandlerOptions) {
    this.server = options.server;
    this.client = options.client;
    this.handleSessionStart = options.handleSessionStart;
    this.handleAttachExistingSession = options.handleAttachExistingSession;
    this.log = options.log;
    this.onNotificationForwardError = options.onNotificationForwardError;
    this.onRemoteShutdown = options.onRemoteShutdown;
  }

  activate(): void {
    this.server.setNotificationHandler(LoggingMessageNotificationSchema, async (args) => this.client.notification(args));
    this.client.setNotificationHandler(LoggingMessageNotificationSchema, async (args) => this.server.notification(args));

    this.server.setRequestHandler(ListToolsRequestSchema, async (args) => {
      const remote = await this.client.listTools(args.params);
      const tools = (remote.tools ?? []).filter(
        (tool: any) => tool?.name !== 'session_start_new' && tool?.name !== 'attach_existing_session',
      );
      tools.unshift(sessionStartToolDefinition, attachExistingSessionToolDefinition);
      return { tools } as any;
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (args) => {
      const { name, arguments: toolArgs } = args.params as { name: string; arguments?: Record<string, unknown> };
      if (name === 'session_start_new') {
        return this.handleSessionStart(toolArgs);
      }
      if (name === 'attach_existing_session') {
        return this.handleAttachExistingSession();
      }

      this.log(`📞 Calling tool "${name}" with args: ${JSON.stringify(toolArgs)}`);
      const result = await this.client.callTool(args.params);
      const contentArray = Array.isArray(result.content) ? result.content : [];
      const firstContent = contentArray[0];
      const contentText = firstContent && typeof firstContent === 'object' && 'text' in firstContent
        ? String((firstContent as { text: unknown }).text)
        : '(no text content)';
      const textPreview = contentText.substring(0, 100).replace(/\n/g, ' ');
      this.log(`📦 Tool "${name}" result: isError=${result.isError ?? false}, content length=${contentText.length}, preview="${textPreview}..."`);

      return result;
    });

    this.server.fallbackNotificationHandler = async (notification: Notification) => {
      try {
        await this.client.notification(notification);
      } catch (error: unknown) {
        this.onNotificationForwardError(error);
      }

      if (isShutdownNotification(notification)) {
        this.onRemoteShutdown();
      }
    };
  }
}
