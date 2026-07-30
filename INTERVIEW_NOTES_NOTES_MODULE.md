## How do we know which note belongs to which user?

We use MongoDB References.

MongoDB automatically gives every user_id

Example: 686ab12cd91...

This never changes.

So we'll store

{
    title:"Arrays",

    user:
    "686ab12cd91..."
}

This is called a Reference.

## Why we store uer_Id in notes module?

Three reasons.

1. Saves Storage

Instead of

Name

Email

Phone

Address

We save only ObjectId

2. Data Consistency

Suppose user changes

Name

Notes don't need updates.

3. Faster

Searching by

ObjectId is much faster than searching by strings like email or name.

## visualize it

Users Collection

┌──────────────────────────────┐
│ _id : 6861                   │
│ Name : Siddharth             │
└──────────────────────────────┘

           ▲
           │
           │
           │

Notes Collection

┌──────────────────────────────┐
│ Title : Arrays               │
│ user : 6861                  │
└──────────────────────────────┘

Instead of copying all user data, we only save User ID

## Why do we use ObjectId references instead of storing username or email?

Perfect Answer

MongoDB ObjectIds are unique, never change, require less storage, and maintain relationships between collections. If user information changes, we don't have to update every related document.

## What is the purpose of ref:"User"

Answer:

It tells Mongoose that this ObjectId references a document from the User collection. This allows us to use populate() later to retrieve the related user information.

## We'll build this API: POST /api/notes

Request Body:

{
    "title": "Arrays",
    "content": "Today I studied Kadane's Algorithm."
}

If the user is logged in:

{
    "message": "Note created successfully",
    "note": { ... }
}

If not logged in:

{
    "message": "Not authorized"
}

Notice:

We are not sending the user ID from the frontend.

This is a very important design decision.

## Interview Question ⭐⭐⭐⭐⭐

Suppose the frontend sends:

{
   "title":"Arrays",
   "content":"...",
   "user":"686ab12..."
}

Should we trust this?

❌ Never.

Why?

Because anyone can modify the request in Postman.

Someone could send:

{
   "title":"Hack",
   "content":"Hack",
   "user":"Rahul_User_ID"
}

Now Rahul's account gets someone else's note.

Huge security issue.

## visual flow of notes creation API goes?

Login API
     │
     ▼
Returns JWT
     │
     ▼
Copy JWT
     │
     ▼
Postman
Authorization
Bearer Token
     │
     ▼
Protected API
     │
     ▼
Middleware
     │
     ▼
Extract Token
     │
     ▼
jwt.verify()
     │
     ▼
req.user
     │
     ▼
Controller

## Why do we write [1] after split(" ") in the middleware?

"The Authorization header contains two values separated by a space: the word Bearer and the JWT. Calling split(' ') converts the string into an array, and index 1 contains the actual JWT token, which is then passed to jwt.verify()."

## Why don't we send the user ID from React?

Suppose I open Postman.

Instead of sending my ID,

I send:

{
   "user":"Rahul's_ID"
}

If the backend trusts this, I can create notes inside Rahul's account.

❌ Huge security problem.

Instead, the backend always does:

user: req.user._id

Now the client cannot fake ownership.

This is how real production applications work.

## Workflow of the creating notes

- Step 1: React sends a request

Imagine your React frontend has a "Create Note" page.

The user writes:

Title: DBMS Revision

Content: Today I studied Normalization.

When they click Save, React sends:

POST /api/notes
Authorization: Bearer eyJhbGc...

{
   "title":"DBMS Revision",
   "content":"Today I studied Normalization."
}

Notice something?

❌ React doesn't send the user ID.

Interview Question ⭐⭐⭐⭐⭐

Interviewer: Why doesn't the frontend send the user ID?

Answer: Because user identity should never be trusted from the client. Any user can modify the request in Postman and pretend to be another user. The backend extracts the user ID from the verified JWT, making it secure.

