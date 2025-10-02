

# SavorLog: MERN Stack Meal Planner 🥕📅

SavorLog is a full-stack web application designed to help users manage their recipes and plan weekly meals using a drag-and-drop calendar interface.

**Author:** Marjory D. Marquez

The application is built using the MERN stack:
* **MongoDB:** Database for storing recipes and meal plans.
* **Express.js & Node.js:** Backend API server.
* **React:** Frontend user interface (this repository).

***

## 🚀 Getting Started

### Prerequisites

* Node.js (LTS recommended)
* MongoDB Instance (Local or Cloud/Atlas)

### 1. Setup Backend (Assuming it's a separate directory)

1.  Navigate to your backend directory (e.g., `savorlog-backend`).
2.  Install dependencies: `npm install`
3.  **Crucially, create a `.env` file** in the backend root directory to hold your MongoDB connection string and other secrets. **This file is ignored by Git for security.**
    ```
    # .env Example Content:
    MONGO_URI="mongodb+srv://<dbUser>:<dbPassword>@cluster-name.mongodb.net/savorlogDB?retryWrites=true&w=majority"
    PORT=5000
    ```
    > **Note:** Replace `<dbUser>`, `<dbPassword>`, and `cluster-name.mongodb.net` with your actual MongoDB Atlas connection details.

4.  Start the backend server: `npm start` (or a similar script).

### 2. Setup Frontend

1.  Navigate to this directory (`savorlog-frontend`).
2.  Install dependencies: `npm install`
3.  Start the React application: `npm run dev`

The frontend application should now be accessible at `http://localhost:5173` (or the port specified by Vite).

***

## Frontend Components

* **`App.jsx`**: Main layout, state management, and recipe data fetching.
* **`MealPlanner.jsx`**: Calendar interface with Drag and Drop for scheduling.
* **`RecipeForm.jsx`**: Component for adding new recipes via the API.
* **`src/api/api.js`**: Centralized functions for interacting with the Express API.


-----


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
