import { Request } from "express";
import IAudit from "./audit.interface";
import auditRepo from "./audit.repo";
import APIConfig from "../utils/config";
import AuditLogger from "./audit-logger.util";

class AuditService {
  private auditLogger: AuditLogger;

  constructor() {
    this.auditLogger = new AuditLogger(
      APIConfig.config.auditSettings.logFilePath,
      APIConfig.config.auditSettings.logFileMaxSizeInMB
    );
  }

  public logRequest(req: Request) {
    if (process.env.TEST_ENV === "0" && APIConfig.config.auditSettings.enabled) {
      const inputData: IAudit = {
        reqPayload: req.body,
        reqType: req.method,
        reqUrl: req.originalUrl,
        serviceName: APIConfig.config.serviceName,
      };

      // Fire-and-forget: Log to file asynchronously (non-blocking)
      this.logAsync(inputData);
    }
  }

  private async logAsync(inputData: IAudit): Promise<void> {
    const settings = APIConfig.config.auditSettings;

    // Log to file if enabled (primary, always fast)
    if (settings.logToFile) {
      try {
        await this.auditLogger.logAsync({
          timestamp: new Date().toISOString(),
          serviceName: inputData.serviceName,
          reqUrl: inputData.reqUrl,
          reqType: inputData.reqType,
          reqPayload: inputData.reqPayload,
          message: inputData.message,
          createdBy: inputData.createdBy,
        });
      } catch (err) {
        console.error("Failed to log to file:", (err as Error).message);
      }
    }

    // Log to database in background (non-blocking, set and forget)
    if (settings.logToDatabase) {
      setImmediate(() => {
        try {
          auditRepo.create(inputData).catch((err) => {
            console.error("Failed to log to database:", (err as Error).message);
          });
        } catch (err) {
          console.error("Error queuing database audit log:", (err as Error).message);
        }
      });
    }
  }

  public async getAuditLogs(limit?: number): Promise<any[]> {
    return this.auditLogger.readLogs(limit);
  }

  public async cleanupOldLogs(): Promise<void> {
    const retentionDays = APIConfig.config.auditSettings.logFileRetentionDays;
    await this.auditLogger.cleanupOldLogs(retentionDays);
  }

  public stopLogger(): void {
    this.auditLogger.stopFlushInterval();
  }
}

export default new AuditService();
