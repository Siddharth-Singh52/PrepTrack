## Why do we need middleware ?

The Biggest Problem

Suppose Login Response is

{
   "token":"eyJhbGc...."
}

React stores it.

Now user opens /api/notes
Question...

How does backend know This request belongs to Siddharth?

We generated the token.
We returned it.
But...
We never verified it anywhere.

Anyone can call POST /api/notes
Backend currently allows everyone.

This is the biggest security hole.

This is why Middleware exists.
Today's Lesson
Authentication Middleware 🔥

This is probably the most asked Express interview topic.

Before coding...

Let's understand Middleware first.

Imagine Airport

You enter airport.

First person

Security Guard

↓

Checks Ticket

↓

Allows Entry

↓

Then

Immigration Officer

↓

Checks Passport

↓

Allows Entry

↓

Finally

Boarding Gate

Every person checks something.


Notice something.

None of them is your destination.

They are stopping you

checking you

and then forwarding you.

Exactly like Middleware.

---

# Express Middleware

Suppose request comes.


React

↓

Request

↓

Middleware

↓

Controller

↓

Response


Middleware sits

**between**

Request

and

Controller.

---

# What will our Middleware do?

Whenever any request comes


Create Note

↓

Middleware

↓

Extract Token

↓

Verify Token

↓

Find User

↓

Attach User to Request

↓

Controller


Controller will automatically know

which user is logged in.

---

# Interview Question ⭐⭐⭐⭐⭐

**Interviewer**

Why don't we verify JWT inside every controller?

Excellent question.

Suppose project has


40 APIs

Create Note

Delete Note

Update Note

Resume

Interview

DSA

Analytics

Dashboard

...


If every controller has

jwt.verify()

User.findById()

...

Same code repeated

40 times.

Very bad.

Instead

Middleware.

