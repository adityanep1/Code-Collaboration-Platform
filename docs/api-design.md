# API Design

## Authentication

POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile
PUT /api/auth/profile

## Rooms

POST /api/rooms
GET /api/rooms
GET /api/rooms/:id
DELETE /api/rooms/:id

## Projects

GET /api/projects/:roomId
PUT /api/projects/:roomId

## Chat

GET /api/chats/:roomId
POST /api/chats