import React from 'react';
import FullHeightSidebar from './SideBar';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex min-h-screen font-kanit text-gray-100">
  {/* Sidebar */}
  <FullHeightSidebar />

  {/* Main Content */}
  <div className="mt-20 mx-auto px-6 w-full max-w-[900px]">
    <h1 className="text-5xl font-extrabold mb-8 text-center text-[#121A27]">
      Welcome, Admin!
    </h1>
    <p className="text-lg text-gray-400 text-center mb-8">
      Manage professors, students, and courses efficiently.
    </p>

    <div className="flex flex-wrap justify-center gap-6">
      <Link
        to="/administration/professor"
        className="flex justify-center items-center w-48 h-20 bg-gradient-to-r from-[#556C8A] to-[#859AB8] text-white text-xl font-bold rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300"
      >
        Professors
      </Link>

      <Link
        to="/administration/students"
        className="flex justify-center items-center w-48 h-20 bg-gradient-to-r from-gray-700 to-gray-600 text-white text-xl font-bold rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300"
      >
        Students
      </Link>

      <Link
        to="/administration/courses"
        className="flex justify-center items-center w-48 h-20 bg-gradient-to-r from-teal-700 to-teal-600 text-white text-xl font-bold rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300"
      >
        Courses
      </Link>
    </div>
  </div>
</div>

  );
}

export default Home;
