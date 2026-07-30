## Registration Flow

REGISTER

React/Postman

      │
      ▼

POST /api/auth/register

      │
      ▼

Express Server

      │
      ▼

authRoutes.js

      │
      ▼

registerUser()

      │
      ▼

Validate Request

      │
      ▼

Check Existing User

      │
      ▼

Hash Password (bcrypt)

      │
      ▼

Store in MongoDB

      │
      ▼

Generate JWT

      │
      ▼

Return Token


## Login Flow

React/Postman

      │
      ▼

POST /api/auth/login

      │
      ▼
      
Router

      │
      ▼

loginUser()

      │
      ▼

Validate Request

      │
      ▼

Find User by Email

      │
      ▼

Compare Password
(bcrypt.compare)

      │
      ▼

Generate JWT

      │
      ▼

Return Token

## Protected Route Flow

React

      │
      ▼

Authorization Header
Bearer eyJhbGc...

      │
      ▼

Express

      │
      ▼

Auth Middleware

      │
      ▼

Extract Token

      │
      ▼

jwt.verify()

      │
      ▼

Decode User ID

      │
      ▼

Find User in MongoDB

      │
      ▼

req.user = user

      │
      ▼

next()

      │
      ▼

Controller

      │
      ▼

req.user available


## Authentication flow 

Login

   │
   ▼

Backend verifies credentials

   │
   ▼

JWT generated

   │
   ▼

Frontend stores token

   │
   ▼

Navigate to Dashboard

   │
   ▼

Dashboard mounted

   │
   ▼

fetchNotes()

   │
   ▼

GET /api/notes

   │
   ▼

Authorization: Bearer <token>

   │
   ▼

Middleware verifies JWT

   │
   ▼

Controller fetches notes

   │
   ▼
   
Response returned