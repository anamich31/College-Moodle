import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { FaRegClipboard } from "react-icons/fa";
import LoadingSpinner from "../LoadingSpinner";

function Attendance() {
  const { user } = useSelector((store) => store.app);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Loading state
  const [courseAttendance, setCourseAttendance] = useState([]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchCourseAttendance = async () => {
      setLoading(true);
      try {
        if (user && user._id) {
          const response = await axios.get(
            `${USER_API_END_POINT}/student/attendance/${user._id}`,
            { withCredentials: true }
          );
          setCourseAttendance(response.data.courseAttendance);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching attendance details:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAttendance();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 font-kanit">
  {/* Sidebar */}
  <Sidebar className="shadow-lg bg-[#121A27] text-white" />

  {/* Main Content */}
  <div className="flex flex-col w-full p-8">
    {/* Page Header */}
    <div className="mb-8 mt-10 md:mt-0">
      <h2 className="text-[40px] font-extrabold text-[#121A27] border-b-4 border-gray-500 pb-2">
        Attendance Overview
      </h2>
    </div>

    {/* Content Section */}
    <div className="mt-8 relative">
      {courseAttendance.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courseAttendance.map((item, index) => (
            <div
              key={index}
              className="relative p-6 rounded-2xl shadow-lg bg-gradient-to-br from-white to-gray-100 hover:from-[#f9f9ff] hover:to-white hover:scale-105 transition-transform duration-300 border border-[#e2e8f0]"
            >
              {/* <div className="md:absolute md:top-4 md:right-4 flex justify-center items-center">
                <span
                  className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
                    item.attendance >= 75
                      ? "bg-green-200 text-green-700"
                      : "bg-red-200 text-red-700"
                  }`}
                >
                  {item.attendance >= 75 ? "Excellent" : "Needs Improvement"}
                </span>
              </div> */}


              <div className="flex flex-col gap-4">
                {/* Course Title */}
                <div className="flex items-center gap-2">
                  <img
                    src="/CourseIcon.png"
                    className="w-8 h-8"
                    alt="Course Icon"
                  />
                  <p
                    className="text-xl font-bold text-[#121A27] truncate"
                    title={item.course}
                  >
                    {item.course}
                  </p>
                </div>
                
                  <div className="flex items-end justify-end">
                      <span
                      className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
                        item.attendance >= 75
                          ? "bg-green-200 text-green-700"
                          : "bg-red-200 text-red-700"
                      }`}
                    >
                      {item.attendance >= 75 ? "Excellent" : "Needs Improvement"}
                    </span>
                  </div>

                {/* Course Name */}
                <p
                  className="text-lg font-medium text-gray-600 truncate"
                  title={item.courseName}
                >
                  {item.courseName}
                </p>

                {/* Attendance Percentage */}
                <div className="flex items-center gap-2">
                  <FaRegClipboard
                    size={20}
                    className="text-4xl text-[#27364B]"
                  />
                  <p className="text-lg text-gray-600">
                    <span className="font-semibold text-[#121A27]">
                      Attendance:
                    </span>{" "}
                    {item.attendance}%
                  </p>
                </div>

                {/* Last Updated */}
                {item?.lastUpdated && (
                  <div className="flex items-center gap-2">
                    <div className="flex">
                    <img
                      src="/last_Updated_Icon.svg"
                      className="w-5 h-5 "
                      alt="Last Updated Icon"
                    />
                    </div>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold text-[#121A27]">
                        Last Updated:
                      </span>{" "}
                      {formatDate(item.lastUpdated)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-64 text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-lg p-8">
          <p className="text-lg font-medium">
            No attendance records available yet.
          </p>
          <p className="text-sm">Please check back later.</p>
          <img
            src="/no_data.svg"
            alt="No data"
            className="w-32 mt-4"
          />
        </div>
      )}
    </div>
  </div>
</div>

  );
}

export default Attendance;
