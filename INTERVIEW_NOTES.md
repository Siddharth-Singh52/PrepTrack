# Authentication Notes

## What is JWT?

JWT (JSON Web Token) is used for user authentication and authorization. It allows the backend to identify the logged-in user without storing session information.

## What is bcrypt?

bcrypt is used to hash passwords before storing them in the database.

## Authentication Flow

Signup
→ Hash Password
→ Store User

Login
→ Verify Password
→ Generate JWT

Protected Route
→ Verify JWT
→ Allow Access

## User Schema

name
email
password
createdAt

## Libraries installed

1. Express:

Purpose:
- Create Backend Server
- Create APIs
- Handle Requests

Without Express: No Backend
Example: app.get("/login") comes from Express.

2. Mongoose:

- Purpose: Node.js ↔ MongoDB
- Think:
Frontend
    ↓
Backend
    ↓
Mongoose
    ↓
MongoDB

Without mongoose: You can't easily communicate with MongoDB.

3. bcryptjs:

- Purpose: Hash Passwords
- Example:
User enters: siddharth123
Database stores: $2a$10$xjKs.... instead.
This improves security.

4. jsonwebtoken

- Purpose: Generate JWT Tokens
- Example: After login:
User Verified
     ↓
JWT Created
     ↓
Token Sent

This keeps users logged in.

5. dotenv:

- Purpose: Store secret information.
- Example: Instead of: const secret = "abcd1234";
we store it in: JWT_SECRET=abcd1234 inside .env. Much safer.

6. cors:

- Purpose: Allow React frontend to talk to backend.

- Without CORS:
Frontend (3000)
Backend (5000)
Blocked

Browser security prevents communication.
CORS fixes that.

## Command : npm install nodemon --save-dev

- Problem without nodemon

Suppose: console.log("Hello");

You run: node server.js
Now you modify code: console.log("Hello Siddharth");
You must stop and restart server manually.


- Solution: nodemon

Automatically restarts server whenever file changes.
Example: nodemon server.js
Modify file.
Save.
Server restarts automatically.

## package.json vs package-lock.json

- package.json

Stores:
Project information
Dependencies
Scripts

- package-lock.json

Stores:
Exact installed versions
Dependency tree

## What is an API?

An API is an interface that enables communication between two software systems. In my Interview Copilot project, the React frontend sends HTTP requests to Express APIs, which process the request, interact with MongoDB through Mongoose models, and return a JSON response.

React

↓

API

↓

Express

↓

Controller

↓

Model

↓

MongoDB

## Why can't React connect directly to MongoDB?

Imagine if React directly connected to MongoDB. Anyone could open Chrome DevTools. See your MongoDB connection string.

Database password.
Delete users.
Add fake users.
Entire database compromised.

This is why: The frontend should NEVER communicate directly with the database.

## HTTP Methods

1. GET

- Meaning: Give me data.
- Example: Instagram.
Open Profile.

React says: 
Give me Siddharth's profile. 
Backend sends data.
Nothing changes in database.
Only reading.

Our project examples:
Get Profile
Get Interview Questions
Get Notes

2. POST

- Meaning: Create something new.
- Example: Register.
A new user is being created.

So: POST /register

Examples:
Register User
Create Note
Create Interview
Upload Resume

3. PUT

- Meaning: Replace or update existing data.
- Example: User changes:

College

↓

DIT

New value:

DIT Delhi

Backend updates database.

- Examples:
Update Profile
Update Resume
Update Notes

4. DELETE

- Meaning: Remove data.
- Example:
Delete account.
Delete note.
Delete interview.

## HTTP Status Codes

Every response also sends a status code.

Think of it as the backend saying:
"Operation successful." or "Something went wrong."

- 200 OK : Everything worked.
Example: Profile Loaded

- 201 Created: New resource created.
Example: User Registered. This is what we'll return after successful registration.

- 400 Bad Request: Client sent invalid data.
Example: Password too short, Email missing.

- 401 Unauthorized: User is not logged in.
Example: Accessing Dashboard without JWT.

- 404 Not Found: Example: Wrong URL. /api/xyz doesn't exist.

- 500 Internal Server Error: Backend crashed. Maybe database issue. Maybe coding mistake.

## What is route?

The Route is the first thing inside Express that receives the request.

Route's job is ONLY this:

Incoming Request

↓

Check URL

↓

Send to Correct Controller

It doesn't talk to the database.
It doesn't validate passwords.
It doesn't generate JWT.

It simply forwards the request.

Our Route will look like: router.post("/register", registerUser);

## what is a Controller?

