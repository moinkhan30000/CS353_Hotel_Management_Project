# HorizonStay Hotel Management System

HorizonStay is a full-stack hotel booking and management application built with React, Django REST Framework, and MySQL. Guests can find and book hotels, while managers and administrators have their own tools for running the platform.

It can be run locally with Docker and includes demo data, role-based access control, backend tests, and Selenium tests for desktop and mobile layouts.

## Features

### Guests

- Search and filter available hotel properties.
- View hotel details, rooms, ratings, and reviews.
- Create and manage reservations.
- Pay for bookings through a wallet balance.
- Top up the wallet and review payment history.
- Earn and redeem loyalty points.
- Add or edit reviews for confirmed bookings.
- View and update profile information.

### Hotel managers

- Register a manager account and hotel.
- Maintain hotel information, operating status, and amenities.
- Create, edit, and remove room types.
- Upload and manage hotel images.
- Review reservations and cancel bookings when necessary.
- Read guest reviews and publish replies.
- Update manager and hotel profile information.

### Administrators

- View an overview of platform activity.
- Maintain administrator profile details.
- Generate and review reports covering users, hotels, bookings, and revenue.

### Platform capabilities

- Guest, Manager, and Admin role-based authorization.
- JWT access and refresh token authentication.
- Automatic access-token refresh and refresh-token revocation on logout.
- Registration, login, password reset, and password change workflows.
- Newsletter subscription with duplicate prevention.
- Responsive desktop and mobile layouts.
- Persistent MySQL storage in Docker and SQLite support for local development.

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, React Router |
| Backend | Django 5, Django REST Framework |
| Authentication | Simple JWT |
| Database | MySQL 8 in Docker; SQLite for local development and isolated tests |
| Styling | Responsive CSS with a shared HorizonStay design system |
| Testing | Django `APITestCase`, Selenium, Python `unittest`, ESLint, TypeScript |
| Development | Docker Compose |

## Project structure

```text
Hotel/
├── backend/                 Django project and REST API
│   ├── backend/             Project configuration
│   └── hotel/               Models, serializers, views, tests, and seed command
├── database/                Reference database schema
├── e2e/                     Selenium functional and visual tests
├── frontend/                React and TypeScript application
│   └── src/                 Pages, components, assets, and API client
├── .env.example             Optional local environment template
├── docker-compose.yml       Full development stack
└── README.md
```

## Quick start with Docker

### Requirements

- Docker Desktop with Docker Compose
- Git

### Start the application

```bash
git clone https://github.com/moinkhan30000/CS353_Hotel_Management_Project.git
cd CS353_Hotel_Management_Project
docker compose up --build
```

Docker Compose starts the following services:

| Service | Address | Purpose |
| --- | --- | --- |
| Frontend | <http://localhost:5173> | React application |
| Backend | <http://localhost:8000/api/v1/> | REST API |
| Django admin | <http://localhost:8000/admin/> | Django administration interface |
| Database | Internal port `3306` | MySQL storage used by the backend |

Migrations and the demo-data seed command run automatically when the backend container starts.

Stop the stack with:

```bash
docker compose down
```

Use `docker compose down -v` only when you intentionally want to remove the local MySQL volume and reset all development data.

## Demo accounts

The seed command creates these local-development accounts:

| Role | Email | Password |
| --- | --- | --- |
| Guest | `guest@hotel.test` | `Guest123!` |
| Manager | `manager@hotel.test` | `Manager123!` |
| Admin | `admin@hotel.test` | `Admin123!` |

These credentials are intended only for local development and testing.

## Environment configuration

Creating a `.env` file is optional for local Docker use because `docker-compose.yml` provides development defaults. To customize the configuration, copy `.env.example` to `.env` and change the required values.

```powershell
Copy-Item .env.example .env
```

```bash
cp .env.example .env
```

| Variable | Purpose | Development default |
| --- | --- | --- |
| `DJANGO_SECRET_KEY` | Django signing key | Development-only value |
| `DJANGO_DEBUG` | Enable Django debug responses | `True` |
| `DJANGO_ALLOWED_HOSTS` | Hosts accepted by Django | `localhost,127.0.0.1,backend` |
| `CORS_ALLOWED_ORIGINS` | Frontend origins permitted by CORS | `http://localhost:5173` |
| `FRONTEND_URL` | Frontend origin used in password-reset links | `http://localhost:5173` |
| `DJANGO_SECURE_SSL_REDIRECT` | Redirect HTTP requests to HTTPS | `False` |
| `DJANGO_SECURE_COOKIES` | Mark Django session and CSRF cookies as HTTPS-only | `False` |
| `DJANGO_HSTS_SECONDS` | HTTP Strict Transport Security duration | `0` |
| `DJANGO_TRUST_PROXY_SSL_HEADER` | Trust a configured reverse proxy's HTTPS header | `False` |
| `JWT_ACCESS_MINUTES` | Access-token lifetime in minutes | `15` |
| `JWT_REFRESH_DAYS` | Refresh-token lifetime in days | `1` |
| `MAX_HOTEL_IMAGE_SIZE` | Maximum uploaded hotel-image size in bytes | `5242880` |
| `DB_NAME` | MySQL database name | `hotel` |
| `DB_USER` | MySQL application user | `hotel` |
| `DB_PASSWORD` | MySQL application-user password | `hotel` |
| `DB_ROOT_PASSWORD` | MySQL root password | `root` |
| `VITE_API_URL` | REST API base URL used by React | `http://localhost:8000/api/v1` |