This follows DRY Principle
(Don't Repeat Yourself)

## What does next() do in middleware ? 

Why do we have next()?

This is another interview favourite.

Suppose

Request

↓

Middleware

↓

Controller

How will middleware tell Express

"I'm done.
Now go to controller."

That's exactly what

next();

does.

Think of it as

Security Guard

↓

Everything OK

↓

"Go Ahead"

Go Ahead

=

next();

Without

next();

Request gets stuck forever.

Controller never executes.

## Jab React login karta hai to backend return karta hai:

{
   "token":"eyJhbGcOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Ab React is token ko store kar leta hai.

Question: Agli request me React token backend ko kaise bhejega?
Answer: HTTP Header me.

## Why is JWT sent in the Authorization Header instead of the request body?

Perfect Answer: The Authorization header is the standard HTTP mechanism for sending authentication credentials. It separates authentication information from the request body, allowing the same authentication method to work consistently across GET, POST, PUT, and DELETE requests.

## Why "Bearer"?

Tum notice karoge ki hum sirf token nahi bhejte.

Hum bhejte hain:

Authorization: Bearer eyJhbGcOiJIUz...

Question. Bearer kya hai?

Bearer simply means: "The person carrying this token is requesting access."

Ye HTTP authentication standard ka part hai.

## Let's understand this line
const authHeader = req.headers.authorization;

Question: req.headers kya hai?

Answer: Express request object ke andar saare HTTP headers hote hain.

Example request:

POST /api/notes

Authorization: Bearer abc123

Content-Type: application/json

User-Agent: PostmanRuntime

Express automatically convert karta hai:

req.headers into

{
   authorization: "Bearer abc123",
   content-type: "application/json",
   user-agent: "PostmanRuntime..."
}

Isliye

req.headers.authorization return karega Bearer abc123

## But middleware kab chalega?

Abhi tumne middleware bana diya.

Lekin Express ko kaise pata chalega ki is middleware ko kab run karna hai?

Ye bahut important concept hai.

Suppose humare paas future me ek Notes route hai.

router.post(
    "/notes",
    protect,
    createNote
);

Execution flow:

Request
   │
   ▼
protect Middleware
   │
   ▼
next()
   │
   ▼
createNote Controller

Notice.

Middleware automatically run hua.

Controller uske baad.

Isi wajah se middleware itna powerful hai.

## HTTP Request Structure

Har HTTP request ke teen major parts hote hain.

POST /api/notes

Headers
--------

Authorization : Bearer eyJhbGc...

Body
-----

{
   "title":"Arrays"
}

Notice.

Token body me nahi hai.

Token Header me hai.

## Interview Question ⭐⭐⭐⭐⭐

Why do we use startsWith("Bearer ")?

Perfect Answer:  It ensures that the Authorization header follows the standard Bearer token format before attempting to extract and verify the JWT. This prevents invalid or malformed authentication headers from being processed.

## This line:

token = req.headers.authorization.split(" ")[1];

Looks scary.

Actually it's very simple.

Suppose header is: Bearer eyJhbGc123ABC456

Now apply:  .split(" ")

Split means: Break the string wherever there is a space.

Result:

[
   "Bearer",
   "eyJhbGc123ABC456"
]

Index:
0 → Bearer
1 → eyJhbGc123ABC456

So split(" ")[1]

returns eyJhbGc123ABC456

Exactly the JWT we need.

visual flow:

Authorization Header

Bearer eyJhbGc123ABC

        │

split(" ")

        │

["Bearer", "eyJhbGc123ABC"]

        │

Index [1]

        │

eyJhbGc123ABC

Now token contains only the JWT.

## Suppose your JWT looks like this:

{
    "id":"686ab12c..."
}

Question: Why don't we simply trust this token?

Why do we again do User.findById(decoded.id)

instead of directly using decoded.id

Answer:

Imagine this situation.

Yesterday user logged in.

JWT generated.

ID

686ab12c

Today...

Admin deletes that user from MongoDB.

But...

JWT is still valid for

7 Days

If we never check the database,

deleted users can still access APIs.

❌ Very dangerous.

So every protected request does:

JWT

↓

Extract ID

↓

Find User Again

↓

User Exists?

↓

Continue

This is why production applications always fetch the user again.

## Flow of authentication middleware

Request
    │
    ▼
Read Header
    │
    ▼
Extract Token
    │
    ▼
Verify JWT
    │
    ▼
Extract User ID
    │
    ▼
Find User in MongoDB
    │
    ▼
Attach User to req.user
    │
    ▼
next()

## Internal working of how jwt.verify() works?

Token

↓

JWT Secret

↓

Verify Signature

↓

Signature Correct?

↓

YES

↓

Return Payload

## What does jwt.verify() return?

Perfect Answer: It verifies the token's signature and expiration. If the token is valid, it returns the decoded payload. If the token is invalid or expired, it throws an error.

## What does req.user = user does?

Before middleware

req

contains

{
   body,
   headers,
   params,
   query
}

After writing

req.user = user;

Request becomes

{
   body,
   headers,
   params,
   query,

   user:{
      _id:"...",
      name:"Siddharth",
      email:"..."
   }
}

Notice.

We attached logged-in user inside request.

Why?

Imagine

Create Note Controller:

Instead of doing

jwt.verify()

findById()

...

again

Controller simply writes:

req.user

That's it.

Everything is ready.

This is the entire reason middleware exists.

Do expensive work once.

Reuse everywhere.

Interview Question ⭐⭐⭐⭐⭐

Interviewer

## Why do we attach the user to req.user instead of sending it again to the frontend?

Perfect Answer:

Middleware authenticates the request once and attaches the authenticated user to the request object. Every controller handling that request can directly access req.user without repeating JWT verification or database queries.

## Why do we check if the user exists after jwt.verify()?

Perfect Answer: A valid JWT only proves that the token was issued by the server. It does not guarantee that the user still exists in the database. The account may have been deleted or deactivated after the token was issued, so we fetch the user again before allowing access.

## Interview Answer

If an interviewer asks:

Why do we send Authorization: Bearer <token>?

A good answer is:

"We send the JWT in the Authorization header using the Bearer scheme so the backend can verify the user's identity and authenticate the request. After successful verification, the backend knows which user is making the request and can return only that user's data."