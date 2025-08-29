import React, { useEffect, useState } from 'react';
import Sidebar from './SideBar';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { NotepadText } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';

function Marks() {
  const { user } = useSelector((store) => store.app);
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pattern, setPattern] = useState([]);

  useEffect(() => {
    const fetchPattern = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(
            `${USER_API_END_POINT}/student/courses/${courseCode}/pattern`,
            { withCredentials: true }
          );
          setPattern(response.data.pattern);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching pattern data:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchPattern();
  }, [user, courseCode, navigate]);

  function getBgColor(name) {
    switch (name) {
      case "End-Sem Exam":
        return "bg-red-100 text-white";
      case "Mid-Sem Exam":
        return "bg-orange-50 text-white";
      case "Presentation":
        return "bg-blue-50 text-white";
      case "Quiz":
        return "bg-yellow-50 text-white";
      default:
        return "bg-gray-200";
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex flex-col w-full p-6">
        {/* Title */}
        <div>
          <h2 className="text-[40px] font-bold font-kanit text-[#121A27] border-b-4 border-gray-500 pb-2 mt-14 md:mt-6">
            Course Pattern
          </h2>
        </div>

        {/* Content Section */}
        <div className="mt-6">
          {loading ? (
            <LoadingSpinner />
          ) : pattern.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4">
              {pattern.map((item, index) => (
                <div
                  key={index}
                  className={`p-6 border rounded-lg shadow-lg flex flex-col gap-2 transform hover:scale-105 transition-transform duration-200 font-kanit ${getBgColor(item.name)}`}
                >
                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                      <NotepadText className="font-semibold text-black" />
                      <p className="text-[22px] font-bold text-gray-700">
                        {item.name}
                      </p>
                    </div>
                  </div>
                  <p className="text-md text-gray-600">
                    <span className="font-semibold">Weightage:</span>{' '}
                    {item.weightage}%
                  </p>
                  {item?.note && (
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Note:</span> {item.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-10">
              No patterns added yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Marks;
