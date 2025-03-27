***The library management system is designed to help employees (librarians) efficiently manage library books, members, and loan records through a user-friendly interface. It provides functionality for creating, viewing, updating, and deleting information across all key library resources. The system features secure user authentication, allowing staff to sign up and log in to their accounts, as well as profile management to update personal information. With built-in validation for input fields, the application ensures data integrity while enhancing productivity and organisation in library operations.***

**This apps **contain** the following features:**
* Registration
* Login
* Logout
* Update profile
* Add books
* View books
* Update books
* Delete books
* Add members
* View members
* Update members
* Delete members
* Add loans
* View loans
* Update loans
* Delete loans

---

## Jira Board URL
https://aprilshao27.atlassian.net/jira/software/projects/LMS/boards/34

---

## Project Setup Instructions

To set up this project, please install the following software and create account in following web tools
* **Nodejs [**[https://nodejs.org/en](https://nodejs.org/en)]
* **Git [**[https://git-scm.com/](https://git-scm.com/)]
* **VS code editor** [[https://code.visualstudio.com/](https://code.visualstudio.com/)]
* **MongoDB Account** [[https://account.mongodb.com/account/login](https://account.mongodb.com/account/login)]
* **GitHub Account** [[https://github.com/signup?source=login](https://github.com/signup?source=login)]

**Clone this repository**
* git clone https://github.com/soniccandy/LMS.git
* cd LMS

**Install all dependencies (frontend, backend)**
*  npm run install-all

**Configure environment variables**
*  Backend .env file (create in backend/ directory)
*  PORT=5001
*  MONGODB_URI=<yourconnectionstring>
*  JWT_SECRET=your_jwt_secret

**Start development servers**
*  npm start or npm run dev

---

##CI/CI Pipeline Details

**Workflow triggers**
*  **Name**: CI/CD
*  Automatically runs on push or pull requests to the main branch
*  Provides testing for all events and deployment for push events only

**Jobs and environment**
*  Single job named "Build, Test and Deploy" that handles the entire pipeline
*  Runs on self hosted EC2 runner
*  Uses Node.js version 22
*  Requires Mongo URI environment secrets

**Pipeline steps**
*  ***Checkout Code***: Clone the repository to runner
*  ***Set up Node.js***: Configure the specified Node.js version
*  ***Stop Running Services***: Stop existing PM2 processes
*  ***Install Backend Dependencies***: Set up yarn and installs backend packes
*  ***Install Frontend Dependencies***: Build frontend application
*  ***Run Backend Tests***: Run tests with the requires environment variables
*  ***Deploy to AWS*** (Only for pushes to main, not for pull requests): 1. Update environment configuration 2. Start and restart application processes via PM2