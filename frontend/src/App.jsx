import { createBrowserRouter, RouterProvider, Outlet, useLocation } from "react-router-dom";
import { Button } from "./components/ui/button";
import LoginAs from "./components/LoginAs";
import AdmLogin from "./components/auth/AdmLogin";
import StdLogin from "./components/auth/StdLogin";
import ProfLogin from "./components/auth/ProfLogin";
import AdmRegistration from "./components/auth/AdmRegistration";
import AdminHome from "./components/Admin/Home";
import Navbar from "./components/shared/Navbar";
import ProfHome from "./components/Professor/Home"
import StdHome from "./components/Student/Home"
import StdCourses from "./components/Student/Courses"
import ProfCourses from "./components/Professor/Courses"
import ProfChangePassword from "./components/Professor/ChangePassword"
import CourseDetails from "./components/Professor/CourseDetails";
import Uploadpdf from "./components/Professor/Uploadpdf";
import UpdateAttendance from "./components/Professor/UpdateAttendance";
import Students from "./components/Professor/Students";
import UpdatePattern from "./components/Professor/UpdatePattern";
import StdCourseDetails from "./components/Student/CourseDetails"
import UploadedPdf from "./components/Student/UploadedPdf";
import Pattern from "./components/Student/Pattern";
import ProfessorDetails from "./components/Student/ProfessorDetails";
import ChangePassword from "./components/Student/ChangePassword";
import Attendance from "./components/Student/Attendance";
import Professor from "./components/Admin/Professor";
import Courses from "./components/Admin/Courses";
import AdminStudentPage from "./components/Admin/Students"
import AdminChangePassword from "./components/Admin/ChangePassword"
import UpdateMarks from "./components/Professor/UpdateMaks";
import ExtraClass from "./components/Professor/ExtraClass";
import Marks from "./components/Student/Marks";

// Layout Component with Navbar
function Layout() {
  const { pathname } = useLocation();

  const hideNavbarRoutes = ["/", "/administration/login", "/administration/register", "/professor/login", "/student/login"];
  const showNavbar = !hideNavbarRoutes.includes(pathname);

  return (
    <div className="min-h-screen">
      {showNavbar && <Navbar />} {/* Render Navbar conditionally */}
      <div className="content">
        <Outlet /> {/* Renders the matched route's element */}
      </div>
    </div>
  );
}

const appRouter = createBrowserRouter([
  {
    element: <Layout />, // Shared layout with Navbar
    children: [
      {
        path: "/", // Base route
        element: <LoginAs />,
      },
      {
        path: "/administration", // Administration base route
        children: [
          { path: "", element: <AdminHome /> }, // Matches /administration
          { path: "login", element: <AdmLogin /> }, // Matches /administration/login
          { path: "register", element: <AdmRegistration /> }, // Matches /administration/register
          { path: "professor", element:<Professor/>  }, // Matches /administration/register
          { path: "students", element:<AdminStudentPage/>  }, // Matches /administration/register
          { path: "courses", element:<Courses/>  }, // Matches /administration/register
          { path: "changepassword", element:<AdminChangePassword/>  }, // Matches /administration/register
        ],
      },
      {
        path: "/professor",
        children: [
          { path: "", element: <ProfHome /> },
          { path: "login", element: <ProfLogin /> }, // Matches /professor/login
          { path: "courses", element:<ProfCourses/>,}, // Matches /professor/courses
          {path:"courses/:courseCode", element:<CourseDetails/>},
          {path:"courses/:courseCode/uploadpdf",element:<Uploadpdf/> },
          {path:"courses/:courseCode/updateattendance", element:<UpdateAttendance/>},
          {path:"courses/:courseCode/students", element:<Students/> },
          {path:"courses/:courseCode/updatepattern", element:<UpdatePattern/>},
          {path:"courses/:courseCode/:patternid",element:<UpdateMarks/>},
          {path:"addextraclass",element:<ExtraClass/>},
          { path: "changePassword", element:<ProfChangePassword/> }, // Matches /professor/login
        ],
      },
      {
        path: "/student",
        children: [
          { path: "", element: <StdHome /> },
          { path: "login", element: <StdLogin /> }, // Matches /student/login
          { path: "courses", element:<StdCourses/>  }, // Matches /student/login
          { path: "courses/:courseCode",  element: <StdCourseDetails/>}, // Matches /student/login
          { path: "courses/:courseCode/uploadedpdf",  element: <UploadedPdf/>}, // Matches /student/login
          { path: "courses/:courseCode/pattern",  element: <Pattern/>}, // Matches /student/login
          { path: "courses/:courseCode/marks",  element: <Marks/>}, // Matches /student/login
          { path: "courses/:courseCode/professordetails",  element: <ProfessorDetails/>}, // Matches /student/login
          { path: "attendance", element:<Attendance/>  }, // Matches /student/login
          { path: "changepassword", element:<ChangePassword/>  }, // Matches /student/login
        ],
      },
      
    ],
  },
]);


export default function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
}
