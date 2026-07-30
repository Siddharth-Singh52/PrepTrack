## why context API ?

Sabse pehle problem samajhte hain.

Abhi humne login kiya.

Backend ne bola

Lo beta...

Ye tumhara JWT Token.

Aur humne usko

localStorage

mein save kar diya.

Ab question...

Dashboard ko kaise pata chalega ki user login hai?

🤔

Maan lo tumhare project mein 10 pages hain.
App

│

├── Login

├── Register

├── Dashboard

├── Notes

├── Resume

├── Interview

├── Profile

├── Settings

├── Navbar

└── Sidebar

Question.

Navbar ko kaise pata chalega user login hai?

Dashboard ko kaise pata chalega?

Notes ko kaise pata chalega?

Profile ko kaise pata chalega?

Sabko token chahiye.

Pehla idea

Har component mein likh dete hain

const token = localStorage.getItem("token");

Navbar

↓

const token = localStorage.getItem("token");

Dashboard

↓

const token = localStorage.getItem("token");

Profile

↓

const token = localStorage.getItem("token");

Resume

↓

const token = localStorage.getItem("token");

😂😂😂

10 pages.

10 baar same code.

Accha idea hai?

❌ Bilkul nahi.

Real Life Example

Imagine ghar mein mummy ne pizza order kiya.

Pizza aa gaya.

Ab ghar mein 6 log hain.

Sab ek hi question pooch rahe hain.

Papa

Pizza aaya?
Bhai

Pizza aaya?
Didi

Pizza aaya?
Tum

Pizza aaya?

Poori family mummy ko hi pooch rahi hai.

😂

Kitna irritating hai.

Mummy kya karegi?

Wo bolegi

"Main dining table pe rakh deti hoon."

Jisko chahiye...

Wahan se le lo.

Bas.

Kisi ko alag se poochna nahi padega.

React mein bhi exactly yahi hota hai.

React bolta hai

"Ek common jagah bana dete hain."

Us common jagah ka naam hai

⭐ Context ⭐
Context Kya Hai?

Simple language mein

Context ek Global Box hai.

             Context

         ┌──────────────┐

         │ Token        │

         │ User         │

         │ Theme        │

         │ Language     │

         └──────────────┘

Ab project ka koi bhi component bole

Mujhe Token chahiye.

Context bolta hai

Le bhai.

😂

Bas.

Without Context

Dashboard

↓

localStorage

Navbar

↓

localStorage

Profile

↓

localStorage

Resume

↓

localStorage

Har jagah same code.

With Context

Dashboard

↓

Context

Navbar

↓

Context

Profile

↓

Context

Resume

↓

Context

Ek hi jagah.

Ab ek aur problem.

Maan lo user logout kar gaya.

Token delete.

Agar hum localStorage har page pe read karenge...

Har component ko manually update karna padega.

😨

Context bolta hai

"Tension mat lo."

Main sabko bata dunga.

Real Life Example 2

College notice board.

Agar teacher har student ko individually bole

Kal holiday hai.

500 students.

😂😂

Impossible.

Instead

Notice board pe laga diya.

Sab padh lenge.

Context exactly wahi notice board hai.

React Tree

Ab React ko tree ki tarah socho.

App

│

├── Navbar

├── Dashboard

│      │

│      ├── Notes

│      ├── Resume

│      └── Profile

└── Footer

Ab App ke paas token hai.

Question.

Notes ko token kaise milega?

Ek tareeka hai.

Prop Drilling

App

↓

Dashboard

↓

Notes

App

↓

Dashboard ko dega.

Dashboard

↓

Notes ko dega.

Sirf pass karte jao.

Ye hota hai

Prop Drilling.

Aur ye bahut irritating hota hai.

Context bolta hai

"Nahi."

Main direct de dunga.

Context

↓

Notes


Dashboard ke through bhejne ki zarurat hi nahi.

Isliye Context bana.

Ek sentence yaad rakhna.

Context is a global storage that allows any component to access shared data without passing props manually through every level of the component tree.

Ye interview answer hai.

Without Context

App
↓

