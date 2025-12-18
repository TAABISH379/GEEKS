# Dining Certainty API Documentation

This document outlines the RESTful API endpoints for the Dining Certainty application.

**Base URL:** `http://localhost:5000/api`

---

## Authentication

All private routes require a JSON Web Token (JWT) passed in the `x-auth-token` header.

**Roles:**
*   `user`: Can register, login, view restaurants, check availability, book tables, and view their own bookings.
*   `admin`: Can do everything a `user` can, plus create/manage restaurants, add/manage tables, adjust buffer rules, and view all bookings for their owned restaurants.

---

### Auth Endpoints

#### `POST /api/auth/register`
*   **Description:** Register a new user.
*   **Access:** Public
*   **Request Body:**
    ```json
    {
      "name": "string",
      "email": "string",
      "password": "string",
      "role": "string" // Optional: 'user' or 'admin'. Defaults to 'user'.
    }
    ```
*   **Response:**
    ```json
    {
      "token": "string" // JWT token
    }
    ```

#### `POST /api/auth/login`
*   **Description:** Authenticate a user and get a JWT token.
*   **Access:** Public
*   **Request Body:**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
*   **Response:**
    ```json
    {
      "token": "string" // JWT token
    }
    ```

#### `GET /api/auth/me`
*   **Description:** Get details of the currently authenticated user.
*   **Access:** Private (User, Admin)
*   **Headers:** `x-auth-token: <JWT>`
*   **Response:**
    ```json
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "string",
      "createdAt": "datetime"
    }
    ```

---

## Restaurant Endpoints

#### `GET /api/restaurants`
*   **Description:** Get a list of all restaurants.
*   **Access:** Public
*   **Response:** `Array<RestaurantObject>`

#### `GET /api/restaurants/:id`
*   **Description:** Get details of a single restaurant by ID.
*   **Access:** Public
*   **Response:** `RestaurantObject`

#### `POST /api/restaurants`
*   **Description:** Create a new restaurant.
*   **Access:** Private (Admin)
*   **Headers:** `x-auth-token: <JWT>`
*   **Request Body:**
    ```json
    {
      "name": "string",
      "address": "string",
      "phone": "string", // Optional
      "email": "string", // Optional
      "description": "string", // Optional
      "tables": [ // Optional, array of tables
        {
          "tableNumber": "string",
          "capacity": "number"
        }
      ]
    }
    ```
*   **Response:** `RestaurantObject`

#### `PUT /api/restaurants/:id`
*   **Description:** Update an existing restaurant by ID.
*   **Access:** Private (Admin, owner of restaurant)
*   **Headers:** `x-auth-token: <JWT>`
*   **Request Body:** (Partial updates allowed)
    ```json
    {
      "name": "string",
      "address": "string",
      "phone": "string",
      "email": "string",
      "description": "string"
    }
    ```
*   **Response:** `RestaurantObject`

#### `DELETE /api/restaurants/:id`
*   **Description:** Delete a restaurant by ID.
*   **Access:** Private (Admin, owner of restaurant)
*   **Headers:** `x-auth-token: <JWT>`
*   **Response:**
    ```json
    {
      "msg": "Restaurant removed"
    }
    ```

#### `POST /api/restaurants/:id/tables`
*   **Description:** Add one or more tables to a restaurant.
*   **Access:** Private (Admin, owner of restaurant)
*   **Headers:** `x-auth-token: <JWT>`
*   **Request Body:**
    ```json
    {
      "tables": [
        {
          "tableNumber": "string",
          "capacity": "number"
        },
        {
          "tableNumber": "string",
          "capacity": "number"
        }
      ]
    }
    ```
*   **Response:** `RestaurantObject` (updated with new tables)

#### `PUT /api/restaurants/:id/buffer`
*   **Description:** Adjust buffer rules for a restaurant.
*   **Access:** Private (Admin, owner of restaurant)
*   **Headers:** `x-auth-token: <JWT>`
*   **Request Body:** (Partial updates allowed)
    ```json
    {
      "earlyBuffer": "number", // in minutes
      "lateBuffer": "number"  // in minutes
    }
    ```
*   **Response:** `RestaurantObject` (updated buffer rules)

---

## Booking Endpoints

#### `GET /api/bookings/availability`
*   **Description:** Check table availability, confidence window, and certainty score for a potential booking.
*   **Access:** Public
*   **Query Parameters:**
    *   `restaurantId`: ID of the restaurant (required)
    *   `date`: ISO string of the requested date and time (e.g., `2025-12-18T19:00:00.000Z`) (required)
    *   `partySize`: Number of guests (required)
*   **Response:**
    ```json
    {
      "restaurantId": "string",
      "requestedDateTime": "datetime",
      "partySize": "number",
      "diningDurationToken": "number", // in minutes
      "confidenceWindow": {
        "start": "datetime",
        "end": "datetime"
      },
      "certaintyScore": "number" // 0-100
    }
    ```

#### `POST /api/bookings`
*   **Description:** Create a new booking.
*   **Access:** Private (User)
*   **Headers:** `x-auth-token: <JWT>`
*   **Request Body:**
    ```json
    {
      "restaurantId": "string",
      "requestedDateTime": "string", // ISO string of the requested date and time
      "partySize": "number"
    }
    ```
*   **Response:** `BookingObject`

#### `GET /api/bookings/me`
*   **Description:** Get all bookings made by the authenticated user.
*   **Access:** Private (User)
*   **Headers:** `x-auth-token: <JWT>`
*   **Response:** `Array<BookingObject>`

#### `GET /api/bookings/restaurant/:restaurantId`
*   **Description:** Get all bookings for a specific restaurant.
*   **Access:** Private (Admin, owner of restaurant)
*   **Headers:** `x-auth-token: <JWT>`
*   **Response:** `Array<BookingObject>`

#### `PUT /api/bookings/:id/status`
*   **Description:** Update the status of a booking (e.g., 'confirmed', 'cancelled', 'completed').
*   **Access:** Private (Admin, owner of restaurant)
*   **Headers:** `x-auth-token: <JWT>`
*   **Request Body:**
    ```json
    {
      "status": "string" // 'pending', 'confirmed', 'cancelled', 'completed'
    }
    ```
*   **Response:** `BookingObject` (updated status)

---