Controller is the brain. Everything important happens here.

Example: Registration.

Controller will:

✅ Read user data

↓

✅ Check if email already exists

↓

✅ Hash password

↓

✅ Save user

↓

✅ Generate JWT

↓

✅ Send response

## Difference between Route and Controller?

The Route maps an incoming HTTP request to the appropriate controller function. The Controller contains the business logic required to process that request.

## What is req?

Full Form: Request

It contains EVERYTHING the client sent.
Think of it as a parcel.

Frontend

↓

Parcel

↓

Express

Inside parcel:

Body

Headers

Parameters

Query

Cookies

Everything is inside req.

## req.body

This is the most commonly used property.

Example:

Frontend sends:

{
   "name":"Siddharth",
   "email":"sid@gmail.com",
   "password":"123456"
}

Backend reads:

req.body

Result:

{
   name:"Siddharth",
   email:"sid@gmail.com",
   password:"123456"
}

req.body is simply the JSON sent by the frontend.

## What is res?

Full Form: Response

After backend finishes processing, How will it reply? Using res

Example: res.send("Success")

or

res.json({
   success:true
})

## How does we go to correct router like authroutes, notesroutes, interviewroutes, etc when API request comes? 

server.js decides the router.

Our backend is exactly like this.
React

↓

server.js

↓

Correct Router

↓

Controller

↓

Model

↓

MongoDB

## How does server.js know?

This is where we'll write something like this (don't type yet):

- app.use("/api/auth", authRoutes);
- app.use("/api/notes", noteRoutes);
- app.use("/api/interviews", interviewRoutes);

Let's understand this.

app.use("/api/auth", authRoutes);
means "Whenever a request starts with /api/auth, send it to authRoutes."

app.use("/api/notes", noteRoutes);
means "Whenever a request starts with /api/notes, send it to noteRoutes."

app.use("/api/interviews", interviewRoutes);
means "Whenever request starts with /api/interviews, send it to interviewRoutes."

## Complete flow of the how API goes 

Suppose React sends

POST /api/auth/register

- Step 1

React
↓
Express Server
↓
server.js

- Step 2

server.js checks /api/auth/register

Question: Does it start with /api/auth
Yes.
↓
Send request to authRoutes.js

- Step 3

Now authRoutes says
Remaining path
↓
/register

Question: Do I have router.post("/register") ?
Yes.
↓
Call registerUser()

- Step 4

Controller
↓
Model
↓
MongoDB


## Why do we pass registerUser instead of registerUser() in authroutes.js?

Answer: We pass the function reference because Express should execute it only when a matching request arrives. If 
we use registerUser(), the function executes immediately during server startup.

## Why do we use express.json() in server.js?

A strong answer would be: "express.json() is a built-in Express middleware that parses incoming JSON request 
bodies and converts them into JavaScript objects, making them available in req.body. Without it, req.body would be 
undefined for JSON requests."

## When React sends data, where does Express store it?

Answer: Inside the req.body object.

Imagine this:

React sends

{
    "name": "Siddharth",
    "email": "abc@gmail.com",
    "password": "123456"
}

When Express receives it, it automatically creates.
Express says: "Whenever you receive JSON, convert it into a JavaScript object and put it inside req.body."

req.body = {
    name: "Siddharth",
    email: "abc@gmail.com",
    password: "123456"
}

So req.body is simply an object containing the data sent by the client.

## Q1. What is object destructuring?
## Q2. Why do we use destructuring instead of req.body.name?
## Q3. Why do we validate data on the backend even if the frontend already validates it?
## Q4. Why do we write return res.status(...).json(...) instead of just res.status(...).json(...)?

## Why do we check whether the email already exists even though unique: true is already written in the schema?

Remember our User Schema?

email: {
    type: String,
    unique: true
}

Many beginners think this is enough. Actually, unique: true does NOT validate anything inside Mongoose.

It simply tells MongoDB: Create a unique index on this field.

Now suppose we don't check manually. A duplicate email comes. MongoDB will reject it and throw a huge database 
error.

Instead, we check ourselves first.

User sends request
        ↓
Backend checks email
        ↓
Email exists?
      /     \
    Yes      No
    ↓         ↓
Send Error   Save User

This gives a much cleaner user experience.

## Why are we using findOne() instead of find()?

Suppose our collection contains

Users Collection
-----------------------
Siddharth
Rahul
Aman
Priya
-----------------------

- find() returns

[
   {...},
   {...},
   {...}
]

Always an array. Even if there is only one result.

- findOne() returns

{
   ...
}

Only one object.

If nothing is found null

