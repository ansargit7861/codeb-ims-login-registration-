# Code-B MIS & Invoicing System — Login & Registration Module

This repository contains the **Login and Registration module** for the Code-B
MIS and Invoicing System, built as part of the integrated internship.

The system has two roles:
- **Admin** — full access, including user management.
- **Sales person (non-admin)** — restricted access to sales/invoicing features.

## Repository structure

```
├── backend/     Spring Boot REST API (Java 17 + MySQL)
├── frontend/    React application (Vite)
└── database/    SQL schema for manual setup
```

## Features implemented

- User registration (full name, email, password, role) with email verification
- Secure login (email + password), passwords hashed with BCrypt
- JWT-based authentication, redirect to Dashboard on success
- Forgot password / reset password via emailed link (expires in 30 minutes)
- Session management — auto logout after 30 minutes of inactivity
- Role-based access control (Admin vs Sales) enforced on the backend
- Logout functionality

## Tech stack

| Layer     | Technology                          |
|-----------|--------------------------------------|
| Backend   | Spring Boot 3, Spring Security, JPA |
| Database  | PostgreSQL                           |
| Frontend  | React (Vite), React Router, Axios   |
| Auth      | JWT (stateless)                     |

---

## 1. Backend setup

**Requirements:** Java 17+, Maven, PostgreSQL running locally.

1. Create the database:
   ```bash
   createdb codeb_ims
   # or inside psql: CREATE DATABASE codeb_ims;
   ```
   Optionally load the table manually:
   ```bash
   psql -U postgres -d codeb_ims -f database/schema.sql
   ```
2. Open `backend/src/main/resources/application.properties` and update:
   - `spring.datasource.username` / `spring.datasource.password` — your MySQL credentials
   - `spring.mail.username` / `spring.mail.password` — an SMTP account (e.g. a Gmail address with an
     [App Password](https://myaccount.google.com/apppasswords)) used to send verification and
     password-reset emails
   - `app.jwt.secret` — replace with your own long random string (never commit real secrets)
3. Run the backend (requires Maven installed, or generate the wrapper with `mvn -N wrapper:wrapper`):
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   The API starts on `http://localhost:8080`.

### API endpoints

| Method | Endpoint                      | Access        | Description                       |
|--------|--------------------------------|---------------|-----------------------------------|
| POST   | `/api/auth/register`          | Public        | Create a new account              |
| GET    | `/api/auth/verify-email`      | Public        | Verify email via token             |
| POST   | `/api/auth/login`             | Public        | Log in, returns JWT               |
| POST   | `/api/auth/forgot-password`   | Public        | Request a password reset email    |
| POST   | `/api/auth/reset-password`    | Public        | Set a new password using token    |
| POST   | `/api/auth/logout`            | Authenticated | Logout (client discards token)    |
| GET    | `/api/sales/dashboard`        | Admin + Sales | Sample protected route            |
| GET    | `/api/admin/users`            | Admin only    | Sample admin-only route           |

---

## 2. Frontend setup

**Requirements:** Node.js 18+

```bash
cd frontend
npm install
cp .env.example .env      # adjust VITE_API_BASE_URL if needed
npm run dev
```

The app starts on `http://localhost:5173`.

### Pages

| Route              | Purpose                          |
|---------------------|-----------------------------------|
| `/register`         | Create account (choose role)     |
| `/login`             | Log in                           |
| `/forgot-password`  | Request reset link               |
| `/reset-password`   | Set new password (from email link)|
| `/verify-email`      | Confirms email (from email link) |
| `/dashboard`         | Role-aware dashboard (protected) |

---

## 3. End-user guide

**Registering an account**
1. Go to the app and click **Create an account**.
2. Fill in your name, email, password, and select your role.
3. Check your inbox for a verification email and click the link.

**Logging in**
1. Go to `/login`, enter your email and password.
2. On success you're redirected to the Dashboard.

**Forgot your password?**
1. Click **Forgot password?** on the login page.
2. Enter your email — a reset link is sent (valid for 30 minutes).
3. Open the link, set a new password, and log in.

**Session & logout**
- If you're inactive for 30 minutes, you're automatically logged out and returned to the login page.
- Click **Log out** in the dashboard top bar to end your session at any time.

**Roles**
- **Admin** sees an extra "Users" item in the sidebar.
- **Sales** sees the standard sales/invoicing navigation.

---

## Deployment notes

- Backend: deploy the Spring Boot jar (`mvn clean package`) to any Java-supporting host (e.g. Render, Railway) with a managed MySQL instance.
- Frontend: `npm run build` produces a static `dist/` folder deployable to any static host (e.g. Netlify, Vercel).
- Update `app.frontend-url` (backend) and `VITE_API_BASE_URL` (frontend) to point at each other's live URLs.
