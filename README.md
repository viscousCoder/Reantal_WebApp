# Rental Website Application

A full-stack rental platform with three user roles: Tenant, Owner, and Admin. The application allows tenants to browse and book properties, owners to list their properties, and admin to manage all users and properties.

## Live Demos

- **Frontend**: [https://rentalapp02.netlify.app/booked](https://rentalapp02.netlify.app/booked)
- **Backend**: [https://reantal-webapp.onrender.com](https://reantal-webapp.onrender.com)

## Features

### Tenant Features

- User registration with email verification
- Profile management (name, email, phone number, rental history, profession)
- Browse available properties (PGs/Apartments/House)
- Book properties
- View booking history

### Owner Features

- Owner registration with email verification
- Profile management
- View all properties
- Add new properties for lease
- Manage listed properties
- View booking requests

### Admin Features

- Manage all users (view, block/unblock)
- View all bookings
- Manage all user (view, delete)
- Monitor platform activity

## Technology Stack

### Frontend

- React.js
- HTML/CSS
- JavaScript
- Typescript
- MUI
- Netlify (Hosting)

### Backend

- Node.js
- Express.js
- Typeorm (PostgreSQL) (Database)
- Render (Hosting)

## Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Installation

# Clone the repository

git clone https://github.com/viscousCoder/Reantal_WebApp.git

### Navigate into the project folder

cd Rental_App

### Set up frontend

cd frontend
npm install # Install frontend dependencies

### Set up backend

cd ../backend
npm install # Install backend dependencies

npm run dev # or 'npm start' if that's the command to run the frontend
