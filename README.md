
docker buildx build --platform linux/amd64 -t tranhieuphuc/express-api:latest --push .

**workflow** to implement a **"single active session + expiration-based access control"** system using `Express.js + MongoDB + JWT`:



## 🔄 **User Authentication Workflow (with session control + expiration)**



### 🔹 1. **User Registration**

* User sends phone number + password.
* Password is hashed with `bcrypt`.
* `startDate` is set to current time.
* `endDate` is set to 30 days later (or a specific duration).

```js
router.post("/register", async (req, res) => {

    try {
        const { phoneNumber, password } = req.body;

        if (!phoneNumber || !password) {
            return res.status(400).json({ msg: "Phone number and password are required" });
        }

        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({ phoneNumber, password: hash });
        await newUser.save();

        res.status(200).json({ msg: "User registered" });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});
```
✅ Fields saved:

```js
{
  phoneNumber: "0123456789",
  password: "<hashed_password>",
  startDate: new Date(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  token: null
}
```

---

### 🔹 2. **User Login**

* User submits phone number + password.
* If valid:

  * A new JWT is created.
  * This JWT is **saved in the user's `token` field** in the database (invalidating any other device/session).
* Response includes the new JWT.

✅ Only one device stays logged in at a time.

```js
router.post("/login", async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;


        const user = await User.findOne({ phoneNumber });
        if (!user) return res.status(400).json({ msg: "Invalid Phone Number" });


        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) return res.status(400).json({ msg: "Invalid Password" });


        // Check if user has expired
        if (user.endDate && new Date() > new Date(user.endDate)) {
            return res.status(403).json({ msg: "Account expired. Please renew." });
        }

        // Create a new JWT token 
        const token = JWT.sign({ id: user._id, phoneNumber: user.phoneNumber }, process.env.JWT_SECRET, { expiresIn: "10d" });

        // Save to db
        user.token = token;
        await user.save();

        res.status(200).json({
            msg: "Login successful",
            token,
        });

    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    } finally {
        console.log("/login route executed");
    }
});
```

---

### 🔹 3. **Protected Routes (with Middleware)**

* All protected routes use `authMiddleware.js`:

  * Verifies JWT.
  * Finds user by `decoded.id`.
  * Compares JWT in request vs `user.token` in DB.
  * Checks if `endDate > current date`.
```js

const auth = async (req, res, next) => {
    // Get the token from header 
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ msg: "User not found" });
        }

        // Check if user has expired
        if (user.endDate && new Date() > new Date(user.endDate)) {
            return res.status(403).json({ msg: "Account expired. Please renew." });
        }
        req.user = user;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ msg: "Token has expired" });
        }

        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ msg: "Token is invalid" });
        }

        // Any other JWT-related error
        return res.status(401).json({ msg: "Authentication failed", error: err.message });
    } finally {
        console.log("Auth middleware executed");
    }
};
```

✅ If expired → return `403 Forbidden` with message like:

> `"Account expired. Please renew your subscription."`

✅ If token doesn't match → return `401 Unauthorized`.

---

### 🔹 4. **User Logout**

* User hits `/logout` with a valid JWT in headers.
* Middleware verifies user.
* Sets `user.token = null` in DB.
* Returns success message.

✅ Invalidates token and logs out current device.
```js
router.post("/logout", auth, async (req, res) => {
    try {
        req.user.token = null;
        await req.user.save();

        res.json({ msg: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Logout failed", error: err.message });
    } finally {
        console.log("/logout route executed");
    }
});
```

---

### 🔹 5. **Account Expiration Handling**

* Expiration is based on `endDate`.
* In future you can add an admin panel or payment hook to **extend** the user's `endDate`.

✅ Example:

```js
user.endDate = new Date(user.endDate.getTime() + 30 * 24 * 60 * 60 * 1000);
await user.save();
```

---

## 🧪 How to Test

### 🧪 A. Create a user (via Postman or registration)

**POST** `/api/users/register`

```json
{
  "phoneNumber": "0123456789",
  "password": "mypassword"
}
```

---

### 🧪 B. Login

**POST** `/api/users/login`

```json
{
  "phoneNumber": "0123456789",
  "password": "mypassword"
}
```

✅ Response:

```json
{
  "msg": "Login successful",
  "token": "<JWT_TOKEN>"
}
```

---

### 🧪 C. Access protected route with token

**GET** `/api/users/profile`
Headers:

```
Authorization: Bearer <JWT_TOKEN>
```

* ✅ If account is valid → returns welcome message
* ❌ If account is expired → returns `403 Account expired`

---

### 🧪 D. Manually expire the user (simulate)

In MongoDB Compass or a script:

```js
await User.updateOne(
  { phoneNumber: "0123456789" },
  { $set: { endDate: new Date(Date.now() - 1000 * 60) } } // 1 min in the past
);
```

Then re-test `/profile`. You should get:

```json
{
  "msg": "Account expired. Please renew."
}
```

---

### 🧪 E. Logout

**POST** `/api/users/logout`
Headers:

```
Authorization: Bearer <JWT_TOKEN>
```

✅ Response:

```json
{ "msg": "Logged out successfully" }
```

---




