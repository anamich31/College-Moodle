import React, { useEffect, useState } from 'react';
import Sidebar from './SideBar';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { FaPhone, FaUser } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import LoadingSpinner from '../LoadingSpinner';

function ProfessorDetails() {
  const { user } = useSelector((store) => store.app);
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [professors, setProfessors] = useState([]);

  useEffect(() => {
    const fetchProfessorDetails = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(
            `${USER_API_END_POINT}/student/courses/${courseCode}/professorDetails`,
            { withCredentials: true }
          );
          setProfessors(response.data.professorDetails);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching professor details:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProfessorDetails();
  }, [user, courseCode, navigate]);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex flex-col w-full p-6 font-kanit">
        {/* Header */}
        <div className="mb-6 border-b-4 border-gray-500 pb-2">
          <h2 className="text-4xl font-extrabold text-[#121A27]">Professor Details</h2>
          <p className="text-gray-600 mt-2">Explore information about professors associated with this course.</p>
        </div>

        {/* Content Section */}
        <div className="mt-6">
          {loading ? (
            <LoadingSpinner />
          ) : professors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {professors.map((item, index) => (
                <div
                  key={index}
                  className="p-6 border rounded-xl shadow-lg  flex flex-col gap-4 transform hover:scale-105 transition-transform duration-300 hover:shadow-xl bg-blue-100"
                >
                  {/* Professor Name */}
                  <div className="flex gap-2 items-center">
                    <FaUser size={25} />
                    <h3 className="text-2xl font-bold text-gray-800">{item.fullname}</h3>
                  </div>

                  {/* Email */}
                  <div className="flex gap-2 items-center">
                    <div className="h-full pt-1"><MdEmail size={18} /></div>
                    <p className="text-md text-gray-700">
                      <span className="font-semibold text-gray-900">Institute mail id:</span> {item.instituteMailId}
                    </p>
                  </div>

                  {/* Phone Number */}
                  <div className="flex gap-2 items-center">
                    <FaPhone size={13} />
                    {item?.number ? (
                      <p className="text-md text-gray-700">
                        <span className="font-semibold text-gray-900">Phone:</span> {item.number}
                      </p>
                    ) : (
                      <p className="text-md text-gray-500 italic">Phone number not provided</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center text-lg mt-12">No Professors Found for this Course.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfessorDetails;
