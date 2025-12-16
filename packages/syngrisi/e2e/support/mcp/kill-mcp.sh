#!/bin/bash

# Kill MCP Bridge processes (bridge-cli)
echo "Killing MCP Bridge processes..."
pkill -f "bridge-cli.ts" || echo "No bridge processes found."

# Kill Playwright MCP Server processes (mcp.spec.ts)
echo "Killing Playwright MCP Server processes..."
pkill -f "mcp.spec.ts" || echo "No server processes found."

echo "Cleanup complete."
