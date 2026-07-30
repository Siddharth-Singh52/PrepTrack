## Interview Question ⭐⭐⭐⭐⭐

Why do we use useState?

Perfect Answer

useState allows React components to store and update dynamic data. Whenever the state changes, React automatically re-renders the component with the updated values.

## What is useState

This is one of React's most important concepts.

Let's understand it properly.

When React renders this page for the first time:

const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
});

React creates a state variable:

formData = {

    name: "",

    email: "",

    password: ""

}

Think of it like a JavaScript object stored by React.

## Let's understand handleChange()

User types

Suppose you type:

Name

Siddharth

Browser fires onChange which calls handleChange(e)

This is today's most important React concept.

setFormData({

    ...formData,

    [e.target.name]: e.target.value

});

Don't memorize it.

Let's execute it.

Suppose current state is

{

    name: "",

    email: "",

    password: ""

}

You type

S

inside

<input name="name" />

Now

e.target.name

becomes

name

and

e.target.value

becomes

S

So React executes

setFormData({

    ...formData,

    name: "S"

});

New state

{

    name:"S",

    email:"",

    password:""

}

Next you type

i

State becomes

{

    name:"Si",

    email:"",

    password:""

}

React updates the UI automatically.

## Why do we write ...formData ?

Suppose we don't.

Imagine current state

{

    name:"Siddharth",

    email:"sid@gmail.com",

    password:"123456"

}

Now user changes only

Email

If we write

setFormData({

    email:"new@gmail.com"

});

React replaces the entire object.

New state becomes

{

    email:"new@gmail.com"

}

😨

Where did

name

go?

Gone.

Password?

Gone.

Because React replaced the object.

Instead we write

...formData

which copies all existing properties first:

{

    name:"Siddharth",

    email:"sid@gmail.com",

    password:"123456"

}

Then we overwrite only the changed field:

email:"new@gmail.com"

Final state:

{

    name:"Siddharth",

    email:"new@gmail.com",

    password:"123456"

}

This is called the spread operator.

## First Question

If we remove value={formData.name} can we still type?

Answer ✅ YES

The browser allows typing.

So then why do we even write

value={formData.name}

Good question.

Imagine there is NO React.

Suppose you write normal HTML.

<input type="text">

Who controls the value?

The browser.

If you type

Siddharth

The browser stores it.

JavaScript doesn't know anything unless you ask.

Now React React says "No no no..."

"I want to control every input."

So we write value={formData.name}

Now React becomes the single source of truth.

Instead of the browser deciding the input value,

React decides.

Visualize It

Without value

Keyboard

↓

Browser Input

↓

Browser stores text

React is almost not involved.

With value

Keyboard

↓

onChange

↓

setFormData()

↓

React State Changes

↓

React Updates Input

↓

Browser Displays New Value

Notice something.

The input is now controlled by React.

That's why it's called a Controlled Component.

## Interview Question ⭐⭐⭐⭐⭐

Interviewer

What is a Controlled Component?

Perfect Answer

A controlled component is a form element whose value is controlled by React state instead of the browser. The input value is stored in state, and any change is handled through an onChange event, making React the single source of truth.

## Now Let's Understand This Line value={formData.name}

This confused you.

Let's simplify.

Suppose

formData.name = "Siddharth"

Now React says

"Input...

Show exactly this."

Input shows

Siddharth

Suppose tomorrow I change

formData.name = "Rahul"

React immediately tells input

"Don't show Siddharth."

Show

Rahul

That's all this line means.

Nothing more.

Then Why onChange?

Question.

Suppose user types

A

How will React know?

Answer.

Because of

onChange

Whenever user types,

React gets informed.

Like

User

↓

onChange

↓

React

Then React updates

formData

Then React again sends the updated value back to the input.

User

↓

onChange

↓

React State

↓

Input

This cycle keeps repeating.

Now The Big Question

Why do we need BOTH?

value={formData.name}

AND

onChange={handleChange}

Imagine this.

- Only value <input value="Siddharth">

React says

"Always show Siddharth."

You type

A

React says

"No."

Show

Siddharth

again.

Input becomes locked.

- Only onChange <input onChange={handleChange}>

Now browser stores everything.

React receives events.

But React is not controlling what is displayed.

Browser becomes the boss.

Both Together
User Types

↓

React Gets Information

↓

React Updates State

↓

React Sends Updated Value Back

↓

Browser Displays It

Now React is the boss.

Why is this useful?

Imagine password validation.

You type

123

Immediately React knows

formData.password = "123"

React can instantly say

❌ Password too short

How?

Because React already has the latest value.

If browser alone controlled the input, React wouldn't automatically have that value available in its state.

## Technical Explanation (Now)

This is called a Controlled Component.

1. value binds the input to React state.

2. onChange updates the React state whenever the user types.

3. useState stores the latest value.

4. React becomes the single source of truth.

## What is preventDefault()?
Imagine Normal HTML
<form>

<button type="submit">

Submit

</button>

</form>

When you click Submit

Browser says

"My job is to submit forms."

Immediately

Submit

↓

Refresh Page

↓

Send Request
React says

"No browser."

"Don't do your default behavior."

That's why we write

e.preventDefault();

Think of it as

Browser

↓

I'm going to refresh

↓

React

↓

STOP ✋

I'll handle it.

That's literally what preventDefault() means.

Interview Answer

preventDefault() prevents the browser's default behavior, such as refreshing the page when a form is submitted. This allows React to handle the submission using JavaScript.

