# Code Collaboration Platform

Section 2

Project Goal
Students often share code through WhatsApp or GitHub, making collaboration difficult.

This platform enables developers to collaboratively edit, execute, and save code in real time from any browser.

Section 3

Objectives
• Learn full-stack development

• Learn Socket.io

• Learn JWT Authentication

• Learn MongoDB

• Learn Monaco Editor

• Learn Deployment

Section 4

Features
Authentication

Register

Login

Logout

JWT Authentication

Protected Routes

Profile


Room
Create Room

Join Room

Leave Room

Delete Room

Room Invitation



Editor
Monaco Editor

Syntax Highlighting

Theme Change

Multiple Languages

Auto Save


Collaboration
Real-time Editing

Cursor Sync (Future)

Online Users

Typing Indicator


Chat
Send Message

Receive Message

Message Timestamp


Storage
Save Code

Load Code

History


Execution
Run Code

View Output

Error Output


Deplayment
Frontend

Backend

Database


System Architecture
                User

                 │

          React Frontend

                 │

       Axios + Socket.io

                 │

          Express Server

         /             \

MongoDB Atlas     Code Execution API

         |

Authentication

Projects

Rooms

Chats


Tech Stack
Frontend

React
React Router
Axios
Tailwind CSS
Monaco Editor
Socket.io Client

Backend
Node.js
Express
Socket.io
JWT
bcrypt
Mongoose
dotenv

Database
MongoDB Atlas

Deployment
Frontend → Vercel
Backend → Render
Database → MongoDB Atlas