Since email is unique, we only need one document.

## Destructuring vs Object property shorthand

- OBJECT PROPERTY SHORTHAND

Why we write: User.findOne({ email })

Why not: 
User.findOne(email)
or
User.findOne({ email: email })

This is called Object Property Shorthand.

Normally we write, const email = "abc@gmail.com";

User.findOne({
    email: email
});

Since the key name and the variable name are both email, JavaScript allows us to shorten it to:

User.findOne({
    email
});

Behind the scenes, JavaScript converts it to:

{
    email: email
}

This feature is called Object Property Shorthand.

- DESTRUCTURING:

const { name, email, password } = req.body;

which is equivalent to:

const name = req.body.name;
const email = req.body.email;
const password = req.body.password;

So remember:

✅ const { name } = req.body → Object Destructuring
✅ { email } → Object Property Shorthand

## Why is timestamps: true written outside the schema fields in user.js?

"timestamps is not a field that the user sends. It's a schema option that tells Mongoose to automatically maintain
createdAt and updatedAt for every document. That's why it is passed as the second argument to mongoose.Schema()
instead of being defined as a document field."

## What does User.create()

User.create()
      │
      ▼
Model
      │
      ▼
Schema Validation
      │
      ▼
MongoDB
      │
      ▼
Document Saved
      │
      ▼
Return Saved Document

Ye internally kya karta hai?

Tum likhte ho

User.create({
    name,
    email,
    password
});

Internally Mongoose almost ye kaam karta hai:

const user = new User({
    name,
    email,
    password
});

await user.save();

Yaani create() ek shortcut hai. Dono ka result almost same hota hai.

## how lines execute in user controller ?

This line will first execute.
const existingUser = await User.findOne({ email });

Poora execution flow dekho.

Suppose request aayi:

{
    "name":"Siddharth",
    "email":"siddharth@gmail.com",
    "password":"12345678"
}

Controller ka flow:

const { name, email, password } = req.body;
⬇
const existingUser = await User.findOne({ email });
⬇

- Case 1: User already exists

Suppose database me pehle se
Email: siddharth@gmail.com present hai.

To existingUser me pura document aa jayega.

Fir if(existingUser) becomes if(true)

Fir

return res.status(400).json(...) execute hoga.

Aur function wahi stop. User.create() kabhi execute hi nahi hoga.

- Case 2: User does NOT exist

Suppose database empty hai.
existingUser = null

Fir

if(existingUser) becomes if(false)

Ye skip ho jayega. Fir next line

const newUser = await User.create(...) execute hogi.

Fir validation hogi.
Fir MongoDB me insert hoga.
Fir response aayega.

Isliye execution flow hamesha ye hai:
Request
↓
req.body
↓
findOne()
↓
User Exists?
↓
Yes
↓
Return 400

OR

No
↓
create()
↓
Save
↓
Response

## How does HASH works?

Maan lo user register karta hai.

Password: 12345678

Hash: XYZ123HASH

Database me Password XYZ123HASH Store ho gaya.

Baad me login karta hai.

Input: 12345678

bcrypt kya karta hai?

Input ko dubara hash karta hai.

12345678
↓
XYZ123HASH

Fir compare karta hai.

Database Hash == New Hash

Same?

✅ Login successful.

Different?

❌ Wrong password.

Notice karo, Company ko original password kabhi pata hi nahi chalta.

Ye ek Node.js library hai jo

- password hash karti hai
- password compare karti hai

Isliye almost har Express project me use hoti hai.

## How do Bycrupt works?

bcrypt hume ek function deta hai: bcrypt.hash(password, saltRounds);

Isme do cheezein hoti hain.

1. password

Ye original password hai.

Example: 12345678

2. saltRounds

Salt kya hota hai?

Suppose do users hain.

User 1
Password:12345678

User 2
Password: 12345678

Agar salt use na karein to dono ka hash same banega.

Hash: ABC123XYZ
Hash: ABC123XYZ

Hacker samajh jayega ki dono users ka password same hai.

Isliye bcrypt pehle random salt generate karta hai.

Example:

Password: 12345678
+
Random Salt: K9L2P

↓

Hash: $2b$10$Msd8j29....

Dusre user ke liye

Password: 12345678
+
Random Salt: QW71T

↓

Hash: $2b$10$Af928Hs...

Notice karo, Password same tha.
Hash alag aa gaya.

Isi wajah se bcrypt duniya bhar me use hota hai.

Salt Rounds kya hote hain?

bcrypt.hash(password, 10);

Ye batata hai bcrypt kitni complexity se hash banayega.