- Step 2: Request reaches the Protect Middleware

Your route looks like: router.post("/", protect, createNote);

Execution order:

Incoming Request

↓

protect()

↓

createNote()

Remember:

The controller does not execute first.

The middleware always executes first.

- Step 3: Middleware verifies JWT

Inside middleware:

jwt.verify(token, process.env.JWT_SECRET);

Suppose the JWT contains:

{
   "id":"686ab12..."
}

Now middleware fetches the user:

const user = await User.findById(decoded.id);

Then: req.user = user;

This line is extremely important.

After this,

req becomes something like:

req = {

   body: {
      title: "DBMS",
      content: "Normalization"
   },

   user: {

      _id: "686ab12...",

      name: "Siddharth",

      email: "siddharth@gmail.com"

   }

}
Interview Question ⭐⭐⭐⭐⭐

Why don't we store only req.user = decoded.id?

Answer: Because later controllers may need more than the ID.

For example:

req.user.name

or

req.user.email

If we stored only the ID,

every controller would have to query MongoDB again.

Fetching the user once in the middleware avoids repeated database queries.

- Step 4: Controller Starts

Now:

const { title, content } = req.body;

gives: 
title = "DBMS Revision"

content = "Today I studied Normalization."

Then: 
user: req.user._id

becomes 
user: "686ab12..."

So Mongoose actually receives:

await Note.create({

    title: "DBMS Revision",

    content: "Today I studied Normalization.",

    user: "686ab12..."

});

Notice that req.user._id is just replaced with the logged-in user's ID.

- Step 5: Mongoose Creates the Document

Your Note schema is:

{
    title,
    content,
    user
}

Mongoose validates:

Is title present? ✅
Is content present? ✅
Is user present? ✅
Is user an ObjectId? ✅

Everything is valid.

So it inserts:

{
   "_id":"...",
   "title":"DBMS Revision",
   "content":"Today I studied Normalization.",
   "user":"686ab12...",
   "createdAt":"...",
   "updatedAt":"..."
}

into the notes collection.

## GETNOTES Controller

- Step 1 - Create Controller Function

add:

const getNotes = async (req, res) => {

    const notes = await Note.find({
        user: req.user._id
    });

    res.status(200).json({
        notes
    });

};