Do not commit `.env` or production secrets. The tracked `.env.example` contains placeholders and safe development values only.

## Run without Docker

### Backend

From the repository root:

```bash
cd backend
python -m venv .venv
```

Activate the environment on Windows:

```powershell
.\.venv\Scripts\Activate.ps1
```

Or on macOS/Linux:

```bash
source .venv/bin/activate
```

Then install and start Django:

```bash
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

Without `DB_ENGINE=mysql`, Django uses a local SQLite database.

### Frontend

In a second terminal:

```bash
cd frontend
npm ci --legacy-peer-deps
npm run dev
```

## API overview

All application endpoints are under `/api/v1/`.

| Area | Main endpoints |
| --- | --- |
| Authentication | `/auth/register/`, `/auth/login/`, `/auth/refresh/`, `/auth/logout/` |
| Password recovery | `/auth/password-reset/`, `/auth/password-reset/confirm/` |
| Profile | `/profile/`, `/profile/password/` |
| Hotels | `/hotels/`, `/hotels/mine/`, `/hotel-images/` |
| Rooms and amenities | `/rooms/`, `/amenities/` |
| Bookings | `/bookings/`, `/bookings/{id}/pay/`, `/bookings/{id}/cancel/` |
| Guest finances | `/wallet/`, `/wallet/top-up/`, `/loyalty/`, `/loyalty/redeem/` |
| Reviews | `/reviews/` |
| Reports | `/reports/` |
| Newsletter | `/newsletter/subscribe/` |
| Health check | `/health/` |

The API checks permissions independently of the frontend, so hiding a button or page is never used as a security control.

## Testing and validation

### Backend tests

The backend suite runs against a temporary in-memory database, so it does not touch development data. Its 19 tests cover the main API workflows as well as role restrictions, resource ownership, duplicate-payment prevention, password validation, image uploads, and refresh-token revocation.

With the Docker stack running:

```bash
docker compose exec -e DB_ENGINE=sqlite backend python manage.py test hotel -v 2
```

The test database is destroyed automatically, leaving normal development data unchanged.

### Frontend checks

```bash
cd frontend
npm run lint
npm run build
```

### Selenium browser suite

Chrome must be installed. Create the test environment once from the repository root:

```powershell
python -m venv .venv-e2e
.\.venv-e2e\Scripts\python.exe -m pip install -r e2e\requirements.txt
```

With the Docker stack running, execute all functional and visual tests:

```powershell
.\.venv-e2e\Scripts\python.exe -m unittest discover -s e2e -p "test_*.py" -v
```

Run only the visual suite:

```powershell
.\.venv-e2e\Scripts\python.exe -m unittest e2e.test_visual -v
```

Visual tests cover public, Guest, Manager, and Admin pages at desktop and mobile sizes. Screenshots are saved in `e2e/artifacts/` for local review.

To watch the functional browser tests instead of using headless Chrome:

```powershell
$env:E2E_HEADLESS = "false"
.\.venv-e2e\Scripts\python.exe -m unittest e2e.test_full_stack -v
```

## Common Docker issues

### Docker engine is unavailable

If Docker reports that `dockerDesktopLinuxEngine` cannot be found, start Docker Desktop and wait until the engine is running before retrying.

### Container name or port conflict

Inspect existing containers and port bindings:

```bash
docker ps -a
docker compose ps
```

Stop or rename the conflicting container, or change the relevant host port in `docker-compose.yml`. The MySQL service does not need a host port for this application because the backend reaches it through the Compose network.

### Frontend changes are not visible

Restart the Vite container and refresh the browser:

```bash
docker compose restart frontend
```

If necessary, recreate it:

```bash
docker compose up -d --build --force-recreate frontend
```

## Security and production notes

- The API enforces role and ownership rules. Guests cannot change rooms or amenities, and hotel-specific manager actions are limited to the manager's own hotel.
- Booking payments can be made only once. Database transactions and row locks protect room availability, wallet balances, and loyalty points from conflicting updates.
- Django's password validators are used during registration, password changes, and password resets.
- Login, password-reset, and other sensitive endpoints are rate-limited. Access tokens last 15 minutes by default, and refresh tokens rotate and are revoked after use or logout.
- Hotel images are limited to JPEG, PNG, and WebP files up to 5 MB by default.
- Wallet top-ups are simulated. Card details stay in the browser and are never sent to the API or stored. A real deployment would use a PCI-compliant payment provider.
- Guest profiles contain personal data, including phone numbers, dates of birth, and identity numbers. A public deployment should use encrypted storage and backups, restricted database access, a retention policy, and a privacy policy.
- JWTs are currently stored in `localStorage`. A public deployment should move them to `HttpOnly`, `Secure`, `SameSite` cookies and add the corresponding CSRF protection.
- Before deployment, replace all demo credentials and development defaults, disable Django debug mode, enable HTTPS settings, and restrict allowed hosts and CORS origins. Run `python manage.py check --deploy` with the production environment loaded.
- The Docker Compose setup is intended for local development. Production hosting should use a WSGI or ASGI server behind an HTTPS reverse proxy.

## License

This project is distributed under the terms in [LICENSE](LICENSE).
