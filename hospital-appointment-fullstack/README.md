# CarePoint Hospital — Full Stack React + Express + MongoDB

This project is a beginner-friendly hospital appointment management teaching project.

## User roles and scope

### Admin
- Demo login from backend `.env`
- Add, view, update and delete doctors
- View, update and delete patients

### Patient
- Register and login
- View doctors
- Book an appointment
- View, reschedule and cancel their own booked appointments

### Doctor
- Login using an account created by Admin
- View their own appointments
- Mark a booked appointment completed with a comment

No receptionist, billing, pharmacy, chat or medical-record modules are included.

> Classroom learning project only. Use synthetic data and do not deploy with the demo admin setup.

## Project structure

```text
hospital-appointment-fullstack/
├── backend/       # Express + MongoDB API
│   ├── src/
│   ├── package.json
│   └── .env.example
└── frontend/      # React + Vite UI
    ├── src/
    ├── package.json
    └── .env.example
```

## Requirements

- Node.js 18 or later
- MongoDB Community Server running locally, or MongoDB Atlas
- Browser

MongoDB Compass is only a database GUI. It does not run the MongoDB server by itself.

## 1. Start backend

Open terminal 1:

```bash
cd backend
npm install
```

Copy `backend/.env.example` to `backend/.env` and check the MongoDB URI and JWT secret.

Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

macOS/Linux:
```bash
cp .env.example .env
```

Run:
```bash
npm run dev
```

Backend API: `http://localhost:5000/api`

Health check: `http://localhost:5000/api/health`

Demo admin:
```text
Email: admin@hospital.com
Password: Admin@123
```

These values are read from `.env`. Change them for local classroom use. Do not expose this demo admin arrangement in production.

## 2. Start React frontend

Open terminal 2:

```bash
cd frontend
npm install
```

Copy `frontend/.env.example` to `frontend/.env` if you need a different API URL.

Run:
```bash
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## 3. Recommended first-time demo flow

1. Login as Admin using the demo credentials.
2. Open Doctors and add a doctor with name, email, password and specialization.
3. Sign out.
4. Register a new patient account.
5. Open Find a doctor and book a future date/time.
6. Open My appointments to view, reschedule or cancel the booking.
7. Sign out and log in using the doctor email/password created by Admin.
8. Open Appointments, enter a comment and mark the appointment completed.
9. Log back in as the patient to see the completed status and doctor comment.
10. Log in as Admin to view and manage users.

## 4. API summary

### Auth
- `POST /api/auth/register` — patient registration
- `POST /api/auth/login` — admin, doctor and patient login

### Admin (Admin token)
- `GET /api/admin/users`
- `GET /api/admin/doctors`
- `GET /api/admin/patients`
- `POST /api/admin/doctors`
- `PUT /api/admin/users/:id`
- `DELETE /api/admin/users/:id`

### Patient (Patient token)
- `GET /api/patient/doctors`
- `POST /api/patient/appointments`
- `GET /api/patient/appointments`
- `PUT /api/patient/appointments/:id`
- `DELETE /api/patient/appointments/:id`

### Doctor (Doctor token)
- `GET /api/doctor/appointments`
- `PATCH /api/doctor/appointments/:id/complete`

For request JSON examples and detailed Postman steps, see `backend/README.md`.

## 5. Frontend features

- React Router routes and role-protected pages
- Auth context for login/register/logout
- Axios API client automatically attaches JWT
- Admin dashboard, doctor list and patient list
- Doctor add/update/delete UI; patient update/delete UI
- Patient doctor directory and appointment booking modal
- Patient appointment list, reschedule and cancel
- Doctor appointment list and completion comment
- Responsive CSS layout

## 6. Beginner architecture

```text
React pages/components
        |
        v
      Axios
        |
        v
 Express routes
        |
        v
 JWT + role middleware
        |
        v
   Controllers
        |
        v
 Mongoose models
        |
        v
     MongoDB
```

## 7. Important simplifications

- A slot is a date and start time, e.g. `2026-12-10` and `10:30`.
- The backend rejects a second `BOOKED` appointment for the same doctor/date/time.
- This beginner version does not define doctor working hours, slot duration or leave days.
- Slot validation is check-before-save and is not race-safe under simultaneous requests. A production system needs an atomic uniqueness strategy or transaction.
- The UI does not replace server-side authorization. Backend role checks are still required.
- Admin credentials are configured in `.env` for demonstration. A real application needs a secure admin provisioning process and proper secret management.
