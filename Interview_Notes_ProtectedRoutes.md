## 🛡️ Protected Routes

Abhi kya problem hai?

Agar koi user browser mein manually type kare

http://localhost:5173/dashboard

To kya hoga?

👉 Dashboard open ho jayega.

Lekin user login hi nahi hai.

Ye security issue hai.

Real Life Example

Socho ek company hai.

Usme reception hai.

Har employee ko andar jaane se pehle ID card dikhana padta hai.

Gate

↓

Security Guard

↓

ID Check

↓

Office

Agar ID valid hai

✅ Entry.

Agar ID nahi hai

❌ Bahar.

React mein bhi ek security guard banayenge.

Uska naam hoga

ProtectedRoute
Current Flow
Browser

↓

Dashboard

Koi checking hi nahi.

New Flow
Browser

↓

ProtectedRoute

↓

Token?

↓

YES -------------> Dashboard

NO --------------> Login Page

Ab koi direct Dashboard nahi khol sakta.

Step 1

src/components ke andar ek file banao.

components
│
└── ProtectedRoute.jsx
Ab code likhte hain.

Main pehle code dunga.

Phir har line explain karunga.

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {

    const { token } = useContext(AuthContext);

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;

Ab is code ko abhi copy mat karo blindly.

Pehle samajhte hain.

Line 1
import { useContext } from "react";

Question.

Kyun?

Kyuki hume Context se token lena hai.

Line 2
import { Navigate } from "react-router-dom";

Ye bahut important hai.

Question.

Navigate kya karta hai?

Simple answer:

Page redirect karta hai.

Jaise

<Navigate to="/" />

matlab

Jao Login page pe.
Line 3
import { AuthContext } from "../context/AuthContext";

Taaki Context access kar saken.

Fir
const { token } = useContext(AuthContext);

Yahan kya hua?

Humne AuthProvider ki state read kar li.

Dhyan do.

Hum setToken nahi le rahe.

Sirf

token

Kyun?

Kyuki hume sirf check karna hai.

Update nahi.

Sabse Important Part
if (!token)

Yahan ek question.

Suppose

token = ""

To

!token

kya hoga?

Think.

Agar

token = "abc123"

To

!token

kya hoga?

Ye JavaScript truthy/falsy ka concept hai.

Agar token nahi hai
return <Navigate to="/" replace />;

Matlab

Login Page pe bhej do.
Agar token hai
return children;

Matlab

Jo component andar diya hai

use render kar do.
Ab Question

Hum Dashboard directly render kyun nahi kar rahe?

Kyunki ProtectedRoute reusable hai.

Kal ko

Dashboard

Profile

Notes

Resume

Interview

Sab protect karna hai.

To har jagah same component use karenge.

Ab AppRoutes mein use kaise karenge?

Abhi tumhare paas hai

<Route
    path="/dashboard"
    element={<Dashboard />}
/>

Isko change karenge.

<Route
    path="/dashboard"
    element={
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    }
/>

Ab flow dekho.

Dashboard Request

↓

ProtectedRoute

↓

Token?

↓

YES

↓

Dashboard

NO

↓

Navigate("/")

↓

Login

## Q1. Humne Dashboard ko directly route mein kyun nahi diya? ProtectedRoute ke andar kyun wrap kiya?

Tumne likha:

Because we don't only want dashboard to be protected but also the other components like navbar and others should also use the protected routes to render.

✔️ Bilkul sahi idea hai.

Main isko thoda aur precise bana deta hoon.

ProtectedRoute reusable component hai.

Aaj:

<ProtectedRoute>
    <Dashboard />
</ProtectedRoute>

Kal:

<ProtectedRoute>
    <Profile />
</ProtectedRoute>

Aur baad mein:

<ProtectedRoute>
    <Interview />
</ProtectedRoute>

Ya

<ProtectedRoute>
    <Resume />
</ProtectedRoute>

Ek hi component se jitni marzi routes protect kar sakte ho.

Yahi iska main purpose hai.

## Q2. Agar return children; ki jagah return <Dashboard />; likh dein. Kya problem hogi?

Agar hum aisa likh dein:

const ProtectedRoute = () => {

    const { token } = useContext(AuthContext);

    if (!token) {
        return <Navigate to="/" />;
    }

    return <Dashboard />;
}

Question.

Ab agar Profile protect karna ho?

Kya hoga?

😂

Ye component hamesha

return <Dashboard />;

hi karega.

Profile kabhi render hi nahi hogi.

Isi liye hum likhte hain:

return children;

Children matlab:

"Jo bhi component mere andar pass kiya gaya hai, usi ko render kar do."

Example:

- Case 1
<ProtectedRoute>

    <Dashboard/>

</ProtectedRoute>

To

children = <Dashboard/>

- Case 2
<ProtectedRoute>

    <Profile/>

</ProtectedRoute>

To

children = <Profile/>

- Case 3
<ProtectedRoute>

    <Resume/>

</ProtectedRoute>

To

children = <Resume/>

Ek hi component sabke liye kaam kar raha hai.

Yahi React ka beauty hai.

## ✅ Q3.Suppose tum Login karte ho. token = "abc123" Ab browser refresh karte ho. ProtectedRoute dobara chalega.

Question:

Is baar token empty milega ya "abc123"?

Tumne bola:

"abc123 milega because of localStorage."

Bilkul sahi. 🎉

Lekin ek line aur add karni chahiye.

Sirf localStorage ki wajah se nahi.

AuthProvider ki wajah se bhi.

Yaad hai?

const [token, setToken] = useState(
    localStorage.getItem("token") || ""
);

Browser refresh hua.

React state gayi.

Fir React ne dobara AuthProvider execute kiya.

Usne ye line chalayi.

localStorage.getItem("token")

Aur wapas

abc123

mil gaya.

Fir

token = abc123

ban gaya.

Fir

if (!token)

false ho gaya.

Fir

return children;

Dashboard open.

🔥 Ek Bahut Important Timeline

Ye timeline yaad rakhna.

Login Success

↓

localStorage.setItem("abc123")

↓

setToken("abc123")

↓

Dashboard Opens

↓

--------------------

Browser Refresh

↓

React State Destroyed

↓

AuthProvider Runs Again

↓

localStorage.getItem()

↓

abc123

↓

State Restored

↓

ProtectedRoute

↓

Dashboard Opens Again

Ye poora authentication flow hai.

## Agar main AuthContext.jsx mein ye line change kar doon:

## From

## const [token, setToken] = useState(
##    localStorage.getItem("token") || ""
## );

## to const [token, setToken] = useState("");

## Question: User login karta hai. Refresh karta hai. Ab kya hoga?

"Dobara refresh karne par user ke pass token nahi hoga aur bas "" hi hoga because after refresh we want the token again but vo nahi le raha that's why we will be logged out."

✅ Bilkul sahi.

Ab dekhte hain exactly kya hota hai.

Current Code (Correct)

const [token, setToken] = useState(
    localStorage.getItem("token") || ""
);

Refresh ke baad

React Restart

↓

AuthProvider Runs Again

↓

localStorage.getItem("token")

↓

"abc123"

↓

token = "abc123"

↓

ProtectedRoute

↓

Dashboard Opens

Agar hum ye likh dein
const [token, setToken] = useState("");

To Refresh ke baad kya hoga?

React Restart

↓

AuthProvider Runs Again

↓

token = ""

↓

ProtectedRoute

↓

if (!token)

↓

true

↓

Navigate("/")

↓

Login Page

Ab dekho...

Token localStorage mein abhi bhi pada hua hai.

Lekin humne kabhi usko padha hi nahi.

Isliye React state hamesha empty ban gayi.

Aur application ko laga

"User login hi nahi hai."

## What happens when we set "" while logout ?

Login

↓

localStorage = abc123

↓

setToken(abc123)

↓

Logout

↓

setToken("")

↓

React State Empty

↓

localStorage still abc123

↓

Browser Refresh

↓

AuthProvider Runs Again

↓

localStorage.getItem()

↓

abc123

↓

User Logged In Again

Isliye Logout mein hum dono kaam karte hain.

localStorage.removeItem("token");

setToken("");

Ab dekho.

Logout.

React State

↓

""

LocalStorage

↓

Nothing

Browser Refresh.

localStorage.getItem("token")

Return karega

null

To

null || ""

ban jayega

""

Fir

if (!token)

true.

Aur

<Navigate to="/" />

User Login page par.

🎉 Ab logout properly ho gaya.

## Question:

const logout = () => {

    localStorage.removeItem("token");

    setToken("");

}

Ye code likhne ke baad...

Dashboard automatically Login page pe kaise jayega?

Humne to kahin bhi nahi likha:

navigate("/");

Phir redirect kaise hoga?

Answer:
When setToken("") executes the react state changes and ui re render and the token is not available so we have created the protected routes which let you go to the login page.

⭐⭐⭐⭐⭐

100% Correct.

Bas ek aur chhota part add karna hai.

Actual Flow
Logout Button

↓

localStorage.removeItem("token")

↓

setToken("")

↓

AuthProvider state changes

↓

React re-renders

↓

ProtectedRoute executes again

↓

const { token } = useContext(AuthContext)

↓

token = ""

↓

if (!token)

↓

<Navigate to="/" />

↓

Login Page

Notice ek important cheez.

❌ ProtectedRoute continuously check nahi karta.

Ye bahut common misconception hota hai.

Log sochte hain:

"ProtectedRoute background mein continuously token dekh raha hai."

Nahi.

Actually kya hota hai?

State Changes

↓

React Re-renders

↓

ProtectedRoute function runs AGAIN

↓

New token value is read

↓

Decision taken

React components re-render hone par dobara execute hote hain.

Ye React ka core principle hai.

## Why do we need both localStorage.removeItem() and setToken("")?

Tum confidently answer de sakte ho:

localStorage.removeItem() removes the token permanently so that the user doesn't get logged in again after a page refresh. setToken("") updates the React state immediately, causing a re-render. During that re-render, ProtectedRoute runs again, detects that there is no token, and redirects the user to the login page without waiting for a refresh.