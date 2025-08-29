import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./SideBar";
import { useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { IoCloudUpload, IoPeople, IoSettingsSharp } from 'react-icons/io5';
import { FaRegClipboard } from "react-icons/fa";

const cards = [
  {
    title: "Upload PDF",
    description: "Upload course materials or relevant documents.",
    icon: <IoCloudUpload className="text-4xl text-[#121A27]" />,
    bg: "bg-gradient-to-r from-[#556C8A] to-[#859AB8]",
    action: "uploadpdf",
  },
  {
    title: "Students Details",
    description: "View and manage student lists and details.",
    icon: <IoPeople className="text-4xl text-[#121A27]" />,
    bg: "bg-gradient-to-r from-gray-700 to-gray-600",
    action: "students",
  },
  {
    title: "Update Attendance",
    description: "Record or update attendance data.",
    icon: <FaRegClipboard className="text-4xl text-[#121A27]" />,
    bg: "bg-gradient-to-r from-teal-700 to-teal-600",
    action: "updateattendance",
  },
  {
    title: "Update Pattern / Update Marks",
    description: "Modify or update the course pattern or schedule.",
    icon: <IoSettingsSharp className="text-4xl text-[#121A27]" />,
    bg: "bg-gradient-to-r from-[#27364B] to-[#556C8A]",
    action: "updatepattern",
  },
];


function CourseDetails() {
  const { courseCode } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.app);

  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(
            `${USER_API_END_POINT}/professor/courses/${courseCode}`,
            { withCredentials: true }
          );
          setCourseDetails(response.data.courseDetails);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching professor data:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessorData();
  }, [user, navigate, courseCode]);

  function handleClick(nav) {
    navigate(`/professor/courses/${courseCode}/${nav}`);
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
  {/* Sidebar Component */}
  <Sidebar />

  {/* Main Content */}
  <div className="p-6 mt-20 md:mt-10 ml-4 w-full flex flex-col gap-10 font-kanit">
    {/* Course Details Card */}
    <div className="w-full max-w-3xl mx-auto bg-white p-8 gap-6 rounded-2xl shadow-lg  hover:shadow-xl transition-shadow duration-300 border-y-4 border-[#121A27]">
      <p className="text-4xl font-extrabold font-inter text-[#121A27] tracking-tight">
        {courseCode || 'Course Code'}
      </p>
      <div className="mt-10 flex justify-between items-center">
        <p className="text-lg font-semibold text-gray-600">
          {courseDetails?.courseName || 'Course Name'}
        </p>
        <div>
          <p className="text-lg font-bold text-gray-700">
            Students:{' '}
            <span className="text-gray-500 font-medium">
              {courseDetails?.totalStudents || 'N/A'}
            </span>
          </p>
        </div>
      </div>
    </div>

    {/* Navigation Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-kanit">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => handleClick(card.action)}
            className={`p-6 rounded-xl shadow-md transform transition-transform hover:scale-105 cursor-pointer flex flex-col items-center gap-4 
            ${card.bg} hover:shadow-lg border-t-4 border-[#121A27]`}
          >
            <span>{card.icon}</span>
            <h3 className="text-xl font-semibold text-white tracking-wide text-center">
              {card.title}
            </h3>
            <p className="text-sm font-medium text-gray-300 text-center">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
  
  );
}

export default CourseDetails;
