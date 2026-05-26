# MINS Project Handoff Documentation

This document is for a developer who needs to understand, run, maintain, and extend the MINS corporate website.

## 1. Project Overview

MINS is a full-stack corporate website with a public marketing site and an admin panel.

The public website includes:
- Home
- About
- Work
- Media
- Contact

The admin panel includes:
- Dashboard
- Media management
- Project management
- Client/testimonial management
- Homepage content management
- Site settings management
- Submitted enquiry management

The current stack is:
- Frontend: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Framer Motion
- Backend: Spring Boot 3.4.5, Java 17, Spring Security, JWT, Spring Data JPA
- Database: MySQL
- File uploads: local backend folder, served through `/uploads/**`
- Deployment: frontend on Vercel, backend currently exposed from local machine through HTTPS localtunnel

## 2. Top-Level Structure

```text
PalashSir/
  backend/
    pom.xml
    mysql-setup.sql
    uploads/
    src/main/java/com/mins/
    src/main/resources/application.yml

  frontend/
    app/
    components/
    lib/
    public/
    package.json
    next.config.ts
    tailwind.config.ts
```

## 3. Frontend Structure

The frontend is inside `frontend/`.

Important folders:

- `frontend/app/`
  Next.js App Router pages.

- `frontend/components/layout/`
  Shared public layout components like navbar and footer.

- `frontend/components/sections/`
  Public website sections such as hero, media gallery, testimonials, contact form, stats, CTA, etc.

- `frontend/components/admin/`
  Admin dashboard components and managers.

- `frontend/lib/`
  Frontend API/store helpers used to call the backend.

Important frontend pages:

- `frontend/app/page.tsx`
  Home page.

- `frontend/app/about/page.tsx`
  About page.

- `frontend/app/work/page.tsx`
  Work/projects page.

- `frontend/app/media/page.tsx`
  Public media gallery page.

- `frontend/app/contact/page.tsx`
  Contact page and enquiry form.

- `frontend/app/admin/page.tsx`
  Admin dashboard.

- `frontend/app/admin/login/page.tsx`
  Admin login.

- `frontend/app/admin/media/page.tsx`
  Admin media management.

- `frontend/app/admin/projects/page.tsx`
  Admin project management.

- `frontend/app/admin/clients/page.tsx`
  Admin client/testimonial management.

- `frontend/app/admin/content/page.tsx`
  Admin homepage content management.

- `frontend/app/admin/settings/page.tsx`
  Admin site settings.

- `frontend/app/admin/queries/page.tsx`
  Admin submitted enquiries.

Important frontend API helpers:

- `frontend/lib/api.ts`
  Defines `API_BASE_URL`, tunnel headers, and URL resolving.

- `frontend/lib/media-store.ts`
  Media, media category, and media subcategory API calls.

- `frontend/lib/project-store.ts`
  Project API calls.

- `frontend/lib/homepage-store.ts`
  Homepage content API calls.

- `frontend/lib/client-store.ts`
  Client/testimonial API calls.

- `frontend/lib/site-settings-store.ts`
  Site settings API calls.

- `frontend/lib/contact-query-store.ts`
  Admin enquiry API calls.

## 4. Backend Structure

The backend is inside `backend/`.

Important backend packages:

- `com.mins.auth`
  Admin login and JWT token generation.

- `com.mins.config`
  Security, JWT filter, CORS, and upload static resource config.

- `com.mins.media`
  Media items, categories, subcategories, uploads, and media APIs.

- `com.mins.project`
  Project CRUD APIs.

- `com.mins.client`
  Client/testimonial CRUD APIs and photo upload.

- `com.mins.homepage`
  Homepage hero, stats, CTA, and hero media APIs.

- `com.mins.settings`
  Company name, logo, contact details, social links, map URL, About page content.

- `com.mins.contact`
  Public contact enquiry submission and admin enquiry management.

- `com.mins.common`
  Shared upload storage service and shared response classes.

Important backend config files:

- `backend/src/main/resources/application.yml`
  Port, MySQL connection, admin credential config, upload folder, JWT config.

- `backend/mysql-setup.sql`
  Creates MySQL database/user for local setup.

- `backend/pom.xml`
  Java dependencies and build config.

## 5. Database Design

The application uses MySQL and JPA with `spring.jpa.hibernate.ddl-auto=update`.

Important persisted models:

- Admin users
- Projects
- Media items
- Media categories
- Media subcategories
- Contact enquiries
- Homepage content
- Client profiles
- Site settings

Media is now normalized with mappings:

```text
MediaCategory
  id
  name
  active

MediaSubCategory
  id
  category_id -> MediaCategory.id
  name
  active

MediaItem
  id
  title
  sub_category_id -> MediaSubCategory.id
  type
  url
  uploadedAt
```

Some old text fields are still present for migration/backfill compatibility. New reads and writes should use the entity relationships.

Examples:

