import React, { useState } from "react";
import Sidebar from "./SideBar";
import axios from "axios";

import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

function ExtraClass() {
  // State variables
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to validate the date
  const handleDateChange = (value) => {
    // Allow intermediate input without immediate rejection
    setDate(value);
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/; // dd-mm-yyyy format
    if (value !== "" &&  value.length>=10  && !dateRegex.test(value)) {
      toast.error("Invalid date format. Use dd-mm-yyyy.");
    }
  };

  // Function to validate the time
  const handleTimeChange = (value) => {
    // Allow intermediate input without immediate rejection
    setTime(value);
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]\s?(AM|PM)$/i; // hh:mm AM/PM format
    if (value !== "" && value.length>=8 && !timeRegex.test(value)) {
      toast.error("Invalid time format. Use hh:mm AM/PM.");
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const extraclass = {
      courseCode,
      date,
      time: time.toUpperCase(), // Ensure consistent formatting
    };

    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/professor/addExtraClass`,
        extraclass,
        { withCredentials: true }
      );
      
      
      toast.success(response.data.message);

      // Clear the fields after submission
      setDate("");
      setTime("");
      setCourseCode("");
    } catch (error) {
      console.error("Error scheduling extra class:", error.response?.data || error.message);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-grow p-6 mt-10 md:mt-0">
        {/* Page Header */}
        <h2 className="text-[40px] font-bold font-kanit text-[#121A27] border-b-4 border-gray-500 pb-2 mb-10 md:mt-6">
          Schedule Extra Class
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto bg-white p-8 shadow-md rounded-lg font-kanit space-y-6"
        >
          {/* Date Field */}
          <div>
            <label htmlFor="date" className="block font-medium text-gray-700 mb-2">
              Date (dd-mm-yyyy)
            </label>
            <input
              type="text"
              id="date"
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              placeholder="e.g., 13-01-2025"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Time Field */}
          <div>
            <label htmlFor="time" className="block font-medium text-gray-700 mb-2">
              Time (hh:mm AM/PM)
            </label>
            <input
              type="text"
              id="time"
              value={time}
              onChange={(e) => handleTimeChange(e.target.value)}
              placeholder="e.g., 11:00 AM"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Course Code Field */}
          <div>
            <label htmlFor="courseCode" className="block font-medium text-gray-700 mb-2">
              Course Code
            </label>
            <input
              type="text"
              id="courseCode"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="e.g., CS101"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="reset"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              onClick={() => {
                setDate("");
                setTime("");
                setCourseCode("");
              }}
            >
              Reset
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-lg ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#121A27] hover:bg-[#27364B] focus:ring-2 focus:ring-gray-500"
              }`}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExtraClass;
