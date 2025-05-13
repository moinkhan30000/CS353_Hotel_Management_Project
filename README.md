# 🏨 CS353 Hotel Management Project

A full-stack hotel management system built using:

- ⚛️ **Frontend**: Vite + React + TypeScript  
- 🐍 **Backend**: Django + Django REST Framework  
- 🐬 **Database**: MySQL  
- 🐳 **Containerized** with Docker and Docker Compose

---

## 🚀 Quick Start

### 📦 Requirements

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

### 📥 Clone and Run

```bash
# Clone the repository
git clone https://github.com/moinkhan30000/CS353_Hotel_Management_Project.git
cd CS353_Hotel_Management_Project

# Build and run the app
docker-compose up --build
```

---

## 🌐 Access the Application

| Service     | URL                             |
|-------------|----------------------------------|
| Frontend    | [http://localhost:5173](http://localhost:5173) |
| Backend API | [http://localhost:8000](http://localhost:8000) |

---

## 🐳 Docker Services

| Container   | Description           | Port   |
|-------------|-----------------------|--------|
| `frontend`  | React app via Vite    | 5173   |
| `backend`   | Django REST API       | 8000   |
| `mysql_db`  | MySQL database server | 3306   |

---

## 📁 Project Structure

```
CS353_Hotel_Management_Project/
├── frontend/       # Vite + React frontend
├── backend/        # Django backend
├── docker-compose.yml
└── README.md
```

---

## 🛠 Useful Commands

### 🔧 Docker

```bash
# Rebuild containers without cache
docker-compose build --no-cache

# Stop containers
docker-compose down

# Open shell in Django container
docker-compose exec backend sh
```

### 🐍 Django Management

```bash
# Run migrations
docker-compose exec backend python manage.py migrate

# Create a superuser
docker-compose exec backend python manage.py createsuperuser
```

---

## 📄 License

Licensed under the [MIT License](LICENSE)

---

## 🙋‍♂️ Author

**moinkhan30000**  
[GitHub Profile](https://github.com/moinkhan30000)