## Flow of how Register works ?

Button Click

↓

handleSubmit()

↓

preventDefault()

↓

Axios

↓

POST /auth/register

↓

Express Router

↓

Controller

↓

MongoDB

↓

User Created

↓

JSON Response

↓

Axios

↓

React

## Why do we use CORS?

Imagine this:

React App (5173)
        |
        | "Can I talk to Backend?"
        |
Browser Security Guard 🚔
        |
        | "Wait!"
        |
Backend

Without CORS:

🚔
"No permission."

❌ Blocked

With

app.use(cors());

Backend says:

"Yes."

I allow requests.

Browser:

👍 Okay.

Send request.
🚀 Better Way (Production)

Instead of allowing everyone:

app.use(cors());

We usually write:

app.use(
    cors({
        origin: "http://localhost:5173"
    })
);

This means: Only React running on port 5173 is allowed.

Much safer.

🎯 Interview Question

Why do we use CORS?

Answer:

CORS (Cross-Origin Resource Sharing) is a browser security mechanism that controls whether a frontend running on one origin can access a backend running on another origin. We enable CORS on the backend so that our React application can communicate with the Express API.

## What is useNavigate()?

Socho tum kisi mall mein ho.

Mall mein alag-alag shops hain.

Home

↓

Register

↓

Login

↓

Dashboard

Ab agar Register successful ho gaya.

To tum user se bologe

"Ab Login page pe chale jao."

React mein hum page reload nahi karte.

Hum bas route change karte hain.

Isliye React hume ek function deta hai.

Uska naam hai

useNavigate()

Ye function React Router ko bolta hai

"Current page se doosre page pe le chalo."

## Flow dekho:

alert("User Registered Successfully");

setFormData({
    name: "",
    email: "",
    password: ""
});

navigate("/login");
Kya hota hai?

- Step 1

alert(...)

User ko popup dikhega.

Program yahin ruk jaata hai jab tak user OK nahi dabata.

User Click Register

↓

Alert Open

↓

Program Waits ⏸️

↓

User clicks OK

- Step 2

Ab

setFormData(...)

React ko bolta hai

"Form ke values empty kar do."

Lekin...

⚠️ Dhyan do.

React turant UI update nahi karta.

Ye update schedule karta hai.

- Step 3

Uske turant baad

navigate("/login");

React Login page render kar deta hai.

Ab Register page screen se hi hat gaya.

To user ko ye form blank hote hue dikhega hi nahi.

Flow:

Register Page

↓

Alert

↓

setFormData()

↓

navigate()

↓

Login Page

User ne Register page ko dobara dekha hi nahi.

To phir setFormData() ka kya fayda?

Sach bataun?

Is specific case mein almost koi visible fayda nahi hai.

Kyuki tum immediately page change kar rahe ho.

Agar tum Register page par hi rehte, tab form clear karna useful hota.

Production mein kya karte hain?

Mostly developers aisa likhte hain:

alert("User Registered Successfully");

navigate("/login");

Bas.

Form clear bhi nahi karte.

Kyunki page waise hi unmount hone wala hai.

🧠 Technical Reason

Jab

navigate("/login");

execute hota hai,

React:

Register component ko unmount kar deta hai.
Login component ko mount kar deta hai.

Isliye Register component ki state (formData) waise bhi destroy ho jaati hai.

## Interview Question ⭐

Q. Kya yahan setFormData() ki zarurat hai?

Best Answer:

"Nahi. Kyunki successful registration ke baad hum Login page par navigate kar rahe hain. Navigation ke baad Register component unmount ho jaata hai aur uski state automatically destroy ho jaati hai. Isliye setFormData() optional hai."

## Login flow 

JWT

Login

↓

Backend

↓

JWT Token

↓

React stores it

↓

Every future request

↓

Token sent

↓

Backend says

"Yes, this is Siddharth."

## How token is stored in React

React ke paas token rakhne ki 3 jagah hain.

1. useState

2. localStorage

3. sessionStorage

Ek-ek samajhte hain.

Option 1: useState

Suppose

const [token, setToken] = useState("");

Login hua

↓

Token aa gaya

↓

State mein save kar diya.

Sab sahi lag raha hai.

Ab...

User ne

F5

dabaya.

Question.

Kya hoga?

React dobara start hoga.

App Restart

↓

State Reset

↓

Token Gone

😨

User automatically logout.

Har refresh pe login karna padega.

Koi website aisa karti hai?

Nahi.

Option 2: sessionStorage

Ye browser ke andar storage hota hai.

Refresh karoge.

Token rahega.

👍

Lekin...

Browser close kar diya.

Sab gayab.

Close Browser

↓

sessionStorage Empty

Option 3: localStorage

Browser ke andar permanently save hota hai.

Refresh?

✅ Token rahega.

Browser band?

✅ Token rahega.

Computer restart?

✅ Token rahega.

Kal login karoge?

✅ Token rahega.

Isliye tum automatically logged in rehte ho.

localStorage browser ka persistent storage hai.

Usme data tab tak rehta hai jab tak:

User manually remove na kare.
Ya code remove na kare.

Isliye authentication token store karne ke liye beginners aur intermediate MERN projects mein ye common choice hai.

## Interview Question ⭐⭐⭐⭐⭐

Interviewer:

Where do you store JWT in your MERN project?

Best Answer:

"In this project, I stored the JWT in localStorage so that the user remains logged in even after refreshing the page. In production applications, I would prefer HttpOnly cookies because they provide better protection against XSS attacks."