8 → Fast
10 → Recommended (most projects)
12 → More secure but slower
15+ → Bahut slow

Industry me 10 ya 12 commonly use hota hai.

## Why do you write password: hashedPassword instead of just hashedPassword?

Perfect Answer:

Because the Mongoose schema expects a field named password. The variable hashedPassword only stores the hashed 
value. By writing password: hashedPassword, we assign the hashed value to the schema's password field. If we only 
wrote hashedPassword, Mongoose would treat it as a different field, and the required password field would be 
missing.

Tumhara schema (user.js) kya bol raha hai?

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
});

Notice karo.

Schema me field ka naam hai: password Na ki hashedPassword.

## "Agar password database me encrypted (hashed) form me store hota hai, to login ke time user ka password verify kaise hota hai?"

Ye new salt generate nahi karta.
Ye database wale hash se old salt nikal leta hai.

User types 12345678

bcrypt kya karta hai?

HASH123
↓
Extract Salt AAAA
↓
12345678
↓
Hash Again Using AAAA
↓
HASH123
↓
Compare
↓
TRUE ✅

## Question: How do we know which password to compare?

Step 1: We don't search by password.

We search by email.
const user = await User.findOne({
    email
});

Now user contains only Siddharth's document.

{
    name:"Siddharth",
    email:"sid@gmail.com",
    password:"$2b$10$ABC..."
}

Rahul's document is not even considered.

Step 2: Now we compare:

await bcrypt.compare(
    password,
    user.password
);

Here: password means the plain password entered by Siddharth: 12345678
and
user.password means only Siddharth's stored hash: $2b$10$ABC...

bcrypt extracts the salt from ABC..., hashes "12345678" using that same salt, and compares the result.

If it matches:

✅ Login successful.

Rahul logs in

Frontend sends:

{
   "email":"rahul@gmail.com",
   "password":"12345678"
}

Again, we first search:

User.findOne({
    email:"rahul@gmail.com"
});

Now user contains Rahul's document.

{
    name:"Rahul",
    email:"rahul@gmail.com",
    password:"$2b$10$XYZ..."
}

Now bcrypt compares against Rahul's hash, not Siddharth's.

Complete Login Flow
User enters Email + Password
          │
          ▼
Find user by Email
          │
          ▼
User document found
          │
          ▼
Take stored hash from THIS user
          │
          ▼
bcrypt.compare(enteredPassword,storedHash)
          │
     Match?
      /    \
    Yes     No
    │        │
 Login    Wrong Password


## How login works?

Receive Email & Password
        │
        ▼
Validate Input
        │
        ▼
Find User by Email
        │
        ▼
User Found?
     /      \
   No        Yes
   │          │
Return 404    ▼
        Compare Password
             │
         Match?
        /      \
      No        Yes
      │          │
Return 401     Login Success

## How does Bcrypt internally works to match the password with hashed password?

Entered Password
↓
Extract Salt from Stored Hash
↓
Hash Entered Password using SAME Salt
↓
Compare
↓
true / false

## Authentication ka normal flow hota hai:

User Registers
      ↓
Password Hash
      ↓
Store in DB
      ↓
User Login
      ↓
Compare Password
      ↓
Generate JWT Token   ← NEXT STEP
      ↓
Frontend Stores Token
      ↓
User accesses Protected Routes

## HTTP Stateless kya hota hai?
Stateless ka matlab: Har request independent hoti hai.

Backend previous request yaad nahi rakhta.

Example: Request 1 Login
Success.

Request 2: Create Note
Backend ko nahi pata ki ye wahi banda hai jisne abhi login kiya tha.
Har request ek nayi request hai.

That's why we need JWT(JSON web token).

## Fir solution kya hai?

Backend kehta hai Login successful.
Ye lo ek Identity Card.

Us Identity Card ko hi bolte hain JWT Token

Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Ye ek random string jaisi dikhegi.

Ab flow dekho
Login

↓

Backend verifies password

↓

JWT Generate

↓

React stores JWT

↓

Create Note

↓

React sends JWT

↓

Backend verifies JWT

↓

Request allowed

Notice karo:
Password sirf Ek baar login ke time gaya.Uske baad kabhi password nahi bhejna padta.

## Why don't we store password inside JWT?

Best answer:

Password ki zarurat sirf login ke time hoti hai. Login successful hone ke baad server user ki identity verify kar 
chuka hota hai. Isliye JWT me password store karne ki koi need nahi hoti. Agar JWT kisi attacker ke haath lag 
jaye aur usme password bhi ho, to user ka actual password expose ho jayega. Isliye JWT me sirf minimum 
information rakhi jati hai, jaise userId ya email.

