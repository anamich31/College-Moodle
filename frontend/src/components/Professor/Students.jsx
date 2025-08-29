import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { PiStudentBold } from "react-icons/pi";
import LoadingSpinner from "../LoadingSpinner";
import { FaCheck } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";

function Students() {
  const [students, setStudents] = useState([]); // Full list of students
  const [filteredStudents, setFilteredStudents] = useState([]); // Filtered list of students
  const [searchQuery, setSearchQuery] = useState(""); // Search input state
  const { user } = useSelector((store) => store.app);
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const [isLoadingStudents, setIsLoadingStudents] = useState(true); // New loading state

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(
            `${USER_API_END_POINT}/professor/courses/${courseCode}/students`,
            { withCredentials: true }
          );
          setStudents(response.data.students); // Set full student list
          setFilteredStudents(response.data.students); // Initialize filtered list
        } else {
          navigate("/"); // Redirect to login if user is not authenticated
        }
      } catch (error) {
        console.error("Error fetching professor data:", error);
        navigate("/"); // Redirect to login on error
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [user, courseCode, navigate]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter students based on roll number
    const filtered = students.filter((std) =>
      std.rollNo.toLowerCase().includes(query)
    );
    setFilteredStudents(filtered);
  };



  return (
    <div className="min-h-screen flex bg-gray-50">
  {/* Sidebar Component */}
  <Sidebar />

  <div className="flex flex-col w-full p-6">
    {/* Header and Search Section */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 mt-10 md:mt-6">
      {/* Page Title */}
      <h2 className="text-[40px] font-bold font-kanit text-[#121A27] border-b-4 border-gray-500 pb-2">
        Courses Students
      </h2>

      {/* Search Bar */}
      <div className="relative w-56 md:w-60 lg:w-96">
        <input
          type="text"
          placeholder="Search Roll No..."
          className="w-full h-12 px-4 text-md font-kanit border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#333945]"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
    </div>

    {/* Student Cards Section */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoadingStudents ? (
        <div className="col-span-full flex justify-center">
          <LoadingSpinner /> {/* Show loading spinner */}
        </div>
      ) : filteredStudents.length > 0 ? (
        filteredStudents.map((std, index) => (
          <div
            key={std._id || index}
            className="p-4 border rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 cursor-pointer bg-blue-100"
            onClick={() => handleStudentClick(std._id)}
          >
            {/* Card Content */}
            <div className="flex items-center gap-4">
              <PiStudentBold size={27} className="text-[#121A27]" />

              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-700 font-kanit">
                  {std?.fullName}
                </p>
                <p className="text-sm text-gray-500 font-kanit">
                  {std?.rollNo}
                </p>
              </div>
            </div>

            
           
              <div className="mt-4 border-t-2 border-gray-300 pt-3 text-sm text-gray-600 font-kanit">
                <div className="flex items-center gap-1"><MdEmail size={15} /><span className="font-semibold">Email:</span> {std?.instituteMailId}</div>
                <div className="flex items-center gap-1 "><FaCheck size={12} /><span className="font-semibold">Attendance:</span> {std?.attendance}%</div>
                <div className="flex items-center gap-1"><FaPhone size={10} /><span className="font-semibold">Phone: </span>{std?.number}</div>
              </div>
           
          </div>
        ))
      ) : (
        <div className="col-span-full flex justify-center">
          <p className="text-gray-500">No students found</p>
        </div>
      )}
    </div>
  </div>
</div>

  );
}

export default Students;