Dashboard
↓

Notes

---------------------

With Context

        Context

       ↙   ↓   ↘

Navbar Dashboard Profile

## Doubt 1

Tumne bola:

"Hum token update kaise karenge? Wo to backend generate karta hai."

Tumhari thinking sahi hai, lekin yahan "update" ka matlab JWT ko edit karna nahi hai.

JWT ko kabhi edit nahi karte.

Ye backend ka kaam hai.

Suppose backend ne diya

eyJhbGc....

Ab React is token ko sirf store karta hai.

To setToken() ka use kab hota hai?

- Case 1 - Login

Initially

token = ""

Login hua.

Backend ne diya

eyJhbGc....

Ab hum kya karte hain?

setToken(response.data.token);

Ab state change ho gayi.

Before

token = ""

↓

After

token = eyJhbGc...

Ye "update" hai.

Hum token ko modify nahi kar rahe.

Hum old value ko new value se replace kar rahe hain.

- Case 2 - Logout

User Logout karta hai.

Backend kuch nahi bhej raha.

Hum simply

setToken("");

Aur

localStorage.removeItem("token");

Kar dete hain.

Ab

Before

eyJhbGc....

↓

After

""

Ye bhi update hai.

Isliye

setToken() ka matlab hai

State ki value change karna.

Na ki JWT ke andar kuch edit karna.

## Doubt 2

Ye sabse important hai.

Tumne screenshot bheja.

Aur poocha.

"Children to AuthProvider ke andar hi hai, fir children aata kahan se hai?"

🔥🔥

Ab dhyan se.

Yahi Context API ka heart hai.

Sabse pehle ye code dekho
<AuthProvider>

    <Navbar/>

    <Dashboard/>

</AuthProvider>

Question.

Ye code kisne likha?

Humne.

Ab React internally isko convert karta hai.

React bolta hai

AuthProvider({

    children: (

        <>
            <Navbar/>

            <Dashboard/>
        </>

    )

});

😳

Yahan pehli baar

children

ban gaya.

Matlab...

React automatically ye karta hai.

Hum nahi.

Example

Maan lo function hai

function Test(props){

    console.log(props);

}

Aur tum call karo

<Test>

    Hello

</Test>

React internally karega

Test({

    children:"Hello"

});

Output

props = {

    children:"Hello"

}

Samajh aa raha hai?

Ek aur Example

Suppose

<Test>

<h1>Hi</h1>

<p>Hello</p>

</Test>

React banayega

Test({

children:

<>

<h1>Hi</h1>

<p>Hello</p>

</>

});

Yani

Jo bhi opening aur closing tag ke beech hota hai

↓

React usko automatically

children

naam ke prop mein daal deta hai.
To AuthProvider ke case mein

Hum likhenge

<AuthProvider>

<App/>

</AuthProvider>

React banayega

AuthProvider({

children:<App/>

});

To

const AuthProvider = ({children})

mein

children

=

<App/>

Aur fir ye line

return(

<AuthContext.Provider>

    {children}

</AuthContext.Provider>

)

ka matlab kya hua?

Simple.

React bol raha hai

"Jo bhi mere andar tha..."

<App/>

"Usko render kar do."

## How API works ?

Tumne ek aur bahut important line boli.

"Function apne hi andar kaise chal raha hai?"

Actually function apne andar nahi chal raha.

Sequence dekho.

Step 1

main.jsx

<AuthProvider>

<App/>

</AuthProvider>

↓

Step 2

React call karta hai

AuthProvider({

children:<App/>

});

↓

Step 3

Function execute hota hai

↓

Step 4

Function return karta hai

<AuthContext.Provider>

{children}

</AuthContext.Provider>

↓

Step 5

React dekhta hai

children =

<App/>

↓

Final

<AuthContext.Provider>

<App/>

</AuthContext.Provider>

Bas.

Function ne khud ko call nahi kiya.

React ne call kiya.

Visualization
main.jsx

<AuthProvider>

    <App/>

</AuthProvider>

        │

        ▼

React automatically

AuthProvider({

children:<App/>

});

        │

        ▼

