import "dotenv/config";
import ExpressApp from "./express-app";
import auditService from "./audit/audit.service";

const port = process.env.PORT || 5000;

ExpressApp.connectApp();

const server = ExpressApp.app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
  console.log(`URL: ${process.env.PROTOCOL}://${process.env.DOMAIN}:${port}`);
});

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception occured! Shutting down...', err);
  gracefulShutdown();
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection occured! Shutting down...', err);
  gracefulShutdown();
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  gracefulShutdown();
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  gracefulShutdown();
});

function gracefulShutdown() {
  // Stop accepting new requests
  server.close(() => {
    console.log('HTTP server closed');

    // Cleanup audit logger
    auditService.stopLogger();
    console.log('Audit logger stopped');

    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}
