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
  const [marks, setMarks] = useState([]);

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
    const fetchMarks = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(
            `${USER_API_END_POINT}/student/courses/${courseCode}/marks`,
            { withCredentials: true }
          );
          setMarks(response.data.marks);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching marks data:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchMarks();
  }, [user, courseCode, navigate]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex flex-col w-full p-6">
        {/* Title */}
        <div>
          <h2 className="text-[40px] font-bold font-kanit text-[#121A27] border-b-4 border-gray-500 pb-2 mt-14 md:mt-6">
            Marks
          </h2>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <LoadingSpinner/>
        ) : (
          /* Marks Section */
          <div className="mt-6">
            {marks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4">
                {marks.map((item, index) => (
                  <div
                    key={index}
                    className="p-6 border rounded-lg shadow-lg  flex flex-col gap-2 transform hover:scale-105 transition-transform duration-200 font-kanit bg-green-100"
                  >
                    <div className="flex justify-between">
                      <div className="flex gap-2 items-center">
                        <NotepadText className="font-semibold" />
                        <p className="text-[25px] font-bold text-gray-700">
                          {item.name}
                        </p>
                      </div>
                    </div>
                    <p className="text-[22px] text-gray-600">
                      <span className="font-semibold">Marks:</span> {item.mark}
                    </p>
                    <p className="text-md text-gray-600">
                      <span className="font-semibold">Weightage:</span> {item.weightage}%
                    </p>
                    <p className="text-md text-gray-600">
                      <span className="font-semibold">Last Updated:</span> {formatDate(item.lastUpdated)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center text-lg mt-12">No Marks added yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Marks;