AuthProvider runs

        │

        ▼

return(

<AuthContext.Provider>

    {children}

</AuthContext.Provider>

)

        │

        ▼

children becomes

<App/>

        │

        ▼

<AuthContext.Provider>

    <App/>

</AuthContext.Provider>

## What is <AuthContext.Provider> kya hota hai?

🔥 Ye sabse important concept hai.

Main isko bahut simple example se samjhata hoon.

🧠 Mode 1 (Hinglish)

Socho tumhare ghar mein WiFi laga hai.

Router dekha hai na?

          📶 WiFi Router

Ab ghar mein

Mobile
Laptop
TV

sab internet use kar sakte hain.

Question.

Internet kahan se aa raha hai?

Router se.

Router internet provide kar raha hai.

Isliye usko Provider samajh lo.

React mein bhi same.

          AuthContext.Provider

             Token

             User

             Login()

             Logout()

Jo bhi iske andar hoga

<App/>

Wo sab ye data use kar sakte hain.

Ek aur Example

Socho ek classroom hai.

Teacher bolta hai.

"Main sabko notebook de raha hoon."

Teacher

↓

Students

Teacher kya kar raha hai?

Notebook provide kar raha hai.

React mein

<AuthContext.Provider>

bhi exactly wahi karta hai.

Wo bolta hai

"Main apne andar wale sab components ko ye data provide kar raha hoon."

Is line ko dekho

<AuthContext.Provider

value={{

token,

setToken

}}

>

Iska matlab hai

Provider

↓

Ye data share karo

↓

Token

↓

setToken

Ab App ke andar koi bhi component bole

Mujhe token chahiye

Provider bolega

Le bhai.

Ye raha.

😂

Agar Provider hi na ho?

Maan lo sirf ye likh diya.

<AuthContext>

<App/>

</AuthContext>

Kya hoga?

Kuch nahi.

Kyun?

Kyuki AuthContext sirf ek empty box hai.

Yaad hai?

createContext();

Sirf locker banaya tha.

Usme samaan kisne rakha?

👉 Provider ne.

Samjho is tarah

- Step 1

createContext()

↓

Ek empty locker kharid liya.

📦

- Step 2

<AuthContext.Provider>

↓

Locker mein samaan rakh diya.

📦

Token

User

Login

Logout

- Step 3

Koi bhi component

useContext(AuthContext)

↓

Locker se samaan nikal lega.

Flow Diagram

createContext()

↓

Empty Context

↓

<AuthContext.Provider>

↓

Token

User

Logout

↓

<App/>

↓

Navbar

Dashboard

Profile

↓

useContext(AuthContext)

↓

Token mil gaya

## "Kya saare components ko render karne ke liye main.jsx mein likhna hoga?"

Answer:

Nahi.

Sirf root component ko render karte hain.

Abhi

<App/>

render ho raha hai.

Aur App ke andar

<AppRoutes/>

hoga.

Aur uske andar

<Login/>

<Register/>

<Dashboard/>

render honge.

Isliye main.jsx ka kaam sirf application ka entry point banana hai.

Tree dekho:

main.jsx

↓

<App/>

↓

<AppRoutes/>

↓

Login

Register

Dashboard

Navbar

Hum har component ko main.jsx mein render nahi karte.

Sirf root component ko.

## What does context API works?

AuthProvider

↓

Creates State

↓

Context.Provider

↓

Shares State

↓

Components

↓

Use State

Context database nahi hai.

Context sirf delivery boy hai. 😂

Real owner kaun hai?

👉 AuthProvider.

Visualize it 


                 AuthProvider

         token = "abc123"

         setToken()

                │
                │
                ▼

      <AuthContext.Provider>

                │

      shares token & setToken

                │

     ┌──────────┼───────────┐

     ▼          ▼           ▼

   Navbar    Dashboard    Profile

       useContext(AuthContext)


Notice karo:

token upar create hua.
Neeche sirf share hua.
Components usko read/use kar rahe hain.

## Can componenets set the token value ?

Socho Login hua.

Backend ne response bheja.

