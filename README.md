


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

### 🛠️ `PATCH /api-hd/version/min`

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
        },
        {
            "anh_xe_path": "/2. Air Blade/2. Air Blade FI 110 2010 (ACA110CBFA)/anh_dong_xe.png",
            "anh_xe_url": "https://storage.googleapis.com/phutunghd-e6a33.appspot.com/2.%20Air%20Blade/2.%20Air%20Blade%20FI%20110%202010%20%28ACA110CBFA%29/anh_dong_xe.png",
            "id": "2",
            "ten_xe": "Air Blade FI 110 2010 (ACA110CBFA)",
        },
        {
            "anh_xe_path": "/2. Air Blade/3. Air Blade 110 2011 (ACA110CBFB)/anh_dong_xe.png",
            "anh_xe_url": "https://storage.googleapis.com/phutunghd-e6a33.appspot.com/2.%20Air%20Blade/3.%20Air%20Blade%20110%202011%20%28ACA110CBFB%29/anh_dong_xe.png",
            "id": "3",
            "ten_xe": "Air Blade 110 2011 (ACA110CBFB)",            
        }
        ...
    ]
},
...

```

#### ❌ Error Responses

* `500`: Server error

---

### 🔎 `GET /api-hd/dong-xe/:id`

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
        },
        {
            "anh_xe_path": "/2. Air Blade/2. Air Blade FI 110 2010 (ACA110CBFA)/anh_dong_xe.png",
            "anh_xe_url": "https://storage.googleapis.com/phutunghd-e6a33.appspot.com/2.%20Air%20Blade/2.%20Air%20Blade%20FI%20110%202010%20%28ACA110CBFA%29/anh_dong_xe.png",
            "id": "2",
            "ten_xe": "Air Blade FI 110 2010 (ACA110CBFA)",            
        },
        {
            "anh_xe_path": "/2. Air Blade/3. Air Blade 110 2011 (ACA110CBFB)/anh_dong_xe.png",
            "anh_xe_url": "https://storage.googleapis.com/phutunghd-e6a33.appspot.com/2.%20Air%20Blade/3.%20Air%20Blade%20110%202011%20%28ACA110CBFB%29/anh_dong_xe.png",
            "id": "3",
            "ten_xe": "Air Blade 110 2011 (ACA110CBFB)",
        }
        ...
    ]
}
```

#### ❌ Error Responses

* `404`: DongXe not found
* `500`: Server error

---
  
### **🔹 9. Get a `doi-xe` document by ID**

### 🔍 `GET /api-hd/doi-xe/:id`

Returns a specific `doi_xe` document by its MongoDB `_id`.

#### 🔐 Authentication

Requires Bearer token.



#### 🔧 Parameters

| Param | Type     | Description                        |
| ----- | -------- | ---------------------------------- |
| `:id` | `string` | The `_id` of the `doi_xe` document |

---

#### ✅ Success Response

```json
{
  "_id": "Lead 125 2025 (NHX125S)",
  "data": [
    {
      "ten_phu_tung": "E-2 Chụp nắp quy lát",
      "anh_phu_tung_path": "3. Lead/12. Lead 125 2025 (NHX125S)/E-2.jpg",
      "anh_phu_tung_url": "https://storage.googleapis.com/...",
      "ds_chi_tiet": [
        {
          "id": "1",
          "ma_chi_tiet": "12300K0RV00",
          "ten_chi_tiet": "COVER ASSY., CYLINDER HEAD",
          "gia": "250000"
        },
        ...
      ]
    },
    ...
  ]
}
```

---

#### ❌ Error Responses

| Code  | Description       |
| ----- | ----------------- |
| `404` | `DoiXe` not found |
| `500` | Server error      |



---

### **🔹 10. Update a `gia` (ds-chi-tiet) by `ma_chi_tiet`**

### 🛠️ `PATCH /api-hd/doi-xe/:id/ds-chi-tiet/:id2`

Updates a specific `ds_chi_tiet` (part detail) inside a `doi-xe` document, identified by `ma_chi_tiet`.

#### 🔐 Authentication

Requires Bearer token.



#### 🔧 Parameters

| Param  | Type     | Description                                    |
| ------ | -------- | ---------------------------------------------- |
| `:id`  | `string` | The `_id` of the `doi_xe` document             |
| `:id2` | `string` | The `ma_chi_tiet` (part detail code) to update |

---

#### 📦 Request Body

Include any fields to update. Example:

```json
{
  "gia": "230000",
}
```



#### ✅ Success Response

```json
{
  "message": "Chi tiet '12300K0RV00' updated successfully in part 'E-2 Chụp nắp quy lát'",
  "doiXe": {
      "_id": "Lead 125 2025 (NHX125S)",
   "data": [
            {
                "anh_phu_tung_path": "3. Lead/12. Lead 125 2025 (NHX125S)/E-2.jpg",
                "anh_phu_tung_url": "https://storage.googleapis.com/phutunghd-e6a33.appspot.com/3.%20Lead/12.%20Lead%20125%202025%20%28NHX125S%29/E-2.jpg",
                "ds_chi_tiet": [
                    {
                        "gia": "230000",
                        "id": "1",
                        "ma_chi_tiet": "12300K0RV00",
                        "ten_chi_tiet": "COVER ASSY., CYLINDER HEAD"
                    },
                    {
                        "gia": "197000",
                        "id": "2",
                        "ma_chi_tiet": "12391K1NV01",
                        "ten_chi_tiet": "GASKET, CYLINDER HEAD COVER"
                    },
                    {
                        "gia": "6000",
                        "id": "3",
                        "ma_chi_tiet": "957010601800",
                        "ten_chi_tiet": "Bulong 6X18"
                    }
                ],
                "ten_phu_tung": "E-2 Chụp nắp quy lát"
            },
      ...
    ]
  }
}
```



#### ❌ Error Responses

| Code  | Description                              |
| ----- | ---------------------------------------- |
| `400` | Missing or invalid parameters            |
| `404` | `DoiXe` document or `chi tiet` not found |
| `500` | Server error                             |








