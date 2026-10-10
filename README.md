# HorizonStay Hotel Management

HorizonStay is a React and Django hotel-management application with guest, manager, and administrator workflows.

## Run with Docker

1. Copy `.env.example` to `.env` and adjust values if needed.
2. Run `docker compose up --build`.
3. Open `http://localhost:5173`.

The API is available at `http://localhost:8000/api/v1/`. Docker applies migrations and loads repeatable demo data when the backend starts.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Guest | `guest@hotel.test` | `Guest123!` |
| Manager | `manager@hotel.test` | `Manager123!` |
| Admin | `admin@hotel.test` | `Admin123!` |

These accounts are for local development only.

## Run locally

Backend:

```bash
cd backend
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

Frontend:

```bash
cd frontend
npm ci --legacy-peer-deps
npm run dev
```

## Checks

```bash
cd backend
python manage.py test

cd ../frontend
npm run lint
npm run build
```

Local development defaults to SQLite when `DB_ENGINE` is not set. Docker uses MySQL.
