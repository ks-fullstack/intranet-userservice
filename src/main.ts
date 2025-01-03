import "dotenv/config";
import ExpressApp from "./utils/express-app";

const port = process.env.PORT || 5000;

ExpressApp.connectApp();

ExpressApp.app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception occured! Shutting down...', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection occured! Shutting down...', err);
  process.exit(1);
});
