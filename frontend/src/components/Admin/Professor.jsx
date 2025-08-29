import React, { useEffect, useState } from 'react';
import Sidebar from './SideBar';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { User } from 'lucide-react';

function UpdateAttendance() {
    const { user } = useSelector((store) => store.app);
    const navigate = useNavigate();
  
    const [searchQuery, setSearchQuery] = useState('');
    const [professor, setprofessor] = useState([]);
    const [filteredprofessor, setFilteredprofessor] = useState([]);
  
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [professorToDelete, setprofessorToDelete] = useState(null);
  
    const [isLoading, setIsLoading] = useState(false);
    const [isAddLoading, setIsAddLoading] = useState(false);
  
    const [newProfessor, setnewProfessor] = useState({
      fullname: '',
      profCode: '',
      password: '',
      instituteMailId: '',
      number: '',
      courses: [],
    });
  
    const [editProfessor, seteditProfessor] = useState({
        fullname: '',
        profCode: '',
        instituteMailId: '',
        number: '',
        courses: [],
      });
    const [newCourse, setNewCourse] = useState('');
  
    useEffect(() => {
      const fetchprofessor = async () => {
        try {
          if (user && user._id) {
            const response = await axios.get(
              `${USER_API_END_POINT}/administration/professor`,
              { withCredentials: true }
            );
            setprofessor(response.data.professor);
            setFilteredprofessor(response.data.professor);
          } else {
            navigate('/');
          }
        } catch (error) {
          console.error('Error fetching professor data:', error);
          navigate('/');
        }
      };
  
      fetchprofessor();
    }, [user, navigate]);
  
    const handleSearchChange = (e) => {
      const query = e.target.value.toLowerCase();
      setSearchQuery(query);
      const filtered = professor.filter((std) =>
        std.profCode.toLowerCase().includes(query)
      );
      setFilteredprofessor(filtered);
    };
  
    const handleAddprofessor = async () => {
      setIsAddLoading(true); // Show loader
      try {
        const response = await axios.post(
          `${USER_API_END_POINT}/administration/professor/register`,
          newProfessor,
          { withCredentials: true }
        );
        if (response.data.success) {
          const updatedprofessor = [...professor, response.data.professor];
          setprofessor(updatedprofessor);
          setFilteredprofessor(updatedprofessor);
          setIsAddModalOpen(false);
          toast.success('professor added successfully!');
          window.location.reload()
        }
      } catch (error) {
        console.error('Error adding professor:', error);
        toast.error(error.response?.data?.message || 'Failed to add professor.');
      } finally {
        setIsAddLoading(false); // Hide loader
      }
    };
  
    const handleDeleteprofessor = async () => {
      setIsLoading(true); // Show loader
      try {
        const response = await axios.delete(
          `${USER_API_END_POINT}/administration/professor/delete/${professorToDelete._id}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setprofessor(professor.filter((std) => std._id !== professorToDelete._id));
          setFilteredprofessor(filteredprofessor.filter((std) => std._id !== professorToDelete._id));
          setIsDeleteModalOpen(false);
          toast.success('professor deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting professor:', error);
        toast.error('Failed to delete professor. Please try again.');
      } finally {
        setIsLoading(false); // Hide loader
      }
    };
  
    const handleeditProfessor = async () => {
      try {
        const response = await axios.post(
          `${USER_API_END_POINT}/administration/professor/update/${editProfessor._id}`,
          editProfessor,
          { withCredentials: true }
        );
        if (response.data.success) {
          const updatedprofessor = professor.map((std) =>
            std._id === editProfessor._id ? response.data.professor : std
          );
          setprofessor(updatedprofessor);
          setFilteredprofessor(updatedprofessor);
          setIsEditModalOpen(false);
          toast.success('Professor updated successfully!');
          
        }
      } catch (error) {
        console.error('Error editing professor:', error);
        toast.error('Failed to update professor.');
      }
    };
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex flex-col w-full p-6 font-kanit">
        {/* Add professor Button */}
        <div className="flex justify-between items-center mb-6">
          <div className='border-b-4 border-gray-900'>
          <h2 className="text-3xl font-extrabold mt-10 md:mt-6 text-[#121A27] md:text-4xl">Professor</h2>
          </div>
          <button
            className="flex items-center justify-center bg-gray-900 text-white p-2 rounded-lg shadow-lg hover:bg-gray-800"
            onClick={() => setIsAddModalOpen(true)}
          >
            <span className=" font-medium"> Add Professor</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-56 md:w-60 lg:w-96 mb-10">
          <input
            type="text"
            placeholder="Search Prof Code..."
            className="w-full h-12 px-4 text-md font-kanit border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#333945]"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* professor Cards */}
        <div className="flex flex-wrap gap-6">
  {filteredprofessor.length > 0 ? (
    filteredprofessor.map((prof, idx) => (
      <div
        key={idx}
        className="w-full sm:w-1/2 lg:w-1/3 p-5 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-105"
      >
        {/* Profile Header */}
        <div className="flex items-center gap-3 mb-3">
          <User className="text-[#27364B] text-2xl" />
          <div className="flex flex-col">
            <p className="text-lg font-bold text-[#121A27]">{prof?.fullname}</p>
            <p className="text-sm text-gray-500">{prof?.profCode}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all"
            onClick={() => {
              setIsEditModalOpen(true);
              seteditProfessor(prof);
            }}
          >
            Edit
          </button>
          <button
            className="px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition-all"
            onClick={() => {
              setprofessorToDelete(prof);
              setIsDeleteModalOpen(true);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ))
  ) : (
    <p className="text-gray-500 text-center w-full">No professor found</p>
  )}
</div>

      </div>

      {/* Add professor Modal */}
      {/* Add professor Modal */}
            {isAddModalOpen && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center font-kanit">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h3 className="text-2xl font-bold mb-4">Add professor</h3>
                <form>
                    <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-2 mb-4 border rounded-lg"
                    value={newProfessor.fullname}
                    onChange={(e) =>
                        setnewProfessor({ ...newProfessor, fullname: e.target.value })
                    }
                    />
                    <input
                    type="text"
                    placeholder="Prof Code"
                    className="w-full p-2 mb-4 border rounded-lg"
                    value={newProfessor.profCode}
                    onChange={(e) =>
                        setnewProfessor({ ...newProfessor, profCode: e.target.value })
                    }
                    />
                    <input
                    type="email"
                    placeholder="Institute Mail ID"
                    className="w-full p-2 mb-4 border rounded-lg"
                    value={newProfessor.instituteMailId}
                    onChange={(e) =>
                        setnewProfessor({
                        ...newProfessor,
                        instituteMailId: e.target.value,
                        })
                    }
                    />
                    <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 mb-4 border rounded-lg"
                    value={newProfessor.password}
                    onChange={(e) =>
                        setnewProfessor({ ...newProfessor, password: e.target.value })
                    }
                    />
                    <input
                    type="text"
                    placeholder="Number"
                    className="w-full p-2 mb-4 border rounded-lg"
                    value={newProfessor.number}
                    onChange={(e) =>
                        setnewProfessor({ ...newProfessor, number: e.target.value })
                    }
                    />

                    {/* Courses Opted Section */}
                    <div className="mb-4">
                    <label className="block mb-2 font-medium">Courses Opted</label>
                    <div className="flex gap-2">
                        <input
                        type="text"
                        placeholder="Enter course code (e.g., AI2101)"
                        className="w-full p-2 border rounded-lg"
                        value={newCourse}
                        onChange={(e) => setNewCourse(e.target.value)}
                        />
                        <button
                        type="button"
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        onClick={() => {
                            if (newCourse.trim() !== '') {
                            setnewProfessor({
                                ...newProfessor,
                                courses: [...newProfessor.courses, newCourse.trim()],
                            });
                            setNewCourse(''); // Clear the input field
                            }
                        }}
                        >
                        Add
                        </button>
                    </div>
                    {/* Display the list of courses */}
                    {newProfessor.courses.length > 0 && (
                        <ul className="mt-2 list-disc pl-5 flex  gap-4 flex-wrap ">
                        {newProfessor.courses.map((course, index) => (
                            <li key={index} className="flex gap-2 items-center ">
                            <p className="bg-gray-200 p-2 rounded-md w-[100px] flex justify-center">
                                {course}
                            </p>
                            <button
                                type="button"
                                className="text-red-500 hover:underline text-sm"
                                onClick={() => {
                                setnewProfessor({
                                    ...newProfessor,
                                    courses: newProfessor.courses.filter(
                                    (c) => c !== course
                                    ),
                                });
                                }}
                            >
                                Remove
                            </button>
                            </li>
                        ))}
                        </ul>
                    )}
                    </div>

                    {/* Submit and Cancel Buttons */}
                    <div className="flex gap-3">
                    <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        onClick={handleAddprofessor}
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                        onClick={() => setIsAddModalOpen(false)}
                    >
                        Cancel
                    </button>
                    </div>
                </form>
                </div>
            </div>
            )}

{isEditModalOpen && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center font-kanit">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-2">
      <h3 className="text-2xl font-bold mb-4">Edit professor</h3>
      <form>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 mb-4 border rounded-lg"
          value={editProfessor.fullname}
          onChange={(e) =>
            seteditProfessor({ ...editProfessor, fullname: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Roll No"
          className="w-full p-2 mb-4 border rounded-lg"
          value={editProfessor.profCode}
          onChange={(e) =>
            seteditProfessor({ ...editProfessor, profCode: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Institute Mail ID"
          className="w-full p-2 mb-4 border rounded-lg"
          value={editProfessor.instituteMailId}
          onChange={(e) =>
            seteditProfessor({
              ...editProfessor,
              instituteMailId: e.target.value,
            })
          }
        />
        
        <input
          type="text"
          placeholder="Number"
          className="w-full p-2 mb-4 border rounded-lg"
          value={editProfessor.number}
          onChange={(e) =>
            seteditProfessor({ ...editProfessor, number: e.target.value })
          }
        />

        {/* Courses Opted Section */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Courses Opted</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter course code (e.g., AI2101)"
              className="w-full p-2 border rounded-lg"
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
            />
            <button
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              onClick={() => {
                if (newCourse.trim() !== '') {
                  seteditProfessor({
                    ...newProfessor,
                    courses: [...editProfessor.courses, newCourse.trim()],
                  });
                  setNewCourse(''); // Clear the input field
                }
              }}
            >
              Add
            </button>
          </div>
          {/* Display the list of courses */}
          {editProfessor.courses.length > 0 && (
            <ul className="mt-2 list-disc pl-5 flex  gap-4 flex-wrap ">
              {editProfessor.courses.map((course, index) => (
                <li key={index} className="flex gap-2 items-center ">
                  <p className="bg-gray-200 p-2 rounded-md w-[100px] flex justify-center">
                    {course}
                  </p>
                  <button
                    type="button"
                    className="text-red-500 hover:underline text-sm"
                    onClick={() => {
                        seteditProfessor({
                          ...editProfessor,
                          courses: editProfessor.courses.filter((_, idx) => idx !== index),
                        });
                      }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={handleeditProfessor}
          >
            Submit
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            onClick={() => setIsEditModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}



      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center font-kanit">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
              <p>Are you sure you want to delete this professor?</p>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"
                  onClick={handleDeleteprofessor}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default UpdateAttendance;
