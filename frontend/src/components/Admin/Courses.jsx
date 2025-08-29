import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function Courses() {
  const { user } = useSelector((store) => store.app);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    courseCode: '',
    hasLab: false,
    classTiming: [],
    labTiming: [],
  });
  const [error, setError] = useState('');
  const [classTiming, setClassTiming] = useState({ day: '', time: '' });
  const [labTiming, setLabTiming] = useState({ day: '', startTime: '', endTime: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [courseToDelete, setCourseToDelete] = useState(null);
const [courseToEdit, setCourseToEdit] = useState(null);


  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`${USER_API_END_POINT}/administration/courses/delete/${courseToDelete}`, {
        withCredentials: true,
      });
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== courseToDelete)
      );
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (courseId) => {
    setCourseToDelete(courseId);
    setIsDeleteModalOpen(true);
    
  };

 

const saveEditedCourse = async () => {
  setIsLoading(true);
  
  
  if (!courseToEdit?.name || !courseToEdit?.courseCode) {
    setError('Course name and course code are required.');
    return;
  }
  
  
  const courseToSubmit = {
    ...courseToEdit,
    labTiming: courseToEdit.hasLab ? courseToEdit.labTiming : [],
  };

  
  try {
    const response = await axios.post(
      `${USER_API_END_POINT}/administration/courses/update/${courseToEdit._id}`,
      courseToSubmit,
      { withCredentials: true }
    );
    if (response.data.success) {
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === courseToSubmit._id ? response.data.course : course
        )
      );
      setIsEditModalOpen(false);
    }
  } catch (error) {
    console.error('Error saving edited course:', error);
  } finally {
    setIsLoading(false);
  }
};

