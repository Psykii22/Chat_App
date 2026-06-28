<!-- Project overview and setup guide. -->

# Chat App

A full-stack, real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO. The frontend features a beautiful, modern UI powered by Shadcn UI and Tailwind CSS v4.

## Features

- **Real-time Messaging:** Powered by Socket.IO for instantaneous communication.
- **Group Chats:** Create and manage group conversations with multiple users.
- **Image Uploads:** Share images locally via Multer.
- **Modern UI:** Built with Vite, React 19, Tailwind CSS v4, and Shadcn components (`<Card>`, `<Dialog>`, `<ScrollArea>`, `<Avatar>`, etc.).
- **Authentication:** Secure JWT-based authentication with HTTP-only cookies and bcrypt password hashing.
- **State Management:** Uses Zustand for lightweight global state.

## Tech Stack

**Client:** React, Vite, Tailwind CSS v4, Shadcn UI, Zustand, Axios, React-Router, Lucide-React
**Server:** Node.js, Express, MongoDB Atlas, Mongoose, Socket.IO, Multer, JWT, Bcrypt

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Psykii22/Chat_App.git
   cd Chat_App
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```
   Start the backend:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```
   Start the frontend:
   ```bash
   npm run dev
   ```

4. **Enjoy chatting!**
   Open your browser to `http://localhost:5173`.
