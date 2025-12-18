# Dining Certainty: Setup and Run Instructions

**IMPORTANT: Due to limitations of the current environment, the `npm install`, `npm run seed`, and `npm run dev` commands mentioned below must be executed manually in your local terminal.**

## Prerequisites

*   Node.js (v18 or higher recommended)
*   npm (Node Package Manager)
*   MongoDB (local installation or cloud-hosted instance like MongoDB Atlas)

## 1. Clone the Repository

(Assuming you have cloned this project)

## 2. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

### Install Dependencies

Install the necessary Node.js packages:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the `backend` directory with the following content:

```
MONGO_URI=mongodb://localhost:27017/dining-certainty
JWT_SECRET=supersecretjwtkey
PORT=5000
```
*   **`MONGO_URI`**: Your MongoDB connection string. If you have a local MongoDB instance running, `mongodb://localhost:27017/dining-certainty` should work. For MongoDB Atlas, use your provided connection string.
*   **`JWT_SECRET`**: A strong, random string for JWT token encryption. You can generate one online or use a long random string.
*   **`PORT`**: The port for the backend server to run on. Default is `5000`.

### Seed Database (Optional but Recommended for Demo)

To populate your database with sample users, restaurants, and bookings for demonstration purposes, run the seeding script:

```bash
npm run seed
```
This will create:
*   A regular user: `john@example.com` / `password123`
*   An admin user: `admin@example.com` / `admin123`
*   Sample restaurants and bookings.

### Run the Backend Server

Start the backend server in development mode (with `nodemon` for auto-restarts on file changes):

```bash
npm run dev
```
The backend API will be running at `http://localhost:5000`.

## 3. Frontend Setup

Navigate to the `frontend` directory:

```bash
cd frontend
```

### Install Dependencies

Install the necessary Node.js packages:

```bash
npm install
```

### Run the Frontend Development Server

Start the React development server:

```bash
npm run dev
```
The frontend application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## 4. Accessing the Application

*   Open your web browser and go to `http://localhost:5173`.
*   You can log in with:
    *   **User:** `john@example.com` / `password123`
    *   **Admin:** `admin@example.com` / `admin123`

## Troubleshooting

*   **MongoDB Connection Error**: Ensure your MongoDB server is running and `MONGO_URI` in `backend/.env` is correct.
*   **Frontend/Backend Communication**: Ensure both frontend and backend servers are running. Check browser console for network errors.
*   **CORS Issues**: Ensure the `cors` middleware is correctly configured in `backend/server.js`.
*   **JWT Issues**: If you encounter authentication errors, verify `JWT_SECRET` in `backend/.env` is consistent and that your browser is sending the `x-auth-token` header correctly.
