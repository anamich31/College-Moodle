import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./SideBar";
import { Calendar } from "@/components/ui/calendar";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Home() {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [derivedSchedule, setDerivedSchedule] = useState({
    classTimes: [],
    extraClasses: [],
    labTimings: [],
    hasLab: false,
  });
  const { user } = useSelector((store) => store.app);
  const [date, setDate] = useState(new Date());

  const formatToDDMMYYYY = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(
            `${USER_API_END_POINT}/professor/${user._id}`,
            { withCredentials: true }
          );
          setSchedule(response.data.schedule);
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
  }, [user, navigate]);

  const todayFormattedDate = useMemo(() => formatToDDMMYYYY(new Date()), []);
  const selectedDateFormatted = useMemo(() => formatToDDMMYYYY(date), [date]);
  const dayOfWeek = useMemo(
    () => date.toLocaleString("en-us", { weekday: "long" }),
    [date]
  );

  const handleDateSelect = (selectedDate) => {
    const newDate = new Date(selectedDate);
    if (!isNaN(newDate.getTime())) {
      setDate(newDate);
    } else {
      console.error("Invalid date selected");
    }
  };

  const ScheduleSection = ({ title, items, itemColor }) => (
    <div className="w-full text-center">
      <h3 className="font-bold text-2xl text-[#27364B] mb-4">{title}</h3>
      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex justify-between items-center px-6 py-3 rounded-lg shadow-lg ${itemColor}`}
          >
            <span className="text-lg font-medium text-white">
              {item.courseCode}
            </span>
            <span className="text-sm text-white opacity-80">
              {item.time || item.startTime}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    if (schedule) {
      const classTimes =
        schedule.classTime?.filter((classItem) => classItem.day === dayOfWeek) ||
        [];
      const extraClasses =
        schedule.extraClass?.filter((extra) => extra.date === selectedDateFormatted) ||
        [];
      const labTimings = schedule.hasLab
        ? schedule.labTiming?.filter((lab) => lab.day === dayOfWeek) || []
        : [];
      const hasLab = schedule.hasLab || false;

      setDerivedSchedule({
        classTimes,
        extraClasses,
        labTimings,
        hasLab,
      });
    }
  }, [schedule, dayOfWeek, selectedDateFormatted]);

  if (loading) {
    return null;
  }

  if (!schedule) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen font-kanit text-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="mt-20 mx-auto px-6 w-full max-w-[900px]">
        <h1 className="text-5xl font-extrabold mb-12 text-center text-[#121A27] ">
          Welcome, Professor!
        </h1>

        <div className="flex flex-col gap-16 lg:flex-row lg:items-start">
          {/* Calendar */}
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-lg border shadow-xl p-6 bg-gray-100 text-gray-900"
              classNames={{
                day_selected: "bg-[#27364B] text-white font-bold rounded-full",
                day_hovered: "hover:bg-[#F0F4FB]",
                day_today: "bg-[#556C8A] text-white font-bold rounded-full",
              }}
            />
          </div>

          <div className="flex flex-col gap-8 w-full">
            {/* Display Classes for Selected Day */}
            {derivedSchedule.classTimes.length > 0 && (
              <ScheduleSection
                title={
                  selectedDateFormatted === todayFormattedDate
                    ? "Today's Classes"
                    : "Classes"
                }
                items={derivedSchedule.classTimes}
                itemColor="bg-gradient-to-r from-[#556C8A] to-[#859AB8]"
              />
            )}

            {/* Display Extra Classes */}
            {derivedSchedule.extraClasses.length > 0 && (
              <ScheduleSection
                title={
                  selectedDateFormatted === todayFormattedDate
                    ? "Today's Extra Classes"
                    : "Extra Classes"
                }
                items={derivedSchedule.extraClasses}
                itemColor="bg-gradient-to-r from-gray-700 to-gray-600"
              />
            )}

            {/* Display Lab Sessions */}
            {derivedSchedule.hasLab &&
              derivedSchedule.labTimings.length > 0 && (
                <ScheduleSection
                  title={
                    selectedDateFormatted === todayFormattedDate
                      ? "Today's Lab Sessions"
                      : "Lab Sessions"
                  }
                  items={derivedSchedule.labTimings}
                  itemColor="bg-gradient-to-r from-teal-700 to-teal-600"
                />
              )}

            {/* No Classes, Extra Classes, or Labs */}
            {derivedSchedule.classTimes.length === 0 &&
              derivedSchedule.extraClasses.length === 0 &&
              (!derivedSchedule.hasLab ||
                derivedSchedule.labTimings.length === 0) && (
                <div className="mt-4 text-center">
                  <h3 className="text-2xl font-semibold text-gray-200">
                    No Classes, Extra Classes, or Labs Scheduled
                  </h3>
                  <p className="text-gray-400 mt-2">
                    Select a different date or take a break!
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
