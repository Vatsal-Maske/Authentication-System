# Node.js Authentication System

A robust authentication system built with Node.js, Express, and MongoDB. This project supports user registration, login, JWT authentication, email verification (with OTP), session management, and secure password handling.

## Features

- User registration and login
- Email verification with OTP
- JWT-based authentication
- Session management (logout, logout all)
- Secure password hashing (bcrypt)
- Environment variable configuration
- Nodemailer integration for email

## Technologies Used

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcryptjs
- Nodemailer (with Gmail OAuth2)
- dotenv

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB database
- Google account for email (OAuth2 or App Password)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:

   ```env
   MONGOO_URI=your-mongodb-uri
   JWT_SECRET=your-jwt-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_REFRESH_TOKEN=your-google-refresh-token
   GOOGLE_USER=your-email@gmail.com
   ```

4. Start the server:

   ```bash
   npm start
   ```

## API Endpoints

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login user
- `POST /api/auth/verify-email` — Verify email with OTP
- `POST /api/auth/logout` — Logout current session
- `POST /api/auth/logout-all` — Logout from all sessions

## Folder Structure

```
├── src
│   ├── app.js
│   ├── config
│   │   ├── config.js
│   │   └── database.js
│   ├── controllers
│   │   └── auth.controller.js
│   ├── models
│   │   ├── user.model.js
│   │   └── session.model.js
│   ├── routes
│   │   └── auth.routes.js
│   ├── services
│   │   └── email.service.js
│   └── utils
│       └── utils.js
├── package.json
├── server.js
└── .env
```

## License

This project is licensed under the MIT License.