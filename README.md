# EnergyMate - Energy Consumption Dashboard

EnergyMate is a sophisticated full-stack application designed to track, visualize, and analyze energy consumption. It seamlessly integrates with Gmail to extract invoice data and provides a modern, iPhone-inspired interface for deep energy insights.

## 🚀 Key Features

- **User-Centric Data Isolation:** Full multi-user support. Using Google OAuth2, every user has their own secure profile and private energy database powered by PostgreSQL.
- **Automated Gmail Invoice Parsing:** Integrated with the Gmail API to automatically scan, fetch, and parse EVN invoices. It extracts amounts, invoice numbers, and due dates without manual entry.
- **iPhone-Inspired Analytics Dashboard:**
  - **Minimalist UI:** Clean typography, soft shadows, and Apple-style rounded containers.
  - **KPI Scroll:** Horizontally scrollable cards for quick metric overviews.
  - **Monthly Cost Trends:** Smooth, curved Area Charts showing spending over the year.
  - **Seasonal Breakdown:** Bar charts and Pie charts analyzing usage by Winter, Spring, Summer, and Autumn.
  - **Smart Insights:** Automatic detection of peak billing months and efficiency trends.
- **Dynamic Real-Time Dashboard:**
  - **Pulsing Sparklines:** Live-animating charts that bring consumption data to life.
  - **Instant Metrics:** Real-time calculation of Previous Month Cost, Consumption, and Average Daily Usage.
- **Unified Dark Mode:** A polished Dark theme that persists via `localStorage`, featuring custom-tuned colors for reduced eye strain.
- **Robust Backend:** Built with FastAPI and SQLAlchemy, featuring clean separation of concerns (Models, Repositories, Services, Routes).

## 🛠 Project Structure

```text
EnergyMate/
├── backend/                # FastAPI Application
│   ├── model/              # SQLAlchemy Models (User, Invoice) & Pydantic Schemas
│   ├── repository/         # Database Access Object (DAO) layer
│   ├── service/            # Core logic (Gmail parsing, Analytics calculations)
│   ├── infrastructure/     # Database connections and Google OAuth config
│   └── web/                # REST API Endpoints
├── frontend/               # React Application
│   ├── src/
│   │   ├── pages/          # Full-page views (Dashboard, Analytics, GmailInvoices)
│   │   ├── components/     # UI components (KPICard, Sidebar, Header)
│   │   └── api/            # Centralized Axios API definitions
│   └── tailwind.config.js  # Theme and Tremor UI customization
└── docker-compose.yml      # Full-stack container orchestration
```

## 🚦 Getting Started

### Prerequisites
- Docker and Docker Compose.
- Google Cloud Console Project with **Gmail API** enabled.
- OAuth2 Client Credentials (Web Application).

### Setup & Installation
1.  **Environment Configuration:**
    Create `backend/.env` with your credentials:
    ```env
    DATABASE_URL=postgresql://user:password@db:5432/energymate
    GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com
    GOOGLE_CLIENT_SECRET=your_secret
    GOOGLE_REDIRECT_URI=http://localhost:8000/auth/callback
    FRONTEND_URL=http://localhost:3000
    ```

2.  **Launch the Stack:**
    ```bash
    docker-compose up --build -d
    ```

3.  **Access EnergyMate:**
    - Dashboard: [http://localhost:3000](http://localhost:3000)
    - Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## 📡 API Endpoints

- `GET /analytics`: Detailed seasonal and monthly trend analysis.
- `GET /summary`: High-level summary of total usage and alerts.
- `GET /evn/invoices`: Trigger Gmail sync and data extraction.
- `GET /invoices`: Retrieve the full invoice history for the authenticated user.
- `GET /auth/login`: Initiate the secure Google login flow.

## 💻 Tech Stack
- **Backend:** Python 3.11, FastAPI, SQLAlchemy, PostgreSQL.
- **Frontend:** React 18, Tremor UI, Tailwind CSS, Lucide Icons.
- **Infrastructure:** Docker, Docker Compose.
