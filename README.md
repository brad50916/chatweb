# Chat App

This is a real-time chat application built using the PERN stack (PostgreSQL, Express.js, React.js, Node.js) and Material-UI (MUI). The application includes user authentication via JWT, user profile management, and instant messaging capabilities using Socket.io.

[Live Demo](https://chat-app-mern-mo.netlify.app/) 

## Features

- **User Authentication**: Sign up and sign in using JWT-based authentication.
- **User Search**: Search for other users by their username.
- **Instant Messaging**: Chat with other users instantly using Socket.io.
- **Profile Viewing**: View other users' profiles.
- **Profile Modification**: Modify your own profile.
- **Sign Out**: Sign out from the application.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: React.js, Material-UI (MUI)
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Real-time Communication**: Socket.io

## Getting Started

### Prerequisites

- Node.js and pnpm installed
- PostgreSQL installed and running

### Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/your-username/chat-app.git
    cd chat-app
    ```

2. **Backend Setup**:
    - Navigate to the `server` directory:
      ```sh
      cd server
      ```
    - Install dependencies:
      ```sh
      pnpm install
      ```
    - Create a `.env` file and add the following environment variables:
      ```env
      PORT=5000
      DATABASE_URL=your_database_url
      JWT_SECRET=your_jwt_secret
      ```
    - Run database migrations:
      ```sh
      npx sequelize-cli db:migrate
      ```
    - Start the backend server:
      ```sh
      npm start
      ```

3. **Frontend Setup**:
    - Navigate to the `client` directory:
      ```sh
      cd ../client
      ```
    - Install dependencies:
      ```sh
      npm install
      ```
    - Create a `.env` file and add the following environment variables:
      ```env
      REACT_APP_API_URL=http://localhost:5000
      ```
    - Start the frontend development server:
      ```sh
      npm start
      ```

## Usage

1. **Sign Up**: Create a new account.
2. **Sign In**: Log in with your credentials.
3. **Search Users**: Use the search functionality to find other users by their username.
4. **Chat**: Start a real-time chat with other users.
5. **View Profiles**: Check out other users' profiles.
6. **Edit Profile**: Modify your own profile information.
7. **Sign Out**: Log out from your account.

## Project Structure

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any questions or feedback, please contact [your-email@example.com].