{
   "token": "abc123xyz"
}

Ab React mein hum kya karte hain?

const response = await api.post("/auth/login", formData);

setToken(response.data.token);

Question:

Ye setToken() kisne call kiya?

👉 Frontend ne.

Backend ne sirf token bheja.

Frontend ne us token ko store kiya.

Real Life Example

Socho Amazon ne tumhare ghar parcel bheja.

Parcel bhejna kisne kiya?

👉 Amazon.

Lekin parcel ko almirah mein kisne rakha?

👉 Tumne.

Waise hi

Backend:

Lo bhai

Ye JWT Token

Frontend:

setToken(receivedToken);

Aur us token ko Context state mein rakh diya.

Ab maan lo Logout hua.

Kya backend naya token bhej raha hai?

Nahi.

Frontend sirf ye karega.

setToken("");

Ya

localStorage.removeItem("token");

setToken("");

Token gayab.

User logout.

Iska matlab...

👉 Frontend token ko update bhi kar sakta hai aur remove bhi kar sakta hai.

Ek Aur Example

Suppose abhi token hai.

abc123

Navbar mein Logout button dabaya.

const { setToken } = useContext(AuthContext);

const logout = () => {

    setToken("");

};

Ab kya hua?

State change.

token = ""

Dashboard dobara render hoga.

Navbar dobara render hoga.

Protected routes check karenge.

Aur user Login page pe chala jayega.

Important Point

Backend token create karta hai.

Frontend token store karta hai.

Backend token verify karta hai.

Ye teen alag cheezein hain.

Backend
      │
      │ Creates JWT
      ▼

JWT Token

      │

Frontend receives

      │

setToken(token)

      │

Context stores token

      │

Navbar

Dashboard

Profile

sab use karte hain
To kya hum manually token bhi change kar sakte hain?

Haan.

setToken("Hello");

Ye chal jayega.

React state update ho jayegi.

Lekin...

Ye valid JWT nahi hai.

Jab backend ko bhejoge...

Authorization:

Bearer Hello

Backend bolega 😂

"Bhai ye JWT hi nahi hai."

Aur response dega

401 Unauthorized

Isliye frontend technically koi bhi string store kar sakta hai, lekin backend sirf valid JWT accept karega.

## Suppose navbar set the value of token can Dashboard mein bina kisi prop ke token kaise update ho jayega?

✅ Context is a mechanism to share state globally across components without prop drilling.

Kyuki technically state Context ke andar nahi hoti, state AuthProvider ke andar hoti hai. Context sirf us state ko sab components tak pahunchata hai.

## How does dashboard knows that token is changes ?

Yahi React ka magic hai.

Ye bahut important concept hai.

Mode 1 (Hinglish)

Suppose tumhare ghar mein ek TV hai.

Aur TV Tata Sky se connected hai.

Channel change kisne kiya?

Papa ne.

Tumne nahi.

Lekin tumhare room wala TV bhi change ho gaya.

Kyun?

Kyuki dono ek hi connection use kar rahe hain.

React mein bhi same.

AuthProvider

token = ""

Navbar

setToken("ABC123")

React dekhta hai

Ohoo!

State change ho gayi.

Fir React bolta hai

Jo bhi components ye state use kar rahe hain

unko dubara render karo.

To

Navbar

Dashboard

Profile

sab automatically dobara render ho jayenge.

Flow
Navbar

↓

setToken("abc123")

↓

AuthProvider ki state change

↓

React notices state changed

↓

React re-renders

↓

Dashboard

↓

useContext()

↓

New Token

Notice kiya?

Dashboard ne kisi ko phone nahi kiya 😂

Dashboard ne backend ko call bhi nahi kiya.

Dashboard ne props bhi nahi liye.

Dashboard ne sirf

const { token } = useContext(AuthContext);

likha hua tha.

React ne khud usko dobara render kar diya.

Sabse Important Line

Ye line interview mein bahut kaam aayegi.

Context does not notify components manually. React automatically re-renders all components consuming the context whenever the Provider's value changes.

Is line ko samajh lo.

