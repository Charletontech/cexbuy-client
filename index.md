Yes, you can absolutely use the **`jsonwebtoken`** package in your **Node.js server** to **sign, verify, and decode JWT tokens**. In fact, **`jsonwebtoken`** is one of the most commonly used packages for handling JWT tokens in a Node.js environment.

I'll show you how to update the example to use **`jsonwebtoken`** (instead of `jwt-simple`, which is another JWT library), and how to store the JWT in **HttpOnly cookies**.

### Updated Implementation Using `jsonwebtoken`

### **1. Backend (Node.js + Express)**

#### a) Install `jsonwebtoken`

First, if you haven't installed `jsonwebtoken`, you can install it like this:

```bash
npm install jsonwebtoken
```

#### b) Update Server to Use `jsonwebtoken`

Here’s how you can modify the backend to use `jsonwebtoken` to generate, verify, and decode the JWT.

```js
// server.js
const express = require("express");
const jwt = require("jsonwebtoken"); // Use jsonwebtoken instead of jwt-simple
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // To handle cookies

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // Allow cross-origin requests
app.use(bodyParser.json());
app.use(cookieParser()); // To parse cookies from requests

// Mock User Database
const users = [
  { id: 1, username: "user", password: "password" }, // Example user
];

// Secret Key (for JWT encoding/decoding)
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.cookies["access_token"]; // Get token from HttpOnly cookie

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Use jwt.verify for decoding and verifying the token
    req.user = decoded; // Attach decoded info to the request
    next(); // Continue to the protected route
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token." });
  }
};

// Login route to authenticate user and return a token in HttpOnly cookie
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Find user from mock database
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Create JWT Token
  const payload = { id: user.id, username: user.username };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" }); // Use jwt.sign to create the token

  // Set the token in HttpOnly cookie
  res.cookie("access_token", token, {
    httpOnly: true, // Cannot be accessed by JavaScript
    secure: process.env.NODE_ENV === "production", // Ensures cookies are only sent over HTTPS in production
    maxAge: 3600000, // Expire after 1 hour
    sameSite: "Strict", // Prevents sending cookies with cross-origin requests
  });

  return res.json({ message: "Logged in successfully" });
});

// Protected route (example)
app.get("/protected", verifyToken, (req, res) => {
  // This route will only be accessible if the user has a valid token
  res.json({ message: `Welcome, ${req.user.username}!` });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

### **Key Updates with `jsonwebtoken`**:

1. **JWT Signing** (`jwt.sign`):
   - We use `jwt.sign()` to create a signed token, including a payload (user data) and an expiration time (`expiresIn: '1h'`).
2. **JWT Verification** (`jwt.verify`):
   - In the `verifyToken` middleware, we use `jwt.verify()` to decode and verify the token, ensuring it is valid and not expired.
3. **Setting the token in HttpOnly cookie**:
   - The JWT token is now stored in an **HttpOnly cookie** using `res.cookie()`.

---

### **2. Frontend (React)**

On the **React client** side, we don’t need to handle the token explicitly (since it’s stored in the **HttpOnly cookie**). However, we still need to make requests with the `credentials: 'include'` option so that the **cookie** is sent with every request.

#### a) **Login Component**:

No major changes are needed here. The client just needs to send the login request and the server will set the token in the HttpOnly cookie.

```jsx
// Login.js
import React, { useState } from "react";
import axios from "axios";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/login",
        { username, password },
        { withCredentials: true }
      );
      window.location.href = "/dashboard"; // Redirect after successful login
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
```

#### b) **Dashboard Component**:

For the **protected route** (`Dashboard`), the React app just needs to make a request to the server with the `withCredentials: true` flag to send the **HttpOnly cookie** automatically with each request.

```jsx
// Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/protected", { withCredentials: true })
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        setMessage("Access denied. Please log in again.");
      });
  }, []);

  return <div>{message}</div>;
};

export default Dashboard;
```

### **Key Updates with `jsonwebtoken`**:

1. The **token** is still being sent with the request automatically from the **HttpOnly cookie**, and we’re using `withCredentials: true` to ensure the cookie is included.
2. The server-side logic for **signing** and **verifying the token** is handled using **`jsonwebtoken`**.

---

### **3. Running the Application**

1. **Backend (Node.js)**:

   - Make sure you are running your **Node.js server**:
     ```bash
     node server.js
     ```

2. **Frontend (React)**:
   - Run the **React app**:
     ```bash
     npm start
     ```

---

### **Conclusion**

Yes, you can and should use **`jsonwebtoken`** to handle JWT authentication securely in your backend. By storing the JWT in an **HttpOnly cookie**, you minimize the risks of **XSS attacks**, as the token can't be accessed by JavaScript. The **React frontend** just makes requests as usual with `axios`, and the token is automatically included via the **cookie** with `withCredentials: true`.

This method ensures that the JWT is both **secure** and **convenient**, as it’s automatically included in every request without you needing to manually add it to each header.
