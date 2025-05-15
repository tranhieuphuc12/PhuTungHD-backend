


## 🔄 **User Authentication Workflow (with session control + expiration)**

## Base URL: `https://mvpauto.id.vn/api-hd/`

### 🔹 1. **User Registration**
#### URL:`/users/register`

* User sends phone number + password.
* Password is hashed with `bcrypt`.
* `startDate` is set to current time.
* `endDate` is set to 30 days later (or a specific duration).

### 🧪 A. Create a user (via Postman or registration)

**POST** `/api-hd/users/register`

```json
{
  "phoneNumber": "0123456789",
  "password": "mypassword"
}
```
---

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
#### URL:`/users/login`

* User submits phone number + password.
* If valid:

  * A new JWT is created.
  * This JWT is **saved in the user's `token` field** in the database (invalidating any other device/session).
* Response includes the new JWT.

✅ Only one device stays logged in at a time.

**POST** `/api-hd/users/login`

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


---

### 🔹 3. **Protected Routes (with Middleware)**

* All protected routes use `authMiddleware.js`:

  * Verifies JWT.
  * Finds user by `decoded.id`.
  * Compares JWT in request vs `user.token` in DB.
  * Checks if `endDate > current date`.


✅ If expired → return `403 Forbidden` with message like:

> `"Account expired. Please renew your subscription."`

✅ If token doesn't match → return `401 Unauthorized`.

---

### 🔹 4. **User Logout**
#### URL:`/users/logout`

* User hits `/logout` with a valid JWT in headers.
* Middleware verifies user.
* Sets `user.token = null` in DB.
* Returns success message.

✅ Invalidates token and logs out current device.


**POST** `/api-hd/users/logout`
Headers:

```
Authorization: Bearer <JWT_TOKEN>
```

✅ Response:

```json
{ "msg": "Logged out successfully" }
```

---

### 🔹 5. **Extend the user's account expiration.**


Authenticated users can renew their account by providing a time duration in the request header.

#### 🔐 Headers

| Key        | Required | Example | Description                      |
| ---------- | -------- | ------- | -------------------------------- |
| `duration` | ✅ Yes    | `7d`    | Time to extend (e.g. `7d`,`30d`, `2h`) |

#### ✅ Success Response

```json
{
  "msg": "Renewed successfully",
  "startDate": "2025-05-15T08:30:00.000Z",
  "endDate": "2025-05-22T08:30:00.000Z"
}
```


---
### 🔹 6. **Get Min supported version**


### 📦 `GET /api-hd/version/min`

**Fetch the minimum supported app version.**

Returns the lowest app version supported by the system.

#### ✅ Success Response

```json
{
  "min_support_version": "1.0.0"
}
```

#### ❌ Error Responses

* `404`: Version not found
* `500`: Server error

---

### 🛠️ `POST /api-hd/version/min`

**Set or update the minimum supported version.**

#### 📥 Request Body

```json
{
  "min_support_version": "1.2.0"
}
```

#### ✅ Success Response

### 🔹 7. **Get all `ds_dong_xe` records**
### 🚗 `GET /api-hd/ds-dong-xe`

Returns all available ds_dong_xe in the system.


#### 🔐 Authentication

Requires Bearer token.

#### ✅ Success Response

```json
[
    {
        "_id": "1",
        "anh_xe_path": "/1. Vision/anh_dong_xe.png",
        "anh_xe_url": "https://storage.googleapis.com/phutunghd-e6a33.appspot.com/1.%20Vision/anh_dong_xe.png",
        "ten_dong_xe": "Vision"
    },
    {
        "_id": "2",
        "anh_xe_path": "/2. Air Blade/anh_dong_xe.png",
        "anh_xe_url": "https://storage.googleapis.com/phutunghd-e6a33.appspot.com/2.%20Air%20Blade/anh_dong_xe.png",
        "ten_dong_xe": "Air Blade"
    },
]   
```

#### ❌ Error Responses

* `404`: No car models found
* `500`: Server error

--- 

