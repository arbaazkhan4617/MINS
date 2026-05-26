# MINS Corporate Website

Modern light-theme corporate website and API skeleton for MINS.

## Structure

- `frontend/` - Next.js 15 App Router, TypeScript, Tailwind CSS, Framer Motion
- `backend/` - Spring Boot API skeleton with JWT auth, media, projects, and contact endpoints

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Public pages:

- Home
- About
- Work
- Media
- Contact

Admin pages:

- `/admin/login`
- `/admin`
- `/admin/media`
- `/admin/projects`
- `/admin/content`
- `/admin/queries`

## Backend

```bash
cd backend
mvn spring-boot:run
```

Default admin credentials for local development:

- Email: `admin@mins.example`
- Password: `admin123`

Replace the JWT secret and authentication provider before production use.
# MINS Company Website

Full-stack responsive MINS Company website with a Next.js frontend and a Spring Boot backend for photo/video uploads.

## Structure

- `frontend` - Next.js public website and admin upload portal
- `backend` - Spring Boot REST API for media upload, listing, deletion, and file serving

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

## Run Backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`.

Uploaded media files and metadata are stored in `backend/uploads`.

## Environment

Create `frontend/.env.local` if the backend URL changes:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

For production, replace placeholder phone/email values if needed and add real authentication to the admin portal before publishing it publicly.
