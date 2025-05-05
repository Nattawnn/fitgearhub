# FitGearHub - E-commerce Platform

A full-stack e-commerce platform for fitness equipment built with Next.js and Django.

## Features

- Product browsing and searching
- Shopping cart functionality
- User authentication
- Order management
- Admin dashboard

## Tech Stack

- **Frontend**: Next.js, React
- **Backend**: Django, Django REST Framework
- **Database**: PostgreSQL
- **Containerization**: Docker
- **Deployment**: Render

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fitgearhub.git
cd fitgearhub
```

2. Start the development environment:
```bash
cd docker
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:8000/admin

## Development

### Frontend Development

The frontend is built with Next.js and is located in the `frontend` directory.

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

The backend is built with Django and is located in the `backend` directory.

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
