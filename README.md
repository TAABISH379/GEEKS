# Dining Certainty – A Zero-Waiting Restaurant Reservation System

## 🎯 CORE CONCEPT

Dining Certainty is an innovative restaurant reservation system designed to eliminate customer waiting times and optimize table utilization for restaurants. Unlike traditional booking apps that rely on fixed time slots, Dining Certainty introduces a dynamic approach based on **Dining Duration Tokens (DDT)** and **Confidence Window Booking**, providing users with a clear **Certainty Score (%)** for each reservation.

**Key Innovations:**
*   **Zero-Waiting Experience:** Minimize customer waiting risk.
*   **Optimized Table Utilization:** Improve efficiency for restaurants.
*   **Transparent Booking:** Users see exactly how 'certain' their booking is.

## 🧠 SYSTEM LOGIC

### 1️⃣ Dining Duration Token (DDT)

The system assigns an average dining duration to each booking based on party size. This dynamic duration is crucial for determining accurate table availability and turnover.

*   **1–2 people:** 45 minutes
*   **3–4 people:** 75 minutes
*   **5+ people:** 90 minutes

### 2️⃣ Confidence Window Booking

Instead of rigid exact seating times, Dining Certainty offers a "Guaranteed seating between X PM – Y PM" window. This window accounts for real-time factors and historical data to provide a more realistic and reliable seating expectation.

The confidence window is calculated using:
*   **Current restaurant load:** Real-time occupancy.
*   **Historical averages:** Past data on dining durations and table turnovers.
*   **Buffer logic:** Configurable lead and lag times defined by the restaurant.

### 3️⃣ Certainty Score Algorithm

Every booking displays a Certainty Score (0–100%). This score quantifies the probability of a smooth, on-time seating experience, considering multiple dynamic factors:

*   **Remaining table capacity:** Available tables relative to demand.
*   **Overlapping DDT usage:** How much the proposed booking's DDT overlaps with existing bookings.
*   **Peak hour weighting:** Adjustments for busy periods (future enhancement).
*   **Historical punctuality:** Restaurant's past performance in seating guests on time (future enhancement).

## 🧩 REQUIRED FEATURES

### USER SIDE

*   **Discover Restaurants:** Browse available restaurants.
*   **Select Date, Party Size:** Input booking preferences.
*   **View Confidence Windows + Certainty Scores:** Transparent insights before booking.
*   **Book Table:** Secure a reservation.
*   **Receive Instant Confirmation:** Immediate feedback on successful bookings.
*   **View Booking History:** Access past and upcoming reservations.

### RESTAURANT ADMIN SIDE

*   **Create Restaurant Profile:** Set up new restaurant entries.
*   **Define Number of Tables:** Configure table types and capacities.
*   **View Bookings in Real Time:** Monitor current and upcoming reservations.
*   **See Peak Hour Analytics:** Insights into busy periods (future enhancement).
*   **Adjust Buffer Rules:** Fine-tune `earlyBuffer` and `lateBuffer` for confidence window calculations.

## 🛠 TECH STACK (MANDATORY)

*   **FRONTEND:** React (Vite), Tailwind CSS
    *   Clean, modern, mobile-first UI.
    *   Certainty Score progress indicator (visual representation).
    *   Clear Confidence Window display.
*   **BACKEND:** Node.js, Express
    *   REST API architecture.
    *   Modular services (booking, scoring, availability).
*   **DATABASE:** MongoDB (Mongoose schemas)
    *   Collections: `Users`, `Restaurants`, `Tables`, `Bookings`, `Analytics` (for future use).
*   **AUTHENTICATION:** JWT-based authentication with separate roles (`User`, `Restaurant Admin`).

## 📁 PROJECT STRUCTURE

```
/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   └── seed.js
├── frontend/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── public/
│   ├── src/
│   ├── .eslintrc.cjs
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── README.md
└── SETUP_AND_RUN.md
└── backend/API_DOCUMENTATION.md
```

## 🧪 DEMO-READY REQUIREMENTS

*   **Seed Sample Data:** Includes sample restaurants, users, and bookings.
    *   `john@example.com` / `password123` (Regular User)
    *   `admin@example.com` / `admin123` (Restaurant Admin)
*   **No Broken Flows:** All core functionalities are implemented and operational.
*   **Meaningful Dummy Data:** Provides a realistic demonstration.

## 📊 BONUS (Future Enhancements)

*   Simple analytics dashboard.
*   Peak hour visualization.
*   Booking heatmap.

## 📜 DELIVERABLES

This project provides:
*   Full frontend code
*   Full backend code
*   MongoDB schemas
*   API documentation (`backend/API_DOCUMENTATION.md`)
*   Setup & run instructions (`SETUP_AND_RUN.md`)
*   A comprehensive README (`README.md`)

## 🏁 FINAL OBJECTIVE

The result is:
*   **Fully runnable locally** (Requires manual execution of `npm install` and `npm run` commands as detailed below.)
*   **Understandable in 5 minutes** by a technical audience
*   **Impressive** and clearly differentiated from competitors

## Setup and Run Instructions

**IMPORTANT: Due to limitations of the current environment, the following setup commands must be executed manually in your local terminal before proceeding:**

1.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    npm run seed
    ```
2.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    ```
After completing these steps, you can then proceed to start the development servers as described in `SETUP_AND_RUN.md`.

Please refer to the `SETUP_AND_RUN.md` file for detailed instructions on how to set up and run the application locally.
