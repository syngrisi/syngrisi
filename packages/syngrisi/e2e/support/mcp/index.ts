/**
 * @fileoverview MCP Server for Syngrisi E2E Testing
 *
 * This module provides a Model Context Protocol (MCP) server that enables
 * AI agents to execute Playwright BDD test steps for Syngrisi.
 *
 * @packageDocumentation
 */

// Main server exports
export {
  startMcpServer,
  type StartMcpServerOptions,
  type McpServerHandle,
  sessionStartToolDefinition,
  stepExecuteToolDefinition,
  stepExecuteBatchToolDefinition,
  attachExistingSessionToolDefinition,
  bootstrapToolDefinitions,
} from './server';

// Bridge exports
export { SdioSseBridge, runBridge } from './bridge';

// Test fixture exports
export { test, testEngineFixture, type TestEngineFixture } from './test-engine.fixture';

// DOM Simplifier exports
export {
  DOMSimplifier,
  type DOMSimplificationOptions as SimplifyOptions,
  type DOMSimplificationResult as SimplifyResult,
  type QualityMetrics,
} from './utils/dom-simplifier';

// Configuration exports
export {
  env,
  DEFAULT_PORT,
  projectRoot,
  e2eRoot,
  mcpRoot,
  stepsRoot,
  supportRoot,
  featuresRoot,
} from './config';

// Logger exports
export {
  default as logger,
  bridgeLogger,
  formatArgs,
  McpLogger,
} from './utils/logger';
