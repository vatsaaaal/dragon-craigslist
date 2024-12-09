# Project Setup Instructions

Follow the steps below to set up and run the project on your local machine.

## 1. Clone the Repository

```bash
# Replace `<repository-url>` with the actual GitHub repository URL
git clone https://github.com/vatsaaaal/dragon-craigslist.git
cd dragon-craigslist
```

## 2. Install PostgreSQL

Ensure you have PostgreSQL installed on your machine. If not, follow these steps:

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### macOS (Homebrew)
```bash
brew install postgresql
brew services start postgresql
```

### Windows
1. Download PostgreSQL from [https://www.postgresql.org/download/](https://www.postgresql.org/download/).
2. Follow the installer instructions to set up PostgreSQL.

## 3. Create Environment Files

### `.env.example` File
This file provides a template for your environment configuration:

```json
{
    "PG_USER": "your_database_user",
    "PG_HOST": "localhost",
    "PG_DATABASE": "dragon_db",
    "PG_PASSWORD": "your_database_password",
    "PG_PORT": 5432,
    "JWT_SECRET": "your_jwt_secret_key",
    "FRONTEND_URL": "http://localhost:5173"
}
```

### Example `env.json` File
Create a file named `env.json` in the root directory based on the example below:

```json
{
  "PG_USER": "postgres",
  "PG_HOST": "localhost",
  "PG_DATABASE": "dragon_db",
  "PG_PASSWORD": "Longingia@12",
  "PG_PORT": 5432,
  "JWT_SECRET": "u+OnGjhDu4GmMFcPJJSDmjq448tCvTVUMt8AYT9JDM8=",
  "FRONTEND_URL": "http://localhost:5173"
}
```

### Generate a JWT Secret
Use the following command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Add the generated key to the `JWT_SECRET` field in your `env.json` file.

### `.env.local` File
Create a file named `.env.local` in the root directory with the following content:

```
VITE_API_URL=http://localhost:3000
```

## 4. Install Dependencies

Run the following command to install the required Node.js modules:

```bash
npm install
```

## 5. Set Up the Database

Run the following command to create the required database and tables in PostgreSQL:

```bash
npm run setup
```

## 6. Run the Project

Use two separate terminals to start the backend and frontend servers:

### Terminal 1: Start the Backend Server
```bash
npm run start
```

### Terminal 2: Start the Frontend Development Server
```bash
npm run dev
```

## 7. Access the Application

- **Backend API**: `http://localhost:3000`
- **Frontend**: `http://localhost:5173`

### Notes
- Ensure PostgreSQL is running before executing the `npm run setup` command.
- If you encounter any issues, ensure your environment variables are correctly set in the `env.json` and `.env.local` files.