# IntelliSQR-Full-Stack-Development-internship
It is a internship Assignment
Fullstack Intern Project - Backend Overview
This Node.js + Express + TypeScript backend provides user authentication and serves the React frontend. It includes:

1. Technology Stack
Node.js & Express: Backend framework for handling requests.

Prisma: ORM for database interactions.

Bcrypt.js: Secure password hashing.

JWT (JsonWebToken): Authentication via tokens.

Zod: Schema validation for user input.

CORS: Cross-origin resource sharing to allow frontend access.

2. Key Features
✅ User Registration

Accepts email and password (validated via Zod).

Hashes passwords before storing in the database.

Responds with a success message and stored user data.

✅ User Login

Checks if the user exists in the database.

Verifies password using bcrypt.

Issues a JWT token upon successful authentication.

✅ Serving React Frontend

Serves frontend files from /frontend/build.

Handles all unknown routes by sending index.html.

3. Endpoints
Method	Endpoint	Description
POST	/register	Registers a new user
POST	/login	Logs in a user and returns a JWT token
GET	*	Serves the frontend React app

import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';
import morgan from 'morgan';
import helmet from 'helmet';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

app.post('/register', async (req, res) => {
    try {
        const validatedData = userSchema.parse(req.body);
        const existingUser = await prisma.user.findUnique({ where: { email: validatedData.email } });
        if (existingUser) return res.status(400).json({ error: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);
        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                password: hashedPassword
            }
        });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const validatedData = userSchema.parse(req.body);
        const user = await prisma.user.findUnique({ where: { email: validatedData.email } });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(validatedData.password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Middleware to authenticate users
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ email: user.email });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Serve frontend build files
type StaticRequest = express.Request & { params: { any: string } };
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req: StaticRequest, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(5000, () => console.log('Server running on port 5000'));

fullstack-intern-assignment/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env
│   ├── package.json
│   ├── README.md
│   └── tsconfig.json
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env
│   ├── package.json
│   ├── README.md
│   └── tsconfig.json
└── README.md
