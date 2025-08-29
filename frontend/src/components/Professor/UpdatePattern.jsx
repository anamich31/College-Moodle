import React, { useEffect, useState } from 'react';
import Sidebar from './SideBar';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { USER_API_END_POINT } from '@/utils/constant';
import { Button } from '../ui/button';
import { NotepadText, Trash } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';

function UpdatePattern() {
  const { user } = useSelector((store) => store.app);
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pattern, setPattern] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', weightage: '', note: '' });
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    const fetchPattern = async () => {
      setLoading(true);
      try {
        if (user && user._id) {
          const response = await axios.get(
            `${USER_API_END_POINT}/professor/courses/${courseCode}/updatepattern`,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    if (!formData.name || !formData.weightage) {
      alert('Name and Weightage are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/professor/courses/${courseCode}/updatepattern`,
        { pattern: formData },
        { withCredentials: true }
      );
      setPattern((prev) => [...prev, formData]);
      setFormData({ name: '', weightage: '', note: '' });
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error('Error updating pattern:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to update pattern.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (patternId) => {
    setDeleteLoading(patternId);
    try {
      await axios.delete(
        `${USER_API_END_POINT}/professor/courses/${courseCode}/updatepattern/${patternId}`,
        { withCredentials: true }
      );
      setPattern((prev) => prev.filter((item) => item._id !== patternId));
    } catch (error) {
      console.error('Error deleting pattern:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to delete pattern.'); 
    } finally{
      setDeleteLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex flex-col w-full p-6">
        <div className="mb-6">
          <h2 className="text-[40px] font-bold font-kanit text-[#121A27] border-b-4 border-gray-500 pb-2 mt-14 md:mt-6">Pattern</h2>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="mt-6">
            {pattern.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lx:grid-cols-3 gap-4">
                {pattern.map((item) => (
                  <div
                    key={item._id}
                    className={`p-6 border rounded-lg shadow-lg bg-white flex flex-col gap-2 transform hover:scale-105 transition-transform duration-200 font-kanit ${getBgColor(item.name)}`}
                  >
                    <div className='flex justify-between'>
                      <div className='flex gap-2 items-center'>
                        <NotepadText className='font-semibold text-black' />
                        <p className="text-[22px] font-bold text-gray-700">{item.name}</p>
                      </div>
                      <Button onClick={() => navigate(`/professor/courses/${courseCode}/${item._id}`)}>Update Marks</Button>
                    </div>
                    <p className="text-md text-gray-600">
                      <span className="font-semibold">Weightage:</span> {item.weightage}%
                    </p>
                    {item?.note && <p className="text-sm text-gray-600">
                      <span className="font-semibold">Note:</span> {item.note || 'No note provided'}
                    </p>}
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="mt-2 text-red-500 hover:text-red-700 flex items-center"
                      disabled={deleteLoading === item._id}
                    >
                      {deleteLoading === item._id ? <LoadingSpinner size={16} /> : <Trash className="inline-block mr-1" />}
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No patterns added yet.</p>
            )}
          </div>
        )}

        <div
          onClick={() => setIsUploadModalOpen(true)}
          className="mt-10 w-40 h-40 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors flex-col"
        >
          <span className="text-gray-400 text-4xl">+</span>
          <p className="text-gray-400 text-sm">Add Pattern</p>
        </div>

        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogContent className="p-6 rounded-xl shadow-lg bg-white">
            <DialogHeader>
              <DialogTitle className="text-[28px] font-bold font-kanit text-[#121A27]">
                Add Pattern
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5 mt-2 font-kanit">
              {/* Name Selection */}
              <div>
                <label className="block text-lg font-semibold text-[#121A27] mb-2">Name</label>
                <select
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select Name
                  </option>
                  <option value="Quiz">Quiz</option>
                  <option value="Presentation">Presentation</option>
                  <option value="Mid-Sem Exam">Mid-Sem Exam</option>
                  <option value="End-Sem Exam">End-Sem Exam</option>
                </select>
              </div>

              {/* Weightage Input */}
              <div>
                <label className="block text-lg font-semibold text-[#121A27] mb-2">Weightage</label>
                <input
                  type="number"
                  name="weightage"
                  value={formData.weightage}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter weightage %"
                />
              </div>

              {/* Note Input */}
              <div>
                <label className="block text-lg font-semibold text-[#121A27] mb-2">Note</label>
                <input
                  type="text"
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional note"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-5 py-2 text-[#121A27] bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFormSubmit}
                  className="px-5 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}

export default UpdatePattern;
