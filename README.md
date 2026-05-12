# AlgoVerse 🚀  
### AI-Powered Interactive DSA Learning Platform

AlgoVerse is a modern full-stack MERN application designed to make Data Structures and Algorithms (DSA) learning more interactive, visual, and engaging.

Unlike traditional static learning resources, AlgoVerse combines:
- 🤖 AI-generated explanations
- 🎨 Live algorithm visualizations
- 💻 Interactive code playgrounds
- ⚡ Real-time JSX rendering
- 🔐 Secure authentication
- 🌙 Modern responsive UI

The platform transforms abstract DSA concepts into dynamic visual learning experiences powered by AI and modern web technologies.

---

# 🌟 Features

## 🤖 AI-Generated Algorithm Explanations
Generate simplified explanations and learning modules using LLM APIs.

## 🎨 Interactive Algorithm Visualizations
Step-by-step animated visualizations for algorithms like:
- Binary Search
- Bubble Sort
- Merge Sort
- Heap Sort
- KMP Algorithm
- Insertion Sort

## 💻 Integrated Code Playground
Run and modify algorithms directly inside the platform using:
- JavaScript
- Python
- C++

## ⚡ Live JSX Rendering
Algorithms are dynamically rendered from database-stored JSX using `react-live`, enabling instant content generation without redeployment.

## 🔐 Authentication & Personalized Dashboards
Integrated Clerk authentication system for:
- Secure login/signup
- Personalized learning experience
- User-specific algorithm management

## ✅ Human Verification System
Algorithms can be marked as “Human Verified” using role-based verification.

## 🌙 Dark Mode Support
Fully responsive UI with persistent dark/light theme support.

## 📚 Curated Practice Problems
Integrated external practice links from:
- LeetCode
- HackerRank
- Codeforces

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- react-live

## Backend
- Node.js
- Express.js

## Database
- MongoDB
- Mongoose

## Authentication
- Clerk

## Deployment
- Vercel

## APIs & Tools
- OpenAI / Groq APIs
- Git & GitHub

---

# 🏗️ System Architecture

```text
User
   ↓
Frontend (React + Vite)
   ↓
Backend API (Node.js + Express)
   ↓
MongoDB Atlas
   ↓
LLM APIs + Clerk Authentication
