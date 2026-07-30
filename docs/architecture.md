                        User (Browser)
                              │
                              ▼
                    React Frontend (Vite)
                              │
             ┌────────────────┴────────────────┐
             │                                 │
             ▼                                 ▼
        REST API (Axios)             Socket.io Client
             │                                 │
             └────────────────┬────────────────┘
                              ▼
                  Express + Node.js Server
             ┌────────────────┼─────────────────┐
             ▼                ▼                 ▼
      Authentication      MongoDB Atlas     Socket.io Server
      (JWT + bcrypt)          │
                              ▼
                     Users, Rooms, Projects, Chats
                              │
                              ▼
                    Code Execution Service
                  (Piston API or Judge0 API)