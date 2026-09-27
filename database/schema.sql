-- Code-B MIS & Invoicing System
-- Module: Login & Registration
-- Database: PostgreSQL

-- Run this after creating the database, e.g.:
--   createdb codeb_ims
--   psql -U postgres -d codeb_ims -f schema.sql

CREATE TABLE IF NOT EXISTS users (
    user_id             SERIAL PRIMARY KEY,
    full_name           VARCHAR(100) NOT NULL,
    email               VARCHAR(100) NOT NULL UNIQUE,
    password_hash       VARCHAR(255) NOT NULL,
    role                VARCHAR(255) NOT NULL,                         -- ADMIN or SALES
    status              VARCHAR(20) NOT NULL DEFAULT 'inactive'
                        CHECK (status IN ('active', 'inactive')),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verification_token  VARCHAR(255),
    reset_token          VARCHAR(255),
    reset_token_expiry   TIMESTAMP
);

-- Note: Spring Boot's spring.jpa.hibernate.ddl-auto=update will also
-- create/update this table automatically on application startup.
-- This file is provided for manual setup / documentation purposes.
