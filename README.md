# Patient Admission Management System

A web-based application for hospital staff to manage admitted patients.

## Technology Stack

- Frontend: React.js
- Backend: Java, Spring Boot
- Database: MySQL
- API: REST API

## Features

- Add new patients
- View all patients
- Search patients by name
- Filter by ward, department and doctor
- Edit patient details
- Delete patients with confirmation
- Mark patients as discharged
- Responsive user interface
- Frontend and backend validation

## Project Structure

- `frontend/` – React application
- `backend/` – Spring Boot application

## Run Locally

### Backend

1. Configure your MySQL database.
2. Set the `DB_PASSWORD` environment variable.
3. Open the backend folder.
4. Run:

```bash
./mvnw spring-boot:run
```

Backend runs on port 8085.

### Frontend

1. Open the frontend folder.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
VITE_API_URL=http://localhost:8085/api
```

4. Start the application:

```bash
npm run dev
```

Frontend runs on port 5173.

## Database

MySQL database: `patient_management_db`

## GitHub Repository

https://github.com/SaiAgalavi/PatientAdmissionManagement


