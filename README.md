# TaskHub API

## Description

**TaskHub API** is a backend application designed to facilitate assignment submissions for students and grading for lecturers. This RESTful API provides endpoints for managing users, assignments, and grades. The goal is to streamline the educational workflow, enhancing efficiency for both students and lecturers.

## Table of Contents

1. Description
2. Features
3. Technologies Used
4. Installation
5. Usage
6. API Documentation
7. Contributing
8. About

## Features

User Authentication: Secure login and registration for students and lecturers.
Assignment Management: Create, submit, and manage assignments.
Grading System: Lecturers can view, grade, and provide feedback on assignments.

## Technologies Used

1. Backend:
   - Node.js
   - Express.js
   - TypeScript
2. Database:
   - MongoDB
   - Authentication:
   - JWT (JSON Web Tokens)
3. Other Tools:
   - Postman (for API documentation)
   - Mongoose (ODM for MongoDB)

## Installation

### Follow these steps to set up the project locally:

#### Prerequisites

- Node.js (version 14 or above)
- MongoDB (version 4 or above)
- npm (Node Package Manager)

#### Steps

##### 1.Clone the repository:

```
git clone https://github.com/RashidArtisan/taskhub_API.git
```
```
cd taskhub
```

##### 2.Install dependencies:

```
npm install
```

##### 3.Start the application:

```
npm start
```

## Usage

1. For Students
   - Register/Login:
     - Register a new account or log in with existing credentials.
   - Submit Assignment:
     - Submit assignments through the API.
   - View Grades:
     - Retrieve grades.
2. For Lecturers
   - Register/Login:
     - Register a new account or log in with existing credentials.
   - View Submissions:
     - Retrieve all submitted assignments.
   - Grade Assignments:
     - Grade assignments and provide feedback through the API.

## API Documentation

The API is documented using Postman. You can access the complete API documentation [here](https://documenter.getpostman.com/view/26350887/2sA3JNcgrx).

## Contributing

### We welcome contributions from the community. To contribute:

1. Fork the repository.
2. Create a new branch:
   git checkout -b feature/your-feature
3. Make your changes.
4. Commit your changes:
   git commit -m 'Add new feature'
5. Push to the branch:
   git push origin feature/your-feature
6. Create a new Pull Request.

## About

**TaskHub API** was created to streamline the assignment submission and grading process in educational institutions. By providing a user-friendly backend platform, it aims to improve the efficiency and effectiveness of academic workflows for both students and lecturers.