- Category: `Operations`
- Subcategory: `Dispatch Coordination`
- Media items: multiple images/videos can be uploaded under `Dispatch Coordination`

## 6. Backend API Overview

Public APIs:

- `POST /api/auth/login`
  Admin login.

- `GET /api/projects`
  Public project listing.

- `GET /api/media`
  Public media listing.

- `GET /api/media/categories`
  Public media category listing.

- `GET /api/media/subcategories`
  Public media subcategory listing.

- `GET /api/homepage-content`
  Public homepage dynamic content.

- `GET /api/clients`
  Public client/testimonial listing.

- `GET /api/site-settings`
  Public company/contact/about/footer settings.

- `POST /api/contact`
  Public enquiry submission.

Admin-protected APIs:

- `POST /api/media`
  Upload media file.

- `POST /api/media/url`
  Save media by URL.

- `PUT /api/media/{id}`
  Update media title/category/subcategory.

- `DELETE /api/media/{id}`
  Delete media.

- `POST /api/media/categories`
  Create media category.

- `PUT /api/media/categories/{id}`
  Rename/enable/disable media category.

- `POST /api/media/subcategories`
  Create media subcategory.

- `PUT /api/media/subcategories/{id}`
  Rename/enable/disable media subcategory.

- Project CRUD APIs under `/api/projects`

- Client CRUD/photo APIs under `/api/clients`

- Homepage content update/upload APIs under `/api/homepage-content`

- Site settings update/upload APIs under `/api/site-settings`

- Enquiry management APIs under `/api/contact`

JWT authentication is required for admin endpoints. The frontend stores the token in browser `localStorage` as `mins-admin-token`.

## 7. Important User Flows

### Public Contact Enquiry Flow

1. User submits the contact form on `/contact`.
2. Frontend calls `POST /api/contact`.
3. Backend validates and stores the enquiry in MySQL.
4. Admin can view enquiries on `/admin` and `/admin/queries`.
5. Admin can update enquiry status.

### Admin Login Flow

1. Admin opens `/admin/login`.
2. Frontend sends credentials to `POST /api/auth/login`.
3. Backend verifies the admin user from the `admin_users` table.
4. Backend returns a JWT token.
5. Frontend stores token in `localStorage`.
6. Admin APIs use `Authorization: Bearer <token>`.

The first admin user is seeded from `app.admin.email` and `app.admin.password-hash` if the email is not already present in the database.

### Admin Password Update Flow

1. Admin opens `/admin/settings`.
2. Admin enters current password, new password, and confirmation.
3. Frontend calls `PUT /api/auth/password` with the admin JWT.
4. Backend verifies the current password against the `admin_users` table.
5. Backend stores a new BCrypt hash in `admin_users.password_hash`.

### Media Management Flow

1. Admin opens `/admin/media`.
2. Admin can create/update/disable categories.
3. Admin can create/update/disable subcategories.
4. Admin uploads a file or adds a media URL.
5. Each media item must have:
   - Title
   - Category
   - Subcategory
   - Media type
   - File or URL
6. Media appears on the public `/media` page.
7. Public users can filter by category and subcategory.

### Homepage Content Flow

1. Admin opens `/admin/content`.
2. Admin updates hero headline, subheading, hero media, stats, and CTA.
3. Backend persists content in MySQL.
4. Public home page fetches the latest content from `/api/homepage-content`.

### Site Settings Flow

1. Admin opens `/admin/settings`.
2. Admin updates company name, logo, email, phone, WhatsApp, location, map embed URL, social links, copyright, About section, and About image.
3. Public navbar, footer, about page, contact page, and about preview fetch these settings.

## 8. Local Setup

### Required Tools

Install:

- Java 17
- Maven
- Node.js and npm
- MySQL

### Database Setup

From the backend folder:

```bash
cd backend
mysql -u root -p < mysql-setup.sql
```

Default local database config:

```yaml
database: mins_db
user: mins_user
password: Mins@2026Secure#DB
```

These can be changed through environment variables:

```bash
MYSQL_HOST
MYSQL_PORT
MYSQL_DATABASE
MYSQL_USER
MYSQL_PASSWORD
```

### Backend Setup

```bash
cd backend
mvn -q -DskipTests package
java -jar target/mins-api-1.0.0.jar
```

Backend runs on:

```text
http://localhost:8080
```

Uploads are stored in:

```text
backend/uploads/
```

Uploaded files are served from:

```text
http://localhost:8080/uploads/<filename>
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

If port `3000` is busy, Next.js may run on another port such as `3001`.

## 9. Environment Variables

### Backend

Useful backend environment variables:

```bash
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=mins_db
MYSQL_USER=mins_user
MYSQL_PASSWORD='Mins@2026Secure#DB'

