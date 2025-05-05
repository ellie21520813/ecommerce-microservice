# 🛒 E-commerce Microservice Architecture

This is a full-featured **E-commerce system** built using a **Microservices Architecture**. Each service is built with **Django REST Framework** for the backend and **React.js** for the frontend. Services communicate via REST APIs and are independently deployable, scalable, and maintainable.

## 🧱 Architecture Overview

The system is composed of the following microservices:

- `auth_service`: User authentication, JWT, OTP.
- `product_service`: Product, vendor, category, review, wishlist management.
- `order_service`: Order, cart, payment, shipping, and refund management.
- `frontend`: React-based user interface and using Redux
- `gateway`: Nginx proxy.

## 🐳 Running with Docker Compose

> **Requirements**: [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/), pip, python installed

### 🔧 Step 1: Clone the repository

```bash
git clone https://github.com/ellie21520813/ecommerce-microservice.git
cd ecommerce-microservice
```

### 🔧 Step 2: Create environment file

### 🏗️ Step 3: Build and start the application

```bash
docker-compose up --build
```

> This may take a few minutes to pull images and build containers.

### 🌐 Access the app

- Frontend: http://localhost:3000/
- Django Admin (auth_service): http://localhost:8000/admin/
- API Endpoints: exposed via different ports (see `docker-compose.yml`)

## ⚙️ Services Overview

| Service         | Port | Description                            |
|-----------------|------|----------------------------------------|
| frontend        | 3000 | React frontend                         |
| gateway (nginx) | 80   | Reverse proxy                          |
| auth_service    | 8000 | User authentication                    |
| product_service | 8001 | Product and vendor management          |
| order_service   | 8002 | Order and cart management              |
| postgres        | 5432 | PostgreSQL database for each service   |

## 📂 Project Structure

```
ecommerce-microservice/
├── auth_service/
├── product_service/
├── order_service/
├── frontend/
├── gateway/           # Nginx proxy
├── docker-compose.yml
```

## 🚀 Key Features

- JWT & OTP user authentication.
- RESTful APIs with Django REST Framework.
- Scalable microservices architecture.
- Modern UI with React and Redux

## ✅ TODO (Planned Features)

- ELK stack integration for logging and monitoring.
- CI/CD with GitHub Actions.
- Add unit and integration tests.
- Add API Gateway with rate limiting.

---
