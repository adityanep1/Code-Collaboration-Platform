# Database Design

## User Collection

- _id
- name
- email
- password
- avatar
- createdAt
- updatedAt

## Room Collection

- _id
- roomName
- roomCode
- owner
- members
- language
- createdAt

## Project Collection

- _id
- roomId
- code
- language
- updatedAt

## Chat Collection

- _id
- roomId
- sender
- message
- timestamp