## Backend ko user ka name, email aur baaki details kaise milengi jab token me sirf id hi hai?

- Step 1: User Login

React bhejta hai:

{
  "email": "siddharth@gmail.com",
  "password": "12345678"
}

Backend check karta hai:
const user = await User.findOne({ email });
Password bhi match ho gaya.

Ab backend JWT banata hai.

{
   "id": "64a4673652c8f07e335cdbe8f"
}

Ye token React ko bhej diya.

- Step 2: User "Create Note" pe click karta hai

React password nahi bhejta. React sirf token bhejta hai.
Authorization: Bearer eyJhbGc.....

Ab backend ye token verify karta hai.
JWT verify hone ke baad backend ko milta hai:

decoded = {
   id: "64a4673652c8f07e335cdbe8f"
}

Ab backend ke paas sirf ID hai.

- Step 3: Ab backend kya karega?

Backend database se user ko dobara fetch karega.

const user = await User.findById(decoded.id);
Ab user object me kya aa jayega?

{
   _id: "...",
   name: "Siddharth",
   email: "siddharth@gmail.com",
   password: "$2b$10$....",
   createdAt: "...",
   updatedAt: "..."
}

Ab backend ke paas saari information aa gayi.
Isliye JWT me sirf ID rakhna kaafi hota hai.

## Step 1: JWT kya hai?

Socho tum airport gaye.
Security check hua.
Passport verify hua.
Ab security officer tumhe boarding pass deta hai.

Passport (Login)

↓

Verified

↓

Boarding Pass (JWT)

↓

Flight me entry

Ab flight ke gate par koi tumse passport dobara nahi maangta.
Wo sirf boarding pass dekhta hai.
JWT bhi exactly wahi boarding pass hai.

Step 2: JWT ke andar kya hota hai?

JWT koi random string nahi hoti.

Example:

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpZCI6IjY0YTQ2NzM2NTJjOGYwN2UzMzVjZGJlOCJ9.
rM4v6Lk......

Ye teen parts me divided hoti hai.

HEADER
.
PAYLOAD
.
SIGNATURE

- Header

Batata hai Token kis algorithm se sign hua hai.

Example

{
   "alg":"HS256",
   "typ":"JWT"
}

- Payload

Yahan user ki information hoti hai.
Hum rakhenge

{
   "id":"64a467..."
}

Sirf ID.

Password kabhi nahi.

- Signature

Ye sabse important part hai.
Ye prove karta hai ki - Token backend ne banaya hai.
Agar koi hacker payload change karega, Signature invalid ho jayegi.
Server turant pakad lega.

Step 3: JWT Secret

Question.Server ko kaise pata chalega ki token usne hi banaya tha?

Uske liye ek secret key hoti hai.

Example:

JWT_SECRET

↓

myInterviewCopilotSecretKey123

Ye sirf backend ko pata hoti hai.
Kabhi GitHub pe upload nahi karte.
Kabhi frontend ko nahi bhejte.

## Utility Function

Ab hum ek reusable function banayenge.
Project structure

backend
│
├── utils
│      generateToken.js   ← Create this file
│
├── controllers
├── models
├── routes

Question. Why in utils?

Kyunki token generation ek helper function hai.
Iska direct relation
- Controller
- Model
- Route
se nahi hai. Ye reusable utility hai.
Isi liye utils/ m rakhte h.

## Tum notice karoge ki hum JWT generation directly controller me nahi likh rahe.

Hum utility bana rahe hain.

Why?

Suppose kal

Register

↓

Generate Token

Login

↓

Generate Token

Admin Login
↓
Generate Token

Google Login

↓

Generate Token

Har jagah same code lagega.
Agar hum controller me likhenge, code repeat hoga.
Instead generateToken(id) ek baar likho. Har jagah use karo.
Ye DRY Principle hai. Don't Repeat Yourself.

jwt.sign() means: "Create a digitally signed token."

## process.env.JWT_SECRET

This is the secret key.

Remember:

JWT_SECRET=mySuperSecretJWTKey123

The backend uses this key to create the signature.

Later, when someone sends the token back,

the backend uses the same secret to verify it.

If the secrets don't match,

token becomes invalid.

## expireIn Argument
{
    expiresIn: "7d"
}

Question:

Why do we set an expiry?

Imagine if the token never expired.

Login Today

↓

Token Valid Forever

If someone steals that token,

they could use it forever.

Not good.

Instead:

Login

↓

Token Valid

↓

7 Days

↓

Expired

After 7 days,

the user logs in again.



