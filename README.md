# GenRAD - AI-Powered Code Generation Platform

<div align="center">

![GenRAD Logo](https://img.shields.io/badge/GenRAD-AI%20Code%20Generator-red?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)

**Transform natural language into complete, production-ready applications**

[Features](#features) • [Quick Start](#quick-start) • [Deployment](#deployment) • [Documentation](#documentation)

</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Local Development Setup](#local-development-setup)
  - [Windows IIS Deployment](#windows-iis-deployment)
- [Configuration](#configuration)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

**GenRAD (Generative Rapid Application Development)** is an innovative AI-powered platform that transforms natural language descriptions into complete, runnable React Native and React web applications. Leveraging Anthropic's Claude 3.5 Sonnet API, GenRAD implements a sophisticated two-stage code generation process that produces production-ready code following modern best practices.

### Key Capabilities

- **Natural Language Input**: Describe your application in plain English
- **Two Project Types**: Generate React Native CLI or React 19 + Vite + Tailwind applications
- **Complete Projects**: Get full project structure with navigation, styling, and dependencies
- **95% Success Rate**: Proven code generation quality with proper compilation
- **Project Management**: Save unlimited projects with complete history
- **Credit System**: Transparent usage tracking with monthly resets

---

## ✨ Features

### 🤖 AI-Powered Generation
- Two-stage code generation architecture (structure → content)
- Context-aware file generation with framework-specific best practices
- Automatic dependency management and configuration
- Built-in navigation system implementation (React Navigation, React Router v7)

### 🔐 Secure Authentication
- Google OAuth 2.0 integration
- JWT-based session management
- Secure credential storage
- Automatic credit management

### 💳 Credit Management
- 5 free credits per user per month
- Automatic monthly reset on the 1st of each month
- Transaction history and audit trail
- Database-enforced atomic operations

### 📁 Project Management
- Save unlimited generated projects
- Complete project history with metadata
- One-click project loading
- Download as ZIP archives

### 🎨 Modern UI/UX
- Responsive design for all screen sizes
- Dark/Light theme support with persistence
- Real-time progress tracking during generation
- Syntax-highlighted code viewer
- File tree navigation

---

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18
- **Database**: MySQL 8.0+ with Sequelize ORM
- **Authentication**: Passport.js (Google OAuth 2.0, JWT)
- **AI Engine**: Anthropic Claude 3.5 Sonnet API

### Frontend
- **Framework**: React 19.1
- **Build Tool**: Vite 7.1
- **Styling**: Tailwind CSS v4.1
- **Routing**: React Router v7.9
- **HTTP Client**: Axios 1.13
- **OAuth**: @react-oauth/google 0.12

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Code Quality**: ESLint
- **Environment**: dotenv

---

## 📋 Prerequisites

### For Local Development

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **MySQL**: v8.0 or higher ([Download](https://dev.mysql.com/downloads/mysql/))
- **Git**: Latest version ([Download](https://git-scm.com/))

### For Windows IIS Deployment

- **Windows Server**: 2016, 2019, 2022 or 2025
- **IIS**: Version 10.0 or higher
- **URL Rewrite Module**: v2.1 ([Download](https://www.iis.net/downloads/microsoft/url-rewrite))
- **iisnode**: Latest version ([Download](https://github.com/Azure/iisnode/releases))
- **Node.js**: v18.0.0 or higher (Windows x64)
- **MySQL**: v8.0 or higher
- **SSL Certificate**: For HTTPS (recommended)

### Required Accounts

- **Google Cloud Console**: For OAuth 2.0 credentials ([Console](https://console.cloud.google.com/))
- **Anthropic API**: For Claude API access ([Console](https://console.anthropic.com/))

---

## 🚀 Installation

### Local Development Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/dhananja6557/genrad.git
cd genrad
```

#### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

#### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

#### 4. Configure Environment Variables

Create `.env` files in both backend and frontend directories:

**Backend `.env`:**
```env
# Server Configuration
PORT=2508
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gen_rad_user_management
DB_USER=root
DB_PASSWORD=

# Authentication
JWT_SECRET=super_secret_jwt_key_min_32_characters
GOOGLE_CLIENT_ID=google_client_id.apps.googleusercontent.com

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-api-key
```

**Frontend `.env`:**
```env
# API Configuration
VITE_API_URL=http://localhost:2508

# Google OAuth
VITE_GOOGLE_CLIENT_ID=google_client_id.apps.googleusercontent.com
```

#### 5. Set Up MySQL Database

```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE IF NOT EXISTS gen_rad_user_management;

# Import schema (if you have a SQL file)
mysql -u root -p gen_rad_user_management < database/schema.sql

# Or run the schema from the provided SQL in the codebase
```

**Database Schema:**
```sql
-- Run this in MySQL to create tables
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    googleId VARCHAR(255) NOT NULL UNIQUE,
    displayName VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    image VARCHAR(500),
    credits INT DEFAULT 5,
    totalCredits INT DEFAULT 5,
    creditsResetDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creditsUsedThisMonth INT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE ProjectHistory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    projectName VARCHAR(255) NOT NULL,
    projectType VARCHAR(50) NOT NULL,
    prompt TEXT NOT NULL,
    files LONGTEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    INDEX idx_userId (userId),
    INDEX idx_createdAt (createdAt)
);

CREATE TABLE CreditHistory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    creditsBefore INT NOT NULL,
    creditsAfter INT NOT NULL,
    creditsUsed INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    projectId INT,
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    INDEX idx_userId (userId)
);
```

#### 6. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Add Authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://ai.esolution.lk` (production)
7. Copy **Client ID** to `.env` files

#### 7. Get Anthropic API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create account or sign in
3. Navigate to **API Keys**
4. Generate new API key
5. Copy to backend `.env` file

#### 8. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:2508

---

## 🖥 Windows IIS Deployment

### Step 1: Server Preparation

#### 1.1 Install Prerequisites

**Install Node.js:**
```powershell
# Download and install Node.js 18+ LTS from https://nodejs.org/
# Verify installation
node --version
npm --version
```

**Install MySQL:**
```powershell
# Download MySQL 8.0+ from https://dev.mysql.com/downloads/mysql/
# Install MySQL Server and MySQL Workbench
# Configure root password during installation
```

**Enable IIS Features:**
```powershell
# Open PowerShell as Administrator
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServer
Enable-WindowsOptionalFeature -Online -FeatureName IIS-CommonHttpFeatures
Enable-WindowsOptionalFeature -Online -FeatureName IIS-HttpErrors
Enable-WindowsOptionalFeature -Online -FeatureName IIS-ApplicationDevelopment
Enable-WindowsOptionalFeature -Online -FeatureName IIS-HealthAndDiagnostics
Enable-WindowsOptionalFeature -Online -FeatureName IIS-HttpLogging
Enable-WindowsOptionalFeature -Online -FeatureName IIS-Security
Enable-WindowsOptionalFeature -Online -FeatureName IIS-RequestFiltering
Enable-WindowsOptionalFeature -Online -FeatureName IIS-StaticContent
```

**Install URL Rewrite Module:**
1. Download from: https://www.iis.net/downloads/microsoft/url-rewrite
2. Run installer: `rewrite_amd64_en-US.msi`
3. Restart IIS after installation

**Install iisnode:**
1. Download from: https://github.com/Azure/iisnode/releases
2. Install `iisnode-full-v0.2.26-x64.msi` (or latest version)
3. Restart IIS after installation

### Step 2: Deploy Backend

#### 2.1 Prepare Backend Files

```powershell
# Create deployment directory
mkdir C:\inetpub\genrad\backend
cd C:\inetpub\genrad\backend

# Copy backend files (use git clone or manual copy)
git clone https://github.com/dhananja6557/genrad.git .
# Or copy files manually

# Install dependencies
npm install --production

# Add .env with production values (see below)
```

#### 2.2 Configure Backend Environment

Edit `C:\inetpub\genrad\backend\.env`:

```env
# Production Backend Configuration
PORT=2508
NODE_ENV=production
FRONTEND_URL=https://ai.esolution.lk

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gen_rad_user_management
DB_USER=root
DB_PASSWORD=secure_password_here

# Authentication
JWT_SECRET=production_jwt_secret_min_32_chars_very_secure
GOOGLE_CLIENT_ID=production_google_client_id.apps.googleusercontent.com

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-production-api-key

# Logging
LOG_LEVEL=info
```

#### 2.3 Create web.config for Backend

Create `C:\inetpub\genrad\backend\web.config`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="server.js" verb="*" modules="iisnode" />
    </handlers>
    
    <iisnode
      nodeProcessCommandLine="&quot;C:\Program Files\nodejs\node.exe&quot;"
      debuggingEnabled="true"
      loggingEnabled="false"
      devErrorsEnabled="false"
      node_env="production"
      watchedFiles="*.js;*.json"
      maxLogFileSizeInKB="128"
      maxTotalLogFileSizeInKB="1024"
      maxLogFiles="20"
    />

    <rewrite>
      <rules>
        <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
          <match url="^server.js\/debug[\/]?" />
        </rule>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True" />
          </conditions>
          <action type="Rewrite" url="server.js" />
        </rule>
      </rules>
    </rewrite>

    <!-- Enable detailed error messages -->
    <httpErrors existingResponse="PassThrough" />
  </system.webServer>

  <!-- Add environment variables -->
  <appSettings>
    <add key="PORT" value="3327" />
    <add key="NODE_ENV" value="production" />
    <add key="ENABLE_AUTO_REFRESH" value="true" />
  </appSettings>
</configuration>
```

#### 2.4 Create IIS Site for Backend

```powershell
# Open IIS Manager (inetmgr)
# Or use PowerShell:

Import-Module WebAdministration

# Create Application Pool
New-WebAppPool -Name "GenRAD\Backend" -Force
Set-ItemProperty IIS:\AppPools\GenRAD\Backend -Name "managedRuntimeVersion" -Value ""
Set-ItemProperty IIS:\AppPools\GenRAD\Backend -Name "processModel.identityType" -Value "ApplicationPoolIdentity"

# Create Website
New-Website -Name "GenRAD\Backend" `
            -PhysicalPath "C:\inetpub\genrad\backend" `
            -ApplicationPool "GenRAD\Backend" `
            -Port 2508 `
            -Force

# Start the site
Start-Website -Name "GenRAD\Backend"
```

#### 2.5 Configure Firewall

```powershell
# Allow port 2508 through Windows Firewall
New-NetFirewallRule -DisplayName "GenRAD Backend" `
                     -Direction Inbound `
                     -LocalPort 2508 `
                     -Protocol TCP `
                     -Action Allow
```

### Step 3: Deploy Frontend

#### 3.1 Build Frontend

```powershell
# On development machine or server
cd C:\temp\genrad\frontend

# Configure production environment
copy .env

# Edit .env.production
# VITE_API_URL=https://ai.esolution.lk:2508
# VITE_GOOGLE_CLIENT_ID=production_google_client_id

# Build for production
npm run build

# Build output will be in: dist/
```

#### 3.2 Deploy to IIS

```powershell
# Create web directory
mkdir C:\inetpub\genrad\frontend

# Copy build files
xcopy C:\temp\genrad\frontend\dist\* C:\inetpub\genrad\frontend\production /E /I /Y
```

#### 3.3 Create web.config for Frontend

Create `C:\inetpub\genrad\frontend\production\web.config`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="React SPA" stopProcessing="true">
                    <match url="^(.*)$" />
                    <conditions>
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="/index.html" />
                </rule>
                <rule name="HTTP Redirect" stopProcessing="true">
                    <match url="(.*)" />
                    <conditions>
                        <add input="{HTTPS}" pattern="^OFF$" ignoreCase="false" />
                    </conditions>
                    <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" redirectType="SeeOther" />
                </rule>
            </rules>
        </rewrite>
        <defaultDocument>
            <files />
        </defaultDocument>
    </system.webServer>
</configuration>
```

#### 3.4 Create IIS Site for Frontend

```powershell
Import-Module WebAdministration

# Create Application Pool for Frontend
New-WebAppPool -Name "GenRAD\Frontend" -Force
Set-ItemProperty IIS:\AppPools\GenRAD\Frontend -Name "managedRuntimeVersion" -Value ""

# Create Website
New-Website -Name "GenRAD\Frontend" `
            -PhysicalPath "C:\inetpub\genrad\frontend" `
            -ApplicationPool "GenRAD\Frontend" `
            -Port 80 `
            -Force

# If you have SSL certificate, bind HTTPS
# New-WebBinding -Name "GenRAD\Frontend" -Protocol https -Port 443 -SslFlags 1

# Start the site
Start-Website -Name "GenRAD\Frontend"
```

### Step 4: SSL Certificate Configuration (Recommended)

#### 4.1 Obtain SSL Certificate

**Option 1: Let's Encrypt (Free)**
```powershell
# Install Win-ACME
# Download from: https://www.win-acme.com/
# Run and follow wizard to generate certificate
```

**Option 2: Commercial Certificate**
- Purchase from SSL provider
- Generate CSR in IIS
- Install certificate in IIS

#### 4.2 Bind Certificate to Sites

```powershell
# Frontend HTTPS Binding
New-WebBinding -Name "GenRAD\Frontend" `
               -Protocol https `
               -Port 443 `
               -SslFlags 1

# Select certificate in IIS Manager
# Or use PowerShell:
$cert = Get-ChildItem -Path Cert:\LocalMachine\My | Where-Object {$_.Subject -like "*esolution.lk*"}
$binding = Get-WebBinding -Name "GenRAD\Frontend" -Protocol https
$binding.AddSslCertificate($cert.Thumbprint, "my")

# Backend HTTPS Binding (if needed)
New-WebBinding -Name "GenRAD\Backend" `
               -Protocol https `
               -Port 2509 `
               -SslFlags 1
```

#### 4.3 Update CORS and Environment Variables

After SSL setup, update:

1. Backend `web.config` - Update CORS headers to use `https://`
2. Frontend `.env` - Update `VITE_API_URL` to use `https://`
3. Backend `.env` - Update `FRONTEND_URL` to use `https://`

### Step 5: Database Configuration in Production

```sql
-- Connect to MySQL
mysql -u root -p

-- Create production database
CREATE DATABASE gen_rad_user_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create dedicated database user
CREATE USER 'gen_rad_user_management'@'localhost' IDENTIFIED BY 'secure_password_here';

-- Use the database
USE gen_rad_user_management;

-- Import schema (run the CREATE TABLE statements from Step 1.5)
-- Or import from file:
-- source C:\path\to\schema.sql;
```

### Step 6: Application Pool Configuration

```powershell
# Backend App Pool Settings
Set-ItemProperty IIS:\AppPools\GenRAD\Backend -Name "processModel.idleTimeout" -Value "00:00:00"
Set-ItemProperty IIS:\AppPools\GenRAD\Backend -Name "recycling.periodicRestart.time" -Value "00:00:00"
Set-ItemProperty IIS:\AppPools\GenRAD\Backend -Name "recycling.periodicRestart.memory" -Value 0

# Frontend App Pool Settings
Set-ItemProperty IIS:\AppPools\GenRAD\Frontend -Name "processModel.idleTimeout" -Value "00:20:00"
Set-ItemProperty IIS:\AppPools\GenRAD\Frontend -Name "recycling.periodicRestart.time" -Value "1.00:00:00"
```

### Step 7: Permissions Configuration

```powershell
# Grant IIS_IUSRS read permissions to application directories
icacls "C:\inetpub\genrad\backend" /grant "IIS_IUSRS:(OI)(CI)RX" /T
icacls "C:\inetpub\genrad\frontend" /grant "IIS_IUSRS:(OI)(CI)RX" /T

# Grant write permissions for logs (backend only)
icacls "C:\inetpub\genrad\backend\logs" /grant "IIS_IUSRS:(OI)(CI)M" /T
icacls "C:\inetpub\genrad\backend\iisnode" /grant "IIS_IUSRS:(OI)(CI)M" /T
```

### Step 8: Verify Deployment

```powershell
# Test backend
curl http://localhost:2508

# Test frontend
curl http://localhost

# Check logs
# Backend logs: C:\inetpub\genrad\backend\iisnode\
# IIS logs: C:\inetpub\logs\LogFiles\
```

---

## ⚙️ Configuration

### Backend Configuration Options

**server.js settings:**
- `PORT`: Server port (default: 2508)
- `CORS origins`: Frontend URL whitelist
- Request size limits: 50mb for JSON/URL-encoded

**Database connection:**
- Pool size: Configure in db.js
- Connection timeout: 10000ms default
- Charset: utf8mb4

### Frontend Configuration Options

**Vite config (vite.config.js):**
```javascript
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:2508'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
})
```

---

## 🔒 Environment Variables

### Backend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Backend server port | Yes | `2508` |
| `NODE_ENV` | Environment | Yes | `production` |
| `FRONTEND_URL` | Frontend URL for CORS | Yes | `https://ai.esolution.lk` |
| `DB_HOST` | MySQL host | Yes | `localhost` |
| `DB_PORT` | MySQL port | Yes | `3306` |
| `DB_NAME` | Database name | Yes | `gen_rad_user_management` |
| `DB_USER` | Database username | Yes | `root` |
| `DB_PASSWORD` | Database password | Yes | `secure_password` |
| `JWT_SECRET` | JWT signing key (32+ chars) | Yes | `jwt-secret-key` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes | `xxx.apps.googleusercontent.com` |
| `ANTHROPIC_API_KEY` | Claude API key | Yes | `sk-ant-xxx` |

### Frontend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API base URL | Yes | `https://ai.esolution.lk:2508` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes | `xxx.apps.googleusercontent.com` |

---

## 🗄️ Database Setup

### Schema Overview

The application uses three main tables:

1. **Users**: User accounts and credit management
2. **ProjectHistory**: Saved generated projects
3. **CreditHistory**: Credit usage audit trail

## 🏃 Running the Application

### Development Mode

```bash
# Terminal 1 - Backend
cd backend
npm run dev  # or npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Production Mode (Local)

```bash
# Build frontend
cd frontend
npm run build

# Serve frontend build
npm install -g serve
serve -s dist -p 5173

# Run backend
cd backend
NODE_ENV=production npm start
```

### Production Mode (IIS)

The application runs automatically once IIS sites are configured and started.

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/google`
Verify Google OAuth token and issue JWT.

**Request:**
```json
{
  "token": "google_id_token_here"
}
```

**Response:**
```json
{
  "token": "jwt_token_here"
}
```

### User Endpoints

#### GET `/user/profile`
Get authenticated user profile and credit balance.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "isLoggedIn": true,
  "user": {
    "id": 1,
    "googleId": "123456789",
    "displayName": "Dilravi Dhananja",
    "email": "dilravidhananja@gmail.com",
    "image": "https://...",
    "credits": 5,
    "totalCredits": 5
  }
}
```

### Code Generation Endpoints

#### POST `/stage1-generate-structure`
Generate project file structure (Stage 1).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "prompt": "A todo list app with tabs",
  "projectType": "react-native"
}
```

**Response:**
```json
{
  "filePaths": [
    "App.jsx",
    "package.json",
    "src/screens/HomeScreen.jsx",
    "src/navigation/AppNavigator.jsx"
  ]
}
```

#### POST `/stage2-generate-content`
Generate content for a specific file (Stage 2).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "prompt": "A todo list app with tabs",
  "projectType": "react-native",
  "filePath": "App.jsx"
}
```

**Response:**
```json
{
  "filePath": "App.jsx",
  "content": "import React from 'react';\n..."
}
```

### Project Management Endpoints

#### POST `/projects/save`
Save generated project to history.

**Request:**
```json
{
  "projectName": "my-todo-app",
  "projectType": "react-native",
  "prompt": "A todo list app",
  "files": {
    "App.jsx": "...",
    "package.json": "..."
  }
}
```

#### GET `/projects/history`
Get user's project history.

**Query Parameters:**
- `limit`: Number of projects (default: 50)
- `offset`: Pagination offset (default: 0)

#### GET `/projects/:id`
Get specific project by ID.

#### DELETE `/projects/:id`
Delete project from history.

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User can sign in with Google
- [ ] User receives 5 credits on first sign-in
- [ ] React Native project generates successfully
- [ ] React + Vite project generates successfully
- [ ] Generated code is downloadable as ZIP
- [ ] Projects can be saved to history
- [ ] Projects can be loaded from history
- [ ] Credits deduct correctly (1 per generation)
- [ ] Credits reset on 1st of month
- [ ] Dark/Light theme persists
- [ ] Real-time progress displays during generation
- [ ] Error messages display appropriately

### Load Testing

Use tools like Apache JMeter or Artillery to test:
- Concurrent user logins
- Simultaneous code generations
- Database query performance
- API response times

---

## 🐛 Troubleshooting

### Common Issues

#### Issue: "Port 2508 already in use"

**Solution:**
```bash
# Find process using port
netstat -ano | findstr :2508

# Kill process (replace PID)
taskkill /PID <process_id> /F
```

#### Issue: "Cannot connect to MySQL"

**Solutions:**
1. Verify MySQL service is running:
   ```powershell
   Get-Service MySQL80  # or your MySQL service name
   Start-Service MySQL80
   ```

2. Check credentials in `.env`
3. Verify MySQL user has correct permissions
4. Check firewall allows MySQL port 3306

#### Issue: "ANTHROPIC_API_KEY is missing"

**Solution:**
1. Verify `.env` file exists in backend directory
2. Ensure `ANTHROPIC_API_KEY` is set correctly
3. Restart backend after updating `.env`

#### Issue: Google OAuth fails

**Solutions:**
1. Verify `GOOGLE_CLIENT_ID` matches in frontend and backend
2. Check authorized origins and redirect URIs in Google Console
3. Ensure domain is using HTTPS in production
4. Clear browser cookies and try again

#### Issue: "iisnode was unable to start the node.exe process"

**Solutions:**
1. Verify Node.js path in `web.config`:
   ```xml
   <iisnode nodeProcessCommandLine="C:\Program Files\nodejs\node.exe" />
   ```

2. Check permissions on application directory
3. Review iisnode logs: `C:\inetpub\genrad\backend\iisnode\`
4. Ensure `server.js` exists in root directory

#### Issue: Frontend shows blank page

**Solutions:**
1. Check browser console for errors
2. Verify `VITE_API_URL` is correct in `.env.production`
3. Ensure `web.config` URL rewrite rules are present
4. Clear browser cache
5. Check IIS logs for 404 errors

### Logging

**Backend Logs:**
- Application logs: `C:\inetpub\genrad\backend\logs\`
- iisnode logs: `C:\inetpub\genrad\backend\iisnode\`
- IIS logs: `C:\inetpub\logs\LogFiles\`

**Enable Detailed Errors:**

Edit `web.config`:
```xml
<httpErrors errorMode="Detailed" />
```

**View Real-time Logs:**
```powershell
Get-Content C:\inetpub\genrad\backend\iisnode\*.log -Wait
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit changes**: `git commit -m 'Add some AmazingFeature'`
4. **Push to branch**: `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 👥 Support

### Getting Help

- **Documentation**: Read this README thoroughly
- **Issues**: [GitHub Issues](https://github.com/dhananja6557/genrad/issues)
- **Discussions**: [GitHub Discussions](https://github.com/dhananja6557/genrad/discussions)
- **Email**: support@esolution.lk

### Reporting Bugs

When reporting bugs, please include:
1. Operating system and version
2. Node.js version
3. Complete error messages
4. Steps to reproduce
5. Expected vs actual behavior

---

## 🙏 Acknowledgements

- **Anthropic** - For providing Claude 3.5 Sonnet API
- **React Team** - For React framework
- **Vite Team** - For blazing fast build tool
- **Express.js** - For robust backend framework
- **Google** - For OAuth 2.0 authentication
- **Open Source Community** - For countless amazing libraries

---

## 📈 Roadmap

### Version 1.1 (Q1 2025)
- [ ] Add Vue.js and Angular project support
- [ ] Implement automatic test generation
- [ ] Add backend API generation capability
- [ ] Introduce collaborative features

### Version 2.0 (Q2 2025)
- [ ] Integrate deployment automation
- [ ] Add CI/CD pipeline generation
- [ ] Implement code refinement interface
- [ ] Add support for TypeScript configuration

---

## 📞 Contact

**Project Developer**: AKSD Dhananja  
**Student ID**: S23014525  
**Institution**: Wrexham University  
**Email**: info@esolution.lk  
**GitHub**: [@dhananja6557](https://github.com/dhananja6557)

---

<div align="center">

**Made with ❤️ for the developer community**

⭐ Star this repo if you find it helpful!

[Report Bug](https://github.com/dhananja6557/genrad/issues) • [Request Feature](https://github.com/dhananja6557/genrad/issues) • [Documentation](https://github.com/dhananja6557/genrad/wiki)

</div>