const handleEditClick = (course) => {
  
  setCourseToEdit(course);
  setIsEditModalOpen(true);
  
};

  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(
            `${USER_API_END_POINT}/administration/courses`,
            { withCredentials: true }
          );
          setCourses(response.data.courses);
          
          
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching courses data:', error);
        navigate('/');
      }
    };

    fetchCourses();
  }, [user, navigate]);

  // Handle adding a new course
  const handleAddCourse = async () => {
    if (!newCourse?.name || !newCourse?.courseCode) {
      setError('Course name and course code are required.');
      return;
    }

    const courseToSubmit = {
      ...newCourse,
      labTiming: newCourse.hasLab ? newCourse?.labTiming : [],
    };

    try {
      
      
      const response = await axios.post(
        `${USER_API_END_POINT}/administration/courses/register`,
        courseToSubmit,
        { withCredentials: true }
      );
      if (response.data.success) {
        setCourses((prevCourses) => [...prevCourses, courseToSubmit]);
       
        
        setIsModalOpen(false);
        setNewCourse({
          name: '',
          courseCode: '',
          hasLab: false,
          classTiming: [],
          labTiming: [],
        });
        setError('');
        window.location.reload()
      }
    } catch (error) {
      console.error('Error adding course:', error);
      setError('Failed to add course. Please try again later.');
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 24-hour format to 12-hour format
    return `${formattedHours}:${minutes} ${period}`;
  };

   // Add class timing
   const addClassTiming = (data) => {
    if (classTiming.day && classTiming.time) {
      data((prev) => ({
        ...prev,
        classTiming: [
          ...prev.classTiming,
          {
            day: classTiming.day,
            time: formatTime(classTiming.time), // Format time to include space before AM/PM
          },
        ],
      }));
      setClassTiming({ day: '', time: '' }); // Reset form after adding
    }
  };

const addLabTiming = (data) => {

  if (labTiming?.day && labTiming?.startTime && labTiming?.endTime) {
    
    data((prev) => ({
      ...prev,
      labTiming: [
        ...prev.labTiming,
        {
          day: labTiming?.day,
          startTime: formatTime(labTiming?.startTime),
          endTime: formatTime(labTiming?.endTime),
        },
      ],
    }));
    setLabTiming({ day: '', startTime: '', endTime: '' }); // Reset form after adding
  }
  else{
    toast.error("Fill all the section of Lab Timing");
  }
};

const removeClassTiming = (index,data) => {
  data((prev) => ({
    ...prev,
    classTiming: prev.classTiming.filter((_, i) => i !== index),
  }));
};

const removeLabTiming = (index,data) => {
  data((prev) => ({
    ...prev,
    labTiming: prev.labTiming?.filter((_, i) => i !== index),
  }));
};

  // Filter courses based on the search term
  const filteredCourses = courses.filter((course) =>
    course?.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 font-kanit">
        <div className="flex justify-between items-center mb-10 mt-10 md:mt-6">
        <div className='border-b-4 border-gray-900'>
          <h2 className="text-3xl font-extrabold text-[#121A27] md:text-4xl">Courses</h2>
        </div>
        
          <input
            type="text"
            placeholder="Search by Course Code"
            className="p-2 border rounded-lg w-1/3 text-md font-kanit shadow-md focus:outline-none focus:ring-2 focus:ring-[#333945]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
          >
            Add Course
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredCourses.map((course) => (
    <div
      key={course._id}
      className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
    >
      {/* Course Details */}
      <div>
        <h3 className="text-xl font-semibold text-[#121A27]">{course?.name}</h3>
        <p className="text-gray-600 text-sm">{course?.courseCode}</p>
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-4">
        <button
          className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all"
          onClick={() => handleEditClick(course)}
        >
          Edit
        </button>
        <button
          className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition-all"
          onClick={() => handleDeleteClick(course._id)}
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>

      </div>

      {/* Add Course Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center font-kanit"
          onClick={(e) => {
            if (e.target.classList.contains('bg-gray-900')) {
              setIsModalOpen(false);
            }
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-2xl font-bold mb-4">Add New Course</h3>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form>
              <input
                type="text"
                placeholder="Course Name"
                className="w-full p-2 mb-4 border rounded-lg"
                value={newCourse.name}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Course Code"
                className="w-full p-2 mb-4 border rounded-lg"
                value={newCourse?.courseCode}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, courseCode: e.target.value })
                }
              />
             

              {/* Add Class Timings */}
              <div className="mb-4">
                <h4 className="font-medium mb-2">Class Timings</h4>
                <div className="flex gap-2 mb-2">
                  <select
                    className="p-2 border rounded-lg flex-1"
                    value={classTiming.day}
                    onChange={(e) =>
                      setClassTiming({ ...classTiming, day: e.target.value })
                    }
                  >
                    <option value="">Select Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                  <input
                    type="time"
                    className="p-2 border rounded-lg flex-1"
                    value={classTiming.time}
                    onChange={(e) =>
                      setClassTiming({ ...classTiming, time: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg"
                    onClick={()=>{addClassTiming(setNewCourse)}
                    }
                  >
                    Add
                  </button>
                </div>
                <ul className="list-disc pl-5">
                  {newCourse.classTiming.map((timing, index) => (
                    <li key={index} className='flex justify-between items-center'>
                      {timing.day} - {timing.time}
                      <button
                      type="button"
                      className="text-red-500"
                      onClick={() => removeClassTiming(index,setNewCourse)}
                    >
                      Remove
                    </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium">
                  Has Lab?
                  <input
                    type="checkbox"
                    className="ml-2"
                    checked={newCourse.hasLab}
                    onChange={(e) =>{
                      setNewCourse({ ...newCourse, hasLab: e.target.checked }
                      )
                      }
                    }
                  />
                </label>
              </div>

              {/* Add Lab Timings */}
              {newCourse.hasLab && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Lab Timings</h4>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <select
                      className="p-2 border rounded-lg"
                      value={labTiming?.day}
                      onChange={(e) => setLabTiming({ ...labTiming, day: e.target.value })}
                    >
                      <option value="">Select Day</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                    </select>
                    <input
                      type="time"
                      className="p-2 border rounded-lg"
                      value={labTiming?.startTime}
                      onChange={(e) =>
                        setLabTiming({ ...labTiming, startTime: e.target.value })
                      }
                    />
                    <input
                      type="time"
                      className="p-2 border rounded-lg"
                      value={labTiming?.endTime}
                      onChange={(e) =>
                        setLabTiming({ ...labTiming, endTime: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="col-span-3 bg-green-500 text-white px-4 py-2 rounded-lg"
                      onClick={()=>addLabTiming(setNewCourse)}
                    >
                      Add Timing
                    </button>
                  </div>
                  <ul className="list-disc pl-5">
                    {newCourse.labTiming?.map((timing, index) => (
                      <li key={index} className='flex justify-between items-center'>
                        {timing.day} - {timing.startTime} to {timing.endTime}
                        <button
                        type="button"
                        className="text-red-500"
                        onClick={() => removeLabTiming(index,setNewCourse)}
                      >
                        Remove
                      </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              

              <div className="flex gap-3">
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  onClick={handleAddCourse}
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center font-kanit">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                <p>Are you sure you want to delete this course?</p>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

{isEditModalOpen && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center font-kanit">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
      <h3 className="text-xl font-bold mb-4">Edit Course</h3>
      <form>
        <input
          type="text"
          placeholder="Course Name"
          className="w-full p-2 mb-4 border rounded-lg"
          value={courseToEdit?.name || ''}
          onChange={(e) =>
            setCourseToEdit((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Course Code"
          className="w-full p-2 mb-4 border rounded-lg"
          value={courseToEdit?.courseCode || ''}
          onChange={(e) =>
            setCourseToEdit((prev) => ({ ...prev, courseCode: e.target.value }))
          }
        />
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Has Lab?
            <input
              type="checkbox"
              className="ml-2"
              checked={courseToEdit?.hasLab || false}
              onChange={(e) =>
                setCourseToEdit((prev) => ({
                  ...prev,
                  hasLab: e.target.checked,
                  labTiming: e.target.checked ? prev.labTiming : [],
                }))
              }
            />
          </label>
        </div>
        <div className="mb-4">
          <h4 className="font-medium mb-2">Class Timings</h4>
          <div className="flex gap-2 mb-2">
            <select
              className="p-2 border rounded-lg flex-1"
              value={classTiming.day}
              onChange={(e) =>
                setClassTiming({ ...classTiming, day: e.target.value })
              }
            >
              <option value="">Select Day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
            </select>
            <input
              type="time"
              className="p-2 border rounded-lg flex-1"
              value={classTiming.time}
              onChange={(e) =>
                setClassTiming({ ...classTiming, time: e.target.value })
              }
            />
            <button
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
              onClick={()=>addClassTiming(setCourseToEdit)}
            >
              Add
            </button>
          </div>
          <ul className="list-disc pl-5">
            {courseToEdit?.classTiming?.map((timing, index) => (
              <li key={index} className="flex justify-between items-center">
                {timing.day} - {timing.time}
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => removeClassTiming(index,setCourseToEdit)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        {courseToEdit?.hasLab && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Lab Timings</h4>
            <div className="flex gap-2 mb-2">
              <select
                className="p-2 border rounded-lg flex-1"
                value={labTiming?.day}
                onChange={(e) =>
                  setLabTiming({ ...labTiming, day: e.target.value })
                }
              >
                <option value="">Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
              <input
                type="time"
                className="p-2 border rounded-lg flex-1"
                value={labTiming?.startTime}
                onChange={(e) =>
                  setLabTiming({ ...labTiming, startTime: e.target.value })
                }
              />
              <input
                type="time"
                className="p-2 border rounded-lg flex-1"
                value={labTiming?.endTime}
                onChange={(e) =>{
                  setLabTiming({ ...labTiming, endTime: e.target.value });
                  }
                }
              />
              <button
                type="button"
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
                onClick={()=>addLabTiming(setCourseToEdit)}
              >
                Add
              </button>
            </div>
            <ul className="list-disc pl-5">
              {courseToEdit?.labTiming?.map((timing, index) => (
                <li key={index} className="flex justify-between items-center">
                  {timing.day} - {timing.startTime} to {timing.endTime}
                  
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={() => removeLabTiming(index,setCourseToEdit)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={saveEditedCourse}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsEditModalOpen(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}

export default Courses;