Line 1
const notes = await Note.find({
Interview Question ⭐⭐⭐⭐⭐

Difference between

Note.find()

and

Note.findOne()
Answer

find()

Returns an array.

Example:

[
   {...},
   {...},
   {...}
]

findOne()

Returns one object.

Example:

{
   ...
}

Line 2
user: req.user._id

Suppose

req.user._id

is

A123

Then MongoDB internally executes:

Note.find({

    user: "A123"

});

MongoDB searches every note.

Whenever it finds:

user == A123

it returns that note.

Visual Representation
Notes Collection

Title         User
DSA           A123      ✅
React         A123      ✅
Java          B456      ❌
OS            B456      ❌
DBMS          A123      ✅

Result

↓

DSA
React
DBMS

Notice that Rahul's notes never come back.

- Step 2 - Route

Open

backend/routes/noteRoutes.js

Import:

const {
    createNote,
    getNotes
} = require("../controllers/noteController");

Now add:

router.get("/", protect, getNotes);

Your file should look like:

router.post("/", protect, createNote);

router.get("/", protect, getNotes);
🧠 Why Same URL?

Some beginners get confused here.

We have

POST /api/notes

and

GET /api/notes

Same URL.

Different methods.

Express understands:

GET

↓

getNotes()
POST

↓

createNote()

The HTTP method decides which controller runs.

Interview Question ⭐⭐⭐⭐⭐

Can we have

router.get("/")

and

router.post("/")

together?

Answer

Yes.

Because Express matches both URL and HTTP method.

So there is no conflict.

🚀 Step 3 - Test in Postman

Method:

GET

URL

http://localhost:5000/api/notes

Authorization

Bearer Token

Paste your JWT.

No Body required.

Click Send.

Expected response:

{
    "notes": [
        {
            "_id": "...",
            "title": "DSA Revision",
            "content": "Kadane Algorithm",
            "user": "...",
            "createdAt": "...",
            "updatedAt": "..."
        },
        {
            "_id": "...",
            "title": "React",
            "content": "Hooks",
            "user": "...",
            "createdAt": "...",
            "updatedAt": "..."
        }
    ]
}

## Single notes API

API Design

Method:
GET

URL:
/api/notes/:id

Example:
GET /api/notes/6870ab123456789

Notice the :id.

This is called a Route Parameter.

## What is the difference between:

req.body
req.params
req.query

We'll understand one by one.

1️⃣ req.body

Used when data comes inside the request body.

Example:

POST /api/notes

Body

{
    "title":"React",
    "content":"Hooks"
}

Backend:

const { title, content } = req.body;

2️⃣ req.params

Used when data is part of the URL.

Example:

GET /api/notes/6870ab123

Backend route:

router.get("/:id", protect, getSingleNote);

Then

req.params.id becomes 6870ab123

3️⃣ req.query

Used for filtering/searching.

Example:

GET /api/notes?search=React

Backend:

req.query.search

returns

React

We'll use req.query later when we build Search Notes.

## How do you make sure one user cannot access another user's note?

You can answer:

"After verifying the JWT, the middleware stores the logged-in user's details in req.user. When a note is requested, I fetch it using its ID and compare the note's owner (note.user) with the logged-in user's ID (req.user._id). If both IDs match, I return the note; otherwise, I return a 403 Forbidden response."

## how to solve the security problem of matching notes and user ?

✅ Approach A (What we discussed first)

const note = await Note.findById(req.params.id);

if (!note) {
    return res.status(404).json({
        message: "Note not found"
    });
}

if (note.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
        message: "Access denied"
    });
}

res.json(note);

Workflow:

Find Note

↓

Note Found?

↓

Yes

↓

Compare Owner

↓

Same User?

↓

Yes → Return Note

No → 403 Forbidden

Works perfectly.

✅ Approach B

Now look at this:

const note = await Note.findOne({
    _id: req.params.id,
    user: req.user._id
});

Let's imagine Rahul logs in.

Middleware already gives us: req.user._id = Rahul_ID

Rahul requests: GET /api/notes/Note101

MongoDB receives:

Note.findOne({

    _id: "Note101",

    user: "Rahul_ID"

});

Now MongoDB asks two questions at the same time.

- Condition 1

Is there a note whose ID is

Note101

AND

- Condition 2

Is that note owned by

Rahul_ID

If both are true

↓

Return note.

If either one is false

↓

Return null.

- Example 1

Database

Note ID	Owner
101	Rahul

Request

Note.findOne({

   _id:101,

   user:Rahul

});

MongoDB:

ID matches?

YES

Owner matches?

YES

↓

Return Note

- Example 2

Database

Note ID	Owner
101	Siddharth

Rahul requests

Note.findOne({

   _id:101,

   user:Rahul

});

MongoDB:

ID matches?

YES

Owner matches?

NO

↓

Return NULL

Notice something amazing?

MongoDB itself rejects the request.

We don't even need to compare:

note.user == req.user._id

because the query already did it.

Approach A

Database

↓

Find Note

↓

Controller

↓

Compare User

↓

Allow / Deny

Approach B

Database

↓

Find Note

AND

Owner

↓

Already Filtered

↓

Controller

Approach B pushes the filtering work into MongoDB itself.

## Why do we use .toString()?

This is one of the most common MongoDB interview questions.

Suppose MongoDB stores

note.user

Internally it looks like

ObjectId("686ab12cd91...")

It is not a normal JavaScript string.

Now compare

note.user === req.user._id

Even if both contain the same ID,

JavaScript says

false

because

ObjectId

