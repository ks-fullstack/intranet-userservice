# intranet-userservice

This project is a Node.js based intranet user service that provides functionalities for user management, role management, and authentication. It utilizes Express.js for the server framework, MongoDB for the database, and includes automated tests using Mocha and Chai.

## Features
- User registration, verification and authentication
- Role-based access control
- One-time password (OTP) generation, sending and verification (send/verify endpoints)
- RESTful API endpoints
- Automated testing with Mocha and Chai
- Environment-specific configurations
- Swagger API documentation

## Setup
1. Clone the repository.
2. Install dependencies using `npm install`.
3. Create a `.env` file based on the provided `sample.env`.
4. Run the application using `npm run dev`.

## Environment Variables

The application uses environment variables to configure runtime behavior. Environment files are located in the `env/` directory:

- **env/sample.env**: Sample environment variables template
- **env/dev.env**: Development environment variables
- **env/uat.env**: UAT environment variables
- **env/prod.env**: Production environment variables

Create a `.env` file in the project root and populate it with the appropriate values from the relevant environment file based on your deployment environment.

### Common Environment Variables
- `NODE_ENV`: Environment mode (development, uat, or production)
- `PORT`: Server port
- `DOMAIN`: Domain name or hostname (default: localhost)
- `PROTOCOL`: Protocol to use (http or https)
- `HASH_ROUNDS`: Number of rounds for password hashing (bcrypt)
- `JWT_SECRET_KEY`: Secret key for JWT token generation and validation
- `DB_USERNAME`: Database username for MongoDB authentication
- `DB_PASSWORD`: Database password for MongoDB authentication
- `FRONTEND_URL`: URL of the frontend application
- `TEST_USERNAME`: Username for test user
- `TEST_PASSWORD`: Password for test user

## Configuration

Application configuration files are located in the `config/` directory:

- **config/dev.config.json**: Development configuration
- **config/uat.config.json**: UAT configuration
- **config/prod.config.json**: Production configuration

Each configuration file contains environment-specific settings that control application behavior, API endpoints, database connections, and other critical parameters. The appropriate configuration is loaded based on the `NODE_ENV` variable.

## Testing
To run the tests, use the command `npm run test`. This will execute all test cases defined in the `specs` directory.

### Testing & OTP service info

When running tests you may use the `env/test.env` file. The test runner sets `TEST_ENV` to indicate a test execution. While running tests the suite will print a short informational line about the OTP service when `TEST_ENV` is set.

- `TEST_ENV`: Set to `1` in `env/test.env` to disable audit log.

## Coverage Info

Code coverage information helps ensure the reliability and quality of the application by measuring how much of the codebase is tested. To generate a coverage report, run:

```bash
npm run coverage
```

This command will generate a detailed coverage report that shows the percentage of lines, branches, functions, and statements covered by tests. The coverage report is typically generated in an `coverage` directory and can be viewed in your browser.

### Coverage Targets
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

## Building the Application

To build the application, use the following command:

```bash
npm run build
```

This command compiles the TypeScript files into JavaScript, preparing the application for production deployment.

## Running the Application
To start the application, use the command:

```bash
npm start
```
This will launch the server and make the API endpoints available for use.

## API Documentation
API documentation is available via Swagger UI. Once the application is running, you can access the documentation at:

```
http://<DOMAIN>:<PORT>/api-docs
```

## Project Structure
The project is organized into the following directories:
- `config/`: Configuration files for different environments
- `env/`: Environment variable files
- `src/`: Source code directory
  - `audit/`: Audit logging functionalities
  - `constants/`: Application-wide constants
  - `controllers/`: Request handlers for various endpoints
  - `db/`: Database connection and models
  - `docs/`: API documentation files
  - `interceptors/`: Request and error interceptors
  - `middleware/`: Custom middleware functions
  - `models/`: Data models and schemas
  - `routers/`: Route definitions
  - `services/`: Business logic and services
  - `specs/`: Test cases and test suites
  - `utils/`: Utility functions and configurations