Ek aur visualization

          AuthProvider

      token = ""

            │

            ▼

 Context.Provider

            │

 ┌──────────┼──────────┐

 ▼          ▼          ▼

Navbar   Dashboard   Profile


Ab Navbar

setToken("JWT")

chalata hai.

React internally karta hai

AuthProvider

↓

State Changed

↓

Provider value changed

↓

React re-renders

↓

Navbar

Dashboard

Profile

Bas.

Koi manual update nahi.

Koi prop nahi.

Koi event nahi.

Sirf React ka rendering cycle.

## Flow how context stores token on login ?

Login Button

↓

Backend

↓

JWT Token

↓

localStorage

↓

setToken()

↓

AuthProvider State Updated

↓

React Re-render

↓

Whole App knows

User Logged 

## Q. Agar browser refresh kar diya. React ki state reset ho gayi. Fir bhi user logout kyun nahi hoga?

React state refresh hone ke baad reset ho jaati hai, lekin localStorage browser ke andar persistent storage hai. Isliye browser refresh ya close karne ke baad bhi token save rehta hai. Jab application dobara start hoti hai, AuthProvider localStorage.getItem("token") se token wapas state mein load kar leta hai.

Notice last line.

Wo bahut important hai.

const [token, setToken] = useState(
    localStorage.getItem("token") || ""
);

Ye line hi refresh ke baad token wapas laati hai.

## Q. Humne ye dono lines kyun likhi?

localStorage.setItem("token", response.data.token);
setToken(response.data.token);

Sirf setToken() se kaam kyun nahi chalega?

Answer: localStorage kya hai?

Ye diary hai.

Permanent.

localStorage.setItem(...)

Ka matlab

Browser...

Ye token permanently save kar lo.

setToken kya hai?

Ye whiteboard hai.

Current application ko batao.

setToken(response.data.token);

Ka matlab

React...

Abhi isi waqt sab components ko bata do ki user login ho gaya.

Real Flow

Login hua.

Backend bola

Ye lo token.

React ne kiya

Step 1
localStorage.setItem(...)

Browser ne token permanently save kar liya.

Step 2
setToken(...)

React ne bola

State Changed

Fir

Navbar

Dashboard

Profile

sab re-render ho gaye.

Aur sabko pata chal gaya.

User Logged In
Agar sirf localStorage hota
localStorage.setItem(...)

Question.

Dashboard ko turant kaise pata chalta?

🤔

Nahi pata chalta.

Kyuki React state change hi nahi hui.

Agar sirf setToken hota
setToken(...)

Question.

Browser refresh?

React Restart

↓

State Lost

↓

Logout

😨

Isliye

Hum dono use karte hain.

localStorage

↓

Permanent Storage

+

setToken

↓

Instant UI Update

Yahi professional authentication flow hai.

## Why do we use both localStorage.setItem() and setToken()?

Perfect answer:

localStorage.setItem() stores the token permanently so the user remains logged in even after a refresh. setToken() updates the React state immediately so all components using the context re-render and know that the user has logged in without waiting for a page refresh.

## suppose if we remove thesetToken () and User Login button dabata hai. Dashboard open ho gaya. Navbar mein likha hai Welcome Siddharth ! Kya Navbar turant update hoga? Ya refresh karne ke baad? Aur kyun?

Since setToken() is not called, the React state inside AuthProvider never changes. Because the Provider's value remains the same, React does not re-render the components consuming the context. Therefore, components like Navbar continue displaying the old UI until the application reloads and reads the token from localStorage.

## What does setToken() means ?

setToken(response.data.token); Ye sirf value change nahi karta. Ye React ko signal bhi deta hai: "State update ho gayi hai. Ab jo components is state ko use karte hain unko re-render karo."

❌ Case 1 (Only localStorage)
localStorage.setItem("token", response.data.token);

Flow:

Login Success

↓

Token saved in localStorage ✅

↓

React state unchanged ❌

↓

Provider value unchanged ❌

↓

Navbar NOT re-rendered ❌

↓

Dashboard NOT re-rendered ❌

Result:

Navbar still shows