≠

String/ObjectId instance

or they are different object instances.

Example

Imagine:

const a = "123";
const b = "123";
a === b

returns

true

Now imagine

const a = ObjectId("123");
const b = ObjectId("123");

Even though both represent the same database ID,

they are objects.

So direct comparison is unreliable.

Solution

Convert both to strings.

note.user.toString()

becomes

"686ab12..."

and

req.user._id.toString()

becomes "686ab12..."

Now

=== 

returns true

Visual Flow

ObjectId

↓

toString()

↓

"686ab12..."

↓

Compare

↓

true

## Why do we use .toString()

while comparing MongoDB IDs?

Perfect Answer

MongoDB stores document IDs as ObjectIds, not plain strings. Two ObjectId objects cannot be reliably compared using ===, even if they represent the same value. Converting them to strings allows a proper value comparison.

## Authentication vs Authorization

This is one of the favorite interview questions.

Authentication

Question:

Who are you?

Example:

JWT Verification

Result: You are Siddharth.

Authorization

Question: Are you allowed to access this resource?

Example: This note belongs to Rahul.

You are Siddharth.

↓

Access Denied

Interview Answer

Authentication verifies the identity of the user using JWT.

Authorization checks whether the authenticated user has permission to access or modify a particular resource.

## Why do we write

title || note.title

instead of

note.title = title;

Suppose request body is

{
   "title":"New Title"
}

Notice

There is no content.

If we write

note.content = content;

Then

content

is

undefined

Database becomes

Content = undefined

😨 Bad.

Instead

note.content = content || note.content;

means

If

content

exists

↓

Use new value.

Otherwise

↓

Keep old value.

Example

Current database

Title

DSA

Content

Kadane

Request

{
   "title":"Advanced DSA"
}

Execution

note.title = title || note.title;

↓

Advanced DSA

Execution

note.content = content || note.content;

↓

Since content doesn't exist

↓

Keep

Kadane

Final document:

Title

Advanced DSA

Content

Kadane

Interview Answer: This allows partial updates. If the client does not send a new value, we keep the existing value instead of replacing it with undefined.

## Delete Note 

Workflow

DELETE /api/notes/:id

↓

Authentication

↓

Find Note

↓

404 if not found

↓

Authorization

↓

403 if owner doesn't match

↓

Delete Note

↓

200 Success

Notice something?

Almost 80% of this code is exactly the same as Update Note.

This is why backend development becomes fast after you've built one secure CRUD API.

## Interview question: Why do we use note.deleteOne() instead of Note.findByIdAndDelete() ?

Answer

Since we have already fetched the document to perform existence and authorization checks, using deleteOne() on the existing document avoids another database query and keeps the code cleaner.

## Question

How does Express know which controller to execute? Why doesn't it get confused?

Placement-Level Answer ⭐⭐⭐⭐⭐

Express identifies the correct route using both the HTTP method and the URL path. Even if multiple routes have the same path, Express checks the request method (GET, POST, PUT, DELETE) and then executes the matching route handler.

## Let's Understand Internally

Suppose our routes are:

router.get("/:id", protect, getSingleNote);

router.put("/:id", protect, updateNote);

router.delete("/:id", protect, deleteNote);

Now the client sends: GET /api/notes/123

Express internally checks:

GET /:id        ✅ Match

PUT /:id        ❌ Ignore

DELETE /:id     ❌ Ignore

So it executes: getSingleNote()

Now suppose request is PUT /api/notes/123

Express checks:

GET /:id        ❌ Ignore

PUT /:id        ✅ Match

DELETE /:id     ❌ Ignore

Runs updateNote()

Now suppose DELETE /api/notes/123

Express checks

GET /:id        ❌

PUT /:id        ❌

DELETE /:id     ✅

Runs deleteNote()

Internal Flow

Incoming Request

↓

URL
/api/notes/123

↓

HTTP Method
PUT

↓

