import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSignOutAlt, FaBars } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "@/utils/constant";
import { logoutUser } from "@/redux/appSlice";

const Sidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((store) => store.app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      dispatch(logoutUser());
      localStorage.removeItem("user");
      navigate("/");
      console.log("Logout successful");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path)
      ? "bg-[#333945] text-white"
      : "text-gray-400 hover:bg-[#333945] hover:text-white";
  };

  if (!user) return null;

  const sidebarLinks = role === "professor"
    ? [
        { to: "/professor", icon: <IoMdHome size={20} />, label: "Home" },
        { to: "/professor/courses", icon: <IoMdHome size={20} />, label: "Courses" },
        { to: "/professor/addextraclass", icon: <IoMdHome size={20} />, label: "Add Extra Class" },
        { to: "/professor/changepassword", icon: <RiLockPasswordFill size={20} />, label: "Change Password" },
      ]
    : [
        { to: "/administration", icon: <IoMdHome size={20} />, label: "Home" },
        { to: "/administration/changepassword", icon: <RiLockPasswordFill size={20} />, label: "Change Password" },
      ];

  return (
    <div className="relative">
      {/* Hamburger Icon */}
      <button
        className="md:hidden absolute top-4 left-4 z-50 p-2 rounded-md bg-gray-50 shadow-md"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        <FaBars size={24} className="text-[#121A27]" />
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:translate-x-0 md:static top-0 left-0 min-h-full w-64 bg-[#121A27] flex flex-col shadow-lg transform transition-transform duration-300 z-40`}
      >
        {/* Sidebar Links */}
        <nav className="flex-1 space-y-4 pt-40 mt-4 md:pt-0 px-3">
          {sidebarLinks.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-4 p-3 rounded-md ${isActive(to)}`}
              onClick={() => isOpen && toggleSidebar()}
            >
              {icon}
              <span className="text-sm font-semibold font-kanit">{label}</span>
            </Link>
          ))}

          <div onClick={handleLogout}>
            <Link
              to="/"
              className="flex items-center gap-4 p-3 hover:bg-[#333945] hover:text-white rounded-md"
            >
              <FaSignOutAlt size={20} className="text-white" />
              <span className="text-sm font-semibold text-white font-kanit">Logout</span>
            </Link>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-sm text-gray-400">&copy; 2024 Academic Portal</p>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default Sidebar;
