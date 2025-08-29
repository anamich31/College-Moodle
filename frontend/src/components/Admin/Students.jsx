import React, { useEffect, useState } from 'react';
import Sidebar from './SideBar';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import LoadingSpinner from '../LoadingSpinner';

function UpdateAttendance() {
    const { user } = useSelector((store) => store.app);
   
    const navigate = useNavigate();
  
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
  
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [loading,setLoading]=useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddLoading, setIsAddLoading] = useState(false);
  
    const [newStudent, setNewStudent] = useState({
      fullname: '',
      rollNo: '',
      password: '',
      instituteMailId: '',
      number: '',
      coursesOpted: [],
    });
  
    const [editStudent, setEditStudent] = useState({
        fullname: '',
        rollNo: '',
        instituteMailId: '',
        number: '',
        coursesOpted: [],
      });
    const [newCourse, setNewCourse] = useState('');
  
    useEffect(() => {
      setLoading(true)
      const fetchStudents = async () => {
        try {
          if (user && user._id) {
            const response = await axios.get(
              `${USER_API_END_POINT}/administration/students`,
              { withCredentials: true }
            );
            setStudents(response.data.students);
            setFilteredStudents(response.data.students);
          } else {
            navigate('/');
          }
        } catch (error) {
          console.error('Error fetching student data:', error);
          navigate('/');
        } finally{
          setLoading(false)
        }
      };
  
      fetchStudents();
    }, [user, navigate]);
  
    const handleSearchChange = (e) => {
      const query = e.target.value.toLowerCase();
      setSearchQuery(query);
      const filtered = students.filter((std) =>
        std.rollNo.toLowerCase().includes(query)
      );
      setFilteredStudents(filtered);
    };
  
    const handleAddStudent = async () => {
      setIsAddLoading(true); // Show loader
      try {
        const response = await axios.post(
          `${USER_API_END_POINT}/administration/students/register`,
          newStudent,
          { withCredentials: true }
        );
        if (response.data.success) {
          const updatedStudents = [...students, response.data.student];
          setStudents(updatedStudents);
          setFilteredStudents(updatedStudents);
          setIsAddModalOpen(false);
          toast.success('Student added successfully!');
          window.location.reload();
        }
      } catch (error) {
        console.error('Error adding student:', error);
        toast.error(error.response?.data?.message || 'Failed to add student.');
        
        
      } finally {
        setIsAddLoading(false); // Hide loader
      }
    };
  
    const handleDeleteStudent = async () => {
      setIsLoading(true); // Show loader
      try {
        const response = await axios.delete(
          `${USER_API_END_POINT}/administration/students/delete/${studentToDelete._id}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setStudents(students.filter((std) => std._id !== studentToDelete._id));
          setFilteredStudents(filteredStudents.filter((std) => std._id !== studentToDelete._id));
          setIsDeleteModalOpen(false);
          toast.success('Student deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        toast.error('Failed to delete student. Please try again.');
      } finally {
        setIsLoading(false); // Hide loader
      }
    };
  
    const handleEditStudent = async () => {
      try {
        const response = await axios.post(
          `${USER_API_END_POINT}/administration/students/update/${editStudent._id}`,
          editStudent,
          { withCredentials: true }
        );
        if (response.data.success) {
          const updatedStudents = students.map((std) =>
            std._id === editStudent._id ? response.data.student : std
          );
          setStudents(updatedStudents);
          setFilteredStudents(updatedStudents);
          setIsEditModalOpen(false);
          toast.success('Student updated successfully!');
          window.location.reload();
        }
      } catch (error) {
        console.error('Error editing student:', error);
        toast.error('Failed to update student.');
      }
    };
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex flex-col w-full p-6 font-kanit">
        {/* Add Student Button */}
        <div className="flex justify-between items-center mb-6">
        <div className='border-b-4 border-gray-900'>
          <h2 className="text-3xl font-extrabold text-[#121A27] md:text-4xl mt-10 md:mt-6">Students</h2>
          </div>
          <button
            className="flex items-center justify-center bg-gray-900 text-white p-2 rounded-lg shadow-lg hover:bg-gray-800"
            onClick={() => setIsAddModalOpen(true)}
          >
            <span className="text-lg font-medium"> Add Student</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-56 md:w-60 lg:w-96 mb-10">
          <input
            type="text"
            placeholder="Search Roll No..."
            className="w-full h-12 px-4 text-md font-kanit border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#333945]"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {loading ? <LoadingSpinner/> : 
         <div className="flex flex-wrap gap-6">
             {filteredStudents.length > 0 ? (
              filteredStudents.map((student, idx) => (
                <div
                  key={idx}
                  className="w-full sm:w-1/2 lg:w-1/3 p-5 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                >
                  {/* Student Info */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-lg font-bold text-[#121A27]">{student?.fullname}</p>
                      <p className="text-sm text-gray-500">{student?.rollNo}</p>
                    </div>
                  </div>
          
                  {/* Actions */}
                  <div className="flex justify-between items-center mt-4">
                    <button
                      className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all"
                      onClick={() => {
                        setIsEditModalOpen(true);
                        setEditStudent(student);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition-all"
                      onClick={() => {
                        setStudentToDelete(student);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center w-full">No students found</p>
            )}
          </div>
        }    
        {/* Student Cards */}
       

      </div>

      {/* Add Student Modal */}
      {/* Add Student Modal */}
            {isAddModalOpen && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center font-kanit">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h3 className="text-2xl font-bold mb-4">Add Student</h3>
                <form>
                    <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-2 mb-4 border rounded-lg"
                    value={newStudent.fullname}
                    onChange={(e) =>
                        setNewStudent({ ...newStudent, fullname: e.target.value })
                    }
                    />
                    <input
                    type="text"
                    placeholder="Roll No"
                    className="w-full p-2 mb-4 border rounded-lg"
                    value={newStudent.rollNo}
                    onChange={(e) =>
                        setNewStudent({ ...newStudent, rollNo: e.target.value })
                    }
                    />
                    <input
                    type="email"
                    placeholder="Institute Mail ID"
                    className="w-full p-2 mb-4 border rounded-lg"
                    value={newStudent.instituteMailId}
                    onChange={(e) =>
                        setNewStudent({
                        ...newStudent,
                        instituteMailId: e.target.value,
                        })
                    }
                    />
                    <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 mb-4 border rounded-lg"
                    value={newStudent.password}
                    onChange={(e) =>
                        setNewStudent({ ...newStudent, password: e.target.value })
                    }
                    />
                    <input
                    type="text"
                    placeholder="Number"
                    className="w-full p-2 mb-4 border rounded-lg"
                    value={newStudent.number}
                    onChange={(e) =>
                        setNewStudent({ ...newStudent, number: e.target.value })
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
                            setNewStudent({
                                ...newStudent,
                                coursesOpted: [...newStudent.coursesOpted, newCourse.trim()],
                            });
                            setNewCourse(''); // Clear the input field
                            }
                        }}
                        >
                        Add
                        </button>
                    </div>
                    {/* Display the list of courses */}
                    {newStudent.coursesOpted.length > 0 && (
                        <ul className="mt-2 list-disc pl-5 flex  gap-4 flex-wrap ">
                        {newStudent.coursesOpted.map((course, index) => (
                            <li key={index} className="flex gap-2 items-center ">
                            <p className="bg-gray-200 p-2 rounded-md w-[100px] flex justify-center">
                                {course}
                            </p>
                            <button
                                type="button"
                                className="text-red-500 hover:underline text-sm"
                                onClick={() => {
                                setNewStudent({
                                    ...newStudent,
                                    coursesOpted: newStudent.coursesOpted.filter(
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
                        onClick={handleAddStudent}
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
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center font-kanit ">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-2">
      <h3 className="text-2xl font-bold mb-4">Edit Student</h3>
      <form>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 mb-4 border rounded-lg"
          value={editStudent.fullname}
          onChange={(e) =>
            setEditStudent({ ...editStudent, fullname: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Roll No"
          className="w-full p-2 mb-4 border rounded-lg"
          value={editStudent.rollNo}
          onChange={(e) =>
            setEditStudent({ ...editStudent, rollNo: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Institute Mail ID"
          className="w-full p-2 mb-4 border rounded-lg"
          value={editStudent.instituteMailId}
          onChange={(e) =>
            setEditStudent({
              ...editStudent,
              instituteMailId: e.target.value,
            })
          }
        />
        
        <input
          type="text"
          placeholder="Number"
          className="w-full p-2 mb-4 border rounded-lg"
          value={editStudent.number}
          onChange={(e) =>
            setEditStudent({ ...editStudent, number: e.target.value })
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
                  setEditStudent({
                    ...newStudent,
                    coursesOpted: [...editStudent.coursesOpted, newCourse.trim()],
                  });
                  setNewCourse(''); // Clear the input field
                }
              }}
            >
              Add
            </button>
          </div>
          {/* Display the list of courses */}
          {editStudent.coursesOpted.length > 0 && (
            <ul className="mt-2 list-disc pl-5 flex  gap-4 flex-wrap ">
              {editStudent.coursesOpted.map((course, index) => (
                <li key={index} className="flex gap-2 items-center ">
                  <p className="bg-gray-200 p-2 rounded-md w-[100px] flex justify-center">
                    {course}
                  </p>
                  <button
                    type="button"
                    className="text-red-500 hover:underline text-sm"
                    onClick={() => {
                        setEditStudent({
                            ...editStudent,
                            coursesOpted: [...editStudent.coursesOpted, newCourse.trim()],
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
            onClick={handleEditStudent}
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
              <p>Are you sure you want to delete this student?</p>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"
                  onClick={handleDeleteStudent}
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