Express Router

↓

Find Matching URL

↓

Find Matching Method

↓

Run Middleware

↓

Run Controller

## ⭐⭐⭐⭐⭐ Interview Question

Interviewer

Can two routes have exactly the same URL?

Example

router.get("/notes");

router.post("/notes");
Perfect Answer

Yes. Express matches routes using both the URL path and the HTTP method. Since the methods are different, there is no conflict.

## One More Question (Very Common)

Suppose we have

router.get("/:id", getSingleNote);

router.get("/profile", getProfile);

Now request comes

GET /profile

Which controller should run?

Think carefully.

Many beginners answer

getProfile()

But...

If

router.get("/:id")

is written before

router.get("/profile")

Express treats

profile

as

:id

and executes getSingleNote()

## ⭐⭐⭐⭐⭐ Interview Question

Does the order of routes matter in Express?

Perfect Answer

Yes. Express matches routes in the order they are defined. It executes the first matching route, so specific routes should be declared before dynamic routes like /:id.

This is a very common interview question, and many candidates get it wrong.

## first tell me that how we check if a user is authorized from the token we have retrieved from auth header

- Step 1: User Logs In

Suppose the user enters:

Email: siddharth@gmail.com
Password: 123456

Backend checks:

bcrypt.compare(password, user.password)

If the password is correct:

✅ Login successful.

- Step 2: Backend Creates a JWT

The backend executes something like:

const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
);

Let's say:

user._id = 6879abc123

Then the payload becomes:

{
    "id": "6879abc123"
}

JWT combines:

Payload
Secret Key

and generates something like:

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

This is your token.

Backend sends:

{
    "token": "eyJhbGc..."
}

- Step 3: Frontend Stores It

React receives:

response.data.token

and stores it:

localStorage.setItem("token", response.data.token);

- Step 4: User Requests Notes

Now React sends:

GET /api/notes

Authorization: Bearer eyJhbGc...

This request reaches Express.

- Step 5: Middleware Runs First

Remember our middleware?

Something like:

const protect = async (req, res, next) => {

    const authHeader = req.headers.authorization;

}

Now

authHeader

contains:

Bearer eyJhbGc...

- Step 6: Extract the Token

const token = authHeader.split(" ")[1];

So

Bearer abc123

becomes

[
   "Bearer",
   "abc123"
]

and

token

is

abc123

- Step 7: Verify the Token

This is the important line.

const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET
);

Now think about something.

When we created the token, we used:

jwt.sign(payload, JWT_SECRET)

Now while checking it,

we again use

jwt.verify(token, JWT_SECRET)

Why the same secret?

Because the token was signed using that secret.

If someone changes even one character in the token, the signature will no longer match.

jwt.verify() will throw an error.

So:

Valid token
Token

+

Correct Secret

↓

Verification Success
Invalid token
Modified Token

+

Correct Secret

↓

Verification Failed

- Step 8: What does verify return?

Suppose while creating the token we stored:

{
    id: "6879abc123"
}

Then

const decoded = jwt.verify(...);

returns:

{
    id: "6879abc123",
    iat: ...,
    exp: ...
}

Notice something.

We got the user's id back.

- Step 9: Find the User

Now backend does:

const user = await User.findById(decoded.id);

Now it has the complete user document.

Example:

{
    _id: "6879abc123",
    name: "Siddharth",
    email: "abc@gmail.com"
}
Step 10: Attach User to Request

Then we do:

req.user = user;

Now every controller can access:

req.user

So in your notes controller:

Note.find({
    user: req.user._id
});

Only that user's notes are returned.

Complete Flow

Login

↓

Password Verified

↓

JWT Created

↓

Frontend Stores JWT

↓

GET /notes

↓

Authorization Header

↓

Middleware

↓

Extract Token

↓

jwt.verify()

↓

decoded.id

↓

Find User

↓

req.user

↓

Controller

↓

Return Only That User's Notes