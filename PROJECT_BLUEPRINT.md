# Interview Copilot

## Project Objective

Interview Copilot is a web application that helps students manage their placement preparation journey from a single platform. The system allows users to track DSA progress, manage company applications, organize study plans, and visualize preparation analytics through an interactive dashboard.


## Features

### Authentication

* User Signup
* User Login
* Logout
* Protected Routes

### DSA Tracker

* View Question Bank
* Search Questions
* Filter Questions
* Mark Solved
* Mark Revision Needed
* Add Personal Notes

### Placement Tracker

* Add Company Applications
* Update Application Status
* Delete Applications
* Track Placement Progress

### Study Planner

* Add Tasks
* Set Deadlines
* Set Priority Levels
* Mark Tasks Completed

### Dashboard

* DSA Statistics
* Placement Statistics
* Study Planner Statistics
* Progress Charts

---

## Pages

### Public Pages

* Landing Page
* Login Page
* Signup Page

### Private Pages

* Dashboard
* DSA Tracker
* Placement Tracker
* Study Planner
* Profile

---

## Database Collections

### Users

* name
* email
* password
* createdAt

### Questions

* title
* topic
* difficulty
* platform
* link

### UserProgress

* userId
* questionId
* status
* notes

### Applications

* userId
* company
* status
* appliedDate
* notes

### Tasks

* userId
* title
* deadline
* priority
* completed

---

## Tech Stack

### Frontend

* React
* React Router
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Authentication

* JWT
* bcrypt

## Database Collections

### Users
- name
- email
- password
- createdAt

### Questions
- title
- topic
- difficulty
- platform
- link

### UserProgress
- userId
- questionId
- status
- notes

### Applications
- userId
- company
- status
- appliedDate
- notes

### Tasks
- userId
- title
- deadline
- priority
- completed

## Future Enhancements

- Dark Mode
- Resume Upload
- Interview Experience Notes
- Company Preparation 

## API Endpoints

Authentication Module:

- Register User
POST /api/auth/register
Purpose: Create a new user account

- Login User
POST /api/auth/login
Purpose: Verify user and generate JWT token

- Get Current User
GET /api/auth/me
Purpose: Fetch logged in user details
Requires JWT.

DSA Tracker APIs:

- Get All Questions: GET /api/questions
- Search Questions: GET /api/questions/search
- Filter Questions: GET /api/questions/filter
- Update Question Status: PUT /api/progress/:questionId
- Add Notes: PUT /api/progress/notes/:questionId

Placement Tracker APIs:

- Add Company: POST /api/applications
- Get Companies: GET /api/applications
- Update Status: PUT /api/applications/:id
- Delete Application: DELETE /api/applications/:id

Study Planner APIs:

- Create Task: POST /api/tasks
- Get Tasks: GET /api/tasks
- Update Task: PUT /api/tasks/:id
- Delete Task: DELETE /api/tasks/:id

Dashboard APIs:

- Dashboard Statistics: GET /api/dashboard/stats
- Returns:
{
  "solvedQuestions": 120,
  "applications": 15,
  "completedTasks": 20
}

## Database Design For User

{
    name,
    email,
    password,
    createdAt
}