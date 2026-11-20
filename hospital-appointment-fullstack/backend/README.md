# Beginner-Friendly Hospital Appointment Backend

A small teaching project using **Node.js, Express.js, MongoDB, Mongoose and JWT**.

## Scope: only three roles

### Admin
- Login with demo credentials in `.env`.
- View all doctors and patients.
- Add doctors.
- Update or delete doctors and patients.
- Patients register themselves; doctors are created by Admin.

### Patient
- Register and login.
- View doctors.
- Book an appointment.
- View own appointments.
- Update the date/time of a booked appointment.
- Cancel a booked appointment.

### Doctor
- Login using the account created by Admin.
- View appointments assigned to that doctor.
- Mark an appointment as completed and add a comment.

No receptionist, billing, pharmacy, inventory, chat, admission or medical-history modules.

> Educational prototype only. Use synthetic data, not real patient information.

## 1. Setup

Requirements: Node.js 18+, MongoDB Community Server or MongoDB Atlas, and Postman.

MongoDB Compass is a GUI client; it does not run the MongoDB server itself.

```bash
npm install
```

Copy `.env.example` to `.env`:

Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

macOS/Linux:
```bash
cp .env.example .env
```

Start MongoDB, then run:
```bash
npm run dev
```

API base URL: `http://localhost:5000/api`

Health check: `GET /api/health`

## 2. Demo Admin Login

The `.env.example` includes these classroom demo credentials:

```text
ADMIN_EMAIL=admin@hospital.com
ADMIN_PASSWORD=Admin@123
```

Login:
`POST /api/auth/login`

```json
{"email":"admin@hospital.com","password":"Admin@123"}
```

Copy the `token` from the response. Use this header on protected endpoints:

```text
Authorization: Bearer YOUR_TOKEN
```

Admin is not stored in MongoDB in this simple version. Credentials are read from `.env`. This is for local teaching only; a real application needs secure admin provisioning, secrets management and password rotation.

## 3. API Reference

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Patient registration |
| POST | `/api/auth/login` | Admin, doctor or patient login |

Patient registration:
```json
{
  "name":"Kavin",
  "email":"kavin@gmail.com",
  "password":"patient123",
  "phone":"9876543210"
}
```

Doctor registration is not public. Admin creates doctor accounts.

### Admin APIs — Admin token required

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/admin/users` | View all users |
| GET | `/api/admin/doctors` | View doctors |
| GET | `/api/admin/patients` | View patients |
| POST | `/api/admin/doctors` | Add doctor |
| PUT | `/api/admin/users/:id` | Update a doctor or patient |
| DELETE | `/api/admin/users/:id` | Delete a doctor or patient |

Add doctor:
```json
{
  "name":"Dr Arun",
  "email":"arun@hospital.com",
  "password":"doctor123",
  "phone":"9876500000",
  "specialization":"Cardiology"
}
```

Update user (send only fields to change):
```json
{"name":"Dr Arun Kumar","specialization":"General Medicine"}
```

### Patient APIs — Patient token required

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/patient/doctors` | List doctors |
| POST | `/api/patient/appointments` | Book appointment |
| GET | `/api/patient/appointments` | View own appointments |
| PUT | `/api/patient/appointments/:id` | Update appointment date/time |
| DELETE | `/api/patient/appointments/:id` | Cancel appointment |

Book:
```json
{
  "doctorId":"PASTE_DOCTOR_MONGODB_ID",
  "date":"2026-12-10",
  "time":"10:30"
}
```

Update:
```json
{"date":"2026-12-11","time":"11:00"}
```

Date must be `YYYY-MM-DD`, time must be 24-hour `HH:mm`. Choose a future date/time.

Delete performs a cancellation: the record remains with status `CANCELLED`, so students can see appointment history.

### Doctor APIs — Doctor token required

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/doctor/appointments` | View own appointments |
| PATCH | `/api/doctor/appointments/:id/complete` | Complete appointment with comment |

Completion body:
```json
{"comment":"Patient reviewed. Follow-up advised after two weeks."}
```

Only the assigned doctor can complete the appointment. Only `BOOKED` appointments can be completed.

## 4. Postman Testing Flow

1. **Admin login** — `POST /api/auth/login`; save the token as `adminToken`.
2. **Add doctor** — `POST /api/admin/doctors` with `adminToken`; save doctor's MongoDB `_id`.
3. **Patient register** — `POST /api/auth/register`; save the token as `patientToken`.
4. **Patient views doctors** — `GET /api/patient/doctors`.
5. **Patient books** — `POST /api/patient/appointments`; send doctorId, future date and time. Save appointment `_id`.
6. **Patient views bookings** — `GET /api/patient/appointments`.
7. **Patient updates or cancels** — `PUT` or `DELETE /api/patient/appointments/:id`.
8. **Doctor login** — `POST /api/auth/login` using the doctor account created by Admin; save `doctorToken`.
9. **Doctor views appointments** — `GET /api/doctor/appointments`.
10. **Doctor completes** — `PATCH /api/doctor/appointments/:id/complete` with a comment.
11. **Admin manages users** — test list, update and delete endpoints.

For completion testing, create a second appointment and do not cancel it.

## 5. Important Test Cases

| Scenario | Expected |
|---|---|
| No token on a protected API | 401 |
| Patient calls Admin API | 403 |
| Doctor calls Patient booking API | 403 |
| Same doctor/date/time already booked | 409 |
| Patient tries another patient's appointment ID | 404 |
| Patient updates a completed appointment | 400 |
| Doctor completes another doctor's appointment | 404 |
| Doctor submits completion without comment | 400 |
| Duplicate patient email | 409 |

## 6. Folder Structure

```text
hospital-appointment-beginner/
├── src/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── appointmentController.js
│   │   └── doctorController.js
│   ├── middleware/auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Appointment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── patientRoutes.js
│   │   └── doctorRoutes.js
│   ├── app.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

## 7. Explain the Architecture to Students

```text
Postman / Angular
       |
       v
     Routes       Which URL is called?
       |
       v
  Middleware      Is user logged in? Which role?
       |
       v
  Controllers     What should happen?
       |
       v
    Models        MongoDB document structure
       |
       v
    MongoDB       Stores data
```

- **Routes:** Connect URL and HTTP method to a controller.
- **Middleware:** Checks JWT and user role before allowing access.
- **Controllers:** Contain the request handling and basic business logic.
- **Models:** Define the MongoDB document structure using Mongoose.

## 8. Suggested Teaching Order

1. Express server and MongoDB connection.
2. User model and patient registration.
3. Login, bcrypt password hashing and JWT.
4. `protect` and `allowRoles` middleware.
5. Admin CRUD for doctors.
6. Admin list/update/delete patients.
7. Patient doctor list and appointment booking.
8. Check available date/time and prevent duplicate bookings.
9. Patient update and cancel appointment.
10. Doctor appointment list and completion comments.
11. Test role access in Postman.

## 9. Simplifications / Limitations

- A slot is currently a date plus a start time, such as `10:30`.
- The same doctor cannot have two `BOOKED` appointments for the exact same date/time.
- There is no doctor-defined working-hours calendar or slot duration in this beginner version.
- Slot checking is a simple check-before-save. Production systems need atomic booking protection against simultaneous requests.
- Admin uses `.env` demo credentials; do not deploy this setup publicly.
- Deleting a doctor does not automatically delete old appointments. For a production system, use soft deletion and stronger relationship rules.
