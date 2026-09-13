# ECE Lab Inventory Manager

A full-stack CRUD web application for managing electronic components and laboratory equipment in an Electronics & Communication Engineering (ECE) laboratory.

## Project Description

The **ECE Lab Inventory Manager** is a CRUD-based mini web application developed to manage electronic components and laboratory equipment efficiently. It allows laboratory administrators to add, view, update, delete, search, filter, and monitor electronic components across multiple laboratories.

## Features

- **Login Page** with demo credentials
- **Dashboard** with stat cards, recent components, low-stock alerts, and category summary
- **Components Page** with search, category/lab/status filters, and sorting
- **Add Component** form with full validation (unique ID, non-negative quantities)
- **View Component** detailed view page
- **Edit Component** with inline form
- **Delete** with confirmation dialog
- **Low Stock Page** automatically identifying items at or below minimum stock
- **Reports Page** with visual charts (category, laboratory, status distribution)
- **About Page** with project details
- **Dark Mode / Light Mode** toggle
- **Toast notifications** for success and error messages
- **Loading states** and **empty states**
- Fully **responsive** for laptop, tablet, and mobile

## CRUD Explanation

| Operation | Description |
|-----------|-------------|
| **Create** | Add new components to the inventory via the Add Component page |
| **Read** | View all components in a searchable table or view individual component details |
| **Update** | Edit existing component information with a pre-filled form |
| **Delete** | Remove components with a confirmation dialog before deletion |

All CRUD operations communicate with the Express.js backend REST API, which stores data permanently in a JSON file.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) |
| Routing | React Router DOM |
| Icons | Lucide React |
| Styling | CSS3 (custom, no Tailwind) |
| Backend | Node.js + Express.js |
| API | REST API |
| Database | JSON file (file-based storage) |

## Project Structure

```
project-root
│
├── backend
│   ├── data
│   │   └── components.json      # JSON database (seeded with 12 components)
│   ├── server.js                # Express server with REST API
│   └── package.json
│
├── src
│   ├── components
│   │   ├── Layout.jsx           # Sidebar + topbar layout
│   │   ├── ConfirmDialog.jsx    # Delete confirmation dialog
│   │   ├── StatusBadge.jsx      # Status badge component
│   │   ├── StatCard.jsx         # Dashboard stat card
│   │   ├── EmptyState.jsx       # Empty state placeholder
│   │   └── Loading.jsx          # Loading spinner
│   ├── pages
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Components.jsx
│   │   ├── AddComponent.jsx
│   │   ├── EditComponent.jsx
│   │   ├── ViewComponent.jsx
│   │   ├── LowStock.jsx
│   │   ├── Reports.jsx
│   │   └── About.jsx
│   ├── context
│   │   ├── AuthContext.jsx      # Login/logout state
│   │   ├── ThemeContext.jsx     # Dark/light mode
│   │   └── ToastContext.jsx     # Toast notifications
│   ├── services
│   │   └── api.js               # Fetch API calls to backend
│   ├── styles
│   │   └── global.css           # All application styles
│   ├── App.jsx                  # Routes
│   └── main.jsx                 # App entry point
│
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## Installation

1. Clone or download the project to your local machine.

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies (from the project root):
```bash
cd ../
npm install
```

## How to Start

### Start the Backend

From the `backend` directory:
```bash
npm start
```

The Express server runs on `http://localhost:3001`.

Alternatively, from the project root:
```bash
npm run server
```

### Start the Frontend

From the project root:
```bash
npm run dev
```

The frontend runs on `http://localhost:5173` and automatically proxies API requests to the backend.

### Login Credentials

- **Email:** admin@vsb.edu
- **Password:** admin123

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/components` | Get all components |
| GET | `/api/components/:id` | Get a single component by ID |
| POST | `/api/components` | Create a new component |
| PUT | `/api/components/:id` | Update an existing component |
| DELETE | `/api/components/:id` | Delete a component |

## Seed Data

The application comes pre-loaded with 12 ECE laboratory components including ESP32, Arduino Uno, IR Sensor, Ultrasonic Sensor, Digital Storage Oscilloscope, Breadboard, NodeMCU ESP8266, Function Generator, 5V Power Supply, Raspberry Pi, Jumper Wires, and DHT22 Temperature Sensor.

## Color Theme

- Dark navy sidebar
- White/light gray main background
- Blue primary buttons
- Green for available status
- Orange for low stock
- Red for critical/damaged
- Gray for maintenance

## Activity

**VSB Skill Vault – Activity 3**  
Mini Web Application – CRUD-Based Web Application
