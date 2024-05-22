import { spawn, ChildProcess } from "child_process";
import * as fs from "fs";
import { request } from "playwright";
import { execSync } from "child_process";

export class ServerManager {
  private child: ChildProcess | null;
  private logStream: fs.WriteStream;
  private port: string;
  private databaseName: string;

  constructor(port: string, databaseName: string) {
    this.child = null;
    this.port = port;
    this.databaseName = databaseName;
  }

  private killProcessOnPort(port: string) {
    try {
      const pid = execSync(`lsof -ti tcp:${port}`).toString().trim();
      if (pid) {
        execSync(`kill -9 ${pid}`);
        console.log(`Process on port ${port} killed`);
      }
    } catch (error) {
      // Ignore error if no process is using the port
    }
  }

  startServer(env: NodeJS.ProcessEnv) {
    this.killProcessOnPort(this.port);

    env.SYNGRISI_APP_PORT = this.port.toString();
    env.SYNGRISI_DB_URI = `mongodb://localhost/${this.databaseName}`;

    const logDir = './logs';
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }
    this.logStream = fs.createWriteStream(`${logDir}/${this.port}_server_log.log`);

    const nodePath = process.env.SYNGRISI_TEST_SERVER_NODE_PATH || "node";
    const args = ["server.js", `syngrisi_test_server_${this.port}`];

    try {
      this.child = spawn(nodePath, args, {
        env: env,
        shell: process.platform === "win32",
        cwd: '../'
      });

      this.child.stdout!.setEncoding("utf8");
      this.child.stdout!.on("data", (data) => {
        this.logStream.write(data);
        if (process.env.DBG === "1") {
          console.log(`SERVER_${this.port}: ${data}`);
        }
      });

      this.child.stderr!.setEncoding("utf8");
      this.child.stderr!.on("data", (data) => {
        console.error(`❌ STDERR: ${data}`);
      });

      this.child.on("error", (err) => {
        console.error(`Failed to start child process: ${err.message}`);
        this.logStream.write(`Failed to start child process: ${err.message}`);
      });

      console.log(`SERVER IS STARTED, PID: '${this.child?.pid}' port: '${this.port}'`);
    } catch (err) {
      console.error(`Failed to spawn child process: ${err.message}`);
    }
  }

  async waitUntilServerIsReady() {
    const timeout = 15000; // 15 seconds
    const interval = 500; // 0.5 seconds
    const maxAttempts = timeout / interval;
    let attempts = 0;

    const context = await request.newContext();

    while (attempts < maxAttempts) {
      try {
        const response = await context.get(`http://localhost:${this.port}/v1/tasks/status`);
        if (response.ok()) {
          const jsonResp = await response.json();
          if (jsonResp.alive === true) {
            console.log(`Server is ready on port ${this.port}`);
            await context.dispose();
            return;
          }
        }
      } catch (err) {
        console.log(`Attempt ${attempts + 1}: Server is not ready yet.`);
      }

      await new Promise(resolve => setTimeout(resolve, interval));
      attempts++;
    }

    await context.dispose();
    throw new Error(`Cannot connect to server on port ${this.port}`);
  }

  async stopServer() {
    if (!this.child) return;
    return new Promise<void>((resolve, reject) => {
      this.child!.on("exit", (code, signal) => {
        console.log(`SERVER STOPPED, PID: '${this.child?.pid}', code: ${code}, signal: ${signal}`);
        resolve();
      });

      this.child!.on("error", (err) => {
        console.error(`Failed to stop child process: ${err.message}`);
        reject(err);
      });

      try {
        this.child!.kill("SIGTERM");
      } catch (err) {
        console.error(`Error while killing the child process: ${err.message}`);
        reject(err);
      }
    });
  }
}
