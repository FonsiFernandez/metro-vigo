# Metro Vigo 🚇
**Fictional Metro System · React + Java API · Full-Stack Monorepo**

Metro Vigo is a **fictional full-stack project** that simulates a modern metro network.  
It is designed as a **learning-oriented, production-style setup** using a React frontend and a Java (Spring Boot) backend, all running together in a single repository.

---

## Tech Stack

### Frontend
- **React + TypeScript**
- **Vite** (fast dev server & build tool)
- Plain CSS (prepared for Tailwind / shadcn UI)

Runs on: **http://localhost:5173**

---

### Backend
- **Java 17 / 21**
- **Spring Boot 3**
- Spring Web (REST API)
- Spring Data JPA
- PostgreSQL driver
- Hibernate ORM

Runs on: **http://localhost:8080**

---

### Database
- **PostgreSQL 16**
- Managed via **Docker Compose**

Runs on: **localhost:5432**

---

### Tooling & Dev Experience
- **Monorepo** (frontend + backend in one repo)
- **Docker Compose** (database)
- **Gradle Wrapper** (no local Gradle install needed)
- **concurrently** (run everything with one command)
- Cross-platform (Windows / macOS / Linux)

---

## Project Structure

```text
metro-vigo/
│
├── backend/              # Spring Boot API
│   ├── src/main/java/
│   ├── src/main/resources/
│   └── gradlew(.bat)
│
├── frontend/             # React + Vite app
│   ├── src/
│   └── vite.config.ts
│
├── docker-compose.yml    # PostgreSQL container
├── package.json          # Root scripts (dev orchestration)
└── README.md
```
---

## What the Project Does

### Functional Overview
- Exposes a REST API for **metro lines**
- Seeds the database with **fictional metro data**
- Frontend fetches data from the API and displays:
   - Metro lines
   - Line colors
   - Operational status (OK / DELAYED)

This project is intentionally **fictional**, but architected as if it were real.

---

## API Endpoints

### Get all metro lines
GET http://localhost:8080/api/lines

Example response:
```json
[
  {
    "id": 1,
    "code": "M1",
    "name": "Centro ↔ Coia",
    "colorHex": "#00AEEF",
    "status": "OK"
  }
]
```

### How to Run (One Command)
Requirements
* Node.js 18+
* Java 17 or 21
* Docker Desktop
* npm

Start everything
From the root folder:
``` text
npm run dev
```
That’s it 🚀

### What Happens Behind the Scenes
When you run:

``` text
npm run dev
```
The following processes start in parallel:

### 1️⃣ Database
``` text
docker compose up
Starts PostgreSQL 16
```

Creates a persistent Docker volume

Exposes port 5432

### 2️⃣ Backend (Java API)
``` text
cd backend && gradlew.bat bootRun
```
Starts Spring Boot on port 8080

Connects to PostgreSQL

Auto-creates tables via JPA

Seeds initial metro lines (M1, M2, M3)

Exposes REST endpoints under /api

### 3️⃣ Frontend (React)
``` text
cd frontend && npm run dev
```
Starts Vite dev server on port 5173

Fetches data from the backend API

Displays metro lines in the browser

Orchestration
All processes are managed by concurrently, which means:

Logs are color-coded

If one process stops, all stop

Ctrl + C shuts everything down cleanly

Development Notes
CORS is configured in Spring Boot for http://localhost:5173

JPA schema is auto-updated in development

Gradle Wrapper ensures consistent builds across machines

No global Gradle installation required

Useful Commands
``` text
npm run dev           # Start everything
docker compose down   # Stop database
```