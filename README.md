# Pastebin Lite

A lightweight pastebin application that allows users to create, view, and share text snippets with optional TTL (time-to-live) and max views constraints.

## Live Demo
[Deployed App](https://pastebin-lite-7mmr.onrender.com/)

## Features
- Create a paste with optional time-based expiry and view-limit constraints.
- View paste via a unique URL.
- Frontend UI built with Bootstrap.
- API endpoints for paste creation and retrieval.

## How to Run Locally
1. Clone the repository:
   ```bash 
   git clone https://github.com/hemakshiii/Pastebin-Lite.git
   cd Pastebin-Lite
   
2. Install dependencies:
   ```bash   
   npm install
   
3. Set up .env file with:
   ``` bash   
   DATABASE_URL=your_postgresql_connection_string
   
4. Start the server:
   ```bash
   npm start

5. Open the app in your browser:
   ```bash
   http://localhost:3000

## Persistence Layer
- PostgreSQL database for storing pastes and metadata.
- `pastes` table stores: `id`, `content`, `created_at`, `expires_at`, `max_views`, `views_used`.

## Important Decision

Used UUID for paste IDs to ensure uniqueness.

Optional TTL and max_views to handle paste expiration.

Bootstrap used for lightweight and responsive UI.

Server-side HTML rendering for viewing pastes.

## API Endpoints

POST /api/pastes → Create a new paste

GET /api/pastes/:id → Get paste details (JSON)

GET /p/:id → View paste as HTML page

## TechStack
Backend: Node.js, Express.js

Frontend: HTML + Bootstrap

Database / Persistence Layer: PostgreSQL (hosted on Neon)

Unique ID generation: UUID

