# Project Overview

**Generated:** 2025-12-05  
**Project Type:** Multi-part Application (Monorepo)  
**Architecture:** Client-Server Architecture

## Executive Summary

This is a **Task Management Application** with user authentication, built as a full-stack JavaScript/TypeScript application using modern web technologies. The project follows a client-server architecture with separate frontend and backend codebases.

## Repository Structure

- **Repository Type:** Multi-part (Monorepo)
- **Parts:** 2 (Backend API + Frontend SPA)
- **Package Manager:** pnpm

## Technology Stack Summary

### Backend (Express REST API)
| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Runtime | Node.js | Latest (ESM) | JavaScript server runtime |
| Framework | Express | 5.1.0 | Web application framework |
| Database | MySQL | - | Primary data store |
| ORM | Drizzle ORM | 0.44.7 | Type-safe database queries |
| Auth | better-auth | 1.3.34 | Authentication & session management |
| Language | JavaScript | ES Modules | Primary language |

### Frontend (Vue 3 SPA)
| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Framework | Vue 3 | 3.5.24 | Progressive JavaScript framework |
| Build Tool | Vite (Rolldown) | 7.2.2 | Lightning-fast build tool |
| Language | TypeScript | 5.9.3 | Type-safe development |
| Routing | Vue Router | 4.6.3 | Client-side routing |
| State Management | Pinia | 3.0.4 | Centralized state store |
| Styling | TailwindCSS | 4.1.17 | Utility-first CSS framework |
| UI Components | Flowbite Vue | 0.2.2 | Ready-made UI components |
| Forms | vee-validate | 4.15.1 | Form validation |
| HTTP Client | axios | 1.13.2 | API communication |
| Auth | better-auth | 1.4.4 | Client-side auth integration |

## Architecture Classification

- **Backend Pattern:** RESTful API with MVC-like structure
- **Frontend Pattern:** Component-based SPA with centralized routing
- **Integration:** REST API calls from frontend to backend
- **Authentication:** Session-based with better-auth library

## Quick Links

- [Architecture Documentation](./architecture-backend.md) - Backend
- [Architecture Documentation](./architecture-frontend.md) - Frontend  
- [Source Tree Analysis](./source-tree-analysis.md)
- [Data Models](./data-models.md)
- [Development Guide](./development-guide.md)
- [Integration Architecture](./integration-architecture.md)

## Getting Started

### Prerequisites
- Node.js (latest LTS)
- pnpm 10.22.0+
- MySQL database

### Quick Start

1. **Backend:**
   ```bash
   cd backend
   pnpm install
   cp .env.example .env  # Configure database
   pnpm dev
   ```

2. **Frontend:**
   ```bash
   cd frontend
   pnpm install
   pnpm dev
   ```

## Project Purpose

Task management and tracking system with user authentication, designed to handle tasks with different statuses, priorities, and assignments.

## Key Features
- User authentication (sign up, sign in, session management)
- Task creation and management
- Task status tracking (todo, in_progress, done, blocked)
- Task priority levels (low, medium, high)
- User assignment capability
