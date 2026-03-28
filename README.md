# EnergyMate - Energy Consumption Dashboard

EnergyMate is a full-stack application designed to track and visualize energy consumption through monthly invoices. It features a FastAPI backend and a React frontend, all orchestrated with Docker.

## 🚀 Recent Improvements & Features

- **Full-Stack Orchestration:** Integrated the backend and frontend using `docker-compose` for a seamless one-command setup.
- **Automated Invoice Management:** Implemented ID generation and data mapping in the service layer.
- **Seed Data:** Pre-loaded with 5 months of energy data (October to February) for immediate visualization.
- **Live Dashboard:** React-based dashboard that fetches real-time consumption summaries and alerts (e.g., "High consumption!" alerts for totals over 500 kWh).
- **CORS Enabled:** Backend configured to securely communicate with the React development server.

## 🛠 Project Structure

```text
EnergyMate/
├── backend/            # FastAPI Backend
│   ├── data/           # Seed data and data logic
│   ├── model/          # Pydantic schemas and Dataclasses
│   ├── repository/     # In-memory data storage
│   ├── service/        # Business logic and ID generation
│   └── web/            # API Routes and FastAPI initialization
├── frontend/           # React Frontend
│   ├── public/         # HTML template
│   └── src/            # React components (App.js, index.js)
├── docker-compose.yml  # Orchestration for both services
├── Dockerfile          # Backend Docker configuration
└── requirements.txt    # Python dependencies
```

## 🚦 Getting Started

### Prerequisites
- Docker and Docker Compose installed on your machine.

### Running the Application
1. **Build and Start:**
   ```bash
   docker-compose up --build -d
   ```
2. **Access the Dashboard:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.
3. **Access API Documentation:**
   Open [http://localhost:8000/docs](http://localhost:8000/docs) to explore the Swagger UI.

## 📡 API Endpoints

- `GET /invoices`: List all energy invoices.
- `POST /invoices`: Add a new invoice (automatically generates IDs).
- `GET /summary`: Get total kWh, total amount, and consumption alerts.

## 💻 Tech Stack
- **Backend:** Python, FastAPI, Pydantic, Uvicorn.
- **Frontend:** JavaScript, React.
- **DevOps:** Docker, Docker Compose.
