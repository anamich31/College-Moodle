import React, { useEffect, useState } from 'react';
import Sidebar from './SideBar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import LoadingSpinner from '../LoadingSpinner';



function Courses() {
  const navigate = useNavigate();
  const [courses,setCourses]=useState(null);
  const [loading, setLoading] = useState(true); // Track authentication check
    
    const { user } = useSelector((store) => store.app);

    useEffect(() => {
      setLoading(true)
        const fetchStudentData = async () => {
          try {
            if (user && user._id) {
              const response = await axios.get(
                `${USER_API_END_POINT}/student/courses/getcourses/${user._id}`,
                { withCredentials: true }
              );
              setCourses(response.data.courses);
            } else {
              navigate("/"); // Redirect to login if user is not authenticated
            }
          } catch (error) {
            console.error("Error fetching student data:", error);
            navigate("/"); // Redirect to login on error
          } finally {
            setLoading(false); // Stop loading after authentication check
          }
        };
    
        fetchStudentData();
      }, [user, navigate]);



    

  function handleClick(course) {
    // Use an absolute path for navigation
    navigate(`/student/courses/${course}`);
  }

  return (
    <div className="flex min-h-screen font-kanit">
    <Sidebar />
    <div className="flex-1 p-8 sm:mt-10 md:mt-0 ml-6 max-w-6xl">
      <h2 className="text-[42px] font-extrabold text-[#121A27] border-b-4 border-[#27364B] pb-2 mb-10">
        Courses
      </h2>
      {loading ? 
      <LoadingSpinner/> 
      :
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {courses.map((course, idx) => (
          <div
            key={idx}
            onClick={() => handleClick(course)}
            className="relative group p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transform transition-transform hover:scale-105 cursor-pointer border-t-4 border-[#27364B]"
          >
            {/* Circular Icon */}
            <div className="flex items-center justify-center h-16 w-16 mb-4 bg-[#27364B] text-white rounded-full mx-auto transition-all duration-300 group-hover:rotate-90 group-hover:bg-[#1F2D3D]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>

            {/* Course Title */}
            <h3 className="text-xl font-bold text-[#121A27] text-center mb-2 group-hover:text-[#27364B] transition-colors">
              {course}
            </h3>

            {/* Decorative Line */}
            <div className="h-1 w-20 bg-[#27364B] mx-auto rounded-full"></div>
          </div>
        ))}
        </div>
      }
    </div>
  </div>
  

  );
}

export default Courses;
