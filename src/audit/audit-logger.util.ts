import fs from "fs";
import path from "path";
import { promises as fsPromises } from "fs";
import { AuditLogEntry } from "./audit.interface";

class AuditLogger {
  private logFilePath: string;
  private maxFileSizeInBytes: number;
  private writeQueue: AuditLogEntry[] = [];
  private isWriting: boolean = false;
  private flushInterval: NodeJS.Timeout | null = null;
  private flushIntervalInMiliSeconds: number;

  constructor(logFilePath: string, maxSizeInMB: number = 100, flushIntervalInSeconds: number = 5) {
    this.logFilePath = logFilePath;
    this.maxFileSizeInBytes = maxSizeInMB * 1024 * 1024;
    this.flushIntervalInMiliSeconds = flushIntervalInSeconds * 1000;
    this.ensureLogDirectory();
    this.startFlushInterval();
  }

  private ensureLogDirectory(): void {
    const dir = path.dirname(this.logFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private startFlushInterval(): void {
    this.flushInterval = setInterval(() => {
      this.flushQueue();
    }, this.flushIntervalInMiliSeconds);
  }

  public stopFlushInterval(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      // Final flush before stopping
      this.flushQueue();
    }
  }

  private async checkAndRotateFile(): Promise<void> {
    try {
      const stats = await fsPromises.stat(this.logFilePath);
      if (stats.size > this.maxFileSizeInBytes) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const ext = path.extname(this.logFilePath);
        const basename = path.basename(this.logFilePath, ext);
        const dir = path.dirname(this.logFilePath);
        const rotatedPath = path.join(dir, `${basename}.${timestamp}${ext}`);

        await fsPromises.rename(this.logFilePath, rotatedPath);
      }
    } catch (error) {
      // File doesn't exist yet, which is fine
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        console.error("Error during log rotation check:", error);
      }
    }
  }

  public async logAsync(entry: AuditLogEntry): Promise<void> {
    // Add entry with timestamp if not already present
    const logEntry: AuditLogEntry = {
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString(),
    };

    this.writeQueue.push(logEntry);

    // If queue is getting large, flush immediately
    if (this.writeQueue.length >= 100) {
      await this.flushQueue();
    }
  }

  private async flushQueue(): Promise<void> {
    if (this.writeQueue.length === 0 || this.isWriting) {
      return;
    }

    this.isWriting = true;
    const entriesToWrite = [...this.writeQueue];
    this.writeQueue = []; // Clear queue immediately

    try {
      // Check and rotate file if needed
      await this.checkAndRotateFile();

      // Convert entries to JSONL (JSON Lines) format
      const content = entriesToWrite
        .map((entry) => JSON.stringify(entry))
        .join("\n") + "\n";

      // Append to file asynchronously
      await fsPromises.appendFile(this.logFilePath, content, "utf-8");
    } catch (error) {
      console.error("Error writing audit log:", error);
      // Re-queue entries if write failed
      this.writeQueue.unshift(...entriesToWrite);
    } finally {
      this.isWriting = false;
    }
  }

  public async readLogs(limit?: number): Promise<AuditLogEntry[]> {
    try {
      const content = await fsPromises.readFile(this.logFilePath, "utf-8");
      const lines = content
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => JSON.parse(line) as AuditLogEntry);

      return limit ? lines.slice(-limit) : lines;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return [];
      }
      console.error("Error reading audit logs:", error);
      return [];
    }
  }

  public async cleanupOldLogs(retentionDays: number): Promise<void> {
    try {
      const dir = path.dirname(this.logFilePath);
      const files = await fsPromises.readdir(dir);
      const now = Date.now();
      const retentionMs = retentionDays * 24 * 60 * 60 * 1000;

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = await fsPromises.stat(filePath);

        if (now - stats.mtimeMs > retentionMs) {
          await fsPromises.unlink(filePath);
          console.log(`Deleted old audit log: ${file}`);
        }
      }
    } catch (error) {
      console.error("Error cleaning up old audit logs:", error);
    }
  }
}

export default AuditLogger;