# User Management System

A web-based User Management System built with Node.js, Express.js, and MongoDB for managing users. This application allows administrators to view, manage, and update user information, as well as deactivate accounts. It also provides a dashboard for users to manage their profile and settings.

## Features

- **User Login and Registration**: Users can register and log in to their account.
- **Profile Management**: Users can view and update their profile (name, email, phone).
- **Account Deactivation**: Users can deactivate their account permanently.
- **Admin Dashboard**: Admins can view all users and manage them.
- **Role-based Access**: Different features are accessible based on user roles.

## Tech Stack

- **Frontend**: 
  - HTML, CSS (TailwindCSS)
  - EJS (Embedded JavaScript templates)
- **Backend**:
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose (for database interaction)
  - JWT (JSON Web Tokens) for authentication
  - Flash messages for user notifications (connect-flash)
- **Session Management**: Express session for managing user sessions

## Getting Started

### Prerequisites

Before running the application, make sure you have the following installed:

- Node.js (>=12.x)
- MongoDB (locally or using a service like MongoDB Atlas)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/user-management-system.git
    cd user-management-system
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables**  
Create a `.env` file in the root directory and add the following:

    ```env
    MONGODB_URI=mongodb://localhost:27017/user-management
    SECRET_KEY=your-secret-key
    SESSION_SECRET=your-session-secret
    ```

4. **Run the application:**

    ```bash
    npm start
    ```

    The application will be running on `http://localhost:3000`.

### Usage

- Register a new user
- Login with the registered user
- Access the dashboard
- Edit your profile
- Admin can manage users

### Features Implementation

- **Login & Registration**: Authenticated using JWT. After registration, users can log in to their account.
- **Profile Management**: Users can view and update their profile, including name, phone number, and email.
- **Account Deactivation**: Users can deactivate their accounts permanently from the dashboard.
- **Admin Dashboard**: Admin users can view and manage all registered users.

## License

This project is licensed under the MIT License.