### **🔹 8. Get all `dong-xe` records**
### 🚘 `GET /api-hd/dong-xe`



Returns the full list of dong_xe.

#### 🔐 Authentication

Requires Bearer token.

#### ✅ Success Response

```json
{
    "_id": "Air Blade",
    "data": [
        {
            "anh_xe_path": "/2. Air Blade/1. Air Blade 110 2008 (ANC110ACV8)/anh_dong_xe.png",
            "anh_xe_url": "https://storage.googleapis.com/phutunghd-e6a33.appspot.com/2.%20Air%20Blade/1.%20Air%20Blade%20110%202008%20%28ANC110ACV8%29/anh_dong_xe.png",
            "id": "1",
            "ten_xe": "Air Blade 110 2008 (ANC110ACV8)",
            "ds_chi_tiet": []
        },
        {
            "anh_xe_path": "/2. Air Blade/2. Air Blade FI 110 2010 (ACA110CBFA)/anh_dong_xe.png",
            "anh_xe_url": "https://storage.googleapis.com/phutunghd-e6a33.appspot.com/2.%20Air%20Blade/2.%20Air%20Blade%20FI%20110%202010%20%28ACA110CBFA%29/anh_dong_xe.png",
            "id": "2",
            "ten_xe": "Air Blade FI 110 2010 (ACA110CBFA)",
            "ds_chi_tiet": []
        },
        {
            "anh_xe_path": "/2. Air Blade/3. Air Blade 110 2011 (ACA110CBFB)/anh_dong_xe.png",
            "anh_xe_url": "https://storage.googleapis.com/phutunghd-e6a33.appspot.com/2.%20Air%20Blade/3.%20Air%20Blade%20110%202011%20%28ACA110CBFB%29/anh_dong_xe.png",
            "id": "3",
            "ten_xe": "Air Blade 110 2011 (ACA110CBFB)",
            "ds_chi_tiet": []
        }
        ...
    ]
    ....
}

```

#### ❌ Error Responses

* `500`: Server error

---

### 🔎 `GET /api-hd/dong_xe/:id`

**Get a specific `DongXe` by ID.**

Fetches details of a car type by its unique ID.

#### 🔐 Authentication

Requires Bearer token.

#### ✅ Success Response

```json
{
    "_id": "Air Blade",
    "data": [
        {
            "anh_xe_path": "/2. Air Blade/1. Air Blade 110 2008 (ANC110ACV8)/anh_dong_xe.png",
            "anh_xe_url": "https://storage.googleapis.com/phutunghd-e6a33.appspot.com/2.%20Air%20Blade/1.%20Air%20Blade%20110%202008%20%28ANC110ACV8%29/anh_dong_xe.png",
            "id": "1",
            "ten_xe": "Air Blade 110 2008 (ANC110ACV8)",
            "ds_chi_tiet": []
        },
        {
            "anh_xe_path": "/2. Air Blade/2. Air Blade FI 110 2010 (ACA110CBFA)/anh_dong_xe.png",
            "anh_xe_url": "https://storage.googleapis.com/phutunghd-e6a33.appspot.com/2.%20Air%20Blade/2.%20Air%20Blade%20FI%20110%202010%20%28ACA110CBFA%29/anh_dong_xe.png",
            "id": "2",
            "ten_xe": "Air Blade FI 110 2010 (ACA110CBFA)",
            "ds_chi_tiet": []
        },
        {
            "anh_xe_path": "/2. Air Blade/3. Air Blade 110 2011 (ACA110CBFB)/anh_dong_xe.png",
            "anh_xe_url": "https://storage.googleapis.com/phutunghd-e6a33.appspot.com/2.%20Air%20Blade/3.%20Air%20Blade%20110%202011%20%28ACA110CBFB%29/anh_dong_xe.png",
            "id": "3",
            "ten_xe": "Air Blade 110 2011 (ACA110CBFB)",
            "ds_chi_tiet": []
        }
        ...
    ]
}
```

#### ❌ Error Responses

* `404`: DongXe not found
* `500`: Server error







