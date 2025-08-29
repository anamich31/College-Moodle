# 🎓 Student Professor Portal  

## MERN Stack Project  

### About This Portal  
This web application is designed to enhance the academic experience for **Students** and **Professors** by offering a seamless platform for managing course materials, attendance, and academic information.  

---

### 👨‍🏫 Professors:  
Professors have access to essential tools to effectively manage their courses. They can:  
- View detailed information about the students enrolled in their courses.  
- Upload PDFs and other resources for students to access.  
- Modify course patterns, such as updating quizzes, exams, and assignments.  
- Track and update student attendance.  
- Ensure students stay up-to-date with the latest course-related materials and information.  

---

### 👨‍🎓 Students:  
Students can effortlessly track their academic progress and stay informed about course activities. They can:  
- View their attendance details across all the courses they have opted for.  
- Download PDFs and course materials uploaded by professors.  
- Access and review course patterns, including quizzes, exams, and other assessments.  
- Get detailed information about professors and the courses they teach.  

**Note:** While the administration sets up the course structure, professors and students are the primary users, benefiting from the platform's streamlined academic management features.  

---

## 🛠️ Tech Stack  

- **Frontend**: React.js, Tailwind CSS, Vite  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Authentication**: JSON Web Tokens (JWT)  
- **Other Tools**: Axios, Redux  

---

## 🚀 Setup  

### Installation  

Follow these steps to set up the project locally:  

#### Frontend Setup  
1. Navigate to the `frontend` folder:  
   ```
   cd frontend 
   ```
2. Install dependencies:
    ```
   npm install
   ```

### Backend Setup
1. Navigate to the `backend` folder:  
   ```
   cd backend 
   ```
2. Install dependencies:
    ```
   npm install
   ```

🗂️ .env File Configuration
Create a .env file in the backend folder and add the following variables:

MONGO_URI=your_mongodb_connection_string
PORT=your_server_port
SECRET_KEY=your_jwt_secret_key
SECRET_CODE=your_secret_code


▶️ Starting the Application
To start the project, follow these steps:

Start the Backend Server:

Navigate to the `backend` folder:
Run the command: cd `backend`
Start the server using: `yarn dev`


Start the Frontend Server:

Move back to the root directory using: cd ..
Navigate to the `frontend` folder:
Run the command: cd `frontend`
Start the frontend server using: `yarn dev`
Once both servers are running, open the frontend URL in your browser to access the application. 🚀
