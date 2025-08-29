import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./SideBar";
import { useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { IoCloudUpload, IoPeople } from "react-icons/io5";
import { FaRegClipboard } from "react-icons/fa";
import LoadingSpinner from "../LoadingSpinner";

const cards = [
  {
    title: "Uploaded PDF",
    description: "View and manage uploaded course materials, marksheets, etc.",
    icon: <IoCloudUpload className="text-4xl text-[#121A27]" />,
    bg: "bg-gradient-to-r from-[#556C8A] to-[#859AB8]",
    action: "uploadedpdf",
  },
  {
    title: "Pattern",
    description: "Check course patterns (e.g., quizzes, exams).",
    icon: <FaRegClipboard className="text-4xl text-[#121A27]" />,
    bg: "bg-gradient-to-r from-teal-700 to-teal-600",
    action: "pattern",
  },
  {
    title: "Professor Details",
    description: "View professor information.",
    icon: <IoPeople className="text-4xl text-[#121A27]" />,
    bg: "bg-gradient-to-r from-gray-700 to-gray-600",
    action: "professordetails",
  },
  {
    title: "Marks",
    description: "View marks for each exam.",
    icon: <FaRegClipboard className="text-4xl text-[#121A27]" />,
    bg: "bg-gradient-to-r from-[#27364B] to-[#556C8A]",
    action: "marks",
  },
];


function CourseDetails() {
  const { courseCode } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.app);

  useEffect(() => {
    setLoading(true)
    const fetchStudentData = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(
            `${USER_API_END_POINT}/student/courses/${courseCode}`,
            { withCredentials: true }
          );
          setCourseDetails(response.data.courseDetails);
          setMarks(response.data.marks || []);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user, navigate, courseCode]);

  function handleClick(nav) {
    navigate(`/student/courses/${courseCode}/${nav}`);
  }

  if(loading){
    return  <LoadingSpinner/>
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="p-6 mt-20 md:mt-10 ml-4 w-full flex flex-col gap-10 font-kanit">
      <div className="w-full max-w-3xl mx-auto bg-white p-8 gap-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-y-4 border-[#121A27]">
        <p className="text-4xl font-extrabold font-inter text-[#121A27] tracking-tight">
          {courseCode || "Course Code"}
        </p>
        <div className="mt-10 flex justify-between items-center">
          <p className="text-lg font-semibold text-gray-600">
            {courseDetails?.courseName || "Course Name"}
          </p>
          <div>
            <p className="text-lg font-bold text-gray-700">Professor(s):</p>
            <ul className="mt-2 space-y-1">
              {courseDetails?.professor && courseDetails?.professor.length > 0 ? (
                courseDetails.professor.map((prof, index) => (
                  <li key={index} className="text-gray-500 font-medium">
                    {prof}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No Professors Assigned</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-kanit">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => handleClick(card.action)}
            className={`p-6 rounded-xl shadow-md transform transition-transform hover:scale-105 cursor-pointer flex flex-col items-center gap-4 ${card.bg}  hover:shadow-lg border-t-4 border-[#121A27]`}
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