Login

Even though token exists in localStorage.

✅ Case 2 (localStorage + setToken)
localStorage.setItem("token", response.data.token);

setToken(response.data.token);

Flow:

Login Success

↓

Token saved in localStorage ✅

↓

React state updated ✅

↓

Provider value changed ✅

↓

React re-renders consumers ✅

↓

Navbar updated ✅

↓

Dashboard updated ✅

Now Navbar immediately changes to something like:

Welcome Siddharth
Logout

without refreshing the page.

## Suppose Login only does this:

localStorage.setItem("token", token);

and does not do:

setToken(token);

What will happen immediately after login?

Will the user be redirected to the Dashboard, or will they stay on the Login page until a refresh?

Think about ProtectedRoute and AuthContext before answering. This is the last missing piece before we start writing the fetchNotes() function.

ANSWER:

Imagine you have a school ID card.

There are 2 places where your ID exists.

Place 1: Your Wallet

This is like localStorage.

Wallet
│
└── School ID Card

Your wallet keeps the ID even if you go home, sleep, or come back tomorrow.

It doesn't disappear.

Place 2: Your Hand

This is like React Context (AuthContext).

Your Hand
│
└── School ID Card

Right now you're holding the ID.

Everyone can immediately see you have it.

Now let's relate it to React.

Before Login

localStorage = ""

AuthContext = ""

No token anywhere.

After Login

Backend sends:

TOKEN_123

Now we do two things.

localStorage.setItem("token", TOKEN_123);

This puts the token in the wallet.

AND

setToken(TOKEN_123);

This puts the token in your hand.

Now the situation is:

Wallet (localStorage)
↓

TOKEN_123

Hand (AuthContext)
↓

TOKEN_123

Now suppose Dashboard is checking
const { token } = useContext(AuthContext);

It asks:

"Do we have a token?"

Answer:

Yes

↓

Dashboard opens

Now imagine we DON'T call setToken().

We only do:

localStorage.setItem("token", TOKEN_123);

Now what happens?

Wallet

↓

TOKEN_123

But

Hand

↓

Empty

React components only look at the hand (Context).

They are not continuously checking the wallet (localStorage).

So Dashboard asks:

"Do we have a token?"

Context says:

No

because we never updated it.

Therefore

ProtectedRoute

↓

No Token

↓

Login Page

Even though the token exists in localStorage!

Then when does React read localStorage?

Only once.

Remember this code?

const [token, setToken] = useState(
    localStorage.getItem("token") || ""
);

When does this line execute?

👉 Only when AuthProvider is created.

And when is AuthProvider created?

When the app starts.

Example:

F5

↓

React Starts

↓

AuthProvider Created

↓

Reads localStorage

↓

Copies token into Context

After that,

React never goes back to localStorage unless you explicitly tell it to.

Let's see the two scenarios.

Scenario 1 (Correct)

localStorage.setItem("token", token);
setToken(token);

Flow:

Login

↓

Save in localStorage

↓

Update Context

↓

React re-renders

↓

ProtectedRoute sees token

↓

Dashboard opens

Works immediately. ✅

Scenario 2 (Wrong)

localStorage.setItem("token", token);

Flow:

Login

↓

Save in localStorage

↓

Context NOT updated

↓

ProtectedRoute still sees ""

↓

Stay on Login page

The token exists in localStorage, but React doesn't know about it.

What if the user presses F5 now?

Now React starts again.

AuthProvider runs:

useState(localStorage.getItem("token") || "");

This time it finds:

TOKEN_123

Now Context becomes:

TOKEN_123

ProtectedRoute checks again:

Token Found

↓

Dashboard

Now it works.

This is why we need BOTH
localStorage.setItem("token", token);

Purpose:

✅ Keep the token after refresh.

setToken(token);

Purpose:

✅ Tell React right now that the user is logged in.

The golden rule 🌟

Think of it like this:

localStorage = Long-term storage (the cupboard/wallet).
AuthContext = Live React state (what the app is currently using).

React doesn't watch localStorage for changes.

React does watch its own state.

That's why after login we update both.