ADMIN_EMAIL=admin@mins.in
ADMIN_PASSWORD_HASH='<BCrypt hash>'
```

Important:

- Do not share real admin passwords in code or documentation.
- If changing the admin password, generate a new BCrypt hash and set `ADMIN_PASSWORD_HASH`.
- The JWT secret is currently configured directly in `backend/src/main/resources/application.yml` as `app.jwt.secret`.
- Before production, update `app.jwt.secret` to a strong secret or refactor it to use an environment variable.

### Frontend

The frontend needs the backend base URL:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

For deployed Vercel frontend connected to local backend through localtunnel:

```bash
NEXT_PUBLIC_API_BASE_URL=https://<your-localtunnel-url>.loca.lt
```

## 10. HTTPS Tunnel For Local Backend

The project currently uses localtunnel to expose the local Spring Boot backend over HTTPS.

Command:

```bash
npx localtunnel --port 8080 --local-host 127.0.0.1
```

Current tunnel used recently:

```text
https://lemon-lights-roll.loca.lt
```

Important:

- Localtunnel URLs can change after restart.
- If the tunnel URL changes, redeploy the frontend with the new `NEXT_PUBLIC_API_BASE_URL`.
- The frontend sends `bypass-tunnel-reminder: true` in API requests to avoid the localtunnel warning page.

## 11. Vercel Deployment

The frontend has been deployed to Vercel.

Current production alias:

```text
https://frontend-kappa-lake-84.vercel.app
```

Deploy command used:

```bash
cd frontend
npx vercel --prod --yes \
  --env NEXT_PUBLIC_API_BASE_URL=https://lemon-lights-roll.loca.lt \
  --build-env NEXT_PUBLIC_API_BASE_URL=https://lemon-lights-roll.loca.lt
```

If using a new tunnel URL, replace `https://lemon-lights-roll.loca.lt`.

Recommended production improvement:

- Deploy the backend to a real server or cloud host instead of localtunnel.
- Set `NEXT_PUBLIC_API_BASE_URL` permanently in Vercel project environment variables.
- Use HTTPS backend domain.
- Use real production MySQL.
- Use secure JWT secret and admin password hash.

## 12. Authentication And Security

Security config is in:

```text
backend/src/main/java/com/mins/config/SecurityConfig.java
```

Current behavior:

- Public `GET` APIs are permitted.
- Public contact submission is permitted.
- Admin mutation APIs require JWT.
- CORS allows:
  - `http://localhost:*`
  - `http://127.0.0.1:*`
  - `https://*.vercel.app`

Before production:

- Replace the development JWT secret in `application.yml`.
- Use a real backend domain and restrict CORS to actual frontend domains.
- Store database/admin secrets in environment variables.
- Avoid committing `.env` files.

## 13. File Uploads

Upload handling is centralized in:

```text
backend/src/main/java/com/mins/common/UploadStorageService.java
```

Upload folder:

```text
backend/uploads/
```

Used by:

- Media uploads
- Homepage hero media uploads
- Client photo uploads
- Site logo/about image uploads

If moving backend to production:

- Either keep a persistent server disk
- Or move uploads to S3/Cloudinary/Vercel Blob/etc.

Local uploaded files will not automatically move with Vercel because Vercel hosts only the frontend.

## 14. Common Commands

Frontend:

```bash
cd frontend
npm run dev
npm run typecheck
npm run build
```

Backend:

```bash
cd backend
mvn -q -DskipTests package
java -jar target/mins-api-1.0.0.jar
```

Start tunnel:

```bash
npx localtunnel --port 8080 --local-host 127.0.0.1
```

Smoke test backend:

```bash
curl http://localhost:8080/api/media
curl http://localhost:8080/api/media/categories
curl http://localhost:8080/api/media/subcategories
curl http://localhost:8080/api/site-settings
```

## 15. Current Known Operational Notes

- The frontend is deployed on Vercel.
- The backend is still running locally and exposed through localtunnel.
- If local backend stops, Vercel frontend API calls will fail.
- If localtunnel stops or changes URL, Vercel frontend API calls will fail until redeployed with the new URL.
- MySQL must be running for backend startup.
- `ddl-auto=update` allows Hibernate to evolve schema during development, but formal migrations such as Flyway/Liquibase are recommended before production.

## 16. Recommended Next Improvements

For a stronger handoff/production setup:

- Add Flyway or Liquibase migrations for database schema.
- Move backend to a hosted server.
- Move uploads to cloud object storage.
- Add role-based admin users instead of a single configured admin.
- Add frontend route guards for admin pages.
- Add server-side validation messages visible in admin UI.
- Add automated tests for media/category/subcategory flows.
- Add a root `.gitignore` if this project becomes a Git repository.

## 17. Quick Mental Model

The public site is mostly a dynamic renderer.

The admin panel edits content.

The Spring Boot backend owns:

- Authentication
- Database writes
- File storage
- Public API reads

MySQL is the source of truth for:

- Content
- Media
- Projects
- Clients
- Settings
- Enquiries

The frontend should not rely on hardcoded data for final production content. Most current public sections now fetch data from backend APIs.
