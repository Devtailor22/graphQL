
**Project Management System**

This is a Project Management System designed to streamline the process of managing client details and project information. The system allows multiple users to create accounts, add client and project details, and receive reminders for project deadlines. Completed projects are archived for future reference. The platform is built with modern technologies to ensure an efficient and user-friendly experience.

**Key Features:**
User Authentication:
Secure login and user registration system using password hashing (with Crypto) to ensure user data privacy.

**Client & Project Management:**
Users can easily add and manage client and project details in a simple yet efficient table format.

**Project Deadlines & Reminders:**
Set project deadlines and receive timely notifications when they are near completion using Cron for scheduled tasks and NodeMailer for email reminders.

**Data Filtering & Sorting:**
Advanced functionality for filtering, sorting, and paginating both client and project data for quick access.

**Archive Completed Projects:**
Once a project is completed, it is saved in the archive, helping you keep track of past projects while maintaining an organized workspace.

**Tech Stack:
Backend**:

GraphQL Apollo Server for handling API requests
Node.js & TypeScript for backend logic
Mongoose & MongoDB for database management
Cron for scheduling project reminders
NodeMailer for sending email notifications
Crypto for secure password hashing

**Frontend:**

Vue.js & Vite.js for building a fast and responsive user interface
Vue-Composable for GraphQL API integration
Vue Router for seamless navigation
Pinia for state management
How It Works:
Sign Up & Login: Users can create an account and securely log in to the platform.
Add Clients & Projects: Once logged in, users can easily add new client and project details.
Manage Projects: Set deadlines, filter and sort data, and track project progress.
Notifications: Get notified via email when a project’s deadline is approaching.
Archives: Completed projects are archived to maintain a clean workspace.
