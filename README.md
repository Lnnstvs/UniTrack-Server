# UniTrack: Campus Event & Attendance Management System


## Project overview
UniTrack is a web-based campus event and attendance management system for campus organizers. It centralizes student records, event planning, venue and category management, registrations, attendance, and dashboard/statistics. Campus records are shared across signed-in accounts, while each account has its own login and profile.

## Group information
- Course / Section: ITE402
- Instructor: Lemuel June D. Bautista
- Group members: Leanna Francine G. Stevenson, Justin Gabrielle B. Sarmiento
- Final repository: [\[Insert GitHub URL\]](https://github.com/Lnnstvs/UniTrack)
- Client repository (if separate): [[Insert URL](https://github.com/Lnnstvs/UniTrack-Client)]
- Server repository (if separate): [\[Insert URL\]](https://github.com/Lnnstvs/UniTrack-Server)

## Features
- Register and log in; display the current user's profile; log out.
- Dashboard totals based on saved campus data.
- Student create/list/search/filter/status update/delete (verify available actions).
- Event create/list/search/filter/sort, event details/edit, schedule, venue, category, capacity, and status.
- Venue and category management.
- Student event registration with Pending, Confirmed, and Cancelled statuses.
- Attendance tracking for confirmed registrations using Present/Absent.
- Statistics grouped by status.
- Shared campus records across accounts.
- API validation and error handling where implemented.


## Screenshots
- `[Login]"C:\Users\leann\OneDrive\Pictures\Screenshots 1\Screenshot 2026-10-10 104312.png"`
- `[Dashboard]"C:\Users\leann\OneDrive\Pictures\Screenshots 1\Screenshot 2026-10-10 104327.png"`
- `[Students]"C:\Users\leann\OneDrive\Pictures\Screenshots 1\Screenshot 2026-10-10 104520.png"`
- `[Events]"C:\Users\leann\OneDrive\Pictures\Screenshots 1\Screenshot 2026-10-10 104337.png"`
- `[Registrations]"C:\Users\leann\OneDrive\Pictures\Screenshots 1\Screenshot 2026-10-10 104438.png"`
- `[Attendance]"C:\Users\leann\OneDrive\Pictures\Screenshots 1\Screenshot 2026-10-10 104501.png"`
- `[Statistics]"C:\Users\leann\OneDrive\Pictures\Screenshots 1\Screenshot 2026-10-10 104606.png"`
- `[Profile]"C:\Users\leann\OneDrive\Pictures\Screenshots 1\Screenshot 2026-10-10 104614.png"`



## Technology stack
**Client:** React, TypeScript, Vite, React Router, Axios, Tailwind CSS, React Hook Form/Zod where used.
**Server:** Node.js, Express, TypeScript, Mongoose, JWT, bcryptjs, dotenv.
**Database:** MongoDB Atlas.

## Project structure
```text
UniTrack/
├── client/   # React frontend: src/pages, components, routes, services
├── server/   # Express backend: src/config, controllers, middleware, models, routes
├── docs/
│   └── screenshots/
├── README.md
└── .gitignore
```
Adjust this tree to match the actual final repository.

## Setup instructions
Requirements: Node.js/npm, Git, MongoDB Atlas or compatible MongoDB, and a modern browser.

### Server
```bash
cd server
npm install
```
Copy `.env.example` to `.env` and set local values:
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
```
Run `npm run dev`. Confirm the terminal shows a successful database connection.

### Client
```bash
cd client
npm install
npm run dev
```
Confirm `src/services/api.ts` points to the backend, typically `http://localhost:8000/api`. Open the Vite URL shown in the terminal, commonly `http://localhost:5173`.

### Build checks
Run `npm run build` inside both `server/` and `client/` before submitting.

## Environment variables
| Variable | Purpose |
|---|---|
| `PORT` | Express server port, commonly `8000` |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign/verify JWTs; keep private |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `1d` |
| `VITE_API_BASE_URL` | Only if implemented; otherwise API base URL may be set in `src/services/api.ts` |

Remove variables not used by the actual code. Never commit `.env` or real secrets.

## Database collections and relationships
| Model/collection | Purpose / relationship |
|---|---|
| User | Account name, email, password hash, status; used by authentication |
| Student | Student details and status; referenced by registrations and attendance |
| Venue | Venue name, location, capacity, availability; referenced by events |
| Category | Category name and description; referenced by events |
| Event | Schedule, venue, category, capacity, status |
| Registration | Connects a student to an event and records registration status |
| Attendance | Connects attendance status to a registration, student, and event |

Typical workflow: create student and event → register student → confirm registration → record attendance.

## API documentation
**Important:** The route list below follows the current project design notes. Compare it with `server/src/routes/` and adjust before final submission. Sample responses are illustrative and may need field/wrapper changes to match actual controller responses.

| Method | Endpoint | Purpose | Sample request | Sample response (illustrative) |
|---|---|---|---|---|
| POST | `/api/auth/register` | Create account | `{"name":"Jordan Lee","email":"jordan@example.com","password":"ExamplePass123!"}` | `{"success":true,"token":"<JWT>","user":{"id":"<id>","name":"Jordan Lee","email":"jordan@example.com"}}` |
| POST | `/api/auth/login` | Log in | `{"email":"jordan@example.com","password":"ExamplePass123!"}` | `{"success":true,"token":"<JWT>","user":{"id":"<id>","name":"Jordan Lee","email":"jordan@example.com"}}` |
| GET | `/api/auth/me` | Current user (protected) | `Authorization: Bearer <JWT>` | `{"success":true,"user":{"id":"<id>","name":"Jordan Lee","email":"jordan@example.com"}}` |
| GET | `/api/students` | List/search/filter students | `?search=Jordan&status=Active&sort=name` | `{"success":true,"data":[{"_id":"<id>","name":"Jordan Lee","status":"Active"}]}` |
| POST | `/api/students` | Create student | `{"name":"Jordan Lee","studentId":"2026-0001","email":"jordan.student@example.com","course":"BSIT","yearLevel":2}` | `{"success":true,"data":{"_id":"<id>","name":"Jordan Lee","status":"Active"}}` |
| PATCH | `/api/students/:id/status` | Change student status | `{"status":"Inactive"}` | `{"success":true,"data":{"_id":"<id>","status":"Inactive"}}` |
| DELETE | `/api/students/:id` | Delete student | No body; ID in URL | `{"success":true,"message":"Student deleted successfully."}` |
| GET | `/api/venues` | List venues | — | `{"success":true,"data":[{"_id":"<id>","name":"University Auditorium"}]}` |
| POST | `/api/venues` | Create venue | `{"name":"University Auditorium","location":"Main Building","capacity":300}` | `{"success":true,"data":{"_id":"<id>","name":"University Auditorium"}}` |
| PATCH | `/api/venues/:id` | Update venue | `{"name":"Auditorium A","location":"Main Building","capacity":280,"status":"Available"}` | `{"success":true,"data":{"_id":"<id>","name":"Auditorium A"}}` |
| DELETE | `/api/venues/:id` | Delete venue | No body; ID in URL | `{"success":true,"message":"Venue deleted successfully."}` |
| GET | `/api/categories` | List categories | — | `{"success":true,"data":[{"_id":"<id>","name":"Academic Seminar"}]}` |
| POST | `/api/categories` | Create category | `{"name":"Academic Seminar","description":"Academic talks"}` | `{"success":true,"data":{"_id":"<id>","name":"Academic Seminar"}}` |
| PATCH | `/api/categories/:id` | Update category | `{"name":"Technical Workshop","description":"IT sessions"}` | `{"success":true,"data":{"_id":"<id>","name":"Technical Workshop"}}` |
| DELETE | `/api/categories/:id` | Delete category | No body; ID in URL | `{"success":true,"message":"Category deleted successfully."}` |
| GET | `/api/events` | List/search/filter/sort events | `?status=Upcoming&sort=date` | `{"success":true,"data":[{"_id":"<id>","title":"Web Workshop","registeredCount":5,"availableSlots":35}]}` |
| GET | `/api/events/:id` | Event details | No body; ID in URL | `{"success":true,"data":{"_id":"<id>","title":"Web Workshop"}}` |
| POST | `/api/events` | Create event | `{"title":"Web Workshop","description":"Intro workshop","date":"2026-11-05","startTime":"09:00","endTime":"12:00","venueId":"<venueId>","categoryId":"<categoryId>","capacity":40}` | `{"success":true,"data":{"_id":"<id>","title":"Web Workshop","status":"Upcoming"}}` |
| PATCH | `/api/events/:id` | Update event | `{"title":"Updated Web Workshop","capacity":45}` | `{"success":true,"data":{"_id":"<id>","title":"Updated Web Workshop"}}` |
| PATCH | `/api/events/:id/status` | Update event status | `{"status":"Ongoing"}` | `{"success":true,"data":{"_id":"<id>","status":"Ongoing"}}` |
| DELETE | `/api/events/:id` | Delete event | No body; ID in URL | `{"success":true,"message":"Event deleted successfully."}` |
| GET | `/api/registrations` | List registrations | — | `{"success":true,"data":[{"_id":"<id>","status":"Pending"}]}` |
| POST | `/api/registrations` | Register student for event | `{"studentId":"<studentId>","eventId":"<eventId>"}` | `{"success":true,"data":{"_id":"<id>","status":"Pending"}}` |
| PATCH | `/api/registrations/:id/confirm` | Confirm registration | No body | `{"success":true,"data":{"_id":"<id>","status":"Confirmed"}}` |
| PATCH | `/api/registrations/:id/cancel` | Cancel registration | No body | `{"success":true,"data":{"_id":"<id>","status":"Cancelled"}}` |
| DELETE | `/api/registrations/:id` | Delete registration | No body; ID in URL | `{"success":true,"message":"Registration deleted successfully."}` |
| GET | `/api/attendance` | List attendance | — | `{"success":true,"data":[{"_id":"<id>","status":"Present"}]}` |
| POST | `/api/attendance` | Record attendance for confirmed registration | `{"registrationId":"<registrationId>","status":"Present"}` | `{"success":true,"data":{"_id":"<id>","status":"Present"}}` |
| PATCH | `/api/attendance/:id` | Update attendance status | `{"status":"Absent"}` | `{"success":true,"data":{"_id":"<id>","status":"Absent"}}` |
| DELETE | `/api/attendance/:id` | Delete attendance | No body; ID in URL | `{"success":true,"message":"Attendance deleted successfully."}` |
| GET | `/api/dashboard/stats` | Dashboard totals | — | `{"success":true,"data":{"students":10,"events":3,"registrations":8,"attendance":4}}` |
| GET | `/api/statistics` | Counts grouped by status | — | `{"success":true,"data":{"studentsByStatus":[],"eventsByStatus":[],"registrationsByStatus":[],"attendanceByStatus":[]}}` |

### Validation and error handling
Expected patterns to verify against the actual code:
- `400` for invalid/missing fields.
- `401` for missing or invalid authentication token.
- `404` for a missing record.
- `409` for duplicate values or conflicts.
- `500` for unexpected server errors.

Do not claim a status code unless it matches the actual API. Check duplicate registration, event capacity, inactive-student registration, and attendance restrictions.

## Testing and known limitations
Record actual test outcomes in `Testing_Results.docx`; do not claim unrun tests passed. Before submission, verify:
- all endpoint paths and response shapes;
- create/read/update/delete actions on each applicable page;
- authentication and protected API routes;
- registration uniqueness and capacity behavior;
- no orphaned references after deletion;
- responsive layout, loading/error/empty states;
- actual screenshots and repository links.

## Security and submission hygiene
- Do not commit `.env`, MongoDB credentials, or JWT secrets.
- Store password hashes, not plain-text passwords.
- Add the instructor to the repository or make it accessible as required.
- Use fictional sample student data in screenshots and demos.
