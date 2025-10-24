# Scaler Updates

Scaler Update is a MERN-stack sample application to connect users for updating . Users can register, login, create profiles, search and filter profiles by various fields, and send connection requests.

Features:
- User authentication (JWT)
- Profile management with avatar upload
- Search & filter profiles (name, age, gender, class/section flexible)
- Connection request workflow
- Simple React frontend with protected routes

Prerequisites:
- Node.js 18+ and npm
- MongoDB instance (Atlas or local). For Atlas, use the provided DB URL template.
- VS Code (recommended)

Repository layout:
- server/ - Express backend
- client/ - React frontend
- docker-compose.yml - local compose for Mongo, server, client

Quick Setup (create folders server and client as provided):
1. In VS Code open project folder.
2. Create environment file:
   - Copy `server/env.example` to `server/.env`
   - Replace `<db_password>` with your DB password:
     DB_URL=mongodb+srv://challa24bcs10276_db_user:YOUR_DB_PASSWORD@cluster0.gwmj5tx.mongodb.net/scaler-matrimony?retryWrites=true&w=majority&appName=Cluster0
   - Set JWT_SECRET to a long random string.
3. Install dependencies:
   - Terminal 1: cd server && npm install
   - Terminal 2: cd client && npm install
4. Start development servers:
   - Option A (single command): from project root run: npm run dev
   - Option B (separate):
     - Terminal 1: cd server && npm run dev
     - Terminal 2: cd client && npm start

The React app will run at http://localhost:3000 and API at http://localhost:5000.

Running seed script (optional):
- cd server && node scripts/seed.js

Testing:
- Backend tests: cd server && npm test
- Frontend tests: cd client && npm test

Docker:
- Build images and run with docker-compose:
  docker-compose up --build

Environment Variables:
- server/.env:
  - DB_URL (required)
  - JWT_SECRET (required)
  - PORT (defaults to 5000)
  - CLOUDINARY_URL (optional)
  - CLIENT_URL (optional)

How to run in VS Code:
1. Open folder in VS Code.
2. Open integrated terminal (Ctrl+`).
3. Follow steps above to create server/.env and install packages.
4. Run npm run dev from root or run server and client in separate terminals.

Troubleshooting:
- "Missing required env variables" -> ensure server/.env exists and DB_URL/JWT_SECRET are set.
- Mongo connection errors -> verify network access for Atlas and replace <db_password>.
- Tests failing due to DB -> ensure test DB is reachable (use a separate test DB).

Project structure explanation:
- server/
  - index.js - main express entry
  - config/ - env and DB config
  - controllers/ - business logic
  - models/ - Mongoose schemas
  - routes/ - express routers
  - middleware/ - auth, upload, error handler
  - services/ - cloudinary helper
  - tests/ - jest + supertest tests
- client/
  - public/, src/ - React app, pages, components, services, context

Security:
- Do not commit server/.env. Use secret managers for production.
- Prefer storing refresh tokens in httpOnly cookies.


## project preview
![Project Preview](assets/preview.png)


