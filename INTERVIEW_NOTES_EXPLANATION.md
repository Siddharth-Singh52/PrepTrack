## Interviewer: Explain the complete authentication flow in your project.

Answer:

"In my project, authentication is implemented using JWT (JSON Web Token) and bcrypt.

When a user registers, the frontend sends the user's name, email, and password to the backend using a POST request.

The request first reaches the Express router, which forwards it to the authentication controller.

Inside the controller, I first validate that all required fields are present. Then I check whether the email already exists in MongoDB using User.findOne(). If the user already exists, I return an error response.

If the email is unique, I hash the password using bcrypt before storing it. This ensures that the original password is never saved in the database.

After successfully creating the user, I generate a JWT containing only the user's unique ID using jwt.sign() and return that token to the frontend.

During login, the frontend sends the email and password. The backend finds the user using the email and compares the entered password with the stored hashed password using bcrypt.compare(). If the credentials are correct, a new JWT is generated and returned.

For protected routes, the frontend sends this JWT in the Authorization header using the Bearer format. An authentication middleware extracts the token, verifies it using jwt.verify(), retrieves the user from MongoDB using the decoded ID, attaches the user to req.user, and then calls next().

After that, any protected controller can directly access the logged-in user through req.user without verifying the token again."