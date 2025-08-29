import React, { useState } from 'react';
import Sidebar from './SideBar';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';

function ChangePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 5) {
      alert('Password must be at least 5 characters long!');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/student/changepassword`,
        { password },
        { withCredentials: true }
      );
      
      setPassword('');
      setConfirmPassword('');
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error changing password:', error.response?.data || error.message);
      
      toast.error(error.message);
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
      Change Password
    </h2>

    {/* Form */}
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 shadow-md rounded-xl font-kanit">
      {/* New Password Field */}
      <div className="mb-6">
        <label htmlFor="password" className="block font-medium text-gray-700 mb-2">
          New Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        {password && password.length < 5 && (
          <p className="text-red-500 text-sm mt-1">Password must be at least 5 characters long.</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="mb-6">
        <label htmlFor="confirmPassword" className="block font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <button
          type="reset"
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          onClick={() => {
            setPassword('');
            setConfirmPassword('');
          }}
        >
          Reset
        </button>
        <button
          type="submit"
          className={`px-4 py-2 text-white rounded-lg ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#121A27] hover:bg-[#27364B] focus:ring-2 focus:ring-gray-500'
          }`}
          disabled={loading}
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </div>
    </form>
  </div>
</div>


  );
}

export default ChangePassword;
